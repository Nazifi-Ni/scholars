import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  BadgeCheck, Calendar, ExternalLink, Globe2, GraduationCap, Building2,
  Mail, Star, Timer, Eye, Bookmark, ArrowRight, CheckCircle2, FileText, Info, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { OpportunityCard } from "@/components/OpportunityCard";
import { RouteErrorFallback, RouteNotFoundFallback } from "@/components/RouteFallbacks";
import { opportunityQuery } from "@/lib/queries";
import { fundingLabel, typeLabel, daysUntil, getImageUrl, DEGREE_LEVELS, type OpportunityCardData } from "@/lib/sc-shared";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { cn } from "@/lib/utils";
import { WhatsAppBanner } from "@/components/WhatsAppBanner";
import { NewsletterWidget } from "@/components/NewsletterWidget";
import { AdBanner } from "@/components/AdBanner";

export const Route = createFileRoute("/opportunities/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(opportunityQuery(params.slug));
    if (!data.opportunity) throw notFound();
    return data;
  },
  head: ({ params, loaderData }) => {
    if (!loaderData?.opportunity) {
      return { meta: [{ title: "Opportunity Not Found — ScholarsConnect" }, { name: "robots", content: "noindex" }] };
    }
    const o = loaderData.opportunity;
    const title = o.meta_title ?? `${o.title} — ScholarsConnect`;
    const desc = o.meta_description ?? o.summary ?? "";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:image", content: getImageUrl(o.featured_image ?? o.image_url) },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: getImageUrl(o.featured_image ?? o.image_url) },
        { property: "og:url", content: `/opportunities/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/opportunities/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOccupationalProgram",
            name: o.title,
            description: desc,
            ...(o.deadline ? { applicationDeadline: o.deadline } : {}),
          }),
        },
      ],
    };
  },
  errorComponent: RouteErrorFallback,
  notFoundComponent: RouteNotFoundFallback,
  component: OpportunityDetailPage,
});

function DetailSection({ title, content }: { title: string; content: string | null }) {
  if (!content) return null;
  return (
    <section className="mb-8">
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="bg-muted/30 border-b border-border px-6 py-4">
          <h2 className="text-xl font-bold text-navy font-heading">{title}</h2>
        </div>
        <div className="px-6 py-6 whitespace-pre-line text-[16px] leading-relaxed text-foreground/80 font-sans">
          {content}
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
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(o.id);

  return (
    <SiteLayout>
      {/* Immersive Header Meta Info Card */}
      <section className="relative overflow-hidden pt-8 pb-16 px-4 lg:px-8 bg-navy text-white border-b border-border">
        {/* Blurred Background Image Overlay */}
        {(o.featured_image || o.image_url) && (
          <>
            <div 
              className="absolute inset-0 z-0 opacity-20 scale-105 blur-2xl"
              style={{
                backgroundImage: `url('${getImageUrl(o.featured_image ?? o.image_url)}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-navy via-navy/80 to-transparent" />
          </>
        )}

        <div className="relative z-10 mx-auto max-w-7xl">
          <nav className="text-[10px] md:text-xs font-bold tracking-wider uppercase text-white/60 font-sans mb-8">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            {" / "}
            <Link to="/opportunities" className="hover:text-white transition-colors">Opportunities</Link>
            {" / "}
            <span className="text-secondary">{typeLabel(o.opportunity_type)}</span>
          </nav>
          
          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Featured Image - Beautiful floating card */}
            {(o.featured_image || o.image_url) && (
              <div className="shrink-0 w-full md:w-[320px] lg:w-[420px] aspect-video rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/10 bg-white group">
                <img 
                  src={getImageUrl(o.featured_image ?? o.image_url)} 
                  alt={o.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
            )}
            
            {/* Meta Information */}
            <div className="flex-1 w-full pt-2">
              <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl font-heading mb-5 drop-shadow-md">
                {o.title}
              </h1>
              
              {o.summary && <p className="text-base md:text-lg text-white/80 font-sans mb-8 max-w-3xl leading-relaxed">{o.summary}</p>}
              
              <div className="flex flex-wrap items-center gap-4 font-sans">
                <span className="rounded-full bg-secondary text-navy px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-md">
                  {typeLabel(o.opportunity_type)}
                </span>
                <span className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-md">
                  {fundingLabel(o.funding_type)}
                </span>
                {o.is_verified && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 px-4 py-2 text-xs font-bold text-blue-100 uppercase tracking-wider shadow-md">
                    <BadgeCheck className="h-4 w-4 text-blue-300" /> Verified
                  </span>
                )}
                
                <div className="ml-auto flex items-center gap-5 text-xs text-white/60 font-semibold bg-white/5 backdrop-blur-sm px-5 py-3 rounded-full shadow-inner border border-white/10 mt-6 sm:mt-0 w-full sm:w-auto justify-center">
                  <span className="inline-flex items-center gap-2"><Eye className="h-4 w-4 text-white/40" />{o.views_count.toLocaleString()} Views</span>
                  <div className="w-px h-4 bg-white/20"></div>
                  <span className="inline-flex items-center gap-2"><Bookmark className="h-4 w-4 text-white/40" />{o.bookmarks_count.toLocaleString()} Saved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 lg:grid-cols-12 lg:px-8">
        
        {/* Main Content Area (67%) */}
        <div className="lg:col-span-8">
          
          {/* Summary Section */}
          <section className="mb-12 border-b border-border/60 pb-10">
            <h2 className="text-2xl font-bold text-navy font-heading mb-6">{o.title} Summary</h2>
            <ul className="space-y-5 text-[16px] font-sans text-foreground/90 list-disc pl-6 marker:text-secondary/70">
              {o.country && (
                <li><strong className="text-navy">Host Country:</strong> {o.country.flag_emoji} {o.country.name}</li>
              )}
              {o.university && (
                <li><strong className="text-navy">Study Abroad:</strong> {o.university.name}</li>
              )}
              {o.organization && (
                <li><strong className="text-navy">Organization:</strong> {o.organization.name}</li>
              )}
              <li>
                <strong className="text-navy">Category:</strong> {DEGREE_LEVELS.filter((l) => o.degree_levels.includes(l.value)).map(l => l.label).join(" | ")}
              </li>
              <li><strong className="text-navy">Eligible Countries:</strong> Global</li>
              <li><strong className="text-navy">Reward:</strong> {fundingLabel(o.funding_type)}</li>
              {o.deadline && (
                <li><strong className="text-navy">Deadline:</strong> {new Date(o.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</li>
              )}
            </ul>
          </section>

          {/* Details Sections */}
          <DetailSection title="Eligibility Requirements" content={o.eligibility} />
          <DetailSection title="Benefits" content={o.benefits} />
          <DetailSection title="Required Documents" content={o.required_documents} />
          <DetailSection title="How to Apply (Step by Step)" content={o.application_procedure} />

          {/* Ad Placeholder inside content */}
          <AdBanner className="my-8" />

          {/* WhatsApp Banner */}
          <WhatsAppBanner className="mt-8 mb-4" />

          {/* Action Buttons */}
          <div className="mt-14 flex flex-col sm:flex-row items-stretch sm:items-start gap-4">
            {days !== null && days < 0 ? (
               <Button disabled className="w-full sm:w-auto rounded-none px-8 py-7 text-[15px] font-bold uppercase tracking-wider">
                  Applications Closed
               </Button>
            ) : o.application_link ? (
               <Button asChild className="w-full sm:w-auto rounded-none bg-[#1d6b20] hover:bg-[#154e17] px-8 py-7 text-[15px] font-bold shadow-sm transition-transform hover:scale-[1.02] text-white uppercase tracking-wider">
                  <a href={o.application_link} target="_blank" rel="noopener noreferrer">
                    Click Here to Apply <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
               </Button>
            ) : o.official_website ? (
               <Button asChild className="w-full sm:w-auto rounded-none bg-[#1d6b20] hover:bg-[#154e17] px-8 py-7 text-[15px] font-bold shadow-sm transition-transform hover:scale-[1.02] text-white uppercase tracking-wider">
                  <a href={o.official_website} target="_blank" rel="noopener noreferrer">
                    Click Here to Apply <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
               </Button>
            ) : (
               <Button disabled className="w-full sm:w-auto rounded-none px-8 py-7 text-[15px] font-bold uppercase tracking-wider">
                  Apply Link Not Available
               </Button>
            )}

            <Button 
              className="w-full sm:w-auto rounded-none bg-navy hover:bg-navy/90 px-8 py-7 text-[15px] font-bold shadow-sm transition-transform hover:scale-[1.02] text-white uppercase tracking-wider"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: o.title, url: window.location.href });
                } else {
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(o.title + ' ' + window.location.href)}`, '_blank');
                }
              }}
            >
              Share This Scholarship <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          {o.deadline && (
            <p className="mt-8 text-[16px] text-foreground/90 font-sans">
              <strong className="text-navy">Deadline:</strong> {new Date(o.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
        </div>

        {/* Sidebar (33%) */}
        <aside className="lg:col-span-4">
           <div className="sticky top-24 space-y-12">
             
             {/* Action / Bookmark */}
             <div className="mb-8">
                <Button 
                  variant={bookmarked ? "secondary" : "outline"} 
                  className={cn("w-full rounded font-semibold transition-colors py-6 text-base shadow-sm", bookmarked && "bg-secondary/10 text-secondary hover:bg-secondary/20 border-secondary/20")}
                  onClick={() => toggleBookmark(o)}
                >
                  <Bookmark className={cn("mr-2 h-5 w-5", bookmarked && "fill-secondary")} />
                  {bookmarked ? "Saved to Bookmarks" : "Save for Later"}
                </Button>
             </div>

             {/* Deadline Countdown */}
             {o.deadline && (
              <div className={cn("rounded-xl p-6 text-center border shadow-sm mb-8", days !== null && days <= 14 ? "bg-red-50 border-red-100" : "bg-white border-border")}>
                <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground font-sans mb-2">
                  <Timer className="h-4 w-4" /> Application Deadline
                </p>
                <p className="text-xl font-bold text-navy font-heading mb-1">
                  {new Date(o.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                {days !== null && days >= 0 && (
                  <p className={cn("text-sm font-bold font-sans", days <= 14 ? "text-destructive" : "text-green-600")}>
                    {days === 0 ? "Closes today!" : `${days} days remaining`}
                  </p>
                )}
                {days !== null && days < 0 && (
                  <p className="text-sm font-bold font-sans text-muted-foreground">
                    Applications Closed
                  </p>
                )}
              </div>
             )}

             {/* WhatsApp Sidebar Widget */}
             <WhatsAppBanner variant="sidebar" className="mb-8" />

             {/* Newsletter Widget */}
             <NewsletterWidget className="mb-8" />

             {/* Ad Placeholder Sidebar */}
             <AdBanner variant="sidebar" className="mb-8" />

             {/* More Opportunities */}
             {data.related.length > 0 && (
               <div>
                 <div className="flex items-center gap-4 mb-8">
                   <h3 className="text-[15px] font-bold text-navy uppercase tracking-widest whitespace-nowrap">More Opportunities</h3>
                   <div className="flex-1 h-1 bg-secondary/80"></div>
                 </div>
                 
                 <div className="flex flex-col gap-6">
                   {(data.related as OpportunityCardData[]).slice(0, 6).map(opp => (
                     <Link key={opp.id} to="/opportunities/$slug" params={{ slug: opp.slug }} className="group flex gap-5 items-center">
                       <div className="shrink-0 w-20 h-20 rounded-full overflow-hidden border border-border shadow-sm">
                         <img src={getImageUrl(opp.featured_image ?? opp.image_url)} alt={opp.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                       </div>
                       <div className="flex-1">
                         <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1.5 block">
                           {typeLabel(opp.opportunity_type)}
                         </span>
                         <h4 className="text-[15px] font-bold text-navy leading-snug group-hover:text-secondary transition-colors line-clamp-3">
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