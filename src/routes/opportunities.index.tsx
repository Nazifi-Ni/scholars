import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { OpportunityCard } from "@/components/OpportunityCard";
import { RouteErrorFallback, RouteNotFoundFallback } from "@/components/RouteFallbacks";
import { searchQuery, filterOptionsQuery } from "@/lib/queries";
import {
  OPPORTUNITY_TYPES, FUNDING_TYPES, DEGREE_LEVELS,
  type OpportunityCardData, type SearchFilters,
} from "@/lib/sc-shared";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "deadline", label: "Closing Soon" },
  { value: "popular", label: "Most Popular" },
  { value: "featured", label: "Featured First" },
] as const;

export const Route = createFileRoute("/opportunities/")({
  validateSearch: (search: Record<string, unknown>): SearchFilters => ({
    q: typeof search.q === "string" ? search.q : undefined,
    type: typeof search.type === "string" ? search.type : undefined,
    category: typeof search.category === "string" ? search.category : undefined,
    country: typeof search.country === "string" ? search.country : undefined,
    funding: typeof search.funding === "string" ? search.funding : undefined,
    degree: typeof search.degree === "string" ? search.degree : undefined,
    sort: typeof search.sort === "string" ? search.sort : undefined,
    page: typeof search.page === "number" ? search.page : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    Promise.all([
      context.queryClient.ensureQueryData(searchQuery(deps)),
      context.queryClient.ensureQueryData(filterOptionsQuery),
    ]),
  head: () => ({
    meta: [
      { title: "Browse Opportunities — ScholarsConnect" },
      { name: "description", content: "Search 1,200+ verified scholarships, internships, grants, hackathons and jobs. Filter by country, funding, degree level and deadline." },
      { property: "og:title", content: "Browse Opportunities — ScholarsConnect" },
      { property: "og:description", content: "Search verified scholarships, internships, grants and jobs with smart filters." },
      { property: "og:url", content: "/opportunities" },
    ],
    links: [{ rel: "canonical", href: "/opportunities" }],
  }),
  errorComponent: RouteErrorFallback,
  notFoundComponent: RouteNotFoundFallback,
  component: BrowsePage,
});

function BrowsePage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data: results } = useSuspenseQuery(searchQuery(search));
  const { data: options } = useSuspenseQuery(filterOptionsQuery);
  const [keyword, setKeyword] = useState(search.q ?? "");
  const [showFilters, setShowFilters] = useState(false);

  const update = (patch: Partial<SearchFilters>) =>
    navigate({ search: (prev: SearchFilters) => ({ ...prev, ...patch, page: patch.page ?? undefined }) });

  const activeFilterCount = ["type", "category", "country", "funding", "degree"].filter(
    (k) => search[k as keyof SearchFilters],
  ).length;

  const totalPages = Math.ceil(results.count / results.pageSize);

  return (
    <SiteLayout>
      <section className="bg-gradient-hero px-4 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-navy-foreground sm:text-4xl">Browse Opportunities</h1>
          <p className="mt-2 text-navy-foreground/70">
            {results.count.toLocaleString()} verified opportunities. Filter to find your perfect match.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update({ q: keyword.trim() || undefined, page: undefined });
            }}
            className="mt-6 flex max-w-2xl gap-2 rounded-full glass p-2 shadow-card"
          >
            <div className="flex flex-1 items-center gap-2 pl-4">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search by keyword…"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Button type="submit" className="rounded-full bg-gradient-cta px-6 font-semibold">Search</Button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-24 bg-white rounded-xl border border-border p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-navy text-lg flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5" /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </h3>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs text-muted-foreground hover:text-red-600"
                    onClick={() => navigate({ search: { q: search.q, sort: search.sort } })}
                  >
                    Clear All
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Type</label>
                  <FilterSelect
                    value={search.type}
                    placeholder="All Types"
                    items={OPPORTUNITY_TYPES.map((t) => ({ value: t.value, label: t.label }))}
                    onChange={(v) => update({ type: v, page: undefined })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</label>
                  <FilterSelect
                    value={search.category}
                    placeholder="All Categories"
                    items={options.categories.map((c) => ({ value: c.slug, label: c.name }))}
                    onChange={(v) => update({ category: v, page: undefined })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Country</label>
                  <FilterSelect
                    value={search.country}
                    placeholder="All Countries"
                    items={options.countries.map((c) => ({ value: c.slug, label: `${c.flag_emoji ?? ""} ${c.name}` }))}
                    onChange={(v) => update({ country: v, page: undefined })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Funding</label>
                  <FilterSelect
                    value={search.funding}
                    placeholder="All Funding"
                    items={FUNDING_TYPES.map((f) => ({ value: f.value, label: f.label }))}
                    onChange={(v) => update({ funding: v, page: undefined })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Degree Level</label>
                  <FilterSelect
                    value={search.degree}
                    placeholder="All Degrees"
                    items={DEGREE_LEVELS.map((d) => ({ value: d.value, label: d.label }))}
                    onChange={(v) => update({ degree: v, page: undefined })}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-sans">
                Showing <strong>{results.count}</strong> opportunities
              </p>
              <div className="w-48">
                <FilterSelect
                  value={search.sort}
                  placeholder="Sort: Newest"
                  items={SORTS.map((s) => ({ value: s.value, label: s.label }))}
                  onChange={(v) => update({ sort: v, page: undefined })}
                />
              </div>
            </div>

            {results.items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card py-20 text-center">
                <p className="text-lg font-semibold text-foreground font-heading">No opportunities found</p>
                <p className="mt-1 text-sm text-muted-foreground font-sans">Try removing some filters or using a different keyword.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(results.items as OpportunityCardData[]).map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} />
                ))}
              </div>
            )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled={results.page === 0}
              onClick={() => update({ page: results.page - 1 || undefined })}
            >
              Previous
            </Button>
            <span className="px-3 text-sm text-muted-foreground">
              Page {results.page + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled={results.page + 1 >= totalPages}
              onClick={() => update({ page: results.page + 1 })}
            >
              Next
            </Button>
          </div>
        )}
        
        </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function FilterSelect({
  value,
  placeholder,
  items,
  onChange,
}: {
  value?: string;
  placeholder: string;
  items: { value: string; label: string }[];
  onChange: (value?: string) => void;
}) {
  return (
    <Select
      value={value ?? "__all"}
      onValueChange={(v) => onChange(v === "__all" ? undefined : v)}
    >
      <SelectTrigger className="h-9 w-full rounded-full border-border bg-card text-xs font-medium lg:w-auto lg:min-w-36">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-popover">
        <SelectItem value="__all">{placeholder}</SelectItem>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}