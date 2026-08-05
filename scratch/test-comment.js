const API_BASE_URL = "https://scholarsconnect.com.ng/api"; // Guessing the production API, wait, let's just use what's in .env or the real url.
// Actually, I can just fetch it:
fetch("https://scholarsconnect.com.ng/api/blog").then(r => r.json()).then(async data => {
  if (data.posts && data.posts.length > 0) {
    const slug = data.posts[0].slug;
    console.log("Posting to:", slug);
    const res = await fetch(`https://scholarsconnect.com.ng/api/blog/${slug}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ author_name: "Test", content: "Test comment" })
    });
    console.log("Status:", res.status);
    console.log("Response:", await res.text());
  } else {
    console.log("No posts found");
  }
}).catch(console.error);
