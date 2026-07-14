import { Link } from "@tanstack/react-router";
import { GraduationCap, Mail, MapPin } from "lucide-react";
import { NewsletterWidget } from "@/components/NewsletterWidget";

export function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center">
            <img src="/logo.png" alt="ScholarsConnect Logo" className="h-10 w-auto" />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-navy-foreground/70">
            Connecting Dreams to Opportunities. Discover verified scholarships,
            internships, grants and more — built for ambitious students across Africa.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-navy-foreground/75">
            <li><Link to="/scholarships" className="hover:text-secondary">Scholarships</Link></li>
            <li><Link to="/internships" className="hover:text-secondary">Internships</Link></li>
            <li><Link to="/grants" className="hover:text-secondary">Grants</Link></li>
            <li><Link to="/hackathons" className="hover:text-secondary">Hackathons</Link></li>
            <li><Link to="/competitions" className="hover:text-secondary">Competitions</Link></li>
            <li><Link to="/jobs" className="hover:text-secondary">Jobs</Link></li>
            <li><Link to="/courses" className="hover:text-secondary">Courses</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-navy-foreground/75">
            <li><Link to="/about" className="hover:text-secondary">About Us</Link></li>
            <li><Link to="/blog" className="hover:text-secondary">Blog</Link></li>
            <li><Link to="/faq" className="hover:text-secondary">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-secondary">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-secondary">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-secondary">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary">Get in Touch</h3>
          <ul className="mt-4 space-y-3 text-sm text-navy-foreground/75">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-secondary" /> hello@scholarsconnect.africa
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-secondary" /> Serving all 54 African countries
            </li>
          </ul>
          {/* Newsletter */}
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-green-400">Join Our Newsletter</h3>
            <p className="text-sm text-white/80 font-sans mb-4">
              Get the latest scholarships, internships, and opportunities delivered straight to your inbox weekly.
            </p>
            <NewsletterWidget variant="footer" />
          </div>
        </div>
      </div>

      <div className="border-t border-navy-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-navy-foreground/60 sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} ScholarsConnect. All rights reserved.</p>
          <p>Connecting Dreams to Opportunities.</p>
        </div>
      </div>
    </footer>
  );
}