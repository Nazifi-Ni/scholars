import { createFileRoute } from "@tanstack/react-router";
import { TypeLandingPage, typeLandingHead } from "@/components/TypeLandingPage";
import { RouteErrorFallback } from "@/components/RouteFallbacks";
import { searchQuery } from "@/lib/queries";

export const Route = createFileRoute("/jobs")({
  loader: ({ context }) => context.queryClient.ensureQueryData(searchQuery({ type: "job", sort: "featured" })),
  head: () => typeLandingHead("/jobs", "Graduate Jobs", "Graduate programs and early-career jobs at international organizations and top employers."),
  errorComponent: RouteErrorFallback,
  component: () => <TypeLandingPage type="job" title="Graduate Jobs" description="Graduate programs and early-career roles at international organizations and top employers." />,
});