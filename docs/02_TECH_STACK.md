# 02 — Tech Stack (Locked)

This stack is **locked**. Each technology has a single clear job. Rationales are one line each.

## Public (Frontend)
| Tech | Rationale |
|------|-----------|
| **Next.js (latest stable, App Router)** | SSR/ISR, routing, Server Components, and Server Actions in one framework. |
| **TypeScript** | Type safety across UI, data layer, and Prisma models. |
| **Tailwind CSS** | Fast, consistent utility styling for a premium custom look. |
| **shadcn/ui** | Accessible, unstyled-by-default components we own and theme. |
| **Framer Motion** | Declarative DOM reveal / micro-interaction animations. |
| **GSAP + ScrollTrigger** | Scroll-driven choreography (camera moves, pinned sections). |
| **Lenis (optional)** | Smooth scroll to make scroll-driven 3D feel premium. |

## Admin
| Tech | Rationale |
|------|-----------|
| **Next.js App Router (`/admin/*`)** | Same app, protected segment — no separate deployment. |
| **Auth.js (Credentials, JWT)** | Single-admin auth without session tables. |
| **Zod** | Validates every admin form / Server Action input. |
| **shadcn/ui + Tailwind** | Clean, fast admin UI (no 3D, deliberately lightweight). |

## 3D
| Tech | Rationale |
|------|-----------|
| **Three.js** | The actual WebGL 3D engine doing all rendering. |
| **React Three Fiber (R3F)** | React renderer for Three.js — declarative scene graph. |
| **@react-three/drei** | Helpers (loaders, controls, environments, instances). |
| **@react-three/postprocessing** | Bloom / effects for the glowing "command center" look. |

> **R3F clarification:** React Three Fiber is **real Three.js** — it is not a separate or "lite" engine. R3F is a thin React reconciler that creates and updates ordinary `THREE.*` objects. Anything you can do in vanilla Three.js, you can do in R3F; you just express the scene graph as React components. Understanding core Three.js is therefore mandatory.

### Required Three.js Concepts
- **Scene** — the container/graph of all objects.
- **Camera** — perspective camera, position, FOV, scroll-driven movement.
- **Mesh** — geometry + material = a renderable object.
- **Geometry** — shapes (box, cylinder for DB, custom/extruded for logo).
- **Materials** — standard/physical/emissive/shader materials for the glow.
- **Lights** — ambient, point, spot; emissive + bloom for "glow."
- **Shaders** — custom GLSL for particles, energy lines, HUD effects.
- **Postprocessing** — bloom, vignette, chromatic touches (low-end limited).
- **Controls** — orbit/parallax/scroll-bound camera control.
- **Animation loop** — `useFrame` per-frame updates (R3F render loop).
- **Performance** — DPR clamping, instancing, lazy load, dispose, draw-call budget.

## Backend
| Tech | Rationale |
|------|-----------|
| **Next.js Route Handlers** | HTTP endpoints (contact, auth, uploads). |
| **Server Actions** | In-app mutations from admin/forms without bespoke APIs. |
| **Prisma** | Type-safe ORM + migrations against PostgreSQL. |
| **PostgreSQL** | Relational store; unlimited-length `String` text (no LongText). |
| **Auth.js (Credentials, JWT)** | JWT session strategy → no DB session tables. |

## Server / Infrastructure
| Tech | Rationale |
|------|-----------|
| **AWS Lightsail (Ubuntu, 0.5GB/2vCPU/20GB)** | Cheap, predictable single-box host. |
| **2GB swap** | Compensates for tiny RAM during runtime. |
| **Nginx** | TLS termination, reverse proxy, serves `/uploads`. |
| **PM2** | Keeps the single Next.js standalone process alive. |
| **Let's Encrypt** | Free auto-renewing TLS certificates. |
| **Local uploads (`/var/www/zerubabel.et/uploads`)** | WebP media on disk, served by Nginx, no S3 for MVP. |
| **`output: "standalone"`** | Minimal runtime artifact; build happens off-server. |

## Stack Rules (cross-cutting)
1. Prisma text fields are plain `String`/`String?` — **never** `@db.LongText`/`@db.Text` on Postgres.
2. PG15: `GRANT ALL ON SCHEMA public` + `ALTER DATABASE ... OWNER` to the app role.
3. Build off-server; server is runtime-only; `output: "standalone"`.
4. Auth.js Credentials → `session.strategy = "jwt"`; no session tables.
5. Compress uploads to WebP, serve via Nginx; no heavy Next image optimization for uploads.
6. `DATABASE_URL` includes `?connection_limit=5`.
7. No Docker (MVP), one PM2 process, lazy-load 3D, no 3D in admin.
