# Adversarial Self-Review Checklist — zerubabel.et

Run this **before every commit**. Be your own harshest reviewer. Check every box or fix the gap.

## Correctness

- [ ] The change actually does what the task / spec asked.
- [ ] Matches `PLAN.md` and the relevant `docs/` spec (no drift).
- [ ] Edge cases handled (empty, null, large input, concurrent).
- [ ] Loading, empty, and error states are present for any data view.

## Scope & Files

- [ ] Only **necessary** files changed — no stray reformatting or unrelated edits.
- [ ] No large or unrelated rewrites snuck in.
- [ ] No leftover debug code, `console.log`, or commented-out dead code.
- [ ] No accidental new files (especially generated artifacts).

## Validation

- [ ] All external input validated with **Zod** in the Server Action.
- [ ] DB access confined to `src/server/repositories`; actions don't touch Prisma directly.
- [ ] Types are accurate; no stray `any` without justification.

## Error Handling

- [ ] Errors caught at action/repository boundary; typed result returned.
- [ ] No stack traces, SQL, or secrets leaked to the client.

## Secrets

- [ ] No secrets, tokens, or credentials in code.
- [ ] **No `.env`** (or any env file) staged.
- [ ] No hardcoded URLs/keys that belong in environment variables.

## Dependencies

- [ ] No new packages — or each new package is **justified** (size, RAM, maintenance).
- [ ] Stack decisions unchanged (Next/Prisma/Auth.js/Three.js/R3F all intact).

## Security

- [ ] Auth: protected routes/actions actually check the session; admin gated.
- [ ] Auth.js Credentials still uses **JWT** sessions (no DB session tables).
- [ ] Uploads: validated type/size, compressed to **WebP**, written to `/var/www/zerubabel.et/uploads`, served by Nginx — not moved into the deploy folder.
- [ ] No SQL injection surface; Prisma parameterized queries only.
- [ ] PostgreSQL not exposed publicly.

## Performance (512MB box)

- [ ] No build step or heavy work expected on the Lightsail server.
- [ ] 3D is lazy-loaded; **no 3D in admin**; not loaded on every page.
- [ ] Queries are bounded (pagination/limits); no N+1.
- [ ] `DATABASE_URL` still uses `?connection_limit=5`.
- [ ] No `@db.LongText` / `@db.Text` in Prisma schema.

## Mobile & Motion

- [ ] Layout works on small screens.
- [ ] `prefers-reduced-motion` respected for Framer Motion / GSAP / 3D.
- [ ] 3D has a working **2D fallback**.

## SEO & Accessibility

- [ ] SEO-critical text is real DOM, never only inside `<canvas>`.
- [ ] Metadata / headings correct.
- [ ] Keyboard navigation, focus states, alt text, semantic HTML.

## Docs & Commit

- [ ] Relevant `docs/` spec updated if behavior changed.
- [ ] Conventional commit message ready: `type(scope): subject`.
- [ ] On a feature/fix branch, **not** `main`.
