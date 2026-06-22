# Project Context — zerubabel.et

> **Canonical context.** Read this file first. If anything here conflicts with `PLAN.md`, **PLAN.md wins**. For deep specifics, defer to the numbered specs in `docs/`.

## Owner

- **Zerubabel Shimeles** — full-stack developer based in **Addis Ababa, Ethiopia**.
- BSc Computer Science, **HilCoE**.
- **AWS Certified Cloud Practitioner**.

## Concept

A **premium 3D portfolio** — a *"3D Digital Command Center / System Universe."* It is **not a template site**: it showcases real systems the owner has built — ERP/SaaS, clinic/lab systems, LMS, WordPress builds, Flutter mobile apps, backend APIs, and dashboards. The 3D experience is the hook; the substance is real engineering work.

## Locked Stack

> The stack is **locked**. Do not silently substitute libraries. See `rules.md`.

**Frontend**
- Next.js (latest, **App Router**) + TypeScript
- Tailwind CSS + **shadcn/ui**
- **Framer Motion** + **GSAP** for animation

**3D**
- **Three.js** + **React Three Fiber (R3F)** + **drei** + **postprocessing**

**Backend**
- Next.js **Route Handlers** + **Server Actions**
- **Prisma** ORM + **PostgreSQL**
- **Auth.js** — Credentials provider, **JWT** session strategy

**Hosting / Runtime**
- **AWS Lightsail**, Ubuntu — **0.5GB RAM, 2 vCPU, 20GB SSD**
- **2GB swap**
- **Nginx** reverse proxy, **PM2** process manager, **Let's Encrypt** TLS
- Local uploads at `/var/www/zerubabel.et/uploads`, served directly by **Nginx**

## Constraints (why the rules exist)

The production box has only **512MB RAM**. Everything below flows from that: build elsewhere, keep one process, lazy-load 3D, compress uploads, cap DB connections.

## The 7 Rules

1. **NEVER** use `@db.LongText` / `@db.Text` in Postgres. Plain `String` / `String?` is already unlimited text in PostgreSQL.
2. On **PG15**: run `GRANT ALL ON SCHEMA public` and `ALTER DATABASE ... OWNER ...` so the app user can create objects.
3. **Build off-server** (local machine or GitHub Actions). The server is **runtime-only**. Use Next.js `output: "standalone"`.
4. **Auth.js Credentials → session strategy `"jwt"`**. No session tables in the database.
5. **Compress uploads to WebP**, serve via **Nginx**. Do **not** route uploads through heavy Next.js image optimization.
6. `DATABASE_URL` must include **`?connection_limit=5`**.
7. **No Docker for MVP.** One PM2 process, no clustering, no heavy background jobs. Lazy-load 3D. No 3D in admin. Keep Postgres `max_connections` low.

## The 5 Headline Gotchas

1. No `@db.LongText` / `@db.Text` (use plain `String`).
2. PG15 schema permission fix (`GRANT ALL ON SCHEMA public` + `ALTER DATABASE OWNER`).
3. Don't build on the 512MB server — build off-server.
4. Auth.js Credentials **must** use JWT sessions.
5. No heavy Next image optimization for uploads — WebP + Nginx.

## Folder-Structure Intent

```
src/
  app/          # App Router — public site, /admin area, and api/ route handlers
  three/        # Three.js / R3F scenes, components, hooks, shaders
  server/       # Server Actions (server/actions), repositories (server/repositories)
  components/    # Shared UI (shadcn-based), layout, primitives
  lib/          # prisma.ts singleton, validators (Zod), utilities
prisma/         # schema.prisma, migrations, seed
docs/           # numbered specs (00_… 17_…), the source of truth for behavior
PLAN.md         # the master plan — wins on any conflict
```

- **Public** pages, **admin** area, and **api** route handlers all live under `src/app`.
- 3D code is isolated in `src/three` so it can be lazy-loaded and kept out of admin.
- Server logic (actions + repositories) lives in `src/server`; never put DB access directly in components.

## Pointers

- **`PLAN.md`** — master plan. Highest authority. If it disagrees with this file, follow PLAN.md and reconcile.
- **`docs/`** — numbered specifications (e.g. `docs/17_VIBE_CODING_RULES.md`) describing features and rules in detail. Read the relevant spec before implementing.
- **`.claude/rules.md`** — hard MUST/MUST NOT rules for AI coding.
- **`.claude/coding-standards.md`** — conventions.
- **`.claude/review-checklist.md`** — pre-commit self-review.
- **`.claude/implementation-workflow.md`** — step-by-step workflow.
- **`.claude/commit-workflow.md`** — how to commit.
