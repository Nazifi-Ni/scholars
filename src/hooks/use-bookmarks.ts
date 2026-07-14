import { useState, useEffect } from "react";
import type { OpportunityCardData } from "@/lib/sc-shared";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<OpportunityCardData[]>([]);

  // Load on mount and listen to storage changes
  useEffect(() => {
    const load = () => {
      try {
        const stored = localStorage.getItem("sc_bookmarks");
        if (stored) setBookmarks(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    };
    
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  const toggleBookmark = (opportunity: OpportunityCardData) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === opportunity.id);
      let updated;
      if (exists) {
        updated = prev.filter((b) => b.id !== opportunity.id);
      } else {
        updated = [...prev, opportunity];
      }
      localStorage.setItem("sc_bookmarks", JSON.stringify(updated));
      // Dispatch storage event for other components in the same window to re-render
      window.dispatchEvent(new Event("storage"));
      return updated;
    });
  };

  const isBookmarked = (id: number) => {
    return bookmarks.some((b) => b.id === id);
  };

  return { bookmarks, toggleBookmark, isBookmarked };
}
