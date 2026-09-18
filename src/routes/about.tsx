import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, ShieldCheck, Globe2, Users, BookOpen, Rocket, Award, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — ScholarsConnect" },
      { name: "description", content: "Learn about the mission, vision, and the team behind ScholarsConnect, Africa's premier opportunity discovery platform." },
      { property: "og:title", content: "About Us — ScholarsConnect" },
      { property: "og:description", content: "Connecting Dreams to Opportunities for ambitious students across the African continent." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: ShieldCheck, title: "Verified & Trusted", text: "Every single opportunity listed on our platform is meticulously reviewed against the official provider's guidelines before it ever goes live. We fight scams so you don't have to." },
  { icon: Globe2, title: "Built for Africa", text: "We understand the unique challenges faced by African students. We specifically prioritize highlighting opportunities that are genuinely accessible and open to students from all 54 African countries without hidden geographical restrictions." },
  { icon: Target, title: "Deadline-Driven", text: "Timing is everything in scholarship applications. We provide clear countdowns, transparent timelines, and urgent reminders so you never miss a life-changing application window again." },
  { icon: Users, title: "Community First", text: "We are more than just a job board; we are a community. We provide deep insights, success stories, and practical application guides from scholars who have successfully walked the path before you." },
  { icon: BookOpen, title: "Actionable Advice", text: "Through our unique ScholarsConnect Advice feature, we move beyond just listing eligibility criteria. We tell you exactly what selection committees are actually looking for in your essays." },
  { icon: Award, title: "Meritocracy", text: "We believe that your background or financial status shouldn't dictate your future. We focus heavily on fully-funded and heavily subsidized opportunities that reward pure talent and hard work." },
];

function AboutPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero px-4 py-20 lg:px-8 border-b border-border/40">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 tracking-wide uppercase">Our Story</span>
          <h1 className="text-4xl font-bold text-navy-foreground sm:text-6xl mb-6">Connecting Dreams to Opportunities</h1>
          <p className="mx-auto mt-4 max-w-3xl text-navy-foreground/80 text-lg leading-relaxed">
            ScholarsConnect exists to fundamentally level the playing field. We believe that brilliant talent is evenly distributed across the African continent—but access to world-class opportunity is not. Our platform is dedicated to bridging that gap by bringing verified, life-changing global opportunities directly to the screens of ambitious students.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 lg:px-8 text-lg leading-relaxed text-foreground/90 space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-4">The Problem We Are Solving</h2>
          <p className="mb-4">
            Every year, billions of dollars in global scholarships, research grants, and international fellowships go unclaimed or underutilized. At the same time, millions of exceptionally bright, highly motivated African students are forced to abandon their academic dreams simply because they cannot afford the exorbitant costs of higher education, and crucially, because they don't even know these funding opportunities exist.
          </p>
          <p className="mb-4">
            When students do attempt to search for scholarships online, they are immediately overwhelmed by a chaotic ecosystem of outdated information, broken links, confusing academic jargon, and unfortunately, malicious scams designed to exploit their desperation. Information is often scattered across hundreds of obscure university sub-domains, making the search process exhausting and inefficient.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
          <p className="mb-4">
            Our mission is incredibly simple but wildly ambitious: to become the most trusted, comprehensive, and user-friendly discovery platform for educational and career advancement in Africa. We want to completely democratize access to global education. 
          </p>
          <p className="mb-4">
            We do the heavy lifting of scouring the internet, navigating complex university portals, and reading lengthy funding guidelines. We then translate that bureaucratic jargon into clear, concise, and structured summaries. When you use ScholarsConnect, you immediately know if you are eligible, what documents you need to prepare, exactly what the scholarship covers, and when the deadline is.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Why We Are Different</h2>
          <p className="mb-4">
            Unlike generic job boards or automated scrapers, ScholarsConnect is curated by humans who actually care about your success. We know that finding a scholarship is only step one. Winning it is step two. That is why we invest heavily in creating in-depth guides, essay-writing tips, and interview strategies specifically tailored for African applicants facing international competition. 
          </p>
          <p>
            Through our proprietary <strong>ScholarsConnect Advice</strong> feature, our team provides exclusive commentary on the most competitive opportunities. We tell you the unwritten rules: which scholarships value community service over raw GPA, which countries have the friendliest post-study work visas, and how to structure a motivation letter that will genuinely captivate an admission committee in London, Toronto, or Berlin.
          </p>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Our Core Values</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">These are the fundamental principles that guide everything we build, write, and share on the ScholarsConnect platform.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                  <v.icon className="h-7 w-7" />
                </span>
                <h3 className="text-xl font-bold text-foreground mb-3">{v.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-6">Join the Movement</h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Whether you are a high school graduate looking for a bachelor's scholarship in Europe, a young professional seeking a prestigious fellowship in the USA, or a researcher hunting for grants, ScholarsConnect is your launchpad. Your background does not define your boundaries.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="rounded-full bg-primary px-10 h-14 text-base font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
            <Link to="/opportunities">Explore Opportunities</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-10 h-14 text-base font-bold border-2">
            <Link to="/blog">Read Our Guides</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}