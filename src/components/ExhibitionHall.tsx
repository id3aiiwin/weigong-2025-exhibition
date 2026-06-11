"use client";
import { MeshReflectorMaterial } from "@react-three/drei";
import { zones } from "@/data/exhibitions";

const HALL_WIDTH = 12;
const HALL_HEIGHT = 5;
const ZONE_DEPTH = 18;
const WALL_THICKNESS = 0.3;

/** 展區內裝飾柱子 */
function Column({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* 主柱體 */}
      <mesh position={[0, HALL_HEIGHT / 2, 0]}>
        <cylinderGeometry args={[0.18, 0.18, HALL_HEIGHT, 14]} />
        <meshStandardMaterial
          color="#c8d4e4"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      {/* 柱頂裝飾 */}
      <mesh position={[0, HALL_HEIGHT - 0.2, 0]}>
        <cylinderGeometry args={[0.28, 0.22, 0.3, 14]} />
        <meshStandardMaterial
          color="#e0e8f0"
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      {/* 柱底裝飾 */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.28, 0.32, 0.3, 14]} />
        <meshStandardMaterial
          color="#b0c0d0"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      {/* 柱頂發光環 */}
      <mesh position={[0, HALL_HEIGHT - 0.3, 0]}>
        <torusGeometry args={[0.3, 0.02, 8, 32]} />
        <meshStandardMaterial
          color="#4a9eff"
          emissive="#4a9eff"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** 天花板發光燈條 */
function CeilingLightStrip({ z, length }: { z: number; length: number }) {
  return (
    <group position={[0, HALL_HEIGHT - 0.05, z]}>
      <mesh>
        <boxGeometry args={[0.3, 0.05, length]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#7ab8ff"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** 牆面護牆板 + 上下線板 + 壁柱（沿三面牆） */
function WallDressing() {
  const xL = -HALL_WIDTH / 2 + 0.16;
  const xR = HALL_WIDTH / 2 - 0.16;
  const zB = -ZONE_DEPTH / 2 + 0.16;
  const dadoY = 1.45; // 護牆板高度
  const crownY = HALL_HEIGHT - 0.28;
  const wainColor = "#21344f";
  const moldColor = "#334c70";

  // 側牆壁柱位置（沿 Z）
  const pilZ = [-7, -3.5, 0, 3.5, 7];

  return (
    <group>
      {/* ===== 左 / 右 牆 ===== */}
      {[
        { x: xL, sign: 1 },
        { x: xR, sign: -1 },
      ].map(({ x, sign }, wi) => (
        <group key={`sw-${wi}`}>
          {/* 護牆板（下半牆兩色） */}
          <mesh
            position={[x, dadoY / 2, 0]}
            rotation={[0, sign * (Math.PI / 2), 0]}
          >
            <planeGeometry args={[ZONE_DEPTH, dadoY]} />
            <meshStandardMaterial color={wainColor} roughness={0.55} metalness={0.2} />
          </mesh>
          {/* 椅背線板（dado rail） */}
          <mesh position={[x + sign * 0.03, dadoY, 0]}>
            <boxGeometry args={[0.06, 0.1, ZONE_DEPTH]} />
            <meshStandardMaterial color={moldColor} metalness={0.5} roughness={0.35} />
          </mesh>
          <mesh position={[x + sign * 0.07, dadoY + 0.03, 0]}>
            <boxGeometry args={[0.02, 0.02, ZONE_DEPTH]} />
            <meshBasicMaterial color="#4a9eff" toneMapped={false} />
          </mesh>
          {/* 頂部冠線板（crown molding） */}
          <mesh position={[x + sign * 0.04, crownY, 0]}>
            <boxGeometry args={[0.1, 0.16, ZONE_DEPTH]} />
            <meshStandardMaterial color={moldColor} metalness={0.5} roughness={0.35} />
          </mesh>
          {/* 踢腳板 */}
          <mesh position={[x + sign * 0.04, 0.09, 0]}>
            <boxGeometry args={[0.1, 0.18, ZONE_DEPTH]} />
            <meshStandardMaterial color="#16243c" metalness={0.3} roughness={0.6} />
          </mesh>
          {/* 壁柱 */}
          {pilZ.map((z) => (
            <group key={z} position={[x, 0, z]}>
              <mesh position={[sign * 0.02, (crownY + 0.1) / 2 + 0.18, 0]}>
                <boxGeometry args={[0.14, crownY - 0.1, 0.42]} />
                <meshStandardMaterial color="#28405f" metalness={0.35} roughness={0.45} />
              </mesh>
              <mesh position={[sign * 0.1, (crownY + 0.1) / 2 + 0.18, 0]}>
                <boxGeometry args={[0.02, crownY - 0.4, 0.04]} />
                <meshBasicMaterial color="#4a9eff" toneMapped={false} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* ===== 後牆 ===== */}
      <group>
        <mesh position={[0, dadoY / 2, zB]}>
          <planeGeometry args={[HALL_WIDTH, dadoY]} />
          <meshStandardMaterial color={wainColor} roughness={0.55} metalness={0.2} />
        </mesh>
        <mesh position={[0, dadoY, zB + 0.03]}>
          <boxGeometry args={[HALL_WIDTH, 0.1, 0.06]} />
          <meshStandardMaterial color={moldColor} metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[0, crownY, zB + 0.04]}>
          <boxGeometry args={[HALL_WIDTH, 0.16, 0.1]} />
          <meshStandardMaterial color={moldColor} metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.09, zB + 0.04]}>
          <boxGeometry args={[HALL_WIDTH, 0.18, 0.1]} />
          <meshStandardMaterial color="#16243c" metalness={0.3} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

/** 暖色壁燈 */
function WallSconce({
  position,
  sign,
}: {
  position: [number, number, number];
  sign: number; // 1=左牆面向 +x，-1=右牆面向 -x
}) {
  return (
    <group position={position}>
      <mesh position={[sign * -0.04, 0, 0]}>
        <boxGeometry args={[0.08, 0.55, 0.18]} />
        <meshStandardMaterial color="#16263d" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[sign * 0.02, 0, 0]}>
        <boxGeometry args={[0.05, 0.46, 0.13]} />
        <meshStandardMaterial
          color="#ffd9a0"
          emissive="#ffc070"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        position={[sign * 0.25, 0, 0]}
        intensity={0.55}
        color="#ffc88a"
        distance={4.5}
        decay={2}
      />
    </group>
  );
}

/** 角落盆栽 */
function PottedPlant({ position }: { position: [number, number, number] }) {
  const leaves = [0, 1, 2, 3, 4];
  return (
    <group position={position}>
      {/* 花盆 */}
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.27, 0.2, 0.52, 18]} />
        <meshStandardMaterial color="#2a3650" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.53, 0]}>
        <cylinderGeometry args={[0.285, 0.285, 0.05, 18]} />
        <meshStandardMaterial
          color="#4a9eff"
          emissive="#4a9eff"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* 葉叢 */}
      {leaves.map((i) => {
        const a = (i / leaves.length) * Math.PI * 2;
        const r = 0.16;
        const tilt = 0.5;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * r, 0.95, Math.sin(a) * r]}
            rotation={[Math.cos(a) * tilt, a, Math.sin(a) * tilt]}
          >
            <coneGeometry args={[0.16, 0.95, 7]} />
            <meshStandardMaterial
              color={i % 2 ? "#2f6b48" : "#3c8a5c"}
              roughness={0.8}
            />
          </mesh>
        );
      })}
      <mesh position={[0, 0.78, 0]}>
        <coneGeometry args={[0.12, 0.8, 7]} />
        <meshStandardMaterial color="#357a52" roughness={0.8} />
      </mesh>
    </group>
  );
}

/** 紅龍／引導柱 */
function Stanchion({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.14, 0.16, 0.1, 18]} />
        <meshStandardMaterial color="#16263d" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.9, 12]} />
        <meshStandardMaterial color="#c8d4e4" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.97, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color="#7ac4ff"
          emissive="#4a9eff"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** 天花板凹槽飾框 */
function CeilingCoffer() {
  const w = HALL_WIDTH * 0.7;
  const d = ZONE_DEPTH * 0.7;
  const y = HALL_HEIGHT - 0.04;
  return (
    <group position={[0, y, 0]}>
      {/* 內凹深色面 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color="#0a1424" />
      </mesh>
      {/* 飾框四邊 */}
      {[
        { p: [0, 0, -d / 2] as [number, number, number], a: [w, 0.06, 0.08] as [number, number, number] },
        { p: [0, 0, d / 2] as [number, number, number], a: [w, 0.06, 0.08] as [number, number, number] },
        { p: [-w / 2, 0, 0] as [number, number, number], a: [0.08, 0.06, d] as [number, number, number] },
        { p: [w / 2, 0, 0] as [number, number, number], a: [0.08, 0.06, d] as [number, number, number] },
      ].map(({ p, a }, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={a} />
          <meshStandardMaterial
            color="#4a9eff"
            emissive="#4a9eff"
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/** 單一展區的牆壁與地板 */
function ZoneRoom({ positionZ }: { positionZ: number }) {
  const centerZ = positionZ - ZONE_DEPTH / 2;

  return (
    <group position={[0, 0, centerZ]}>
      {/* 反射地板 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[HALL_WIDTH, ZONE_DEPTH]} />
        <MeshReflectorMaterial
          blur={[140, 36]}
          resolution={128}
          mixBlur={1}
          mixStrength={0.6}
          roughness={0.75}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#2a3a55"
          metalness={0.55}
          mirror={0.35}
        />
      </mesh>

      {/* 地板底色 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[HALL_WIDTH, ZONE_DEPTH]} />
        <meshStandardMaterial color="#1a2a3f" />
      </mesh>

      {/* 天花板 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, HALL_HEIGHT, 0]}>
        <planeGeometry args={[HALL_WIDTH, ZONE_DEPTH]} />
        <meshStandardMaterial color="#0f1a2e" />
      </mesh>

      {/* 天花板發光條 */}
      <CeilingLightStrip z={-ZONE_DEPTH / 4} length={ZONE_DEPTH * 0.4} />
      <CeilingLightStrip z={ZONE_DEPTH / 4} length={ZONE_DEPTH * 0.4} />

      {/* 左牆 */}
      <mesh position={[-HALL_WIDTH / 2, HALL_HEIGHT / 2, 0]}>
        <boxGeometry args={[WALL_THICKNESS, HALL_HEIGHT, ZONE_DEPTH]} />
        <meshStandardMaterial color="#1e2e4a" roughness={0.7} />
      </mesh>
      {/* 左牆發光線條 */}
      <mesh position={[-HALL_WIDTH / 2 + 0.15, 0.1, 0]}>
        <boxGeometry args={[0.02, 0.05, ZONE_DEPTH]} />
        <meshStandardMaterial
          color="#4a9eff"
          emissive="#4a9eff"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* 右牆 */}
      <mesh position={[HALL_WIDTH / 2, HALL_HEIGHT / 2, 0]}>
        <boxGeometry args={[WALL_THICKNESS, HALL_HEIGHT, ZONE_DEPTH]} />
        <meshStandardMaterial color="#1e2e4a" roughness={0.7} />
      </mesh>
      {/* 右牆發光線條 */}
      <mesh position={[HALL_WIDTH / 2 - 0.15, 0.1, 0]}>
        <boxGeometry args={[0.02, 0.05, ZONE_DEPTH]} />
        <meshStandardMaterial
          color="#4a9eff"
          emissive="#4a9eff"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* 後牆 */}
      <mesh position={[0, HALL_HEIGHT / 2, -ZONE_DEPTH / 2]}>
        <boxGeometry args={[HALL_WIDTH, HALL_HEIGHT, WALL_THICKNESS]} />
        <meshStandardMaterial color="#182842" roughness={0.7} />
      </mesh>

      {/* 四個角落柱子（緊貼牆角，避免擋住展品） */}
      <Column position={[-HALL_WIDTH / 2 + 0.42, 0, -ZONE_DEPTH / 2 + 0.42]} />
      <Column position={[HALL_WIDTH / 2 - 0.42, 0, -ZONE_DEPTH / 2 + 0.42]} />
      <Column position={[-HALL_WIDTH / 2 + 0.42, 0, ZONE_DEPTH / 2 - 0.42]} />
      <Column position={[HALL_WIDTH / 2 - 0.42, 0, ZONE_DEPTH / 2 - 0.42]} />

      {/* ===== 四周裝潢 ===== */}
      {/* 牆面護牆板、線板、壁柱 */}
      <WallDressing />

      {/* 天花板凹槽飾框 */}
      <CeilingCoffer />

      {/* 暖色壁燈（左右牆） */}
      {[-5.5, -1, 3.5].map((z) => (
        <WallSconce
          key={`scL-${z}`}
          position={[-HALL_WIDTH / 2 + 0.25, 3, z]}
          sign={1}
        />
      ))}
      {[-5.5, -1, 3.5].map((z) => (
        <WallSconce
          key={`scR-${z}`}
          position={[HALL_WIDTH / 2 - 0.25, 3, z]}
          sign={-1}
        />
      ))}

      {/* 角落盆栽 */}
      <PottedPlant position={[-HALL_WIDTH / 2 + 1, 0, ZONE_DEPTH / 2 - 1.4]} />
      <PottedPlant position={[HALL_WIDTH / 2 - 1, 0, ZONE_DEPTH / 2 - 1.4]} />
      <PottedPlant position={[-HALL_WIDTH / 2 + 1, 0, -ZONE_DEPTH / 2 + 1.4]} />
      <PottedPlant position={[HALL_WIDTH / 2 - 1, 0, -ZONE_DEPTH / 2 + 1.4]} />

      {/* 入口引導柱（紅龍柱） */}
      <Stanchion position={[-1.6, 0, ZONE_DEPTH / 2 - 1.2]} />
      <Stanchion position={[1.6, 0, ZONE_DEPTH / 2 - 1.2]} />
      <Stanchion position={[-1.6, 0, ZONE_DEPTH / 2 - 3.6]} />
      <Stanchion position={[1.6, 0, ZONE_DEPTH / 2 - 3.6]} />
      {/* 引導柱之間的繩索 */}
      {[-1.6, 1.6].map((x) => (
        <mesh key={`rope-${x}`} position={[x, 0.85, ZONE_DEPTH / 2 - 2.4]}>
          <boxGeometry args={[0.03, 0.03, 2.4]} />
          <meshStandardMaterial
            color="#3a6ea5"
            emissive="#4a9eff"
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

/** 展區之間的走廊連接 */
function Corridor({ fromZ, toZ }: { fromZ: number; toZ: number }) {
  const length = Math.abs(fromZ - toZ) - ZONE_DEPTH;
  if (length <= 0) return null;
  const centerZ = (fromZ + toZ) / 2 - ZONE_DEPTH / 2;

  return (
    <group position={[0, 0, centerZ]}>
      {/* 走廊地板 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[HALL_WIDTH * 0.55, length]} />
        <meshStandardMaterial
          color="#2a3a55"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* 走廊天花板 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, HALL_HEIGHT * 0.8, 0]}>
        <planeGeometry args={[HALL_WIDTH * 0.55, length]} />
        <meshStandardMaterial color="#0f1a2e" />
      </mesh>

      {/* 走廊天花板發光 */}
      <mesh position={[0, HALL_HEIGHT * 0.8 - 0.05, 0]}>
        <boxGeometry args={[0.2, 0.05, length * 0.9]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#7ab8ff"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      {/* 走廊左牆 */}
      <mesh position={[-HALL_WIDTH * 0.275, HALL_HEIGHT * 0.4, 0]}>
        <boxGeometry args={[WALL_THICKNESS, HALL_HEIGHT * 0.8, length]} />
        <meshStandardMaterial color="#1e2e4a" />
      </mesh>
      {/* 走廊右牆 */}
      <mesh position={[HALL_WIDTH * 0.275, HALL_HEIGHT * 0.4, 0]}>
        <boxGeometry args={[WALL_THICKNESS, HALL_HEIGHT * 0.8, length]} />
        <meshStandardMaterial color="#1e2e4a" />
      </mesh>

      {/* 走廊兩側發光邊線 */}
      <mesh position={[-HALL_WIDTH * 0.275 + 0.15, 0.08, 0]}>
        <boxGeometry args={[0.02, 0.04, length]} />
        <meshStandardMaterial
          color="#4a9eff"
          emissive="#4a9eff"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[HALL_WIDTH * 0.275 - 0.15, 0.08, 0]}>
        <boxGeometry args={[0.02, 0.04, length]} />
        <meshStandardMaterial
          color="#4a9eff"
          emissive="#4a9eff"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export default function ExhibitionHall() {
  return (
    <group>
      {/* 各展區房間 */}
      {zones.map((zone) => (
        <ZoneRoom key={zone.id} positionZ={zone.positionZ} />
      ))}

      {/* 走廊連接 */}
      {zones.slice(0, -1).map((zone, i) => (
        <Corridor
          key={`corridor-${i}`}
          fromZ={zone.positionZ}
          toZ={zones[i + 1].positionZ}
        />
      ))}

      {/* 環境光（提高以補償移除的聚光燈） */}
      <ambientLight intensity={0.46} color="#b8d8ff" />

      {/* 每個展區一盞主燈 + 一盞補光（精簡光源以提升效能） */}
      {zones.map((zone) => (
        <group key={`lights-${zone.id}`}>
          <pointLight
            position={[0, HALL_HEIGHT - 0.5, zone.positionZ - ZONE_DEPTH / 2]}
            intensity={2.0}
            color="#a8ccff"
            distance={ZONE_DEPTH}
            decay={1.6}
          />
          <pointLight
            position={[0, 2.2, zone.positionZ - ZONE_DEPTH / 2]}
            intensity={1.0}
            color="#4a9eff"
            distance={12}
            decay={1.9}
          />
        </group>
      ))}
    </group>
  );
}

export { HALL_WIDTH, HALL_HEIGHT, ZONE_DEPTH };
