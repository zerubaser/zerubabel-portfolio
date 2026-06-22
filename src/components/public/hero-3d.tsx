"use client";

import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import { Canvas3D } from "@/three/Canvas3D";
import { HeroFallback } from "./hero-fallback";
import { useReducedMotion } from "@/three/hooks/useReducedMotion";

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

type Quality = "off" | "low" | "high";

export default function Hero3D() {
  const reduced = useReducedMotion();
  const [quality, setQuality] = useState<Quality | null>(null);
  const [intersecting, setIntersecting] = useState(true);
  const [docVisible, setDocVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  // Decide quality from capabilities once we know the reduced-motion setting.
  useEffect(() => {
    if (reduced || !hasWebGL()) {
      setQuality("off");
      return;
    }
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const lowMem = typeof mem === "number" && mem <= 4;
    const cores = navigator.hardwareConcurrency ?? 8;
    setQuality(mobile || lowMem || cores <= 4 ? "low" : "high");
  }, [reduced]);

  // Pause rendering when the canvas scrolls offscreen or the tab is hidden.
  useEffect(() => {
    if (quality !== "low" && quality !== "high") return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(el);
    const onVis = () => setDocVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [quality]);

  if (quality === null || quality === "off") {
    return <HeroFallback />;
  }

  return (
    <div ref={ref} className="h-full w-full">
      <CanvasErrorBoundary fallback={<HeroFallback />}>
        <Canvas3D quality={quality} paused={!intersecting || !docVisible} />
      </CanvasErrorBoundary>
    </div>
  );
}
