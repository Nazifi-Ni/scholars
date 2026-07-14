import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, ShieldCheck, Globe2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — ScholarsConnect" },
      { name: "description", content: "ScholarsConnect connects ambitious African students to verified scholarships, internships and grants worldwide." },
      { property: "og:title", content: "About Us — ScholarsConnect" },
      { property: "og:description", content: "Connecting Dreams to Opportunities for students across Africa." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: ShieldCheck, title: "Verified & Trusted", text: "Every opportunity is reviewed against the official provider before it goes live." },
  { icon: Globe2, title: "Built for Africa", text: "We focus on opportunities genuinely open to students from all 54 African countries." },
  { icon: Target, title: "Deadline-Driven", text: "Countdowns, reminders and trackers so you never miss an application window." },
  { icon: Users, title: "Community First", text: "Success stories, guides and mentorship from scholars who've walked the path." },
];

function AboutPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-navy-foreground">Connecting Dreams to Opportunities</h1>
          <p className="mx-auto mt-4 max-w-2xl text-navy-foreground/75">
            ScholarsConnect exists to level the playing field. We believe talent is evenly distributed
            across Africa — but opportunity isn't. Our platform brings verified scholarships, internships,
            grants and jobs to every ambitious student, for free.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft card-hover">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <v.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-semibold text-foreground">{v.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Button asChild size="lg" className="rounded-full bg-gradient-cta px-8 font-semibold shadow-glow">
            <Link to="/opportunities">Start Exploring</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}