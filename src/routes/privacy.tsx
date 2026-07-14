import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ScholarsConnect" },
      { name: "description", content: "How ScholarsConnect collects, uses and protects your personal information." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteLayout newsletter={false}>
      <section className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/80">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
            <p className="mt-2">We collect information you provide directly — such as your email address when subscribing to our newsletter or creating an account — and basic usage data that helps us improve the platform.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
            <p className="mt-2">Your data is used to deliver opportunity alerts, personalize recommendations, and operate account features such as bookmarks and application tracking. We never sell your personal information.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Data Security</h2>
            <p className="mt-2">All data is stored securely with encryption in transit and at rest. Access to personal data is restricted and role-based.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Your Rights</h2>
            <p className="mt-2">You may request access to, correction of, or deletion of your personal data at any time by contacting hello@scholarsconnect.africa.</p>
          </section>
        </div>
      </section>
    </SiteLayout>
  );
}