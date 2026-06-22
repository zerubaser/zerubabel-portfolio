# Prompt: Adversarially Review a Feature

Reusable prompt to REVIEW a change to **zerubabel.et** as a hostile, skeptical reviewer.

---

## Copy-paste prompt

```
Adversarially review the change for: {{FEATURE}}

Assume the implementation is wrong until proven correct. Read the diff, the
approved plan, PLAN.md, and the relevant .claude/specs/ files. Check the change
against the LOCKED STACK and the 7 RULES.

Review across these axes and report findings per axis (Pass / Issues found):

1. Correctness
   - Does it match the approved plan and the spec? Edge cases, null handling,
     off-by-one, wrong status/visibility logic.

2. Security
   - Auth: every admin route/action gated; JWT/session verified server-side;
     secure + httpOnly cookies; password hashed.
   - Uploads: file type/size validated; WebP compression; path traversal blocked;
     served only via Nginx /uploads alias.
   - SQL/data: no raw/unsafe queries; Zod validation present; no secrets leaked
     to the client; no mass-assignment.

3. Performance (server is 0.5GB RAM / 2 vCPU)
   - DB: query count, N+1, missing indexes, unbounded selects; respects
     ?connection_limit=5.
   - 3D: lazy-loaded, ssr:false, adaptive DPR, instancing, no 3D in admin,
     mobile fallback; memory/leak risks (geometry/material disposal).
   - General: no large in-memory buffers; pagination where lists can grow.

4. Mobile & reduced-motion
   - Responsive at small breakpoints; prefers-reduced-motion respected;
     touch targets; no jank on low-end devices.

5. SEO & a11y
   - Metadata/canonical/OG correct; sitemap/robots unaffected or updated;
     semantic HTML, alt text, labels, focus order, contrast.

6. Spec drift
   - Anything implemented that the spec/plan did not call for, or spec items
     silently skipped. Flag schema changes that violate Rule 1.

For each finding: severity (Blocker / Major / Minor / Nit), file:line, and a
concrete fix. End with a verdict: APPROVE, APPROVE WITH NITS, or REQUEST CHANGES.
```

---

## Notes
- Treat any `@db.LongText`/`@db.Text` in a Postgres schema as an automatic Blocker (Rule 1).
- Treat any 3D import in the admin area as an automatic Blocker (Rule 7).
