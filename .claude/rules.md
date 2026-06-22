# Hard Rules — AI Coding on zerubabel.et

> Mirrors `docs/17_VIBE_CODING_RULES.md`, terse and imperative. If docs and code disagree, **STOP and reconcile** before writing code. `PLAN.md` is the highest authority.

## MUST

1. **MUST** read `PLAN.md` and the relevant `docs/` spec before implementing anything.
2. **MUST** stop and reconcile when documentation and code disagree — flag it, do not pick one silently.
3. **MUST** keep changes small, scoped, and reviewable; one logical concern per commit.
4. **MUST** keep the admin area simple and stable before adding advanced 3D anywhere else.
5. **MUST** always ship a **2D fallback** for any 3D experience.
6. **MUST** render SEO-critical text as real DOM/HTML, with proper headings and metadata.
7. **MUST** build off-server (local or GitHub Actions); deploy a runtime-only artifact.
8. **MUST** keep secrets in environment variables loaded at runtime on the server only.
9. **MUST** justify every new package (size, RAM cost, maintenance) before adding it.
10. **MUST** follow the locked stack and folder-structure intent in `project-context.md`.

## MUST NOT

11. **MUST NOT** guess the architecture — derive it from `PLAN.md` and `docs/`.
12. **MUST NOT** do large or unrelated rewrites while working on a focused task.
13. **MUST NOT** silently change stack decisions (framework, ORM, auth, 3D libs, hosting).
14. **MUST NOT** introduce Docker in the MVP.
15. **MUST NOT** move uploads into the app deploy folder — they live at `/var/www/zerubabel.et/uploads`, served by Nginx.
16. **MUST NOT** build or run heavy builds on the Lightsail box (512MB RAM).
17. **MUST NOT** expose PostgreSQL to the public internet; keep it bound to localhost.
18. **MUST NOT** add packages without a written justification in the PR/commit.
19. **MUST NOT** put heavy 3D on every page — lazy-load it; never load 3D in admin.
20. **MUST NOT** place SEO-critical text only inside a `<canvas>` (it is invisible to crawlers).
21. **MUST NOT** ship 3D without a working 2D fallback.
22. **MUST NOT** use `@db.LongText` or `@db.Text` in the Prisma schema — use plain `String` / `String?`.
23. **MUST NOT** use Auth.js Credentials with database sessions — session strategy must be `"jwt"`.
24. **MUST NOT** route uploads through heavy Next.js image optimization — compress to WebP, serve via Nginx.
25. **MUST NOT** commit secrets, `.env`, or large media to the repository.
