import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — ScholarsConnect" },
      {
        name: "description",
        content:
          "Get in touch with the ScholarsConnect team — questions, partnerships and opportunity listings.",
      },
      { property: "og:title", content: "Contact Us — ScholarsConnect" },
      {
        property: "og:description",
        content: "Questions, partnerships and opportunity listings — talk to us.",
      },
      { property: "og:url", content: "https://www.scholarsconnect.com.ng/contact" },
    ],
    links: [{ rel: "canonical", href: "https://www.scholarsconnect.com.ng/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero px-4 py-10 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-2xl font-bold text-navy-foreground sm:text-4xl">Contact Us</h1>
          <p className="mt-2 text-sm text-navy-foreground/80 sm:mt-3 sm:text-base">
            We usually reply within one business day.
          </p>
        </div>
      </section>
      <section className="mx-auto grid max-w-2xl gap-4 px-4 py-10 sm:gap-6 sm:grid-cols-2 sm:py-14 lg:px-8">
        {[
          { icon: Mail, title: "Email", value: "admin@scholarsconnect.com.ng", href: "mailto:admin@scholarsconnect.com.ng" },
          { icon: MessageSquare, title: "Phone / WhatsApp", value: "+234 706 527 4251", href: "https://wa.me/2347065274251" },
        ].map((c) => (
          <a
            key={c.title}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-center shadow-soft card-hover transition-all block focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <c.icon className="h-5 w-5" />
            </span>
            <h2 className="mt-3 font-semibold text-foreground">{c.title}</h2>
            <p className="mt-1 break-all text-xs sm:text-sm text-muted-foreground">{c.value}</p>
          </a>
        ))}
      </section>
    </SiteLayout>
  );
}
