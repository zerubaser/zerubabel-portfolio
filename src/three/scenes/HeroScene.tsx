"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ZSCore } from "../objects/ZSCore";
import { ApiLines } from "../objects/ApiLines";
import { SystemNode } from "../objects/SystemNode";
import { DashboardPanel } from "../objects/DashboardPanel";
import { DatabaseNode } from "../objects/DatabaseNode";
import { Particles } from "../objects/Particles";

type Vec3 = [number, number, number];

// Satellite systems orbiting the core (ERP / API / LMS / Clinic / Mobile / WP).
const NODES: { position: Vec3; color: string }[] = [
  { position: [2.3, 0.6, 0.3], color: "#38bdf8" },
  { position: [-2.4, 0.2, 0.4], color: "#fb923c" },
  { position: [1.7, -1.1, -0.6], color: "#a78bfa" },
  { position: [-1.8, -0.9, 0.5], color: "#34d399" },
  { position: [0.3, 1.7, -0.4], color: "#f472b6" },
  { position: [-0.6, -1.8, -0.2], color: "#60a5fa" },
];

export function HeroScene({ quality, paused }: { quality: "low" | "high"; paused: boolean }) {
  const group = useRef<THREE.Group>(null);

  // Gentle mouse parallax (eased toward pointer position).
  useFrame((state) => {
    if (paused || !group.current) return;
    const targetY = state.pointer.x * 0.25;
    const targetX = -state.pointer.y * 0.2;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.05);
  });

  const particleCount = quality === "high" ? 600 : 220;

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.4} color="#bae6fd" />
      <pointLight position={[-4, -2, -3]} intensity={28} color="#fb923c" distance={16} />
      <pointLight position={[0, 0, 0]} intensity={18} color="#38bdf8" distance={9} />

      <group ref={group}>
        <ZSCore paused={paused} />
        <ApiLines targets={NODES.map((n) => n.position)} paused={paused} />
        {NODES.map((n, i) => (
          <SystemNode key={i} position={n.position} color={n.color} phase={i} paused={paused} />
        ))}
        <DashboardPanel position={[2.7, -0.5, -1]} rotation={[0, -0.5, 0]} size={[1.7, 1.05, 0.06]} accent="#38bdf8" phase={0} paused={paused} />
        <DashboardPanel position={[-2.8, 0.9, -1.2]} rotation={[0, 0.6, 0]} size={[0.58, 1.1, 0.06]} accent="#fb923c" phase={1.4} paused={paused} />
        <DatabaseNode position={[0, -2, -0.4]} paused={paused} />
        <Particles count={particleCount} paused={paused} />
      </group>
    </>
  );
}
