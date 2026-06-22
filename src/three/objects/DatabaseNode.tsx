"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Vec3 = [number, number, number];

/** Stacked-cylinder database node, gently rotating + bobbing. */
export function DatabaseNode({ position, paused = false }: { position: Vec3; paused?: boolean }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (paused || !ref.current) return;
    ref.current.rotation.y += delta * 0.3;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
  });

  return (
    <group ref={ref} position={position}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, i * 0.28 - 0.28, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.22, 24]} />
          <meshStandardMaterial color="#1e293b" emissive="#fb923c" emissiveIntensity={0.3} metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}
