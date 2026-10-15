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

/**
 * Automatically cleans, normalizes, and structures opportunity content into clean GitHub-flavored Markdown.
 * - Converts raw emoji/bullet symbols (✅, ✔️, •, 💰, etc.) into clean Markdown list items (- ).
 * - Converts unspaced dashes/asterisks (-Item) into Markdown list items (- Item).
 * - Converts step headers (Step 1:, Step 1 -) into markdown headings (#### Step 1:).
 * - Auto-detects unbulleted lists following colons (e.g. "Applicants must:\nBe a student\nHave JAMB")
 *   and formats each into a list item (- Be a student).
 * - Normalizes Windows CRLF to standard newlines.
 * - Ensures proper paragraph breaks so CommonMark doesn't collapse lines into a run-on block.
 */
export function formatOpportunityMarkdown(raw: string | null | undefined): string {
  if (!raw || typeof raw !== "string") return "";

  // 1. Normalize line breaks
  let text = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  if (!text) return "";

  // 2. Convert emoji bullets and custom symbols at line start to standard markdown '- '
  text = text.replace(/^[ \t]*[✅✔️☑️💰📌👉🔹🔸▪▫•●★*–—]\s*/gm, "- ");

  // 3. Fix unspaced dashes or asterisks: e.g. "-Requirement" -> "- Requirement"
  text = text.replace(/^[ \t]*[-*](?!\s)/gm, "- ");

  // 4. Format Step headers: e.g. "Step 1: ..." or "Step 1 -" -> "#### Step 1: ..."
  text = text.replace(/^[ \t]*(Step\s+\d+[:\-\s]+.*)$/gmi, "#### $1");

  // 5. Convert common inline section headers ending with a colon on their own line into subheadings
  text = text.replace(
    /^[ \t]*(Eligible Institutions|Eligible Universities|Selection Process|Application\/Registration Procedure|Application Procedure|Important Notes?|Official Application|Key Documents?|Eligibility Requirements?|Benefits & Coverage|Additional Support)[:\s]*$/gmi,
    "### $1"
  );

  // 6. Handle lists following lead-in phrases ending in colon (e.g. "Applicants must:", "Provide your:")
  const lines = text.split("\n");
  const result: string[] = [];
  let inListContext = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      inListContext = false;
      result.push("");
      continue;
    }

    // Check if line is a header like "Applicants must:" or "Provide your:"
    if (
      /^(Applicants must|Requirements include|Applicants should prepare|Eligible institutions include|Provide your|Support includes|Documents required|Selection criteria)[:\s]*$/i.test(
        trimmed
      )
    ) {
      inListContext = true;
      result.push(trimmed.endsWith(":") ? trimmed : trimmed + ":");
      continue;
    }

    // Check if line ends with a colon and is short (likely a list prompt)
    if (/^[A-Za-z0-9\s,\(\)\/\-]{3,50}:$/.test(trimmed) && !trimmed.startsWith("#")) {
      inListContext = true;
      result.push(trimmed);
      continue;
    }

    if (inListContext) {
      if (/^[-*#\d]/.test(trimmed)) {
        // already has a markdown marker
        result.push(line);
      } else if (trimmed.length < 300 && !trimmed.endsWith(":")) {
        // format as list item
        result.push(`- ${trimmed}`);
      } else {
        inListContext = false;
        result.push(line);
      }
    } else {
      result.push(line);
    }
  }

  // 7. Ensure proper paragraph spacing where needed
  const formattedLines = result;
  const finalLines: string[] = [];

  for (let i = 0; i < formattedLines.length; i++) {
    const cur = formattedLines[i];
    const next = formattedLines[i + 1];

    finalLines.push(cur);

    if (
      cur &&
      next &&
      !cur.startsWith("-") &&
      !cur.startsWith("*") &&
      !cur.startsWith("#") &&
      !next.startsWith("-") &&
      !next.startsWith("*") &&
      !next.startsWith("#") &&
      !cur.endsWith(":") &&
      !next.endsWith(":")
    ) {
      finalLines.push("");
    }
  }

  return finalLines.join("\n");
}

export interface ParsedOpportunityDraft {
  title?: string;
  provider?: string;
  summary?: string;
  eligibility?: string;
  benefits?: string;
  required_documents?: string;
  application_procedure?: string;
  scholarsconnect_advice?: string;
  best_for?: string;
  not_suitable_for?: string;
  common_mistakes?: string;
  editorial_verdict?: string;
  application_fee?: string;
  deadline?: string;
  official_website?: string;
  application_link?: string;
}

/**
 * Smartly parses a full opportunity text or Markdown draft (such as an announcement or guide)
 * and extracts individual structured fields for the ScholarsConnect opportunity schema.
 */
export function parseOpportunityMarkdownDraft(draft: string): ParsedOpportunityDraft {
  if (!draft || typeof draft !== "string") return {};

  const clean = draft.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const parsed: ParsedOpportunityDraft = {};

  // Extract title if starts with # Title
  const titleMatch = clean.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    parsed.title = titleMatch[1].trim();
  }

  // Split into sections by Markdown headings (## or ###) or ALL-CAPS/Header lines ending in colon
  const sectionRegex = /(?:^|\n)(#{2,3}\s+[^\n]+|[A-Z][A-Za-z0-9\s&/\-]{2,40}:)/g;
  const sections: { title: string; content: string }[] = [];

  let match: RegExpExecArray | null;
  let lastIndex = 0;
  let lastHeader = "";

  while ((match = sectionRegex.exec(clean)) !== null) {
    if (lastHeader) {
      const sectionText = clean.substring(lastIndex, match.index).trim();
      sections.push({ title: lastHeader, content: sectionText });
    }
    lastHeader = match[1].replace(/^#{2,3}\s*/, "").replace(/:$/, "").trim();
    lastIndex = match.index + match[0].length;
  }

  if (lastHeader && lastIndex < clean.length) {
    sections.push({ title: lastHeader, content: clean.substring(lastIndex).trim() });
  }

  // Map extracted sections to fields
  for (const s of sections) {
    const t = s.title.toLowerCase();
    const formattedContent = formatOpportunityMarkdown(s.content);

    if (t.includes("eligib") || t.includes("who can apply") || t.includes("qualification")) {
      parsed.eligibility = formattedContent;
    } else if (t.includes("benefit") || t.includes("cover") || t.includes("funding") || t.includes("allowance")) {
      parsed.benefits = formattedContent;
    } else if (t.includes("document") || t.includes("requirement") || t.includes("checklist")) {
      parsed.required_documents = formattedContent;
    } else if (t.includes("how to apply") || t.includes("procedure") || t.includes("step") || t.includes("application process")) {
      parsed.application_procedure = formattedContent;
    } else if (t.includes("advice") || t.includes("tip") || t.includes("scholarsconnect advice") || t.includes("strategy")) {
      parsed.scholarsconnect_advice = formattedContent;
    } else if (t.includes("best for") || t.includes("best suited")) {
      parsed.best_for = formattedContent;
    } else if (t.includes("not suitable") || t.includes("unsuitable") || t.includes("who should not apply")) {
      parsed.not_suitable_for = formattedContent;
    } else if (t.includes("mistake") || t.includes("pitfall") || t.includes("avoid")) {
      parsed.common_mistakes = formattedContent;
    } else if (t.includes("verdict") || t.includes("editorial")) {
      parsed.editorial_verdict = formattedContent;
    } else if (t.includes("overview") || t.includes("summary") || t.includes("about this")) {
      parsed.summary = s.content.trim();
    } else if (t.includes("provider") || t.includes("host") || t.includes("organizer") || t.includes("organization")) {
      parsed.provider = s.content.split("\n")[0].trim();
    } else if (t.includes("fee") || t.includes("cost")) {
      parsed.application_fee = s.content.split("\n")[0].trim();
    } else if (t.includes("deadline") || t.includes("closing date")) {
      parsed.deadline = s.content.split("\n")[0].trim();
    }
  }

  // Check inline quick keys if not matched by section headings
  if (!parsed.official_website) {
    const siteMatch = clean.match(/(?:Official Website|Website|Portal):\s*(https?:\/\/[^\s]+)/i);
    if (siteMatch) parsed.official_website = siteMatch[1].trim();
  }
  if (!parsed.application_link) {
    const appMatch = clean.match(/(?:Application Link|Apply Link|Apply URL):\s*(https?:\/\/[^\s]+)/i);
    if (appMatch) parsed.application_link = appMatch[1].trim();
  }
  if (!parsed.provider) {
    const provMatch = clean.match(/(?:Provider|Awarding Body|Organization|University):\s*([^\n]+)/i);
    if (provMatch) parsed.provider = provMatch[1].trim();
  }
  if (!parsed.deadline) {
    const deadMatch = clean.match(/(?:Deadline|Closing Date):\s*([^\n]+)/i);
    if (deadMatch) parsed.deadline = deadMatch[1].trim();
  }

  return parsed;
}

