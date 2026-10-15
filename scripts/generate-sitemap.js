import fs from 'fs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function fetchWithRetry(url, options = {}, retries = 3, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
      console.warn(`[Sitemap] Attempt ${i + 1}/${retries} returned HTTP ${res.status} for ${url}`);
    } catch (err) {
      console.warn(`[Sitemap] Attempt ${i + 1}/${retries} failed for ${url}: ${err.message}`);
    }
    if (i < retries - 1) {
      console.log(`[Sitemap] Server may be sleeping, waiting ${delay / 1000}s before retry...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  return null;
}

async function generate() {
  console.log("Generating dynamic sitemap...");
  const API = "https://scholars-api.onrender.com/api";
  const BASE_URL = "https://www.scholarsconnect.com.ng";

  const staticRoutes = [
    { loc: `${BASE_URL}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${BASE_URL}/scholarships`, changefreq: 'daily', priority: '0.9' },
    { loc: `${BASE_URL}/internships`, changefreq: 'daily', priority: '0.8' },
    { loc: `${BASE_URL}/opportunities`, changefreq: 'daily', priority: '0.9' },
    { loc: `${BASE_URL}/blog`, changefreq: 'daily', priority: '0.8' },
    { loc: `${BASE_URL}/about`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${BASE_URL}/editorial-policy`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${BASE_URL}/how-we-verify-opportunities`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${BASE_URL}/affiliate-disclosure`, changefreq: 'monthly', priority: '0.6' },
    { loc: `${BASE_URL}/faq`, changefreq: 'monthly', priority: '0.6' },
    { loc: `${BASE_URL}/contact`, changefreq: 'monthly', priority: '0.6' },
    { loc: `${BASE_URL}/privacy`, changefreq: 'monthly', priority: '0.5' },
    { loc: `${BASE_URL}/terms`, changefreq: 'monthly', priority: '0.5' },
    { loc: `${BASE_URL}/cookie-policy`, changefreq: 'monthly', priority: '0.5' },
    { loc: `${BASE_URL}/disclaimer`, changefreq: 'monthly', priority: '0.5' },
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static routes
  staticRoutes.forEach(r => {
    sitemap += `  <url><loc>${r.loc}</loc><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>\n`;
  });

  // Fetch All Opportunities across all pages
  let totalFetched = 0;
  try {
    let page = 0;
    let hasMore = true;

    while (hasMore) {
      const res = await fetchWithRetry(`${API}/opportunities/search?page=${page}`);
      if (!res || !res.ok) {
        console.warn(`Failed to fetch opportunities page ${page}`);
        break;
      }
      const data = await res.json();
      const items = data.items || [];
      if (items.length === 0) {
        hasMore = false;
        break;
      }

      items.forEach(opp => {
        if (opp.slug) {
          sitemap += `  <url><loc>${BASE_URL}/opportunities/${opp.slug}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
          totalFetched++;
        }
      });

      page++;
      if (totalFetched >= (data.count || 0) || items.length < (data.pageSize || 12)) {
        hasMore = false;
      }
    }
    console.log(`Successfully indexed ${totalFetched} opportunities in sitemap.`);
  } catch (e) {
    console.error("Error fetching opportunities for sitemap:", e);
  }

  // Fetch All Blog Posts
  try {
    const blogRes = await fetchWithRetry(`${API}/blog`);
    if (blogRes && blogRes.ok) {
      const blogData = await blogRes.json();
      const posts = blogData.posts || [];
      posts.forEach(post => {
        if (post.slug) {
          sitemap += `  <url><loc>${BASE_URL}/blog/${post.slug}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
        }
      });
      console.log(`Successfully indexed ${posts.length} blog posts in sitemap.`);
    }
  } catch (e) {
    console.error("Error fetching blog posts for sitemap:", e);
  }

  sitemap += `</urlset>\n`;

  // Safety guard: Never overwrite an existing sitemap with empty opportunities if API had an outage
  if (totalFetched === 0 && fs.existsSync('./public/sitemap.xml')) {
    const existing = fs.readFileSync('./public/sitemap.xml', 'utf-8');
    if (existing.includes('/opportunities/')) {
      console.warn("Safety Check: API returned 0 opportunities. Retaining existing sitemap to protect SEO indexing.");
      return;
    }
  }

  fs.writeFileSync('./public/sitemap.xml', sitemap);
  console.log("public/sitemap.xml written successfully!");
}

generate();
