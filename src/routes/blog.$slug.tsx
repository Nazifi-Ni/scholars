import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Clock, Tag, MessageCircle, Send } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { RouteErrorFallback, RouteNotFoundFallback } from "@/components/RouteFallbacks";
import { Button } from "@/components/ui/button";
import { blogPostQuery } from "@/lib/queries";
import { getImageUrl } from "@/lib/sc-shared";
import { addBlogComment } from "@/lib/public.functions";
import { WhatsAppBanner } from "@/components/WhatsAppBanner";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(blogPostQuery(params.slug));
    } catch (e) {
      throw new Error("Not found");
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.post) return { meta: [{ title: "Not Found" }] };
    return {
      meta: [
        { title: `${loaderData.post.title} — ScholarsConnect Blog` },
        { name: "description", content: loaderData.post.excerpt },
        { property: "og:title", content: loaderData.post.title },
        { property: "og:description", content: loaderData.post.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:image", content: getImageUrl(loaderData.post.featured_image ?? loaderData.post.image_url) },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: getImageUrl(loaderData.post.featured_image ?? loaderData.post.image_url) },
      ]
    };
  },
  errorComponent: RouteErrorFallback,
  notFoundComponent: RouteNotFoundFallback,
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(blogPostQuery(slug));
  const post = data?.post;
  const related = data?.related || [];
  const comments = post?.comments || [];

  const [commentForm, setCommentForm] = useState({ author_name: "", content: "" });

  const submitComment = useMutation({
    mutationFn: () => addBlogComment(slug, commentForm),
    onSuccess: () => {
      setCommentForm({ author_name: "", content: "" });
      queryClient.invalidateQueries({ queryKey: ["blog", slug] });
    }
  });

  if (!post) return <RouteNotFoundFallback />;

  return (
    <SiteLayout>
      <article className="bg-white">
        {/* Header Hero */}
        <header className="bg-gradient-hero px-4 py-12 lg:px-8 text-center border-b border-border">
          <div className="mx-auto max-w-4xl">
            {post.category && (
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-sm font-semibold text-accent font-sans">
                <Tag className="h-4 w-4" /> {post.category}
              </span>
            )}
            <h1 className="text-3xl font-bold leading-tight text-navy-foreground sm:text-5xl lg:text-6xl font-heading mb-6">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-navy-foreground/80 font-sans">
              <span>{new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" />{post.reading_minutes} min read</span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline mb-8 font-sans">
            <ArrowLeft className="h-4 w-4" /> Back to all posts
          </Link>

          {/* Featured Image */}
          {(post.featured_image || post.image_url) && (
            <div className="mb-10 overflow-hidden rounded-2xl shadow-card bg-muted border border-border">
              <img 
                src={getImageUrl(post.featured_image ?? post.image_url)} 
                alt={post.title}
                className="w-full h-auto object-cover max-h-[500px]"
              />
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg prose-navy max-w-none font-sans leading-relaxed prose-a:text-secondary prose-a:font-semibold hover:prose-a:underline mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <WhatsAppBanner className="mb-16" />

          {/* Comments Section */}
          <div className="border-t border-border pt-12">
            <h3 className="text-2xl font-bold text-navy font-heading flex items-center gap-2 mb-8">
              <MessageCircle className="h-6 w-6 text-secondary" /> 
              Comments ({comments.length})
            </h3>

            <div className="bg-muted/30 rounded-2xl p-6 mb-10 border border-border">
              <h4 className="text-lg font-bold text-navy mb-4">Leave a Reply</h4>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (commentForm.author_name && commentForm.content) submitComment.mutate();
                }}
                className="space-y-4"
              >
                <div>
                  <input
                    required
                    type="text"
                    placeholder="Your Name"
                    className="w-full sm:max-w-sm rounded-lg border border-border bg-white px-4 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                    value={commentForm.author_name}
                    onChange={e => setCommentForm({ ...commentForm, author_name: e.target.value })}
                  />
                </div>
                <div>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write your comment..."
                    className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary resize-none"
                    value={commentForm.content}
                    onChange={e => setCommentForm({ ...commentForm, content: e.target.value })}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={submitComment.isPending}
                  className="bg-gradient-cta hover:opacity-90 font-semibold px-6 rounded-full"
                >
                  {submitComment.isPending ? "Posting..." : (
                    <>Post Comment <Send className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </form>
            </div>

            <div className="space-y-6">
              {comments.map((comment: any) => (
                <div key={comment.id} className="bg-white border border-border rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-navy">{comment.author_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-navy-foreground/80 text-sm whitespace-pre-wrap">{comment.content}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-muted-foreground text-sm italic">No comments yet. Be the first to share your thoughts!</p>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="bg-muted/30 border-t border-border px-4 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h3 className="text-2xl font-bold text-navy font-heading mb-8">Related Articles</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel: any) => (
                <Link key={rel.slug} to="/blog/$slug" params={{ slug: rel.slug }} className="group flex flex-col rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-card transition-all">
                  {rel.category && <span className="mb-3 text-xs font-bold text-secondary uppercase tracking-wider">{rel.category}</span>}
                  <h4 className="text-lg font-bold leading-snug text-navy group-hover:text-secondary mb-3">{rel.title}</h4>
                  <p className="flex-1 text-sm text-muted-foreground line-clamp-3">{rel.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
                    <span>{new Date(rel.published_at).toLocaleDateString()}</span>
                    <span>{rel.reading_minutes} min</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
