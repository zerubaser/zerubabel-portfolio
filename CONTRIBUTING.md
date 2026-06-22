# Contributing to zerubabel.et

Thanks for working on this project. This guide describes how we branch, commit, review, and ship. The architectural rules live in [./PLAN.md](./PLAN.md) — read them before touching schema, auth, uploads, or deployment.

## Branch Model

- **`main`** — stable, releasable. Protected. Only updated via promotion from `develop`.
- **`develop`** — integration branch. Feature branches merge here first.
- **Short-lived working branches**, branched off `develop`:
  - `feat/<short-name>` — new functionality
  - `fix/<short-name>` — bug fixes
  - `chore/<short-name>` — tooling, deps, housekeeping
  - `docs/<short-name>` — documentation only

Keep branches focused and short-lived. Rebase or merge `develop` in regularly to avoid drift.

## Commit Format (Conventional Commits)

```
<type>(<optional scope>): <short summary>

<optional body>

<optional footer(s)>
```

**Allowed types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`, `security`.

Guidelines:
- Use the imperative mood ("add upload validation", not "added").
- Keep the summary under ~72 characters.
- Make **small, reviewable commits** — one logical change each. Avoid mixing refactors with behavior changes.
- Reference issues/PRs in the footer where relevant.

Examples:
```
feat(uploads): compress images to WebP before storage
fix(auth): force jwt session strategy for credentials provider
docs(plan): document PG15 schema permission fix
```

## Pre-Commit Checklist

Run locally before every commit (the production build runs **off-server**, so do not build here as a gate):

1. `git status` — confirm only intended files are staged.
2. `git diff --check` — catch whitespace errors and merge markers.
3. **Lint** — run the project linter; fix all errors.
4. **Typecheck** — run the TypeScript typecheck; no `any`-band-aids for real type errors.
5. **Test** — run the test suite; new logic should have coverage.

> Build note: `next build` is performed off-server (locally for verification, or in CI). It is **never** run on the 512MB Lightsail server. See PLAN.md §5.3.

## Pull Request Process

1. Branch from `develop`; open the PR back into `develop`.
2. Title follows the Conventional Commit format.
3. Description covers: what changed, why, how to test, and any follow-ups/TODOs.
4. Confirm the pre-commit checklist passed and note any architectural rules touched (schema, auth, uploads, deploy).
5. At least one review before merge (TODO: confirm reviewers / required checks).
6. Squash or rebase to keep history clean; delete the branch after merge.
7. Releases: promote `develop` → `main`, tag per Semantic Versioning, update [./CHANGELOG.md](./CHANGELOG.md).

## Related Docs

- [./docs/15_GIT_WORKFLOW.md](./docs/15_GIT_WORKFLOW.md) — full git workflow
- [./docs/16_COMMIT_RULES.md](./docs/16_COMMIT_RULES.md) — commit message rules
- [./docs/17_VIBE_CODING_RULES.md](./docs/17_VIBE_CODING_RULES.md) — coding/working rules
- [./PLAN.md](./PLAN.md) — source of truth, architecture, gotchas
- [./SECURITY.md](./SECURITY.md) — security and secrets handling
