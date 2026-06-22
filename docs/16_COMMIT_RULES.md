# 16 — Commit Rules (Conventional Commits)

This project uses **[Conventional Commits](https://www.conventionalcommits.org/)**. Every commit message must be parseable, consistent, and describe a single logical change.

---

## Format

```
type(scope): subject

[optional body]

[optional footer(s)]
```

- **type** — required, lowercase, from the allowed list below.
- **scope** — optional but encouraged, lowercase, in parentheses.
- **subject** — required, short summary (see subject rules).
- **body** — optional, explains *what* and *why* (not *how*).
- **footer** — optional, for breaking changes, issue refs, co-authors.

Example:

```
feat(three): add lazy-loaded project universe hero
```

---

## Allowed types — when to use each

| Type | Use when… |
|------|-----------|
| `feat` | Adding new user-facing functionality (a page, component, endpoint, admin feature). |
| `fix` | Fixing a bug in existing behavior. |
| `docs` | Changes to documentation only (the `docs/` folder, README, code comments-only edits). |
| `style` | Formatting, whitespace, semicolons — no logic change (Prettier/ESLint autofixes). |
| `refactor` | Restructuring code without changing behavior or adding features. |
| `perf` | A change that improves performance (bundle size, query speed, render cost). |
| `test` | Adding or correcting tests; no production code change. |
| `chore` | Maintenance: deps bumps, config tweaks, tooling, non-source housekeeping. |
| `build` | Changes to build system or build output (Next config, `output: "standalone"`, tsconfig). |
| `ci` | Changes to CI pipeline / automation scripts. |
| `security` | Security hardening, dependency CVE fixes, auth/permission tightening, secret handling. |

> If two types seem to apply, pick the one that describes the *primary intent* of the change. Split unrelated work into separate commits.

---

## Scope examples

Scopes describe the area of the codebase touched. Common scopes for zerubabel.et:

| Scope | Area |
|-------|------|
| `admin` | Admin dashboard, CRUD forms, auth-gated UI. |
| `public` | Public-facing pages and components. |
| `three` | 3D scenes (Three.js / R3F / drei / postprocessing). |
| `auth` | Auth.js Credentials flow, JWT session, route protection. |
| `media` | Uploads, WebP compression, image serving. |
| `deploy` | Nginx, PM2, Lightsail, Let's Encrypt, server config. |
| `db` | Prisma schema, migrations, seed scripts. |

Other ad-hoc scopes are fine when meaningful (e.g. `seo`, `contact`, `blog`).

---

## Subject rules

- **Imperative mood** — "add", not "added" / "adds". (Reads as "this commit will *add* …".)
- **Lowercase** first letter (after the `type(scope):` prefix).
- **No trailing period.**
- **< 72 characters** total for the header line; aim for ~50.
- Be specific: `fix(media): reject uploads larger than 5MB` beats `fix(media): bug fix`.

---

## Body guidance

- Optional. Use it when the *why* isn't obvious from the subject.
- Wrap at ~72 columns.
- Explain the motivation and contrast with previous behavior.
- Do **not** restate the diff line-by-line.

```
perf(three): defer postprocessing until hero is in view

Loading the bloom/SSAO passes on first paint blocked interaction on
low-end mobile. We now mount the EffectComposer only after the hero
intersects the viewport, keeping TTI low.
```

---

## Footer guidance

- Reference issues: `Refs #12`, `Closes #34`.
- Co-authors on their own line: `Co-Authored-By: Name <email>`.
- Breaking changes (see below).

---

## Breaking changes

Mark any change that breaks an existing contract (DB schema, API shape, env vars) with a `BREAKING CHANGE:` footer **and/or** a `!` after the type/scope.

```
feat(db)!: rename Project.body to caseStudyBody

BREAKING CHANGE: the Project.body column is renamed. Run the new
migration and update any code/queries referencing `body`.
```

The footer text should explain what broke and what the migration/upgrade path is.

---

## WIP commits

- Use `wip(scope): …` only for **temporary, unfinished progress** on a feature branch.
- A `wip` commit **must never be left on `main`** — squash, reword, or drop it before merging.

```
wip(three): rough skills-galaxy node layout, not interactive yet
```

---

## 8+ concrete examples for this project

```
feat(admin): add project create form with category select
feat(three): add lazy-loaded 3d hero with reduced-motion fallback
fix(media): compress uploads to webp before writing to disk
fix(auth): use jwt session strategy for credentials provider
perf(public): lazy-load three.js bundle below the fold
refactor(db): extract project image relation into separate model
docs(deploy): document nginx + pm2 + lets encrypt setup steps
chore(db): add prisma seed script for project categories
build(next): enable output standalone for off-server builds
security(auth): hash admin password with bcrypt on seed
test(media): add webp conversion unit tests for upload pipeline
ci(build): add typecheck and lint to pre-merge checks
```
