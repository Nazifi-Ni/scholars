import fs from 'fs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function generate() {
    console.log("Generating sitemap...");
    const API = "https://scholars-api.onrender.com/api";
    const BASE_URL = "https://www.scholarsconnect.com.ng";

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static routes -->
  <url><loc>${BASE_URL}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${BASE_URL}/scholarships</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>${BASE_URL}/internships</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>${BASE_URL}/blog</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>${BASE_URL}/opportunities</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>${BASE_URL}/about</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>${BASE_URL}/contact</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>${BASE_URL}/privacy</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>${BASE_URL}/terms</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
`;

    // Fetch Opportunities
    try {
        const oppRes = await fetch(`${API}/opportunities/search`);
        if (oppRes.ok) {
            const oppData = await oppRes.json();
            // Assuming the API returns paginated data under .data, or directly as an array
            const opps = oppData.data || oppData;
            opps.forEach(opp => {
                if(opp.slug) sitemap += `  <url><loc>${BASE_URL}/opportunities/${opp.slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
            });
            console.log(`Added ${opps.length} opportunities`);
        }
    } catch (e) {
        console.error("Error fetching opportunities", e);
    }

    // Fetch Blogs
    try {
        const blogRes = await fetch(`${API}/blog`);
        if (blogRes.ok) {
            const blogData = await blogRes.json();
            blogData.posts.forEach(post => {
                sitemap += `  <url><loc>${BASE_URL}/blog/${post.slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
            });
            console.log(`Added ${blogData.posts.length} blog posts`);
        }
    } catch (e) {
        console.error("Error fetching blogs", e);
    }

    sitemap += `</urlset>`;

    fs.writeFileSync('./public/sitemap.xml', sitemap);
    console.log("Sitemap generated successfully!");
}

generate();
