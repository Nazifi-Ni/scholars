import { createFileRoute } from "@tanstack/react-router";
import { TypeLandingPage, typeLandingHead } from "@/components/TypeLandingPage";
import { RouteErrorFallback } from "@/components/RouteFallbacks";
import { searchQuery } from "@/lib/queries";

export const Route = createFileRoute("/courses")({
  loader: ({ context }) => context.queryClient.ensureQueryData(searchQuery({ type: "course", sort: "featured" })),
  head: () => typeLandingHead("/courses", "Free Courses", "Free and funded courses, bootcamps and certificates to build in-demand skills."),
  errorComponent: RouteErrorFallback,
  component: () => <TypeLandingPage type="course" title="Free Courses" description="Free and funded courses, bootcamps and professional certificates to build in-demand skills." />,
});