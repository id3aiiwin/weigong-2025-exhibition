"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { zones } from "@/data/exhibitions";
import { ZONE_DEPTH } from "./ExhibitionHall";

interface Cfg {
  x: number;
  z0: number;
  z1: number;
  speed: number; // 0 = 站立觀展
  phase: number;
  color: string;
  height: number;
  faceY?: number; // 站立時面向
}

function Figure({ cfg }: { cfg: Cfg }) {
  const group = useRef<THREE.Group>(null);
  const lLeg = useRef<THREE.Group>(null);
  const rLeg = useRef<THREE.Group>(null);
  const lArm = useRef<THREE.Group>(null);
  const rArm = useRef<THREE.Group>(null);
  const walking = cfg.speed > 0.01;

  useFrame((state) => {
    const t = state.clock.elapsedTime * (walking ? cfg.speed : 0.6) + cfg.phase;
    if (group.current) {
      if (walking) {
        const tri = (2 / Math.PI) * Math.asin(Math.sin(t));
        const mid = (cfg.z0 + cfg.z1) / 2;
        const half = (cfg.z1 - cfg.z0) / 2;
        group.current.position.z = mid + half * tri;
        group.current.position.x = cfg.x;
        group.current.position.y = Math.abs(Math.sin(t * 6)) * 0.025;
        const facePlus = (half >= 0 ? Math.cos(t) : -Math.cos(t)) >= 0;
        group.current.rotation.y = facePlus ? 0 : Math.PI;
      } else {
        // 站立：輕微重心搖擺
        group.current.position.set(cfg.x, 0, cfg.z0);
        group.current.rotation.y = (cfg.faceY ?? 0) + Math.sin(t * 0.6) * 0.05;
      }
    }
    const sw = walking ? Math.sin(t * 6) * 0.32 : Math.sin(t) * 0.04;
    if (lLeg.current) lLeg.current.rotation.x = walking ? sw : 0;
    if (rLeg.current) rLeg.current.rotation.x = walking ? -sw : 0;
    if (lArm.current) lArm.current.rotation.x = -sw * 0.8;
    if (rArm.current) rArm.current.rotation.x = sw * 0.8;
  });

  const s = cfg.height;
  const mat = (
    <meshStandardMaterial color={cfg.color} roughness={0.85} metalness={0.05} />
  );
  return (
    <group ref={group}>
      {/* 軀幹 */}
      <mesh position={[0, 1.02 * s, 0]}>
        <capsuleGeometry args={[0.16, 0.52 * s, 6, 12]} />
        {mat}
      </mesh>
      {/* 頸 + 頭（同色剪影） */}
      <mesh position={[0, 1.46 * s, 0]}>
        <sphereGeometry args={[0.135, 18, 18]} />
        {mat}
      </mesh>
      {/* 腿 */}
      <group ref={lLeg} position={[-0.075, 0.6 * s, 0]}>
        <mesh position={[0, -0.3 * s, 0]}>
          <capsuleGeometry args={[0.058, 0.5 * s, 4, 8]} />
          {mat}
        </mesh>
      </group>
      <group ref={rLeg} position={[0.075, 0.6 * s, 0]}>
        <mesh position={[0, -0.3 * s, 0]}>
          <capsuleGeometry args={[0.058, 0.5 * s, 4, 8]} />
          {mat}
        </mesh>
      </group>
      {/* 手臂 */}
      <group ref={lArm} position={[-0.2, 1.2 * s, 0]}>
        <mesh position={[0, -0.2 * s, 0]}>
          <capsuleGeometry args={[0.045, 0.42 * s, 4, 8]} />
          {mat}
        </mesh>
      </group>
      <group ref={rArm} position={[0.2, 1.2 * s, 0]}>
        <mesh position={[0, -0.2 * s, 0]}>
          <capsuleGeometry args={[0.045, 0.42 * s, 4, 8]} />
          {mat}
        </mesh>
      </group>
    </group>
  );
}

export default function Visitors() {
  const tones = ["#3b3a3c", "#4a4038", "#2f3742", "#5a4a48", "#403c44", "#37423f"];
  const figs: Cfg[] = [];
  zones.forEach((zone, zi) => {
    const cz = zone.positionZ - ZONE_DEPTH / 2;
    // 一位緩步走動
    figs.push({
      x: zi % 2 === 0 ? -1.6 : 1.6,
      z0: cz - 4,
      z1: cz + 4,
      speed: 0.32 + zi * 0.03,
      phase: zi * 1.7,
      color: tones[(zi * 2) % tones.length],
      height: 1.0,
    });
    // 一位站立觀展（靠牆面向展件）
    const onLeft = zi % 2 === 1;
    figs.push({
      x: onLeft ? -3.4 : 3.4,
      z0: cz + (zi === 3 ? -5 : 1),
      z1: cz,
      speed: 0,
      phase: zi * 2.3 + 1,
      color: tones[(zi * 2 + 1) % tones.length],
      height: 0.96,
      faceY: onLeft ? -Math.PI / 2 : Math.PI / 2,
    });
  });

  return (
    <group>
      {figs.map((cfg, i) => (
        <Figure key={i} cfg={cfg} />
      ))}
    </group>
  );
}
