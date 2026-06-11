import { zones, works, photos, courses } from "./exhibitions";

// 與 ExhibitionHall 的 ZONE_DEPTH 保持一致
export const ZONE_DEPTH = 18;
// 牆面實際擺放的作品數（其餘可由「展品目錄」瀏覽）
export const WALL_WORKS = 10;

export type StopType = "zone" | "work" | "highlight" | "course";

export interface Stop {
  key: string;
  zoneIndex: number;
  type: StopType;
  id?: string;
  label: string;
  cam: [number, number, number];
  look: [number, number, number];
}

const centerZ = (zi: number) => zones[zi].positionZ - ZONE_DEPTH / 2;

function overview(zi: number): Stop {
  const cz = centerZ(zi);
  return {
    key: `zone-${zi}`,
    zoneIndex: zi,
    type: "zone",
    label: zones[zi].name,
    cam: [0, 1.7, cz + ZONE_DEPTH / 2 - 2],
    look: [0, 1.7, cz - 3],
  };
}

export function buildStops(): Stop[] {
  const stops: Stop[] = [];

  // 0 大廳
  stops.push(overview(0));

  // 1 同仁成果（牆面前 WALL_WORKS 件）
  stops.push(overview(1));
  const wall = works.slice(0, WALL_WORKS);
  const half = Math.ceil(wall.length / 2);
  wall.forEach((w, idx) => {
    const left = idx < half;
    const k = left ? idx : idx - half;
    const sign = left ? -1 : 1;
    const zRel = 6 - k * 2.9;
    const worldZ = centerZ(1) + zRel;
    stops.push({
      key: w.id,
      zoneIndex: 1,
      type: "work",
      id: w.id,
      label: w.author,
      cam: [sign * 2.3, 1.7, worldZ + 0.1],
      look: [sign * 5.5, 2.2, worldZ],
    });
  });

  // 2 成效亮點
  stops.push(overview(2));
  const ph = photos.slice(0, 6);
  const phalf = Math.ceil(ph.length / 2);
  ph.forEach((p, idx) => {
    const left = idx < phalf;
    const k = left ? idx : idx - phalf;
    const sign = left ? -1 : 1;
    const zRel = -2 - k * 4.5;
    const worldZ = centerZ(2) + zRel;
    stops.push({
      key: p.id,
      zoneIndex: 2,
      type: "highlight",
      id: p.id,
      label: p.caption.split("：")[0].split("｜").slice(-1)[0].slice(0, 14),
      cam: [sign * 2.3, 1.7, worldZ + 0.1],
      look: [sign * 5.5, 2.2, worldZ],
    });
  });

  // 3 2026 展望
  stops.push(overview(3));
  const n = courses.length;
  courses.forEach((c, i) => {
    const x = (i - (n - 1) / 2) * 2.4;
    const worldZ = centerZ(3) - ZONE_DEPTH / 2 + 0.6;
    stops.push({
      key: c.id,
      zoneIndex: 3,
      type: "course",
      id: c.id,
      label: c.title,
      cam: [x * 0.5, 1.7, worldZ + 3.6],
      look: [x, 2, worldZ],
    });
  });

  return stops;
}
