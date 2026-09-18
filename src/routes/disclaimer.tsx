import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — ScholarsConnect" },
      { name: "description", content: "Important legal disclaimers regarding the information provided on ScholarsConnect." },
      { property: "og:url", content: "/disclaimer" },
    ],
    links: [{ rel: "canonical", href: "/disclaimer" }],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <SiteLayout newsletter={false}>
      <section className="mx-auto max-w-4xl px-4 py-14 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Disclaimer</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: September 2026</p>
        
        <div className="space-y-8 text-base leading-relaxed text-foreground/90">
          
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. General Information Disclaimer</h2>
            <p className="mb-4">
              The information provided by ScholarsConnect ("we," "us," or "our") on www.scholarsconnect.com.ng (the "Site") is for general informational and educational purposes only. All information on the Site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
            </p>
            <p className="mb-4">
              UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE. YOUR USE OF THE SITE AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE IS SOLELY AT YOUR OWN RISK.
            </p>
            <p>
              ScholarsConnect operates purely as an opportunity aggregator and discovery board. We are not a university, an educational institution, a scholarship board, a funding agency, or an official representative of any organization whose opportunities are listed on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. External Links Disclaimer</h2>
            <p className="mb-4">
              The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
            </p>
            <p className="mb-4">
              WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES LINKED THROUGH THE SITE OR ANY WEBSITE OR FEATURE LINKED IN ANY BANNER OR OTHER ADVERTISING. WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES.
            </p>
            <p>
              When you click on a link to an external website, such as applying for a scholarship on a university portal, you are leaving ScholarsConnect and are subject to the terms and privacy policies of that third-party website. Always exercise caution and perform your own due diligence before submitting personal data or sensitive information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Professional Advice Disclaimer</h2>
            <p className="mb-4">
              The Site cannot and does not contain legal, financial, immigration, or professional academic advising. The information is provided for general informational and educational purposes only and is not a substitute for professional advice.
            </p>
            <p className="mb-4">
              Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals (such as university admissions counselors, visa immigration officers, or legal consultants). We do not provide any kind of professional advising. THE USE OR RELIANCE OF ANY INFORMATION CONTAINED ON THIS SITE IS SOLELY AT YOUR OWN RISK.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Opportunity Listings and Scholarships Disclaimer</h2>
            <p className="mb-4">
              ScholarsConnect manually aggregates information about scholarships, internships, fellowships, and grants from various public sources, university websites, and organizational portals. While we strive to verify this information, the details of these opportunities (including but not limited to eligibility criteria, funding amounts, application deadlines, and required documents) can change abruptly at the absolute discretion of the official awarding bodies.
            </p>
            <p className="mb-4">
              Therefore, we explicitly disclaim any responsibility for:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Changes to scholarship deadlines or sudden closures of application portals.</li>
              <li>Modifications to the monetary value or funding scope of an opportunity.</li>
              <li>Rejection of your application by the awarding body for any reason.</li>
              <li>Errors, omissions, or outdated information in our summaries compared to the official provider's guidelines.</li>
            </ul>
            <p>
              It is solely your responsibility to cross-check all facts directly with the official scholarship provider before dedicating time and resources to prepare an application. The presence of an opportunity on ScholarsConnect does not guarantee that you will be awarded the scholarship or that the program is perfectly suited to your needs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Fraud and Scam Warning</h2>
            <p className="mb-4">
              Unfortunately, the education sector is frequently targeted by scammers who create fake scholarship offers to extract application fees or steal personal identities. ScholarsConnect maintains a strict internal review policy and does its utmost to filter out suspicious listings. However, we cannot guarantee absolute immunity from sophisticated scams.
            </p>
            <p className="mb-4">
              Please observe the following safety guidelines:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Never pay an application fee</strong> to a generic third-party scholarship agency. Legitimate scholarships rarely ask for application fees. If a university requires an admission application fee, you should only pay it directly on the university's official, secure payment portal.</li>
              <li>Be extremely wary of scholarships that "guarantee" funding in exchange for upfront payments.</li>
              <li>Do not provide your bank account details or credit card information unless you are certain of the recipient's absolute legitimacy (e.g., official government portals or verified university payment gateways).</li>
            </ul>
            <p>
              If you suspect that an opportunity listed on ScholarsConnect is fraudulent, please contact us immediately at admin@scholarsconnect.com.ng so we can investigate and remove the listing if necessary.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Affiliates and Advertising Disclaimer</h2>
            <p className="mb-4">
              To maintain our platform as a 100% free resource for African students, ScholarsConnect relies on advertising revenue. We partner with advertising networks such as Google AdSense to display relevant ads across our pages.
            </p>
            <p className="mb-4">
              The appearance of an advertisement on ScholarsConnect does not constitute an endorsement, guarantee, warranty, or recommendation by us of the product, service, or institution being advertised. We do not have full direct control over which specific ads Google AdSense decides to show to you, as these are often based on your own browsing history and cookies.
            </p>
            <p>
              We are not responsible for any transactions, interactions, or issues that arise between you and an advertiser found through our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Contact Us</h2>
            <p className="mb-4">
              If you require any more information or have any questions about our site's disclaimer, please feel free to contact us:
            </p>
            <p className="font-medium">Email: admin@scholarsconnect.com.ng</p>
            <p className="font-medium">Phone: 07065274251</p>
          </section>

        </div>
      </section>
    </SiteLayout>
  );
}
