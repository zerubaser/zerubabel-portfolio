# 17 — Vibe Coding Rules (AI-Assisted Development)

These rules keep AI-assisted development (Claude Code, Cursor, ChatGPT, etc.) **controlled, predictable, and safe** for zerubabel.et. The AI is a fast pair-programmer — not a decision-maker for architecture, stack, or infra.

---

## The 11-step workflow

Run **every** non-trivial task through these steps, in order:

1. **Understand the task.** Restate the goal in one or two sentences. Clarify ambiguity before touching code.
2. **Inspect existing files.** Read the files you're about to change and their neighbors. Don't assume structure.
3. **Read / update the relevant spec.** Check the matching doc in `docs/`. If the task changes intended behavior, update the spec first.
4. **Make a small implementation plan.** List the files you'll touch and the changes per file. Keep it minimal.
5. **Change only the necessary files.** No drive-by edits, no opportunistic reformatting of untouched code.
6. **Run checks.** `typecheck`, `lint`, and relevant tests. Fix what you broke.
7. **Adversarial review.** Re-read the diff as a skeptic: What did I miss? What breaks? Edge cases? Security? Performance on 512MB?
8. **Fix issues** found in step 7.
9. **Summarize changed files.** A short list of what changed and why.
10. **Commit** with a clear Conventional Commit message (see `16_COMMIT_RULES.md`).
11. **Push the branch.** Never commit WIP directly to `main`.

---

## AI coding rules (hard constraints)

- **Don't guess architecture.** If you don't know how something is wired, read the code or the docs first.
- **Follow `PLAN.md` and the `docs/`.** They are the source of truth for intent.
- **If docs and code disagree, STOP and reconcile.** Do not "pick one" silently. Surface the conflict and resolve it explicitly (update whichever is wrong).
- **No large unrelated rewrites.** Scope creep is forbidden. One task = one focused change set.
- **Don't silently change stack decisions.** The stack is locked (Next.js App Router, TS, Tailwind, shadcn/ui, Framer Motion, GSAP, Three.js/R3F/drei/postprocessing, Prisma, PostgreSQL, Auth.js). Changing any of these requires an explicit decision logged in `25_DECISION_LOG.md`.
- **No Docker in the MVP.** The Lightsail box has 0.5GB RAM; Docker overhead is not acceptable for MVP.
- **Don't move uploads into the app deploy folder.** Uploads live at `/var/www/zerubabel.et/uploads` and are served by Nginx — keep them outside the `standalone` output.
- **Don't build on Lightsail.** Builds happen off-server; only the `standalone` output is deployed.
- **Don't expose PostgreSQL publicly.** DB binds to localhost; no public port, no public security-group rule.
- **Don't add packages without justification.** Each new dependency must earn its place (size, maintenance, RAM/bundle cost). Prefer what's already in the stack.
- **Don't put heavy 3D on every page.** 3D is selective and lazy-loaded. Never load Three.js where it isn't used. No 3D in admin.
- **Never put SEO-critical text only inside the canvas.** Canvas/WebGL content is invisible to crawlers and screen readers.
- **Always keep a 2D fallback** for canvas content (and honor `prefers-reduced-motion`).
- **Keep admin simple and stable before advanced 3D.** Get CRUD + auth solid first; flashy 3D comes later.
- **Small, reviewable commits.** If a commit is hard to review, it's too big.

---

## Quick self-check before committing

- [ ] Did I change only what the task required?
- [ ] Did the spec and code stay in agreement?
- [ ] Did I keep the locked stack and infra rules?
- [ ] Did typecheck, lint, and tests pass?
- [ ] Is there a 2D / reduced-motion fallback for any new animation/3D?
- [ ] Is the commit message a clean Conventional Commit?
