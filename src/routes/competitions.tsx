import { createFileRoute } from "@tanstack/react-router";
import { TypeLandingPage, typeLandingHead } from "@/components/TypeLandingPage";
import { RouteErrorFallback } from "@/components/RouteFallbacks";
import { searchQuery } from "@/lib/queries";

export const Route = createFileRoute("/competitions")({
  loader: ({ context }) => context.queryClient.ensureQueryData(searchQuery({ type: "competition", sort: "featured" })),
  head: () => typeLandingHead("/competitions", "Competitions", "Academic and business competitions with cash prizes, seed funding and global recognition."),
  errorComponent: RouteErrorFallback,
  component: () => <TypeLandingPage type="competition" title="Competitions" description="Academic and business competitions with cash prizes, seed funding and global recognition." />,
});