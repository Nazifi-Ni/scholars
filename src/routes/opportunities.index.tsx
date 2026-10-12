// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, SlidersHorizontal, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { OpportunityCard } from "@/components/OpportunityCard";
import { RouteErrorFallback, RouteNotFoundFallback } from "@/components/RouteFallbacks";
import { searchQuery, filterOptionsQuery } from "@/lib/queries";
import {
  OPPORTUNITY_TYPES,
  FUNDING_TYPES,
  DEGREE_LEVELS,
  typeLabel,
  fundingLabel,
  type OpportunityCardData,
  type SearchFilters,
} from "@/lib/sc-shared";
import { cn } from "@/lib/utils";

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
  head: ({ deps }) => {
    const hasSearchQuery = !!deps?.q;
    return {
      meta: [
        { title: "Browse Verified Opportunities — ScholarsConnect" },
        {
          name: "description",
          content:
            "Discover verified scholarships, internships, grants, and fellowships for African students. Filter by destination country, degree level, and funding category.",
        },
        { property: "og:title", content: "Browse Opportunities — ScholarsConnect" },
        {
          property: "og:description",
          content:
            "Discover verified scholarships, internships, grants, and fellowships for African students.",
        },
        { property: "og:url", content: "https://www.scholarsconnect.com.ng/opportunities" },
        ...(hasSearchQuery ? [{ name: "robots", content: "noindex, follow" }] : []),
      ],
      links: [{ rel: "canonical", href: "https://www.scholarsconnect.com.ng/opportunities" }],
    };
  },
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
    navigate({
      search: (prev: SearchFilters) => ({ ...prev, ...patch, page: patch.page ?? undefined }),
    });

  const activeFilterCount = ["type", "category", "country", "funding", "degree"].filter(
    (k) => search[k as keyof SearchFilters],
  ).length;

  const totalPages = Math.ceil(results.count / results.pageSize);

  return (
    <SiteLayout>
      {/* Header Search Banner */}
      <section className="bg-gradient-hero px-4 py-12 lg:px-8 border-b border-navy-light shadow-inner">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight mb-2">
              Browse Opportunities
            </h1>
            <p className="text-sm sm:text-base text-white/80 font-sans">
              {results.count.toLocaleString()} opportunities available. Filter by destination,
              degree level, and funding category.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              update({ q: keyword.trim() || undefined, page: undefined });
            }}
            className="mt-6 flex flex-col sm:flex-row max-w-2xl gap-2 rounded-xl bg-white p-2 shadow-lg"
          >
            <div className="flex flex-1 items-center gap-2.5 px-3 py-2 sm:py-0">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search by keyword, university, program…"
                className="w-full bg-transparent text-sm sm:text-base text-navy outline-none placeholder:text-muted-foreground font-sans"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => {
                    setKeyword("");
                    update({ q: undefined, page: undefined });
                  }}
                  className="p-1 text-muted-foreground hover:text-navy"
                  aria-label="Clear keyword"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              className="w-full sm:w-auto h-11 rounded-lg bg-navy px-7 text-sm font-bold text-white hover:bg-navy/90 transition-all"
            >
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Main Filter & Results Section */}
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between rounded-xl border-border/80 bg-white h-11 px-4 text-xs font-bold text-navy shadow-sm"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-secondary" />
              {showFilters ? "Hide Filter Options" : "Show Filter Options"}
            </span>
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-secondary text-white text-[10px] font-bold px-2 py-0.5">
                {activeFilterCount} active
              </span>
            )}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Filter Sidebar */}
          <aside className={cn("w-full lg:w-64 shrink-0", !showFilters && "hidden lg:block")}>
            <div className="sticky top-24 bg-white rounded-xl border border-border/80 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/60">
                <h3 className="font-bold text-navy text-base flex items-center gap-2 font-heading">
                  <SlidersHorizontal className="h-4 w-4 text-secondary" /> Filters
                  {activeFilterCount > 0 && (
                    <span className="text-xs bg-navy/10 text-navy px-1.5 py-0.5 rounded-full font-sans font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </h3>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={() => navigate({ search: { q: search.q, sort: search.sort } })}
                    className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="h-3 w-3" /> Reset
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans">
                    Type
                  </label>
                  <FilterSelect
                    value={search.type}
                    placeholder="All Types"
                    items={OPPORTUNITY_TYPES.map((t) => ({ value: t.value, label: t.label }))}
                    onChange={(v) => update({ type: v, page: undefined })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans">
                    Category
                  </label>
                  <FilterSelect
                    value={search.category}
                    placeholder="All Categories"
                    items={options.categories.map((c) => ({ value: c.slug, label: c.name }))}
                    onChange={(v) => update({ category: v, page: undefined })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans">
                    Country
                  </label>
                  <FilterSelect
                    value={search.country}
                    placeholder="All Countries"
                    items={options.countries.map((c) => ({
                      value: c.slug,
                      label: `${c.flag_emoji ?? ""} ${c.name}`,
                    }))}
                    onChange={(v) => update({ country: v, page: undefined })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans">
                    Funding
                  </label>
                  <FilterSelect
                    value={search.funding}
                    placeholder="All Funding"
                    items={FUNDING_TYPES.map((f) => ({ value: f.value, label: f.label }))}
                    onChange={(v) => update({ funding: v, page: undefined })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans">
                    Degree Level
                  </label>
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

          {/* Main Content Area */}
          <div className="flex-1 w-full min-w-0">
            {/* Control Bar: Active Count & Sort */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
              <p className="text-sm text-muted-foreground font-sans">
                Showing <strong className="text-navy">{results.count}</strong> opportunities
              </p>
              <div className="w-full sm:w-48">
                <FilterSelect
                  value={search.sort}
                  placeholder="Sort: Newest"
                  items={SORTS.map((s) => ({ value: s.value, label: s.label }))}
                  onChange={(v) => update({ sort: v, page: undefined })}
                />
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-xs text-muted-foreground font-semibold">Active:</span>
                {search.type && (
                  <button
                    type="button"
                    onClick={() => update({ type: undefined, page: undefined })}
                    className="inline-flex items-center gap-1.5 rounded-full bg-navy/5 hover:bg-navy/10 px-3 py-1 text-xs font-semibold text-navy border border-navy/10 transition-colors"
                  >
                    <span>Type: {typeLabel(search.type)}</span>
                    <X className="h-3 w-3 opacity-60 hover:opacity-100" />
                  </button>
                )}
                {search.category && (
                  <button
                    type="button"
                    onClick={() => update({ category: undefined, page: undefined })}
                    className="inline-flex items-center gap-1.5 rounded-full bg-navy/5 hover:bg-navy/10 px-3 py-1 text-xs font-semibold text-navy border border-navy/10 transition-colors"
                  >
                    <span>
                      Category:{" "}
                      {options.categories.find((c) => c.slug === search.category)?.name ??
                        search.category}
                    </span>
                    <X className="h-3 w-3 opacity-60 hover:opacity-100" />
                  </button>
                )}
                {search.country && (
                  <button
                    type="button"
                    onClick={() => update({ country: undefined, page: undefined })}
                    className="inline-flex items-center gap-1.5 rounded-full bg-navy/5 hover:bg-navy/10 px-3 py-1 text-xs font-semibold text-navy border border-navy/10 transition-colors"
                  >
                    <span>
                      Country:{" "}
                      {options.countries.find((c) => c.slug === search.country)?.name ??
                        search.country}
                    </span>
                    <X className="h-3 w-3 opacity-60 hover:opacity-100" />
                  </button>
                )}
                {search.funding && (
                  <button
                    type="button"
                    onClick={() => update({ funding: undefined, page: undefined })}
                    className="inline-flex items-center gap-1.5 rounded-full bg-navy/5 hover:bg-navy/10 px-3 py-1 text-xs font-semibold text-navy border border-navy/10 transition-colors"
                  >
                    <span>Funding: {fundingLabel(search.funding)}</span>
                    <X className="h-3 w-3 opacity-60 hover:opacity-100" />
                  </button>
                )}
                {search.degree && (
                  <button
                    type="button"
                    onClick={() => update({ degree: undefined, page: undefined })}
                    className="inline-flex items-center gap-1.5 rounded-full bg-navy/5 hover:bg-navy/10 px-3 py-1 text-xs font-semibold text-navy border border-navy/10 transition-colors"
                  >
                    <span>Degree: {search.degree}</span>
                    <X className="h-3 w-3 opacity-60 hover:opacity-100" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigate({ search: { q: search.q, sort: search.sort } })}
                  className="text-xs font-bold text-rose-600 hover:underline ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Results Grid or Rich Empty State */}
            {results.items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-10 sm:p-14 text-center max-w-lg mx-auto font-sans shadow-sm">
                <div className="h-12 w-12 rounded-full bg-navy/5 flex items-center justify-center mx-auto mb-4 text-navy">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold text-navy font-heading mb-1.5">
                  No opportunities match these filters yet
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-sans">
                  Try broadening your search keyword or clearing selected degree levels and funding
                  categories.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button
                    onClick={() => navigate({ search: {} })}
                    className="rounded-xl bg-navy text-white text-xs font-bold px-5"
                  >
                    Clear All Filters
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl border-border text-xs font-bold px-5"
                  >
                    <Link to="/opportunities">Browse All Opportunities</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                  className="rounded-xl border-border text-xs font-bold"
                  disabled={results.page === 0}
                  onClick={() => update({ page: results.page - 1 || undefined })}
                >
                  Previous
                </Button>
                <span className="px-3 text-xs font-semibold text-muted-foreground font-sans">
                  Page {results.page + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-border text-xs font-bold"
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
    <Select value={value ?? "__all"} onValueChange={(v) => onChange(v === "__all" ? undefined : v)}>
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
