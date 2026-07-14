import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { RouteErrorFallback } from "@/components/RouteFallbacks";
import { faqsQuery } from "@/lib/queries";

export const Route = createFileRoute("/faq")({
  loader: ({ context }) => context.queryClient.ensureQueryData(faqsQuery),
  head: () => ({
    meta: [
      { title: "FAQ — ScholarsConnect" },
      { name: "description", content: "Answers to common questions about finding and applying for scholarships on ScholarsConnect." },
      { property: "og:title", content: "FAQ — ScholarsConnect" },
      { property: "og:description", content: "Common questions about scholarships and using ScholarsConnect." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  errorComponent: RouteErrorFallback,
  component: FaqPage,
});

function FaqPage() {
  const { data } = useSuspenseQuery(faqsQuery);
  return (
    <SiteLayout>
      <section className="bg-gradient-hero px-4 py-14 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-navy-foreground sm:text-4xl">Frequently Asked Questions</h1>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
        <Accordion type="single" collapsible className="space-y-3">
          {data.faqs.map((f, i) => (
            <AccordionItem key={i} value={`f-${i}`} className="rounded-xl border border-border bg-card px-5 shadow-soft">
              <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">{f.question}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </SiteLayout>
  );
}