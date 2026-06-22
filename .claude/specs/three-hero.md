# 3D Hero — zerubabel.et (condensed)

> Cross-reference: `docs/three-hero.md` (full version).

## Concept
A single, polished **"System Universe / 3D Digital Command Center"** hero on the
homepage: a stylized floating workstation that visualizes Zerubabel's full-stack
craft — devices, data, APIs, and dashboards orbiting a glowing personal mark, set
against a particle field, with a subtle Addis Ababa HUD. It is the one signature
3D moment in the MVP; everything else is 2D.

## MVP hero objects
- **Glowing ZS logo** — central emissive mark / brand anchor.
- **Floating laptop** — primary device, screen showing UI.
- **Mobile phone** — secondary device, responsive story.
- **Database cylinder** — represents Postgres / persistence.
- **API lines** — animated connections between objects (data flow).
- **Dashboard panels** — floating UI/glass panels around the scene.
- **Particles** — ambient particle field for depth and motion.
- **Addis Ababa HUD** — subtle location/coordinates overlay element.

## Particle-name loader
Loading state animates particles that converge to spell the name / brand mark
before the scene resolves; doubles as the asset/scene preloader.

## Real Three.js concepts used
- Scene graph, `PerspectiveCamera`, lighting (ambient + point/spot), emissive materials.
- `InstancedMesh` for particles; `BufferGeometry`/`BufferAttribute` for the field.
- Custom GLSL shaders (`ShaderMaterial`) for glow, particle motion, and the loader.
- Postprocessing bloom (selective) for emissive glow.
- `Float`, orbit/parallax-on-pointer motion; GSAP/Framer for entrance timeline.

## Performance rules (mandatory)
- **Lazy-load** the whole 3D bundle; dynamic import with **`ssr: false`** (Rule 7).
- **No 3D in admin** — never import the Canvas into any `/admin` route.
- **Mobile fallback** — static image/2D hero on small or low-power devices.
- **Reduced-motion** — respect `prefers-reduced-motion`: freeze/disable animation, show fallback.
- **Adaptive DPR** — clamp device pixel ratio; use drei `AdaptiveDpr`/`PerformanceMonitor`.
- **Instancing** for particles; dispose geometries/materials on unmount (no leaks).
- Keep draw calls low; pause `requestAnimationFrame` when the Canvas is off-screen.

## Component structure
- **Single `<Canvas>`** for the whole hero (one R3F root).
- `scenes/` — scene composition / camera / lighting / postprocessing.
- `objects/` — `ZSLogo`, `Laptop`, `Phone`, `DatabaseCylinder`, `ApiLines`, `DashboardPanel`, `Particles`, `AddisHud`.
- `shaders/` — GLSL for glow / particles / loader.
- `hooks/` — `useReducedMotion`, `useIsMobile`, pointer-parallax, adaptive-quality.
- `store/` — small Zustand (or equivalent) store for hero/loader state.
- Entry component dynamically imported `ssr:false` with a 2D fallback. (Confirm final folder paths in implementation — TODO.)
