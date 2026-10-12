// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Clock, Tag, Calendar, ArrowRight, BookOpen } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { RouteErrorFallback } from "@/components/RouteFallbacks";
import { blogListQuery } from "@/lib/queries";
import { calculateReadingTime, getImageUrl } from "@/lib/sc-shared";

export const Route = createFileRoute("/blog/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(blogListQuery),
  head: () => ({
    meta: [
      { title: "Scholarship & Career Guides — ScholarsConnect Blog" },
      {
        name: "description",
        content:
          "Practical scholarship guides, application tips, essay breakdowns, and opportunity round-ups for African students.",
      },
      { property: "og:title", content: "Scholarship & Career Guides — ScholarsConnect Blog" },
      {
        property: "og:description",
        content: "Practical scholarship guides, essay breakdowns, and opportunity round-ups.",
      },
      { property: "og:url", content: "https://scholarsconnect.com.ng/blog" },
    ],
    links: [{ rel: "canonical", href: "https://scholarsconnect.com.ng/blog" }],
  }),
  errorComponent: RouteErrorFallback,
  component: BlogPage,
});

function BlogPage() {
  const { data } = useSuspenseQuery(blogListQuery);
  return (
    <SiteLayout>
      <section className="bg-gradient-hero px-4 py-12 lg:px-8 border-b border-navy-light text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-secondary backdrop-blur-md border border-white/15 mb-3">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Academic Knowledge Base</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight mb-2">
            The ScholarsConnect Editorial
          </h1>
          <p className="text-sm sm:text-base text-white/80 font-sans">
            In-depth guides, application roadmaps, and verified advice written to help students win
            life-changing opportunities.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.posts.map((post) => {
            const readMinutes =
              calculateReadingTime(post.content || post.excerpt) || post.reading_minutes || 6;
            return (
              <Link
                key={post.slug}
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group flex flex-col rounded-xl border border-border/80 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-navy/20 transition-all duration-200 cursor-pointer h-full"
              >
                {/* Featured Thumbnail */}
                {(post.featured_image || post.image_url) && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted/50 border-b border-border/50">
                    <img
                      src={getImageUrl(post.featured_image ?? post.image_url)}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="flex flex-col flex-1 p-5">
                  {post.category && (
                    <span className="inline-flex w-fit items-center gap-1 rounded-md bg-navy/5 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-navy mb-2.5">
                      <Tag className="h-3 w-3 text-secondary" /> {post.category}
                    </span>
                  )}
                  <h2 className="text-base sm:text-lg font-bold leading-snug text-navy group-hover:text-secondary transition-colors font-heading mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="flex-1 text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed font-sans mb-4">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground font-medium font-sans">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(post.published_at ?? post.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-navy/80">
                      <Clock className="h-3.5 w-3.5 text-secondary" />
                      {readMinutes} min read
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
