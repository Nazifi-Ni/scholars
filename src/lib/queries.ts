import { queryOptions } from "@tanstack/react-query";
import {
  getHomeData,
  searchOpportunities,
  getFilterOptions,
  getOpportunityBySlug,
  getBlogPosts,
  getBlogPostBySlug,
  getFaqs,
} from "@/lib/public.functions";
import type { SearchFilters } from "@/lib/sc-shared";

export const homeQuery = queryOptions({
  queryKey: ["home"],
  queryFn: () => getHomeData(),
  staleTime: 60_000,
});

export const searchQuery = (filters: SearchFilters) =>
  queryOptions({
    queryKey: ["opportunities", filters],
    queryFn: () => searchOpportunities({ data: filters }),
    staleTime: 30_000,
  });

export const filterOptionsQuery = queryOptions({
  queryKey: ["filter-options"],
  queryFn: () => getFilterOptions(),
  staleTime: 300_000,
});

export const opportunityQuery = (slug: string) =>
  queryOptions({
    queryKey: ["opportunity", slug],
    queryFn: () => getOpportunityBySlug({ data: { slug } }),
    staleTime: 60_000,
  });

export const blogListQuery = queryOptions({
  queryKey: ["blog"],
  queryFn: () => getBlogPosts(),
  staleTime: 60_000,
});

export const blogPostQuery = (slug: string) =>
  queryOptions({
    queryKey: ["blog", slug],
    queryFn: () => getBlogPostBySlug({ data: { slug } }),
    staleTime: 60_000,
  });

export const faqsQuery = queryOptions({
  queryKey: ["faqs"],
  queryFn: () => getFaqs(),
  staleTime: 300_000,
});