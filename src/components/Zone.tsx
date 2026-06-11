"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Image } from "@react-three/drei";
import { asset } from "@/lib/asset";
import * as THREE from "three";
import { zones, works, photos, courses, lobbyInfo } from "@/data/exhibitions";
import HoloScreen from "./HoloScreen";
import { ZONE_DEPTH, HALL_WIDTH } from "./ExhibitionHall";
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
  id: string
) => void;

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
  const z = zones[1].positionZ;
  const centerZ = z - ZONE_DEPTH / 2;
  // 牆面展示前 10 件（每側 5 件，沿走廊由前到後），其餘可由「展品目錄」瀏覽
  const wallWorks = works.slice(0, 10);
  const half = Math.ceil(wallWorks.length / 2);
  const leftWorks = wallWorks.slice(0, half);
  const rightWorks = wallWorks.slice(half);
  const wallZ = (i: number) => 6 - i * 2.9;

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
          {`STAFF PROJECTS · 共 ${works.length} 位（目錄可看全部）`}
        </Text>
      </group>

      {/* 懸掛旗幟 */}
      <CeilingBanner
        position={[0, 2.8, -3]}
        text="同仁成果"
        subText="STAFF PROJECTS"
      />

      {/* 左牆作品 + 編號牌 + 軌道燈 */}
      {leftWorks.map((work, i) => {
        const zPos = wallZ(i);
        return (
          <group key={work.id}>
            <HoloScreen
              position={[-5.5, 2.2, zPos]}
              rotation={[0, Math.PI / 2, 0]}
              title={work.title}
              author={work.author}
              thumbnail={work.thumbnail}
              pageCount={work.pages.length}
              onClick={() => onSelect("work", work.id)}
              seed={i * 0.7}
            />
            <ExhibitNumber
              position={[-3.8, 0, zPos]}
              rotation={[0, -Math.PI / 2, 0]}
              number={String(i + 1).padStart(2, "0")}
              label={work.title}
            />
            <TrackSpotlight
              position={[-3, 4.7, zPos]}
              target={[-5.5, 2.2, zPos]}
              color="#ffffff"
            />
          </group>
        );
      })}

      {/* 右牆作品 */}
      {rightWorks.map((work, i) => {
        const zPos = wallZ(i);
        return (
          <group key={work.id}>
            <HoloScreen
              position={[5.5, 2.2, zPos]}
              rotation={[0, -Math.PI / 2, 0]}
              title={work.title}
              author={work.author}
              thumbnail={work.thumbnail}
              pageCount={work.pages.length}
              onClick={() => onSelect("work", work.id)}
              seed={i * 0.7 + 2}
            />
            <ExhibitNumber
              position={[3.8, 0, zPos]}
              rotation={[0, Math.PI / 2, 0]}
              number={String(leftWorks.length + i + 1).padStart(2, "0")}
              label={work.title}
            />
            <TrackSpotlight
              position={[3, 4.7, zPos]}
              target={[5.5, 2.2, zPos]}
              color="#ffffff"
            />
          </group>
        );
      })}

      {/* 中央觀賞長椅 */}
      <Bench position={[0, 0, -4]} />
      <Bench position={[0, 0, -8]} />

      {/* 地毯走道 */}
      <CarpetRunner z={-ZONE_DEPTH / 2 + 8} length={ZONE_DEPTH - 4} />
    </group>
  );
}

function PhotosZone({ onSelect }: { onSelect: SelectFn }) {
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
