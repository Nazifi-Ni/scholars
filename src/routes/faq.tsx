import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — ScholarsConnect" },
      { name: "description", content: "Answers to the most frequently asked questions about finding and applying for scholarships on ScholarsConnect." },
      { property: "og:title", content: "FAQ — ScholarsConnect" },
      { property: "og:description", content: "Comprehensive answers to common questions about scholarships and using ScholarsConnect." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FaqPage,
});

const STATIC_FAQS = [
  {
    question: "What is ScholarsConnect and how does it actually work?",
    answer: "ScholarsConnect is a comprehensive discovery platform specifically designed for African students and young professionals seeking to advance their education and careers. We bridge the massive information gap by scouring the internet to aggregate, verify, and clearly summarize fully funded scholarships, internships, fellowships, and grants from universities and organizations globally. We are not a scholarship awarding body. Think of us as your highly specialized search engine for educational opportunities. When you find an opportunity you like on our platform, we provide a structured summary of the eligibility criteria, the benefits, the required documents, and a direct link to the official provider's application portal where you will submit your actual application."
  },
  {
    question: "Is ScholarsConnect really 100% free to use?",
    answer: "Yes, absolutely! Creating an account, browsing opportunities, reading our comprehensive guides, and clicking through to application portals will always be 100% free for students. We deeply believe that access to educational opportunities should not be restricted by paywalls. To keep the platform running, pay our server costs, and compensate our team for their hard work, we rely on non-intrusive advertising (such as Google AdSense) displayed on our pages. We do not ask students to pay for access to scholarship links, and we never will."
  },
  {
    question: "Do you guarantee that I will get a scholarship if I apply through your links?",
    answer: "No, we cannot guarantee that you will be awarded a scholarship. Scholarships are highly competitive, especially fully funded ones in countries like the UK, USA, Canada, and Australia. The final decision rests entirely with the university's admission committee or the scholarship funding board. What we *do* guarantee is that we provide you with verified, legitimate opportunities and detailed guides on how to structure your application to maximize your chances. Getting a scholarship depends on your academic grades, the strength of your motivation letter, your leadership experience, and how well you fit the specific criteria of the awarding body."
  },
  {
    question: "Why was my scholarship application rejected?",
    answer: "Rejections are a normal part of the scholarship journey, and even the most outstanding students face them. Common reasons for rejection include: failing to strictly meet the eligibility criteria (such as applying for a scholarship restricted to certain countries when you are from elsewhere), missing the application deadline, submitting incomplete documentation (like missing a vital recommendation letter), or writing a generic motivation letter that fails to explain why you are uniquely suited for that specific program. Sometimes, the applicant pool is simply exceptionally competitive, and there are more qualified candidates than available funding spots. Do not give up; use rejections as learning experiences to refine your next application."
  },
  {
    question: "How do I spot a fake scholarship scam?",
    answer: "Unfortunately, scholarship scams are very common. Here are the biggest red flags to watch out for: 1) Application Fees: A legitimate scholarship will almost never ask you to pay a fee just to apply for the scholarship itself. (Note: some universities charge admission application fees, which is normal, but the scholarship application itself should be free). 2) Guaranteed Funding: If an organization promises that you are 'guaranteed' to win if you apply, it is a scam. 3) Unsolicited Offers: If you receive an email saying you won a scholarship you never applied for, it is a phishing attempt. 4) Request for Bank Details: Legitimate bodies will not ask for your bank account password or credit card details during the initial application phase. Always verify the email domain (e.g., ending in .edu or .ac.uk) and trust your instincts."
  },
  {
    question: "I have a low GPA (e.g., Second Class Lower). Can I still get a scholarship?",
    answer: "Yes, it is entirely possible, though it requires a more strategic approach. While some highly prestigious scholarships (like the Rhodes or Gates Cambridge) strictly require academic excellence (First Class or strong Second Class Upper), many other scholarships evaluate candidates holistically. This means they look beyond just your GPA. If you have a Second Class Lower, you can compensate by demonstrating exceptional leadership skills, extensive relevant work experience, impactful community service, or a brilliant research proposal. Look for scholarships funded by development agencies (like DAAD or Commonwealth Shared Scholarships) which often prioritize the developmental impact of your studies over raw academic grades. Additionally, performing very well in standardized tests like the GRE or securing strong recommendation letters can heavily bolster a weaker GPA."
  },
  {
    question: "What is the 'ScholarsConnect Advice' section I see on opportunities?",
    answer: "The 'ScholarsConnect Advice' is our unique, value-added commentary on an opportunity. Instead of just copy-pasting the eligibility criteria from the university website, our team of experienced scholars provides strategic insights. We might highlight a hidden requirement, give tips on what the selection committee usually looks for in that specific program, or clarify confusing jargon. It's our way of giving you an insider's perspective to help you craft a more targeted, competitive application."
  },
  {
    question: "Do I need to take the IELTS or TOEFL to apply for scholarships?",
    answer: "The answer is: it depends entirely on the university and the specific country. However, as an international student from Africa, having a standardized English proficiency test like IELTS or TOEFL significantly widens your options. Many universities in the UK, USA, Canada, and Australia require it to prove you can handle academic coursework in English. That being said, there is a growing number of universities that will waive the IELTS requirement for African students if you can provide an official letter from your previous university explicitly stating that your undergraduate degree was taught entirely in English. Always check the specific 'English Language Requirements' section of the university you are applying to."
  },
  {
    question: "How often do you update the platform with new opportunities?",
    answer: "Our team updates the platform on a daily basis. We are constantly monitoring university announcements, government portals, and international organizations to bring you the freshest opportunities as soon as they open. We highly recommend checking the website every couple of days or subscribing to our newsletter so you never miss out on an early application window. Many scholarships have rolling admissions, meaning they evaluate applications as they come in, so applying early can be a massive advantage."
  }
];

function FaqPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-navy-foreground sm:text-5xl">Frequently Asked Questions</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-navy-foreground/80 leading-relaxed">
            Navigating the world of international scholarships and applications can be overwhelming. 
            We've compiled comprehensive answers to the most common questions African students ask us 
            to help you apply with confidence.
          </p>
        </div>
      </section>
      
      <section className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
        <Accordion type="single" collapsible className="space-y-4">
          {STATIC_FAQS.map((f, i) => (
            <AccordionItem key={i} value={`f-${i}`} className="rounded-2xl border border-border bg-card px-6 py-2 shadow-sm transition-all hover:shadow-md">
              <AccordionTrigger className="text-left text-base font-bold hover:no-underline text-foreground py-4 leading-snug">
                {f.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed pb-4 pt-2 border-t border-border/50 mt-2">
                {f.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="mt-16 text-center bg-muted/30 p-8 rounded-3xl border border-border">
          <h3 className="text-xl font-bold text-foreground mb-3">Still have questions?</h3>
          <p className="text-muted-foreground mb-6">If you couldn't find the answer you were looking for, our team is always here to help.</p>
          <a href="/contact" className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Contact Support
          </a>
        </div>
      </section>
    </SiteLayout>
  );
}
