import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ScholarsConnect" },
      { name: "description", content: "How ScholarsConnect collects, uses, and protects your personal information." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteLayout newsletter={false}>
      <section className="mx-auto max-w-4xl px-4 py-14 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: September 2026</p>
        
        <div className="space-y-8 text-base leading-relaxed text-foreground/90">
          
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction and Scope</h2>
            <p className="mb-4">
              At ScholarsConnect ("we," "us," or "our"), we are deeply committed to protecting your personal information and your right to privacy. This extensive Privacy Policy is designed to explain how we collect, use, disclose, and safeguard your information when you visit our website (www.scholarsconnect.com.ng), use our services, or engage with our platform in any manner.
            </p>
            <p className="mb-4">
              When you use our platform, you trust us with your personal data. We take this responsibility very seriously. This comprehensive document aims to outline our privacy practices in strict accordance with global data protection regulations, ensuring that you fully understand your rights and our obligations. By continuing to use ScholarsConnect, you acknowledge that you have read, understood, and agreed to the practices described in this Privacy Policy.
            </p>
            <p>
              If you do not agree with the terms set out in this policy, please discontinue your use of our platform immediately. Our primary goal is to provide a safe, secure, and transparent environment for all African students and young professionals seeking academic and career opportunities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
            <p className="mb-4">
              To provide you with the most relevant and personalized experience, we collect various types of information. This collection occurs through direct interactions, automated technologies, and sometimes via third-party integrations. The categories of data we collect include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Personal Identification Information:</strong> When you register an account, subscribe to our newsletter, or contact us, we may collect your full name, email address, phone number, and location (country of residence).</li>
              <li><strong>Academic and Professional Data:</strong> To help tailor scholarship and job recommendations, you may choose to provide information about your current academic level, field of study, university affiliations, and career interests.</li>
              <li><strong>Account Credentials:</strong> Passwords and security information used for authentication and account access. Please note that passwords are encrypted and not visible to our staff.</li>
              <li><strong>Usage Data and Analytics:</strong> We automatically collect information about how you interact with our platform. This includes your IP address, browser type, device specifications, operating system, pages visited, time spent on pages, clickstream data, and referring URLs.</li>
              <li><strong>Communication Records:</strong> When you reach out to our support team via email (admin@scholarsconnect.com.ng) or social media channels, we retain records of those communications to improve our customer service and resolve disputes.</li>
            </ul>
            <p>
              We do not knowingly collect sensitive personal data such as race, ethnic origin, political opinions, religious beliefs, or health data unless explicitly required for a specific opportunity and provided voluntarily by you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">
              ScholarsConnect utilizes the collected information for a multitude of operational, analytical, and developmental purposes. Our primary objective is to enhance your experience and successfully connect you with life-changing opportunities. Specifically, we use your data to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Provide and Maintain Services:</strong> To create and manage your account, deliver the specific features you request, and ensure the platform functions seamlessly across all devices.</li>
              <li><strong>Personalization:</strong> To tailor our content, scholarship alerts, and internship recommendations based on your academic profile, country of origin, and expressed interests.</li>
              <li><strong>Communication:</strong> To send you important administrative messages, security alerts, technical notices, and updates regarding changes to our policies. If you opt-in, we will also send you our weekly newsletter containing the latest opportunities.</li>
              <li><strong>Platform Improvement:</strong> To conduct data analysis, identify usage trends, determine the effectiveness of our campaigns, and evaluate user feedback to redesign or upgrade our platform's user interface and features.</li>
              <li><strong>Security and Fraud Prevention:</strong> To monitor for suspicious activity, prevent unauthorized access to user accounts, enforce our Terms of Service, and protect the overall integrity of the ScholarsConnect ecosystem.</li>
              <li><strong>Advertising and Marketing:</strong> To deliver targeted advertisements that may be of interest to you, utilizing third-party advertising partners such as Google AdSense. This helps keep our platform entirely free for students.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. How We Share Your Information</h2>
            <p className="mb-4">
              We highly value your privacy and do not sell your personal data to data brokers or direct marketers. However, to operate our platform efficiently, there are specific scenarios where we may share your information with trusted third parties:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Service Providers:</strong> We employ third-party companies to facilitate our service (e.g., Supabase for database hosting, Vercel for frontend hosting, email delivery services like Resend or Mailchimp). These providers have access to your data only to perform tasks on our behalf and are strictly obligated not to disclose or use it for any other purpose.</li>
              <li><strong>Advertising Partners:</strong> We work with ad networks like Google AdSense to display advertisements. These partners may use cookies and web beacons to collect non-personal data about your visits to our site to provide relevant ads. Please refer to our Cookie Policy for more details.</li>
              <li><strong>Analytics Providers:</strong> We use tools like Google Analytics to track and analyze website traffic. This helps us understand user behavior and optimize our content.</li>
              <li><strong>Legal Obligations:</strong> We may disclose your information where legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, restructuring, bankruptcy, or sale of all or a portion of our assets, your information may be transferred as part of that transaction, provided the receiving party agrees to respect your personal data in a manner consistent with this Privacy Policy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Data Security and Retention</h2>
            <p className="mb-4">
              ScholarsConnect implements a robust array of technical and organizational security measures designed to protect the security of any personal information we process. Our database is hosted on secure, enterprise-grade cloud infrastructure with encryption both in transit (using HTTPS/SSL protocols) and at rest. Access to personal data is strictly limited to authorized personnel who require it to perform their job functions.
            </p>
            <p className="mb-4">
              Despite our rigorous efforts to secure your information, please be aware that no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure. We cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.
            </p>
            <p>
              We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Policy, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). When we have no ongoing legitimate business need to process your personal information, we will either securely delete it or anonymize it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Your Privacy Rights</h2>
            <p className="mb-4">
              Depending on your location and applicable data protection laws, you possess certain rights regarding your personal data. We are committed to facilitating the exercise of these rights for all our users. Your rights include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>The Right to Access:</strong> You have the right to request copies of your personal data that we hold.</li>
              <li><strong>The Right to Rectification:</strong> You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete. You can do this directly within your account settings.</li>
              <li><strong>The Right to Erasure:</strong> You have the right to request that we erase your personal data, under certain conditions. This is often referred to as the "right to be forgotten."</li>
              <li><strong>The Right to Restrict Processing:</strong> You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
              <li><strong>The Right to Data Portability:</strong> You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at admin@scholarsconnect.com.ng. We will respond to your request within a reasonable timeframe, typically within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Children's Privacy</h2>
            <p className="mb-4">
              ScholarsConnect is designed for university students, graduates, and young professionals. We do not knowingly solicit data from or market to children under the age of 16. By using our platform, you represent that you are at least 16 years of age or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the platform. If we learn that personal information from users less than 16 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or other factors. The updated version will be indicated by an updated "Last updated" date at the top of this page, and the updated version will be effective as soon as it is accessible. We encourage you to review this Privacy Policy frequently to be informed of how we are protecting your information. If we make significant material changes, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Contact Us</h2>
            <p className="mb-4">
              If you have any questions, comments, or concerns about this Privacy Policy, our data collection practices, or if you would like to exercise any of your privacy rights, please do not hesitate to contact our Data Protection team.
            </p>
            <p className="font-medium">Email: admin@scholarsconnect.com.ng</p>
            <p className="font-medium">Phone: 07065274251</p>
          </section>

        </div>
      </section>
    </SiteLayout>
  );
}