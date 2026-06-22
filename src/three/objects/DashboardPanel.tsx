"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Vec3 = [number, number, number];

/**
 * A floating screen panel — used both as a wide dashboard/laptop and a tall
 * phone (driven by `size`). The emissive front face + bars suggest a UI.
 */
export function DashboardPanel({
  position,
  rotation = [0, 0, 0],
  size = [1.7, 1.05, 0.06],
  accent = "#38bdf8",
  phase = 0,
  paused = false,
}: {
  position: Vec3;
  rotation?: Vec3;
  size?: Vec3;
  accent?: string;
  phase?: number;
  paused?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const [w, h, d] = size;

  useFrame((state) => {
    if (paused || !ref.current) return;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6 + phase) * 0.1;
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#0b1220" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* glowing screen */}
      <mesh position={[0, 0, d / 2 + 0.001]}>
        <planeGeometry args={[w * 0.9, h * 0.86]} />
        <meshStandardMaterial color="#0b1220" emissive={accent} emissiveIntensity={0.45} />
      </mesh>
      {/* dashboard bars */}
      {[0.62, 0.4, 0.18].map((y, i) => (
        <mesh key={i} position={[(-w * 0.18), (y - 0.4) * h * 0.5, d / 2 + 0.002]}>
          <planeGeometry args={[w * (0.3 + i * 0.12), h * 0.06]} />
          <meshBasicMaterial color={accent} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}
