import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — ScholarsConnect" },
      { name: "description", content: "General disclaimer regarding the opportunities and information listed on ScholarsConnect." },
      { property: "og:url", content: "/disclaimer" },
    ],
    links: [{ rel: "canonical", href: "/disclaimer" }],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <SiteLayout newsletter={false}>
      <section className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Disclaimer</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/80">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Informational Purposes Only</h2>
            <p className="mt-2">All information provided on ScholarsConnect is for general educational and informational purposes only. While we strive to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Not an Official Representative</h2>
            <p className="mt-2">ScholarsConnect is an independent opportunity discovery platform. We are NOT affiliated, associated, authorized, endorsed by, or in any way officially connected with the universities, organizations, governments, or institutions whose scholarships and programs are listed on our site. All product and company names are the registered trademarks of their original owners.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">3. External Links</h2>
            <p className="mt-2">Through this website, you are able to link to other websites which are not under the control of ScholarsConnect. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Financial Responsibility</h2>
            <p className="mt-2">Applying to scholarships, internships, or programs via external providers is done strictly at your own risk. ScholarsConnect will never charge you for applying to a scholarship. Always verify the authenticity of an opportunity on the official provider's website before paying any third-party application fees or sharing sensitive personal information.</p>
          </section>
        </div>
      </section>
    </SiteLayout>
  );
}
