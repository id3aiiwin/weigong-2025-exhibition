"use client";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface GuidedTourProps {
  cam: [number, number, number];
  look: [number, number, number];
  enabled: boolean;
}

export default function GuidedTour({ cam, look, enabled }: GuidedTourProps) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!enabled) return;

    targetPos.current.set(cam[0], cam[1], cam[2]);
    targetLook.current.set(look[0], look[1], look[2]);

    const speed = Math.min(delta * 2.2, 0.12);
    camera.position.lerp(targetPos.current, speed);

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
