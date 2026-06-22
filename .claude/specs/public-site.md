# Public Site — zerubabel.et (condensed)

> Cross-reference: `docs/public-site.md` (full version).

Public-facing 2D site (with one 3D hero). SEO-first, mobile-responsive,
reduced-motion aware. Only PUBLISHED + permitted-visibility content is shown.

---

## Pages
| Route | Purpose |
|---|---|
| `/` | Home — hero (3D) + curated sections. |
| `/projects` | Project listing/grid, filterable by category. |
| `/projects/[slug]` | Project detail. |
| `/services` | Services offered. |
| `/blog` | Post listing. (TODO: confirm in MVP vs later phase.) |
| `/blog/[slug]` | Post detail. (TODO: phase.) |
| `/about` | Bio, skills, experience, testimonials. |
| `/contact` | Contact form -> `Message` (validated, rate-limited). |

## Homepage sections
1. **3D hero** — the System Universe scene (lazy-loaded, ssr:false, mobile fallback).
2. **Featured projects** — `featured = true`, PUBLISHED.
3. **Services** — summary of offerings.
4. **Skills / tech** — grouped skills + tech.
5. **Experience** — timeline. (TODO: confirm on homepage vs about-only.)
6. **Testimonials** — selected quotes.
7. **About teaser** — short bio + Addis Ababa location, CTA to `/about`.
8. **Contact CTA** — link/section to `/contact`.

> Confirm final section order and which are MVP — TODO.

## Project detail fields (from `Project`)
Title, slug, summary, description, clientName, projectType, industry, myRole,
startDate/endDate, problem, solution, features, outcome, impactMetrics (Json),
liveUrl, githubUrl, category, tech stack (`ProjectTech` -> `Tech`),
images (`ProjectImage[]` by type/order), SEO (metaTitle, metaDescription, ogImage,
canonicalUrl, keywords).

## Visibility rules
Each `Project` has `status` (DRAFT/PUBLISHED/ARCHIVED) and `visibility`
(PUBLIC/LIMITED/CONFIDENTIAL). Public site shows only `status = PUBLISHED`, then:
- **PUBLIC** — fully shown: all fields, images, client name, links.
- **LIMITED** — shown but sensitive fields hidden/anonymized (e.g. clientName, githubUrl, internal metrics). Exact hidden set: TODO confirm.
- **CONFIDENTIAL** — not listed publicly; `isConfidential` projects excluded from listings and detail, or shown as anonymized case study only. TODO confirm exact behavior.

DRAFT and ARCHIVED are never shown on the public site.
