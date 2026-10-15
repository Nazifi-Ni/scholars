import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { OpportunityCard } from "@/components/OpportunityCard";
import { searchQuery } from "@/lib/queries";
import type { OpportunityCardData } from "@/lib/sc-shared";

export function TypeLandingPage({
  type,
  title,
  description,
}: {
  type: string;
  title: string;
  description: string;
}) {
  const { data } = useSuspenseQuery(searchQuery({ type, sort: "featured" }));

  return (
    <SiteLayout>
      <section className="bg-gradient-hero px-4 py-8 sm:py-14 lg:px-8 border-b border-navy-light shadow-inner">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight mb-2">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl font-sans leading-relaxed">
            {description}
          </p>
          <Button
            asChild
            className="mt-5 sm:mt-6 rounded-xl bg-secondary hover:bg-green-600 px-6 font-bold text-white shadow-sm text-xs sm:text-sm w-full sm:w-auto"
          >
            <Link to="/opportunities" search={{ type }}>
              Search & Filter {title} <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-8">
        {data.items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-6 sm:p-12 text-center max-w-2xl mx-auto font-sans">
            <h2 className="text-lg sm:text-xl font-bold text-navy font-heading mb-2">
              Upcoming {title} in Review
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
              Our editorial desk is actively vetting new {title.toLowerCase()} for the upcoming
              application cycle. We confirm deadlines and eligibility directly with awarding bodies
              before publishing to ensure students receive carefully vetted opportunities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild className="rounded-xl bg-primary text-white w-full sm:w-auto">
                <Link to="/opportunities">
                  Browse All Opportunities <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl w-full sm:w-auto">
                <Link to="/blog">Read Application Guides</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(data.items as OpportunityCardData[]).map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

export function typeLandingHead(path: string, title: string, description: string) {
  const canonicalUrl = `https://www.scholarsconnect.com.ng${path.startsWith("/") ? path : "/" + path}`;
  return {
    meta: [
      { title: `${title} for African Students — ScholarsConnect` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — ScholarsConnect` },
      { property: "og:description", content: description },
      { property: "og:url", content: canonicalUrl },
    ],
    links: [{ rel: "canonical", href: canonicalUrl }],
  };
}
