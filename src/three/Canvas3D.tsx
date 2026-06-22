"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { HeroScene } from "./scenes/HeroScene";

/**
 * R3F Canvas for the hero. DPR is capped (adaptive by quality), the frame loop
 * pauses when offscreen/hidden, and Bloom postprocessing runs only on the
 * high-quality (desktop, full-motion) path.
 */
export function Canvas3D({ quality, paused }: { quality: "low" | "high"; paused: boolean }) {
  return (
    <Canvas
      dpr={quality === "high" ? [1, 1.5] : [1, 1]}
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ antialias: quality === "high", powerPreference: "high-performance", alpha: true }}
      frameloop={paused ? "never" : "always"}
      style={{ width: "100%", height: "100%" }}
    >
      <HeroScene quality={quality} paused={paused} />
      {quality === "high" ? (
        <EffectComposer>
          <Bloom intensity={0.85} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      ) : (
        <></>
      )}
    </Canvas>
  );
}
