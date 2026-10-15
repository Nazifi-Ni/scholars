/**
 * ScholarsConnect Share Utilities
 * Generates WhatsApp-compliant, polished share messages with dynamic metadata,
 * canonical URLs, and community links.
 */

export const DEFAULT_WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/EZHm6YGae3cLBgyoHoAVoB";

export const CANONICAL_BASE_URL = "https://www.scholarsconnect.com.ng";

/**
 * Strips HTML tags, Markdown symbols, and excessive formatting for plain-text platforms like WhatsApp.
 */
export function stripMarkdownAndHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, "") // HTML tags
    .replace(/!\[.*?\]\(.*?\)/g, "") // Markdown images
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Markdown links -> keep text
    .replace(/```[\s\S]*?```/g, "") // Code blocks
    .replace(/`([^`]+)`/g, "$1") // Inline code
    .replace(/^[ \t]*[-*+]\s+/gm, "") // List bullet points
    .replace(/[*_~#>]/g, " ") // Markdown styling symbols
    .replace(/\s+/g, " ") // Collapse whitespace
    .trim();
}

/**
 * Produces a concise 120-180 character summary trimmed at clean word boundaries.
 */
export function formatSummary(text?: string | null): string {
  if (!text) return "";
  const clean = stripMarkdownAndHtml(text);
  if (!clean) return "";
  if (clean.length <= 160) return clean;

  const truncated = clean.slice(0, 160);
  const lastSpace = truncated.lastIndexOf(" ");
  const trimmed = lastSpace > 100 ? truncated.slice(0, lastSpace) : truncated;
  return trimmed.replace(/[,.:;!?]+$/, "") + "...";
}

/**
 * Converts internal funding_type to WhatsApp-ready Benefit text.
 */
export function formatBenefit(fundingType?: string | null): string | null {
  if (!fundingType || fundingType === "not_applicable") return null;

  switch (fundingType.toLowerCase()) {
    case "fully_funded":
      return "Fully Funded";
    case "partially_funded":
      return "Partially Funded";
    case "tuition_support":
      return "Tuition Support";
    case "prize":
      return "Cash Prize / Award";
    case "grant":
      return "Grant Funding";
    case "stipend":
      return "Stipend / Allowance";
    case "free":
      return "Free Access";
    case "paid":
      return "Paid";
    case "unpaid":
      return "Unpaid";
    default:
      return fundingType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
}

/**
 * Extracts or synthesizes a clean, short eligibility summary (e.g. "Nigerian undergraduates").
 */
export function formatEligibilitySummary(opportunity: {
  degree_levels?: any;
  eligible_countries?: any;
  country?: { name?: string } | null;
  best_for?: string | null;
  eligibility?: string | null;
}): string | null {
  // 1. Try degree levels and eligible countries
  let degrees: string[] = [];
  try {
    if (Array.isArray(opportunity.degree_levels)) {
      degrees = opportunity.degree_levels;
    } else if (typeof opportunity.degree_levels === "string") {
      degrees = JSON.parse(opportunity.degree_levels);
    }
  } catch {
    degrees = [];
  }

  const validDegrees = degrees.filter(
    (d) =>
      d &&
      d.toLowerCase() !== "not_applicable" &&
      d.toLowerCase() !== "any_level" &&
      d !== "Not Applicable" &&
      d !== "Any Level",
  );

  let countries: string[] = [];
  try {
    if (Array.isArray(opportunity.eligible_countries)) {
      countries = opportunity.eligible_countries;
    } else if (typeof opportunity.eligible_countries === "string") {
      countries = JSON.parse(opportunity.eligible_countries);
    }
  } catch {
    countries = [];
  }

  const isNigeria =
    countries.includes("Nigeria") || opportunity.country?.name?.toLowerCase() === "nigeria";
  const isWorldwide = countries.includes("Worldwide") || countries.includes("Global");

  if (validDegrees.includes("Undergraduate")) {
    if (isNigeria) return "Nigerian undergraduates";
    if (isWorldwide) return "Undergraduate students worldwide";
    return "Undergraduate students";
  }

  if (validDegrees.includes("Masters")) {
    if (isNigeria) return "Nigerian Master's applicants";
    if (isWorldwide) return "Eligible graduates worldwide";
    return "Master's & graduate candidates";
  }

  if (validDegrees.includes("PhD")) {
    if (isNigeria) return "Nigerian PhD / doctoral candidates";
    if (isWorldwide) return "PhD applicants worldwide";
    return "PhD candidates";
  }

  if (validDegrees.includes("Secondary School")) {
    if (isNigeria) return "Nigerian secondary school students";
    return "Secondary school students";
  }

  if (isNigeria) {
    return "Open to Nigerian applicants";
  }

  if (isWorldwide) {
    return "Open to applicants worldwide";
  }

  // 2. Check best_for if concise
  if (opportunity.best_for) {
    const cleanBestFor = stripMarkdownAndHtml(opportunity.best_for);
    if (cleanBestFor.length > 5 && cleanBestFor.length <= 70) {
      return cleanBestFor;
    }
  }

  // 3. Check first bullet / line of eligibility
  if (opportunity.eligibility) {
    const firstLine = opportunity.eligibility
      .split("\n")
      .map((l) => stripMarkdownAndHtml(l))
      .find((l) => l.length > 10 && l.length <= 70);
    if (firstLine) {
      return firstLine.replace(/^[-•*]\s*/, "");
    }
  }

  return null;
}

/**
 * Formats deadline or closed status for WhatsApp.
 */
export function formatDeadline(
  deadline?: string | null,
  isExpired?: boolean | null,
): { label: string; text: string; isClosed: boolean } {
  const isClosed =
    Boolean(isExpired) || (Boolean(deadline) && new Date(deadline!).getTime() < Date.now());

  if (isClosed) {
    return {
      label: "🔴 *Status:*",
      text: "Applications Closed",
      isClosed: true,
    };
  }

  if (deadline) {
    try {
      const d = new Date(deadline);
      const formatted = d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      return {
        label: "📅 *Deadline:*",
        text: formatted,
        isClosed: false,
      };
    } catch {
      // fallback
    }
  }

  return {
    label: "📅 *Deadline:*",
    text: "Rolling",
    isClosed: false,
  };
}

export interface OpportunityShareData {
  id?: number | string;
  title: string;
  slug: string;
  summary?: string | null;
  short_description?: string | null;
  description?: string | null;
  funding_type?: string | null;
  degree_levels?: any;
  eligible_countries?: any;
  country?: { name?: string } | null;
  eligibility?: string | null;
  best_for?: string | null;
  deadline?: string | null;
  is_expired?: boolean | null;
  is_sponsored?: boolean | null;
}

/**
 * Constructs the WhatsApp share message strictly adhering to WhatsApp formatting:
 * *bold* and _italics_, with dynamic fields and zero undefined/null values.
 */
export function buildWhatsAppShareMessage(
  opportunity: OpportunityShareData,
  whatsappCommunityUrl: string = DEFAULT_WHATSAPP_COMMUNITY_URL,
): string {
  const parts: string[] = [];

  // Sponsored disclosure if applicable
  if (opportunity.is_sponsored) {
    parts.push("📢 *Sponsored Opportunity*");
  }

  // Opportunity Title
  parts.push(`🎓 *${opportunity.title.trim()}*`);

  // Short Summary (120-180 chars)
  const summary = formatSummary(
    opportunity.short_description || opportunity.summary || opportunity.description,
  );
  if (summary) {
    parts.push(summary);
  }

  // Key Metadata Block (Benefit, Eligibility, Deadline)
  const metadataLines: string[] = [];

  const benefit = formatBenefit(opportunity.funding_type);
  if (benefit) {
    metadataLines.push(`✅ *Benefit:* ${benefit}`);
  }

  const eligibility = formatEligibilitySummary(opportunity);
  if (eligibility) {
    metadataLines.push(`👥 *Eligibility:* ${eligibility}`);
  }

  const deadlineInfo = formatDeadline(opportunity.deadline, opportunity.is_expired);
  metadataLines.push(`${deadlineInfo.label} ${deadlineInfo.text}`);

  if (metadataLines.length > 0) {
    parts.push(metadataLines.join("\n"));
  }

  // Direct Opportunity Link (Canonical production URL)
  const oppUrl = `${CANONICAL_BASE_URL}/opportunities/${opportunity.slug}`;
  const ctaLine = deadlineInfo.isClosed ? "🔗 *View details:*" : "🔗 *View full details & apply:*";
  parts.push(`${ctaLine}\n${oppUrl}`);

  // WhatsApp Community Invite
  const cleanCommunityUrl = whatsappCommunityUrl?.trim() || DEFAULT_WHATSAPP_COMMUNITY_URL;
  parts.push(
    `📲 *Join the ScholarsConnect WhatsApp Community for more scholarships, internships, grants and student opportunities:*\n${cleanCommunityUrl}`,
  );

  // ScholarsConnect Branding
  parts.push("🎓 *ScholarsConnect*\n_Connecting Dreams to Opportunities._");

  return parts.join("\n\n");
}

/**
 * Launches WhatsApp with the properly URL-encoded message.
 * Mobile: wa.me
 * Desktop: web.whatsapp.com
 */
export function openWhatsAppShare(message: string): void {
  const encoded = encodeURIComponent(message);
  const isMobile =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const url = isMobile
    ? `https://wa.me/?text=${encoded}`
    : `https://web.whatsapp.com/send?text=${encoded}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Copies the canonical opportunity URL to clipboard.
 */
export async function copyOpportunityUrl(slug: string): Promise<boolean> {
  const url = `${CANONICAL_BASE_URL}/opportunities/${slug}`;
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return true;
  }
  // Fallback
  const textarea = document.createElement("textarea");
  textarea.value = url;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const successful = document.execCommand("copy");
  document.body.removeChild(textarea);
  return successful;
}

/**
 * Native device share sheet (navigator.share).
 */
export async function shareViaNativeDevice(opportunity: OpportunityShareData): Promise<boolean> {
  const url = `${CANONICAL_BASE_URL}/opportunities/${opportunity.slug}`;
  const summary = formatSummary(opportunity.short_description || opportunity.summary);

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: `${opportunity.title} — ScholarsConnect`,
        text: summary || opportunity.title,
        url,
      });
      return true;
    } catch (e: any) {
      if (e.name === "AbortError") return false; // user cancelled
      throw e;
    }
  }
  return false;
}

/**
 * Non-blocking Google Analytics event tracking.
 */
export function trackOpportunityShare(
  opportunityId: number | string | undefined,
  slug: string,
  platform: string,
): void {
  if (typeof window !== "undefined" && (window as any).gtag) {
    try {
      (window as any).gtag("event", "opportunity_share", {
        platform,
        opportunity_id: opportunityId,
        slug,
      });
    } catch {
      // ignore
    }
  }
}

export interface BlogPostShareData {
  id?: number | string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  category?: string | null;
  reading_minutes?: number | null;
}

/**
 * Constructs the WhatsApp share message for a blog post or educational guide.
 */
export function buildBlogWhatsAppShareMessage(
  post: BlogPostShareData,
  whatsappCommunityUrl: string = DEFAULT_WHATSAPP_COMMUNITY_URL,
): string {
  const parts: string[] = [];

  // Article Title
  parts.push(`📖 *${post.title.trim()}*`);

  // Short Excerpt / Summary (120-180 chars)
  const summary = formatSummary(post.excerpt || post.content);
  if (summary) {
    parts.push(summary);
  }

  // Topic & Reading Time Metadata Block
  const metadataLines: string[] = [];
  if (post.category && post.category.trim()) {
    metadataLines.push(`🏷️ *Topic:* ${post.category.trim()}`);
  }

  const readingMins =
    post.reading_minutes ||
    (post.content ? Math.max(1, Math.ceil(post.content.trim().split(/\s+/).length / 200)) : null);
  if (readingMins) {
    metadataLines.push(`⏱️ *Reading Time:* ${readingMins} min read`);
  }

  if (metadataLines.length > 0) {
    parts.push(metadataLines.join("\n"));
  }

  // Direct Blog Guide Link (Canonical production URL)
  const blogUrl = `${CANONICAL_BASE_URL}/blog/${post.slug}`;
  parts.push(`🔗 *Read full guide:*\n${blogUrl}`);

  // WhatsApp Community Invite
  const cleanCommunityUrl = whatsappCommunityUrl?.trim() || DEFAULT_WHATSAPP_COMMUNITY_URL;
  parts.push(
    `📲 *Join the ScholarsConnect WhatsApp Community for more scholarships, internships, grants and student opportunities:*\n${cleanCommunityUrl}`,
  );

  // ScholarsConnect Branding
  parts.push("🎓 *ScholarsConnect*\n_Connecting Dreams to Opportunities._");

  return parts.join("\n\n");
}

/**
 * Copies the canonical blog URL to clipboard.
 */
export async function copyBlogUrl(slug: string): Promise<boolean> {
  const url = `${CANONICAL_BASE_URL}/blog/${slug}`;
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return true;
  }
  // Fallback
  const textarea = document.createElement("textarea");
  textarea.value = url;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const successful = document.execCommand("copy");
  document.body.removeChild(textarea);
  return successful;
}

/**
 * Native device share sheet for blog guides.
 */
export async function shareBlogViaNativeDevice(post: BlogPostShareData): Promise<boolean> {
  const url = `${CANONICAL_BASE_URL}/blog/${post.slug}`;
  const summary = formatSummary(post.excerpt || post.content);

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: `${post.title} — ScholarsConnect`,
        text: summary || post.title,
        url,
      });
      return true;
    } catch (e: any) {
      if (e.name === "AbortError") return false;
      throw e;
    }
  }
  return false;
}

/**
 * Analytics tracking for blog shares.
 */
export function trackBlogShare(
  postId: number | string | undefined,
  slug: string,
  platform: string,
): void {
  if (typeof window !== "undefined" && (window as any).gtag) {
    try {
      (window as any).gtag("event", "blog_share", {
        platform,
        post_id: postId,
        slug,
      });
    } catch {
      // ignore
    }
  }
}

