# 20 — Content Model (Plain Language)

This describes the **content entities** of zerubabel.et in plain language — what each thing is, its key fields, who edits it, and where it shows up. This is conceptual; the actual Prisma schema lives separately and must follow the project rules (notably: **no `@db.LongText` / `@db.Text` in PostgreSQL** — use `String` / `String @db.VarChar(n)` appropriately).

All content is managed by the **site owner (admin)** via the admin dashboard unless noted.

---

## Entities

### Projects
- **Purpose:** The core of the portfolio — the work being showcased.
- **Key fields:** title, slug, summary, case-study body (problem / approach / outcome), role, visibility (public / unlisted / draft / confidential), featured flag, category (relation), tech stack (relation/tags), metrics (e.g. "1,000+ students"), external links (live URL, repo), order/priority, SEO fields.
- **Related — Project Images:** ordered images for each project, each with **`altText`** (required for a11y), caption (optional), and the file reference to the WebP upload.
- **Related — Case-study fields & metrics:** structured highlights, results, and measurable outcomes.
- **Who edits:** Admin.
- **Where it appears:** Projects listing (filterable by category/tech), individual project/case-study pages, featured projects on the homepage, the 3D "Project Universe" (advanced).

### Categories
- **Purpose:** Classify projects by domain/type for filtering and navigation.
- **Key fields:** name, slug, description (optional), icon/color (optional), order.
- **Who edits:** Admin.
- **Where it appears:** Project filters, category landing/grouping, navigation.
- **Defined categories:** ERP/SaaS, Healthcare (Clinic/Hospital/Lab), LMS/Education, WordPress, Mobile Apps, Backend APIs, Business Websites, Nonprofit, Corporate, Real Estate, Architecture, Dental.

### Services
- **Purpose:** The offerings/skills sold to clients (what Zerubabel does).
- **Key fields:** title, description, icon, order, optional linked projects.
- **Who edits:** Admin.
- **Where it appears:** Services section on the homepage / a dedicated services page.

### Testimonials
- **Purpose:** Social proof from clients/colleagues.
- **Key fields:** quote, author name, author role/company, avatar (optional), associated project (optional), order, visibility.
- **Who edits:** Admin.
- **Where it appears:** Homepage testimonials section, possibly on related project pages.

### Experience
- **Purpose:** Professional/work history timeline.
- **Key fields:** organization, role/title, start date, end date (or "present"), summary, highlights, location, order.
- **Who edits:** Admin.
- **Where it appears:** About page, the 3D timeline (advanced) with a 2D fallback.

### SkillGroups / Skills
- **Purpose:** Categorized technical skills.
- **SkillGroup fields:** name (e.g. "Frontend", "Backend", "DevOps", "Mobile"), order.
- **Skill fields:** name, group (relation), proficiency/level (optional), icon (optional), order.
- **Who edits:** Admin.
- **Where it appears:** About/skills section; the 3D "Skills Galaxy" (advanced) with a 2D fallback.

### Posts / Tags (Blog)
- **Purpose:** Articles / writing (post-MVP feature).
- **Post fields:** title, slug, excerpt, body (Markdown/HTML), cover image, published flag, published date, tags (relation), SEO fields.
- **Tag fields:** name, slug.
- **Who edits:** Admin.
- **Where it appears:** Blog index and post pages (advanced phase).

### Messages
- **Purpose:** Inbound contact submissions from the public contact form.
- **Key fields:** name, email, subject (optional), message body, created date, read/handled flag, source/IP (optional, for spam triage).
- **Who edits:** Created by the public (form submission); **read/managed by admin only**. Not publicly visible.
- **Where it appears:** Admin inbox; optionally emailed to the owner (`CONTACT_TO_EMAIL`).

### SiteSettings
- **Purpose:** Global, single-record site configuration.
- **Key fields:** bio / about text, social links (GitHub, LinkedIn, X, etc.), resume/CV file reference, contact email, default SEO (default title/description, default OG image), location, availability status.
- **Who edits:** Admin.
- **Where it appears:** Footer, about, hero, contact, and as default metadata across the site.

---

## Notes
- **Visibility** matters: some projects (e.g. healthcare systems) may be **confidential or limited** — the model must support hiding details or whole projects from the public.
- All long-text fields use Postgres-safe types (no `@db.Text`/`@db.LongText`).
- All images shown publicly carry meaningful `altText`.
