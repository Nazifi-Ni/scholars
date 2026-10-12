// @ts-nocheck
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BadgeCheck,
  Calendar,
  ExternalLink,
  Globe2,
  GraduationCap,
  Building2,
  Mail,
  Star,
  Timer,
  Eye,
  Bookmark,
  ArrowRight,
  CheckCircle2,
  FileText,
  Info,
  HelpCircle,
  AlertTriangle,
  ShieldCheck,
  DollarSign,
  XCircle,
  ChevronRight,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { RouteErrorFallback, RouteNotFoundFallback } from "@/components/RouteFallbacks";
import { opportunityQuery } from "@/lib/queries";
import {
  fundingLabel,
  typeLabel,
  degreeLabel,
  daysUntil,
  getImageUrl,
  DEGREE_LEVELS,
  type OpportunityCardData,
} from "@/lib/sc-shared";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { cn } from "@/lib/utils";
import { WhatsAppBanner } from "@/components/WhatsAppBanner";
import { NewsletterWidget } from "@/components/NewsletterWidget";
import { AdBanner } from "@/components/AdBanner";
import { VerifiedBadge } from "@/components/VerifiedBadge";

export const Route = createFileRoute("/opportunities/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(opportunityQuery(params.slug));
    if (!data.opportunity) throw notFound();
    return data;
  },
  head: ({ params, loaderData }) => {
    if (!loaderData?.opportunity) {
      return {
        meta: [
          { title: "Opportunity Not Found — ScholarsConnect" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const o = loaderData.opportunity;
    const title = o.meta_title ?? `${o.title} — ScholarsConnect`;
    const desc =
      o.meta_description ??
      o.summary ??
      "Verified opportunity for African students on ScholarsConnect.";
    const canonicalUrl = `https://www.scholarsconnect.com.ng/opportunities/${params.slug}`;
    const imageUrl = getImageUrl(o.featured_image ?? o.image_url);

    const isClosed = o.is_expired || (o.deadline && new Date(o.deadline).getTime() < Date.now());

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        ...(o.focus_keyword ? [{ name: "keywords", content: o.focus_keyword }] : []),
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:image", content: imageUrl },
        { property: "og:url", content: canonicalUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: imageUrl },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.scholarsconnect.com.ng",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Opportunities",
                item: "https://www.scholarsconnect.com.ng/opportunities",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: o.title,
                item: canonicalUrl,
              },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOccupationalProgram",
            name: o.title,
            description: desc,
            url: canonicalUrl,
            image: imageUrl,
            provider: {
              "@type": "Organization",
              name:
                o.provider ??
                o.university?.name ??
                o.organization?.name ??
                "ScholarsConnect Partner",
              url: o.official_website ?? o.official_source_url ?? undefined,
            },
            ...(o.deadline ? { applicationDeadline: o.deadline } : {}),
            ...(o.application_open_date ? { applicationStartDate: o.application_open_date } : {}),
          }),
        },
      ],
    };
  },
  errorComponent: RouteErrorFallback,
  notFoundComponent: RouteNotFoundFallback,
  component: OpportunityDetailPage,
});

function DetailSection({
  title,
  content,
  icon,
}: {
  title: string;
  content: string | null | undefined;
  icon?: React.ReactNode;
}) {
  if (!content) return null;
  return (
    <section className="mb-8">
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="bg-muted/30 border-b border-border px-6 py-4 flex items-center gap-2.5">
          {icon}
          <h2 className="text-xl font-bold text-navy font-heading">{title}</h2>
        </div>
        <div className="px-6 py-6 prose prose-slate max-w-none text-foreground/85 font-sans leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </section>
  );
}

function OpportunityDetailPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(opportunityQuery(slug));
  const o = data.opportunity!;
  const days = daysUntil(o.deadline);
  const isClosed = o.is_expired || (days !== null && days < 0);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(o.id);

  const providerName = o.provider ?? o.university?.name ?? o.organization?.name;
  const applicableDegrees = (o.degree_levels || []).filter(
    (lvl: string) => lvl && lvl.toLowerCase() !== "not_applicable" && lvl !== "Not Applicable",
  );

  return (
    <SiteLayout>
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-8 pb-14 px-4 lg:px-8 bg-navy text-white border-b border-border">
        {(o.featured_image || o.image_url) && (
          <>
            <div
              className="absolute inset-0 z-0 opacity-15 scale-105 blur-2xl pointer-events-none"
              style={{
                backgroundImage: `url('${getImageUrl(o.featured_image ?? o.image_url)}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-navy via-navy/90 to-transparent pointer-events-none" />
          </>
        )}

        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="text-xs font-semibold tracking-wider text-white/70 font-sans mb-6 flex items-center gap-2 flex-wrap"
          >
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-white/40" />
            <Link to="/opportunities" className="hover:text-white transition-colors">
              Opportunities
            </Link>
            <ChevronRight className="h-3 w-3 text-white/40" />
            <Link
              to="/opportunities"
              search={{ type: o.opportunity_type }}
              className="text-secondary hover:underline"
            >
              {typeLabel(o.opportunity_type)}
            </Link>
          </nav>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Featured Image */}
            {(o.featured_image || o.image_url) && (
              <div className="shrink-0 w-full md:w-[320px] lg:w-[380px] aspect-video rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/10 bg-white">
                <img
                  src={getImageUrl(o.featured_image ?? o.image_url)}
                  alt={o.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Title & Key Badges */}
            <div className="flex-1 w-full">
              {providerName && (
                <div className="text-sm font-semibold uppercase tracking-widest text-secondary mb-2 flex items-center gap-1.5 font-sans">
                  <Building2 className="h-4 w-4" /> {providerName}
                </div>
              )}

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-white font-heading mb-4 drop-shadow-sm">
                {o.title}
              </h1>

              {o.summary && (
                <p className="text-sm sm:text-base text-white/80 font-sans mb-6 max-w-3xl leading-relaxed">
                  {o.summary}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2.5 font-sans">
                <span className="rounded-full bg-secondary text-navy px-3.5 py-1 text-xs font-bold uppercase tracking-wider shadow-sm">
                  {typeLabel(o.opportunity_type)}
                </span>

                {fundingLabel(o.funding_type) && (
                  <span className="rounded-full bg-white/10 border border-white/20 text-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
                    {fundingLabel(o.funding_type)}
                  </span>
                )}

                {o.is_sponsored && (
                  <span className="rounded-full bg-amber-500 text-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
                    Sponsored
                  </span>
                )}

                {isClosed && (
                  <span className="rounded-full bg-red-500/90 text-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <XCircle className="h-3.5 w-3.5" /> Closed
                  </span>
                )}

                <div className="ml-auto flex items-center gap-4 text-xs text-white/70 font-semibold bg-white/5 px-4 py-2 rounded-full border border-white/10 mt-3 sm:mt-0">
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-white/40" />
                    {o.views_count.toLocaleString()} Views
                  </span>
                  <div className="w-px h-3 bg-white/20"></div>
                  <span className="inline-flex items-center gap-1.5">
                    <Bookmark className="h-3.5 w-3.5 text-white/40" />
                    {o.bookmarks_count.toLocaleString()} Saved
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-12 lg:px-8">
        {/* Main Content Area (67%) */}
        <div className="lg:col-span-8">
          {/* Verification Badge */}
          <VerifiedBadge
            status={o.verification_status || (o.is_verified ? "verified" : "needs_review")}
            officialSourceUrl={o.official_source_url ?? o.official_website}
            lastVerifiedAt={o.last_verified_at ?? o.updated_at}
            verifiedBy={o.verified_by ?? "ScholarsConnect Editorial Team"}
            className="mb-8"
          />

          {/* Expired / Closed Advisory Banner */}
          {isClosed && (
            <div className="mb-8 rounded-2xl border border-red-200 bg-red-50/80 p-6 text-red-950 shadow-sm">
              <div className="flex items-start gap-3.5">
                <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-heading font-bold text-lg text-red-900 mb-1">
                    APPLICATION CLOSED — Application Cycle Concluded
                  </h3>
                  <p className="text-sm leading-relaxed text-red-900/90 mb-3">
                    The formal deadline for this opportunity was{" "}
                    <strong>
                      {o.deadline
                        ? new Date(o.deadline).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "in the previous cycle"}
                    </strong>
                    . Applications are no longer being accepted by the awarding body at this time.
                  </p>
                  <p className="text-xs text-red-800 leading-relaxed">
                    💡 <em>Editorial Tip:</em> Review the eligibility criteria and documentation
                    requirements below to prepare your transcripts, motivation letters, and
                    references well ahead of the next anticipated cycle.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Opportunity Fact Sheet */}
          <section className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-bold text-navy font-heading mb-4">Opportunity Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-sans">
              {providerName && (
                <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Awarding Body
                  </span>
                  <span className="font-bold text-navy mt-0.5 block">{providerName}</span>
                </div>
              )}

              {o.country && (
                <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Host Country
                  </span>
                  <span className="font-bold text-navy mt-0.5 block">
                    {o.country.flag_emoji} {o.country.name}
                  </span>
                </div>
              )}

              {fundingLabel(o.funding_type) && (
                <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Funding Category
                  </span>
                  <span className="font-bold text-navy mt-0.5 block">
                    {fundingLabel(o.funding_type)}
                  </span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Application Fee
                </span>
                <span className="font-bold text-navy mt-0.5 block">
                  {o.application_fee || "Free / No Application Fee"}
                </span>
              </div>

              {applicableDegrees.length > 0 && (
                <div className="p-3 rounded-xl bg-muted/40 border border-border/50 sm:col-span-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Eligible Academic Level
                  </span>
                  <span className="font-bold text-navy mt-0.5 block">
                    {applicableDegrees.map((d: string) => degreeLabel(d)).join(" • ")}
                  </span>
                </div>
              )}

              {o.deadline && (
                <div className="p-3 rounded-xl bg-muted/40 border border-border/50 sm:col-span-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Application Deadline
                  </span>
                  <span className="font-bold text-navy mt-0.5 block">
                    {new Date(o.deadline).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    {days !== null && days >= 0 && (
                      <span className="ml-2 font-normal text-xs text-green-700">
                        ({days === 0 ? "Closing today" : `${days} days left`})
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* ScholarsConnect Eligibility Check & Difficulty */}
          {(o.application_difficulty || o.best_for || o.not_suitable_for) && (
            <section className="mb-8 rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-border/60">
                <h2 className="text-xl font-bold text-navy font-heading flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-secondary" /> ScholarsConnect Eligibility
                  Check
                </h2>
                {o.application_difficulty && (
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      o.application_difficulty === "Easy"
                        ? "bg-green-100 text-green-800"
                        : o.application_difficulty === "Moderate"
                          ? "bg-blue-100 text-blue-800"
                          : o.application_difficulty === "Competitive"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    Difficulty: {o.application_difficulty}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
                {o.best_for && (
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60">
                    <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="text-emerald-700">✓</span> Best Suited For
                    </h3>
                    <div className="text-sm text-emerald-950/90 leading-relaxed whitespace-pre-line">
                      {o.best_for}
                    </div>
                  </div>
                )}

                {o.not_suitable_for && (
                  <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/60">
                    <h3 className="text-sm font-bold text-rose-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="text-rose-700">✕</span> Not Suitable For
                    </h3>
                    <div className="text-sm text-rose-950/90 leading-relaxed whitespace-pre-line">
                      {o.not_suitable_for}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Detailed Editorial Sections */}
          <DetailSection
            title="Eligibility Requirements"
            content={o.eligibility}
            icon={<GraduationCap className="h-5 w-5 text-primary" />}
          />
          <DetailSection
            title="Benefits & Financial Coverage"
            content={o.benefits}
            icon={<DollarSign className="h-5 w-5 text-primary" />}
          />
          <DetailSection
            title="Required Documents Checklist"
            content={o.required_documents}
            icon={<FileText className="h-5 w-5 text-primary" />}
          />
          <DetailSection
            title="Common Mistakes to Avoid"
            content={o.common_mistakes}
            icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
          />
          <DetailSection
            title="Application Steps (Step-by-Step)"
            content={o.application_procedure}
            icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
          />

          {/* ScholarsConnect Advice */}
          {o.scholarsconnect_advice && (
            <div className="my-8 border-l-4 border-amber-500 bg-amber-50/60 p-6 sm:p-8 rounded-r-2xl shadow-sm relative overflow-hidden">
              <h2 className="mb-3 flex items-center font-heading text-xl sm:text-2xl font-bold text-amber-900">
                <span className="mr-2 text-2xl">💡</span> ScholarsConnect Strategic Advice
              </h2>
              <div className="prose prose-amber prose-sm sm:prose-base max-w-none text-amber-950 leading-relaxed font-sans">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {o.scholarsconnect_advice}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* ScholarsConnect Verdict */}
          {o.editorial_verdict && (
            <div className="my-8 rounded-2xl border border-indigo-200 bg-indigo-50/60 p-6 sm:p-7 shadow-sm">
              <h2 className="text-lg font-bold text-indigo-950 font-heading mb-2 flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-600" /> ScholarsConnect Editorial Verdict
              </h2>
              <div className="text-sm leading-relaxed text-indigo-950/90 font-sans whitespace-pre-line">
                {o.editorial_verdict}
              </div>
            </div>
          )}

          {/* Official Source Attribution Box */}
          <section className="my-8 rounded-2xl border border-border bg-muted/30 p-6 shadow-sm">
            <h3 className="font-heading font-bold text-base text-navy mb-2 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-secondary" /> Official Source & Verification
              Notice
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans mb-4">
              ScholarsConnect operates as an independent discovery platform. We summarize program
              guidelines to empower applicants. Never submit payment to unauthorized agents. Always
              verify current requirements on the official provider's portal.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              {(o.official_source_url ?? o.official_website) && (
                <a
                  href={o.official_source_url ?? o.official_website}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-1.5 text-primary hover:underline bg-white px-3 py-1.5 rounded-lg border border-border shadow-xs"
                >
                  Official Provider Website <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              <Link
                to="/editorial-policy"
                className="text-muted-foreground hover:text-navy hover:underline"
              >
                Read our Editorial Policy
              </Link>
            </div>
          </section>

          {/* Ad Banner inside content */}
          <AdBanner className="my-8" />

          {/* WhatsApp Banner */}
          <WhatsAppBanner className="mt-8 mb-4" />

          {/* Main Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-start gap-4">
            {isClosed ? (
              <Button
                disabled
                className="w-full sm:w-auto rounded-xl px-8 py-6 text-sm font-bold uppercase tracking-wider bg-gray-400 text-white cursor-not-allowed"
              >
                Applications Closed
              </Button>
            ) : o.application_link ? (
              <Button
                asChild
                className="w-full sm:w-auto rounded-xl bg-[#1d6b20] hover:bg-[#154e17] px-8 py-6 text-sm font-bold shadow-md transition-all text-white uppercase tracking-wider"
              >
                <a href={o.application_link} target="_blank" rel="noopener noreferrer nofollow">
                  Apply on Official Portal <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            ) : o.official_website ? (
              <Button
                asChild
                className="w-full sm:w-auto rounded-xl bg-[#1d6b20] hover:bg-[#154e17] px-8 py-6 text-sm font-bold shadow-md transition-all text-white uppercase tracking-wider"
              >
                <a href={o.official_website} target="_blank" rel="noopener noreferrer nofollow">
                  Visit Official Website <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            ) : null}

            <Button
              variant="outline"
              className="w-full sm:w-auto rounded-xl px-7 py-6 text-sm font-semibold shadow-xs"
              onClick={() => {
                const url = window.location.href;
                if (navigator.share) {
                  navigator.share({ title: o.title, url });
                } else {
                  window.open(
                    `https://api.whatsapp.com/send?text=${encodeURIComponent(o.title + " " + url)}`,
                    "_blank",
                  );
                }
              }}
            >
              Share Opportunity <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Sidebar (33%) */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-8">
            {/* Bookmark Action */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <Button
                variant={bookmarked ? "secondary" : "outline"}
                className={cn(
                  "w-full rounded-xl font-semibold transition-colors py-6 text-sm shadow-xs",
                  bookmarked && "bg-secondary/10 text-secondary border-secondary/20",
                )}
                onClick={() => toggleBookmark(o)}
              >
                <Bookmark className={cn("mr-2 h-4 w-4", bookmarked && "fill-secondary")} />
                {bookmarked ? "Saved in Bookmarks" : "Save for Later"}
              </Button>
            </div>

            {/* Countdown / Status Box */}
            {o.deadline && (
              <div
                className={cn(
                  "rounded-2xl p-6 text-center border shadow-sm",
                  isClosed
                    ? "bg-muted/40 border-border"
                    : days !== null && days <= 14
                      ? "bg-red-50 border-red-200"
                      : "bg-card border-border",
                )}
              >
                <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground font-sans mb-1">
                  <Timer className="h-4 w-4" /> Application Status
                </p>
                <p className="text-xl font-bold text-navy font-heading mt-1 mb-1">
                  {new Date(o.deadline).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                {isClosed ? (
                  <p className="text-sm font-bold font-sans text-red-700 mt-1">
                    Application Closed
                  </p>
                ) : (
                  days !== null && (
                    <p
                      className={cn(
                        "text-sm font-bold font-sans mt-1",
                        days <= 14 ? "text-destructive" : "text-green-700",
                      )}
                    >
                      {days === 0 ? "Closes today!" : `${days} days remaining`}
                    </p>
                  )
                )}
              </div>
            )}

            {/* Sidebar Ad Banner */}
            <AdBanner variant="sidebar" />

            {/* Newsletter Widget */}
            <NewsletterWidget />

            {/* Contextual Similar Opportunities */}
            {data.related && data.related.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5 pb-2 border-b border-border/60">
                  <h3 className="text-sm font-bold text-navy uppercase tracking-wider font-heading">
                    Similar Opportunities
                  </h3>
                  <Link
                    to="/opportunities"
                    search={{ type: o.opportunity_type }}
                    className="text-xs text-primary hover:underline"
                  >
                    View all
                  </Link>
                </div>

                <div className="flex flex-col gap-5">
                  {(data.related as OpportunityCardData[]).slice(0, 5).map((opp) => (
                    <Link
                      key={opp.id}
                      to="/opportunities/$slug"
                      params={{ slug: opp.slug }}
                      className="group flex gap-3.5 items-start"
                    >
                      <div className="shrink-0 w-14 h-14 rounded-xl overflow-hidden border border-border bg-muted">
                        <img
                          src={getImageUrl(opp.featured_image ?? opp.image_url)}
                          alt={opp.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block">
                          {typeLabel(opp.opportunity_type)}
                        </span>
                        <h4 className="text-xs font-bold text-navy leading-snug group-hover:text-secondary transition-colors line-clamp-2 mt-0.5">
                          {opp.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </section>
    </SiteLayout>
  );
}
