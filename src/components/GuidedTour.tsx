"use client";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { zones } from "@/data/exhibitions";
import { ZONE_DEPTH } from "./ExhibitionHall";

interface GuidedTourProps {
  currentZoneIndex: number;
  enabled: boolean;
}

export default function GuidedTour({
  currentZoneIndex,
  enabled,
}: GuidedTourProps) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!enabled) return;

    const zone = zones[currentZoneIndex];
    const centerZ = zone.positionZ - ZONE_DEPTH / 2;

    // 攝影機目標位置：展區中心偏前方
    targetPos.current.set(0, 1.7, centerZ + ZONE_DEPTH / 2 - 2);
    // 看向展區深處
    targetLook.current.set(0, 1.7, centerZ - 3);

    // 平滑移動
    const speed = delta * 2;
    camera.position.lerp(targetPos.current, speed);

    // 平滑轉向
    const currentDir = new THREE.Vector3();
    camera.getWorldDirection(currentDir);
    const targetDir = targetLook.current
      .clone()
      .sub(camera.position)
      .normalize();
    currentDir.lerp(targetDir, speed);
    camera.lookAt(camera.position.clone().add(currentDir));
  });

  return null;
}
