import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Clock, Tag } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { RouteErrorFallback } from "@/components/RouteFallbacks";
import { blogListQuery } from "@/lib/queries";

export const Route = createFileRoute("/blog")({
  loader: ({ context }) => context.queryClient.ensureQueryData(blogListQuery),
  head: () => ({
    meta: [
      { title: "Blog — ScholarsConnect" },
      { name: "description", content: "Scholarship guides, application tips and opportunity round-ups for African students." },
      { property: "og:title", content: "Blog — ScholarsConnect" },
      { property: "og:description", content: "Scholarship guides, essay tips and opportunity round-ups." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  errorComponent: RouteErrorFallback,
  component: BlogPage,
});

function BlogPage() {
  const { data } = useSuspenseQuery(blogListQuery);
  return (
    <SiteLayout>
      <section className="bg-gradient-hero px-4 py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-navy-foreground sm:text-4xl">The ScholarsConnect Blog</h1>
          <p className="mt-3 max-w-2xl text-navy-foreground/70">
            Guides, essay tips and opportunity round-ups written by scholars, for scholars.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.posts.map((post) => (
            <article key={post.slug} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft card-hover">
              {post.category && (
                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  <Tag className="h-3 w-3" /> {post.category}
                </span>
              )}
              <Link to="/blog/$slug" params={{ slug: post.slug }} className="mt-3 block group">
                <h2 className="text-lg font-bold leading-snug text-foreground group-hover:text-secondary transition-colors">{post.title}</h2>
              </Link>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span>{new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.reading_minutes} min read</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}