# 15 — Git Workflow

Git rules and conventions for **zerubabel.et**.

---

## 1. Core rules

- **Never commit to `main` directly.** All work goes through feature branches + PRs.
- **Feature branches** off `develop` (or `main` if no `develop` cycle is active).
- **Small, meaningful commits** — one logical change per commit.
- **Review your own diff before committing** (`git diff`, `git status`).
- **Push after meaningful progress** (not every keystroke; not weeks of unpushed work).
- **Never push secrets / `.env` / large raw media.** `.env*`, `node_modules`, `.next`, uploads, and large binaries are gitignored.
- **Don't mix unrelated changes** in one commit or PR.

---

## 2. Branches

| Branch | Purpose |
|--------|---------|
| `main` | production, protected, deploy source |
| `develop` | integration branch |
| `docs/project-foundation` | foundation documentation (this set) |
| `feat/admin-auth` | Auth.js + middleware |
| `feat/database-schema` | Prisma schema + migrations |
| `feat/admin-projects` | admin CRUD for projects |
| `feat/public-site` | public pages |
| `feat/three-hero` | 3D homepage hero |
| `feat/deployment` | Lightsail / Nginx / PM2 / CI |
| `fix/*` | bug fixes |
| `chore/*` | tooling, deps, config |
| `docs/*` | documentation |

---

## 3. Conventional commits

Format:
```
type(scope): short description
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`, `security`.

Examples:
```
feat(projects): add admin create/edit form
fix(upload): reject svg unless sanitized
docs(deploy): add nginx uploads alias config
perf(three): scale particle count by device tier
security(auth): add login rate limiting
chore(deps): bump prisma to latest
ci(build): run typecheck before next build
```

### WIP commits
- `wip(scope): ...` is allowed for unfinished work **on feature branches only**.
- **Never `wip` on `main`** (or `develop`). Squash/clean up WIP before merging.

---

## 4. Pre-commit checklist

Run before every commit:
- [ ] `git status` — only intended files staged.
- [ ] `git diff --check` — no whitespace errors / conflict markers.
- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes.
- [ ] No secrets / `.env` / large media staged.

> **Build off-server.** Do not run `next build` as part of local commit hooks on a constrained machine if avoidable; CI handles the production build (see `13`).

---

## 5. PR flow

1. Branch from `develop` (or `main`): `feat/<thing>`.
2. Commit in small conventional commits; push.
3. Open PR → target `develop` (or `main`).
4. CI runs lint + typecheck + test + build (off-server).
5. Review diff; address feedback.
6. Squash/merge when green. Delete the branch.
7. `develop` → `main` promotions trigger deploy (artifact-based, see `13`).

TODO: confirm whether `develop` is used or trunk-based onto `main` with protection rules.
