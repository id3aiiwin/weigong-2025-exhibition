"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { HALL_HEIGHT, ZONE_DEPTH, HALL_WIDTH } from "./ExhibitionHall";

/** 入口大拱門 */
export function EntranceArch({
  z,
  title,
  subtitle,
}: {
  z: number;
  title: string;
  subtitle?: string;
}) {
  return (
    <group position={[0, 0, z]}>
      {/* 拱門頂 */}
      <mesh position={[0, HALL_HEIGHT - 0.3, 0]}>
        <boxGeometry args={[HALL_WIDTH * 0.75, 0.8, 0.4]} />
        <meshStandardMaterial
          color="#3a2f24"
          metalness={0.5}
          roughness={0.4}
          emissive="#5a4420"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* 拱門邊發光條 */}
      <mesh position={[0, HALL_HEIGHT - 0.7, 0.21]}>
        <boxGeometry args={[HALL_WIDTH * 0.72, 0.04, 0.02]} />
        <meshBasicMaterial color="#b18f4d" toneMapped={false} />
      </mesh>
      <mesh position={[0, HALL_HEIGHT - 0.7, -0.21]}>
        <boxGeometry args={[HALL_WIDTH * 0.72, 0.04, 0.02]} />
        <meshBasicMaterial color="#b18f4d" toneMapped={false} />
      </mesh>

      {/* 拱門立柱 */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * HALL_WIDTH * 0.35, 0, 0]}>
          <mesh position={[0, HALL_HEIGHT / 2 - 0.4, 0]}>
            <boxGeometry args={[0.6, HALL_HEIGHT - 0.8, 0.4]} />
            <meshStandardMaterial
              color="#3a2f24"
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>
          {/* 立柱發光邊 */}
          <mesh position={[side * 0.31, HALL_HEIGHT / 2 - 0.4, 0]}>
            <boxGeometry args={[0.02, HALL_HEIGHT - 0.8, 0.3]} />
            <meshBasicMaterial color="#b18f4d" toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* 拱門上的活動名稱 */}
      <Text
        position={[0, HALL_HEIGHT - 0.3, 0.22]}
        fontSize={0.28}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.012}
        outlineColor="#2f2620"
        maxWidth={HALL_WIDTH * 0.7}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          position={[0, HALL_HEIGHT - 0.3, -0.22]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.18}
          color="#b9a06a"
          anchorX="center"
          anchorY="middle"
          maxWidth={HALL_WIDTH * 0.7}
        >
          {subtitle}
        </Text>
      )}
    </group>
  );
}

/** 展區分隔拱門 */
export function ZoneArch({
  z,
  zoneName,
  zoneNumber,
}: {
  z: number;
  zoneName: string;
  zoneNumber: string;
}) {
  return (
    <group position={[0, 0, z]}>
      {/* 拱門橫樑 */}
      <mesh position={[0, HALL_HEIGHT * 0.72, 0]}>
        <boxGeometry args={[HALL_WIDTH * 0.55, 0.5, 0.25]} />
        <meshStandardMaterial
          color="#3a2f24"
          metalness={0.4}
          roughness={0.5}
          emissive="#5a4420"
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* 橫樑發光邊 */}
      <mesh position={[0, HALL_HEIGHT * 0.72 - 0.24, 0.13]}>
        <boxGeometry args={[HALL_WIDTH * 0.52, 0.025, 0.02]} />
        <meshBasicMaterial color="#b18f4d" toneMapped={false} />
      </mesh>
      {/* 展區編號 */}
      <Text
        position={[-HALL_WIDTH * 0.2, HALL_HEIGHT * 0.72, 0.13]}
        fontSize={0.22}
        color="#b18f4d"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        {zoneNumber}
      </Text>
      {/* 展區名稱 */}
      <Text
        position={[HALL_WIDTH * 0.02, HALL_HEIGHT * 0.72, 0.13]}
        fontSize={0.22}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.008}
        outlineColor="#0a2040"
      >
        {zoneName}
      </Text>
    </group>
  );
}

/** 天花板懸掛旗幟 */
export function CeilingBanner({
  position,
  text,
  subText,
}: {
  position: [number, number, number];
  text: string;
  subText?: string;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.5 + position[2] * 0.3) * 0.03;
    }
  });

  return (
    <group position={position} ref={ref}>
      {/* 懸掛桿 */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
        <meshStandardMaterial color="#b18f4d" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* 旗幟主體（酒紅絨布） */}
      <mesh>
        <planeGeometry args={[1.6, 2.4]} />
        <meshStandardMaterial
          color="#6e2733"
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* 旗幟金邊 */}
      <mesh position={[0, 1.1, 0.005]}>
        <planeGeometry args={[1.6, 0.08]} />
        <meshStandardMaterial color="#c8a763" metalness={0.6} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -1.1, 0.005]}>
        <planeGeometry args={[1.6, 0.08]} />
        <meshStandardMaterial color="#c8a763" metalness={0.6} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* 文字 */}
      <Text
        position={[0, 0.5, 0.01]}
        fontSize={0.28}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.4}
        lineHeight={1.2}
        outlineWidth={0.01}
        outlineColor="#0a2040"
      >
        {text}
      </Text>
      {subText && (
        <Text
          position={[0, -0.4, 0.01]}
          fontSize={0.15}
          color="#b9a06a"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.4}
          lineHeight={1.3}
        >
          {subText}
        </Text>
      )}
    </group>
  );
}

/** 展品編號立牌（放在地上） */
export function ExhibitNumber({
  position,
  rotation = [0, 0, 0],
  number,
  label,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  number: string;
  label?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* 底座 */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.4, 0.06, 0.3]} />
        <meshStandardMaterial color="#3a2f24" metalness={0.5} />
      </mesh>
      {/* 立柱 */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.05, 0.65, 0.05]} />
        <meshStandardMaterial color="#4a3d2f" metalness={0.5} />
      </mesh>
      {/* 牌面 */}
      <mesh position={[0, 0.75, 0]}>
        <planeGeometry args={[0.5, 0.35]} />
        <meshStandardMaterial
          color="#3a2f24"
          emissive="#5a4420"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* 邊框發光 */}
      <mesh position={[0, 0.75, 0.003]}>
        <planeGeometry args={[0.52, 0.37]} />
        <meshBasicMaterial color="#b18f4d" toneMapped={false} transparent opacity={0.4} />
      </mesh>
      {/* 編號 */}
      <Text
        position={[0, 0.8, 0.005]}
        fontSize={0.16}
        color="#b18f4d"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.004}
        outlineColor="#ffffff"
      >
        {number}
      </Text>
      {label && (
        <Text
          position={[0, 0.66, 0.005]}
          fontSize={0.055}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.45}
          lineHeight={1.1}
        >
          {label}
        </Text>
      )}
    </group>
  );
}

/** 軌道燈具（純裝飾，不發實際光源以提升效能；展品本身自帶亮度） */
export function TrackSpotlight({
  position,
  color = "#ffffff",
}: {
  position: [number, number, number];
  target?: [number, number, number];
  color?: string;
}) {
  return (
    <group position={position}>
      {/* 燈具外殼 */}
      <mesh>
        <cylinderGeometry args={[0.08, 0.12, 0.2, 10]} />
        <meshStandardMaterial color="#1a2a3f" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* 燈泡發光 */}
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 10]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** 展示長椅 */
export function Bench({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* 椅座 */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[2.5, 0.1, 0.55]} />
        <meshStandardMaterial color="#4a3d2f" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* 椅座表面（皮革質感） */}
      <mesh position={[0, 0.51, 0]}>
        <boxGeometry args={[2.4, 0.02, 0.5]} />
        <meshStandardMaterial color="#3a2f24" roughness={0.3} />
      </mesh>
      {/* 椅腳 */}
      {[-1, 1].map((x) => (
        <mesh key={x} position={[x * 1.1, 0.22, 0]}>
          <boxGeometry args={[0.08, 0.45, 0.5]} />
          <meshStandardMaterial color="#3a2f24" metalness={0.6} />
        </mesh>
      ))}
      {/* 椅腳底部發光條 */}
      {[-1, 1].map((x) => (
        <mesh key={`g${x}`} position={[x * 1.1, 0.02, 0]}>
          <boxGeometry args={[0.1, 0.02, 0.48]} />
          <meshBasicMaterial color="#b18f4d" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** 接待服務台 */
export function ReceptionDesk({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* 主台面 */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[3, 1.1, 1]} />
        <meshStandardMaterial
          color="#3a2f24"
          metalness={0.5}
          roughness={0.3}
          emissive="#5a4420"
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* 台面頂板 */}
      <mesh position={[0, 1.13, 0]}>
        <boxGeometry args={[3.1, 0.05, 1.1]} />
        <meshStandardMaterial color="#cdc6b6" metalness={0.6} roughness={0.2} />
      </mesh>
      {/* 前面發光條 */}
      <mesh position={[0, 0.55, 0.51]}>
        <boxGeometry args={[2.8, 0.04, 0.02]} />
        <meshBasicMaterial color="#b18f4d" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.95, 0.51]}>
        <boxGeometry args={[2.8, 0.04, 0.02]} />
        <meshBasicMaterial color="#b18f4d" toneMapped={false} />
      </mesh>
      {/* 前面文字 */}
      <Text
        position={[0, 0.75, 0.51]}
        fontSize={0.14}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.4}
      >
        INFORMATION
      </Text>
      {/* 背後立牌 */}
      <mesh position={[0, 2, -0.4]}>
        <planeGeometry args={[2.4, 1.6]} />
        <meshStandardMaterial
          color="#3a2f24"
          emissive="#5a4420"
          emissiveIntensity={0.3}
          transparent
          opacity={0.92}
        />
      </mesh>
      <Text
        position={[0, 2.3, -0.39]}
        fontSize={0.18}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        歡迎光臨
      </Text>
      <Text
        position={[0, 2.05, -0.39]}
        fontSize={0.1}
        color="#b9a06a"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        WELCOME
      </Text>
      <mesh position={[0, 1.85, -0.39]}>
        <boxGeometry args={[1.6, 0.02, 0.01]} />
        <meshBasicMaterial color="#b18f4d" toneMapped={false} />
      </mesh>
      <Text
        position={[0, 1.65, -0.39]}
        fontSize={0.09}
        color="#c0d8f0"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.2}
        lineHeight={1.5}
      >
        請使用下方按鈕瀏覽各展區{"\n"}或切換自由探索模式
      </Text>
    </group>
  );
}

/** 地毯走道 */
export function CarpetRunner({
  z,
  length,
}: {
  z: number;
  length: number;
}) {
  return (
    <group position={[0, 0.012, z]}>
      {/* 主地毯（酒紅絨毯） */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, length]} />
        <meshStandardMaterial color="#7a2230" roughness={0.95} />
      </mesh>
      {/* 地毯金邊 */}
      <mesh position={[-1.05, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, length]} />
        <meshStandardMaterial color="#b18f4d" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[1.05, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, length]} />
        <meshStandardMaterial color="#b18f4d" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}
