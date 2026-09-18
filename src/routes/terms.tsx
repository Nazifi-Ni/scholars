import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — ScholarsConnect" },
      { name: "description", content: "The terms and conditions governing your use of the ScholarsConnect platform." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <SiteLayout newsletter={false}>
      <section className="mx-auto max-w-4xl px-4 py-14 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: September 2026</p>
        
        <div className="space-y-8 text-base leading-relaxed text-foreground/90">
          
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Agreement to Terms</h2>
            <p className="mb-4">
              Welcome to ScholarsConnect. These Terms of Service ("Terms") constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you," "user"), and ScholarsConnect ("we," "us," or "our"), concerning your access to and use of the www.scholarsconnect.com.ng website as well as any other media form, media channel, mobile website, or mobile application related, linked, or otherwise connected thereto (collectively, the "Platform").
            </p>
            <p className="mb-4">
              By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by all of these Terms of Service. If you do not agree with all of these Terms, then you are expressly prohibited from using the Platform and you must discontinue use immediately. We reserve the right, in our sole discretion, to make changes or modifications to these Terms at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of these Terms, and you waive any right to receive specific notice of each such change.
            </p>
            <p>
              It is your responsibility to periodically review these Terms to stay informed of updates. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Terms of Service by your continued use of the Platform after the date such revised Terms are posted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Nature of the Platform</h2>
            <p className="mb-4">
              ScholarsConnect operates as a free, informational discovery platform. Our primary mission is to aggregate, organize, and present verified opportunities including scholarships, internships, grants, fellowships, and career openings that are relevant to African students and young professionals. 
            </p>
            <p className="mb-4">
              <strong>We are not a scholarship provider.</strong> We do not issue grants, fund scholarships, award degrees, or make admission decisions. We act solely as an intermediary information board. While we strive to manually verify every opportunity listed on our platform against the official provider's website, we cannot guarantee the absolute accuracy, completeness, or current validity of any listing. Application deadlines, eligibility criteria, and funding amounts are subject to change by the official providers without notice.
            </p>
            <p>
              Therefore, you agree that ScholarsConnect is not responsible for any rejected applications, missed deadlines, or financial losses incurred as a result of using information found on our platform. Always cross-reference and confirm details directly on the official university or provider's website before dedicating time or resources to an application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. User Representations and Accounts</h2>
            <p className="mb-4">
              By using ScholarsConnect, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Service; (4) you are not under the age of 16; (5) you will not access the Platform through automated or non-human means, whether through a bot, script, or otherwise, without our express written permission; (6) you will not use the Platform for any illegal or unauthorized purpose; and (7) your use of the Platform will not violate any applicable law or regulation.
            </p>
            <p className="mb-4">
              If you create an account on our platform, you are strictly responsible for keeping your password confidential. You are solely responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
            </p>
            <p>
              If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Prohibited Activities</h2>
            <p className="mb-4">
              You may not access or use the Platform for any purpose other than that for which we make the Platform available. As a user of the Platform, you agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Systematically retrieve data or other content from the Platform to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
              <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
              <li>Circumvent, disable, or otherwise interfere with security-related features of the Platform, including features that prevent or restrict the use or copying of any content.</li>
              <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Platform.</li>
              <li>Use any information obtained from the Platform in order to harass, abuse, or harm another person.</li>
              <li>Use the Platform in a manner inconsistent with any applicable laws or regulations.</li>
              <li>Engage in unauthorized framing of or linking to the Platform.</li>
              <li>Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming, that interferes with any party's uninterrupted use and enjoyment of the Platform.</li>
              <li>Attempt to impersonate another user or person or use the username of another user.</li>
              <li>Interfere with, disrupt, or create an undue burden on the Platform or the networks or services connected to the Platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Intellectual Property Rights</h2>
            <p className="mb-4">
              Unless otherwise indicated, the Platform is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Platform (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws.
            </p>
            <p>
              The Content and the Marks are provided on the Platform "AS IS" for your information and personal use only. Except as expressly provided in these Terms of Service, no part of the Platform and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Third-Party Websites and Content</h2>
            <p className="mb-4">
              The Platform contains links to other websites ("Third-Party Websites") as well as articles, photographs, text, graphics, pictures, designs, music, sound, video, information, applications, software, and other content or items belonging to or originating from third parties ("Third-Party Content"). 
            </p>
            <p className="mb-4">
              Such Third-Party Websites and Third-Party Content are not investigated, monitored, or checked for accuracy, appropriateness, or completeness by us, and we are not responsible for any Third-Party Websites accessed through the Platform or any Third-Party Content posted on, available through, or installed from the Platform. Inclusion of, linking to, or permitting the use or installation of any Third-Party Websites or any Third-Party Content does not imply approval or endorsement thereof by us.
            </p>
            <p>
              If you decide to leave the Platform and access the Third-Party Websites or to use or install any Third-Party Content, you do so at your own risk, and you should be aware these Terms of Service no longer govern. You should review the applicable terms and policies, including privacy and data gathering practices, of any website to which you navigate from the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Disclaimer of Warranties and Limitation of Liability</h2>
            <p className="mb-4">
              THE PLATFORM IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE PLATFORM AND OUR SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE PLATFORM AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p className="mb-4">
              IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE PLATFORM, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Governing Law and Dispute Resolution</h2>
            <p className="mb-4">
              These Terms shall be governed by and defined following the laws of Nigeria. ScholarsConnect and yourself irrevocably consent that the courts of Nigeria shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Contact Information</h2>
            <p className="mb-4">
              If you have a complaint regarding the Platform or wish to receive further information regarding use of the Platform, please contact us at:
            </p>
            <p className="font-medium">Email: admin@scholarsconnect.com.ng</p>
            <p className="font-medium">Phone: 07065274251</p>
          </section>

        </div>
      </section>
    </SiteLayout>
  );
}