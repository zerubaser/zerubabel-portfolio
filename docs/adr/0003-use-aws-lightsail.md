# 0003 — Use AWS Lightsail Ubuntu VPS for Hosting

## Status

Accepted

## Context

zerubabel.et is a single-owner portfolio with a small, predictable workload. It needs a host that is cheap, predictable in cost, and gives full control over the runtime (Node process, Nginx, PostgreSQL, local uploads, TLS). Managed platforms like Vercel are convenient but introduce per-feature pricing, cold-start and function-runtime constraints, and less control over the OS, file system (for local uploads), and background processes.

A fixed-price VPS is a better fit for a hobby/portfolio budget and the self-hosted stack (Nginx + PM2 + Let's Encrypt + local media + self-hosted PostgreSQL).

## Decision

Host on an **AWS Lightsail Ubuntu VPS**:

- ~**$5/month** fixed price.
- **0.5 GB RAM**, **2 vCPU**, **20 GB SSD**, **1 TB transfer**.
- Runs Nginx (reverse proxy + static/media serving), PM2 (Node process manager), Let's Encrypt (TLS), and PostgreSQL, with local uploads on disk.

## Consequences

### Positive

- Flat, predictable monthly cost.
- Full root control: OS, Nginx config, file system for local uploads, cron, background processes.
- A single box hosts app + DB + media + TLS — simple operational model.
- Generous 1 TB transfer for a portfolio's traffic.

### Negative / Risks

- **Very low RAM (0.5 GB)** is the binding constraint. The Node app, Nginx, and PostgreSQL must all fit; everything must be tuned conservatively.
- A **swap file is required** (see ops setup; ~2 GB swap) to absorb memory spikes and avoid the OOM killer.
- **Builds must not run on this server** — `next build` with R3F/Three.js peaks well above available RAM and would OOM or thrash. The build runs off-server and only the artifact is deployed (see ADR 0005).
- Single point of failure: one box. Backups (DB + uploads) are essential.
- Self-managed patching, security, and TLS renewal are the owner's responsibility.

### Upgrade Path

If memory pressure becomes a problem at runtime, **upgrade to the 1 GB Lightsail plan** (vertical scale, minimal migration). The architecture (off-server build, standalone output, swap) is chosen so this upgrade is optional, not required.

## Alternatives Considered

- **Vercel / managed Next.js hosting** — rejected: per-feature/usage pricing, serverless runtime constraints, and no persistent local file system for the planned local-uploads media strategy.
- **Larger cloud VPS / EC2** — rejected for MVP: more expensive and unnecessary for current traffic; Lightsail's flat pricing is simpler.
