import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { OpportunityCard } from "@/components/OpportunityCard";
import { useBookmarks } from "@/hooks/use-bookmarks";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({
    meta: [
      { title: "My Bookmarks — ScholarsConnect" },
      { name: "description", content: "View your saved scholarships and opportunities." },
      { name: "robots", content: "noindex" } 
    ],
  }),
  component: BookmarksPage,
});

function BookmarksPage() {
  const { bookmarks } = useBookmarks();

  return (
    <SiteLayout>
      <section className="bg-gradient-hero px-4 py-12 lg:px-8 text-center border-b border-border">
        <h1 className="text-3xl font-bold text-navy-foreground sm:text-4xl font-heading mb-3">Saved Bookmarks</h1>
        <p className="text-navy-foreground/70 max-w-2xl mx-auto">
          Your saved scholarships, internships, and opportunities.
          <br className="hidden sm:block" />
          <span className="text-xs sm:text-sm italic mt-2 inline-block">Note: Bookmarks are securely saved in your current browser.</span>
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        {bookmarks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card py-20 text-center shadow-sm">
            <h3 className="text-lg font-bold text-navy font-heading">No bookmarks yet</h3>
            <p className="mt-2 text-sm text-muted-foreground font-sans max-w-sm mx-auto">
              When you find an opportunity you like, click the bookmark icon to save it here for later.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
