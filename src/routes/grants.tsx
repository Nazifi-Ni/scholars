import { createFileRoute } from "@tanstack/react-router";
import { TypeLandingPage, typeLandingHead } from "@/components/TypeLandingPage";
import { RouteErrorFallback } from "@/components/RouteFallbacks";
import { searchQuery } from "@/lib/queries";

export const Route = createFileRoute("/grants")({
  loader: ({ context }) => context.queryClient.ensureQueryData(searchQuery({ type: "grant", sort: "featured" })),
  head: () => typeLandingHead("/grants", "Grants", "Research and project grants for African students, researchers and innovators."),
  errorComponent: RouteErrorFallback,
  component: () => <TypeLandingPage type="grant" title="Grants" description="Research and project grants for students, researchers and innovators solving real problems." />,
});