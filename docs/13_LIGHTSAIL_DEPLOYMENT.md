# 13 — Lightsail Deployment

Full deployment guide for **zerubabel.et** on **AWS Lightsail (Ubuntu, 0.5 GB RAM, 2 vCPU, 20 GB SSD, 1 TB transfer)**.

> **GOLDEN RULE:** **NEVER run `next build` on the 512 MB server.** Builds happen off-server (local or GitHub Actions). The server only receives an artifact, runs `prisma migrate deploy`, and `pm2 reload`.

---

## 1. Server paths

```
/var/www/zerubabel.et/app          # deployed Next.js standalone app (swapped each deploy)
/var/www/zerubabel.et/uploads      # user uploads — OUTSIDE app, survives deploys, owned by PM2 user
/var/backups/zerubabel/db          # pg_dump backups
/var/backups/zerubabel/uploads     # uploads tar backups
```

---

## 2. Initial server setup

### 2.1 Update & swap
```bash
sudo apt update && sudo apt upgrade -y

# 2 GB swap (RAM is only 512 MB)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### 2.2 Nginx
```bash
sudo apt install -y nginx
```

### 2.3 PostgreSQL + DB/user (with PG15 schema-permission fix)
```bash
sudo apt install -y postgresql postgresql-contrib
sudo -u postgres psql <<'SQL'
CREATE DATABASE zerubabel;
CREATE USER zerubabel_user WITH ENCRYPTED PASSWORD 'CHANGE_ME';   -- real value in env only
GRANT ALL PRIVILEGES ON DATABASE zerubabel TO zerubabel_user;
\c zerubabel
GRANT ALL ON SCHEMA public TO zerubabel_user;
ALTER DATABASE zerubabel OWNER TO zerubabel_user;
SQL
```
> PG15 revoked default `public` schema create rights — the `GRANT ALL ON SCHEMA public` + `ALTER DATABASE ... OWNER` lines are **required** or Prisma migrations fail.

Keep Postgres local-only: `listen_addresses = 'localhost'`. Apply small-server tuning from `12_PERFORMANCE_BUDGET.md`.

### 2.4 Node LTS + PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
pm2 startup   # follow printed command to enable on boot
```

### 2.5 Static IP + DNS
- Allocate and attach a **Lightsail static IP** to the instance.
- DNS: **A record** `zerubabel.et → <static IP>`; **CNAME** `www → zerubabel.et` (or A `www → static IP`).

### 2.6 Firewall (22/80/443 only, SSH by IP)
See `09_AUTH_SECURITY_SPEC.md` §8. Open only 22, 80, 443. **Restrict SSH (22) to your IP.** Never expose 3000 or 5432.

### 2.7 SSL (after DNS resolves)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d zerubabel.et -d www.zerubabel.et
```
Run certbot only **after** the A/CNAME records resolve to the static IP.

### 2.8 Create dirs
```bash
sudo mkdir -p /var/www/zerubabel.et/app
sudo mkdir -p /var/www/zerubabel.et/uploads/{projects,profile,resume,og}
sudo mkdir -p /var/backups/zerubabel/{db,uploads}
sudo chown -R <pm2_user>:<pm2_user> /var/www/zerubabel.et
```

---

## 3. Artifact-based deploy flow

### Off-server (local or GitHub Actions)
1. `npm ci`
2. `npx prisma generate`
3. `npm run lint && npm run typecheck && npm test`
4. `next build` (with `output: "standalone"`)
5. Package artifact: `.next/standalone` + `.next/static` + `public/` + `prisma/` (schema + migrations) + `package.json`.

### On the Lightsail server (runtime-only)
1. Receive artifact (scp / GitHub Actions deploy step).
2. Update app files into `/var/www/zerubabel.et/app` (atomic swap recommended: extract to new dir, symlink).
3. `npx prisma migrate deploy`  (apply pending migrations — **never** `migrate dev`).
4. `pm2 reload zerubabel-et`
5. Nginx **keeps serving `/uploads/`** uninterrupted (uploads dir untouched).

> Always take a Lightsail snapshot before a deploy (see `14_BACKUP_AND_RESTORE.md`).

---

## 4. Nginx site config

`/etc/nginx/sites-available/zerubabel.et` (symlink into `sites-enabled`). HTTPS server block (certbot manages the 443/cert lines):

```nginx
server {
    server_name zerubabel.et www.zerubabel.et;

    client_max_body_size 10M;          # cap upload size (handler enforces 2–5M)

    gzip on;
    gzip_types text/plain text/css application/json application/javascript image/svg+xml;

    # Uploads served directly by Nginx (NOT Next.js)
    location /uploads/ {
        alias /var/www/zerubabel.et/uploads/;
        access_log off;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
        try_files $uri =404;
    }

    # App proxied to the single PM2 Next.js process
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl;          # managed by certbot
    # ssl_certificate / ssl_certificate_key added by certbot
}

# HTTP -> HTTPS redirect (certbot also manages this)
server {
    listen 80;
    server_name zerubabel.et www.zerubabel.et;
    return 301 https://$host$request_uri;
}
```

After edits: `sudo nginx -t && sudo systemctl reload nginx`.

---

## 5. PM2 ecosystem

`ecosystem.config.js` (deployed alongside the app, run from the standalone dir):

```js
module.exports = {
  apps: [
    {
      name: "zerubabel-et",
      script: "node",
      args: "server.js",          // standalone entry; binds 127.0.0.1:3000 via PORT
      instances: 1,
      exec_mode: "fork",          // NO clustering on 512 MB
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1",
      },
    },
  ],
};
```

> Note: with `output: "standalone"`, the entry is `server.js`. If running via the Next CLI instead, use `script: "node_modules/.bin/next"`, `args: "start -p 3000"`. Bind to `127.0.0.1` so 3000 is never publicly reachable.

Start / reload:
```bash
pm2 start ecosystem.config.js
pm2 reload zerubabel-et
pm2 save
```

---

## 6. Prisma / DB connection

- `DATABASE_URL="postgresql://zerubabel_user:***@localhost:5432/zerubabel?connection_limit=5"`
- `connection_limit=5` keeps Prisma's pool small (Postgres `max_connections=20`).
- Runtime only ever runs `prisma migrate deploy` and `prisma generate` (generate done off-server in CI; ensure client is in artifact).

---

## 7. Deploy checklist

- [ ] Snapshot taken before deploy.
- [ ] Build ran off-server (NOT on Lightsail).
- [ ] Artifact includes standalone + static + public + prisma + client.
- [ ] `prisma migrate deploy` succeeded.
- [ ] `pm2 reload` healthy; `pm2 logs` clean.
- [ ] Uploads dir intact and owned by PM2 user.
- [ ] `nginx -t` passes; SSL valid.
- [ ] 3000 / 5432 not publicly exposed.
