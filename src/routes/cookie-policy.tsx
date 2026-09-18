import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — ScholarsConnect" },
      { name: "description", content: "Detailed explanation of how ScholarsConnect uses cookies and tracking technologies." },
      { property: "og:url", content: "/cookie-policy" },
    ],
    links: [{ rel: "canonical", href: "/cookie-policy" }],
  }),
  component: CookiePolicyPage,
});

function CookiePolicyPage() {
  return (
    <SiteLayout newsletter={false}>
      <section className="mx-auto max-w-4xl px-4 py-14 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Cookie Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: September 2026</p>
        
        <div className="space-y-8 text-base leading-relaxed text-foreground/90">
          
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
            <p className="mb-4">
              This Cookie Policy is an integral part of our broader Privacy Policy and explains how ScholarsConnect ("we," "us," or "our") uses cookies, web beacons, tracking pixels, and other tracking technologies when you visit our website at www.scholarsconnect.com.ng, including any other media form, media channel, mobile website, or mobile application related or connected thereto (collectively, the "Site").
            </p>
            <p className="mb-4">
              We believe in being transparent about how we collect and use data related to you. This policy provides detailed information about how and when we use cookies on our Site. By continuing to browse or use our Site, you agree to our use of cookies and other tracking technologies as described in this policy. If you do not agree to our use of cookies, you should configure your browser settings accordingly or refrain from using our Site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. What Are Cookies?</h2>
            <p className="mb-4">
              Cookies are small text files, often containing unique identifiers, that are downloaded to your computer, tablet, smartphone, or other device when you access certain websites. Cookies do lots of different jobs, like letting you navigate between pages efficiently, remembering your preferences, and generally improving your user experience.
            </p>
            <p className="mb-4">
              Cookies can be "Persistent" or "Session" cookies. Persistent cookies remain on your personal computer or mobile device when you go offline, while Session cookies are deleted as soon as you close your web browser. 
            </p>
            <p>
              Cookies can also be categorized as "First-party" cookies, which are set by the website you are visiting (in this case, ScholarsConnect), or "Third-party" cookies, which are set by a domain other than the one you are currently visiting (such as our analytics or advertising partners).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Cookies</h2>
            <p className="mb-4">
              When you use and access the Site, we may place a number of cookie files in your web browser. We use cookies for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-4 mb-4">
              <li>
                <strong>Strictly Necessary Cookies:</strong> These are essential for you to browse the Site and use its features, such as accessing secure areas of the Site. Without these cookies, services like user registration and login authentication cannot be provided. They help authenticate users and prevent fraudulent use of user accounts.
              </li>
              <li>
                <strong>Performance and Analytics Cookies:</strong> These cookies collect information about how you use a website, like which pages you visited and which links you clicked on. None of this information can be used to identify you. It is all aggregated and, therefore, anonymized. Their sole purpose is to improve website functions. This includes cookies from third-party analytics services like Google Analytics.
              </li>
              <li>
                <strong>Functionality Cookies:</strong> These allow our Site to remember choices you make (such as your user name, language, or the region you are in) and provide enhanced, more personal features. For example, they may be used to remember your search preferences for scholarships or courses.
              </li>
              <li>
                <strong>Targeting and Advertising Cookies:</strong> We rely on advertising revenue to keep our platform completely free for African students. To achieve this, we use advertising cookies (specifically through Google AdSense) to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement as well as help measure the effectiveness of the advertising campaign. They are usually placed by advertising networks with the website operator's permission.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Third-Party Cookies and Google AdSense</h2>
            <p className="mb-4">
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Site, deliver advertisements on and through the Site, and so on.
            </p>
            <p className="mb-4">
              A significant third-party partner on our Site is <strong>Google AdSense</strong>. Google uses cookies to help serve the ads it displays on the websites of its partners, such as websites displaying Google ads or participating in Google certified ad networks. When users visit a Google partner's website, a cookie may be dropped on that end user's browser.
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
              <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
              <li>Users may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Google Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">www.aboutads.info</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Managing and Disabling Cookies</h2>
            <p className="mb-4">
              Most web browsers are set to accept cookies by default. However, you can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer, and you can set most browsers to prevent them from being placed.
            </p>
            <p className="mb-4">
              If you do this, however, you may have to manually adjust some preferences every time you visit a site, and some services and functionalities (such as staying logged into your account) may not work properly.
            </p>
            <p className="mb-4">
              To learn more about how to manage cookies on popular browsers, please visit the help pages of your specific browser:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Google Chrome:</strong> Settings {'>'} Privacy and security {'>'} Cookies and other site data</li>
              <li><strong>Mozilla Firefox:</strong> Options {'>'} Privacy & Security {'>'} Cookies and Site Data</li>
              <li><strong>Apple Safari:</strong> Preferences {'>'} Privacy {'>'} Cookies and website data</li>
              <li><strong>Microsoft Edge:</strong> Settings {'>'} Cookies and site permissions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Updates to This Policy</h2>
            <p className="mb-4">
              We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Contact Us</h2>
            <p className="mb-4">
              If you have any questions or comments about our use of cookies, please contact us at:
            </p>
            <p className="font-medium">Email: admin@scholarsconnect.com.ng</p>
            <p className="font-medium">Phone: 07065274251</p>
          </section>

        </div>
      </section>
    </SiteLayout>
  );
}
