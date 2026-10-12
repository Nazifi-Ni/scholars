import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ShieldCheck, BookOpen, Scale, AlertCircle, FileCheck, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/editorial-policy")({
  head: () => ({
    meta: [
      { title: "Editorial Policy & Standards — ScholarsConnect" },
      {
        name: "description",
        content:
          "Our editorial principles, verification criteria, and independence standards for publishing opportunities on ScholarsConnect.",
      },
      { property: "og:title", content: "Editorial Policy — ScholarsConnect" },
      {
        property: "og:description",
        content:
          "Learn about our strict editorial principles, fact-checking processes, and integrity standards.",
      },
      { property: "og:url", content: "https://scholarsconnect.com.ng/editorial-policy" },
    ],
    links: [{ rel: "canonical", href: "https://scholarsconnect.com.ng/editorial-policy" }],
  }),
  component: EditorialPolicyPage,
});

function EditorialPolicyPage() {
  return (
    <SiteLayout newsletter={false}>
      <section className="bg-gradient-hero px-4 py-16 lg:px-8 border-b border-border">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider mb-4">
            Editorial Integrity & Trust
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-foreground font-heading">
            ScholarsConnect Editorial Policy
          </h1>
          <p className="mt-4 text-base sm:text-lg text-navy-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Our mission is to empower African students with verified, actionable, and truthful
            opportunity intelligence. Here is how our editorial team ensures transparency and
            independence.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 lg:px-8">
        <div className="space-y-12 text-foreground/90 font-sans text-base leading-relaxed">
          <div className="bg-muted/30 border border-border p-6 rounded-2xl flex items-start gap-4">
            <ShieldCheck className="h-8 w-8 text-secondary shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-bold text-navy font-heading mb-1">
                Editorial Independence Pledge
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                ScholarsConnect maintains complete editorial control over all published guides,
                summaries, and advice. We never accept payment to recommend unqualified programs or
                promote deceptive scholarship opportunities.
              </p>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-navy font-heading mb-4">
              1. Primary Source Verification
            </h2>
            <p className="mb-4">
              We never publish opportunities derived solely from secondary aggregators, social media
              rumors, or unverified chat groups. Every scholarship, fellowship, internship, or grant
              listed on ScholarsConnect must be traceable to an official source—such as a university
              admissions office, government ministry, recognized foundation, or certified corporate
              sponsor.
            </p>
            <p className="mb-4">
              Where available, our opportunity listings prominently display direct links to the
              official program website and application portal, allowing students to cross-examine
              requirements directly with the institution.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy font-heading mb-4">
              2. Original Synthesis & Editorial Value
            </h2>
            <p className="mb-4">
              We believe students deserve more than raw copies of admissions notices. Our editorial
              team reviews dense academic eligibility criteria and synthesizes the core essentials:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4 text-foreground/85">
              <li>
                <strong>Plain-Language Summaries:</strong> Demystifying academic jargon, funding
                definitions, and residency constraints.
              </li>
              <li>
                <strong>Target Audience Identification:</strong> Clarifying exactly who the
                opportunity is best suited for, and who should look elsewhere.
              </li>
              <li>
                <strong>ScholarsConnect Advice:</strong> Actionable preparation strategies,
                motivation letter guidance, and common application pitfalls.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy font-heading mb-4">
              3. Fraud Prevention & Fee Disclosures
            </h2>
            <p className="mb-4">
              African students are disproportionately targeted by scholarship scams demanding
              processing fees or personal financial data. ScholarsConnect enforces strict screening:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4 text-foreground/85">
              <li>
                We reject opportunities that require upfront "guaranteed award" fees or hidden
                processing charges from third-party agents.
              </li>
              <li>
                If an institution charges a standard university admission application fee, this is
                explicitly highlighted in the listing so students can make informed budget
                decisions.
              </li>
              <li>
                We actively alert applicants if an opportunity requires costly standardized tests
                (e.g. IELTS, TOEFL, GRE) or official document notarizations.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy font-heading mb-4">
              4. Expired Opportunities & Archival Policy
            </h2>
            <p className="mb-4">
              Scholarship dates fluctuate and annual funding cycles open and close. When an
              application deadline passes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4 text-foreground/85">
              <li>
                We immediately display an unambiguous <strong>APPLICATION CLOSED</strong> badge on
                the opportunity listing.
              </li>
              <li>
                We preserve the eligibility requirements, documentation checklists, and application
                steps so prospective applicants can study previous cycles and prepare in advance for
                future rounds.
              </li>
              <li>
                We provide contextual links to related open opportunities with active deadlines.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy font-heading mb-4">
              5. Sponsored Content & Commercial Partnerships
            </h2>
            <p className="mb-4">
              To keep our platform free for students across all 54 African countries,
              ScholarsConnect may display advertisements and partner with accredited educational
              institutions. Our guidelines for commercial content are rigid:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4 text-foreground/85">
              <li>
                Any content paid for or provided by a sponsor is clearly and prominently labeled as{" "}
                <strong>Sponsored</strong> or <strong>Advertisement</strong>.
              </li>
              <li>
                Advertisers have zero input or veto power over our independent editorial advice,
                critical reviews, or cautionary warnings.
              </li>
              <li>
                See our dedicated{" "}
                <Link
                  to="/affiliate-disclosure"
                  className="text-primary font-semibold hover:underline"
                >
                  Affiliate & Sponsorship Disclosure
                </Link>{" "}
                for complete details.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy font-heading mb-4">
              6. Corrections & Continuous Review
            </h2>
            <p className="mb-4">
              While our team makes every reasonable effort to verify deadlines, awards, and
              requirements, scholarship providers reserve the right to alter criteria without
              advance notice. We do not make unrealistic claims of absolute infallibility.
            </p>
            <p className="mb-4">
              If you identify an error, a changed deadline, or an outdated link, we encourage
              readers to email us immediately at{" "}
              <a
                href="mailto:admin@scholarsconnect.com.ng"
                className="text-primary font-semibold hover:underline"
              >
                admin@scholarsconnect.com.ng
              </a>
              . Corrections are investigated and updated promptly.
            </p>
          </section>
        </div>
      </section>
    </SiteLayout>
  );
}
