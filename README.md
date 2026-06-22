# zerubabel.et

Premium personal portfolio for **Zerubabel Shimeles**, full-stack developer based in Addis Ababa, Ethiopia (BSc Computer Science, HilCoE; AWS Certified Cloud Practitioner).

## Concept

**3D Digital Command Center / System Universe.** This is not a template portfolio. It presents Zerubabel as a builder of real business systems — ERP/SaaS, clinic/lab platforms, LMS, WordPress sites, Flutter mobile apps, backend APIs, and dashboards. The interface is framed as a navigable command center: an interactive 3D environment where each "system" is a real, explorable artifact rather than a static project card.

## Final Stack

**Frontend**
- Next.js (latest stable, App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion, GSAP / ScrollTrigger

**3D**
- Three.js, React Three Fiber, @react-three/drei, @react-three/postprocessing
- (R3F is built on real Three.js — real Three concepts apply throughout.)

**Backend**
- Next.js Route Handlers + Server Actions
- Prisma ORM + PostgreSQL
- Auth.js / NextAuth (Credentials provider, JWT sessions)

**Hosting**
- AWS Lightsail Ubuntu VPS (~$5/mo, 0.5GB RAM, 2 vCPU, 20GB SSD, 1TB transfer)
- 2GB swap (raise to 4GB only if needed)
- Nginx reverse proxy, PM2, Let's Encrypt SSL
- Local uploads at `/var/www/zerubabel.et/uploads`, served by Nginx at `https://zerubabel.et/uploads/...`

## MVP Scope

- 3D command-center landing experience (lazy-loaded)
- Projects / systems showcase with detail views
- About + skills + certifications
- Resume (PDF) download
- Contact form (email delivery)
- Admin dashboard (auth-protected) to manage projects and uploads — **no 3D in admin**
- Image upload pipeline (compress to WebP, served by Nginx)

## Advanced Scope

- Richer 3D interactions, postprocessing, scene transitions
- Analytics / view metrics on projects
- Content versioning / draft states
- Optional object storage (S3 / R2) for uploads and backups
- Performance budgets and progressive enhancement for low-end devices

## Hosting Decision

Single small AWS Lightsail Ubuntu VPS running the app as **runtime only**. Builds happen off-server (locally or via GitHub Actions) and ship as artifacts. Nginx terminates TLS and serves uploads directly; PM2 supervises one Next.js process. No Docker, no clustering, no heavy background jobs for the MVP. See [./docs/13_LIGHTSAIL_DEPLOYMENT.md](./docs/13_LIGHTSAIL_DEPLOYMENT.md).

## Important Constraints (7 Architecture Rules)

1. **PostgreSQL + Prisma**: never use `@db.LongText` or `@db.Text`. Plain `String` / `String?` is unlimited text in Postgres.
2. **PG permissions**: `CREATE DATABASE` + `USER`, `GRANT ALL ON DATABASE`, then `\c db`, `GRANT ALL ON SCHEMA public`, `ALTER DATABASE OWNER TO user` (PG15+ requires the schema grant).
3. **Build off-server**: never run `next build` on the 512MB server. Build locally / GitHub Actions; the server only receives the artifact, runs `prisma migrate deploy`, and `pm2 reload`. Use `output: "standalone"`.
4. **Auth**: Credentials provider → session strategy `"jwt"`. No Prisma session tables.
5. **Image optimization**: compress uploads to WebP and serve via Nginx. Do **not** use heavy Next on-the-fly image optimization for uploaded media.
6. **Prisma connection limit**: production `DATABASE_URL` includes `?connection_limit=5`.
7. **Server memory**: MVP = no Docker, one PM2 process, no clustering, no heavy background jobs, lazy-load 3D, no 3D in admin, low Postgres `max_connections`, Nginx serves uploads, swap not relied on for builds.

## Development Workflow Summary

- Local development with `npm run dev`.
- Lint, typecheck, and test before committing; **build is performed off-server**.
- Database changes via Prisma migrations; never edit production schema by hand.
- Uploads tested against the allow-list (jpg, jpeg, png, webp, pdf for resume only).
- See [./CONTRIBUTING.md](./CONTRIBUTING.md) for the full checklist.

## Git Workflow Summary

- Branches: `main` (stable), `develop` (integration), and short-lived `feat/`, `fix/`, `chore/`, `docs/` branches.
- Conventional Commits; small, reviewable commits.
- PRs into `develop`; releases promoted to `main`.
- See [./docs/15_GIT_WORKFLOW.md](./docs/15_GIT_WORKFLOW.md).

## Documentation Index

- [./PLAN.md](./PLAN.md) — source of truth (overview, stack, architecture, gotchas, phases, deployment, backup, DoD)
- [./CONTRIBUTING.md](./CONTRIBUTING.md) — branch model, commit format, pre-commit checklist, PR process
- [./SECURITY.md](./SECURITY.md) — vulnerability reporting, upload rules, secrets handling
- [./CHANGELOG.md](./CHANGELOG.md) — release history (Keep a Changelog)
- [./LICENSE](./LICENSE) — proprietary, All Rights Reserved
- [./.env.example](./.env.example) — documented environment variables (no secrets)

### Specs & rules (`docs/`)

- [./docs/00_PROJECT_BRIEF.md](./docs/00_PROJECT_BRIEF.md) — project brief
- [./docs/01_ARCHITECTURE.md](./docs/01_ARCHITECTURE.md) — system architecture + topology
- [./docs/02_TECH_STACK.md](./docs/02_TECH_STACK.md) — locked stack + rationale
- [./docs/03_DATABASE_SPEC.md](./docs/03_DATABASE_SPEC.md) — **canonical** Prisma schema
- [./docs/04_ADMIN_DASHBOARD_SPEC.md](./docs/04_ADMIN_DASHBOARD_SPEC.md) — admin routes + features
- [./docs/05_PUBLIC_SITE_SPEC.md](./docs/05_PUBLIC_SITE_SPEC.md) — public pages + visibility rules
- [./docs/06_THREE_JS_R3F_SPEC.md](./docs/06_THREE_JS_R3F_SPEC.md) — 3D scene plan
- [./docs/07_ANIMATION_SPEC.md](./docs/07_ANIMATION_SPEC.md) — animation choreography
- [./docs/08_API_AND_SERVER_ACTIONS_SPEC.md](./docs/08_API_AND_SERVER_ACTIONS_SPEC.md) — API + server actions
- [./docs/09_AUTH_SECURITY_SPEC.md](./docs/09_AUTH_SECURITY_SPEC.md) — auth + security
- [./docs/10_MEDIA_UPLOAD_SPEC.md](./docs/10_MEDIA_UPLOAD_SPEC.md) — uploads + media
- [./docs/11_SEO_SPEC.md](./docs/11_SEO_SPEC.md) — SEO
- [./docs/12_PERFORMANCE_BUDGET.md](./docs/12_PERFORMANCE_BUDGET.md) — performance budget (0.5GB RAM)
- [./docs/13_LIGHTSAIL_DEPLOYMENT.md](./docs/13_LIGHTSAIL_DEPLOYMENT.md) — deployment
- [./docs/14_BACKUP_AND_RESTORE.md](./docs/14_BACKUP_AND_RESTORE.md) — backup + restore
- [./docs/15_GIT_WORKFLOW.md](./docs/15_GIT_WORKFLOW.md) — git workflow
- [./docs/16_COMMIT_RULES.md](./docs/16_COMMIT_RULES.md) — commit rules
- [./docs/17_VIBE_CODING_RULES.md](./docs/17_VIBE_CODING_RULES.md) — AI/vibe-coding rules
- [./docs/18_TESTING_AND_QA.md](./docs/18_TESTING_AND_QA.md) — testing + Definition of Done
- [./docs/19_ACCESSIBILITY_SPEC.md](./docs/19_ACCESSIBILITY_SPEC.md) — accessibility
- [./docs/20_CONTENT_MODEL.md](./docs/20_CONTENT_MODEL.md) — content model
- [./docs/21_PROJECT_SEED_CONTENT.md](./docs/21_PROJECT_SEED_CONTENT.md) — seed content (projects)
- [./docs/22_ROADMAP.md](./docs/22_ROADMAP.md) — phased roadmap
- [./docs/23_RELEASE_CHECKLIST.md](./docs/23_RELEASE_CHECKLIST.md) — release checklist
- [./docs/24_ENVIRONMENT_VARIABLES.md](./docs/24_ENVIRONMENT_VARIABLES.md) — env vars
- [./docs/25_DECISION_LOG.md](./docs/25_DECISION_LOG.md) — decision log
- [./docs/adr/](./docs/adr/) — architecture decision records (0001–0006)
- [./.claude/](./.claude/) — AI assistant context, rules, prompts, and condensed specs
