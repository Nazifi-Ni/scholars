// Shared constants & types for ScholarsConnect data layer.
// Kept in its own module so server-function handlers can import them
// (handlers must not reference module-scope siblings in the same file).

export const OPP_CARD_SELECT =
  "id, title, slug, summary, opportunity_type, funding_type, degree_levels, deadline, featured_image, is_verified, is_featured, views_count, bookmarks_count, scholar_rating, created_at, category:categories(name,slug), country:countries(name,slug,flag_emoji), university:universities(name,slug), organization:organizations(name,slug)";

export const OPP_FULL_SELECT =
  "*, category:categories(name,slug), country:countries(name,slug,flag_emoji), university:universities(name,slug,website), organization:organizations(name,slug,website)";

export interface OpportunityCardData {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  opportunity_type: string;
  funding_type: string;
  degree_levels: string[];
  deadline: string | null;
  featured_image: string | null;
  is_verified: boolean;
  is_featured: boolean;
  views_count: number;
  bookmarks_count: number;
  scholar_rating: number | null;
  created_at: string;
  category: { name: string; slug: string } | null;
  country: { name: string; slug: string; flag_emoji: string | null } | null;
  university: { name: string; slug: string } | null;
  organization: { name: string; slug: string } | null;
}

export interface SearchFilters {
  q?: string;
  type?: string;
  category?: string;
  country?: string;
  funding?: string;
  degree?: string;
  sort?: string;
  page?: number;
}

export const OPPORTUNITY_TYPES = [
  { value: "scholarship", label: "Scholarships" },
  { value: "internship", label: "Internships" },
  { value: "competition", label: "Competitions" },
  { value: "hackathon", label: "Hackathons" },
  { value: "grant", label: "Grants" },
  { value: "job", label: "Jobs" },
  { value: "course", label: "Courses" },
] as const;

export const FUNDING_TYPES = [
  { value: "fully_funded", label: "Fully Funded" },
  { value: "partially_funded", label: "Partial Funding" },
  { value: "paid", label: "Paid" },
  { value: "unpaid", label: "Unpaid" },
] as const;

export const DEGREE_LEVELS = [
  { value: "high_school", label: "High School" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "masters", label: "Masters" },
  { value: "phd", label: "PhD" },
  { value: "postdoc", label: "Postdoc" },
] as const;

export function fundingLabel(v: string) {
  return FUNDING_TYPES.find((f) => f.value === v)?.label ?? v.replace(/_/g, " ");
}

export function typeLabel(v: string) {
  const t = OPPORTUNITY_TYPES.find((t) => t.value === v);
  return t ? t.label.replace(/s$/, "") : v;
}

export function daysUntil(deadline: string | null): number | null {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http')) return path;
  
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace('/api', '');
  return `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
}