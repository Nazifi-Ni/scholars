import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, Bookmark, Search, ArrowRight, Compass } from "lucide-react";
import { useBookmarks } from "@/hooks/use-bookmarks";

import { cn } from "@/lib/utils";

const NAV = [
  { to: "/opportunities", label: "Opportunities" },
  { to: "/scholarships", label: "Scholarships" },
  { to: "/internships", label: "Internships" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileSearch, setMobileSearch] = useState("");
  const { bookmarks } = useBookmarks();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearch.trim()) {
      setOpen(false);
      navigate({ to: "/opportunities", search: { q: mobileSearch.trim() } });
      setMobileSearch("");
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-200 bg-white/95 backdrop-blur-md",
        scrolled ? "border-b border-border shadow-sm py-0" : "border-b border-border/60 py-0.5",
      )}
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img
            src="/logo.png"
            alt="ScholarsConnect Logo"
            className="h-10 sm:h-11 w-auto transition-transform group-hover:scale-[1.02]"
          />
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main Navigation">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg px-3.5 py-2 text-[14px] font-semibold text-navy/80 hover:text-navy hover:bg-navy/5 transition-colors font-sans"
              activeProps={{ className: "text-navy font-bold bg-navy/5" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Action Icons & CTA */}
        <div className="hidden items-center gap-2.5 lg:flex">
          {/* Quick Search Link */}
          <Link
            to="/opportunities"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-muted-foreground hover:text-navy hover:bg-muted/60 transition-colors"
            title="Search Opportunities"
          >
            <Search className="h-4 w-4" />
            <span className="hidden xl:inline">Search</span>
          </Link>

          {/* Bookmarks Counter */}
          <Link
            to="/bookmarks"
            className="relative flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-muted-foreground hover:text-navy hover:bg-muted/60 transition-colors"
            title="Saved Opportunities"
          >
            <Bookmark className="h-4 w-4" />
            <span className="hidden xl:inline">Saved</span>
            {bookmarks.length > 0 && (
              <span className="inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-secondary text-white text-[10px] font-bold">
                {bookmarks.length}
              </span>
            )}
          </Link>

          {/* Primary CTA */}
          <Link
            to="/opportunities"
            className="inline-flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-navy/90 hover:shadow transition-all"
          >
            <Compass className="h-3.5 w-3.5 text-secondary" />
            Find Opportunities
          </Link>
        </div>

        {/* Mobile Action Icons + Toggle */}
        <div className="flex items-center gap-1 lg:hidden">
          <Link
            to="/bookmarks"
            className="relative p-2.5 text-navy hover:bg-muted/50 rounded-lg transition-colors"
            aria-label="Saved Bookmarks"
          >
            <Bookmark className="h-5 w-5" />
            {bookmarks.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-secondary text-white text-[10px] font-bold">
                {bookmarks.length}
              </span>
            )}
          </Link>

          <button
            className="rounded-lg p-2.5 text-navy hover:bg-muted/50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {open && (
        <div className="border-t border-border bg-white px-4 py-4 lg:hidden shadow-lg animate-in slide-in-from-top-2 duration-200">
          {/* Quick Mobile Search */}
          <form onSubmit={handleMobileSearchSubmit} className="mb-4">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="search"
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                placeholder="Search scholarships, grants, countries…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </form>

          {/* Links List */}
          <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold text-navy hover:bg-muted/60 transition-colors min-h-[44px]"
                activeProps={{ className: "text-secondary font-bold bg-secondary/5" }}
              >
                <span>{item.label}</span>
                <ArrowRight className="h-4 w-4 opacity-40" />
              </Link>
            ))}
          </nav>

          {/* Mobile Bottom Quick Actions */}
          <div className="mt-4 pt-4 border-t border-border/80 flex flex-col gap-2">
            <Link
              to="/opportunities"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-navy py-3 text-sm font-bold text-white shadow-sm"
            >
              <Compass className="h-4 w-4 text-secondary" />
              Find Opportunities
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
