import fs from 'fs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function generate() {
  console.log("Generating dynamic sitemap...");
  const API = "https://scholars-api.onrender.com/api";
  const BASE_URL = "https://scholarsconnect.com.ng";

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
  try {
    let page = 0;
    let totalFetched = 0;
    let hasMore = true;

    while (hasMore) {
      const res = await fetch(`${API}/opportunities/search?page=${page}`);
      if (!res.ok) {
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
    const blogRes = await fetch(`${API}/blog`);
    if (blogRes.ok) {
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

  fs.writeFileSync('./public/sitemap.xml', sitemap);
  console.log("public/sitemap.xml written successfully!");
}

generate();
