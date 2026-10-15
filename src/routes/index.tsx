// @ts-nocheck
import { useState, useEffect, Fragment } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Search,
  ChevronRight,
  Mail,
  Clock,
  TrendingUp,
  BadgeCheck,
  Compass,
  ArrowRight,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { OpportunityCard } from "@/components/OpportunityCard";
import { ScholarshipQuiz } from "@/components/ScholarshipQuiz";
import { AdBanner } from "@/components/AdBanner";
import { homeQuery, blogListQuery } from "@/lib/queries";
import { Loader2 } from "lucide-react";
import { getImageUrl, daysUntil, fundingLabel, type OpportunityCardData } from "@/lib/sc-shared";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    // Fetch home data and blog data in parallel
    return await Promise.all([
      context.queryClient.ensureQueryData(homeQuery),
      context.queryClient.ensureQueryData(blogListQuery),
    ]);
  },
  head: ({ loaderData }) => {
    const homeData = loaderData?.[0]; // from Promise.all array
    const s = homeData?.settings || {};
    const siteTitle = s.site_name
      ? `${s.site_name} | ${s.site_tagline || "Find Scholarships"}`
      : "ScholarsConnect — Find Verified Scholarships & Internships";
    const siteDesc =
      s.meta_description ||
      "Discover verified scholarships, internships, grants, and academic opportunities for ambitious students across Africa.";
    const siteKeywords =
      s.meta_keywords || "scholarships, internships, jobs, study abroad, fully funded";

    return {
      meta: [
        { title: siteTitle },
        { name: "description", content: siteDesc },
        { name: "keywords", content: siteKeywords },
        { property: "og:title", content: siteTitle },
        { property: "og:description", content: siteDesc },
        { property: "og:url", content: "https://www.scholarsconnect.com.ng" },
      ],
      links: [{ rel: "canonical", href: "https://www.scholarsconnect.com.ng" }],
    };
  },
  component: HomePage,
  pendingComponent: () => (
    <SiteLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-5 px-4 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-secondary/20 rounded-full blur-xl animate-pulse"></div>
          <Loader2 className="h-16 w-16 animate-spin text-secondary relative z-10" />
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-navy tracking-tight font-heading">
          Waking up the server...
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto leading-relaxed">
          Our free servers go to sleep after inactivity. Please give it 30-60 seconds to boot up and
          fetch the latest opportunities for you!
        </p>
      </div>
    </SiteLayout>
  ),
});

const QUICK_CHIPS = [
  { label: "Scholarships", search: { type: "scholarship" } },
  { label: "Internships", search: { type: "internship" } },
  { label: "Fully Funded", search: { funding: "fully_funded" } },
  { label: "Grants", search: { type: "grant" } },
  { label: "Competitions", search: { type: "competition" } },
  { label: "Masters", search: { degree: "masters" } },
] as const;

function HomePage() {
  const { data } = useSuspenseQuery(homeQuery);
  const { data: blogData } = useSuspenseQuery(blogListQuery);
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sc_recent_searches");
      if (stored) setRecentSearches(JSON.parse(stored).slice(0, 4));
    } catch {
      // ignore
    }
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent, customTerm?: string) => {
    if (e) e.preventDefault();
    const query = (customTerm ?? q).trim();
    if (query) {
      try {
        const next = [
          query,
          ...recentSearches.filter((s) => s.toLowerCase() !== query.toLowerCase()),
        ].slice(0, 4);
        setRecentSearches(next);
        localStorage.setItem("sc_recent_searches", JSON.stringify(next));
      } catch {
        // ignore
      }
      navigate({ to: "/opportunities", search: { q: query } });
    } else {
      navigate({ to: "/opportunities" });
    }
  };

  const latestOpportunities = data.latest as OpportunityCardData[];
  const featuredOpportunity = data.featured?.[0] as OpportunityCardData | undefined;
  const remainingLatest = latestOpportunities.slice(0, 6);

  const closingSoon = [...latestOpportunities]
    .filter(
      (o) =>
        o.deadline &&
        daysUntil(o.deadline) !== null &&
        daysUntil(o.deadline)! >= 0 &&
        daysUntil(o.deadline)! < 7,
    )
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 4);

  const trending = [...latestOpportunities]
    .sort((a, b) => b.views_count + b.bookmarks_count - (a.views_count + a.bookmarks_count))
    .slice(0, 4);

  // Tabs for styling purposes, linking to actual filters
  const TABS = [
    { label: "All", search: {} },
    { label: "Scholarships", search: { type: "scholarship" } },
    { label: "Undergraduate", search: { degree: "undergraduate" } },
    { label: "Postgraduate", search: { degree: "postgraduate" } },
    { label: "Masters", search: { degree: "masters" } },
  ];

  return (
    <SiteLayout>
      <div className="bg-white">
        {/* Refined Discovery Hero Header */}
        <div className="bg-gradient-hero border-b border-navy-light pb-12 pt-10 shadow-inner relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 mix-blend-overlay"></div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Small Trust Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md border border-white/15 mb-4 animate-fade-up">
              <BadgeCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Verified opportunities for students and young professionals</span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 font-heading tracking-tight leading-tight max-w-3xl animate-fade-up">
              Find Opportunities That{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-secondary">
                Move You Forward.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-white/80 max-w-2xl mb-6 font-sans leading-relaxed animate-fade-up">
              Discover verified scholarships, internships, fellowships, and academic grants curated
              for ambitious students across Africa and worldwide.
            </p>

            {/* Discover Search Form */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row max-w-2xl gap-2 rounded-xl bg-white p-2 shadow-lg animate-fade-up"
            >
              <div className="flex flex-1 items-center gap-2.5 px-3 py-2 sm:py-0">
                <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search scholarships, internships, countries…"
                  className="w-full bg-transparent text-sm sm:text-base text-navy outline-none placeholder:text-muted-foreground font-sans"
                />
              </div>
              <Button
                type="submit"
                className="w-full sm:w-auto h-11 rounded-lg bg-navy px-7 text-sm font-bold text-white hover:bg-navy/90 transition-all"
              >
                Search
              </Button>
            </form>

            {/* Quick Filter Chips */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-white/60 mr-1 hidden sm:inline">
                Popular:
              </span>
              {QUICK_CHIPS.map((chip) => (
                <Link
                  key={chip.label}
                  to="/opportunities"
                  search={chip.search}
                  className="rounded-full bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1 text-xs font-medium text-white transition-colors"
                >
                  {chip.label}
                </Link>
              ))}
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/70">
                <span className="inline-flex items-center gap-1 text-white/50">
                  <History className="h-3 w-3" /> Recent:
                </span>
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSearchSubmit(undefined, term)}
                    className="rounded-md bg-white/5 hover:bg-white/15 px-2 py-0.5 text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Ad Banner */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-8 lg:px-8">
          <AdBanner />
        </div>

        {/* 70/30 Main Grid */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Left Column (67%) */}
            <div className="lg:col-span-8 space-y-10">
              {/* Latest Opportunities Section */}
              <section>
                {/* Section Header with Tabs */}
                <div className="mb-6 flex items-end justify-between border-b border-border pb-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-secondary block font-sans mb-1">
                      Fresh Discoveries
                    </span>
                    <h2 className="text-xl font-bold text-navy uppercase tracking-wide font-heading">
                      Latest Opportunities
                    </h2>
                  </div>
                  <div className="hidden md:flex gap-4 text-xs font-semibold text-muted-foreground font-sans">
                    {TABS.map((tab, i) => (
                      <Link
                        key={tab.label}
                        to="/opportunities"
                        search={tab.search}
                        className={`hover:text-secondary transition-colors ${i === 0 ? "text-navy font-bold" : ""}`}
                      >
                        {tab.label}
                      </Link>
                    ))}
                    <Link
                      to="/opportunities"
                      className="hover:text-secondary font-bold text-secondary transition-colors"
                    >
                      View All →
                    </Link>
                  </div>
                </div>

                {latestOpportunities.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {latestOpportunities.slice(0, 6).map((opp) => (
                        <OpportunityCard key={opp.id} opportunity={opp} />
                      ))}
                    </div>

                    {/* View All Button */}
                    <div className="mt-8 flex justify-center">
                      <Button
                        asChild
                        variant="outline"
                        className="rounded-xl border-border px-6 py-2.5 text-xs font-bold text-navy hover:bg-navy hover:text-white hover:border-navy transition-all"
                      >
                        <Link to="/opportunities">
                          Explore All{" "}
                          {latestOpportunities.length > 0
                            ? `${data.stats?.total_opportunities ?? "Verified"}`
                            : ""}{" "}
                          Opportunities
                          <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                        </Link>
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">No recent opportunities found.</p>
                )}
              </section>

              {/* Browse By Country Section */}
              {data.featured_countries && data.featured_countries.length > 0 && (
                <section className="pt-4">
                  <div className="mb-5 border-b border-border pb-2 flex justify-between items-end">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-secondary block font-sans mb-1">
                        Global Reach
                      </span>
                      <h2 className="text-xl font-bold text-navy uppercase tracking-wide font-heading">
                        Study Destinations
                      </h2>
                    </div>
                    <Link
                      to="/opportunities"
                      className="text-xs font-bold text-secondary hover:underline"
                    >
                      All Countries →
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {data.featured_countries.map((country) => (
                      <Link
                        key={country.id}
                        to="/opportunities"
                        search={{ country: country.slug }}
                        className="group flex flex-col items-center justify-center rounded-xl border border-border/80 bg-white py-4 px-2 shadow-sm hover:border-secondary hover:shadow hover:bg-secondary/5 transition-all duration-200"
                      >
                        <div className="h-11 w-11 rounded-full bg-muted/40 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform overflow-hidden border border-border/50">
                          {country.code ? (
                            <img
                              src={`https://flagsapi.com/${country.code.toUpperCase()}/flat/64.png`}
                              alt={country.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl">{country.flag_emoji || "🌍"}</span>
                          )}
                        </div>
                        <p className="font-bold text-navy text-center group-hover:text-secondary font-heading text-xs uppercase tracking-wider">
                          {country.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Browse By Category Section */}
              <section className="pt-4">
                <div className="mb-5 border-b border-border pb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-secondary block font-sans mb-1">
                    Specializations
                  </span>
                  <h2 className="text-xl font-bold text-navy uppercase tracking-wide font-heading">
                    Categories
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
                  {data.categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to="/opportunities"
                      search={{ category: cat.slug }}
                      className="group flex flex-col items-center justify-center rounded-xl border border-border/80 bg-white p-4 hover:border-secondary hover:shadow hover:bg-secondary/5 transition-all duration-200"
                    >
                      <div className="h-12 w-12 mb-2 rounded-full bg-navy/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <span className="text-2xl">{cat.icon || "🎓"}</span>
                      </div>
                      <p className="font-bold text-navy text-center group-hover:text-secondary font-heading text-xs sm:text-sm">
                        {cat.name}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Scholarship Quiz Section */}
              <section className="pt-8">
                <ScholarshipQuiz />
              </section>

              {/* Sponsored Offer Banner */}
              <section className="pt-8">
                <AdBanner />
              </section>

              {/* Featured Category Sections */}
              {data.featured_category_sections?.map((section) => (
                <section key={section.category.id} className="pt-10">
                  <div className="mb-6 flex items-center gap-4">
                    <h2 className="text-xl font-bold text-navy uppercase tracking-wide font-heading">
                      {section.category.name}
                    </h2>
                    <div className="flex-1 border-t-2 border-secondary/50"></div>
                  </div>

                  {/* Top Row: 2 Large Hero Cards */}
                  {section.opportunities.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 mb-4">
                      {section.opportunities.slice(0, 2).map((opp) => (
                        <Link
                          key={opp.id}
                          to="/opportunities/$slug"
                          params={{ slug: opp.slug }}
                          className="relative group h-[220px] sm:h-[280px] bg-muted overflow-hidden rounded-lg"
                        >
                          <img
                            src={getImageUrl(opp.featured_image ?? opp.image_url)}
                            alt={opp.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 to-transparent" />
                          <div className="absolute bottom-0 left-0 p-4 w-full">
                            <h3 className="text-lg sm:text-xl font-bold leading-tight text-white group-hover:underline font-heading line-clamp-3">
                              {opp.title}
                            </h3>
                            <div className="mt-2 text-[11px] text-gray-300 font-sans flex items-center gap-1.5">
                              <span className="font-bold text-white">ScholarsConnect</span>
                              <span>•</span>
                              <span>{new Date(opp.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Bottom Rows: 4 Small Cards */}
                  {section.opportunities.length > 2 && (
                    <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2 mt-6">
                      {section.opportunities.slice(2, 6).map((opp) => (
                        <div key={opp.id} className="flex gap-3 group items-start">
                          <Link
                            to="/opportunities/$slug"
                            params={{ slug: opp.slug }}
                            className="shrink-0"
                          >
                            <div className="h-16 w-24 overflow-hidden rounded border border-border group-hover:border-secondary transition-colors bg-muted">
                              <img
                                src={getImageUrl(opp.featured_image ?? opp.image_url)}
                                alt={opp.title}
                                loading="lazy"
                                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          </Link>
                          <div className="flex flex-col flex-1">
                            <h4 className="text-[13px] font-bold leading-snug text-navy group-hover:text-secondary line-clamp-2 font-heading">
                              <Link to="/opportunities/$slug" params={{ slug: opp.slug }}>
                                {opp.title}
                              </Link>
                            </h4>
                            <span className="text-[11px] text-muted-foreground mt-1 font-sans">
                              {new Date(opp.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-center mt-8">
                    <Link to="/opportunities" search={{ category: section.category.slug }}>
                      <Button
                        variant="outline"
                        className="text-muted-foreground hover:text-navy hover:border-navy transition-all h-9 text-xs px-6"
                      >
                        Load more <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </section>
              ))}
            </div>

            {/* Right Column (33%) - Sidebar */}
            <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-24 h-fit pb-10">
              {/* Sidebar Newsletter Widget */}
              <div className="rounded-lg bg-navy p-6 shadow-card text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Mail className="h-24 w-24 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 relative z-10 font-heading">
                  Never Miss a Deadline!
                </h3>
                <p className="text-sm text-white/80 mb-5 relative z-10 font-sans">
                  Join students across Nigeria and Africa discovering verified scholarships in their
                  inbox.
                </p>
                <form
                  className="flex flex-col gap-3 relative z-10"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full rounded bg-white/10 border border-white/20 px-4 py-2.5 text-sm text-white placeholder:text-white/60 focus:outline-none focus:border-secondary"
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full bg-secondary hover:bg-green-600 text-white font-bold py-2.5 font-sans"
                  >
                    Subscribe Now
                  </Button>
                </form>
              </div>

              {/* Sidebar Sponsored Offer 1 */}
              <AdBanner variant="sidebar" />

              {/* Deadline Countdown */}
              <div className="bg-white p-5 rounded-lg border border-border shadow-sm">
                <div className="mb-4 border-b-2 border-border pb-1">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-navy uppercase tracking-wide border-b-4 border-red-500 -mb-[3px] pb-1 font-heading">
                    <Clock className="h-4 w-4 text-red-500" /> Closing Soon
                  </h3>
                </div>
                <div className="space-y-4">
                  {closingSoon.map((opp) => (
                    <div
                      key={opp.id}
                      className="flex justify-between items-center gap-2 border-b border-border/50 pb-2 last:border-0 last:pb-0"
                    >
                      <Link
                        to="/opportunities/$slug"
                        params={{ slug: opp.slug }}
                        className="font-bold text-sm text-navy hover:text-secondary line-clamp-1 flex-1"
                      >
                        {opp.title}
                      </Link>
                      <span
                        className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full uppercase ${daysUntil(opp.deadline) !== null && daysUntil(opp.deadline)! < 7 ? "bg-red-100 text-red-700" : "bg-muted text-muted-foreground"}`}
                      >
                        {daysUntil(opp.deadline) === 0
                          ? "Today"
                          : `${daysUntil(opp.deadline)} Days`}
                      </span>
                    </div>
                  ))}
                  {closingSoon.length === 0 && (
                    <p className="text-sm text-muted-foreground">No upcoming deadlines.</p>
                  )}
                </div>
              </div>

              {/* Trending Opportunities */}
              <div className="bg-white p-5 rounded-lg border border-border shadow-sm">
                <div className="mb-4 border-b-2 border-border pb-1">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-navy uppercase tracking-wide border-b-4 border-secondary -mb-[3px] pb-1 font-heading">
                    <TrendingUp className="h-4 w-4 text-secondary" /> Trending
                  </h3>
                </div>
                <div className="space-y-4">
                  {trending.map((opp, idx) => (
                    <div key={opp.id} className="flex gap-3 items-center group">
                      <span className="text-2xl font-black text-muted/50 w-6 text-center">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <Link
                          to="/opportunities/$slug"
                          params={{ slug: opp.slug }}
                          className="font-bold text-sm text-navy hover:text-secondary line-clamp-2"
                        >
                          {opp.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold text-muted-foreground">
                          <span>👁 {opp.views_count} views</span>
                          <span>•</span>
                          <span>🔖 {opp.bookmarks_count} saves</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {trending.length === 0 && (
                    <p className="text-sm text-muted-foreground">No trending opportunities.</p>
                  )}
                </div>
              </div>

              {/* Sidebar Sponsored Offer 2 */}
              <AdBanner variant="sidebar" />

              {/* News & Blog Sidebar */}
              <div className="bg-white p-5 rounded-lg border border-border shadow-sm">
                <div className="mb-4 border-b-2 border-border pb-1">
                  <h3 className="inline-block text-lg font-bold text-navy uppercase tracking-wide border-b-4 border-red-600 -mb-[3px] pb-1 font-heading">
                    News & Blogs
                  </h3>
                </div>

                <div className="space-y-5">
                  {blogData?.posts?.slice(0, 5).map((post: any) => (
                    <div key={post.id} className="flex gap-3 group items-start">
                      <Link to="/blog/$slug" params={{ slug: post.slug }} className="shrink-0 pt-1">
                        <div className="h-14 w-14 overflow-hidden rounded border border-border group-hover:border-secondary transition-colors">
                          <img
                            src={getImageUrl(post.featured_image ?? post.image_url)}
                            alt={post.title}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </Link>
                      <div className="flex flex-col flex-1">
                        <h4 className="text-[13px] font-bold leading-snug text-navy group-hover:text-secondary line-clamp-2 font-heading">
                          <Link to="/blog/$slug" params={{ slug: post.slug }}>
                            {post.title}
                          </Link>
                        </h4>
                        <span className="text-[10px] text-muted-foreground mt-1 font-sans">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}

                  {!blogData?.posts?.length && (
                    <p className="text-sm text-muted-foreground">No recent news available.</p>
                  )}
                </div>
              </div>

              {/* Removed Stay Connected and Free Resources blocks to prevent AdSense "Low value content" and broken link penalties */}

              {/* Quick Links */}
              <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
                <div className="mb-4 border-b-2 border-border pb-1">
                  <h3 className="inline-block text-lg font-bold text-navy uppercase tracking-wide border-b-4 border-highlight -mb-[3px] pb-1 font-heading">
                    Quick Links
                  </h3>
                </div>
                <ul className="space-y-2.5 text-[13px] font-sans font-medium text-navy/80">
                  <li>
                    <Link
                      to="/opportunities"
                      search={{ type: "scholarship" }}
                      className="flex items-center hover:text-secondary transition-colors"
                    >
                      <ChevronRight className="h-3.5 w-3.5 mr-1.5 text-secondary" /> Undergraduate
                      Scholarships
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/opportunities"
                      search={{ type: "internship" }}
                      className="flex items-center hover:text-secondary transition-colors"
                    >
                      <ChevronRight className="h-3.5 w-3.5 mr-1.5 text-secondary" /> Internships &
                      Competitions
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/opportunities"
                      search={{ funding: "fully_funded" }}
                      className="flex items-center hover:text-secondary transition-colors"
                    >
                      <ChevronRight className="h-3.5 w-3.5 mr-1.5 text-secondary" /> Fully Funded
                      Opportunities
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="flex items-center hover:text-secondary transition-colors"
                    >
                      <ChevronRight className="h-3.5 w-3.5 mr-1.5 text-secondary" /> About
                      ScholarsConnect
                    </Link>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
