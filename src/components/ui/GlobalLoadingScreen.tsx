import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

export function GlobalLoadingScreen() {
  const [isMounted, setIsMounted] = useState(false);
  const isRouting = useRouterState({ select: (s) => s.status === "pending" });

  useEffect(() => {
    // Initial splash screen delay to ensure the logo animation is seen
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Show if we are still in the initial mount delay OR if the router is actively fetching a new page
  const showLoading = !isMounted || isRouting;

  if (!showLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative flex flex-col items-center">
        {/* Pulsing rings behind the logo */}
        <div className="absolute inset-0 -m-12 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 -m-8 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full border-4 border-primary/40" />
        
        {/* Bouncing Logo */}
        <img 
          src="/logo.png" 
          alt="Loading ScholarsConnect" 
          className="relative z-10 h-24 w-auto animate-bounce object-contain drop-shadow-xl" 
        />
        
        <p className="mt-12 animate-pulse text-lg font-medium text-foreground tracking-wide">
          Connecting Dreams to Opportunities...
        </p>
      </div>
    </div>
  );
}
