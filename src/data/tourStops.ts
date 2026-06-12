import { zones, works, photos, courses } from "./exhibitions";

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

const centerZ = (zi: number) => zones[zi].positionZ - zones[zi].depth / 2;

// ===== 同仁牆密集裱框版面（每位 2 列、欄數依文件數，沿加長的牆排列）=====
export const FRAME_W = 0.62;
export const FRAME_H = 0.8;
const STEP_Z = FRAME_W + 0.08;
const CLUSTER_GAP = 0.5;

export interface WorkLayout {
  id: string;
  wall: "L" | "R";
  sign: number; // L:1(牆在 -x) R:-1(牆在 +x)
  cols: number;
  width: number;
  clusterZ: number; // 相對 works 中心
}

export function worksLayout(): WorkLayout[] {
  const depth = zones[1].depth;
  const half = Math.ceil(works.length / 2);
  const out: WorkLayout[] = [];
  const layWall = (list: typeof works, wall: "L" | "R", sign: number) => {
    let cur = depth / 2 - 2.2; // 由前往後
    list.forEach((w) => {
      const cols = Math.max(1, Math.ceil(w.pages.length / 2));
      const width = cols * STEP_Z;
      const clusterZ = cur - width / 2;
      out.push({ id: w.id, wall, sign, cols, width, clusterZ });
      cur -= width + CLUSTER_GAP;
    });
  };
  layWall(works.slice(0, half), "L", 1);
  layWall(works.slice(half), "R", -1);
  return out;
}

function overview(zi: number): Stop {
  const cz = centerZ(zi);
  const d = zones[zi].depth;
  return {
    key: `zone-${zi}`,
    zoneIndex: zi,
    type: "zone",
    label: zones[zi].name,
    cam: [0, 1.7, cz + d / 2 - 2],
    look: [0, 1.7, cz - 3],
  };
}

export function buildStops(): Stop[] {
  const stops: Stop[] = [];

  // 0 大廳
  stops.push(overview(0));

  // 1 同仁成果（逐位叢集）
  stops.push(overview(1));
  const layout = worksLayout();
  const byId = new Map(works.map((w) => [w.id, w]));
  layout.forEach((L) => {
    const w = byId.get(L.id)!;
    const worldZ = centerZ(1) + L.clusterZ;
    stops.push({
      key: w.id,
      zoneIndex: 1,
      type: "work",
      id: w.id,
      label: w.author,
      cam: [L.sign * 0.4, 2.5, worldZ + 0.4],
      look: [L.sign * 5.5, 2.4, worldZ],
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
    const zRel = 5 - k * 4;
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
  const cz3 = centerZ(3);
  const boardZ = cz3 - zones[3].depth / 2 + 0.6;
  stops.push({
    key: "zone-3",
    zoneIndex: 3,
    type: "zone",
    label: zones[3].name,
    cam: [0, 1.7, boardZ + 6.5],
    look: [0, 2, boardZ],
  });
  const n = courses.length;
  courses.forEach((c, i) => {
    const x = (i - (n - 1) / 2) * 2.1;
    stops.push({
      key: c.id,
      zoneIndex: 3,
      type: "course",
      id: c.id,
      label: c.title,
      cam: [x, 1.7, boardZ + 4.2],
      look: [x, 2, boardZ],
    });
  });

  return stops;
}
