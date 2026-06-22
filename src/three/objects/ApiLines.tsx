"use client";

import { useRef } from "react";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Vec3 = [number, number, number];

/** A data "pulse" travelling from the core out to a node along an API line. */
function Pulse({ target, speed, color, paused }: { target: Vec3; speed: number; color: string; paused: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (paused || !ref.current) return;
    const t = (state.clock.elapsedTime * speed) % 1;
    ref.current.position.set(target[0] * t, target[1] * t, target[2] * t);
    ref.current.scale.setScalar(0.6 + Math.sin(t * Math.PI) * 0.8);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

/** Glowing connection lines from the core to each system node, with data pulses. */
export function ApiLines({ targets, paused = false }: { targets: Vec3[]; paused?: boolean }) {
  return (
    <>
      {targets.map((t, i) => (
        <group key={i}>
          <Line points={[[0, 0, 0], t]} color="#38bdf8" lineWidth={1} transparent opacity={0.3} dashed dashScale={3} />
          <Pulse target={t} speed={0.25 + (i % 3) * 0.08} color={i % 2 === 0 ? "#fb923c" : "#7dd3fc"} paused={paused} />
        </group>
      ))}
    </>
  );
}
