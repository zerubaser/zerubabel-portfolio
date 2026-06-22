# Prompt: Deployment Review

Reusable prompt to review **zerubabel.et** before deploying to AWS Lightsail.

---

## Copy-paste prompt

```
Review readiness to deploy: {{RELEASE_OR_CHANGE}}

Server: AWS Lightsail Ubuntu, 0.5GB RAM, 2 vCPU, 20GB SSD, 2GB swap, Nginx, PM2,
Let's Encrypt. Read .claude/specs/deployment.md and honor the 7 RULES.

Go through this checklist and report Pass / Action needed for each:

1. Build artifact (Rule 3 — NEVER build on the server)
   - Build done off-server with output: "standalone".
   - Artifact (standalone + static + public) packaged for transfer.

2. Database
   - prisma migrate deploy will run on the server (not dev migrate/db push).
   - No @db.LongText/@db.Text in schema (Rule 1).
   - DATABASE_URL includes ?connection_limit=5 (Rule 6).
   - PG15 grants confirmed: GRANT ALL ON SCHEMA public + ALTER DATABASE OWNER (Rule 2).

3. Environment variables
   - All required env vars present on server (DATABASE_URL, AUTH_SECRET,
     NEXTAUTH_URL/app URL, etc.); no dev secrets; not committed to git.

4. Nginx
   - Reverse proxy to the app port; /uploads served via alias to
     /var/www/zerubabel.et/uploads; gzip; correct client_max_body_size for uploads.

5. PM2
   - Single fork process; max_memory_restart ~300M; pm2 reload (zero-downtime);
     pm2 save + startup configured.

6. SSL
   - Let's Encrypt cert valid and auto-renew (certbot timer) working; HTTPS
     redirect in place.

7. Backups (before deploy)
   - Lightsail snapshot taken.
   - pg_dump of the database to /var/backups/zerubabel/db.
   - tar of uploads to /var/backups/zerubabel/uploads.

8. Firewall
   - Open: 22, 80, 443. Closed/not public: 5432 (Postgres). Confirm via ufw and
     Lightsail networking.

9. Uploads
   - /var/www/zerubabel.et/uploads exists with correct owner/permissions; writable
     by the app user, readable by Nginx; WebP pipeline working.

10. Rollback plan
   - Documented: keep previous artifact + previous migration state; how to pm2
     reload the prior release and restore DB/uploads from backup if needed.

End with a GO / NO-GO verdict and the list of blocking actions.
```

---

## Notes
- If any migration is destructive, require a fresh `pg_dump` immediately before running it.
- Verify swap is active (2GB) so the build-free deploy and PM2 restart don't OOM.
