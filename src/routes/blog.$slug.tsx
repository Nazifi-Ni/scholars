import { useState, useMemo, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  Clock,
  Tag,
  MessageCircle,
  Send,
  CheckCircle2,
  UserCheck,
  ShieldCheck,
  Calendar,
  BookOpen,
  ListOrdered,
  Share2,
  ChevronRight,
} from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { RouteErrorFallback, RouteNotFoundFallback } from "@/components/RouteFallbacks";
import { Button } from "@/components/ui/button";
import { blogPostQuery } from "@/lib/queries";
import { getImageUrl, calculateReadingTime } from "@/lib/sc-shared";
import { addBlogComment } from "@/lib/public.functions";
import { WhatsAppBanner } from "@/components/WhatsAppBanner";
import { AdBanner } from "@/components/AdBanner";
import { ShareBlogModal } from "@/components/ShareBlogModal";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ context, params }) => {
    try {
      const data = await context.queryClient.ensureQueryData(blogPostQuery(params.slug));
      if (!data?.post) throw notFound();
      return data;
    } catch (e) {
      if (e instanceof Error && e.message === "Not found") throw notFound();
      throw e;
    }
  },
  head: ({ params, loaderData }) => {
    if (!loaderData?.post)
      return {
        meta: [
          { title: "Article Not Found — ScholarsConnect" },
          { name: "robots", content: "noindex" },
        ],
      };
    const p = loaderData.post;
    const canonicalUrl = `https://www.scholarsconnect.com.ng/blog/${params.slug}`;
    const imageUrl = getImageUrl(p.featured_image ?? p.image_url);
    const title = p.meta_title ?? `${p.title} — ScholarsConnect`;
    const desc =
      p.meta_description ??
      p.excerpt ??
      "Comprehensive scholarship and higher-education guide from ScholarsConnect.";

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        ...(p.meta_keywords ? [{ name: "keywords", content: p.meta_keywords }] : []),
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:image", content: imageUrl },
        { property: "og:url", content: canonicalUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: imageUrl },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.scholarsconnect.com.ng",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://www.scholarsconnect.com.ng/blog",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: p.title,
                item: canonicalUrl,
              },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: p.title,
            description: desc,
            image: imageUrl,
            datePublished: p.published_at ?? p.created_at,
            dateModified: p.updated_at ?? p.published_at ?? p.created_at,
            author: {
              "@type": "Organization",
              name: "ScholarsConnect Editorial Team",
              url: "https://www.scholarsconnect.com.ng/editorial-policy",
            },
            publisher: {
              "@type": "Organization",
              name: "ScholarsConnect",
              logo: {
                "@type": "ImageObject",
                url: "https://www.scholarsconnect.com.ng/logo.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": canonicalUrl,
            },
          }),
        },
      ],
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
  const [localComments, setLocalComments] = useState<any[]>(post?.comments || []);
  const [commentForm, setCommentForm] = useState({ author_name: "", content: "" });

  useEffect(() => {
    if (post?.comments) {
      setLocalComments(post.comments);
    }
  }, [post?.comments]);

  const submitComment = useMutation({
    mutationFn: () =>
      addBlogComment({
        data: {
          slug,
          author_name: commentForm.author_name.trim(),
          content: commentForm.content.trim(),
        },
      }),
    onSuccess: (result: any) => {
      toast.success("Thank you! Your comment has been posted.");
      const newComment = result?.comment || {
        id: Date.now(),
        author_name: commentForm.author_name.trim(),
        content: commentForm.content.trim(),
        created_at: new Date().toISOString(),
      };
      setLocalComments((prev) => [newComment, ...prev]);
      setCommentForm({ author_name: "", content: "" });
      queryClient.invalidateQueries({ queryKey: ["blog", slug] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to post comment. Please try again.");
    },
  });

  // Calculate accurate reading time dynamically from clean content
  const readingTime = useMemo(() => {
    return calculateReadingTime(post?.content);
  }, [post?.content]);

  // Extract table of contents headings (## and ###)
  const toc = useMemo(() => {
    if (!post?.content) return [];
    const lines = post.content.split("\n");
    const headings: { text: string; id: string; level: number }[] = [];
    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].replace(/[*_`]/g, "").trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        headings.push({ text, id, level });
      }
    });
    return headings;
  }, [post?.content]);

  if (!post) return <RouteNotFoundFallback />;

  return (
    <SiteLayout>
      <article className="bg-white">
        {/* Header Hero */}
        <header className="bg-gradient-hero px-4 py-12 lg:px-8 border-b border-border">
          <div className="mx-auto max-w-4xl text-center">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="text-xs font-semibold tracking-wider text-navy-foreground/70 font-sans mb-6 flex items-center justify-center gap-2 flex-wrap"
            >
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3 w-3 text-navy-foreground/40" />
              <Link to="/blog" className="hover:text-primary transition-colors">
                Blog
              </Link>
              {post.category && (
                <>
                  <ChevronRight className="h-3 w-3 text-navy-foreground/40" />
                  <span className="text-secondary">{post.category}</span>
                </>
              )}
            </nav>

            {post.category && (
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-accent font-sans">
                <Tag className="h-3.5 w-3.5" /> {post.category}
              </span>
            )}

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-navy-foreground font-heading mb-6 max-w-3xl mx-auto">
              {post.title}
            </h1>

            {/* Author Credibility Strip */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-navy-foreground/80 font-sans mt-4">
              <div className="flex items-center gap-2 font-medium">
                <div className="h-7 w-7 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-xs">
                  SC
                </div>
                <span>
                  Written by <strong>ScholarsConnect Editorial Team</strong>
                </span>
              </div>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-secondary" />
                {new Date(post.published_at ?? post.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-secondary" />
                {readingTime} min read
              </span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
          <div className="flex items-center justify-between gap-3 mb-8 flex-wrap">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline font-sans"
            >
              <ArrowLeft className="h-4 w-4" /> Back to all articles
            </Link>
            <div className="flex items-center gap-2">
              <ShareBlogModal
                post={{
                  id: post.id,
                  title: post.title,
                  slug: post.slug,
                  excerpt: post.excerpt,
                  content: post.content,
                  category: post.category,
                  reading_minutes: readingTime,
                }}
                buttonVariant="outline"
                buttonText="Share"
                className="h-9 px-3.5 rounded-xl text-xs font-semibold text-navy border-border hover:bg-muted/50"
              />
            </div>
          </div>

          {/* Featured Image */}
          {(post.featured_image || post.image_url) && (
            <div className="mb-10 overflow-hidden rounded-2xl shadow-sm bg-muted/40 border border-border flex justify-center items-center p-2 sm:p-4">
              <img
                src={getImageUrl(post.featured_image ?? post.image_url)}
                alt={post.title}
                className="w-full h-auto object-contain max-h-[380px] rounded-xl"
              />
            </div>
          )}

          {/* Table of Contents (if at least 3 headings exist) */}
          {toc.length >= 3 && (
            <nav
              aria-label="Table of contents"
              className="mb-10 rounded-xl border border-border/80 bg-muted/30 p-5 font-sans"
            >
              <h2 className="text-base font-bold text-navy font-heading mb-3 flex items-center gap-2">
                <ListOrdered className="h-4 w-4 text-secondary" /> Table of Contents
              </h2>
              <ul className="space-y-2 text-sm">
                {toc.map((item, idx) => (
                  <li
                    key={idx}
                    className={
                      item.level === 3
                        ? "pl-4 text-xs text-muted-foreground"
                        : "text-foreground font-medium"
                    }
                  >
                    <a href={`#${item.id}`} className="hover:text-secondary hover:underline">
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Article Body */}
          <div className="prose prose-base sm:prose-lg max-w-none font-sans leading-relaxed text-slate-800 prose-headings:font-heading prose-headings:text-navy prose-a:text-secondary hover:prose-a:underline mb-12 overflow-hidden break-words prose-pre:overflow-x-auto prose-table:overflow-x-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>

          {/* Author Box & Editorial Review Note */}
          <div className="my-10 rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-sm font-sans">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-heading font-black text-xl shrink-0">
                SC
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-navy font-heading text-base">
                    ScholarsConnect Editorial Desk
                  </h3>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Verified Educational Publisher
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  Our articles are researched and published by our academic guidance desk to help
                  African candidates navigate international admissions, scholarship eligibility, and
                  visa procedures.
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs font-semibold">
                  <Link to="/editorial-policy" className="text-primary hover:underline">
                    Editorial Standards
                  </Link>
                  <span>•</span>
                  <Link to="/how-we-verify-opportunities" className="text-primary hover:underline">
                    Fact-Checking Methodology
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Share This Educational Guide Card */}
          <div className="my-8 rounded-2xl border border-secondary/30 bg-emerald-50/40 p-4 sm:p-6 font-sans">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5 mb-1">
                  <Share2 className="h-3.5 w-3.5" /> Spread Educational Knowledge
                </span>
                <h4 className="font-heading font-bold text-navy text-base sm:text-lg">
                  Know someone who needs this guide?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
                  Share this breakdown with fellow students, study groups, or on WhatsApp to help others navigate their academic journey.
                </p>
              </div>
              <ShareBlogModal
                post={{
                  id: post.id,
                  title: post.title,
                  slug: post.slug,
                  excerpt: post.excerpt,
                  content: post.content,
                  category: post.category,
                  reading_minutes: readingTime,
                }}
                buttonVariant="default"
                buttonText="Share Guide"
                className="w-full sm:w-auto bg-[#1d6b20] hover:bg-[#154e17] text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-sm shrink-0 cursor-pointer"
              />
            </div>
          </div>

          <AdBanner className="mb-10" />
          <WhatsAppBanner className="mb-14" />

          {/* Comments Section */}
          <div className="border-t border-border pt-10 sm:pt-12">
            <h3 className="text-xl sm:text-2xl font-bold text-navy font-heading flex items-center gap-2 mb-6 sm:mb-8">
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
              Comments ({localComments.length})
            </h3>

            <div className="bg-muted/30 rounded-2xl p-4 sm:p-6 mb-8 sm:mb-10 border border-border font-sans">
              <h4 className="text-base sm:text-lg font-bold text-navy mb-4">Leave a Reply</h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (commentForm.author_name.trim() && commentForm.content.trim()) {
                    submitComment.mutate();
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <input
                    required
                    type="text"
                    placeholder="Your Name"
                    className="w-full sm:max-w-sm rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-muted-foreground focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                    value={commentForm.author_name}
                    onChange={(e) =>
                      setCommentForm({ ...commentForm, author_name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write your comment or question about this guide..."
                    className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-muted-foreground focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary resize-none"
                    value={commentForm.content}
                    onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitComment.isPending}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 font-semibold px-6 py-2.5 rounded-xl text-white"
                >
                  {submitComment.isPending ? (
                    "Posting..."
                  ) : (
                    <>
                      Post Comment <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            <div className="space-y-4 font-sans">
              {localComments.map((comment: any) => (
                <div
                  key={comment.id}
                  className="bg-white border border-border rounded-xl p-4 sm:p-5 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-navy text-sm sm:text-base">{comment.author_name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(comment.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-slate-800 text-sm whitespace-pre-wrap leading-relaxed break-words">
                    {comment.content}
                  </p>
                </div>
              ))}
              {localComments.length === 0 && (
                <p className="text-muted-foreground text-sm italic font-sans">
                  No comments yet. Have a question about this guide? Leave a reply above!
                </p>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="bg-muted/30 border-t border-border px-4 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h3 className="text-2xl font-bold text-navy font-heading mb-8">
              Related Educational Guides
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel: any) => (
                <Link
                  key={rel.slug}
                  to="/blog/$slug"
                  params={{ slug: rel.slug }}
                  className="group flex flex-col rounded-2xl border border-border bg-white p-6 shadow-xs hover:shadow-card transition-all"
                >
                  {rel.category && (
                    <span className="mb-2 text-xs font-bold text-secondary uppercase tracking-wider">
                      {rel.category}
                    </span>
                  )}
                  <h4 className="text-base font-bold leading-snug text-navy group-hover:text-primary transition-colors mb-2">
                    {rel.title}
                  </h4>
                  <p className="flex-1 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {rel.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground font-sans">
                    <span>{new Date(rel.published_at ?? rel.created_at).toLocaleDateString()}</span>
                    <span>{calculateReadingTime(rel.excerpt)} min read</span>
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
