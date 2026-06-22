# 12 — Performance Budget

Performance budget for **zerubabel.et** on a **0.5 GB RAM / 2 vCPU / 20 GB SSD** Lightsail instance. Every decision is shaped by the tiny RAM ceiling.

---

## 1. Server rules

- **One PM2 process** (fork mode, `instances: 1`). No clustering — clustering multiplies RAM use.
- **No Docker** for MVP (container overhead wastes RAM).
- **No heavy background jobs / cron-heavy workloads** competing with the web process.
- **Nginx serves static uploads** directly (`/uploads/`) — Node never touches them.
- **gzip/brotli** enabled in Nginx for text assets.
- **Low PostgreSQL connection count**; app uses `?connection_limit=5`.
- **2 GB swap** present as a safety net — but **never relied on for builds** (builds happen off-server).
- `pm2` `max_memory_restart: "300M"` so a leak restarts the process before the box OOMs.

---

## 2. Next.js rules

- **Server Components by default**; client components only where interactivity is required.
- **Lazy-load the 3D Canvas** via dynamic import, client-only:
  ```ts
  const Canvas3D = dynamic(() => import("@/components/three/Canvas3D"), {
    ssr: false,
    loading: () => <HeroFallback />,
  });
  ```
- **3D only on the homepage.** **No 3D in admin** (admin is plain, fast, low-RAM UI).
- **`next/image` only for static `/public` assets**, never for `/uploads` (those are pre-compressed WebP served by Nginx; use `<img>` or `unoptimized`). Avoids runtime sharp memory spikes. See `10`.
- **Caching/revalidation:** ISR + `revalidateTag` (see `08`) so pages are mostly served from cache, not recomputed.
- `output: "standalone"` build; runtime is lean.

---

## 3. PostgreSQL small-server tuning

`postgresql.conf` (TODO: confirm against final RAM headroom):

| Setting | Value |
|---------|-------|
| `shared_buffers` | `128MB` |
| `effective_cache_size` | `256MB` |
| `work_mem` | `2MB` |
| `maintenance_work_mem` | `32MB` |
| `max_connections` | `20` |

App-side: `DATABASE_URL=...?connection_limit=5` keeps Prisma's pool small so it never exhausts `max_connections`.

---

## 4. Lighthouse / Core Web Vitals targets

| Metric | Target |
|--------|--------|
| Performance (mobile) | >= 85 |
| LCP | < 2.5 s (content, not 3D) |
| CLS | < 0.1 |
| INP | < 200 ms |
| TBT | < 200 ms |
| Accessibility | >= 95 |
| SEO | >= 95 |

Homepage LCP must be a real DOM element (hero text/image), **not** the WebGL canvas.

---

## 5. Asset & scene budgets

| Budget | Target |
|--------|--------|
| Initial JS (homepage, before 3D) | < ~200 KB gzip (TODO: confirm) |
| 3D bundle (deferred, lazy) | not counted in initial; load after content |
| Upload images | WebP, <= 2–5 MB pre-upload, compressed on upload |
| Fonts | preload critical subset only |

### Particle counts scaled by device tier
Detect device capability (memory/cores/DPR/WebGL) and scale the scene:

| Tier | Particles / scene complexity |
|------|------------------------------|
| Low (mobile / weak GPU) | minimal (e.g. ~1–2k particles), reduced postprocessing |
| Mid | moderate |
| High (desktop / strong GPU) | full scene, full postprocessing |

- Respect `prefers-reduced-motion`: drop to static/minimal scene.
- Cap DPR (e.g. `Math.min(devicePixelRatio, 2)`).
- Dispose Three.js resources on unmount to avoid GPU/JS memory leaks.

TODO: lock exact particle counts and JS budget numbers after first 3D prototype.
