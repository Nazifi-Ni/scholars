import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — ScholarsConnect" },
      { name: "description", content: "How ScholarsConnect uses cookies to improve your experience." },
      { property: "og:url", content: "/cookie-policy" },
    ],
    links: [{ rel: "canonical", href: "/cookie-policy" }],
  }),
  component: CookiePolicyPage,
});

function CookiePolicyPage() {
  return (
    <SiteLayout newsletter={false}>
      <section className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Cookie Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/80">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. What Are Cookies</h2>
            <p className="mt-2">Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">2. How We Use Cookies</h2>
            <p className="mt-2">ScholarsConnect uses cookies to understand how you interact with our website, to remember your preferences (like your authentication status), and to serve personalized advertisements through our advertising partners like Google AdSense.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Third-Party Cookies (Google AdSense)</h2>
            <p className="mt-2">We use third-party advertising companies, such as Google AdSense, to serve ads when you visit our website. These companies may use cookies (like the Google DoubleClick cookie) to serve ads based on your prior visits to our website or other websites on the Internet.</p>
            <p className="mt-2">Users may opt out of the use of the DoubleClick cookie for interest-based advertising by visiting the <a href="https://myadcenter.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Google Ads Settings</a>.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Managing Cookies</h2>
            <p className="mt-2">You can choose to disable or selectively turn off our cookies or third-party cookies in your browser settings. However, this can affect how you are able to interact with our site as well as other websites. This could include the inability to login to services or programs, such as logging into your ScholarsConnect account.</p>
          </section>
        </div>
      </section>
    </SiteLayout>
  );
}
