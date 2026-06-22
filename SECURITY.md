# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in zerubabel.et, please report it privately and **do not** open a public issue.

- **Contact:** TODO — add a dedicated security contact email (placeholder).
- Include: a description, reproduction steps, affected URL/route or component, and impact assessment.
- You will receive an acknowledgement as soon as possible. Please allow reasonable time for a fix before any public disclosure.

## Supported Scope

In scope:
- The production deployment at `https://zerubabel.et` and its API routes / server actions.
- The admin dashboard and authentication flow.
- The upload pipeline and how uploaded files are stored and served.

Out of scope:
- Third-party services and infrastructure not operated by the project owner (e.g. DNS provider, AWS platform itself).
- Findings requiring physical access or privileged credentials.
- Volumetric DoS / spam without a concrete vulnerability.

## Upload Allow / Deny Rules

Uploads are strictly validated.

- **Allowed:** `jpg`, `jpeg`, `png`, `webp`, and `pdf` (PDF for the **resume only**).
- **Rejected:** `php`, `js`, `html`, `svg` (unless explicitly sanitized), `exe`, `sh`, `zip`, and any script-like or executable files.

Additional handling:
- Images are compressed to WebP at upload time.
- Uploaded files are served as static assets by Nginx from `/var/www/zerubabel.et/uploads`, not executed by the application.
- Validate by content/type, not just extension, where feasible.

## Secrets Handling

- **Never commit `.env`** or any real secret. Only `.env.example` (with empty values) is tracked.
- All secrets live in environment variables on the server, set out-of-band.
- **PostgreSQL is not exposed** to the public network; it listens locally only.
- **Firewall** allows only ports **22 (SSH)**, **80 (HTTP)**, and **443 (HTTPS)**.
- **Restrict SSH by IP** where possible (allow-list trusted source IPs; consider key-only auth, disable password login).
- Production `DATABASE_URL` includes `?connection_limit=5` and is never logged.
- Rotate credentials if exposure is suspected.

## Responsible Disclosure

We support responsible disclosure. Please give us a reasonable window to investigate and remediate before publishing details. We will credit reporters who follow this policy if they wish. Acting in good faith under this policy means we will not pursue action against you for your research.
