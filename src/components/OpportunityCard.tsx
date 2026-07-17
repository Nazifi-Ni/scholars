import { Link } from "@tanstack/react-router";
import { BadgeCheck, Bookmark, Timer, Building2, GraduationCap, MapPin, DollarSign, BookOpen, Share2 } from "lucide-react";
import { fundingLabel, typeLabel, daysUntil, getImageUrl, type OpportunityCardData } from "@/lib/sc-shared";
import { cn } from "@/lib/utils";
import { useBookmarks } from "@/hooks/use-bookmarks";

export function OpportunityCard({ opportunity }: { opportunity: OpportunityCardData }) {
  const days = daysUntil(opportunity.deadline);
  const provider = opportunity.university?.name ?? opportunity.organization?.name;
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(opportunity.id);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = window.location.origin + "/opportunities/" + opportunity.slug;
    const text = `Check out this ${opportunity.title} on ScholarsConnect!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Link
      to="/opportunities/$slug"
      params={{ slug: opportunity.slug }}
      className="group flex flex-col bg-white rounded-2xl border border-border shadow-sm hover:shadow-card transition-all overflow-hidden relative h-full"
    >
      {/* Top Banner Area with Logo */}
      <div className="w-full h-32 bg-gradient-to-r from-navy/5 to-navy/10 relative shrink-0 border-b border-border">
        {opportunity.is_featured && (
          <span className="absolute top-3 right-3 rounded bg-highlight/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-navy shadow-sm uppercase tracking-wider">
            Featured
          </span>
        )}
        <span className={cn("absolute top-3 left-3 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm", 
            opportunity.opportunity_type === 'scholarship' ? 'bg-blue-100/90 text-blue-800' :
            opportunity.opportunity_type === 'internship' ? 'bg-purple-100/90 text-purple-800' :
            'bg-white/90 text-navy'
          )}>
            {typeLabel(opportunity.opportunity_type)}
        </span>
        
        {/* Floating Logo */}
        <div className="absolute -bottom-8 left-5 h-16 w-16 rounded-xl border border-border bg-white shadow-md overflow-hidden flex items-center justify-center p-1 z-10">
          {opportunity.featured_image ? (
            <img 
              src={getImageUrl(opportunity.featured_image)} 
              alt={opportunity.title}
              className="h-full w-full object-cover rounded-lg"
            />
          ) : (
            <GraduationCap className="h-8 w-8 text-navy/20" />
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5 pt-10">
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-navy transition-colors group-hover:text-secondary font-heading mb-3">
          {opportunity.title}
        </h3>

        {/* Tags Row: Country, Funding, Degree */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground border border-border/50">
            {opportunity.country ? (
              <>{opportunity.country.flag_emoji} {opportunity.country.name}</>
            ) : (
              <><MapPin className="h-3 w-3" /> Global</>
            )}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-[11px] font-semibold text-green-700 border border-green-100">
            <DollarSign className="h-3 w-3" /> {fundingLabel(opportunity.funding_type)}
          </span>
          {opportunity.degree_levels && opportunity.degree_levels.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700 border border-blue-100">
              <BookOpen className="h-3 w-3" /> {opportunity.degree_levels[0]}
              {opportunity.degree_levels.length > 1 && <span className="opacity-70 ml-0.5">+{opportunity.degree_levels.length - 1}</span>}
            </span>
          )}
        </div>

        {/* Action Row: Save, Share, Deadline */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/60">
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleBookmark(opportunity);
              }}
              className="flex items-center gap-1.5 rounded-md hover:bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground transition-colors"
            >
              <Bookmark className={cn("h-4 w-4 transition-colors", bookmarked ? "fill-secondary text-secondary" : "")} />
              <span className="hidden sm:inline">{bookmarked ? "Saved" : "Save"}</span>
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-md hover:bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-green-600"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

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