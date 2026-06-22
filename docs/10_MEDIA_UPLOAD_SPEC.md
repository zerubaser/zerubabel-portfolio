# 10 — Media & Upload Spec

Local file storage for **zerubabel.et**. Uploads are stored on disk and served by **Nginx**, not Next.js.

---

## 1. Storage location

- **Disk path:** `/var/www/zerubabel.et/uploads`
- **Public URL base:** `https://zerubabel.et/uploads/...`
- The uploads directory lives **OUTSIDE the app deploy folder** (`/var/www/zerubabel.et/app`) so it **survives deploys** (artifact swaps never touch it).
- The PM2 runtime user must **own** the uploads dir (write access for the upload handler):
  ```bash
  sudo mkdir -p /var/www/zerubabel.et/uploads/{projects,profile,resume,og}
  sudo chown -R <pm2_user>:<pm2_user> /var/www/zerubabel.et/uploads
  sudo chmod -R 755 /var/www/zerubabel.et/uploads
  ```

### Folder layout
```
/var/www/zerubabel.et/uploads/
├── projects/   # project images (cover, gallery)
├── profile/    # avatar / about photos
├── resume/     # resume PDF (only place PDFs are allowed)
└── og/         # OpenGraph / social share images
```

---

## 2. Allowed & rejected types

| Allowed | Where |
|---------|-------|
| `jpg`, `jpeg`, `png`, `webp` | all image folders |
| `pdf` | **resume only** (`resume/`) |

| Rejected (always) |
|-------------------|
| `php`, `js`, `html`, `exe`, `sh`, `zip` |
| `svg` — rejected **unless sanitized** (DOMPurify/svgo on a strict allowlist); default = reject |

Any file whose content looks script-like (e.g. `<?php`, `<script`, shell shebang) is rejected regardless of extension.

---

## 3. Upload rules

1. **Max size:** 2–5 MB per file (TODO: lock exact value; Nginx `client_max_body_size 10M` is the hard ceiling).
2. **Validate BOTH MIME type and extension** — and re-check by sniffing magic bytes (don't trust the client `Content-Type` alone). Extension and detected type must agree and be in the allowlist.
3. **Convert images to WebP** on upload (sharp). Store the WebP; original is discarded unless a non-convertible (PDF) type.
4. **PDFs** allowed only for `resume/`; not converted.
5. **No SVG** unless sanitized through a strict pipeline; default behavior rejects SVG.
6. Reject script-like / disallowed extensions (see table above) early, before writing to disk.

### Validation order (handler)
1. Auth + admin (see `09`).
2. Size check (reject > max).
3. Extension allowlist check (per target folder).
4. MIME + magic-byte sniff; must agree with extension.
5. Convert to WebP (images) via sharp.
6. Generate filename, write to correct folder.
7. Return `{ url, width?, height?, type }`.

---

## 4. Naming & slug conventions

- Filenames: `<slug>-<shorthash>.webp` (or `.pdf`), lowercase, kebab-case, no spaces/unicode.
  - e.g. `command-center-3d-cover-a1b2c3.webp`
- Hash/random suffix prevents collisions and guessing.
- Never reuse the raw client filename verbatim.

### Alt text & ImageType
- Every image record stores **alt text** (required for SEO/a11y — see `11`).
- `ImageType` enum classifies usage, e.g. `COVER`, `GALLERY`, `PROFILE`, `OG`, `RESUME`. Used to pick folder + rendering rules.
- `ProjectImage` rows carry `alt`, `order`, and `ImageType`.

---

## 5. Serving (Nginx, NOT Next.js)

- Nginx serves `/uploads/` directly via an `alias` with long cache headers (see Nginx config in `13`).
- **NO heavy Next.js image optimization for uploads.** The `next/image` optimizer is reserved for static `/public` assets only.
  - Render uploads via plain `<img src="/uploads/...">`, or `<Image ... unoptimized />` if a Next `Image` component is desired.
- This avoids running the sharp optimizer at request time on the 512 MB server (it would compete for RAM). Images are already WebP-compressed at upload time.

---

## 6. Checklist

- [ ] Uploads dir outside deploy folder, owned by PM2 user.
- [ ] Subfolders: projects/ profile/ resume/ og/.
- [ ] Allowlist enforced (jpg/jpeg/png/webp + pdf for resume).
- [ ] MIME + extension + magic-byte validation.
- [ ] Images converted to WebP (sharp) at upload.
- [ ] SVG rejected unless sanitized.
- [ ] Script-like / dangerous extensions rejected.
- [ ] Nginx serves /uploads/ with cache headers; Next does not optimize them.
- [ ] Alt text + ImageType recorded.

## Implementation notes (Phase 3)

- **Upload pipeline:** `src/lib/upload.ts` validates (extension + MIME + magic
  bytes + size), converts images to WebP (resize ≤1920px via sharp), generates
  safe filenames (`<prefix>-YYYYMMDD-<rand>.<ext>`, never the user filename),
  and writes inside `UPLOAD_DIR` with path-traversal guards. PDFs are allowed
  only for the `resume` target; SVG is blocked.
- **Endpoint:** `POST /api/admin/upload` (Node runtime, `auth()`-guarded, not
  matched by middleware) returns JSON `{ url, filename, size, contentType }`.
  Stored URLs are origin-relative `/uploads/...`.
- **Serving:** In **production, Nginx** serves `/uploads/` directly and never
  proxies it to Next. For **local dev only**, `src/app/uploads/[...path]/route.ts`
  serves files from `UPLOAD_DIR` (read-only, traversal-guarded, allowed
  extensions only). Production must not depend on this route.
- **ProjectImage:** managed at `/admin/projects/[id]/images` (upload + add,
  edit metadata, delete row + physical file). Standalone files are browsed at
  `/admin/media`; deletion is refused while a ProjectImage still references the
  file.
- **TODO:** wire `SiteSettings.resumeUrl` to an uploaded resume in the
  site-settings phase; consider a standalone media-library model only if needed.
