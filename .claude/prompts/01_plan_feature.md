# Prompt: Plan a Feature

Reusable prompt to PLAN a feature for **zerubabel.et**. Produce a plan only — **no code yet**.

---

## Copy-paste prompt

```
You are planning the feature: {{FEATURE}}

Before doing anything, read:
- PLAN.md (the project roadmap and current phase)
- The relevant spec(s) under .claude/specs/ (mvp.md, admin-dashboard.md,
  public-site.md, database.md, three-hero.md, deployment.md)
- Any docs/ file that matches this feature area

Honor the LOCKED STACK and the 7 RULES at all times:
1. NEVER use @db.LongText / @db.Text in Postgres (plain String/String?).
2. PG15: GRANT ALL ON SCHEMA public + ALTER DATABASE OWNER on setup.
3. Build OFF-server; Next.js output: "standalone".
4. Auth via Auth.js Credentials -> JWT session.
5. Compress uploads to WebP, serve via Nginx; no heavy Next image optimization for uploads.
6. DATABASE_URL must include ?connection_limit=5.
7. No Docker for MVP; one PM2 process; lazy-load 3D; no 3D in admin.

Produce a SMALL implementation plan, no code. Output exactly these sections:

1. Goal — one or two sentences on what {{FEATURE}} delivers and why.
2. Files to touch — explicit paths, each marked NEW or EDIT, with a one-line reason.
3. Schema / data impact — Prisma model or migration changes (or "none").
   Flag any long-text fields and confirm they stay plain String (Rule 1).
4. API / server impact — Route Handlers and Server Actions involved; auth
   requirements; validation (Zod) needed.
5. UI / UX impact — pages/components; required error, loading, and empty states;
   mobile + reduced-motion considerations; 3D lazy-load if applicable.
6. Risks & open questions — RAM/performance (0.5GB server), security, SEO/a11y,
   spec drift. Mark unknowns as TODO.
7. Out of scope — what this feature deliberately does NOT include.

Keep it tight. Do not write code. Wait for approval before implementing.
```

---

## Notes
- Match the plan to the current phase in `PLAN.md`; do not pull work forward.
- If the feature is not covered by an existing spec, say so and propose the spec update first.
