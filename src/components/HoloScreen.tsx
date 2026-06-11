"use client";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Image } from "@react-three/drei";
import { asset } from "@/lib/asset";
import * as THREE from "three";

interface HoloScreenProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  title: string;
  author: string;
  thumbnail: string;
  onClick: () => void;
  seed?: number;
}

export default function HoloScreen({
  position,
  rotation = [0, 0, 0],
  title,
  author,
  thumbnail,
  onClick,
  seed = 0,
}: HoloScreenProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mainRef = useRef<THREE.Mesh>(null);
  const scanRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (!groupRef.current || !mainRef.current || !scanRef.current) return;

    // 浮動動畫
    const t = state.clock.elapsedTime + seed;
    groupRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.08;

    // 發光強度變化
    const mat = mainRef.current.material as THREE.MeshStandardMaterial;
    const target = hovered ? 1.2 : 0.5;
    mat.emissiveIntensity = THREE.MathUtils.lerp(
      mat.emissiveIntensity,
      target,
      delta * 4
    );

    // 掃描線上下移動
    const scanY = ((t * 0.5) % 2) - 1;
    scanRef.current.position.y = scanY * 1.7;
    const scanMat = scanRef.current.material as THREE.MeshBasicMaterial;
    scanMat.opacity = hovered ? 0.8 : 0.4;
  });

  return (
    <group position={position} rotation={rotation} ref={groupRef}>
      {/* 外層光暈 */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[3.0, 4.0]} />
        <meshBasicMaterial
          color="#4a9eff"
          transparent
          opacity={hovered ? 0.15 : 0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 邊框 */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[2.7, 3.7]} />
        <meshStandardMaterial
          color="#0a2040"
          emissive="#4a9eff"
          emissiveIntensity={hovered ? 1.5 : 0.8}
          toneMapped={false}
        />
      </mesh>

      {/* 內框 */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[2.55, 3.55]} />
        <meshStandardMaterial color="#050a18" />
      </mesh>

      {/* 主光屏 */}
      <mesh
        ref={mainRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <planeGeometry args={[2.4, 3.4]} />
        <meshStandardMaterial
          color={thumbnail ? "#ffffff" : "#0c2545"}
          emissive={thumbnail ? "#ffffff" : "#4a9eff"}
          emissiveIntensity={0.5}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* 掃描線動畫 */}
      <mesh ref={scanRef} position={[0, 0, 0.01]} raycast={() => null}>
        <planeGeometry args={[2.4, 0.04]} />
        <meshBasicMaterial
          color="#7ac4ff"
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 作品縮圖 */}
      {thumbnail ? (
        <Image
          url={asset(thumbnail)}
          position={[0, 0.35, 0.006]}
          scale={[2.2, 2.5]}
          transparent
          raycast={() => null}
        />
      ) : (
        <>
          <mesh position={[0, 0.5, 0.005]} raycast={() => null}>
            <planeGeometry args={[1.4, 1.4]} />
            <meshStandardMaterial
              color="#1a3560"
              emissive="#4a9eff"
              emissiveIntensity={0.4}
              transparent
              opacity={0.7}
            />
          </mesh>
          <Text
            position={[0, 0.5, 0.02]}
            fontSize={0.5}
            color="#7ac4ff"
            anchorX="center"
            anchorY="middle"
          >
            PDF
          </Text>
        </>
      )}

      {/* 四角裝飾 */}
      {[
        [-1.15, 1.65],
        [1.15, 1.65],
        [-1.15, -1.65],
        [1.15, -1.65],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.01]} raycast={() => null}>
          <planeGeometry args={[0.15, 0.03]} />
          <meshBasicMaterial
            color="#4a9eff"
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* 標題 */}
      <Text
        position={[0, -1.25, 0.02]}
        fontSize={0.16}
        color="#e0f0ff"
        anchorX="center"
        anchorY="top"
        maxWidth={2.2}
        outlineWidth={0.008}
        outlineColor="#0a2040"
      >
        {title}
      </Text>

      {/* 作者 */}
      <Text
        position={[0, -1.5, 0.02]}
        fontSize={0.12}
        color="#7ac4ff"
        anchorX="center"
        anchorY="top"
      >
        {author}
      </Text>

      {/* 互動提示 */}
      {hovered && (
        <Text
          position={[0, 1.85, 0.02]}
          fontSize={0.13}
          color="#ffffff"
          anchorX="center"
          outlineWidth={0.01}
          outlineColor="#4a9eff"
        >
          ◆ 點擊查看詳情 ◆
        </Text>
      )}
    </group>
  );
}
