# ScholarsConnect — Opportunity Management Platform

**Tagline:** Connecting Dreams to Opportunities.

## Stack note (important)

Your spec asks for Core PHP + MySQL. Lovable doesn't run PHP — it builds on a modern React full-stack framework with **Lovable Cloud** as the backend, which gives you everything you listed out of the box:

| Your PHP spec | Lovable equivalent |
|---|---|
| MySQL 8 + PDO | Managed PostgreSQL with row-level security |
| PHPMailer + email verification | Built-in auth with email verification & password reset |
| Sessions, remember-me, hashing | Secure managed auth (JWT sessions) |
| MVC + Composer autoloading | File-based routing, typed server functions |
| File uploads | Built-in file storage |
| Security (CSRF/XSS/SQLi, RBAC) | Handled by platform + RLS policies + role tables |

Same product, same design ambitions — modern stack.

## Branding & Design

- Colors: Primary `#0D1B3D` (deep navy), Secondary `#22C55E` (green), Accent `#2563EB` (blue), Highlight `#FBBF24` (amber), Background `#F8FAFC`
- Typography: Poppins
- Style: modern gradients, glassmorphism cards, rounded corners, soft shadows, smooth animations, premium spacing, fully responsive

## Build phases (module by module)

### Phase 1 — Foundation & Landing Page
- Design system (tokens, fonts, gradients, component variants)
- Stunning homepage: hero with animated search bar, statistics counters, featured/latest/trending opportunities, deadline countdowns, popular countries, top universities, scholarship categories, testimonials, FAQ, newsletter signup, CTA sections, premium footer
- Public pages: About, Contact, Privacy, Terms, FAQ, 404

### Phase 2 — Database & Opportunities
- Enable Lovable Cloud; create normalized schema: users/profiles, roles, categories, countries, universities, organizations, opportunities (with all your fields: slug, funding type, degree level, eligible countries, deadline, benefits, eligibility, documents, procedure, links, images, badges, counters, ratings, SEO metadata), bookmarks, applications, notifications, newsletter, blog posts, comments, tags, testimonials, FAQs, partners, settings, activity logs
- Seed with realistic sample data (scholarships, internships, competitions, hackathons, grants, jobs, courses)
- Browse page with fast search + filters: keyword, country, university, organization, degree, funding type, category, deadline, type, featured/newest/popular, fully funded, closing soon, region filters, etc.
- Opportunity detail page: full info, gallery, countdown, share, bookmark, related opportunities, SEO meta + Schema.org

### Phase 3 — Authentication & User Dashboard
- Register / login / logout, email verification, forgot & reset password, change password, profile picture upload
- User dashboard: overview, saved opportunities/bookmarks, application tracker, notifications, profile & educational info, documents upload, security settings, activity history

### Phase 4 — Admin Dashboard (CMS)
- Role-based access (admin role table, server-side checks)
- Sidebar admin panel: analytics with charts, manage users/roles, categories, countries, universities, organizations, opportunities (full CRUD), blog, comments, testimonials, newsletter subscribers, FAQs, partners, site settings, SEO settings
- No hardcoded content — homepage sections driven by database

### Phase 5 — Blog & SEO polish
- Blog with categories, tags, featured images, comments, related articles, reading time
- Dynamic meta tags, Open Graph, Twitter cards, Schema.org, sitemap.xml, robots.txt, canonical URLs, breadcrumbs, friendly URLs

## Suggested scope for first delivery

Phases are large — I'll build them in order, verifying each works before moving on. Phase 1 + 2 make the site publicly impressive fast; 3-5 complete the platform.
