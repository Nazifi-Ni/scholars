import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — ScholarsConnect" },
      { name: "description", content: "The terms and conditions for using the ScholarsConnect platform." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <SiteLayout newsletter={false}>
      <section className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/80">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Use of the Platform</h2>
            <p className="mt-2">ScholarsConnect is a free discovery platform. We aggregate and verify opportunities but are not the provider of any scholarship, internship or program listed. Always confirm details on the official provider website before applying.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Accuracy of Listings</h2>
            <p className="mt-2">We work hard to keep listings accurate and current, but deadlines and eligibility criteria can change without notice. The official provider's information always takes precedence.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Accounts</h2>
            <p className="mt-2">You are responsible for keeping your account credentials secure. We may suspend accounts involved in fraudulent or abusive activity.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Contact</h2>
            <p className="mt-2">Questions about these terms? Email hello@scholarsconnect.africa.</p>
          </section>
        </div>
      </section>
    </SiteLayout>
  );
}