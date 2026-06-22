# 22 — Roadmap

Phased delivery plan for zerubabel.et. The guiding principle: **ship a fast, accessible, SEO-solid 2D site with a working admin first**, then layer in the 3D "System Universe" experiences. Each phase has goals, a task checklist, and exit criteria — don't start the next phase until exit criteria are met.

---

## Phase 0 — Planning
**Goals:** Lock scope, stack, content model, and infra decisions before code.
- [ ] Stack locked and documented.
- [ ] Content model defined (`20_CONTENT_MODEL.md`).
- [ ] Project seed content drafted with TODOs (`21_PROJECT_SEED_CONTENT.md`).
- [ ] Decisions recorded (`25_DECISION_LOG.md` + ADRs).
- [ ] Commit / vibe-coding / QA / a11y rules in place.
**Exit criteria:** Docs complete; no open architectural questions; owner has reviewed seed content.

## Phase 1 — Project Setup
**Goals:** A running Next.js (App Router) + TS app with the core tooling.
- [ ] Next.js App Router + TypeScript scaffolded.
- [ ] Tailwind + shadcn/ui configured.
- [ ] ESLint + typecheck scripts working.
- [ ] `output: "standalone"` set in Next config.
- [ ] `.env.example` created (no real secrets — see `24_ENVIRONMENT_VARIABLES.md`).
- [ ] Folder structure agreed (public, admin, lib, components).
**Exit criteria:** App builds and runs locally; lint + typecheck pass; standalone build verified off-server.

## Phase 2 — Database + Admin
**Goals:** Prisma + PostgreSQL with a working, simple admin CRUD and auth.
- [ ] Prisma schema for the content model (Postgres-safe types; no `@db.Text`/`@db.LongText`).
- [ ] `DATABASE_URL` with `?schema=public&connection_limit=5`.
- [ ] Initial migration + seed script (categories, site settings).
- [ ] Auth.js Credentials provider with **JWT session strategy**.
- [ ] Admin login + protected routes.
- [ ] Admin CRUD for Projects (+ images), Categories, Services, Testimonials, Experience, Skills, SiteSettings, Messages.
- [ ] Upload pipeline: validate → compress to WebP → store at `/var/www/.../uploads`.
**Exit criteria:** Owner can log in and fully manage content; uploads work and are WebP; validation + error handling present; **no 3D in admin**.

## Phase 3 — Public 2D Site + SEO
**Goals:** Complete, fast, accessible 2D public site.
- [ ] Home, About, Projects list + filters, Project/case-study pages, Services, Contact.
- [ ] Contact form → Messages + email (`CONTACT_TO_EMAIL`).
- [ ] SEO: per-page metadata, OpenGraph/Twitter, canonical, `sitemap.xml`, `robots.txt`, structured data.
- [ ] Accessibility pass (semantic HTML, keyboard, contrast, alt text, skip link).
- [ ] Responsive on mobile.
**Exit criteria:** All public pages render real content; Lighthouse SEO + a11y strong; no critical content trapped in canvas (no canvas yet).

## Phase 4 — First 3D Hero
**Goals:** Introduce the first 3D experience safely.
- [ ] Three.js + R3F + drei + postprocessing integrated, **lazy-loaded**.
- [ ] 3D hero on the homepage only.
- [ ] **2D fallback** + `prefers-reduced-motion` honored.
- [ ] Performance verified on low-end mobile; bundle not loaded where unused.
**Exit criteria:** 3D hero ships without harming TTI/SEO/a11y; fallback verified; no 3D leaked into admin or every page.

## Phase 5 — Deployment
**Goals:** Live on AWS Lightsail, stable and secure.
- [ ] Lightsail Ubuntu provisioned (0.5GB RAM, 2GB swap).
- [ ] PostgreSQL set up; **schema GRANT ALL + ALTER DATABASE OWNER**; DB bound to localhost only.
- [ ] **Build off-server**; deploy standalone output (one PM2 process).
- [ ] Nginx reverse proxy; serves `/uploads` directly.
- [ ] Let's Encrypt SSL.
- [ ] `prisma migrate deploy` run; env vars set on server.
- [ ] Backups: snapshot + db dump.
**Exit criteria:** Site live over HTTPS; release checklist (`23_RELEASE_CHECKLIST.md`) passes; rollback plan in place.

## Phase 6 — Advanced (System Universe)
**Goals:** The flagship 3D + advanced features. Selective, lazy, always with fallbacks.
- [ ] **Project Universe** (3D projects explorer).
- [ ] **Skills Galaxy** (3D skills).
- [ ] **3D timeline** for experience.
- [ ] **Blog** (Posts/Tags).
- [ ] **Testimonials** showcase.
- [ ] **Terminal-style contact** interaction.
- [ ] **Dynamic OG images.**
- [ ] **AI assistant** (portfolio chat).
- [ ] **EN / Amharic** internationalization.
**Exit criteria:** Each feature has a 2D + reduced-motion fallback, no SEO-critical text only in canvas, and doesn't regress performance or admin stability.

---

## MVP vs Advanced scope

| | **MVP scope (Phases 0–5)** | **Advanced scope (Phase 6)** |
|---|---|---|
| Site | Full 2D public site + SEO | 3D Project Universe, Skills Galaxy, 3D timeline |
| Admin | Simple stable CRUD + auth | (unchanged — admin stays 2D/simple) |
| 3D | One lazy 3D hero w/ fallback | Multiple selective 3D scenes |
| Content | Projects, services, testimonials, experience, skills, messages, settings | Blog (Posts/Tags) |
| Contact | Form → DB + email | Terminal-style contact UI |
| i18n | English | EN + Amharic |
| Extras | sitemap/robots/static OG | Dynamic OG, AI assistant |

**Rule of thumb:** nothing in Advanced ships until the MVP is live, stable, fast, accessible, and SEO-correct.
