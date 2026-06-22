# 05 — Public Site Spec

## Public Pages
| Route | Purpose |
|-------|---------|
| `/` | Homepage — 3D command-center hero + section previews. |
| `/projects` | Filterable grid of published projects. |
| `/projects/[slug]` | Full project case study (visibility-aware). |
| `/services` | Services offered. |
| `/blog` | Published blog posts. |
| `/blog/[slug]` | Single blog post. |
| `/about` | Bio, skills, experience, certifications. |
| `/contact` | Contact form (terminal-style) + details. |

All public pages render via SSR with **ISR** revalidation; heavy 3D sections are client-only and lazy-loaded.

## Homepage Sections (top → bottom)
1. **3D Hero** — the "Digital Command Center / System Universe" scene (lazy, `ssr:false`), with reduced-motion / mobile fallback.
2. **About** — short intro: full-stack developer, Addis Ababa, BSc CS (HilCoE), AWS Certified Cloud Practitioner.
3. **Featured Projects** — `Project.featured === true`, ordered.
4. **Services** — concise list of what he builds.
5. **Skills Preview** — top skill groups (teaser into about/skills galaxy).
6. **Experience Preview** — condensed timeline.
7. **Impact Metrics** — animated headline numbers (from `Project.impactMetrics` / curated).
8. **Testimonials Preview** — featured testimonials.
9. **Contact CTA** — prompt to start a project / view contact.

## Projects Listing (`/projects`)
- Grid of published projects (`status === PUBLISHED`).
- Filter by **Category**; optional filter by **Tech**.
- Card shows cover image, title, summary, category, key tech.
- Respects visibility (CONFIDENTIAL projects shown with limited info, no sensitive media).

## Project Detail (`/projects/[slug]`)
Fields rendered (subject to confidentiality rules):
- Title
- Summary
- Problem
- Solution
- Features
- Tech stack
- My role
- Client / industry
- Screenshots (gallery)
- Impact metrics
- Live link (only if allowed)
- Confidentiality notice (when applicable)

## Confidentiality Rules (Visibility enum)
The `Project.visibility` field (plus `isConfidential` quick flag) controls disclosure:

- **PUBLIC** — show everything: full case study, all screenshots, live URL, GitHub URL (if set), tech stack, metrics.
- **LIMITED** — show the narrative and outcomes but withhold some specifics: hide live/source links if sensitive, show only approved screenshots, generalize client identity where needed.
- **CONFIDENTIAL** — show only a high-level, anonymized case study. Specifically **hide**:
  - Private/internal screenshots.
  - Backend implementation details.
  - Financial figures and sensitive client data.
  - Source code / repository links.
  - The client's identity where not approved.
  - Display a clear **confidentiality notice** ("Details withheld under client confidentiality").

Enforcement is server-side: confidential fields are stripped in the loader before reaching the client — never just hidden via CSS.

## Services List
Public-facing services (from `Service` records):
- Mobile app development (Flutter)
- Backend / API development
- Business system development
- ERP / SaaS development
- Clinic / lab system development
- WordPress development
- Performance optimization
- Full project development (end-to-end)

## About (`/about`)
- Bio (from `SiteSettings.bio`).
- Skill groups + skills.
- Experience timeline.
- Certifications (AWS Certified Cloud Practitioner) and education (BSc CS, HilCoE).
- Resume/CV download link (`SiteSettings.resumeUrl`).

## Contact (`/contact`)
- Terminal-style contact form → creates a `Message`.
- Captures name, email, subject, body; stores ipAddress + userAgent for spam triage.
- Shows public contact details (email/phone/location/social) from `SiteSettings`.
- Validated (Zod) + rate-limited.

## SEO
- Per-page metadata from each entity's `metaTitle` / `metaDescription` / `ogImage` / `canonicalUrl` / `keywords`, falling back to `SiteSettings` defaults.
- Generate `sitemap.xml` and `robots.txt`.
- TODO: Add JSON-LD (Person / CreativeWork) structured data.

## Open Items (TODO)
- TODO: Confirm whether `/blog` ships in MVP or phase 2.
- TODO: Confirm contact delivery (DB-only vs DB + email notification).
