# 0006 — Use React Three Fiber on Top of Three.js

## Status

Accepted

## Context

zerubabel.et is a 3D-forward portfolio whose centerpiece is an interactive 3D scene ("System Universe"). The 3D work must integrate cleanly with a React/Next.js application (state, props, component composition, lifecycle) while still giving full access to real Three.js capabilities.

The choice is **how** to use Three.js in React, not whether to use it. The two approaches are raw/imperative Three.js (manual scene graph, manual React integration) versus **React Three Fiber (R3F)**, a React renderer for Three.js.

## Decision

Use **React Three Fiber (R3F)** as the 3D layer, with **drei** (helpers) and **postprocessing** for effects.

R3F is accepted explicitly because **it IS Three.js** — it is a React renderer that builds and drives a real Three.js scene graph declaratively. Choosing R3F does **not** abandon Three.js; the project still uses, and the team must still understand, genuine Three.js concepts:

- **Scene, Camera, Mesh, Geometry, Materials, Lights**
- **Shaders** (GLSL / custom materials)
- **Postprocessing** (effect composer / passes)
- **Controls** (orbit/camera controls)
- The **animation loop** (per-frame updates, e.g. `useFrame`)
- **Performance** (draw calls, instancing, disposal, frame budget)

R3F changes the authoring style (declarative JSX components instead of imperative construction), not the underlying engine or concepts.

## Consequences

### Positive

- Declarative, component-based 3D that composes naturally with React state, props, and the Next.js component tree.
- Far less boilerplate than wiring Three.js objects into React lifecycles by hand.
- `drei` provides ready-made helpers (controls, loaders, abstractions); `postprocessing` integrates cleanly for effects.
- Full Three.js power remains available — no capability is lost.

### Negative / Risks

- Still **client-only**: R3F/Three.js must be lazy-loaded and kept out of SSR (see ADR 0001), and contributes to the heavy build profile (see ADR 0005).
- A real understanding of Three.js is still required — R3F is not a shortcut around 3D fundamentals; performance and correctness still depend on Three.js knowledge (disposal, draw calls, frame budget).
- Adds the R3F/drei/postprocessing dependency surface on top of Three.js.

## Alternatives Considered

- **Raw/imperative Three.js** — rejected: significantly more boilerplate to manage the scene graph and integrate it with React lifecycles, with no offsetting benefit for this project. R3F gives the same engine with a React-native authoring model.
- **A higher-level 3D/no-code engine** — rejected: less control over custom shaders, postprocessing, and performance tuning required for a bespoke premium portfolio.
