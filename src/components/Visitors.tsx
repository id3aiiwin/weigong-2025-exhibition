"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { zones } from "@/data/exhibitions";
import { ZONE_DEPTH } from "./ExhibitionHall";

interface WalkerCfg {
  x: number;
  z0: number;
  z1: number;
  speed: number;
  phase: number;
  body: string;
  height: number;
}

function Walker({ cfg }: { cfg: WalkerCfg }) {
  const group = useRef<THREE.Group>(null);
  const lLeg = useRef<THREE.Group>(null);
  const rLeg = useRef<THREE.Group>(null);
  const lArm = useRef<THREE.Group>(null);
  const rArm = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * cfg.speed + cfg.phase;
    // 等速三角波位置
    const tri = (2 / Math.PI) * Math.asin(Math.sin(t));
    const mid = (cfg.z0 + cfg.z1) / 2;
    const half = (cfg.z1 - cfg.z0) / 2;
    const z = mid + half * tri;
    const forward = Math.cos(t) >= 0; // 速度方向
    const facePlus = half >= 0 ? forward : !forward;

    if (group.current) {
      group.current.position.set(cfg.x, Math.abs(Math.sin(t * 7)) * 0.04, z);
      group.current.rotation.y = facePlus ? 0 : Math.PI;
    }
    const swing = Math.sin(t * 7) * 0.5;
    if (lLeg.current) lLeg.current.rotation.x = swing;
    if (rLeg.current) rLeg.current.rotation.x = -swing;
    if (lArm.current) lArm.current.rotation.x = -swing * 0.7;
    if (rArm.current) rArm.current.rotation.x = swing * 0.7;
  });

  const s = cfg.height;
  return (
    <group ref={group}>
      {/* 軀幹 */}
      <mesh position={[0, 1.0 * s, 0]} castShadow>
        <capsuleGeometry args={[0.17, 0.5 * s, 4, 8]} />
        <meshStandardMaterial color={cfg.body} roughness={0.7} />
      </mesh>
      {/* 頭 */}
      <mesh position={[0, 1.5 * s, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#e9c9a4" roughness={0.6} />
      </mesh>
      {/* 頭髮 */}
      <mesh position={[0, 1.56 * s, -0.01]}>
        <sphereGeometry args={[0.155, 16, 12, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
        <meshStandardMaterial color="#2a2420" roughness={0.8} />
      </mesh>
      {/* 腿（髖部樞紐擺動） */}
      <group ref={lLeg} position={[-0.08, 0.62 * s, 0]}>
        <mesh position={[0, -0.3 * s, 0]}>
          <cylinderGeometry args={[0.06, 0.05, 0.62 * s, 8]} />
          <meshStandardMaterial color="#1f2c44" roughness={0.8} />
        </mesh>
      </group>
      <group ref={rLeg} position={[0.08, 0.62 * s, 0]}>
        <mesh position={[0, -0.3 * s, 0]}>
          <cylinderGeometry args={[0.06, 0.05, 0.62 * s, 8]} />
          <meshStandardMaterial color="#1f2c44" roughness={0.8} />
        </mesh>
      </group>
      {/* 手臂 */}
      <group ref={lArm} position={[-0.22, 1.18 * s, 0]}>
        <mesh position={[0, -0.22 * s, 0]}>
          <cylinderGeometry args={[0.045, 0.04, 0.5 * s, 8]} />
          <meshStandardMaterial color={cfg.body} roughness={0.7} />
        </mesh>
      </group>
      <group ref={rArm} position={[0.22, 1.18 * s, 0]}>
        <mesh position={[0, -0.22 * s, 0]}>
          <cylinderGeometry args={[0.045, 0.04, 0.5 * s, 8]} />
          <meshStandardMaterial color={cfg.body} roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

export default function Visitors() {
  const palette = ["#2c3e63", "#3a4a5c", "#5a4a52", "#43566b", "#4a4a55", "#365066"];
  const walkers: WalkerCfg[] = [];
  zones.forEach((zone, zi) => {
    const cz = zone.positionZ - ZONE_DEPTH / 2;
    walkers.push({
      x: -2.9, z0: cz - 5.5, z1: cz + 5.5,
      speed: 0.5 + zi * 0.04, phase: zi * 1.7,
      body: palette[(zi * 2) % palette.length], height: 1.0,
    });
    walkers.push({
      x: 2.9, z0: cz + 5, z1: cz - 5,
      speed: 0.44 + zi * 0.05, phase: zi * 2.3 + 0.9,
      body: palette[(zi * 2 + 1) % palette.length], height: 0.94,
    });
  });

  return (
    <group>
      {walkers.map((cfg, i) => (
        <Walker key={i} cfg={cfg} />
      ))}
    </group>
  );
}
