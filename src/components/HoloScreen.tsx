"use client";
import { useState } from "react";
import { Text, Image } from "@react-three/drei";
import { asset } from "@/lib/asset";

interface HoloScreenProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  title: string;
  author: string;
  thumbnail: string;
  pageCount?: number;
  onClick: () => void;
  seed?: number;
}

/** 牆面裱框展件：細緻深炭外框 + 金色內襯 + 白卡紙 + 作品 + 館藏標籤（明確可點擊） */
export default function HoloScreen({
  position,
  rotation = [0, 0, 0],
  title,
  author,
  thumbnail,
  pageCount = 0,
  onClick,
}: HoloScreenProps) {
  const [hovered, setHovered] = useState(false);

  const handlers = {
    onPointerOver: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setHovered(true);
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      setHovered(false);
      document.body.style.cursor = "default";
    },
    onClick: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onClick();
    },
  };

  return (
    <group position={position} rotation={rotation}>
      {/* 外框（細緻深炭） */}
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[2.64, 3.52, 0.07]} />
        <meshStandardMaterial
          color="#26231f"
          roughness={0.45}
          metalness={0.15}
        />
      </mesh>
      {/* 金色細內襯 */}
      <mesh position={[0, 0, -0.008]}>
        <planeGeometry args={[2.42, 3.3]} />
        <meshStandardMaterial
          color={hovered ? "#dcbd7c" : "#b89a5c"}
          metalness={0.85}
          roughness={0.3}
        />
      </mesh>
      {/* 白卡紙（可點擊） */}
      <mesh position={[0, 0, 0]} {...handlers}>
        <planeGeometry args={[2.36, 3.24]} />
        <meshStandardMaterial color="#f5f1e9" roughness={0.95} />
      </mesh>

      {/* 作品掃描圖 */}
      {thumbnail ? (
        <Image
          url={asset(thumbnail)}
          position={[0, 0.32, 0.006]}
          scale={[1.96, 2.5]}
          toneMapped
          raycast={() => null}
        />
      ) : (
        <Text
          position={[0, 0.32, 0.01]}
          fontSize={0.4}
          color="#c9bfae"
          anchorX="center"
          anchorY="middle"
        >
          ☐
        </Text>
      )}

      {/* 分隔細線 */}
      <mesh position={[0, -1.0, 0.006]} raycast={() => null}>
        <planeGeometry args={[1.96, 0.006]} />
        <meshBasicMaterial color="#cabf9c" />
      </mesh>

      {/* 館藏標籤：部門 */}
      <Text
        position={[0, -1.2, 0.008]}
        fontSize={0.155}
        color="#2a221a"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.2}
      >
        {author}
      </Text>
      {/* 主題 */}
      <Text
        position={[0, -1.4, 0.008]}
        fontSize={0.07}
        color="#8a7d68"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.1}
        lineHeight={1.25}
      >
        {title}
      </Text>

      {/* 明確互動提示（含文件份數） */}
      <Text
        position={[0, -1.55, 0.01]}
        fontSize={hovered ? 0.082 : 0.075}
        color={hovered ? "#7a2230" : "#a6783a"}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.02}
      >
        {pageCount > 0 ? `🔍 點擊查看 ${pageCount} 份文件` : "🔍 點擊查看"}
      </Text>
    </group>
  );
}
