import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { CheckCircle2, Search, Calendar, FileText, AlertTriangle, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/how-we-verify-opportunities")({
  head: () => ({
    meta: [
      { title: "How ScholarsConnect Verifies Opportunities — Methodology & Standards" },
      {
        name: "description",
        content:
          "Explore our rigorous multi-step verification process for evaluating scholarship deadlines, eligibility criteria, and official sources.",
      },
      { property: "og:title", content: "How We Verify Opportunities — ScholarsConnect" },
      {
        property: "og:description",
        content: "Our editorial methodology for verifying scholarships, internships, and grants.",
      },
      {
        property: "og:url",
        content: "https://www.scholarsconnect.com.ng/how-we-verify-opportunities",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://www.scholarsconnect.com.ng/how-we-verify-opportunities",
      },
    ],
  }),
  component: HowWeVerifyPage,
});

const STEPS = [
  {
    step: "01",
    title: "Official Source Authentication",
    desc: "We verify that the opportunity originates from an accredited university, government scholarship board, accredited foundation, or legitimate international development agency. We check official .edu, .gov, or institutional domains and reject suspicious third-party conduits.",
  },
  {
    step: "02",
    title: "Eligibility & Geographical Scope Checks",
    desc: "We scrutinize nationality, citizenship, academic grade requirements, and language prerequisites. We verify whether the program is genuinely open to students from African nations and specify country-specific exclusions where they exist.",
  },
  {
    step: "03",
    title: "Funding & Benefits Audit",
    desc: "We cross-reference the exact funding terms to distinguish full scholarships (tuition + stipend + travel) from partial tuition waivers or self-funded programs, ensuring students never face surprise expenses.",
  },
  {
    step: "04",
    title: "Application Deadlines & Time Zones",
    desc: "We record official closing dates, noting the provider's specific time zone (e.g. GMT, EST, CET) so students do not miss application windows due to international time differences.",
  },
  {
    step: "05",
    title: "Document & Application Checklist",
    desc: "Our editors assemble a practical checklist of required documentation—transcripts, recommendation letters, research proposals, and language scores—providing advice on preparation times.",
  },
];

function HowWeVerifyPage() {
  return (
    <SiteLayout newsletter={false}>
      <section className="bg-gradient-hero px-4 py-16 lg:px-8 border-b border-border">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider mb-4">
            Our Verification Methodology
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-foreground font-heading">
            How ScholarsConnect Verifies Opportunities
          </h1>
          <p className="mt-4 text-base sm:text-lg text-navy-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Every scholarship listing on ScholarsConnect undergoes human editorial review before
            publication. Here is our exact verification process.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 lg:px-8">
        <div className="space-y-12 text-foreground/90 font-sans text-base leading-relaxed">
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-6 flex items-start gap-4 text-amber-950">
            <AlertTriangle className="h-6 w-6 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-sm leading-relaxed">
              <strong className="font-bold">Important Applicant Advisory:</strong> While
              ScholarsConnect takes rigorous steps to verify program details against official
              guidelines, institutional deadlines and terms can change without advance notice. We
              always urge applicants to confirm all details directly on the official university or
              provider portal before submitting applications or investing resources.
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-navy font-heading mb-6">
              Our 5-Step Editorial Review Process
            </h2>
            <div className="space-y-6">
              {STEPS.map((s) => (
                <div
                  key={s.step}
                  className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 items-start"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary font-bold font-heading flex items-center justify-center shrink-0 text-lg">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-navy mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy font-heading mb-4">
              Handling Expired Listings
            </h2>
            <p className="mb-4">
              We monitor active opportunities and update listings when deadlines expire. Rather than
              abruptly deleting pages, expired opportunities are marked with an{" "}
              <strong>Application Closed</strong> status. This allows prospective candidates in
              future academic cycles to study eligibility parameters, prepare documents in advance,
              and explore similar active programs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy font-heading mb-4">
              Sponsored Opportunities & Commercial Content
            </h2>
            <p className="mb-4">
              If an organization sponsors a listing or advertises on our platform, the post is
              clearly designated with a <strong>Sponsored</strong> label. Sponsored listings must
              satisfy the same authenticity and safety criteria as unpaid listings. We never feature
              deceptive or unaccredited programs.
            </p>
            <p className="mb-4">
              For more information on our advertising standards and affiliate relationships, please
              read our{" "}
              <Link
                to="/affiliate-disclosure"
                className="text-primary font-semibold hover:underline"
              >
                Affiliate & Commercial Disclosure
              </Link>{" "}
              and{" "}
              <Link to="/editorial-policy" className="text-primary font-semibold hover:underline">
                Editorial Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy font-heading mb-4">
              Reporting Outdated or Inaccurate Information
            </h2>
            <p className="mb-4">
              If you discover an altered deadline, a broken link, or a change in scholarship
              funding, please notify our editorial desk at{" "}
              <a
                href="mailto:admin@scholarsconnect.com.ng"
                className="text-primary font-semibold hover:underline"
              >
                admin@scholarsconnect.com.ng
              </a>
              . Our editors investigate and update verified changes within 48 hours.
            </p>
          </section>
        </div>
      </section>
    </SiteLayout>
  );
}
