# Commit Workflow — zerubabel.et

How to prepare and ship a commit. Builds happen **off-server** — never run builds/tests on the Lightsail box.

## Pre-commit checks

Run these (locally or in CI), in order:

1. `git status` — review what changed.
2. `git diff --check` — catch whitespace errors and conflict markers.
3. **Lint** (e.g. `npm run lint`).
4. **Typecheck** (e.g. `tsc --noEmit` or `npm run typecheck`).
5. **Test** (e.g. `npm test`) if tests exist for the area.
6. Build only off-server when needed (local / GitHub Actions). **Never build on Lightsail (512MB).**

## Staging

- Stage **only related changes** (`git add <paths>`), not `git add .` blindly.
- **Never** stage `.env`, secrets, credentials, or large media.
- Confirm the staged set matches your implementation plan.

## Conventional commit message

Format: `type(scope): subject`

- Subject: imperative mood, lowercase, no trailing period, ~50 chars.
- Body (optional): explain **why**; reference the relevant `docs/` spec or `PLAN.md` section.
- **Allowed types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`, `security`.

## Branch naming

- `feat/*` — new features (e.g. `feat/hero-3d-scene`)
- `fix/*` — bug fixes (e.g. `fix/upload-webp-conversion`)
- `chore/*` — tooling/maintenance (e.g. `chore/eslint-config`)
- `docs/*` — documentation (e.g. `docs/update-vibe-rules`)

## Rules

- **Never commit to `main`.** Always work on a branch.
- Push after meaningful progress.
- **Never push** secrets, `.env`, or large media files.

## Example commit messages

- `feat(three): add lazy-loaded hero scene with 2D fallback`
- `fix(uploads): compress images to WebP before saving to uploads dir`
- `perf(db): add connection_limit=5 to DATABASE_URL and bound project query`
- `security(auth): enforce JWT session strategy on Credentials provider`
- `refactor(server): move project queries into repositories layer`
- `docs(specs): document admin uploads flow in docs/09_uploads.md`
- `chore(ci): build standalone output in GitHub Actions, not on server`
