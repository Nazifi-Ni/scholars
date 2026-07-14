import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare, Building2 } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — ScholarsConnect" },
      { name: "description", content: "Get in touch with the ScholarsConnect team — questions, partnerships and opportunity listings." },
      { property: "og:title", content: "Contact Us — ScholarsConnect" },
      { property: "og:description", content: "Questions, partnerships and opportunity listings — talk to us." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero px-4 py-14 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-navy-foreground sm:text-4xl">Contact Us</h1>
          <p className="mt-3 text-navy-foreground/70">We usually reply within one business day.</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-4xl gap-5 px-4 py-14 sm:grid-cols-3 lg:px-8">
        {[
          { icon: Mail, title: "General", value: "hello@scholarsconnect.africa" },
          { icon: MessageSquare, title: "Support", value: "support@scholarsconnect.africa" },
          { icon: Building2, title: "Partnerships", value: "partners@scholarsconnect.africa" },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft card-hover">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <c.icon className="h-5 w-5" />
            </span>
            <h2 className="mt-3 font-semibold text-foreground">{c.title}</h2>
            <p className="mt-1 break-all text-sm text-muted-foreground">{c.value}</p>
          </div>
        ))}
      </section>
    </SiteLayout>
  );
}