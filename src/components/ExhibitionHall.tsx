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
      {/* 柱頂金環 */}
      <mesh position={[0, HALL_HEIGHT - 0.3, 0]}>
        <torusGeometry args={[0.2, 0.02, 8, 24]} />
        <meshStandardMaterial color="#b18f4d" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

/** 天花板發光燈條 */
function CeilingLightStrip({ z, length }: { z: number; length: number }) {
  return (
    <group position={[0, HALL_HEIGHT - 0.05, z]}>
      <mesh>
        <boxGeometry args={[0.34, 0.06, length]} />
        <meshStandardMaterial
          color="#fff6e8"
          emissive="#fff1da"
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** 牆面護牆板 + 上下線板 + 壁柱（沿三面牆） */
function WallDressing({ depth }: { depth: number }) {
  const ZONE_DEPTH = depth;
  const xL = -HALL_WIDTH / 2 + 0.16;
  const xR = HALL_WIDTH / 2 - 0.16;
  const zB = -ZONE_DEPTH / 2 + 0.16;
  const dadoY = 1.45; // 護牆板高度
  const crownY = HALL_HEIGHT - 0.28;
  const wainColor = "#c2baaa";
  const moldColor = "#4a3d2f";
  const accentColor = "#b18f4d";

  // 側牆壁柱位置（沿 Z，依深度自動分佈）
  const pilCount = Math.max(5, Math.round(ZONE_DEPTH / 3.6));
  const pilZ = Array.from({ length: pilCount }, (_, i) => {
    const span = ZONE_DEPTH - 2;
    return -span / 2 + (span / (pilCount - 1)) * i;
  });

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
            <meshStandardMaterial color={accentColor} metalness={0.8} roughness={0.3} />
          </mesh>
          {/* 頂部冠線板（crown molding） */}
          <mesh position={[x + sign * 0.04, crownY, 0]}>
            <boxGeometry args={[0.1, 0.16, ZONE_DEPTH]} />
            <meshStandardMaterial color={moldColor} metalness={0.5} roughness={0.35} />
          </mesh>
          {/* 踢腳板 */}
          <mesh position={[x + sign * 0.04, 0.09, 0]}>
            <boxGeometry args={[0.1, 0.18, ZONE_DEPTH]} />
            <meshStandardMaterial color="#3a342c" metalness={0.2} roughness={0.7} />
          </mesh>
          {/* 壁柱 */}
          {pilZ.map((z) => (
            <group key={z} position={[x, 0, z]}>
              <mesh position={[sign * 0.02, (crownY + 0.1) / 2 + 0.18, 0]}>
                <boxGeometry args={[0.14, crownY - 0.1, 0.42]} />
                <meshStandardMaterial color="#cdc6b6" metalness={0.1} roughness={0.7} />
              </mesh>
              <mesh position={[sign * 0.1, (crownY + 0.1) / 2 + 0.18, 0]}>
                <boxGeometry args={[0.02, crownY - 0.4, 0.04]} />
                <meshStandardMaterial color={accentColor} metalness={0.8} roughness={0.3} />
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
          <meshStandardMaterial color="#3a342c" metalness={0.2} roughness={0.7} />
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
      {/* 花盆（陶土色） */}
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.27, 0.2, 0.52, 18]} />
        <meshStandardMaterial color="#9c6b4a" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.53, 0]}>
        <cylinderGeometry args={[0.285, 0.285, 0.05, 18]} />
        <meshStandardMaterial color="#b18f4d" metalness={0.6} roughness={0.4} />
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
        <meshStandardMaterial color="#b9975a" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.97, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#c8a763" metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  );
}

/** 天花板凹槽飾框 */
function CeilingCoffer({ depth }: { depth: number }) {
  const ZONE_DEPTH = depth;
  const w = HALL_WIDTH * 0.7;
  const d = ZONE_DEPTH * 0.7;
  const y = HALL_HEIGHT - 0.04;
  return (
    <group position={[0, y, 0]}>
      {/* 內凹淺色天花 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color="#f0ece2" roughness={0.95} />
      </mesh>
      {/* 飾框四邊（暖白發光，模擬天花燈槽） */}
      {[
        { p: [0, 0, -d / 2] as [number, number, number], a: [w, 0.06, 0.08] as [number, number, number] },
        { p: [0, 0, d / 2] as [number, number, number], a: [w, 0.06, 0.08] as [number, number, number] },
        { p: [-w / 2, 0, 0] as [number, number, number], a: [0.08, 0.06, d] as [number, number, number] },
        { p: [w / 2, 0, 0] as [number, number, number], a: [0.08, 0.06, d] as [number, number, number] },
      ].map(({ p, a }, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={a} />
          <meshStandardMaterial
            color="#fff4e2"
            emissive="#ffeccf"
            emissiveIntensity={0.8}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/** 單一展區的牆壁與地板 */
function ZoneRoom({ positionZ, depth }: { positionZ: number; depth: number }) {
  const ZONE_DEPTH = depth;
  const centerZ = positionZ - ZONE_DEPTH / 2;

  return (
    <group position={[0, 0, centerZ]}>
      {/* 反射地板 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[HALL_WIDTH, ZONE_DEPTH]} />
        <MeshReflectorMaterial
          blur={[120, 30]}
          resolution={128}
          mixBlur={1}
          mixStrength={0.35}
          roughness={0.85}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#b8b1a2"
          metalness={0.15}
          mirror={0.25}
        />
      </mesh>

      {/* 地板底色（暖石材） */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[HALL_WIDTH, ZONE_DEPTH]} />
        <meshStandardMaterial color="#aaa395" roughness={0.9} />
      </mesh>

      {/* 天花板（淺色） */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, HALL_HEIGHT, 0]}>
        <planeGeometry args={[HALL_WIDTH, ZONE_DEPTH]} />
        <meshStandardMaterial color="#ece8de" roughness={0.95} />
      </mesh>

      {/* 天花板發光條 */}
      <CeilingLightStrip z={-ZONE_DEPTH / 4} length={ZONE_DEPTH * 0.4} />
      <CeilingLightStrip z={ZONE_DEPTH / 4} length={ZONE_DEPTH * 0.4} />

      {/* 左牆（淺色藝廊牆面） */}
      <mesh position={[-HALL_WIDTH / 2, HALL_HEIGHT / 2, 0]}>
        <boxGeometry args={[WALL_THICKNESS, HALL_HEIGHT, ZONE_DEPTH]} />
        <meshStandardMaterial color="#d7d1c4" roughness={0.95} />
      </mesh>
      {/* 左牆深色踢腳 */}
      <mesh position={[-HALL_WIDTH / 2 + 0.14, 0.11, 0]}>
        <boxGeometry args={[0.05, 0.22, ZONE_DEPTH]} />
        <meshStandardMaterial color="#3a342c" roughness={0.6} />
      </mesh>

      {/* 右牆 */}
      <mesh position={[HALL_WIDTH / 2, HALL_HEIGHT / 2, 0]}>
        <boxGeometry args={[WALL_THICKNESS, HALL_HEIGHT, ZONE_DEPTH]} />
        <meshStandardMaterial color="#d7d1c4" roughness={0.95} />
      </mesh>
      {/* 右牆深色踢腳 */}
      <mesh position={[HALL_WIDTH / 2 - 0.14, 0.11, 0]}>
        <boxGeometry args={[0.05, 0.22, ZONE_DEPTH]} />
        <meshStandardMaterial color="#3a342c" roughness={0.6} />
      </mesh>

      {/* 後牆（沉穩主題色） */}
      <mesh position={[0, HALL_HEIGHT / 2, -ZONE_DEPTH / 2]}>
        <boxGeometry args={[HALL_WIDTH, HALL_HEIGHT, WALL_THICKNESS]} />
        <meshStandardMaterial color="#5a4a44" roughness={0.92} />
      </mesh>

      {/* 四個角落柱子（緊貼牆角，避免擋住展品） */}
      <Column position={[-HALL_WIDTH / 2 + 0.42, 0, -ZONE_DEPTH / 2 + 0.42]} />
      <Column position={[HALL_WIDTH / 2 - 0.42, 0, -ZONE_DEPTH / 2 + 0.42]} />
      <Column position={[-HALL_WIDTH / 2 + 0.42, 0, ZONE_DEPTH / 2 - 0.42]} />
      <Column position={[HALL_WIDTH / 2 - 0.42, 0, ZONE_DEPTH / 2 - 0.42]} />

      {/* ===== 四周裝潢 ===== */}
      {/* 牆面護牆板、線板、壁柱 */}
      <WallDressing depth={depth} />

      {/* 天花板凹槽飾框 */}
      <CeilingCoffer depth={depth} />

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
          <boxGeometry args={[0.04, 0.04, 2.4]} />
          <meshStandardMaterial color="#7a2230" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

/** 展區之間的走廊連接（backZ：前一區後緣，frontZ：後一區前緣） */
function Corridor({ backZ, frontZ }: { backZ: number; frontZ: number }) {
  const length = backZ - frontZ;
  if (length <= 0.5) return null;
  const centerZ = (backZ + frontZ) / 2;

  return (
    <group position={[0, 0, centerZ]}>
      {/* 走廊地板 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[HALL_WIDTH * 0.55, length]} />
        <meshStandardMaterial color="#aaa395" roughness={0.9} />
      </mesh>

      {/* 走廊天花板 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, HALL_HEIGHT * 0.8, 0]}>
        <planeGeometry args={[HALL_WIDTH * 0.55, length]} />
        <meshStandardMaterial color="#ece8de" roughness={0.95} />
      </mesh>

      {/* 走廊天花板發光 */}
      <mesh position={[0, HALL_HEIGHT * 0.8 - 0.05, 0]}>
        <boxGeometry args={[0.2, 0.05, length * 0.9]} />
        <meshStandardMaterial
          color="#fff6e8"
          emissive="#fff1da"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      {/* 走廊左牆 */}
      <mesh position={[-HALL_WIDTH * 0.275, HALL_HEIGHT * 0.4, 0]}>
        <boxGeometry args={[WALL_THICKNESS, HALL_HEIGHT * 0.8, length]} />
        <meshStandardMaterial color="#d7d1c4" roughness={0.95} />
      </mesh>
      {/* 走廊右牆 */}
      <mesh position={[HALL_WIDTH * 0.275, HALL_HEIGHT * 0.4, 0]}>
        <boxGeometry args={[WALL_THICKNESS, HALL_HEIGHT * 0.8, length]} />
        <meshStandardMaterial color="#d7d1c4" roughness={0.95} />
      </mesh>

      {/* 走廊兩側踢腳 */}
      <mesh position={[-HALL_WIDTH * 0.275 + 0.15, 0.1, 0]}>
        <boxGeometry args={[0.04, 0.2, length]} />
        <meshStandardMaterial color="#3a342c" roughness={0.7} />
      </mesh>
      <mesh position={[HALL_WIDTH * 0.275 - 0.15, 0.1, 0]}>
        <boxGeometry args={[0.04, 0.2, length]} />
        <meshStandardMaterial color="#3a342c" roughness={0.7} />
      </mesh>
    </group>
  );
}

export default function ExhibitionHall() {
  return (
    <group>
      {/* 各展區房間 */}
      {zones.map((zone) => (
        <ZoneRoom key={zone.id} positionZ={zone.positionZ} depth={zone.depth} />
      ))}

      {/* 走廊連接 */}
      {zones.slice(0, -1).map((zone, i) => (
        <Corridor
          key={`corridor-${i}`}
          backZ={zone.positionZ - zone.depth}
          frontZ={zones[i + 1].positionZ}
        />
      ))}

      {/* 明亮暖白環境光 + 半球光（自然均勻，效能佳） */}
      <ambientLight intensity={0.85} color="#fff4e6" />
      <hemisphereLight args={["#fff6ea", "#9c9486", 0.7]} />

      {/* 各展區暖白主燈（依深度佈點） */}
      {zones.flatMap((zone) => {
        const cz = zone.positionZ - zone.depth / 2;
        const nLights = Math.max(1, Math.round(zone.depth / 14));
        return Array.from({ length: nLights }, (_, k) => {
          const zz =
            nLights === 1
              ? cz
              : cz + zone.depth * 0.7 * (k / (nLights - 1) - 0.5);
          return (
            <pointLight
              key={`light-${zone.id}-${k}`}
              position={[0, HALL_HEIGHT - 0.4, zz]}
              intensity={1.4}
              color="#fff1dc"
              distance={22}
              decay={1.5}
            />
          );
        });
      })}
    </group>
  );
}

export { HALL_WIDTH, HALL_HEIGHT, ZONE_DEPTH };
