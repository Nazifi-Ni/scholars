import { createFileRoute } from "@tanstack/react-router";
import { TypeLandingPage, typeLandingHead } from "@/components/TypeLandingPage";
import { RouteErrorFallback } from "@/components/RouteFallbacks";
import { searchQuery } from "@/lib/queries";

export const Route = createFileRoute("/internships")({
  loader: ({ context }) => context.queryClient.ensureQueryData(searchQuery({ type: "internship", sort: "featured" })),
  head: () => typeLandingHead("/internships", "Internships", "Paid internships at global companies and organizations open to African students and graduates."),
  errorComponent: RouteErrorFallback,
  component: () => <TypeLandingPage type="internship" title="Internships" description="Paid internships at global companies and organizations — launch your career with world-class experience." />,
});