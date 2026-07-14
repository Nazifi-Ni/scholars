import { Link } from "@tanstack/react-router";
import { BadgeCheck, Bookmark, Eye, Star, Timer, Building2, GraduationCap } from "lucide-react";
import { fundingLabel, typeLabel, daysUntil, getImageUrl, type OpportunityCardData } from "@/lib/sc-shared";
import { cn } from "@/lib/utils";
import { useBookmarks } from "@/hooks/use-bookmarks";

const TYPE_STYLES: Record<string, string> = {
  scholarship: "bg-accent/10 text-accent",
  internship: "bg-secondary/10 text-secondary",
  competition: "bg-highlight/20 text-highlight-foreground",
  hackathon: "bg-primary/10 text-primary",
  grant: "bg-secondary/10 text-secondary",
  job: "bg-accent/10 text-accent",
  course: "bg-primary/10 text-primary",
};

export function OpportunityCard({ opportunity }: { opportunity: OpportunityCardData }) {
  const days = daysUntil(opportunity.deadline);
  const provider = opportunity.university?.name ?? opportunity.organization?.name;
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(opportunity.id);

  return (
    <Link
      to="/opportunities/$slug"
      params={{ slug: opportunity.slug }}
      className="group flex flex-col bg-white rounded-2xl border border-border shadow-sm hover:shadow-card transition-all overflow-hidden relative h-full"
    >
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleBookmark(opportunity);
        }}
        className="absolute top-3 right-3 z-10 rounded-full p-2 bg-white/90 backdrop-blur-sm shadow-sm hover:bg-secondary/10 hover:text-secondary transition-colors border border-border/50 opacity-0 group-hover:opacity-100 sm:opacity-100 focus:opacity-100"
        aria-label="Bookmark"
      >
        <Bookmark className={cn("h-4 w-4 transition-colors", bookmarked ? "fill-secondary text-secondary" : "text-muted-foreground")} />
      </button>

      <div className="w-full h-48 bg-muted relative overflow-hidden shrink-0">
        <img 
          src={getImageUrl(opportunity.featured_image ?? opportunity.image_url)} 
          alt={opportunity.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
          {opportunity.is_featured && (
            <span className="rounded bg-highlight/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-navy shadow-sm uppercase tracking-wider">Featured</span>
          )}
          <span className={cn("rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm", 
            opportunity.opportunity_type === 'scholarship' ? 'bg-blue-100/90 text-blue-800' :
            opportunity.opportunity_type === 'internship' ? 'bg-purple-100/90 text-purple-800' :
            'bg-white/90 text-navy'
          )}>
            {typeLabel(opportunity.opportunity_type)}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {opportunity.country ? (
              <span>{opportunity.country.flag_emoji} {opportunity.country.name}</span>
            ) : (
              <span>🌍 Global</span>
            )}
          </div>
          {opportunity.is_verified && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-2 py-0.5 rounded-full">
              Verified <BadgeCheck className="h-3 w-3" />
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-navy transition-colors group-hover:text-secondary font-heading mb-3">
          {opportunity.title}
        </h3>

        {provider && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans mb-4">
            {opportunity.university ? <GraduationCap className="h-4 w-4 shrink-0 text-navy/40" /> : <Building2 className="h-4 w-4 shrink-0 text-navy/40" />}
            <span className="truncate">{provider}</span>
          </div>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/60">
          <span className="rounded bg-navy/5 border border-border px-2.5 py-1 text-xs font-semibold text-navy">
            {fundingLabel(opportunity.funding_type)}
          </span>
          {days !== null && days >= 0 && (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-bold",
                days <= 14 ? "text-destructive" : "text-muted-foreground",
              )}
            >
              <Timer className="h-3.5 w-3.5" />
              {days === 0 ? "Closes today" : `${days} days left`}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}