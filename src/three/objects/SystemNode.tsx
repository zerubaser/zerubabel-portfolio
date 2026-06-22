"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** A small glowing satellite node (ERP / LMS / Clinic / Mobile / API / WordPress). */
export function SystemNode({
  position,
  color,
  phase = 0,
  paused = false,
}: {
  position: [number, number, number];
  color: string;
  phase?: number;
  paused?: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (paused || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.8 + phase) * 0.15;
    ref.current.rotation.x = t * 0.4;
    ref.current.rotation.y = t * 0.3;
  });

  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.28, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.85} metalness={0.3} roughness={0.3} />
    </mesh>
  );
}
