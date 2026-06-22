# Deployment — zerubabel.et (condensed)

> Cross-reference: `docs/deployment.md` (full version).

**Server:** AWS Lightsail Ubuntu — 0.5GB RAM, 2 vCPU, 20GB SSD, **2GB swap**,
Nginx + PM2 + Let's Encrypt. **NEVER build on the server** (Rule 3): 0.5GB RAM
cannot run a Next.js build.

---

## Artifact-based flow
1. **Build OFF-server** with `output: "standalone"`; package the standalone output + `.next/static` + `public`.
2. Transfer the artifact to the server (e.g. scp/rsync to a release dir).
3. Run **`prisma migrate deploy`** on the server (never `migrate dev` / `db push`).
4. **`pm2 reload`** the app (zero-downtime); `pm2 save`.

## Server paths
- App: `/var/www/zerubabel.et/app`
- Uploads: `/var/www/zerubabel.et/uploads`
- DB backups: `/var/backups/zerubabel/db`
- Upload backups: `/var/backups/zerubabel/uploads`

## Nginx
- Reverse proxy to the Next.js app port (single PM2 process).
- `/uploads` -> `alias /var/www/zerubabel.et/uploads;` served directly by Nginx (Rule 5; no Next image optimization for uploads).
- Set `client_max_body_size` to allow image uploads; enable gzip; HTTPS redirect.

## PM2
- **Single fork** process (Rule 7 — one PM2 process, no cluster).
- `max_memory_restart: 300M` to stay within RAM + swap.
- `pm2 reload` for deploys; `pm2 save` + `pm2 startup` for boot persistence.

## SSL
- Let's Encrypt via certbot; auto-renew (systemd timer); force HTTPS.

## Firewall
- Open: **22, 80, 443**. **Do NOT expose 5432** (Postgres stays local-only).
- Enforce via `ufw` and Lightsail networking.

## Database
- PG15: `GRANT ALL ON SCHEMA public` + `ALTER DATABASE ... OWNER` on setup (Rule 2).
- `DATABASE_URL` includes **`?connection_limit=5`** (Rule 6).
- Schema is Postgres-correct: NO `@db.LongText`/`@db.Text` (Rule 1).

## Swap
- 2GB swap active to absorb memory spikes during `prisma migrate deploy` and PM2 reload.

## Backups (before every deploy)
- Lightsail **snapshot**.
- **`pg_dump`** -> `/var/backups/zerubabel/db`.
- **tar** of uploads -> `/var/backups/zerubabel/uploads`.

## Uploads permissions
- `/var/www/zerubabel.et/uploads` writable by the app/PM2 user, readable by Nginx.
- Images compressed to **WebP** before storage (Rule 5).

## Rollback
- Keep the previous artifact and previous migration state.
- Roll back: `pm2 reload` the prior release; if needed, restore DB from `pg_dump` and uploads from the tar.

> Exact deploy script, release-dir rotation, and env-var list: TODO — confirm during implementation.
