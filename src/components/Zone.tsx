"use client";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Image } from "@react-three/drei";
import { asset } from "@/lib/asset";
import * as THREE from "three";
import { zones, works, photos, courses, lobbyInfo } from "@/data/exhibitions";
import { worksLayout } from "@/data/tourStops";
import { HALL_WIDTH } from "./ExhibitionHall";
import {
  EntranceArch,
  ZoneArch,
  CeilingBanner,
  ExhibitNumber,
  TrackSpotlight,
  Bench,
  ReceptionDesk,
  CarpetRunner,
} from "./ExhibitionElements";

type SelectFn = (
  type: "work" | "highlight" | "course",
  id: string,
  page?: number
) => void;

/** pNN.jpg → tNN.jpg（牆面用小縮圖） */
function pageThumb(p: string) {
  return p.replace(/\/p(\d+\.jpg)$/, "/t$1");
}

/** 單份文件小裱框 */
function DocFrame({
  position,
  rotation,
  thumb,
  onClick,
  fw,
  fh,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  thumb: string;
  onClick: () => void;
  fw: number;
  fh: number;
}) {
  const [hov, setHov] = useState(false);
  const handlers = {
    onPointerOver: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setHov(true);
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      setHov(false);
      document.body.style.cursor = "default";
    },
    onClick: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onClick();
    },
  };
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[fw + 0.09, fh + 0.09, 0.05]} />
        <meshStandardMaterial
          color={hov ? "#4a3a28" : "#26231f"}
          roughness={0.45}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[fw + 0.025, fh + 0.025]} />
        <meshStandardMaterial
          color={hov ? "#dcbd7c" : "#b89a5c"}
          metalness={0.85}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 0, 0]} {...handlers}>
        <planeGeometry args={[fw, fh]} />
        <meshStandardMaterial color="#f5f1e9" roughness={0.95} />
      </mesh>
      <Image
        url={asset(thumb)}
        position={[0, 0, 0.006]}
        scale={[fw * 0.9, fh * 0.9]}
        toneMapped
        raycast={() => null}
      />
    </group>
  );
}

/** 一位同仁的文件叢集（牆面 2 列網格 + 部門銘牌，展示全部文件） */
function ColleagueCluster({
  work,
  wallX,
  sign,
  clusterZ,
  cols,
  onSelect,
}: {
  work: (typeof works)[number];
  wallX: number;
  sign: number;
  clusterZ: number;
  cols: number;
  onSelect: SelectFn;
}) {
  const allPages = work.pages;
  const fw = 0.62;
  const fh = 0.8;
  const stepZ = fw + 0.08;
  const stepY = fh + 0.08;
  const rot: [number, number, number] =
    sign < 0 ? [0, -Math.PI / 2, 0] : [0, Math.PI / 2, 0];
  // 固定 2 列：各部門等高
  const topY = 2.62 + stepY / 2;
  const bottomY = topY - stepY;
  const plateW = Math.max(1.1, cols * stepZ - 0.08);

  return (
    <group>
      {allPages.map((p, k) => {
        const c = k % cols;
        const r = Math.floor(k / cols);
        const z = clusterZ + (c - (cols - 1) / 2) * stepZ;
        const y = topY - r * stepY;
        return (
          <DocFrame
            key={k}
            position={[wallX, y, z]}
            rotation={rot}
            thumb={pageThumb(p)}
            onClick={() => onSelect("work", work.id, k)}
            fw={fw}
            fh={fh}
          />
        );
      })}
      {/* 部門銘牌 */}
      <group position={[wallX, bottomY - 0.66, clusterZ]} rotation={rot}>
        <mesh position={[0, 0, -0.004]}>
          <planeGeometry args={[plateW + 0.06, 0.4]} />
          <meshStandardMaterial color="#b18f4d" metalness={0.7} roughness={0.35} />
        </mesh>
        <mesh>
          <planeGeometry args={[plateW, 0.34]} />
          <meshStandardMaterial color="#2c241c" roughness={0.5} />
        </mesh>
        <Text
          position={[0, 0.045, 0.01]}
          fontSize={0.12}
          color="#f0e6cf"
          anchorX="center"
          anchorY="middle"
          maxWidth={plateW - 0.1}
        >
          {work.author}
        </Text>
        <Text
          position={[0, -0.1, 0.01]}
          fontSize={0.062}
          color="#d6bd86"
          anchorX="center"
          anchorY="middle"
        >
          {`${allPages.length} 份文件 · 點擊放大`}
        </Text>
      </group>
    </group>
  );
}

interface ZoneProps {
  zoneId: string;
  onSelectExhibit: SelectFn;
}

/** 旋轉發光環 */
function GlowRing({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.3;
  });
  return (
    <mesh ref={ref} position={position} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.8, 0.02, 16, 64]} />
      <meshBasicMaterial color="#b18f4d" toneMapped={false} />
    </mesh>
  );
}

function LobbyZone() {
  const ZONE_DEPTH = zones[0].depth;
  const z = zones[0].positionZ;
  const centerZ = z - ZONE_DEPTH / 2;

  return (
    <group position={[0, 0, centerZ]}>
      {/* 入口大拱門（在展區最前方） */}
      <EntranceArch
        z={ZONE_DEPTH / 2 - 0.5}
        title="2025 年度訓練成果展"
        subtitle="ANNUAL TRAINING EXHIBITION"
      />

      {/* 後牆主題牆：大標題 + 三大成效數據 */}
      <group position={[0, 0, -ZONE_DEPTH / 2 + 0.2]}>
        {/* 深木主題面板 */}
        <mesh position={[0, 2.55, 0]}>
          <planeGeometry args={[10, 4.5]} />
          <meshStandardMaterial color="#43382b" roughness={0.7} />
        </mesh>
        {/* 金色上下飾線 */}
        <mesh position={[0, 4.55, 0.02]}>
          <boxGeometry args={[9, 0.035, 0.02]} />
          <meshStandardMaterial color="#b18f4d" metalness={0.7} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.55, 0.02]}>
          <boxGeometry args={[9, 0.035, 0.02]} />
          <meshStandardMaterial color="#b18f4d" metalness={0.7} roughness={0.35} />
        </mesh>

        {/* 標題 */}
        <Text
          position={[0, 4.1, 0.03]}
          fontSize={0.46}
          color="#fdf6e6"
          anchorX="center"
          anchorY="middle"
          maxWidth={9}
          outlineWidth={0.008}
          outlineColor="#2a1f15"
        >
          {lobbyInfo.title}
        </Text>
        <Text
          position={[0, 3.6, 0.03]}
          fontSize={0.17}
          color="#d6bd86"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.25}
        >
          {lobbyInfo.subtitle}
        </Text>

        {/* 三大成效數據卡 */}
        {lobbyInfo.stats.map((s, i) => {
          const x = (i - 1) * 2.95;
          return (
            <group key={s.label} position={[x, 2.25, 0.03]}>
              <mesh position={[0, 0, 0.004]}>
                <planeGeometry args={[2.7, 1.7]} />
                <meshStandardMaterial color="#2c241c" roughness={0.6} />
              </mesh>
              <mesh>
                <planeGeometry args={[2.78, 1.78]} />
                <meshStandardMaterial color="#b18f4d" metalness={0.7} roughness={0.35} />
              </mesh>
              <Text
                position={[0, 0.34, 0.01]}
                fontSize={0.5}
                color="#f0cd7e"
                anchorX="center"
                anchorY="middle"
              >
                {s.value}
              </Text>
              <Text
                position={[0, -0.42, 0.01]}
                fontSize={0.16}
                color="#ece4d2"
                anchorX="center"
                anchorY="middle"
                maxWidth={2.4}
              >
                {s.label}
              </Text>
            </group>
          );
        })}

        {/* 引導語 */}
        <Text
          position={[0, 0.95, 0.03]}
          fontSize={0.15}
          color="#d6bd86"
          anchorX="center"
          anchorY="middle"
          maxWidth={9}
        >
          沿紅毯前行 · 探索 20 位同仁的招募留才實作成果
        </Text>
      </group>

      {/* 中央接待服務台 */}
      <ReceptionDesk position={[0, 0, -2]} />

      {/* 地毯走道 */}
      <CarpetRunner z={2} length={10} />

      {/* 地面導引圓環 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 4]}>
        <ringGeometry args={[1.4, 1.55, 64]} />
        <meshBasicMaterial
          color="#b18f4d"
          toneMapped={false}
          transparent
          opacity={0.6}
        />
      </mesh>
      <GlowRing position={[0, 0.05, 4]} />

      {/* 懸掛旗幟 */}
      <CeilingBanner
        position={[-3.5, 2.8, 3]}
        text="訓練成果"
        subText="2025 RESULTS"
      />
      <CeilingBanner
        position={[3.5, 2.8, 3]}
        text="專業成長"
        subText="GROWTH"
      />
    </group>
  );
}

function WorksZone({ onSelect }: { onSelect: SelectFn }) {
  const ZONE_DEPTH = zones[1].depth;
  const z = zones[1].positionZ;
  const centerZ = z - ZONE_DEPTH / 2;
  // 加長牆面，每位同仁一個叢集（2 列、欄數依文件數），展示全部文件
  const layout = worksLayout();
  const byId = new Map(works.map((w) => [w.id, w]));

  return (
    <group position={[0, 0, centerZ]}>
      {/* 展區拱門 */}
      <ZoneArch
        z={ZONE_DEPTH / 2 - 0.3}
        zoneName="同仁成果"
        zoneNumber="02"
      />

      {/* 後牆展區標題 */}
      <group position={[0, 0, -ZONE_DEPTH / 2 + 0.2]}>
        <mesh position={[0, 3.5, 0]}>
          <planeGeometry args={[8, 1.2]} />
          <meshStandardMaterial
            color="#43382b"
            roughness={0.6}
            transparent
            opacity={0.7}
          />
        </mesh>
        <Text
          position={[0, 3.65, 0.02]}
          fontSize={0.34}
          color="#ffffff"
          anchorX="center"
          outlineWidth={0.012}
          outlineColor="#2f2620"
        >
          同仁成果展區
        </Text>
        <Text
          position={[0, 3.2, 0.02]}
          fontSize={0.13}
          color="#b9a06a"
          anchorX="center"
          letterSpacing={0.3}
        >
          {`STAFF PROJECTS · 共 ${works.length} 位 · ${works.reduce(
            (s, w) => s + w.pages.length,
            0
          )} 份文件`}
        </Text>
      </group>

      {/* 懸掛旗幟 */}
      <CeilingBanner
        position={[0, 3.0, -3]}
        text="同仁成果"
        subText="STAFF PROJECTS"
      />

      {/* 密集裱框畫廊牆（每位同仁一個叢集，展示全部文件） */}
      {layout.map((L) => {
        const work = byId.get(L.id);
        if (!work) return null;
        return (
          <ColleagueCluster
            key={L.id}
            work={work}
            wallX={L.sign > 0 ? -5.5 : 5.5}
            sign={L.sign}
            clusterZ={L.clusterZ}
            cols={L.cols}
            onSelect={onSelect}
          />
        );
      })}

      {/* 中央觀賞長椅（沿加長走道） */}
      <Bench position={[0, 0, 5]} />
      <Bench position={[0, 0, -2]} />
      <Bench position={[0, 0, -9]} />

      {/* 地毯走道 */}
      <CarpetRunner z={0} length={ZONE_DEPTH - 3} />
    </group>
  );
}

function PhotosZone({ onSelect }: { onSelect: SelectFn }) {
  const ZONE_DEPTH = zones[2].depth;
  const z = zones[2].positionZ;
  const centerZ = z - ZONE_DEPTH / 2;

  return (
    <group position={[0, 0, centerZ]}>
      {/* 展區拱門 */}
      <ZoneArch
        z={ZONE_DEPTH / 2 - 0.3}
        zoneName="成效亮點"
        zoneNumber="03"
      />

      {/* 後牆標題 */}
      <group position={[0, 0, -ZONE_DEPTH / 2 + 0.2]}>
        <mesh position={[0, 3.5, 0]}>
          <planeGeometry args={[8, 1.2]} />
          <meshStandardMaterial
            color="#43382b"
            roughness={0.6}
            transparent
            opacity={0.7}
          />
        </mesh>
        <Text
          position={[0, 3.65, 0.02]}
          fontSize={0.34}
          color="#ffffff"
          anchorX="center"
          outlineWidth={0.012}
          outlineColor="#2f2620"
        >
          訓練成效亮點
        </Text>
        <Text
          position={[0, 3.2, 0.02]}
          fontSize={0.13}
          color="#b9a06a"
          anchorX="center"
          letterSpacing={0.3}
        >
          KEY RESULTS
        </Text>
      </group>

      <CeilingBanner
        position={[0, 2.8, -3]}
        text="成效亮點"
        subText="KEY RESULTS"
      />

      {/* 照片 + 編號 + 軌道燈 */}
      {photos.slice(0, 3).map((photo, i) => {
        const zPos = 5 - i * 4;
        return (
          <group key={photo.id}>
            {/* 左牆照片框 */}
            <group
              position={[-5.5, 2.2, zPos]}
              onClick={(e) => {
                e.stopPropagation();
                onSelect("highlight", photo.id);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                document.body.style.cursor = "default";
              }}
            >
              <mesh position={[0.05, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[3.4, 2.6]} />
                <meshBasicMaterial
                  color="#2f2620"
                  transparent
                  opacity={0.3}
                  depthWrite={false}
                />
              </mesh>
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[3.2, 2.4]} />
                <meshStandardMaterial color="#2f2620" roughness={0.5} />
              </mesh>
              <mesh position={[0.02, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[3.0, 2.2]} />
                <meshStandardMaterial color="#efe9db" roughness={0.95} />
              </mesh>
              <Image
                url={asset(photo.image)}
                position={[0.03, 0.2, 0]}
                rotation={[0, Math.PI / 2, 0]}
                scale={[2.9, 1.9]}
                transparent
              />
              <Text
                position={[0.04, -1.28, 0]}
                rotation={[0, Math.PI / 2, 0]}
                fontSize={0.12}
                color="#3a2f24"
                anchorX="center"
                maxWidth={2.9}
              >
                {photo.caption}
              </Text>
              <Text
                position={[0.04, -1.58, 0]}
                rotation={[0, Math.PI / 2, 0]}
                fontSize={0.105}
                color="#a6783a"
                anchorX="center"
              >
                🔍 點擊看大圖
              </Text>
            </group>
            <ExhibitNumber
              position={[-3.8, 0, zPos]}
              rotation={[0, -Math.PI / 2, 0]}
              number={String(i + 1).padStart(2, "0")}
              label={photo.caption}
            />
            <TrackSpotlight
              position={[-3, 4.7, zPos]}
              target={[-5.5, 2.2, zPos]}
              color="#ffffff"
            />
          </group>
        );
      })}

      {photos.slice(3, 6).map((photo, i) => {
        const zPos = 5 - i * 4;
        return (
          <group key={photo.id}>
            <group
              position={[5.5, 2.2, zPos]}
              onClick={(e) => {
                e.stopPropagation();
                onSelect("highlight", photo.id);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                document.body.style.cursor = "default";
              }}
            >
              <mesh position={[-0.05, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[3.4, 2.6]} />
                <meshBasicMaterial
                  color="#2f2620"
                  transparent
                  opacity={0.3}
                  depthWrite={false}
                />
              </mesh>
              <mesh rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[3.2, 2.4]} />
                <meshStandardMaterial color="#2f2620" roughness={0.5} />
              </mesh>
              <mesh position={[-0.02, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[3.0, 2.2]} />
                <meshStandardMaterial color="#efe9db" roughness={0.95} />
              </mesh>
              <Image
                url={asset(photo.image)}
                position={[-0.03, 0.2, 0]}
                rotation={[0, -Math.PI / 2, 0]}
                scale={[2.9, 1.9]}
                transparent
              />
              <Text
                position={[-0.04, -1.28, 0]}
                rotation={[0, -Math.PI / 2, 0]}
                fontSize={0.12}
                color="#3a2f24"
                anchorX="center"
                maxWidth={2.9}
              >
                {photo.caption}
              </Text>
              <Text
                position={[-0.04, -1.58, 0]}
                rotation={[0, -Math.PI / 2, 0]}
                fontSize={0.105}
                color="#a6783a"
                anchorX="center"
              >
                🔍 點擊看大圖
              </Text>
            </group>
            <ExhibitNumber
              position={[3.8, 0, zPos]}
              rotation={[0, Math.PI / 2, 0]}
              number={String(i + 4).padStart(2, "0")}
              label={photo.caption}
            />
            <TrackSpotlight
              position={[3, 4.7, zPos]}
              target={[5.5, 2.2, zPos]}
              color="#ffffff"
            />
          </group>
        );
      })}

      {/* 中央長椅 */}
      <Bench position={[0, 0, -6]} />

      <CarpetRunner z={-ZONE_DEPTH / 2 + 8} length={ZONE_DEPTH - 4} />
    </group>
  );
}

function CoursesZone({ onSelect }: { onSelect: SelectFn }) {
  const ZONE_DEPTH = zones[3].depth;
  const z = zones[3].positionZ;
  const centerZ = z - ZONE_DEPTH / 2;

  return (
    <group position={[0, 0, centerZ]}>
      {/* 展區拱門 */}
      <ZoneArch
        z={ZONE_DEPTH / 2 - 0.3}
        zoneName="2026 展望"
        zoneNumber="04"
      />

      {/* 後牆標題 */}
      <group position={[0, 0, -ZONE_DEPTH / 2 + 0.2]}>
        <mesh position={[0, 4, 0]}>
          <planeGeometry args={[9, 0.9]} />
          <meshStandardMaterial
            color="#43382b"
            roughness={0.6}
            transparent
            opacity={0.7}
          />
        </mesh>
        <Text
          position={[0, 4.1, 0.02]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          outlineWidth={0.012}
          outlineColor="#2f2620"
        >
          2026 課程與展望
        </Text>
        <Text
          position={[0, 3.75, 0.02]}
          fontSize={0.12}
          color="#b9a06a"
          anchorX="center"
          letterSpacing={0.3}
        >
          UPCOMING COURSES
        </Text>
      </group>

      <CeilingBanner
        position={[0, 2.8, -3]}
        text="2026 新課程"
        subText="COMING SOON"
      />

      {/* 課程展板 */}
      {courses.map((course, i) => {
        const x = (i - (courses.length - 1) / 2) * 2.1;
        return (
          <group
            key={course.id}
            position={[x, 2, -ZONE_DEPTH / 2 + 0.6]}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("course", course.id);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "default";
            }}
          >
            <mesh position={[0, 0, -0.1]}>
              <planeGeometry args={[2.6, 3.4]} />
              <meshBasicMaterial
                color="#b18f4d"
                transparent
                opacity={0.1}
                depthWrite={false}
              />
            </mesh>
            <mesh position={[0, 0, -0.03]}>
              <planeGeometry args={[2.4, 3.2]} />
              <meshStandardMaterial
                color="#2f2620"
                roughness={0.5}
              />
            </mesh>
            <mesh>
              <planeGeometry args={[2.25, 3.05]} />
              <meshStandardMaterial
                color="#efe9db"
                roughness={0.95}
              />
            </mesh>
            <Text
              position={[0, 1.45, 0.02]}
              fontSize={0.11}
              color="#b9a06a"
              anchorX="center"
              letterSpacing={0.2}
            >
              COURSE {String(i + 1).padStart(2, "0")}
            </Text>
            <Text
              position={[0, 1.24, 0.02]}
              fontSize={0.1}
              color="#cbb98e"
              anchorX="center"
              maxWidth={2.1}
            >
              {course.date}
            </Text>
            <Image
              url={asset(course.image)}
              position={[0, -0.12, 0.02]}
              scale={[1.3, 2.36]}
              transparent
            />
            <Text
              position={[0, -1.44, 0.02]}
              fontSize={0.1}
              color="#d6b878"
              anchorX="center"
            >
              🔍 點擊看課程
            </Text>
          </group>
        );
      })}

      {/* 軌道燈打在課程板上 */}
      {courses.map((_, i) => {
        const x = (i - (courses.length - 1) / 2) * 2.1;
        return (
          <TrackSpotlight
            key={i}
            position={[x, 4.7, -ZONE_DEPTH / 2 + 2]}
            target={[x, 2, -ZONE_DEPTH / 2 + 0.6]}
            color="#ffffff"
          />
        );
      })}

      {/* 長椅 */}
      <Bench position={[0, 0, -2]} />

      <CarpetRunner z={-ZONE_DEPTH / 2 + 8} length={ZONE_DEPTH - 4} />
    </group>
  );
}

export default function Zone({ zoneId, onSelectExhibit }: ZoneProps) {
  switch (zoneId) {
    case "lobby":
      return <LobbyZone />;
    case "works":
      return <WorksZone onSelect={onSelectExhibit} />;
    case "photos":
      return <PhotosZone onSelect={onSelectExhibit} />;
    case "courses":
      return <CoursesZone onSelect={onSelectExhibit} />;
    default:
      return null;
  }
}
