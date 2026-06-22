"use client";

import dynamic from "next/dynamic";
import { HeroFallback } from "./hero-fallback";

// Lazy, client-only. Three.js + drei + postprocessing land in this dynamic
// chunk, loaded only on the homepage (never SSR'd, never on admin/other pages).
const Hero3D = dynamic(() => import("./hero-3d"), {
  ssr: false,
  loading: () => <HeroFallback />,
});

export function Hero3DLazy() {
  return <Hero3D />;
}
