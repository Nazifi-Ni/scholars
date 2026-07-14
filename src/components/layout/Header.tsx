import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/scholarships", label: "Scholarships" },
  { to: "/internships", label: "Internships" },
  { to: "/bookmarks", label: "Bookmarks" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md text-navy shadow-sm border-b-[3px] border-highlight transition-all">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link to="/" className="flex items-center group">
          <img src="/logo.png" alt="ScholarsConnect Logo" className="h-12 w-auto transition-transform group-hover:scale-105" />
        </Link>

        {/* Center/Right Navigation */}
        <nav className="hidden items-center gap-1.5 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-[14px] font-bold text-navy hover:text-secondary transition-colors font-sans"
              activeProps={{ className: "text-secondary" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="rounded-lg p-2 text-navy hover:bg-navy/5 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <nav className="border-t border-border bg-white px-4 py-3 lg:hidden shadow-md">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm font-bold text-navy hover:bg-navy/5 hover:text-secondary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}