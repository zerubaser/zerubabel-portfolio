# 07 — Animation Spec

## Tools & Responsibilities
| Tool | Responsibility |
|------|----------------|
| **GSAP + ScrollTrigger** | Scroll-driven choreography: camera movement, pinned sections, timeline scrubbing. |
| **Framer Motion** | DOM reveal animations and UI micro-interactions (fades, slides, stagger). |
| **R3F `useFrame`** | Per-frame 3D object motion (floating, particle drift, API line flow). |
| **Lenis (optional)** | Smooth scroll so scroll-bound 3D feels premium. |

Keep boundaries clean: GSAP drives scroll + 3D camera; Framer Motion drives DOM; `useFrame` drives continuous in-scene motion.

## Scroll Choreography (per homepage section)
1. **Hero** — ScrollTrigger ties scroll progress to camera dolly/orbit; objects assemble after loader. As the user scrolls out, the command center recedes.
2. **About** — Framer Motion reveal (text stagger, image fade-in) on enter.
3. **Featured Projects** — cards stagger in; optional 3D camera nudge toward "project universe" feel.
4. **Services** — list items reveal in sequence on scroll.
5. **Skills Preview** — bars/badges animate in (level-driven width/opacity).
6. **Experience Preview** — timeline entries reveal sequentially; line draws in.
7. **Impact Metrics** — numbers **count up** when in view (once).
8. **Testimonials Preview** — fade/slide carousel reveal.
9. **Contact CTA** — final reveal; terminal interface primes.

## Hover / Click Interactions
- **Project cards**: hover lift + glow; click → navigate to detail (later: zoom into 3D node).
- **3D objects**: pointer parallax; hover highlights an object (e.g. laptop glows), tooltip/HUD label.
- **Buttons / links**: Framer Motion hover/press micro-states.
- **Nav**: subtle underline/glow transitions.

## Terminal-Typewriter Contact
- Contact section styled as a terminal.
- **Typewriter** effect types prompts/labels (e.g. `> initializing contact channel...`).
- Form inputs appear as terminal lines; submit shows a typed confirmation response.
- On reduced motion, render the final text immediately (no typing).

## Rules
1. **Don't animate everything** — purposeful motion only; avoid clutter and motion fatigue.
2. **Keep 3D smooth** — prioritize frame rate; throttle/skip non-essential animation under load.
3. **Mobile fallback** — simpler reveals, lighter/disabled 3D motion on small/low-power devices.
4. **`prefers-reduced-motion`** — honor it everywhere: disable scroll-jacking, typing, parallax, and heavy reveals; show calm static states.
5. **Lazy-load heavy sections** — defer 3D and animation-heavy components until near viewport / after first paint.
6. **One source of scroll truth** — if Lenis is used, integrate it with ScrollTrigger to avoid conflicting scroll handlers.
7. **Run-once where appropriate** — count-ups and intro reveals fire once, not on every scroll pass.

## Open Items (TODO)
- TODO: Decide whether Lenis ships in MVP.
- TODO: Define exact timing/easing tokens (durations, easings) as a shared config.
