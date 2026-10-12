// Shared constants & types for ScholarsConnect data layer.
// Kept in its own module so server-function handlers can import them
// (handlers must not reference module-scope siblings in the same file).

export const OPP_CARD_SELECT =
  "id, title, slug, summary, opportunity_type, funding_type, degree_levels, deadline, featured_image, is_verified, is_featured, views_count, bookmarks_count, scholar_rating, created_at, category:categories(name,slug), country:countries(name,slug,flag_emoji), university:universities(name,slug), organization:organizations(name,slug)";

export const OPP_FULL_SELECT =
  "*, category:categories(name,slug), country:countries(name,slug,flag_emoji), university:universities(name,slug,website), organization:organizations(name,slug,website)";

export interface CountryData {
  id: number;
  name: string;
  slug: string;
  code: string;
  flag_emoji: string;
  is_featured?: boolean;
}

export interface CategoryData {
  id: number | string;
  name: string;
  slug: string;
  icon?: string | null;
  count?: number;
}

export interface UniversityData {
  id: number | string;
  name: string;
  slug: string;
  logo_url?: string | null;
  country?: { name: string; slug: string } | null;
}

export interface HomeData {
  featured: OpportunityCardData[];
  latest: OpportunityCardData[];
  trending: OpportunityCardData[];
  closingSoon: OpportunityCardData[];
  categories: CategoryData[];
  countries: CountryData[];
  featured_countries: CountryData[];
  universities: UniversityData[];
  testimonials: any[];
  faqs: any[];
  settings: Record<string, string>;
  featured_category_sections?: {
    category: CategoryData;
    opportunities: OpportunityCardData[];
  }[];
}

export interface OpportunityCardData {
  id: string | number;
  title: string;
  slug: string;
  summary: string | null;
  opportunity_type: string;
  funding_type: string;
  degree_levels?: string[] | null;
  eligible_countries?: string[] | null;
  deadline: string | null;
  featured_image: string | null;
  image_url?: string | null;
  is_verified: boolean;
  is_featured: boolean;
  is_sponsored?: boolean;
  is_expired?: boolean;
  views_count: number;
  bookmarks_count: number;
  scholar_rating: number | null;
  created_at: string;
  category: { id?: number | string; name: string; slug: string } | null;
  country: { id?: number | string; name: string; slug: string; flag_emoji: string | null } | null;
  university: { id?: number | string; name: string; slug: string } | null;
  organization: { id?: number | string; name: string; slug: string } | null;
  provider?: string | null;
  application_fee?: string | null;
  application_open_date?: string | null;
  verification_status?: string | null;
  official_source_url?: string | null;
  last_verified_at?: string | null;
  verified_by?: string | null;
  application_difficulty?: string | null;
  best_for?: string | null;
  not_suitable_for?: string | null;
  common_mistakes?: string | null;
  editorial_verdict?: string | null;
  scholarsconnect_advice?: string | null;
  focus_keyword?: string | null;
  official_website?: string | null;
  application_link?: string | null;
  eligibility?: string | null;
  benefits?: string | null;
  required_documents?: string | null;
  application_procedure?: string | null;
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
  { value: "fellowship", label: "Fellowships" },
  { value: "competition", label: "Competitions" },
  { value: "grant", label: "Grants" },
  { value: "course", label: "Courses" },
  { value: "training", label: "Trainings" },
  { value: "job", label: "Jobs" },
  { value: "conference", label: "Conferences" },
  { value: "exchange_program", label: "Exchange Programs" },
  { value: "student_resource", label: "Student Resources" },
  { value: "entrepreneurship", label: "Entrepreneurship" },
  { value: "innovation_challenge", label: "Innovation Challenges" },
  { value: "hackathon", label: "Hackathons" },
  { value: "other", label: "Other" },
] as const;

export const FUNDING_TYPES = [
  { value: "fully_funded", label: "Fully Funded" },
  { value: "partially_funded", label: "Partially Funded" },
  { value: "tuition_support", label: "Tuition Support" },
  { value: "stipend", label: "Stipend" },
  { value: "paid", label: "Paid" },
  { value: "prize", label: "Prize" },
  { value: "grant", label: "Grant" },
  { value: "free", label: "Free" },
  { value: "self_funded", label: "Self Funded" },
  { value: "not_applicable", label: "Not Applicable" },
] as const;

export const DEGREE_LEVELS = [
  { value: "undergraduate", label: "Undergraduate" },
  { value: "masters", label: "Masters" },
  { value: "phd", label: "PhD" },
  { value: "postgraduate", label: "Postgraduate" },
  { value: "secondary_school", label: "Secondary School" },
  { value: "graduate", label: "Graduate" },
  { value: "any_level", label: "Any Level" },
  { value: "not_applicable", label: "Not Applicable" },
] as const;

export const APPLICATION_DIFFICULTIES = [
  { value: "Easy", label: "Easy" },
  { value: "Moderate", label: "Moderate" },
  { value: "Competitive", label: "Competitive" },
  { value: "Highly Competitive", label: "Highly Competitive" },
] as const;

export const VERIFICATION_STATUSES = [
  { value: "verified", label: "Verified" },
  { value: "needs_review", label: "Needs Review" },
  { value: "unverified", label: "Unverified" },
] as const;

export function fundingLabel(v: string | null | undefined): string {
  if (!v || v === "not_applicable") return "";
  const found = FUNDING_TYPES.find(
    (f) => f.value === v || f.label.toLowerCase() === v.toLowerCase(),
  );
  return found ? found.label : v.replace(/_/g, " ");
}

export function typeLabel(v: string | null | undefined): string {
  if (!v) return "Opportunity";
  const found = OPPORTUNITY_TYPES.find(
    (t) => t.value === v || t.label.toLowerCase() === v.toLowerCase(),
  );
  return found ? found.label.replace(/s$/, "") : v.replace(/_/g, " ");
}

export function degreeLabel(v: string | null | undefined): string {
  if (!v || v === "not_applicable" || v === "Not Applicable") return "";
  const found = DEGREE_LEVELS.find(
    (d) => d.value === v || d.label.toLowerCase() === v.toLowerCase(),
  );
  return found ? found.label : v;
}

export function daysUntil(deadline: string | null | undefined): number | null {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http")) return path;

  const baseUrl = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api").replace(
    "/api",
    "",
  );
  return `${baseUrl}${path.startsWith("/") ? path : "/" + path}`;
}

/**
 * Calculates human-realistic reading time based on 220 words per minute.
 * Strips markdown, HTML, code blocks, and metadata before counting.
 */
export function calculateReadingTime(text: string | null | undefined): number {
  if (!text) return 1;
  const clean = text
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/[#*`_~>-]/g, " ")
    .trim();

  const words = clean.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}
