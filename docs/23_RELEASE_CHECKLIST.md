# 23 — Release Checklist

Run through this **before every production release** of zerubabel.et. Grouped and actionable. Don't deploy with unchecked items in Code, Data, Security, or Deploy.

---

## Code
- [ ] `git status` clean; releasing from the intended branch/commit.
- [ ] TypeScript typecheck passes (`tsc --noEmit`).
- [ ] ESLint passes with no errors.
- [ ] Tests pass (unit / validation; E2E if present).
- [ ] **Build passes off-server** (local or CI) — never build on the 512MB Lightsail box.
- [ ] `output: "standalone"` produced and the standalone bundle is what gets deployed.
- [ ] No leftover `wip` commits, debug logs, or commented-out blocks.

## Data
- [ ] `prisma migrate deploy` plan reviewed; migrations are forward-only and safe.
- [ ] No `@db.Text` / `@db.LongText` introduced (Postgres-safe types only).
- [ ] Seed/data changes intended and reviewed.
- [ ] **DB dump taken** before applying migrations.
- [ ] Postgres schema perms confirmed (`GRANT ALL ON SCHEMA public`, `ALTER DATABASE ... OWNER`).
- [ ] `DATABASE_URL` includes `?schema=public&connection_limit=5`.

## Security
- [ ] No secrets committed; `.env` is gitignored, only `.env.example` is in the repo.
- [ ] All required env vars set on the server (see `24_ENVIRONMENT_VARIABLES.md`).
- [ ] `NEXTAUTH_SECRET` is a strong, unique production value.
- [ ] Auth uses Credentials + **JWT session**; admin routes protected.
- [ ] PostgreSQL **not exposed publicly** (localhost-bound; no public port/firewall rule).
- [ ] Upload validation active (type allowlist + size limit + WebP conversion).
- [ ] Dependencies free of known critical CVEs (`npm audit` reviewed).

## Performance
- [ ] Lighthouse performance check on key pages acceptable.
- [ ] 3D bundles lazy-loaded; not shipped on pages that don't use them; **no 3D in admin**.
- [ ] Mobile / low-end device check passes.
- [ ] `prefers-reduced-motion` fallback verified (no forced motion).
- [ ] Swap (2GB) configured; one PM2 process; memory headroom sane.

## SEO
- [ ] Per-page metadata (title, description, canonical) present and correct.
- [ ] OpenGraph / Twitter tags present (and OG image resolves).
- [ ] `sitemap.xml` and `robots.txt` present and correct.
- [ ] No SEO-critical text trapped only inside canvas/WebGL.
- [ ] Structured data valid where used.

## Deploy
- [ ] **Lightsail snapshot taken** (full instance backup) before deploy.
- [ ] Nginx config verified (reverse proxy + serves `/uploads` directly).
- [ ] PM2 config/process verified; app restarts cleanly.
- [ ] SSL (Let's Encrypt) valid and not near expiry; auto-renew working.
- [ ] Uploads dir exists at `/var/www/zerubabel.et/uploads` with correct ownership/permissions.
- [ ] Env vars loaded by the running process.
- [ ] **Rollback plan ready** (previous standalone build + snapshot + db dump; documented revert steps).

## Post-deploy
- [ ] Smoke test: homepage, a project page, contact form submit, admin login + a CRUD action.
- [ ] HTTPS works; no mixed-content warnings.
- [ ] Uploaded image renders (served by Nginx as WebP).
- [ ] Error monitoring / logs show no startup errors (`pm2 logs`).
- [ ] Verify sitemap/robots reachable in production.
- [ ] Confirm DB migrations applied cleanly.
