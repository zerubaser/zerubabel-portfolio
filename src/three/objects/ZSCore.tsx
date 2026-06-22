"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Central glowing "system core" — emissive icosahedron with a wireframe shell. */
export function ZSCore({ paused = false }: { paused?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (paused) return;
    if (group.current) group.current.rotation.y += delta * 0.3;
    if (inner.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.04;
      inner.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={group}>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#38bdf8" emissiveIntensity={1.3} metalness={0.4} roughness={0.2} />
      </mesh>
      <mesh scale={1.28}>
        <icosahedronGeometry args={[0.9, 0]} />
        <meshBasicMaterial color="#7dd3fc" wireframe transparent opacity={0.25} />
      </mesh>
    </group>
  );
}
