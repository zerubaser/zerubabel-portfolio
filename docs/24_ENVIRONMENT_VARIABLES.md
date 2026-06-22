# 24 — Environment Variables

All runtime configuration for zerubabel.et lives in environment variables.

- **`.env` is NEVER committed.** It is gitignored.
- **`.env.example` is the committed template** — same keys, placeholder values only, no real secrets.
- Production values are set on the Lightsail server (and/or the process manager), **not** in the repo.

> Placeholders below are examples only. **Never commit real values.**

---

## Variables

### `DATABASE_URL` — required
- **Purpose:** Prisma connection string to PostgreSQL.
- **Must include:** `?schema=public&connection_limit=5` (connection limit is mandatory per project rules — the 512MB box cannot handle large pools).
- **Example (placeholder):**
  ```
  DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/zerubabel?schema=public&connection_limit=5"
  ```
- **Local vs prod:** Local points at your dev Postgres; prod points at the **localhost** Postgres on Lightsail (DB is not publicly exposed).

### `NEXTAUTH_SECRET` — required
- **Purpose:** Secret used by Auth.js to sign/encrypt JWT sessions.
- **Example (placeholder):** `NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"`
- **Local vs prod:** Different value per environment; production must be strong and unique. Never reuse the example.

### `NEXTAUTH_URL` — required (prod), recommended (local)
- **Purpose:** Canonical base URL Auth.js uses for callbacks/redirects.
- **Example (placeholder):**
  - Local: `NEXTAUTH_URL="http://localhost:3000"`
  - Prod: `NEXTAUTH_URL="https://zerubabel.et"`

### `ADMIN_EMAIL` — required
- **Purpose:** Email/identifier for the seeded admin (Credentials login).
- **Example (placeholder):** `ADMIN_EMAIL="admin@zerubabel.et"`
- **Local vs prod:** May differ; production value is the real owner login. Used by the seed script.

### `ADMIN_PASSWORD` — required (seed-time)
- **Purpose:** Initial admin password used to seed/hash the admin credential.
- **Example (placeholder):** `ADMIN_PASSWORD="<strong-password-placeholder>"`
- **Notes:** Used only to create/hash the admin account. Use a strong unique value in production; rotate after first login if desired. Never commit a real value.

### `UPLOAD_DIR` — required
- **Purpose:** Filesystem path where uploaded (WebP-compressed) files are written.
- **Example (placeholder):**
  - Local: `UPLOAD_DIR="./uploads"`
  - Prod: `UPLOAD_DIR="/var/www/zerubabel.et/uploads"`
- **Notes:** Lives **outside** the app deploy/standalone folder. Served by Nginx, not by Next image optimization.

### `UPLOAD_PUBLIC_URL` — required
- **Purpose:** Public base URL/path under which uploads are served (by Nginx).
- **Example (placeholder):**
  - Local: `UPLOAD_PUBLIC_URL="/uploads"`
  - Prod: `UPLOAD_PUBLIC_URL="https://zerubabel.et/uploads"` (or `/uploads`)
- **Notes:** Used to build image `src` URLs for stored media.

### `CONTACT_TO_EMAIL` — required (for contact form email)
- **Purpose:** Destination address that contact-form submissions are emailed to.
- **Example (placeholder):** `CONTACT_TO_EMAIL="zeruastu@example.com"`  *(TODO: confirm real address)*

### `SMTP_HOST` — required if sending email
- **Purpose:** SMTP server hostname for outbound email (contact notifications).
- **Example (placeholder):** `SMTP_HOST="smtp.example.com"`

### `SMTP_PORT` — required if sending email
- **Purpose:** SMTP server port.
- **Example (placeholder):** `SMTP_PORT="587"`  *(587 STARTTLS or 465 SSL — TODO confirm provider)*

### `SMTP_USER` — required if sending email
- **Purpose:** SMTP auth username.
- **Example (placeholder):** `SMTP_USER="<smtp-username>"`

### `SMTP_PASS` — required if sending email
- **Purpose:** SMTP auth password.
- **Example (placeholder):** `SMTP_PASS="<smtp-password>"`
- **Notes:** Secret — never commit. Use an app-specific password where the provider supports it.

---

## Required vs optional summary

| Variable | Required? | Notes |
|----------|-----------|-------|
| `DATABASE_URL` | Required | Must include `connection_limit=5`. |
| `NEXTAUTH_SECRET` | Required | Strong, unique per env. |
| `NEXTAUTH_URL` | Required (prod) | Recommended locally. |
| `ADMIN_EMAIL` | Required | Seed admin. |
| `ADMIN_PASSWORD` | Required | Seed-time only. |
| `UPLOAD_DIR` | Required | Outside deploy folder. |
| `UPLOAD_PUBLIC_URL` | Required | Nginx-served. |
| `CONTACT_TO_EMAIL` | Required* | *If contact email is enabled. |
| `SMTP_HOST` | Optional/Conditional | Required only if sending email. |
| `SMTP_PORT` | Optional/Conditional | Required only if sending email. |
| `SMTP_USER` | Optional/Conditional | Required only if sending email. |
| `SMTP_PASS` | Optional/Conditional | Required only if sending email. |

---

## Local vs production differences (at a glance)
- **DB:** local dev Postgres vs localhost Postgres on Lightsail (never public).
- **Upload paths:** relative `./uploads` locally vs `/var/www/zerubabel.et/uploads` in prod.
- **URLs:** `localhost:3000` vs `https://zerubabel.et`.
- **Secrets:** unique, strong production values; example placeholders are never used in prod.

**Reminder:** keep `.env.example` in sync with this list whenever a new variable is introduced.
