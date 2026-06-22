# 11 — SEO Spec

SEO for **zerubabel.et**. The 3D experience must never come at the cost of crawlable, fast, semantic content.

**Primary target keyword:** `Zerubabel Shimeles full-stack developer Addis Ababa`.

---

## 1. Rendering strategy

- **All public pages SSR/ISR** (server components + `revalidate`). No client-only data fetching for SEO-critical content.
- 3D scene loads **after** the real content (lazy `dynamic(..., { ssr: false })`) so it never blocks LCP. See `12_PERFORMANCE_BUDGET.md`.

---

## 2. Metadata

- Use **`generateMetadata`** per page (projects, posts, services, home, about).
- Pull per-entity SEO fields from the DB (see §6) with sensible fallbacks to `SiteSettings`.
- Include:
  - `<title>` / `metaTitle`
  - `<meta name="description">` / `metaDescription`
  - **OpenGraph** (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`)
  - **Twitter card** (`summary_large_image`)
  - **canonical URL** (`alternates.canonical`)

### Dynamic OG images
- Generate per-project / per-post OG images (e.g. `opengraph-image.tsx` / `@vercel/og` style route) or use stored `ogImage` from `/uploads/og/`.
- Cache OG images aggressively.

---

## 3. Structured data (JSON-LD)

| Schema | Where |
|--------|-------|
| `Person` | home/about — name "Zerubabel Shimeles", jobTitle, location Addis Ababa, sameAs links |
| `CreativeWork` (or `SoftwareApplication`) | each project detail page |
| `BreadcrumbList` | project & post detail pages |
| `BlogPosting` | each post (TODO: confirm) |

Inject via `<script type="application/ld+json">` in the server component.

---

## 4. Semantic HTML behind the canvas

- **Never put SEO-critical text only inside the 3D `<canvas>`.** WebGL content is invisible to crawlers.
- Every hero headline, tagline, project title, and CTA must exist as **real DOM / 2D fallback** (proper `<h1>`/`<h2>`/`<p>`), visually layered with or behind the canvas.
- The canvas is decorative/enhancement; the page is fully readable and navigable with WebGL disabled.
- Use correct heading hierarchy (one `<h1>` per page), `<nav>`, `<main>`, `<article>`, `<section>`, descriptive link text, and `alt` on all images.

---

## 5. Crawl & performance assets

- **`sitemap.ts`** — dynamic sitemap from DB (projects, posts, static pages) with `lastModified`.
- **`robots.ts`** — allow public; disallow `/admin` and `/api/admin`; reference sitemap.
- **Canonical URLs** on every page (absolute, `https://zerubabel.et/...`).
- **Fast LCP:** 3D loads after content; preload critical fonts; static hero text is server-rendered.

---

## 6. Per-entity SEO fields

Stored on SEO-relevant entities (Project, Post, Service, and `SiteSettings` for defaults):

| Field | Purpose |
|-------|---------|
| `metaTitle` | `<title>` override |
| `metaDescription` | meta description |
| `ogImage` | OG/social image URL (`/uploads/og/...`) |
| `canonicalUrl` | explicit canonical override |
| `keywords` | keyword list (optional) |

Fallback chain: entity field → `SiteSettings` default → hardcoded site default.

---

## 7. Checklist

- [ ] SSR/ISR on all public pages.
- [ ] `generateMetadata` per page with title/description/OG/canonical.
- [ ] Dynamic OG images per project/post.
- [ ] JSON-LD: Person, CreativeWork per project, BreadcrumbList.
- [ ] `sitemap.ts` + `robots.ts` (disallow admin).
- [ ] No SEO text trapped inside `<canvas>`; DOM fallback always present.
- [ ] Single `<h1>`, semantic landmarks, alt text everywhere.
- [ ] 3D loads after content (LCP protected).
- [ ] Target keyword present in home `<h1>`, title, description.
