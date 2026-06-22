# MVP Scope — zerubabel.et

> Cross-reference: `docs/mvp.md` (full version). This is the condensed checklist.

Premium 3D portfolio ("3D Digital Command Center / System Universe") for Zerubabel
Shimeles, full-stack developer in Addis Ababa. The MVP ships a complete, deployable
portfolio with admin CRUD, a public 2D site, SEO, **one** polished 3D hero, and a
live deploy to AWS Lightsail.

LOCKED STACK and the 7 RULES apply throughout (see shared context / other specs).

---

## 1. Database
- [ ] Prisma schema implemented exactly per `.claude/specs/database.md` (Postgres-correct, NO `@db.LongText`/`@db.Text`).
- [ ] PG15 setup: `GRANT ALL ON SCHEMA public` + `ALTER DATABASE OWNER` (Rule 2).
- [ ] `DATABASE_URL` carries `?connection_limit=5` (Rule 6).
- [ ] Initial migration applied; seed for single admin user + `SiteSettings`.

## 2. Admin CRUD (protected, single admin, JWT)
- [ ] Auth.js Credentials -> JWT session; login + protected `/admin` area.
- [ ] Projects — create / edit / delete / list, with images (WebP) and tech stack.
- [ ] Categories — CRUD.
- [ ] Services — CRUD.
- [ ] Messages — list / read / delete (from contact form).
- [ ] Settings — edit `SiteSettings`.
- [ ] No 3D anywhere in admin (Rule 7).

## 3. Public 2D site
- [ ] Home (`/`) — hero + key sections.
- [ ] Projects (`/projects`) — list, respects visibility rules.
- [ ] Project detail (`/projects/[slug]`).
- [ ] Services (`/services`).
- [ ] About (`/about`).
- [ ] Contact (`/contact`) — form writes to `Message`, validated + rate-limited.

## 4. SEO
- [ ] `sitemap.xml` (dynamic).
- [ ] `robots.txt`.
- [ ] Per-page metadata (title, description, canonical, OG image).

## 5. One polished 3D hero
- [ ] Single Three.js / R3F hero per `.claude/specs/three-hero.md`.
- [ ] Lazy-loaded, `ssr:false`, adaptive DPR, mobile fallback, reduced-motion respected.

## 6. Deploy to Lightsail
- [ ] Build OFF-server, `output: "standalone"` (Rule 3).
- [ ] `prisma migrate deploy` on server; single PM2 process; Nginx; Let's Encrypt SSL.
- [ ] Uploads at `/var/www/zerubabel.et/uploads` served by Nginx.
- [ ] Firewall: 22/80/443 open; 5432 closed.

---

## Exit criteria (MVP is "done" when)
1. Admin can log in and fully manage projects, categories, services, messages, and settings.
2. Public site renders all pages with real data and correct visibility filtering.
3. The 3D hero loads on desktop, falls back gracefully on mobile/reduced-motion, and is absent from admin.
4. SEO: sitemap, robots, and per-page metadata are live and valid.
5. Site is deployed to Lightsail over HTTPS, built off-server, running on one PM2 process within memory limits.
6. Backups (snapshot + `pg_dump` + uploads tar) and rollback path are in place.

## Explicitly OUT of scope for MVP
- Blog (Post/Tag) public + admin authoring beyond schema — TODO: confirm phase.
- Skills / Experience / Testimonials public sections beyond schema — TODO: confirm phase.
- Multi-user / role management beyond the single admin.
- Docker, CI/CD pipelines, multi-process scaling.
