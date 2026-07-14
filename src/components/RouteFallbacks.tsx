import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/layout/SiteLayout";

export function RouteErrorFallback({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <SiteLayout newsletter={false}>
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">We couldn't load this page. Please try again.</p>
        <div className="mt-6 flex gap-3">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full"
          >
            Try again
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/">Go home</Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}

export function RouteNotFoundFallback() {
  return (
    <SiteLayout newsletter={false}>
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-6xl font-bold text-gradient">404</p>
        <h1 className="mt-3 text-xl font-semibold text-foreground">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This opportunity may have closed or the link is incorrect.
        </p>
        <Button asChild className="mt-6 rounded-full bg-gradient-cta font-semibold">
          <Link to="/opportunities">Browse Opportunities</Link>
        </Button>
      </div>
    </SiteLayout>
  );
}