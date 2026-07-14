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
      <section className="bg-gradient-hero px-4 py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-navy-foreground sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-navy-foreground/75">{description}</p>
          <Button asChild className="mt-6 rounded-full bg-gradient-green px-6 font-semibold text-success-foreground shadow-glow">
            <Link to="/opportunities" search={{ type }}>
              Search & Filter {title} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        {data.items.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No {title.toLowerCase()} available right now — check back soon!
          </p>
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
  return {
    meta: [
      { title: `${title} — ScholarsConnect` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — ScholarsConnect` },
      { property: "og:description", content: description },
      { property: "og:url", content: path },
    ],
    links: [{ rel: "canonical", href: path }],
  };
}