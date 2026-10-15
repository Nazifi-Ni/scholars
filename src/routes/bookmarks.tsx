import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { OpportunityCard } from "@/components/OpportunityCard";
import { useBookmarks } from "@/hooks/use-bookmarks";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({
    meta: [
      { title: "Saved Opportunities — ScholarsConnect" },
      {
        name: "description",
        content: "Review and manage your saved scholarships and opportunities.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookmarksPage,
});

function BookmarksPage() {
  const { bookmarks } = useBookmarks();

  return (
    <SiteLayout>
      <section className="bg-gradient-hero px-4 py-12 lg:px-8 border-b border-navy-light text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-secondary backdrop-blur-md border border-white/15 mb-3">
            <Bookmark className="h-3.5 w-3.5" />
            <span>Personal Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight mb-2">
            Saved Opportunities
          </h1>
          <p className="text-sm sm:text-base text-white/80 font-sans">
            Track your shortlisted scholarships, internships, and grants in one place.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {bookmarks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-6 sm:p-12 text-center max-w-md mx-auto shadow-soft">
            <div className="h-12 w-12 rounded-full bg-navy/5 flex items-center justify-center mx-auto mb-4 text-navy">
              <Bookmark className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-navy font-heading mb-1.5">
              No saved opportunities yet
            </h3>
            <p className="text-sm text-muted-foreground font-sans leading-relaxed mb-6">
              When you discover an opportunity you are interested in, click the bookmark icon on any
              card to track it here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                asChild
                className="w-full sm:w-auto rounded-xl bg-navy text-white text-xs font-bold px-5"
              >
                <Link to="/opportunities">
                  <Compass className="h-4 w-4 mr-1.5 text-secondary" />
                  Explore Opportunities
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto rounded-xl border-border text-xs font-bold px-5"
              >
                <Link to="/scholarships">Browse Scholarships</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-center justify-between pb-3 border-b border-border/60">
              <p className="text-sm font-semibold text-muted-foreground font-sans">
                You have <strong className="text-navy">{bookmarks.length}</strong> saved{" "}
                {bookmarks.length === 1 ? "opportunity" : "opportunities"}
              </p>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-xs text-secondary font-bold hover:underline"
              >
                <Link to="/opportunities">
                  Find more <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
