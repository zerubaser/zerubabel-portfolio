# 18 — Testing & QA

Planned testing strategy for zerubabel.et. The goal is **confidence without over-engineering**: type safety + targeted unit/validation tests for the MVP, E2E and performance audits layered in later.

---

## Planned checks

### Always (every change)
- **TypeScript typecheck** — `tsc --noEmit`. No `any` leaks into shared types. Type errors block commits.
- **ESLint** — lint must pass clean. Autofixable issues fixed before commit.

### Unit tests (MVP)
- **Utilities / server logic** — pure functions: slugify, WebP conversion helpers, date/format helpers, SEO metadata builders.
- **Admin form validation** — Zod (or equivalent) schemas for project/category/service/etc. forms reject bad input and accept good input.
- **API / Server Action validation** — Route Handlers and Server Actions validate input, enforce auth, and return correct error shapes.
- **Upload validation** — file type allowlist (images only), size limit, WebP conversion output, rejection of oversized/wrong-type files.

### Later (post-MVP)
- **E2E** — admin login flow, project creation flow (create → appears on public site).
- **Lighthouse** — performance, accessibility, best practices, SEO scores on key pages.
- **Mobile testing** — real-device / responsive checks, especially 3D pages on low-end devices.
- **Reduced-motion testing** — `prefers-reduced-motion: reduce` disables/replaces all animation and 3D with a static fallback.
- **SEO metadata testing** — each page emits correct `<title>`, meta description, canonical, OpenGraph/Twitter tags, structured data where relevant.

---

## Recommended tooling

| Concern | Tool | Notes |
|---------|------|-------|
| Unit tests | **Vitest** (preferred) or Jest | Vitest integrates cleanly with Vite/TS; fast. |
| Component tests | Vitest + Testing Library | For admin forms and key components. |
| E2E (later) | **Playwright** | Admin login + project creation flows. |
| Perf/a11y/SEO audit | **Lighthouse** (CLI or Chrome) | Run against built `standalone` output. |
| Type safety | **tsc** | `--noEmit` in CI/local. |
| Lint | **ESLint** | Next.js + TS config. |

> Tooling not yet installed — this is the plan. **TODO:** confirm Vitest vs Jest choice when test setup begins.

---

## Definition of Done

A task is **done** only when all of these are true:

- [ ] **Follows the spec** in `docs/` (and the spec is updated if behavior changed).
- [ ] **Works locally** — verified by running it, not just by writing it.
- [ ] **Doesn't break existing functionality** — existing tests/typecheck/lint still pass.
- [ ] **Has validation where needed** — user input, uploads, API/server-action params.
- [ ] **Has error handling** — failures are caught and surfaced sensibly, not swallowed.
- [ ] **Has loading / empty / error states** for any data-driven UI.
- [ ] **No exposed secrets** — nothing sensitive in code, logs, or committed env files.
- [ ] **Committed with a clear message** (Conventional Commits — see `16_COMMIT_RULES.md`).
- [ ] **Includes a short final report** — what changed, files touched, anything to follow up.

---

## Local QA Checklist

Run before any deploy / after major changes. Local Postgres must be running.

### Setup & static
- [ ] `npm install` · `npx prisma generate` · `npm run seed` (run **twice** — no duplicate rows).
- [ ] `npm run lint` · `npm run typecheck` · `npm run build` all pass.
- [ ] `git status` clean of `.env`, `uploads/`, and test artifacts (`_smoke/`, `_seedprobe.ts`).

### Auth
- [ ] Unauthenticated `/admin/*` → 307 to `/admin/login`.
- [ ] Wrong password sets no session; correct password logs in.
- [ ] Authenticated `/admin/login` → redirects to dashboard; logout works.

### Admin CRUD (each module: categories, tech, projects, services, skill-groups,
      skills, experience, testimonials, blog, tags, messages, settings, media)
- [ ] List + create + edit + delete; validation errors show; unique-slug handled.
- [ ] Featured / publish toggles work where present; empty states render.

### Public + confidentiality (the important one)
- [ ] All public pages render (`/`, `/projects`, `/projects/[slug]`, `/services`,
      `/blog`, `/blog/[slug]`, `/about`, `/contact`, `/sitemap.xml`, `/robots.txt`).
- [ ] PUBLIC project → full case study. LIMITED → notice + **no** problem/solution/
      metrics/live-URL leak. CONFIDENTIAL & DRAFT → **404** and absent from lists.
- [ ] **Check `view-source` (not just the rendered page)**: confirm sensitive fields
      of LIMITED projects are NOT in the HTML/RSC flight payload. (Use the sanitized
      `getPublicProjectViewBySlug` — never pass a raw project row to the page.)

### Media upload
- [ ] PNG / JPG / **WebP** accepted (incl. when the browser sends a generic MIME),
      converted to WebP, resized to ≤1920px wide.
- [ ] TXT / SVG / oversized / PDF-to-image-target rejected; resume PDF accepted.
- [ ] Spoofed extension (e.g. text named `.png`) rejected by magic-byte sniff.
- [ ] Files land under `UPLOAD_DIR` and are gitignored.

### Contact form
- [ ] Valid submit saves a Message; invalid email / missing fields rejected;
      honeypot blocks spam; rate limit caps a single IP (test with `X-Forwarded-For`).
- [ ] Message appears in `/admin/messages`; mark read/unread + delete work.

### Three.js hero (real browser — WebGL can't be tested headlessly)
- [ ] Homepage loads; 3D hero renders; no console / WebGL errors.
- [ ] Hero H1 + CTAs readable and clickable over/around the canvas.
- [ ] Reduced-motion and mobile fall back to the static visual; other pages don't load Three.js.
