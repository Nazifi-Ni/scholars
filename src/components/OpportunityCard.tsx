import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Bookmark,
  Timer,
  Building2,
  GraduationCap,
  MapPin,
  DollarSign,
  BookOpen,
  Share2,
} from "lucide-react";
import {
  fundingLabel,
  typeLabel,
  daysUntil,
  getImageUrl,
  type OpportunityCardData,
} from "@/lib/sc-shared";
import { cn } from "@/lib/utils";
import { useBookmarks } from "@/hooks/use-bookmarks";

export function OpportunityCard({ opportunity }: { opportunity: OpportunityCardData }) {
  const days = daysUntil(opportunity.deadline);
  const provider =
    opportunity.provider || opportunity.university?.name || opportunity.organization?.name;
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(opportunity.id);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = window.location.origin + "/opportunities/" + opportunity.slug;
    const text = `Check out this ${opportunity.title} on ScholarsConnect!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Link
      to="/opportunities/$slug"
      params={{ slug: opportunity.slug }}
      className="group flex flex-col bg-white rounded-2xl border border-border shadow-sm hover:shadow-card hover:border-border/80 transition-all overflow-hidden relative h-full"
    >
      {/* Top Featured Cover Image Banner */}
      <div className="relative w-full aspect-[16/10] sm:aspect-video bg-muted overflow-hidden shrink-0 border-b border-border">
        {opportunity.featured_image ? (
          <img
            src={getImageUrl(opportunity.featured_image)}
            alt={opportunity.title}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-navy/10 via-navy/5 to-secondary/10">
            <GraduationCap className="h-12 w-12 text-navy/30" />
          </div>
        )}

        {/* Subtle Dark Vignette Gradient for Badge Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top-left: Opportunity Type Badge */}
        <span
          className={cn(
            "absolute top-3 left-3 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md z-10",
            opportunity.opportunity_type === "scholarship"
              ? "bg-blue-600/95 text-white"
              : opportunity.opportunity_type === "internship"
                ? "bg-purple-600/95 text-white"
                : opportunity.opportunity_type === "competition"
                  ? "bg-amber-600/95 text-white"
                  : opportunity.opportunity_type === "grant"
                    ? "bg-emerald-600/95 text-white"
                    : "bg-navy/95 text-white",
          )}
        >
          {typeLabel(opportunity.opportunity_type)}
        </span>

        {/* Top-right Status Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {opportunity.is_verified && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600/95 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md">
              <BadgeCheck className="h-3 w-3" />
              Verified
            </span>
          )}
          {opportunity.is_sponsored && (
            <span className="rounded-md bg-amber-500/95 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md">
              Sponsored
            </span>
          )}
          {opportunity.is_featured && !opportunity.is_sponsored && (
            <span className="rounded-md bg-highlight text-navy px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md">
              Featured
            </span>
          )}
          {(opportunity.is_expired || (days !== null && days < 0)) && (
            <span className="rounded-md bg-gray-900/90 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md">
              Closed
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        {provider && (
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1 line-clamp-1">
            {provider}
          </span>
        )}
        <h3 className="line-clamp-2 text-base sm:text-lg font-bold leading-snug text-navy transition-colors group-hover:text-secondary font-heading mb-3">
          {opportunity.title}
        </h3>

        {/* Tags Row: Country, Funding, Degree Level, Difficulty */}
        <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
          {opportunity.country && (
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground border border-border/50">
              {opportunity.country.flag_emoji} {opportunity.country.name}
            </span>
          )}
          {fundingLabel(opportunity.funding_type) && (
            <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-[11px] font-semibold text-green-700 border border-green-200">
              <DollarSign className="h-3 w-3" /> {fundingLabel(opportunity.funding_type)}
            </span>
          )}
          {opportunity.degree_levels &&
            opportunity.degree_levels.length > 0 &&
            opportunity.degree_levels[0] !== "not_applicable" &&
            opportunity.degree_levels[0] !== "Not Applicable" && (
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700 border border-blue-200">
                <BookOpen className="h-3 w-3" /> {opportunity.degree_levels[0]}
                {opportunity.degree_levels.length > 1 && (
                  <span className="opacity-70 ml-0.5">+{opportunity.degree_levels.length - 1}</span>
                )}
              </span>
            )}
          {opportunity.application_difficulty && (
            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-[11px] font-semibold text-purple-700 border border-purple-200">
              {opportunity.application_difficulty}
            </span>
          )}
        </div>

        {/* Action Row: Save, Share, Deadline */}
        <div className="pt-3 flex items-center justify-between border-t border-border/60">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleBookmark(opportunity);
              }}
              className="flex items-center gap-1.5 rounded-md hover:bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-navy"
            >
              <Bookmark
                className={cn(
                  "h-4 w-4 transition-colors",
                  bookmarked ? "fill-secondary text-secondary" : "",
                )}
              />
              <span className="hidden sm:inline">{bookmarked ? "Saved" : "Save"}</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-md hover:bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-green-600"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

          {days !== null && days >= 0 ? (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-bold",
                days < 7 ? "text-destructive" : "text-muted-foreground",
              )}
            >
              <Timer className="h-3.5 w-3.5" />
              {days === 0 ? "Closes today" : `${days} days left`}
            </span>
          ) : (
            opportunity.deadline && (
              <span className="text-xs text-muted-foreground font-medium">
                {new Date(opportunity.deadline).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )
          )}
        </div>
      </div>
    </Link>
  );
}
