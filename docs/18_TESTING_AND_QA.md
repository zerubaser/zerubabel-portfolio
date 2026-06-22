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
