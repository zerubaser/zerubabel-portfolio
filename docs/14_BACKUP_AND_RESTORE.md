# 14 — Backup & Restore

Three-layer backup strategy for **zerubabel.et**.

---

## 1. Backup layers

### Layer 1 — Lightsail snapshots (whole instance)
- **Automatic snapshots:** enable in the Lightsail console (daily).
- **Manual snapshot before every deploy** (and before risky DB/Nginx changes).
- Snapshots capture the entire disk (app + DB data dir + uploads). Slowest to create, fullest recovery.

### Layer 2 — PostgreSQL `pg_dump` (logical DB backup)
- Target: `/var/backups/zerubabel/db`
- gzip-compressed, nightly via cron.

### Layer 3 — Uploads tar (media backup)
- Target: `/var/backups/zerubabel/uploads`
- tar.gz of `/var/www/zerubabel.et/uploads`.

### (Future, optional) Offsite sync
- Sync `/var/backups/zerubabel` to **S3 or Cloudflare R2** (e.g. `aws s3 sync` / `rclone`) for off-instance durability. TODO: add when ready.

---

## 2. Scripts

### `backup-db.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR=/var/backups/zerubabel/db
STAMP=$(date +%F_%H%M%S)
DB=zerubabel
DB_USER=zerubabel_user

mkdir -p "$BACKUP_DIR"
# PGPASSWORD provided via env / ~/.pgpass (never hardcode the secret)
pg_dump -U "$DB_USER" -h localhost "$DB" | gzip > "$BACKUP_DIR/${DB}_${STAMP}.sql.gz"

# retention: keep last 14 daily dumps
find "$BACKUP_DIR" -name "${DB}_*.sql.gz" -mtime +14 -delete
```

### `backup-uploads.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR=/var/backups/zerubabel/uploads
STAMP=$(date +%F_%H%M%S)
SRC=/var/www/zerubabel.et/uploads

mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/uploads_${STAMP}.tar.gz" -C "$(dirname "$SRC")" "$(basename "$SRC")"

# retention: keep last 14 archives
find "$BACKUP_DIR" -name "uploads_*.tar.gz" -mtime +14 -delete
```

Make executable: `chmod +x backup-db.sh backup-uploads.sh`.

### Cron
```cron
# DB dump nightly at 02:00
0 2 * * * /usr/local/bin/backup-db.sh >> /var/log/zerubabel-backup-db.log 2>&1
# Uploads archive nightly at 02:30
30 2 * * * /usr/local/bin/backup-uploads.sh >> /var/log/zerubabel-backup-uploads.log 2>&1
```
(Spec calls for DB cron `0 2 * * *`; uploads offset to avoid overlap.)

---

## 3. Restore

### Restore DB from a gz dump
```bash
gunzip -c /var/backups/zerubabel/db/zerubabel_<STAMP>.sql.gz \
  | psql -U zerubabel_user -h localhost zerubabel
```
> For a clean restore, drop/recreate the DB first (re-apply the PG15 grant fix from `13`), then load the dump. Stop the app (`pm2 stop zerubabel-et`) during restore.

### Restore uploads from a tar
```bash
pm2 stop zerubabel-et   # optional; uploads dir is independent
tar -xzf /var/backups/zerubabel/uploads/uploads_<STAMP>.tar.gz -C /var/www/zerubabel.et/
sudo chown -R <pm2_user>:<pm2_user> /var/www/zerubabel.et/uploads
pm2 start zerubabel-et
```

### Restore whole instance from a Lightsail snapshot
1. In Lightsail console, **create a new instance from the snapshot**.
2. **Re-attach the static IP** to the new instance.
3. Verify Nginx, PostgreSQL, PM2 came up; check `/uploads/` serves.
4. Re-run certbot if the cert didn't carry over.

---

## 4. Retention guidance

| Layer | Retention |
|-------|-----------|
| Lightsail auto snapshots | 7 daily (console default; adjust) |
| Manual pre-deploy snapshots | keep last 2–3, delete stale |
| `pg_dump` gz | 14 days (script) |
| Uploads tar | 14 days (script) |
| Offsite (future) | 30+ days |

- Periodically **test a restore** into a throwaway instance — a backup is only real once restored.
- Keep at least one offsite copy before relying solely on Lightsail.

TODO: confirm final retention windows and add offsite sync.
