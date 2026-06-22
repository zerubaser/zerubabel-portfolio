# 0001 — Use Next.js (App Router) as a Full-Stack Framework

## Status

Accepted

## Context

zerubabel.et is a premium 3D portfolio ("3D Digital Command Center / System Universe") for Zerubabel Shimeles. It has two distinct surfaces:

- A **public marketing/portfolio site** that must rank well in search and load fast (SEO is a hard requirement).
- A **small admin area** to manage portfolio content (projects, media, etc.).

The owner already knows Next.js, and the project does not need a large, separately-scaled backend service. Splitting the system into a separate Django/Laravel/.NET API plus a JS frontend would add a second runtime, a second deployment, CORS handling, and duplicated models/types — overhead that is not justified for a single-owner portfolio.

## Decision

Use **Next.js (latest, App Router) with TypeScript** as a single full-stack application:

- **Frontend** — React Server Components + client components, Tailwind, shadcn/ui, Framer Motion, GSAP.
- **API / backend** — Next.js Route Handlers and Server Actions, with Prisma over PostgreSQL.
- **Admin** — built inside the same repo/app, protected by Auth.js (Credentials, JWT).

Everything (frontend + API + admin) lives in **one repository and one deploy unit**. No separate backend framework.

The **3D layer (Three.js / R3F / drei / postprocessing) is client-only** and must be **dynamically imported and lazy-loaded** (e.g. `next/dynamic` with `ssr: false`), kept out of the server-rendered HTML path so it does not break SSR, bloat the initial payload, or harm Core Web Vitals. Server-rendered content (text, meta tags, structured data) carries the SEO weight; the 3D scene hydrates progressively on the client.

## Consequences

### Positive

- One language (TypeScript) and one mental model across UI, API, and admin.
- Shared types between server and client; no API contract drift.
- Built-in SSR/SSG and metadata APIs give strong SEO out of the box.
- Server Actions remove most hand-written API boilerplate for the admin.
- Single repo, single deploy, single process to run under PM2 — fits a tiny VPS.

### Negative / Risks

- The frontend and backend scale and deploy together; a heavy API workload cannot scale independently. (Acceptable for a portfolio.)
- Three.js/R3F is **client-only**; forgetting to lazy-load it can break SSR or tank LCP. This is a recurring discipline requirement, not a one-time setup.
- Coupling content management to the same process means an admin bug can affect the public site's process — mitigated by keeping admin logic isolated and well-tested.

## Alternatives Considered

- **Separate backend (Django / Laravel / .NET) + JS frontend** — rejected: two runtimes, two deploys, CORS, duplicated models/types, and more RAM on an already tiny server, with no benefit for a single-owner portfolio.
- **Static site generator (Astro / Eleventy) + headless CMS** — rejected: the admin and dynamic content needs, plus the owner's Next.js familiarity, favor a unified Next.js app.
