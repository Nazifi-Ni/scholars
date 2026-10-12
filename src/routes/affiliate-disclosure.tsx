import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Handshake, ShieldAlert, Award, Info } from "lucide-react";

export const Route = createFileRoute("/affiliate-disclosure")({
  head: () => ({
    meta: [
      { title: "Affiliate & Advertising Disclosure — ScholarsConnect" },
      {
        name: "description",
        content:
          "Transparency statement regarding advertising, sponsorships, and affiliate partnerships on ScholarsConnect.",
      },
      { property: "og:title", content: "Affiliate & Advertising Disclosure — ScholarsConnect" },
      {
        property: "og:description",
        content:
          "Learn how ScholarsConnect monetizes its free platform ethically and transparently.",
      },
      {
        property: "og:url",
        content: "https://scholarsconnect.com.ng/affiliate-disclosure",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://scholarsconnect.com.ng/affiliate-disclosure",
      },
    ],
  }),
  component: AffiliateDisclosurePage,
});

function AffiliateDisclosurePage() {
  return (
    <SiteLayout newsletter={false}>
      <section className="bg-gradient-hero px-4 py-16 lg:px-8 border-b border-border">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider mb-4">
            Transparency & Monetization Disclosure
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-foreground font-heading">
            Affiliate & Commercial Disclosure
          </h1>
          <p className="mt-4 text-base sm:text-lg text-navy-foreground/80 max-w-2xl mx-auto leading-relaxed">
            ScholarsConnect is completely free for all students. Here is full transparency on how we
            finance our operations and maintain editorial independence.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 lg:px-8">
        <div className="space-y-12 text-foreground/90 font-sans text-base leading-relaxed">
          <div className="bg-muted/30 border border-border p-6 rounded-2xl flex items-start gap-4">
            <Info className="h-7 w-7 text-secondary shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-bold text-navy font-heading mb-1">
                Our Free Access Commitment
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We believe financial constraints should never stand between an ambitious student and
                educational opportunities. Browsing opportunities, reading our guides, and accessing
                scholarship links will always be 100% free of charge for students.
              </p>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-navy font-heading mb-4">
              1. Affiliate Partnerships
            </h2>
            <p className="mb-4">
              To sustain platform hosting, database servers, and editorial verification efforts,
              ScholarsConnect participates in select educational affiliate partnerships. This means
              that if you click on certain links (such as study-abroad preparation tools, language
              learning apps, accredited online courses, or international student banking services)
              and subsequently make a purchase or subscribe, ScholarsConnect may earn an affiliate
              commission.
            </p>
            <p className="mb-4">
              <strong>
                Crucially, using our affiliate links never increases the price you pay.
              </strong>{" "}
              Educational resources mentioned on ScholarsConnect are evaluated independently for
              their genuine academic utility.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy font-heading mb-4">
              2. Display Advertising (Google AdSense)
            </h2>
            <p className="mb-4">
              ScholarsConnect may use third-party advertising networks, including Google AdSense, to
              support the operation of the platform. If display advertising is introduced,
              advertising will be presented in accordance with the provider’s policies.
            </p>
            <p className="mb-4">
              Any future advertisements served via third-party ad networks will be automated and
              clearly labeled. ScholarsConnect does not endorse products or services appearing in
              automated ad placements. For details on how advertising cookies function, please
              consult our{" "}
              <Link to="/cookie-policy" className="text-primary font-semibold hover:underline">
                Cookie Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy font-heading mb-4">
              3. Sponsored Content & Educational Partners
            </h2>
            <p className="mb-4">
              From time to time, universities, government exchange programs, or educational
              non-profits may sponsor an opportunity listing or featured guide on ScholarsConnect.
            </p>
            <p className="mb-4">
              In accordance with ethical publishing standards and Google Webmaster Guidelines, all
              sponsored material is visibly labeled with a <strong>Sponsored</strong> tag. We never
              camouflage paid advertisements as independent editorial recommendations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy font-heading mb-4">
              4. Editorial Independence
            </h2>
            <p className="mb-4">
              Our editorial assessments, application difficulty rankings, and ScholarsConnect Advice
              are strictly independent. Commercial sponsors cannot buy positive reviews, alter our
              critical advice, or suppress warnings about application hurdles. If an opportunity
              does not meet our safety and accreditation criteria, it is not published on
              ScholarsConnect, regardless of financial offer.
            </p>
            <p className="mb-4">
              For complete information on our fact-checking standards, see our{" "}
              <Link to="/editorial-policy" className="text-primary font-semibold hover:underline">
                Editorial Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy font-heading mb-4">
              5. Questions & Feedback
            </h2>
            <p className="mb-4">
              If you have any questions regarding our commercial relationships or affiliate
              partnerships, please reach out directly:
            </p>
            <p className="font-semibold text-navy">Email: admin@scholarsconnect.com.ng</p>
            <p className="font-semibold text-navy">Phone: 07065274251</p>
          </section>
        </div>
      </section>
    </SiteLayout>
  );
}
