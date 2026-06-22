# 25 — Decision Log

Chronological record of significant technical/architectural decisions for zerubabel.et. Each decision should have a matching ADR in `docs/adr/`. When a decision is reversed or superseded, add a new entry — never silently edit history.

> **TODO:** create the corresponding ADR files in `docs/adr/` (filenames suggested below). Dates marked TODO where the exact decision date is unknown.

---

## Summary table

| # | Date | Decision | ADR |
|---|------|----------|-----|
| 1 | TODO | Next.js full-stack instead of a separate backend | `docs/adr/0001-nextjs-fullstack.md` |
| 2 | TODO | PostgreSQL instead of MySQL | `docs/adr/0002-postgresql-over-mysql.md` |
| 3 | TODO | AWS Lightsail instead of Vercel / managed hosting | `docs/adr/0003-lightsail-over-vercel.md` |
| 4 | TODO | Local uploads instead of S3 / Cloudinary (MVP) | `docs/adr/0004-local-uploads-mvp.md` |
| 5 | TODO | Build off-server (512MB RAM constraint) | `docs/adr/0005-build-off-server.md` |
| 6 | TODO | React Three Fiber (R3F) accepted as the 3D layer | `docs/adr/0006-r3f-accepted.md` |
| 7 | TODO | No Docker in the MVP | `docs/adr/0007-no-docker-mvp.md` |

---

## Entries

### 1 — Next.js full-stack instead of a separate backend
- **Date:** TODO
- **Context:** Portfolio needs a public site, an admin, and an API/data layer. Limited server resources; single developer.
- **Rationale:** One framework (App Router + Route Handlers + Server Actions + Prisma) reduces moving parts, deployment complexity, and RAM footprint vs running a separate API service.
- **Consequences:** One PM2 process to manage; tighter coupling of front/back; must keep server-only code isolated from client bundles. Easier deploys on a small box.
- **ADR:** `docs/adr/0001-nextjs-fullstack.md` (TODO)

### 2 — PostgreSQL instead of MySQL
- **Date:** TODO
- **Context:** Need a relational DB with Prisma; prior projects used MySQL.
- **Rationale:** Stronger feature set, good Prisma support, preferred for this stack. **Implication captured as a rule:** never use `@db.LongText`/`@db.Text` (those are MySQL-isms) — use Postgres-safe `String`/`String @db.VarChar(n)`.
- **Consequences:** Must apply PG15 schema-permission fix (`GRANT ALL ON SCHEMA public`, `ALTER DATABASE ... OWNER`); `connection_limit=5` in `DATABASE_URL`; team must avoid MySQL-only column types.
- **ADR:** `docs/adr/0002-postgresql-over-mysql.md` (TODO)

### 3 — AWS Lightsail instead of Vercel / managed hosting
- **Date:** TODO
- **Context:** Need cost-predictable hosting with full control, in/near the target region, supporting a long-running Node process + Postgres + local file storage.
- **Rationale:** Lightsail gives a fixed-price VPS with full control (Nginx, PM2, local uploads, own Postgres). Vercel/managed options complicate local file storage, long-running processes, and cost predictability for this use case.
- **Consequences:** Self-managed Ubuntu (0.5GB RAM, 2 vCPU, 20GB SSD) + 2GB swap; we own Nginx, SSL (Let's Encrypt), PM2, backups, security. No platform autoscaling. Must build off-server.
- **ADR:** `docs/adr/0003-lightsail-over-vercel.md` (TODO)

### 4 — Local uploads instead of S3 / Cloudinary (MVP)
- **Date:** TODO
- **Context:** Project images need storage + serving. External object storage/CDN adds cost and integration overhead.
- **Rationale:** For MVP, store compressed WebP at `/var/www/zerubabel.et/uploads` and serve via Nginx directly. Simpler, cheaper, no external dependency; avoids heavy Next image optimization for uploads.
- **Consequences:** Uploads must live outside the app deploy/standalone folder; backups must include the uploads dir; migrating to S3/Cloudinary later is a future decision. Single-server (no built-in CDN).
- **ADR:** `docs/adr/0004-local-uploads-mvp.md` (TODO)

### 5 — Build off-server (512MB RAM constraint)
- **Date:** TODO
- **Context:** Lightsail instance has only 0.5GB RAM; Next.js builds are memory-hungry.
- **Rationale:** Building on the server risks OOM/instability. Build locally or in CI and deploy only the `standalone` output.
- **Consequences:** Requires `output: "standalone"`; a defined build-and-ship process; server only runs the prebuilt app + `prisma migrate deploy`. 2GB swap remains as a safety margin for runtime, not builds.
- **ADR:** `docs/adr/0005-build-off-server.md` (TODO)

### 6 — React Three Fiber (R3F) accepted as the 3D layer
- **Date:** TODO
- **Context:** Need a maintainable way to build 3D scenes in React.
- **Rationale:** R3F is built on Three.js and still uses Three.js concepts/objects, so it doesn't abandon the underlying engine — it makes scenes declarative and composable with drei + postprocessing. Accepted as the standard 3D approach.
- **Consequences:** Team still needs Three.js fundamentals; 3D must be lazy-loaded, selective, with 2D + reduced-motion fallbacks; **no 3D in admin**; never put SEO-critical text only in canvas.
- **ADR:** `docs/adr/0006-r3f-accepted.md` (TODO)

### 7 — No Docker in the MVP
- **Date:** TODO
- **Context:** Containerization is common, but the server has only 0.5GB RAM.
- **Rationale:** Docker's overhead is not justified on such a constrained box for a single-process app. Run directly under PM2 instead.
- **Consequences:** Simpler, lower-RAM deploy; environment is managed manually (Node, Nginx, Postgres on the host). Revisit containerization only if the project outgrows the single small instance.
- **ADR:** `docs/adr/0007-no-docker-mvp.md` (TODO)
