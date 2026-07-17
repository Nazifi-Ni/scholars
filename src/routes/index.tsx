import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Search, ChevronRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { OpportunityCard } from "@/components/OpportunityCard";
import { homeQuery, blogListQuery } from "@/lib/queries";
import { getImageUrl, type OpportunityCardData } from "@/lib/sc-shared";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    // Fetch home data and blog data in parallel
    await Promise.all([
      context.queryClient.ensureQueryData(homeQuery),
      context.queryClient.ensureQueryData(blogListQuery),
    ]);
  },
  component: HomePage,
});

function HomePage() {
  const { data } = useSuspenseQuery(homeQuery);
  const { data: blogData } = useSuspenseQuery(blogListQuery);
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/opportunities", search: q.trim() ? { q: q.trim() } : {} });
  };

  const latestOpportunities = data.latest as OpportunityCardData[];
  const featuredOpportunity = data.featured?.[0] as OpportunityCardData | undefined;
  const remainingLatest = latestOpportunities.slice(0, 6);
  
  // Fake tabs for styling purposes, linking to actual filters
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
        {/* Refined Search Header blending with the Nav */}
        {/* Refined Search Header blending with the Nav */}
        <div className="bg-gradient-hero border-b border-navy-light pb-12 pt-8 shadow-inner relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 mix-blend-overlay"></div>
          
          <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 font-heading tracking-tight animate-fade-up">
              Find Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-highlight to-secondary">Opportunity</span>
            </h1>
            
            <form onSubmit={submitSearch} className="flex flex-col sm:flex-row max-w-3xl gap-3 rounded-xl glass-dark p-2 sm:p-2.5 shadow-glow animate-fade-up" style={{ animationDelay: '100ms' }}>
              <div className="flex flex-1 items-center gap-3 pl-3 pr-2 py-2 sm:py-0 bg-white/10 rounded-lg border border-white/20">
                <Search className="h-5 w-5 shrink-0 text-white/70" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search scholarships, internships, countries…"
                  className="w-full bg-transparent text-base text-white outline-none placeholder:text-white/60 placeholder:font-light"
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto h-12 sm:h-auto rounded-lg bg-secondary px-8 text-base font-bold text-white shadow-sm hover:bg-green-600 transition-all hover:scale-[1.02]">
                Search
              </Button>
            </form>
          </div>
        </div>

        {/* 70/30 Main Grid */}
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12">
            
            {/* Left Column (67%) */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Latest Opportunities Section */}
              <section>
                {/* Section Header with Tabs */}
                <div className="mb-5 flex items-end justify-between border-b-2 border-border pb-1">
                  <h2 className="text-xl font-bold text-navy uppercase tracking-wide border-b-4 border-navy -mb-[3px] pb-1 font-heading">Latest Opportunities</h2>
                  <div className="hidden md:flex gap-4 text-sm font-medium text-muted-foreground pb-1 font-sans">
                    {TABS.map((tab, i) => (
                      <Link 
                        key={tab.label} 
                        to="/opportunities" 
                        search={tab.search}
                        className={`hover:text-secondary transition-colors ${i === 0 ? "text-navy" : ""}`}
                      >
                        {tab.label}
                      </Link>
                    ))}
                    <Link to="/opportunities" className="hover:text-secondary font-semibold transition-colors">More ▾</Link>
                  </div>
                </div>

                {latestOpportunities.length > 0 ? (
                  <>
                    {/* Big Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-8 rounded-lg overflow-hidden shadow-card">
                      {/* Left Hero */}
                      <Link to="/opportunities/$slug" params={{ slug: latestOpportunities[0]?.slug || 'not-found' }} className="md:col-span-2 relative group h-[300px] md:h-[400px] bg-muted overflow-hidden">
                        <img 
                          src={getImageUrl(latestOpportunities[0]?.featured_image ?? latestOpportunities[0]?.image_url)} 
                          alt={latestOpportunities[0]?.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/30 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-5 md:p-6 w-full">
                          <span className="mb-3 inline-block bg-highlight px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-navy shadow-sm">
                            {latestOpportunities[0]?.category?.name || 'Featured'}
                          </span>
                          <h3 className="text-2xl md:text-3xl font-bold leading-tight text-white group-hover:underline font-heading">
                            {latestOpportunities[0]?.title}
                          </h3>
                          <div className="mt-2 md:mt-3 text-xs text-gray-300 font-sans flex items-center gap-2">
                            <span className="font-bold text-white">ScholarsConnect</span>
                            <span>•</span>
                            <span>{latestOpportunities[0] ? new Date(latestOpportunities[0].created_at).toLocaleDateString() : ''}</span>
                          </div>
                        </div>
                      </Link>

                      {/* Right Stacked */}
                      <div className="grid grid-rows-2 gap-1 h-[300px] md:h-[400px]">
                        {latestOpportunities.slice(1, 3).map(opp => (
                          <Link key={opp.id} to="/opportunities/$slug" params={{ slug: opp.slug }} className="relative group bg-muted overflow-hidden h-full">
                            <img 
                              src={getImageUrl(opp.featured_image ?? opp.image_url)} 
                              alt={opp.title}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-4 w-full">
                              <span className="mb-2 inline-block bg-secondary px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
                                {opp.category?.name || 'Latest'}
                              </span>
                              <h3 className="text-sm md:text-base font-bold leading-tight text-white group-hover:underline font-heading line-clamp-3 md:line-clamp-2">
                                {opp.title}
                              </h3>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Module Layout (Thumbnail left, text right) */}
                    <div className="flex flex-col gap-5">
                      {latestOpportunities.slice(3, 8).map((opp) => (
                        <div key={opp.id} className="group flex gap-4 bg-white p-2.5 sm:p-3 rounded-lg border border-border shadow-sm hover:shadow-card transition-all">
                          <Link to="/opportunities/$slug" params={{ slug: opp.slug }} className="shrink-0 w-[110px] h-[110px] sm:w-[220px] sm:h-[160px] overflow-hidden rounded border border-border/50 bg-muted">
                            <img 
                              src={getImageUrl(opp.featured_image ?? opp.image_url)} 
                              alt={opp.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </Link>
                          <div className="flex flex-col justify-center flex-1">
                            <span className="text-[10px] sm:text-xs font-bold uppercase text-secondary mb-1 sm:mb-1.5 tracking-wider font-sans">
                              {opp.category?.name || 'Opportunity'}
                            </span>
                            <h4 className="text-base sm:text-xl font-bold leading-snug text-navy group-hover:text-secondary font-heading line-clamp-2 sm:line-clamp-3">
                              <Link to="/opportunities/$slug" params={{ slug: opp.slug }}>{opp.title}</Link>
                            </h4>
                            <div className="mt-1.5 sm:mt-2 text-[11px] sm:text-sm text-muted-foreground font-sans flex items-center gap-1.5 sm:gap-2">
                              <span className="font-semibold text-navy/80">ScholarsConnect</span>
                              <span className="text-border">•</span>
                              <span>{new Date(opp.created_at).toLocaleDateString()}</span>
                            </div>
                            {opp.eligibility && (
                              <p className="mt-2.5 text-[13px] sm:text-[15px] leading-relaxed text-muted-foreground line-clamp-2 hidden sm:block font-sans">
                                {opp.eligibility.substring(0, 150)}...
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">No recent opportunities found.</p>
                )}
              </section>

              {/* Browse By Category Section */}
              <section className="pt-4">
                <div className="mb-5 border-b-2 border-border pb-1">
                  <h2 className="inline-block text-xl font-bold text-navy uppercase tracking-wide border-b-4 border-highlight -mb-[3px] pb-1 font-heading">Browse By Category</h2>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {data.categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to="/opportunities"
                      search={{ category: cat.slug }}
                      className="group flex flex-col items-center justify-center rounded-lg border border-border bg-white p-5 shadow-sm hover:border-secondary hover:shadow-card transition-all"
                    >
                      <p className="font-bold text-navy text-center group-hover:text-secondary font-heading text-sm">{cat.name}</p>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Community CTA Section */}
              <section className="pt-10">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-navy/95 to-highlight p-8 md:p-10 shadow-card border border-border">
                  {/* Decorative Elements */}
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-secondary/20 blur-3xl"></div>
                  <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-highlight/20 blur-3xl"></div>
                  
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white font-heading mb-4">
                      Supercharge Your Academic Journey
                    </h2>
                    <p className="text-white/80 font-sans max-w-lg mb-8">
                      Create a free account to track your applications, save your favorite opportunities, and get personalized recommendations.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                      <Link to="/register">
                        <Button className="w-full sm:w-auto bg-secondary hover:bg-green-600 text-white font-bold py-6 px-8 rounded-full shadow-lg hover:scale-105 transition-transform text-base uppercase tracking-wider">
                          Create Free Account
                        </Button>
                      </Link>
                      <Link to="/about">
                        <Button variant="outline" className="w-full sm:w-auto bg-transparent border-white/20 text-white hover:bg-white/10 font-bold py-6 px-8 rounded-full shadow-lg transition-colors text-base uppercase tracking-wider">
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

            </div>

            {/* Right Column (33%) - Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              
              {/* Sidebar Newsletter Widget */}
              <div className="rounded-lg bg-navy p-6 shadow-card text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Mail className="h-24 w-24 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 relative z-10 font-heading">Never Miss a Deadline!</h3>
                <p className="text-sm text-white/80 mb-5 relative z-10 font-sans">Join 85,000+ students getting the newest scholarships in their inbox.</p>
                <form className="flex flex-col gap-3 relative z-10" onSubmit={(e) => e.preventDefault()}>
                  <input type="email" placeholder="Email address" className="w-full rounded bg-white/10 border border-white/20 px-4 py-2.5 text-sm text-white placeholder:text-white/60 focus:outline-none focus:border-secondary" required />
                  <Button type="submit" className="w-full bg-secondary hover:bg-green-600 text-white font-bold py-2.5 font-sans">Subscribe Now</Button>
                </form>
              </div>

              {/* Advertisement Placeholder */}
              <div className="rounded-lg border border-border bg-white p-4 text-center shadow-sm">
                <span className="text-[10px] uppercase text-muted-foreground tracking-wider mb-2 block font-sans">- Advertisement -</span>
                <div className="mx-auto h-[250px] w-full max-w-[300px] bg-muted/30 flex items-center justify-center rounded border border-border/50">
                  <span className="text-muted-foreground/60 font-semibold text-sm">Ad Space</span>
                </div>
              </div>

              {/* News & Blog Sidebar */}
              <div className="bg-white p-5 rounded-lg border border-border shadow-sm">
                <div className="mb-4 border-b-2 border-border pb-1">
                  <h3 className="inline-block text-lg font-bold text-navy uppercase tracking-wide border-b-4 border-red-600 -mb-[3px] pb-1 font-heading">News & Blogs</h3>
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
                          <Link to="/blog/$slug" params={{ slug: post.slug }}>{post.title}</Link>
                        </h4>
                        <span className="text-[10px] text-muted-foreground mt-1 font-sans">{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                  
                  {!blogData?.posts?.length && (
                    <p className="text-sm text-muted-foreground">No recent news available.</p>
                  )}
                </div>
              </div>

              {/* Stay Connected / Social Counters */}
              <div className="bg-white p-5 rounded-lg border border-border shadow-sm">
                <div className="mb-4 border-b-2 border-border pb-1">
                  <h3 className="inline-block text-lg font-bold text-navy uppercase tracking-wide border-b-4 border-accent -mb-[3px] pb-1 font-heading">Stay Connected</h3>
                </div>
                <div className="grid grid-cols-2 gap-2 font-sans">
                  <a href="#" className="flex flex-col items-center justify-center bg-blue-600 text-white rounded p-3 hover:bg-blue-700 transition-colors">
                    <span className="font-bold text-sm">250k+</span>
                    <span className="text-[10px] uppercase tracking-wider opacity-80">Followers</span>
                  </a>
                  <a href="#" className="flex flex-col items-center justify-center bg-green-500 text-white rounded p-3 hover:bg-green-600 transition-colors">
                    <span className="font-bold text-sm">85k+</span>
                    <span className="text-[10px] uppercase tracking-wider opacity-80">Subscribers</span>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
                <div className="mb-4 border-b-2 border-border pb-1">
                  <h3 className="inline-block text-lg font-bold text-navy uppercase tracking-wide border-b-4 border-highlight -mb-[3px] pb-1 font-heading">Quick Links</h3>
                </div>
                <ul className="space-y-2.5 text-[13px] font-sans font-medium text-navy/80">
                  <li><Link to="/opportunities" search={{ type: "scholarship" }} className="flex items-center hover:text-secondary transition-colors"><ChevronRight className="h-3.5 w-3.5 mr-1.5 text-secondary" /> Undergraduate Scholarships</Link></li>
                  <li><Link to="/opportunities" search={{ type: "internship" }} className="flex items-center hover:text-secondary transition-colors"><ChevronRight className="h-3.5 w-3.5 mr-1.5 text-secondary" /> Internships & Competitions</Link></li>
                  <li><Link to="/opportunities" search={{ funding: "fully_funded" }} className="flex items-center hover:text-secondary transition-colors"><ChevronRight className="h-3.5 w-3.5 mr-1.5 text-secondary" /> Fully Funded Opportunities</Link></li>
                  <li><Link to="/about" className="flex items-center hover:text-secondary transition-colors"><ChevronRight className="h-3.5 w-3.5 mr-1.5 text-secondary" /> About ScholarsConnect</Link></li>
                </ul>
              </div>

            </aside>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
