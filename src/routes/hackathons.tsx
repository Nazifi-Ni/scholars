import { createFileRoute } from "@tanstack/react-router";
import { TypeLandingPage, typeLandingHead } from "@/components/TypeLandingPage";
import { RouteErrorFallback } from "@/components/RouteFallbacks";
import { searchQuery } from "@/lib/queries";

export const Route = createFileRoute("/hackathons")({
  loader: ({ context }) => context.queryClient.ensureQueryData(searchQuery({ type: "hackathon", sort: "featured" })),
  head: () => typeLandingHead("/hackathons", "Hackathons", "Hackathons across Africa and beyond — build, compete and win prizes with your team."),
  errorComponent: RouteErrorFallback,
  component: () => <TypeLandingPage type="hackathon" title="Hackathons" description="Build, compete and win — hackathons across Africa and beyond with prizes and incubation support." />,
});