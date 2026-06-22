# PLAN.md — zerubabel.et (Source of Truth)

This document is the single source of truth for the project. If any other document conflicts with this one, this document wins until explicitly updated.

---

## 1. Project Overview

**zerubabel.et** is a premium personal portfolio for **Zerubabel Shimeles**, a full-stack developer in Addis Ababa, Ethiopia (BSc Computer Science, HilCoE; AWS Certified Cloud Practitioner).

The concept is a **3D Digital Command Center / System Universe**: an interactive 3D environment that presents Zerubabel as a builder of real business systems — ERP/SaaS, clinic/lab platforms, LMS, WordPress sites, Flutter mobile apps, backend APIs, and dashboards. It deliberately avoids the look and feel of a template portfolio. Each system is treated as a real, explorable artifact.

**Goals**
- Communicate engineering depth, not just visual polish.
- Stay fast and usable on low-end devices despite the 3D experience.
- Run affordably on a single small VPS while remaining production-grade.

---

## 2. Final Stack

**Frontend**
- Next.js (latest stable, App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion, GSAP / ScrollTrigger

**3D**
- Three.js, React Three Fiber, @react-three/drei, @react-three/postprocessing
- R3F is built on real Three.js; real Three concepts (scene, camera, renderer, materials, geometry, lights) apply.

**Backend**
- Next.js Route Handlers + Server Actions
- Prisma ORM + PostgreSQL
- Auth.js / NextAuth — Credentials provider, JWT sessions

**Hosting / Ops**
- AWS Lightsail Ubuntu VPS (~$5/mo, 0.5GB RAM, 2 vCPU, 20GB SSD, 1TB transfer)
- 2GB swap (4GB only if needed)
- Nginx reverse proxy, PM2 process manager, Let's Encrypt SSL
- Local uploads at `/var/www/zerubabel.et/uploads`, served by Nginx at `https://zerubabel.et/uploads/...`

---

## 3. Architecture

### High-level request flow

```
Browser
  → Cloudflare / DNS
    → Lightsail static IP
      → Nginx (TLS termination, reverse proxy, serves /uploads)
        → Next.js app via PM2 (single process, output: "standalone")
          → Prisma ORM
            → local PostgreSQL (max_connections low, connection_limit=5)

Static uploads:
Browser → Nginx → /var/www/zerubabel.et/uploads (served directly, bypasses Next)
```

### Notes
- **Nginx** terminates TLS (Let's Encrypt), reverse-proxies dynamic routes to Next.js, and serves uploaded media directly from disk (no Next image optimization for uploads).
- **PM2** runs exactly one Next.js process in standalone mode. No clustering for the MVP.
- **Prisma** connects to a **local** PostgreSQL instance (not exposed to the public network). Production `DATABASE_URL` includes `?connection_limit=5`.
- **Uploads** live on local disk and are compressed to WebP before storage (PDF resume excepted).
- 3D scenes are lazy-loaded on the client; the admin area renders **no 3D**.

---

## 4. Hosting Decision

A single AWS Lightsail Ubuntu VPS (~$5/mo) is used as a **runtime-only** server.

- Builds **never** run on the server (512MB RAM is insufficient for `next build`).
- The server receives a pre-built artifact, runs `prisma migrate deploy`, then `pm2 reload`.
- 2GB swap protects against memory spikes during runtime — **not** relied on for builds.
- Postgres `max_connections` is kept low; the app uses `connection_limit=5`.
- Firewall exposes only ports 22 / 80 / 443; PostgreSQL port is never exposed.
- No Docker, no clustering, no heavy background jobs for the MVP.

Rationale: minimize cost and operational surface area while keeping the deployment reproducible and production-grade. Detail in [./docs/13_LIGHTSAIL_DEPLOYMENT.md](./docs/13_LIGHTSAIL_DEPLOYMENT.md) and [./docs/adr/0003-use-aws-lightsail.md](./docs/adr/0003-use-aws-lightsail.md).

---

## 5. Critical Corrections & Gotchas (5 Headline Items)

### 5.1 No `@db.LongText` / `@db.Text` in Prisma on Postgres
- **Wrong:** annotating long-text columns with `@db.LongText` or `@db.Text` (MySQL thinking).
- **Right:** use plain `String` / `String?`. In PostgreSQL these map to `text`, which is already unlimited length.

### 5.2 PostgreSQL schema permission fix (PG15+)
- **Wrong:** `CREATE DATABASE` + `GRANT ALL ON DATABASE` and assuming the user can create tables. On PG15+ the user still cannot use the `public` schema and migrations fail.
- **Right:**
  ```sql
  CREATE DATABASE zerubabel;
  CREATE USER zerubabel_user WITH PASSWORD '...';
  GRANT ALL ON DATABASE zerubabel TO zerubabel_user;
  \c zerubabel
  GRANT ALL ON SCHEMA public TO zerubabel_user;
  ALTER DATABASE zerubabel OWNER TO zerubabel_user;
  ```

### 5.3 Don't build on the 512MB server
- **Wrong:** `git pull && next build` on the Lightsail box. It runs out of memory / swaps badly.
- **Right:** build off-server (locally or GitHub Actions), ship the artifact, then on the server run only `prisma migrate deploy` and `pm2 reload`. Use `output: "standalone"` in `next.config`.

### 5.4 Auth.js Credentials must use JWT sessions
- **Wrong:** Credentials provider with a database session strategy and Prisma session tables.
- **Right:** Credentials provider **requires** `session: { strategy: "jwt" }`. No Prisma session tables needed.

### 5.5 Don't use heavy Next image optimization for uploads
- **Wrong:** routing uploaded media through Next's on-the-fly image optimizer on a 512MB server.
- **Right:** compress uploads to WebP at upload time and serve the static files via Nginx directly.

---

## 6. MVP Features

- 3D command-center landing experience (lazy-loaded, graceful fallback on low-end devices)
- Projects / systems showcase + detail pages
- About, skills, certifications
- Resume (PDF) download
- Contact form with email delivery (SMTP)
- Auth-protected admin dashboard (no 3D) to manage projects and uploads
- Upload pipeline: validate against allow-list, compress images to WebP, store on disk
- SEO basics (metadata, sitemap, robots) — TODO confirm scope

---

## 7. Advanced Features

- Richer 3D interactions, postprocessing, scene-to-scene transitions
- Project view analytics / metrics
- Draft / publish states and content versioning
- Optional object storage (S3 / R2) for uploads and offsite backups
- Performance budgets, progressive enhancement, reduced-motion paths
- Optional CI/CD pipeline (GitHub Actions build → artifact → deploy)

---

## 8. Development Phases

- **Phase 0 — Setup**: repo, tooling, lint/format/typecheck config, Prisma + Postgres locally, Auth.js skeleton, base layout. (Foundation docs = this phase.)
- **Phase 1 — Core content & data**: Prisma schema for projects/systems, admin CRUD, public listing/detail pages.
- **Phase 2 — Uploads**: upload route handler, allow-list validation, WebP compression, Nginx static serving plan.
- **Phase 3 — Contact & resume**: contact form + SMTP delivery, resume PDF download.
- **Phase 4 — 3D experience**: command-center scene, lazy loading, fallbacks, postprocessing baseline.
- **Phase 5 — Hardening & deploy**: off-server build, standalone output, Lightsail provisioning, Nginx + PM2 + SSL, `prisma migrate deploy`, backups.
- **Phase 6 — Advanced**: analytics, draft states, richer 3D, optional S3/R2, optional CI/CD.

---

## 9. Deployment Plan (Artifact-Based)

1. **Build off-server** (local or GitHub Actions): `next build` with `output: "standalone"`.
2. **Package artifact**: standalone server output + static assets + Prisma client + migrations.
3. **Transfer** artifact to the Lightsail server (rsync/scp or CI deploy step).
4. **On server**: run `prisma migrate deploy` (apply pending migrations only — never `migrate dev` in prod).
5. **Reload**: `pm2 reload` the single app process (zero-downtime reload).
6. **Verify**: health check route, key pages, uploads serving via Nginx.
7. **Rollback**: keep the previous artifact; reload it and, if needed, restore DB from latest `pg_dump`.

Constraints: never run `next build`, `migrate dev`, or `prisma db push` on the server; never expose the Postgres port; keep one PM2 process.

---

## 10. Backup Plan

- **Lightsail snapshots**: scheduled full-instance snapshots (recovery baseline). TODO set cadence.
- **Database**: regular `pg_dump` to a timestamped file; retain N copies. TODO set schedule/retention.
- **Uploads**: `tar` the `/var/www/zerubabel.et/uploads` directory on a schedule.
- **Offsite (optional)**: push `pg_dump` + uploads tarball to S3 / Cloudflare R2 for offsite redundancy.
- **Restore drill**: periodically verify a `pg_dump` restore + uploads extraction works. TODO schedule first drill.

---

## 11. Definition of Done

A feature/release is "done" when:
- Code passes lint, typecheck, and tests locally (build performed off-server).
- Prisma schema uses plain `String`/`String?` for long text (no `@db.LongText`/`@db.Text`).
- Auth uses Credentials + JWT sessions (no DB session tables).
- Uploads validated against the allow-list and compressed to WebP (PDF resume excepted).
- No 3D loaded in the admin area; public 3D is lazy-loaded with a fallback.
- Production `DATABASE_URL` uses `?connection_limit=5`; Postgres port not exposed.
- Deployment is artifact-based: server only runs `prisma migrate deploy` + `pm2 reload`.
- Docs updated (PLAN.md, CHANGELOG.md, relevant `docs/` files).
- Secrets are in env only; nothing sensitive committed.

---

## 12. Next Steps

- [x] Author foundation docs (`docs/00`–`docs/25`, ADRs, `.claude/`, `.github/`) — complete.
- [ ] Decide DNS/Cloudflare specifics (proxy on/off, caching rules). TODO.
- [ ] Confirm SEO and analytics scope for MVP.
- [ ] Scaffold the Next.js app (separate task — not part of foundation docs).
- [ ] Define Prisma schema for projects/systems.
- [ ] Set backup cadence and run the first restore drill.
