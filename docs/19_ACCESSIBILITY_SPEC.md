# 19 — Accessibility Spec (a11y)

Accessibility is a **requirement**, not a nice-to-have — especially because this is a 3D-heavy portfolio. WebGL content is invisible to assistive tech and crawlers, so every visual experience needs an accessible equivalent.

Target: **WCAG 2.1 AA** as the working baseline.

---

## Core commitments

- **Semantic HTML** — use real elements (`<nav>`, `<main>`, `<header>`, `<button>`, `<a>`, headings in order). No `div`-as-button.
- **Keyboard navigation** — every interactive element reachable and operable by keyboard alone. Logical tab order. No keyboard traps.
- **Focus management** — visible focus rings (never `outline: none` without a replacement). Move focus to dialogs/menus on open and restore it on close.
- **ARIA where needed** — only when semantic HTML can't express the role/state. Don't ARIA-over-engineer; prefer native elements.
- **Color contrast** — text meets AA (4.5:1 normal, 3:1 large). Don't rely on color alone to convey meaning.
- **Alt text on all images** — every `ProjectImage` has an `altText` field; it must be populated and meaningful (empty `alt=""` only for decorative images).
- **Reduced motion** — honor `prefers-reduced-motion: reduce` everywhere. All 3D and animation must have a calm/static fallback.
- **2D fallback for canvas content** — anything shown in WebGL is also available as accessible 2D HTML.
- **Accessible forms** — every input has a `<label>`; errors are programmatically associated and announced.
- **Skip-to-content** — a "Skip to main content" link as the first focusable element.
- **Screen-reader-friendly nav** — landmarks, current-page indication (`aria-current`), descriptive link text (no "click here").

---

## Per-area checklists

### Hero / 3D scenes
- [ ] `prefers-reduced-motion: reduce` → render a static 2D hero (image/gradient + text), no autoplay motion.
- [ ] Canvas has an accessible 2D equivalent for any conveyed information.
- [ ] No SEO- or meaning-critical text lives **only** inside the canvas.
- [ ] 3D is lazy-loaded and does not block keyboard interaction with surrounding UI.
- [ ] Decorative canvas is hidden from AT (`aria-hidden="true"`) when an accessible alternative exists.
- [ ] Controls (orbit/zoom, if any) are operable or safely skippable by keyboard.

### Forms (contact, admin CRUD)
- [ ] Every field has a visible, associated `<label>`.
- [ ] Required fields indicated in text, not color alone.
- [ ] Validation errors are associated via `aria-describedby` and announced (`role="alert"` / live region).
- [ ] Submit buttons have clear labels and disabled/loading states are conveyed to AT.
- [ ] Focus moves to the first error on failed submit.

### Admin
- [ ] No 3D in admin — keep it simple, fast, and fully keyboard-accessible.
- [ ] Tables/lists have proper headers; row actions are real buttons/links.
- [ ] Auth-gated pages handle focus on login/redirect sensibly.
- [ ] Toasts/notifications use a polite live region.

### Project pages
- [ ] Heading hierarchy is correct (one `<h1>`, ordered sub-headings).
- [ ] All `ProjectImage.altText` populated and descriptive.
- [ ] Case-study content is real HTML text (crawlable + readable), not baked into images/canvas.
- [ ] Links to live sites / repos have descriptive text and `rel` attributes where appropriate.
- [ ] Metrics and tech tags are text, not image-only.

---

## Testing notes
- Manual keyboard pass on every new interactive surface.
- Lighthouse a11y + an automated checker (e.g. axe) on key pages.
- Verify with `prefers-reduced-motion` toggled on.
- **TODO:** add reduced-motion and a11y checks to the QA pass once tooling is set up (see `18_TESTING_AND_QA.md`).
