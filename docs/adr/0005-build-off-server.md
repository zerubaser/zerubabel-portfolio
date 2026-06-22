# 0005 — Build Off-Server (Never Build on the 512 MB VPS)

## Status

Accepted

## Context

The production server is an AWS Lightsail box with **0.5 GB (512 MB) RAM** (see ADR 0003). A Next.js production build (`next build`) is memory-hungry, and this project's build is heavier than average because it bundles **React Three Fiber / Three.js** and related 3D libraries. In practice this build **peaks around 1–1.5 GB of RAM**.

Running that build on a 512 MB server (even with swap) would trigger the OOM killer or cause severe swap thrashing, making on-server builds unreliable and slow. The server should be treated as **runtime-only**, not a build machine.

## Decision

The production build runs **off-server** — **locally** on a developer machine or in **GitHub Actions** — **never on the 512 MB server**.

- Configure Next.js with **`output: "standalone"`** so the build produces a self-contained artifact (minimal server + traced dependencies) that runs without a full `node_modules`/build toolchain on the server.
- The server's only deploy responsibilities are runtime steps:
  1. **Receive the build artifact** (transfer the standalone output).
  2. **`prisma migrate deploy`** — apply pending migrations.
  3. **`pm2 reload`** — restart/reload the running process with zero/low downtime.

The server never runs `next build`, `npm install` of dev/build dependencies, or any memory-intensive compilation.

## Consequences

### Positive

- The 512 MB server stays within its RAM budget; no build-time OOM or thrash.
- Faster, more reliable deploys; build failures surface off-server (in CI/local) before anything touches production.
- `output: "standalone"` keeps the deployed footprint small and the runtime lean.
- Clear, minimal deploy contract: artifact → migrate → reload.

### Negative / Risks

- Requires a build/deploy pipeline (local script or GitHub Actions) rather than a simple "git pull && build" on the server.
- The build environment must match the server's Node/runtime version to avoid drift; CI must pin versions.
- Artifact transfer adds a step (and must include everything `standalone` needs — e.g. `public/` and static assets — which are not always auto-copied).

## Alternatives Considered

- **Build on the server** — rejected: ~1–1.5 GB peak build vs 512 MB RAM means OOM/thrash; unreliable.
- **Upgrade the server just to build** — rejected: wasteful to pay for build-sized RAM at runtime; off-server build keeps the runtime box tiny and cheap (the 1 GB upgrade in ADR 0003 is for runtime pressure, not builds).
