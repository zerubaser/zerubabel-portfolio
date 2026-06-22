# 08 — API & Server Actions Spec

API surface for **zerubabel.et**. Public reads are cached GET Route Handlers. Admin mutations prefer **Server Actions**; REST equivalents are listed for completeness/external tooling but are not the primary path.

> Conventions
> - All inputs validated with **Zod** schemas (`server/validation/*.ts`).
> - All writes call `revalidateTag(...)` (and/or `revalidatePath`) for the affected entity.
> - All responses are typed JSON: `{ data }` on success, `{ error: { code, message, fields? } }` on failure.
> - Slugs are URL identifiers; IDs are internal (cuid).

---

## 1. Caching model

| Tag | Routes/data invalidated |
|-----|-------------------------|
| `projects` | `/api/projects`, `/api/projects/[slug]` |
| `services` | `/api/services` |
| `testimonials` | `/api/testimonials` |
| `experience` | `/api/experience` |
| `skills` | `/api/skills` |
| `posts` | `/api/posts`, `/api/posts/[slug]` |
| `settings` | site settings consumers |
| `messages` | admin messages list |

- Public GET routes use ISR via `export const revalidate = <seconds>` (TODO: confirm per-route value, suggested 300) **and** `fetch`/`unstable_cache` tagged with the entity tag.
- Every successful admin write calls `revalidateTag('projects')` (etc.) so the next public request rebuilds.

---

## 2. Public GET routes (cached, no auth)

| Route | Method | Auth | Input (Zod) | Response shape |
|-------|--------|------|-------------|----------------|
| `/api/projects` | GET | none | query: `?category?`, `?featured?`, `?page?`, `?limit?` | `{ data: Project[], page, total }` |
| `/api/projects/[slug]` | GET | none | path: `slug: string` | `{ data: ProjectDetail }` (incl. images, techs) or 404 |
| `/api/services` | GET | none | — | `{ data: Service[] }` |
| `/api/testimonials` | GET | none | `?featured?` | `{ data: Testimonial[] }` |
| `/api/experience` | GET | none | — | `{ data: Experience[] }` (sorted desc by date) |
| `/api/skills` | GET | none | — | `{ data: SkillGroup[] }` (each with nested `skills[]`) |
| `/api/posts` | GET | none | `?tag?`, `?page?`, `?limit?` | `{ data: Post[], page, total }` (published only) |
| `/api/posts/[slug]` | GET | none | path: `slug: string` | `{ data: PostDetail }` (incl. tags) or 404 |

`ProjectDetail` includes: core fields + `images: ProjectImage[]` + `techs: Tech[]` + SEO fields.
`PostDetail` includes: core fields + `tags: Tag[]` + SEO fields.

### POST /api/contact (public, rate-limited)
- **Method:** POST
- **Auth:** none (rate-limited by IP — see `09_AUTH_SECURITY_SPEC.md`)
- **Input (Zod):** `{ name: string(1..100), email: email, subject?: string(..150), message: string(1..2000), honeypot?: "" }`
- **Behavior:** rejects if honeypot filled; persists to `Message`; returns generic success.
- **Response:** `{ data: { ok: true } }` or `{ error }`.

---

## 3. Admin mutations

Primary path is **Server Actions**. REST equivalents below require auth (admin role) and the same Zod schemas.

### Server Actions (preferred)
- **Location:** `server/actions/<entity>.ts` (e.g. `server/actions/projects.ts`).
- Each action: `"use server"`, asserts session+role via `requireAdmin()`, validates with Zod, mutates via Prisma, calls `revalidateTag(...)`, returns a typed result:
  ```ts
  type ActionResult<T> =
    | { ok: true; data: T }
    | { ok: false; error: { code: string; message: string; fields?: Record<string,string> } };
  ```
- Never throw raw errors to the client; map to `ActionResult`.

### REST equivalents (auth + admin role)

| Resource | Methods | Notes |
|----------|---------|-------|
| `/api/admin/projects` | POST, PUT, DELETE | create/update/delete; PUT/DELETE take `id` |
| `/api/admin/projects/[id]` | PATCH | `{ featured: boolean }` toggle |
| `/api/admin/projects/reorder` | PATCH | `{ items: { id, order }[] }` |
| `/api/admin/categories` | POST, PUT, DELETE | |
| `/api/admin/services` | POST, PUT, DELETE | |
| `/api/admin/testimonials` | POST, PUT, DELETE | |
| `/api/admin/experience` | POST, PUT, DELETE | |
| `/api/admin/skills` | POST, PUT, DELETE | covers SkillGroup + Skill |
| `/api/admin/posts` | POST, PUT, DELETE | includes publish/draft state |
| `/api/admin/messages` | GET, PATCH | GET list; PATCH `{ id, read?: boolean, archived?: boolean }` |

All admin routes:
- **Auth:** JWT session + `role === "ADMIN"` (enforced in `middleware.ts` and re-checked in handler).
- **Input:** Zod-validated; reject with `400` + `{ error.fields }`.
- **Response:** `{ data }` (200/201) | `{ error }` (400/401/403/404/409/500).
- **Side effect:** `revalidateTag(<entity>)` on success.

### POST /api/upload (auth + admin role)
- **Method:** POST (`multipart/form-data`)
- **Input:** file + `type: ImageType`. Validated for MIME + extension + size. See `10_MEDIA_UPLOAD_SPEC.md`.
- **Response:** `{ data: { url, width?, height?, type } }` or `{ error }`.

### /api/auth/[...nextauth]
- **Method:** GET/POST (Auth.js handler).
- Credentials provider, JWT strategy. See `09_AUTH_SECURITY_SPEC.md`.

---

## 4. Error codes

| HTTP | code | Meaning |
|------|------|---------|
| 400 | `VALIDATION` | Zod failure; `fields` populated |
| 401 | `UNAUTHENTICATED` | no/invalid session |
| 403 | `FORBIDDEN` | not admin |
| 404 | `NOT_FOUND` | slug/id missing |
| 409 | `CONFLICT` | duplicate slug etc. |
| 429 | `RATE_LIMITED` | login/contact throttle |
| 500 | `INTERNAL` | unexpected |

TODO: confirm pagination defaults (`limit` default/max) and per-route `revalidate` seconds.
