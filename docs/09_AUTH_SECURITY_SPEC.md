# 09 — Auth & Security Spec

Authentication and application security for **zerubabel.et**.

---

## 1. Authentication (Auth.js)

- **Provider:** Credentials only (email + password). No OAuth, no public registration.
- **Session strategy:** JWT.
  ```ts
  // auth config
  session: { strategy: "jwt" }
  ```
- **No Prisma session/account tables.** JWT strategy means sessions live in the cookie, not the DB. Do NOT add the Prisma adapter session models.
- **Single admin user.** Seeded once (script/seed). There is no sign-up route. To rotate credentials, update the `User` row's hash directly via seed/admin action.
- **Password hashing:** `argon2` (preferred) or `bcrypt` (cost >= 12). Never store plaintext; never log passwords.
- **Cookies:** httpOnly, `secure` (HTTPS only), `sameSite: "lax"`. Auth.js defaults are kept; `secure` is forced in production.
- **Roles:** `User.role` enum (`ADMIN`). The JWT carries `role`; both `middleware.ts` and each handler re-check it.

### authorize() flow
1. Zod-validate `{ email, password }`.
2. Look up `User` by email.
3. Verify hash; constant-time compare via the hashing lib.
4. On success return `{ id, email, role }`; on failure return `null` (generic error to client — never reveal which field was wrong).

---

## 2. Middleware guard (`middleware.ts`)

Protects:
- `/admin/:path*`
- `/api/admin/:path*`

Logic:
- Read JWT; if absent/invalid → redirect (UI) or `401` (API).
- If present but `role !== "ADMIN"` → `403`.
- Matcher excludes public routes and static assets.

> Defense in depth: every admin Server Action / Route Handler also calls `requireAdmin()` server-side. Middleware is not the only gate.

---

## 3. Input validation & CSRF

- **Zod on every mutation** (Server Actions and REST). Reject invalid input with field-level errors.
- **CSRF:** Server Actions are same-origin POST with the framework's action protection; Auth.js provides CSRF tokens for credential POST. Do not expose state-changing GET endpoints.
- Never trust client-supplied `role`, `id` ownership, or `published` flags without server checks.

---

## 4. Rate limiting

| Surface | Limit (suggested) | Key |
|---------|-------------------|-----|
| Login (`/api/auth`) | 5 attempts / 15 min, then backoff | IP + email |
| Contact (`/api/contact`) | 5 / hour | IP |
| Upload | 20 / hour | user |

Implementation: in-memory token bucket for single-PM2-process MVP (no Redis). TODO: confirm thresholds.

---

## 5. Security headers / CSP

Set via `next.config` headers and/or Nginx:
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- **Content-Security-Policy:** restrict `default-src 'self'`; allow needed `script-src`/`style-src` (Tailwind/Next inline nonce), `img-src 'self' data: https://zerubabel.et`, `connect-src 'self'`. TODO: finalize CSP with 3D/WebGL asset origins.

---

## 6. Secrets

- All secrets in environment variables only (`.env` on server, GitHub Actions secrets for CI). Never committed.
- Required: `AUTH_SECRET` (Auth.js), `DATABASE_URL` (with `?connection_limit=5`), `NEXTAUTH_URL`/`AUTH_URL`.
- Rotate `AUTH_SECRET` invalidates all JWTs (forces re-login) — acceptable for single admin.

---

## 7. App security checklist

- [ ] JWT session strategy, no DB sessions.
- [ ] No public registration route exists.
- [ ] Passwords hashed (argon2/bcrypt cost >=12).
- [ ] httpOnly + secure + sameSite cookies.
- [ ] `middleware.ts` guards `/admin` and `/api/admin`.
- [ ] `requireAdmin()` re-checked in every mutation.
- [ ] Zod validation on all inputs.
- [ ] Rate limit on login + contact.
- [ ] Upload MIME+extension+size validation (see `10`).
- [ ] Security headers + CSP set.
- [ ] No secrets in repo; `.env` gitignored.
- [ ] Generic auth errors (no user enumeration).

---

## 8. Firewall / network rules

- **Open ports: 22, 80, 443 only.**
- **Never expose port 3000** (Next.js) — it binds to `127.0.0.1` and is proxied by Nginx.
- **Never expose port 5432** (PostgreSQL) — `listen_addresses = 'localhost'`.
- **Restrict SSH (22) by source IP** in the Lightsail firewall (your IP / VPN CIDR only).
- Use Lightsail's networking firewall AND/OR `ufw`:
  ```bash
  ufw default deny incoming
  ufw default allow outgoing
  ufw allow from <YOUR_IP> to any port 22 proto tcp
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw enable
  ```

See `13_LIGHTSAIL_DEPLOYMENT.md` for the firewall in deployment context.
