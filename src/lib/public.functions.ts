import { createServerFn } from "@tanstack/react-start";
import { OPP_CARD_SELECT, OPP_FULL_SELECT, type SearchFilters } from "@/lib/sc-shared";

const API_BASE_URL = process.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

export const getHomeData = createServerFn({ method: "GET" }).handler(async () => {
  const response = await fetch(`${API_BASE_URL}/home`);
  if (!response.ok) throw new Error("Failed to fetch home data");
  return response.json();
});

export const searchOpportunities = createServerFn({ method: "GET" })
  .inputValidator((input: SearchFilters) => {
    const clean: SearchFilters = {};
    if (typeof input.q === "string") clean.q = input.q.slice(0, 200);
    for (const k of ["type", "category", "country", "funding", "degree", "sort"] as const) {
      const v = input[k];
      if (typeof v === "string" && /^[a-z0-9_-]{1,60}$/i.test(v)) clean[k] = v;
    }
    clean.page = Math.max(0, Math.min(500, Number(input.page) || 0));
    return clean;
  })
  .handler(async ({ data }) => {
    const queryParams = new URLSearchParams();
    if (data.q) queryParams.set("q", data.q);
    if (data.type) queryParams.set("type", data.type);
    if (data.funding) queryParams.set("funding", data.funding);
    if (data.degree) queryParams.set("degree", data.degree);
    if (data.category) queryParams.set("category", data.category);
    if (data.country) queryParams.set("country", data.country);
    if (data.sort) queryParams.set("sort", data.sort);
    if (data.page !== undefined) queryParams.set("page", (data.page + 1).toString()); // Laravel pagination is 1-indexed

    const response = await fetch(`${API_BASE_URL}/opportunities/search?${queryParams.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch opportunities");
    return response.json();
  });

export const getFilterOptions = createServerFn({ method: "GET" }).handler(async () => {
  const response = await fetch(`${API_BASE_URL}/filters`);
  if (!response.ok) throw new Error("Failed to fetch filters");
  return response.json();
});

export const getOpportunityBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => {
    if (typeof input.slug !== "string" || !/^[a-z0-9-._]{1,120}$/i.test(input.slug)) throw new Error("Invalid slug");
    return { slug: input.slug };
  })
  .handler(async ({ data }) => {
    const response = await fetch(`${API_BASE_URL}/opportunities/${data.slug}`);
    if (response.status === 404) return { opportunity: null, related: [], images: [] };
    if (!response.ok) throw new Error("Failed to fetch opportunity");
    return response.json();
  });

export const getBlogPosts = createServerFn({ method: "GET" }).handler(async () => {
  const response = await fetch(`${API_BASE_URL}/blog`);
  if (!response.ok) throw new Error("Failed to fetch blog posts");
  return response.json();
});

export const getBlogPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => {
    if (typeof input.slug !== "string" || !/^[a-z0-9-._]{1,120}$/i.test(input.slug)) throw new Error("Invalid slug");
    return { slug: input.slug };
  })
  .handler(async ({ data }) => {
    const response = await fetch(`${API_BASE_URL}/blog/${data.slug}`);
    if (response.status === 404) return { post: null, related: [] };
    if (!response.ok) throw new Error("Failed to fetch blog post");
    return response.json();
  });

export const getFaqs = createServerFn({ method: "GET" }).handler(async () => {
  const response = await fetch(`${API_BASE_URL}/faqs`);
  if (!response.ok) throw new Error("Failed to fetch FAQs");
  return response.json();
});

export async function addBlogComment(slug: string, data: { author_name: string; content: string }) {
  const res = await fetch(`${API_BASE_URL}/blog/${slug}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to post comment");
  return res.json();
}