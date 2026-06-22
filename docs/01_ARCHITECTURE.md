# 01 — Architecture

## Overview
zerubabel.et is a single Next.js (App Router) application serving three logical layers — **public**, **admin**, and **api** — backed by Prisma + local PostgreSQL, fronted by Nginx, and run by PM2 on a small AWS Lightsail Ubuntu instance. Media uploads live on local disk and are served directly by Nginx. Builds happen **off-server**; the server runs runtime-only artifacts.

## Topology Diagram

```
                         ┌─────────────────────────────┐
                         │           Browser           │
                         │  (Next.js client + R3F 3D)  │
                         └──────────────┬──────────────┘
                                        │  HTTPS
                                        ▼
                         ┌─────────────────────────────┐
                         │  Cloudflare / AWS DNS        │  TODO: confirm provider
                         │  (DNS, optional CDN/SSL edge)│
                         └──────────────┬──────────────┘
                                        │
                                        ▼
                         ┌─────────────────────────────┐
                         │  Lightsail Static IP        │
                         │  (Ubuntu, 0.5GB RAM, 2 vCPU,│
                         │   20GB SSD, 2GB swap)       │
                         └──────────────┬──────────────┘
                                        │  :443 / :80
                                        ▼
                ┌───────────────────────────────────────────────┐
                │                   Nginx                        │
                │  • TLS termination (Let's Encrypt)             │
                │  • Reverse proxy → 127.0.0.1:3000              │
                │  • Serves /uploads/* directly from disk        │
                │  • gzip/brotli, cache headers for static       │
                └───────────────┬───────────────────┬───────────┘
                                │ proxy              │ static file serve
                                ▼                    ▼
          ┌──────────────────────────────┐   ┌─────────────────────────────┐
          │   Next.js (output:standalone)│   │ /var/www/zerubabel.et/uploads│
          │   PM2, single fork process   │   │  (WebP images, resume, etc.) │
          │   • Public  (SSR / ISR)      │   └─────────────────────────────┘
          │   • Admin   (protected)      │
          │   • API     (Route Handlers, │
          │     Server Actions)          │
          └──────────────┬───────────────┘
                         │  Prisma Client (?connection_limit=5)
                         ▼
          ┌──────────────────────────────┐
          │   PostgreSQL (local, same box)│
          │   localhost:5432              │
          └──────────────────────────────┘
```

## Layers

### Public Layer (SSR / ISR)
- Routes: `/`, `/projects`, `/projects/[slug]`, `/services`, `/blog`, `/blog/[slug]`, `/about`, `/contact`.
- Rendered with SSR for fresh content and **ISR** (revalidation) for cacheable pages (project lists, blog, services).
- 3D hero and heavy sections are **client components, lazy-loaded** (`dynamic(..., { ssr: false })`), never blocking the initial server-rendered content.
- Reads from Prisma directly in Server Components / loaders; no client-side DB access.

### Admin Layer (Protected)
- Routes under `/admin/*`.
- Guarded by **Auth.js (Credentials provider, JWT session strategy)** — no public registration, single admin first.
- Server Actions + Route Handlers handle CRUD with **Zod validation**.
- **No 3D** in admin (keeps it light and fast).
- Secure cookies, strong password hashing, login rate-limiting.

### API Layer
- **Route Handlers** (`app/api/*`) for things needing HTTP endpoints (contact form submit, auth callbacks, file upload handling, webhooks if any).
- **Server Actions** for in-app mutations from admin and forms.
- All write paths validate input and enforce auth where required.

## Caching & Revalidation
- **ISR / `revalidate`** on public list and detail pages; revalidate on content publish via `revalidatePath` / `revalidateTag` triggered from admin mutations.
- **Nginx** sets long cache headers on `/uploads/*` and Next static assets (`/_next/static`).
- Uploaded images are pre-compressed to **WebP**; Next image optimization is **not** used for uploads (served raw via Nginx) to protect the small instance.
- Avoid over-caching authenticated admin responses — admin pages are dynamic/no-store.

## Request Flow (example: viewing a project)
1. Browser requests `/projects/clinic-system` over HTTPS.
2. DNS resolves to the Lightsail static IP; Nginx terminates TLS.
3. Nginx reverse-proxies to Next.js on `127.0.0.1:3000`.
4. Next.js renders the Server Component, querying PostgreSQL via Prisma (respecting `visibility` rules).
5. HTML streams back; client hydrates; lazy 3D / heavy sections load after.
6. Image/screenshot URLs point at `/uploads/*`, which Nginx serves directly from disk (bypassing Next.js).

## Deploy Boundary (Artifact-Based, Build Off-Server)
- **Build off-server** (local machine or GitHub Actions) using `output: "standalone"`.
- The Lightsail box is **runtime-only**: it receives the built `.next/standalone` artifact + `public` + `node_modules` (production) and runs it under PM2 — it does **not** run `next build` (insufficient RAM).
- DB migrations applied via `prisma migrate deploy` on the server (lightweight) against local PostgreSQL.
- Single PM2 process; restart on deploy.

## Server Sizing Constraints (drive the architecture)
- 0.5GB RAM + **2GB swap** — every choice favors low memory: no Docker, one PM2 fork, no on-server builds, no heavy image pipeline.
- `DATABASE_URL` uses `?connection_limit=5` to cap Prisma's pool.

## Open Items (TODO)
- TODO: Decide Cloudflare proxy on/off (affects real client IP for `Message.ipAddress`).
- TODO: Define GitHub Actions deploy pipeline (build → rsync/scp artifact → migrate → PM2 reload).
- TODO: Backup strategy for PostgreSQL + `/uploads`.
