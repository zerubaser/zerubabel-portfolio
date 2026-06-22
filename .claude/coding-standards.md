# Coding Standards — zerubabel.et

TypeScript + Next.js App Router conventions. Keep code consistent with surrounding files. When in doubt, defer to `PLAN.md` and `docs/`.

## File & Folder Naming

- **Folders**: `kebab-case` (e.g. `src/app/case-studies`, `src/three/hero-scene`).
- **React components**: `PascalCase.tsx` (e.g. `ProjectCard.tsx`).
- **Hooks**: `useThing.ts` (camelCase, `use` prefix).
- **Server actions / repositories / utils**: `camelCase.ts`.
- **Route segments**: lowercase App Router conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`).
- **Zod validators**: `src/lib/validators/<domain>.ts`.

## Server vs Client Components

- **Default to Server Components.** Add `"use client"` **only when needed**.
- Client is required for: **3D** (R3F/Three.js), **admin interactivity**, anything using browser APIs, state hooks, event handlers, Framer Motion / GSAP interaction.
- Keep client components small and at the leaves; fetch data and compose in Server Components.
- Never import `src/server/*` (actions/repositories/Prisma) into a client component — call Server Actions instead.

## Layering

- **Server Actions** → `src/server/actions`. Entry points for mutations; validate input with Zod, then call a repository.
- **Repositories** → `src/server/repositories`. The only place that talks to Prisma. No business validation here beyond DB concerns.
- **Validators** → `src/lib/validators`. Zod schemas; share types via `z.infer`.
- **Prisma singleton** → `src/lib/prisma.ts`. Reuse one client (guard against hot-reload duplication in dev). Never instantiate `new PrismaClient()` elsewhere.
- **3D** → `src/three`. Self-contained scenes/components/hooks; lazy-loaded via `next/dynamic` with `ssr: false` and a 2D fallback.

## Prisma Reminder

- **NO `@db.LongText` and NO `@db.Text`.** In PostgreSQL, plain `String` / `String?` is already unlimited text.
- Keep migrations small and reviewed. Never edit applied migrations.

## Styling — Tailwind + shadcn/ui

- Tailwind utility-first; extract repeated patterns into components, not `@apply` soup.
- Use **shadcn/ui** primitives; customize via the generated component files, not by forking the library.
- Respect tokens/theme; avoid arbitrary one-off values when a token exists.
- Honor `prefers-reduced-motion` for all animation (Framer Motion / GSAP / 3D).

## Import Ordering

1. React / Next.
2. Third-party packages.
3. Absolute internal aliases (`@/components`, `@/lib`, `@/server`, `@/three`).
4. Relative imports.
5. Types (`import type`) grouped with their source or last.
6. Side-effect/style imports last.

## Error Handling

- Server Actions: validate with Zod, return typed `{ ok, data }` / `{ ok: false, error }` shapes; never throw raw to the client.
- Never leak stack traces, SQL, or secrets to the client.
- Wrap DB/IO in try/catch at the repository or action boundary; log server-side.

## UI States

- Every data view must handle **loading**, **empty**, and **error** states explicitly.
- Use App Router `loading.tsx` / `error.tsx` for route-level states; inline states for partial UI.

## Accessibility Basics

- Semantic HTML and correct heading order.
- Keyboard-navigable interactive elements; visible focus states.
- `alt` text on images; ARIA only when semantics are insufficient.
- **SEO-critical content as real DOM**, never only inside `<canvas>`.

## Comments

- Match the comment density of surrounding code. Explain **why**, not **what**.
- No commented-out dead code in commits.
