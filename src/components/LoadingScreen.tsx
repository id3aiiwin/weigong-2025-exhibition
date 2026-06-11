"use client";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  visible: boolean;
  onEnter: () => void;
}

export default function LoadingScreen({ visible, onEnter }: LoadingScreenProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) setMounted(true);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden">
      {/* 背景漸層 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050a18] via-[#0a1a35] to-[#050a18]" />

      {/* 網格光效 */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(74,158,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(74,158,255,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 70%)",
        }}
      />

      {/* 光暈 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#4a9eff]/10 blur-3xl animate-pulse" />

      {/* 上下裝飾線 */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#4a9eff] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#4a9eff] to-transparent" />

      {/* 內容 */}
      <div
        className={`relative z-10 h-full flex flex-col items-center justify-center transition-all duration-1000 ${
          mounted ? "opacity-100" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Logo 區 */}
        <div className="mb-10 text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            {/* 外環 */}
            <div className="absolute inset-0 rounded-full border-2 border-[#4a9eff]/30 animate-[spin_8s_linear_infinite]" />
            <div className="absolute inset-2 rounded-full border border-[#4a9eff]/50 animate-[spin_6s_linear_infinite_reverse]" />
            {/* 中心 */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#4a9eff]/30 to-[#4a9eff]/10 border border-[#4a9eff]/50 flex items-center justify-center backdrop-blur-sm">
              <span className="text-3xl">🏥</span>
            </div>
          </div>

          <div className="text-xs tracking-[0.3em] text-[#4a9eff] mb-3 uppercase">
            Virtual Exhibition 2025
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e0f0ff] via-[#a0c8ff] to-[#e0f0ff] mb-3 tracking-wide">
            年度訓練成果展
          </h1>
          <div className="flex items-center justify-center gap-3 text-sm text-[#8ab4d8]">
            <span className="w-12 h-px bg-[#4a9eff]/50" />
            <span>國際評量應用發展協會 × 為恭紀念醫院</span>
            <span className="w-12 h-px bg-[#4a9eff]/50" />
          </div>
        </div>

        {/* 進入按鈕 */}
        <button
          onClick={onEnter}
          className="group relative px-10 py-3.5 overflow-hidden rounded-xl bg-gradient-to-r from-[#4a9eff]/20 to-[#4a9eff]/30 hover:from-[#4a9eff]/40 hover:to-[#4a9eff]/60 text-white font-medium transition-all duration-300 border border-[#4a9eff]/50 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/50"
        >
          <span className="relative z-10 flex items-center gap-2 tracking-wider">
            進入展覽館
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>

        {/* 操作說明（自動依裝置調整，無需選擇） */}
        <div className="mt-14 text-center max-w-md px-6">
          <div className="text-[11px] tracking-[0.4em] text-white/40 mb-3">
            操作說明
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs text-white/50">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-[#7ac4ff] mb-1">🖱️ 電腦</div>
              <div>「上一件／下一件」逐件巡覽，或開「展品目錄」點選</div>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-[#7ac4ff] mb-1">📱 手機</div>
              <div>觸控點選展品與目錄，可切換自由探索</div>
            </div>
          </div>
        </div>
      </div>

      {/* 角落裝飾 */}
      {[
        "top-6 left-6",
        "top-6 right-6",
        "bottom-6 left-6",
        "bottom-6 right-6",
      ].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-8 h-8`}>
          <div
            className={`absolute ${
              pos.includes("top") ? "top-0" : "bottom-0"
            } ${pos.includes("left") ? "left-0" : "right-0"} w-full h-px bg-[#4a9eff]`}
          />
          <div
            className={`absolute ${
              pos.includes("top") ? "top-0" : "bottom-0"
            } ${pos.includes("left") ? "left-0" : "right-0"} w-px h-full bg-[#4a9eff]`}
          />
        </div>
      ))}
    </div>
  );
}
