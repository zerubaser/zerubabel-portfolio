# 06 — Three.js / R3F Spec

## Concept
**"3D Digital Command Center / System Universe."**
The 3D layer presents Zerubabel as someone who architects and operates real systems. The homepage hero is a glowing command center; advanced scenes turn the portfolio's content (projects, skills, experience) into an explorable universe.

> Reminder: **R3F is real Three.js.** Components map directly to `THREE.*` objects; everything below is standard Three.js expressed declaratively.

## MVP 3D — One Polished Hero Scene
Ship **exactly one** high-quality hero scene first. Objects in the scene:
- **Glowing ZS logo** — emissive/extruded geometry as the focal point.
- **Floating laptop** — represents web/full-stack work.
- **Mobile phone** — represents Flutter mobile work.
- **Database cylinder** — represents backend/data (cylinder geometry, glowing).
- **API connection lines** — animated lines/curves linking objects (data flow).
- **Dashboard panels** — floating HUD planes showing system widgets.
- **Particles** — ambient particle field for depth and "energy."
- **Subtle Ethiopia / Addis Ababa HUD detail** — a small locational accent (coordinates/skyline/flag tint), tasteful, not loud.

### Loader
- Branded loader where **particles assemble into "Zerubabel Shimeles"**, then disperse/settle as the scene reveals.
- Loader gates asset loading (`useProgress` from drei); main content remains accessible/SSR'd underneath.

## Advanced 3D (Phase 2+)
- **Project Universe** — each project is a node/planet, grouped/colored by category; click to open the case study.
- **Skills Galaxy** — skill groups as clusters with skills orbiting them.
- **3D Experience Timeline** — camera travels along a path through experience milestones.
- **Terminal Contact** — 3D/terminal-styled contact interface.
- **Animated Impact Metrics** — numbers count up / visualized in 3D.

## Three.js Concepts Mapped to This Build
| Concept | Used for |
|---------|----------|
| **Scene** | Root graph holding hero objects + particles. |
| **Camera** | Perspective camera; scroll/parallax-driven movement. |
| **Mesh** | Logo, laptop, phone, DB cylinder, panels. |
| **Geometry** | Extruded logo, box (laptop/phone), cylinder (DB), planes (panels), buffer geometry (particles/lines). |
| **Materials** | Standard/physical + **emissive** materials for glow; shader materials for particles/lines. |
| **Lights** | Ambient + point/spot; emissive + bloom create the glow. |
| **Shaders** | Custom GLSL for particle field, API energy lines, HUD shimmer. |
| **Postprocessing** | Bloom (core look), vignette; limited on low-end. |
| **Controls** | Constrained orbit / parallax bound to pointer + scroll. |
| **Animation loop** | `useFrame` for floating motion, line flow, particle drift. |
| **Performance** | DPR clamp, instancing, dispose, draw-call budget. |

## Performance Rules
1. **Lazy-load 3D** — never block first paint or SSR content.
2. **Dynamic import with `ssr: false`** for the Canvas component.
3. **No 3D in admin** at all.
4. **Mobile fallback** — lighter scene or static image/poster on small/low-power devices.
5. **`prefers-reduced-motion`** — disable heavy motion; show a calm/static variant.
6. **Adaptive DPR** — clamp pixel ratio (e.g. `[1, 1.5]`), drei `AdaptiveDpr`.
7. **Instancing** — instance particles and repeated meshes.
8. **Compressed assets later** — use Draco/KTX2/compressed textures when models are added.
9. **Limit postprocessing on low-end** — reduce/disable bloom passes when FPS or device tier is low.

## Scene / Component Structure
A **single shared `<Canvas>`** mounts the active scene; structure under the 3D module:

```
src/three/
  Canvas.tsx          # single shared R3F Canvas (dynamic, ssr:false)
  scenes/             # HeroScene, ProjectUniverse, SkillsGalaxy, ExperienceTimeline
  objects/            # ZSLogo, Laptop, Phone, DatabaseCylinder, ApiLines, DashboardPanel, Particles, AddisHud
  shaders/            # GLSL: particles, energyLines, hud
  hooks/              # useScrollCamera, useDeviceTier, useReducedMotion
  store/              # zustand store for 3D state (active scene, progress, quality tier)
```

- One Canvas, swap scenes — avoids multiple WebGL contexts.
- `store/` (lightweight, e.g. zustand) coordinates scroll state, loader progress, and quality tier.
- Objects are pure presentational R3F components; scenes compose them; hooks drive motion/quality.

## Open Items (TODO)
- TODO: Source/commission the 3D model assets (laptop, phone) or build from primitives.
- TODO: Decide device-tier detection method (GPU heuristic vs simple width/UA).
- TODO: Confirm exact Addis Ababa HUD treatment.
