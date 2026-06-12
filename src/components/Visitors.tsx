"use client";
import { useRef, useMemo, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import { zones } from "@/data/exhibitions";
import { asset } from "@/lib/asset";

const MODEL = asset("/models/visitor.glb");

interface Cfg {
  x: number;
  z0: number;
  z1: number;
  speed: number;
  phase: number;
  tint: string;
}

function Walker({ cfg }: { cfg: Cfg }) {
  const { scene, animations } = useGLTF(MODEL);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const mixer = useMemo(() => new THREE.AnimationMixer(clone), [clone]);
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    // 套用衣著色調
    clone.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.material = (m.material as THREE.Material).clone();
        const mat = m.material as THREE.MeshStandardMaterial;
        if (mat.color) mat.color.set(cfg.tint);
        mat.roughness = 0.85;
        mat.metalness = 0.0;
      }
    });
    const clip =
      animations.find((a) => /walk/i.test(a.name)) ||
      animations[1] ||
      animations[0];
    if (clip) {
      const action = mixer.clipAction(clip);
      action.timeScale = 0.9;
      action.play();
    }
    return () => {
      mixer.stopAllAction();
    };
  }, [clone, mixer, animations, cfg.tint]);

  useFrame((state, delta) => {
    mixer.update(delta);
    const t = state.clock.elapsedTime * cfg.speed + cfg.phase;
    const tri = (2 / Math.PI) * Math.asin(Math.sin(t));
    const mid = (cfg.z0 + cfg.z1) / 2;
    const half = (cfg.z1 - cfg.z0) / 2;
    const z = mid + half * tri;
    const facePlus = (half >= 0 ? Math.cos(t) : -Math.cos(t)) >= 0;
    if (group.current) {
      group.current.position.set(cfg.x, 0, z);
      // 模型預設面向 +z；前進方向對應旋轉
      group.current.rotation.y = facePlus ? Math.PI : 0;
    }
  });

  return (
    <group ref={group} scale={1}>
      <primitive object={clone} />
    </group>
  );
}

export default function Visitors() {
  const tints = ["#3a4a63", "#5a4a44", "#444a52", "#6a5a4a", "#3d4742"];
  const cfgs: Cfg[] = [];
  zones.forEach((zone, zi) => {
    if (zi === 0) return; // 大廳留白
    const cz = zone.positionZ - zone.depth / 2;
    const reach = Math.min(zone.depth / 2 - 2, 6);
    cfgs.push({
      x: zi % 2 === 0 ? -1.8 : 1.8,
      z0: cz - reach,
      z1: cz + reach,
      speed: 0.32 + zi * 0.03,
      phase: zi * 1.9,
      tint: tints[zi % tints.length],
    });
  });
  // 同仁區（加長）再加一位
  const wcz = zones[1].positionZ - zones[1].depth / 2;
  cfgs.push({
    x: 1.6,
    z0: wcz - 8,
    z1: wcz + 8,
    speed: 0.26,
    phase: 3.5,
    tint: tints[4],
  });

  return (
    <group>
      {cfgs.map((cfg, i) => (
        <Walker key={i} cfg={cfg} />
      ))}
    </group>
  );
}

useGLTF.preload(MODEL);
