export interface WorkItem {
  id: string;
  title: string;
  /** 顯示為單位／部門（去識別化，不具名同仁） */
  author: string;
  description: string;
  /** 首頁縮圖 */
  thumbnail: string;
  /** 簡報各頁圖片路徑 */
  pages: string[];
}

export interface PhotoItem {
  id: string;
  caption: string;
  image: string;
}

export interface CourseItem {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
}

export interface ZoneConfig {
  id: string;
  name: string;
  /** 展區中心 Z 座標（一字形走廊沿 Z 軸排列） */
  positionZ: number;
}

export const zones: ZoneConfig[] = [
  { id: "lobby", name: "入口大廳", positionZ: 0 },
  { id: "works", name: "同仁成果", positionZ: -20 },
  { id: "photos", name: "成效亮點", positionZ: -40 },
  { id: "courses", name: "2026 展望", positionZ: -60 },
];

export const lobbyInfo = {
  title: "2025 為恭醫院招募留才成果展",
  subtitle: "醫療主管必備的招募留才全攻略",
  welcomeText:
    "歡迎來到 2025 年度訓練成果虛擬展覽館。\n本展覽呈現為恭紀念醫院主管於「醫療主管必備的招募留才全攻略」四講訓練中的實作成果。\n\n年度亮點：學習成長滿意度 95.6%、到職率成長 116%、離職率下降 19.5%。\n\n請使用下方按鈕瀏覽各展區，或切換至自由探索模式自由走動。",
  /** 大廳數據看板 */
  stats: [
    { value: "95.6%", label: "學習成長滿意度" },
    { value: "+116%", label: "到職率成長" },
    { value: "-19.5%", label: "離職率下降" },
  ],
};

// 同仁成果（去識別化，以單位＋主題呈現）
export const works: WorkItem[] = [
  {
    id: "work-1",
    title: "溫和型（海豚）新人的留才計畫",
    author: "放射診斷科",
    description:
      "以「天生贏家四型人格測驗」與皮紋天賦特質測試辨識新人特質，判讀為溫和型（海豚）。針對其內向保守、適應較慢的特點，規劃漸進式技能學習、固定班別、設定乳房攝影／骨密度達人等目標，搭配包容接納與持續鼓勵的輔導計畫。",
    thumbnail: "/exhibits/works/work-1/thumb.jpg",
    pages: [
      "/exhibits/works/work-1/p01.jpg",
      "/exhibits/works/work-1/p02.jpg",
      "/exhibits/works/work-1/p03.jpg",
      "/exhibits/works/work-1/p04.jpg",
      "/exhibits/works/work-1/p05.jpg",
      "/exhibits/works/work-1/p06.jpg",
      "/exhibits/works/work-1/p07.jpg",
    ],
  },
  {
    id: "work-2",
    title: "多元型新人的行為觀察與輔導策略",
    author: "護理部",
    description:
      "針對多元型（整合型）新人進行行為表現、互動習慣與壓力反應的完整觀察，設計漸進式任務安排、反思與回饋練習、小目標追蹤與穩定引導者角色，並以「強調努力與進步」的激勵方案協助其於 ICU 穩定適應、降低焦慮與離職傾向。",
    thumbnail: "/exhibits/works/work-2/thumb.jpg",
    pages: [
      "/exhibits/works/work-2/p01.jpg",
      "/exhibits/works/work-2/p02.jpg",
      "/exhibits/works/work-2/p03.jpg",
      "/exhibits/works/work-2/p04.jpg",
      "/exhibits/works/work-2/p05.jpg",
      "/exhibits/works/work-2/p06.jpg",
      "/exhibits/works/work-2/p07.jpg",
    ],
  },
  {
    id: "work-4",
    title: "天賦特質的激勵策略 — 內斂型新人留才",
    author: "教學研究組",
    description:
      "辨識新人為內斂型（謹慎細心、踏實可靠、喜歡明確制度）。輔導策略採明確交辦書面流程、適度關心與資深夥伴配對；激勵方案運用 Teams 即時回饋與肯定性語言，並尊重其工作時程規劃，逐步建立自信與團隊參與感。",
    thumbnail: "/exhibits/works/work-4/thumb.jpg",
    pages: [
      "/exhibits/works/work-4/p01.jpg",
      "/exhibits/works/work-4/p02.jpg",
      "/exhibits/works/work-4/p03.jpg",
      "/exhibits/works/work-4/p04.jpg",
      "/exhibits/works/work-4/p05.jpg",
      "/exhibits/works/work-4/p06.jpg",
      "/exhibits/works/work-4/p07.jpg",
    ],
  },
  {
    id: "work-3",
    title: "新人留才計畫表與輔導紀錄",
    author: "生化組",
    description:
      "依個別化留才計畫表記錄新人特質辨識、輔導目標與適應追蹤，落實天賦特質於日常輔導與關懷之中。",
    thumbnail: "/exhibits/works/work-3/thumb.jpg",
    pages: [],
  },
  {
    id: "work-6",
    title: "護理新人留才與適應輔導計畫",
    author: "11F 護理站",
    description:
      "針對病房新進護理人員設計留才與適應輔導方案，結合個別化關懷、班別安排與階段性目標追蹤，協助新人穩定融入團隊。",
    thumbnail: "/exhibits/works/work-6/thumb.jpg",
    pages: [],
  },
  {
    id: "work-5",
    title: "長期照護新人留才計畫",
    author: "長期照護",
    description:
      "結合長照單位特性，以人格特質辨識為基礎擬定新人留才與輔導計畫，強化新人歸屬感與專業成長路徑。",
    thumbnail: "/exhibits/works/work-5/thumb.jpg",
    pages: [],
  },
  {
    id: "work-7",
    title: "新人留才行動方案",
    author: "醫事保險申報組",
    description:
      "依四講訓練架構提出部門招募與留才年度行動方案，從面試觀察、特質辨識到個別化輔導與激勵措施，建立可執行的留才流程。",
    thumbnail: "/exhibits/works/work-7/thumb.jpg",
    pages: [],
  },
  {
    id: "work-8",
    title: "護理新人留才計畫",
    author: "8F 護理站",
    description:
      "以天賦特質應用於新進護理人員的留才策略，規劃漸進式任務、夥伴配對與正向回饋，協助新人加速適應臨床環境。",
    thumbnail: "/exhibits/works/work-8/thumb.jpg",
    pages: [],
  },
];

// 訓練成效亮點（前後測統計與年度成果數據）
export const photos: PhotoItem[] = [
  {
    id: "hl-1",
    caption: "2025 訓練成果：滿意度 95.6%、到職率 +116%、離職率 -19.5%",
    image: "/exhibits/highlights/h1.jpg",
  },
  {
    id: "hl-2",
    caption: "2025 成果 × 2026 延展方向",
    image: "/exhibits/highlights/h2.jpg",
  },
  {
    id: "hl-3",
    caption: "預期整體效益：離職下降、留任提升、士氣增長",
    image: "/exhibits/highlights/h3.jpg",
  },
  {
    id: "hl-4",
    caption: "前後測｜招募留才思維定位：正向態度 83.8% → 91.0%",
    image: "/exhibits/highlights/h4.jpg",
  },
  {
    id: "hl-5",
    caption: "前後測｜STAR 面談技巧：平均分躍升 64%",
    image: "/exhibits/highlights/h5.jpg",
  },
  {
    id: "hl-6",
    caption: "前後測｜天賦特質留才激勵：信心度成長 20%",
    image: "/exhibits/highlights/h6.jpg",
  },
];

// 2026 課程與展望：由「留才」邁向「深耕成才」
export const courses: CourseItem[] = [
  {
    id: "course-1",
    title: "正向文化導入",
    description:
      "團隊共識與凝聚，幫助成員理解工作的貢獻與意義，共創「我們的價值宣言」。",
    date: "成才 × 聚焦留才",
    image: "/exhibits/courses/c1.jpg",
  },
  {
    id: "course-2",
    title: "留才型主管",
    description:
      "關鍵對話技巧，掌握留才面談與績效後的支持性對話，強化主管與人互動的能力。",
    date: "成才 × 聚焦留才",
    image: "/exhibits/courses/c2.jpg",
  },
  {
    id: "course-3",
    title: "Coach 教練領導",
    description:
      "團隊信任經營，讓主管在第一線及早察覺員工狀況、主動介入，建立安全感與歸屬。",
    date: "成才 × 聚焦留才",
    image: "/exhibits/courses/c3.jpg",
  },
  {
    id: "course-4",
    title: "全員韌性提升",
    description:
      "壓力調適與情緒管理工作坊，含正念放鬆、芳療與藝術紓壓，促進內在情緒轉化。",
    date: "深耕計畫 × 全員韌性",
    image: "/exhibits/courses/c4.jpg",
  },
  {
    id: "course-5",
    title: "主管心理素養訓練",
    description:
      "強化主管對部屬壓力徵兆的敏感度，學會初階觀察與支持，成為心理健康第一線守門人。",
    date: "深耕計畫 × 全員韌性",
    image: "/exhibits/courses/c5.jpg",
  },
];
