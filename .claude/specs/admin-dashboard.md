# Admin Dashboard — zerubabel.et (condensed)

> Cross-reference: `docs/admin-dashboard.md` (full version).

Protected admin area for the single site owner. No 3D anywhere in admin (Rule 7).
Auth = Auth.js Credentials -> JWT session (Rule 4).

---

## Routes
| Route | Purpose |
|---|---|
| `/admin/login` | Credentials login (email + password). |
| `/admin/dashboard` | Overview: counts, recent messages, quick links. |
| `/admin/projects` | List projects (status, visibility, featured, order). |
| `/admin/projects/create` | Create a project. |
| `/admin/projects/[id]/edit` | Edit a project (incl. images + tech stack). |
| `/admin/categories` | Manage categories. |
| `/admin/services` | Manage services. |
| `/admin/skills` | Manage skill groups + skills. |
| `/admin/experience` | Manage experience entries. |
| `/admin/testimonials` | Manage testimonials. |
| `/admin/blog` | Manage posts + tags. |
| `/admin/messages` | Read / delete contact messages. |
| `/admin/media` | Manage uploaded images (WebP). |
| `/admin/settings` | Edit `SiteSettings`. |

> Route prefix shown as `/admin/*`; confirm final base path in implementation — TODO.

## Per-entity actions
- **Projects** — create, edit, delete; manage `ProjectImage[]` (upload, alt text, caption, type, order), tech stack (`ProjectTech`), status (DRAFT/PUBLISHED/ARCHIVED), visibility (PUBLIC/LIMITED/CONFIDENTIAL), `featured`, `order`, SEO fields.
- **Categories** — create, edit, delete, reorder.
- **Services** — create, edit, delete, reorder.
- **Skills** — manage `SkillGroup` + nested `Skill` (level, optional `Tech` link).
- **Experience** — create, edit, delete, order.
- **Testimonials** — create, edit, delete.
- **Blog** — create/edit/delete `Post`; manage `Tag` + `PostTag`; status.
- **Messages** — list, mark read, delete (read-only origin from contact form).
- **Media** — upload (-> WebP), list, delete; reused by projects/posts.
- **Settings** — single `SiteSettings` row edit.

## Admin rules
- All admin routes/actions are **protected**; unauthenticated -> redirect to `/admin/login`.
- **Single admin** account (Role ADMIN; EDITOR reserved — TODO confirm use).
- **JWT session** via Auth.js; verify server-side on every mutating action.
- **Secure cookies**: httpOnly, Secure, SameSite; no session data on client.
- **Password hashed** (bcrypt/argon2 — TODO confirm); never stored or logged in plaintext.
- **Zod validation** on every Server Action / Route Handler input.
- **File validation** on uploads: allowed types, size limit, then compress to WebP (Rule 5).
- **Rate-limit login** to mitigate brute force; generic error messages on failure.
- Keep DB usage within `?connection_limit=5` (Rule 6); paginate large lists.
