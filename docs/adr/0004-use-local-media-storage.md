# 0004 — Use Local Media Storage for MVP

## Status

Accepted

## Context

The portfolio stores uploaded media (project images, etc.) managed through the admin. Cloud object storage (S3, Cloudinary, Cloudflare R2) is the long-term standard, but for the MVP it adds account setup, credentials, SDK integration, and (for some) cost. The app already runs on a full Lightsail VPS with disk and Nginx, which can serve static files efficiently. For a single-owner portfolio's media volume, local disk storage is sufficient and simpler.

## Decision

For the MVP, store uploads on the **local Lightsail server file system**:

- Uploads are written to **`/var/www/zerubabel.et/uploads`**.
- Files are served directly by **Nginx** (not through the Node process).
- The **uploads directory lives OUTSIDE the application deploy folder**, so deploying/replacing the app artifact never deletes or overwrites user-uploaded media.

## Consequences

### Positive

- No external service, credentials, or extra cost for MVP.
- Nginx serves media efficiently and offloads it from the Node process.
- Simple mental model; everything is on one box.

### Negative / Risks

- **Backups are critical.** Uploads are not redundant; the uploads directory must be included in regular backups alongside the database. Losing the disk loses the media.
- **Upload validation is required.** Because files land on the server file system and are served by Nginx, uploads must be validated (file type/MIME, size limits, sanitized/randomized filenames, no executable content) to prevent abuse.
- Storage is bounded by the 20 GB SSD; large media growth must be monitored.
- Local files do not get a CDN by default; global delivery is slower than object storage + CDN.

### Future Migration

A later move to **S3 / Cloudflare R2** (with optional CDN) is an explicit, optional upgrade path. Keeping uploads behind a small storage abstraction and outside the deploy folder makes that migration straightforward when media volume or global performance demands it.

## Alternatives Considered

- **S3 / Cloudinary / R2 from day one** — rejected for MVP: extra setup, credentials, and (some) cost not justified at current scale; deferred as a future migration.
- **Storing media in the database (BLOBs)** — rejected: wastes RAM/DB resources and is poor for serving static assets.
