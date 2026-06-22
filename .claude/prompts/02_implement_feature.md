# Prompt: Implement a Feature

Reusable prompt to IMPLEMENT a feature for **zerubabel.et** per an approved plan.

---

## Copy-paste prompt

```
Implement the approved plan for: {{FEATURE}}

First re-read the approved plan, PLAN.md, and the relevant .claude/specs/ files.
Follow the LOCKED STACK, coding standards, and the 7 RULES:
1. NEVER @db.LongText / @db.Text in Postgres — long text is plain String/String?.
2. PG15 schema/owner grants assumed already done.
3. Build off-server; keep Next.js output: "standalone" intact.
4. Auth = Auth.js Credentials -> JWT session; protect every admin route/action.
5. Uploads compressed to WebP, served by Nginx; no Next image optimization for uploads.
6. Keep DATABASE_URL ?connection_limit=5; do not open extra DB connections.
7. No Docker; single PM2 process; lazy-load 3D (ssr:false); never load 3D in admin.

Rules of execution:
- Change ONLY the files named in the approved plan. If you must touch another
  file, stop and explain why first.
- Match existing code style, naming, and folder structure. Reuse existing
  utilities and shadcn/ui components instead of adding new ones.
- Do NOT add packages unless the plan justified them. If a package seems
  needed, stop and ask.

Every change must include:
- Input validation with Zod on Server Actions and Route Handlers.
- Auth checks on all admin/mutating endpoints.
- Error, loading, and empty states for any UI you add.
- Mobile-responsive layout and prefers-reduced-motion handling.
- For 3D: lazy-load, dynamic import ssr:false, adaptive DPR, mobile fallback.

When done, output:
1. List of files changed (path + one-line summary).
2. Any deviation from the plan, with justification.
3. Commands the reviewer should run to verify (lint, typecheck, test, build).
Do not commit. Stop after reporting.
```

---

## Notes
- Prefer Server Actions for mutations; Route Handlers only where an HTTP endpoint is genuinely needed.
- Keep server memory in mind (0.5GB RAM): avoid large in-memory transforms; stream/paginate where possible.
