import { createFileRoute } from "@tanstack/react-router";
import { TypeLandingPage, typeLandingHead } from "@/components/TypeLandingPage";
import { RouteErrorFallback } from "@/components/RouteFallbacks";
import { searchQuery } from "@/lib/queries";

export const Route = createFileRoute("/scholarships")({
  loader: ({ context }) => context.queryClient.ensureQueryData(searchQuery({ type: "scholarship", sort: "featured" })),
  head: () => typeLandingHead("/scholarships", "Scholarships", "Fully and partially funded scholarships for African students — undergraduate, masters and PhD, verified daily."),
  errorComponent: RouteErrorFallback,
  component: () => <TypeLandingPage type="scholarship" title="Scholarships" description="Fully and partially funded scholarships for undergraduate, masters and PhD studies worldwide — every listing verified." />,
});