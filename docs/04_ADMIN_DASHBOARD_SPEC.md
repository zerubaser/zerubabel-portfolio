# 04 — Admin Dashboard Spec

## Purpose
A custom admin (the site's CMS) lets Zerubabel manage **100% of content** without touching code: projects, categories, project images, case-study fields, services, skills, experience, testimonials, blog posts, contact messages, site settings, resume/CV, social links, and SEO metadata.

The admin is deliberately **lightweight** — no 3D, fast forms, server-rendered, JWT-protected.

## Admin Routes
| Route | Purpose |
|-------|---------|
| `/admin/login` | Credentials login (Auth.js). |
| `/admin/dashboard` | Overview: counts, recent messages, quick links. |
| `/admin/projects` | List / search / filter projects. |
| `/admin/projects/create` | Create a new project (+ case study, images, tech). |
| `/admin/projects/[id]/edit` | Edit an existing project. |
| `/admin/categories` | Manage project categories. |
| `/admin/services` | Manage services offered. |
| `/admin/skills` | Manage skill groups and skills. |
| `/admin/experience` | Manage work/experience timeline. |
| `/admin/testimonials` | Manage testimonials. |
| `/admin/blog` | Manage blog posts (+ tags). |
| `/admin/messages` | Read / mark contact messages. |
| `/admin/media` | Upload / manage media (WebP) and resume/CV. |
| `/admin/settings` | Site settings, SEO defaults, social links, profile. |

## Sidebar (navigation order)
1. Dashboard
2. Projects
3. Categories
4. Services
5. Skills
6. Experience
7. Testimonials
8. Blog
9. Messages
10. Media
11. Settings
12. (footer) Logout

## Admin Rules (Security)
- **Protected**: every `/admin/*` route except `/admin/login` requires an authenticated session.
- **No public registration** — accounts are not self-serve.
- **Single admin first**; `Role.EDITOR` reserved for future delegation.
- **JWT session strategy** (Auth.js Credentials) — no session tables.
- **Secure cookies**: httpOnly, secure, sameSite.
- **Strong password hashing** (bcrypt/argon2); never store plaintext.
- **Zod validation** on every Server Action / Route Handler input.
- **File validation** on uploads: type allowlist (images → WebP, PDF for resume), size limit, sanitized filenames, stored under `/var/www/zerubabel.et/uploads`.
- **Rate-limit login** attempts to resist brute force.
- **No exposed secrets**: env-only; nothing sensitive sent to the client.
- Admin pages are dynamic / no-store; never publicly cached.

## Per-Entity Feature Checklists

### Projects (most complex)
- [ ] Full CRUD (create / read / update / delete).
- [ ] Assign **category** (required).
- [ ] **Case-study fields**: problem, solution, features, outcome, summary, description, my role, client name, project type, industry, start/end date.
- [ ] **Screenshots / images**: upload, set `type` (COVER/GALLERY/SCREENSHOT/LOGO/MOCKUP/...), alt text, caption, ordering.
- [ ] **Tech stack**: attach/detach Tech via `ProjectTech`.
- [ ] **Impact metrics**: edit free-form JSON metric pairs.
- [ ] **Featured** toggle (homepage).
- [ ] **Visibility**: PUBLIC / LIMITED / CONFIDENTIAL (+ `isConfidential` quick flag).
- [ ] **Draft / Published / Archived** status.
- [ ] **SEO metadata**: metaTitle, metaDescription, ogImage, canonicalUrl, keywords.
- [ ] **Display order**.
- [ ] Live URL / GitHub URL (respecting confidentiality).

### Categories
- [ ] CRUD; name + slug (unique); description; display order.
- [ ] Prevent deleting a category still in use (reassign first).

### Services
- [ ] CRUD; title, slug, description, icon, order.
- [ ] Status (PUBLISHED/DRAFT/ARCHIVED).

### Skills
- [ ] Manage **SkillGroups** (name, slug, description, order).
- [ ] Manage **Skills** within a group (name, level, icon, order).
- [ ] Optional link of a Skill to a `Tech`.

### Experience
- [ ] CRUD; role, org, location, start/end date, description, order, status.

### Testimonials
- [ ] CRUD; author, role, company, avatar, quote.
- [ ] Featured toggle; order; status.

### Blog (Posts)
- [ ] CRUD; title, slug, excerpt, content, cover image.
- [ ] **Tags** (many-to-many via PostTag).
- [ ] Status + publishedAt.
- [ ] SEO metadata (metaTitle, metaDescription, ogImage, canonicalUrl, keywords).

### Messages
- [ ] List incoming contact messages (name, email, subject, body).
- [ ] Mark read/unread.
- [ ] Show ipAddress / userAgent for spam triage.
- [ ] Delete.

### Media
- [ ] Upload images → auto-compress to **WebP**, store under `/uploads`.
- [ ] Upload/replace **resume/CV** (PDF) → sets `SiteSettings.resumeUrl`.
- [ ] Browse / delete existing media.
- [ ] Validate type + size; sanitized filenames.

### Settings (SiteSettings, single row)
- [ ] Site identity: siteName, siteUrl, title.
- [ ] Hero: heroTitle, heroSubtitle.
- [ ] Profile: bio, profileImage, email, phone, location.
- [ ] **Resume/CV** URL.
- [ ] **Social links** (free-form JSON).
- [ ] **SEO defaults**: defaultMetaTitle, defaultMetaDescription, defaultOgImage, keywords.

## Open Items (TODO)
- TODO: Decide rich-text vs markdown editor for `Post.content` and project narrative fields.
- TODO: Confirm rate-limit thresholds for login and contact form.
- TODO: Confirm image compression pipeline (sharp at upload time) target sizes.
