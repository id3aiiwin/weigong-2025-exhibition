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
  onClick: () => void;
  seed?: number;
}

/** 牆面裱框展件（深木外框 + 金色內襯 + 卡紙 + 作品 + 銘牌） */
export default function HoloScreen({
  position,
  rotation = [0, 0, 0],
  title,
  author,
  thumbnail,
  onClick,
}: HoloScreenProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position} rotation={rotation}>
      {/* 外框（深木色） */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[2.92, 3.98, 0.09]} />
        <meshStandardMaterial
          color={hovered ? "#4a3a28" : "#2f2620"}
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>
      {/* 金色內襯 */}
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[2.64, 3.7]} />
        <meshStandardMaterial color="#9c7f4a" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* 卡紙（passe-partout） */}
      <mesh
        position={[0, 0, 0]}
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
        <planeGeometry args={[2.54, 3.58]} />
        <meshStandardMaterial color="#efe9db" roughness={0.95} />
      </mesh>

      {/* 作品掃描圖 */}
      {thumbnail ? (
        <Image
          url={asset(thumbnail)}
          position={[0, 0.3, 0.006]}
          scale={[2.02, 2.74]}
          toneMapped
          raycast={() => null}
        />
      ) : (
        <Text
          position={[0, 0.3, 0.01]}
          fontSize={0.4}
          color="#b9b1a0"
          anchorX="center"
          anchorY="middle"
        >
          ☐
        </Text>
      )}

      {/* 銘牌：部門 + 主題 */}
      <Text
        position={[0, -1.42, 0.01]}
        fontSize={0.17}
        color="#332a20"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.3}
      >
        {author}
      </Text>
      <Text
        position={[0, -1.64, 0.01]}
        fontSize={0.082}
        color="#7c7160"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.3}
        lineHeight={1.3}
      >
        {title}
      </Text>

      {/* 點擊提示 */}
      <Text
        position={[0, 2.22, 0.02]}
        fontSize={hovered ? 0.14 : 0.11}
        color={hovered ? "#8a6d2f" : "#a99055"}
        anchorX="center"
        anchorY="middle"
      >
        🔍 點擊看完整文件
      </Text>
    </group>
  );
}
