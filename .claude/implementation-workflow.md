# Implementation Workflow — zerubabel.et

Follow these 11 steps for every task. Reference `PLAN.md`, `docs/`, and `.claude/*` throughout.

## 1. Understand the task

- Restate the goal in one sentence; confirm it against `PLAN.md`.
- Identify which `docs/` spec(s) govern it.
- Note the constraints that apply (512MB box, 3D fallback, uploads, auth).

## 2. Inspect existing files

- Search `src/` for related components, actions, repositories, validators.
- Check `src/three` if 3D is involved; check `prisma/schema.prisma` for data shape.
- Reuse existing patterns instead of inventing new ones.

## 3. Read / update the relevant spec

- Open the matching `docs/NN_*.md`. If it disagrees with the code, **STOP and reconcile** (per `rules.md`).
- If behavior is changing, plan the spec update now.

## 4. Make a small plan

- List the few files you will touch and why.
- Keep scope tight — one logical concern.
- Decide Server vs Client boundaries up front (3D/admin = client).

## 5. Change only the necessary files

- Edit within the existing layering: actions → repositories → Prisma; validators in `src/lib/validators`.
- No unrelated refactors. No new packages without justification.
- Honor the 7 rules (no `@db.Text`, JWT auth, WebP uploads, `connection_limit=5`, etc.).

## 6. Run checks

- Lint, typecheck, and build **locally** (or via GitHub Actions) — **never on Lightsail**.
- Run any relevant tests.
- Verify 3D lazy-loads and the 2D fallback works.

## 7. Adversarial review

- Walk the full `.claude/review-checklist.md`.
- Re-check security (auth/uploads/SQL), performance (RAM/3D/queries), mobile + reduced-motion, SEO/a11y.

## 8. Fix issues

- Address every checklist gap before proceeding.
- Re-run checks after fixes.

## 9. Summarize changed files

- List each changed file with a one-line reason.
- Confirm scope matches the step-4 plan.

## 10. Commit with a clear message

- Conventional commit: `type(scope): subject` (see `commit-workflow.md`).
- Stage only related changes; never commit `.env` or secrets.

## 11. Push the branch

- Push to a `feat/*`, `fix/*`, `chore/*`, or `docs/*` branch — never `main`.
- Push after meaningful progress; never push large media or secrets.
