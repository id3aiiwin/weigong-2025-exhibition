"use client";
import { useEffect, useState } from "react";
import { lobbyInfo } from "@/data/exhibitions";

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
      {/* 暖色espresso漸層背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#241b14] via-[#1a1310] to-[#0e0a07]" />

      {/* 細緻紋理光 */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,167,99,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(200,167,99,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at center, black 25%, transparent 72%)",
        }}
      />

      {/* 暖光暈 */}
      <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full bg-[#b18f4d]/10 blur-3xl" />

      {/* 上下金色細線 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c8a763] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c8a763] to-transparent" />

      {/* 內容 */}
      <div
        className={`relative z-10 h-full flex flex-col items-center justify-center transition-all duration-1000 ${
          mounted ? "opacity-100" : "opacity-0 translate-y-4"
        }`}
      >
        {/* 徽章 */}
        <div className="mb-8 text-center">
          <div className="relative w-20 h-20 mx-auto mb-7">
            <div className="absolute inset-0 rounded-full border border-[#c8a763]/40" />
            <div className="absolute inset-2 rounded-full border border-[#c8a763]/25" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#b18f4d]/25 to-[#b18f4d]/5 border border-[#c8a763]/40 flex items-center justify-center">
              <span className="text-2xl">🏛️</span>
            </div>
          </div>

          <div className="text-[11px] tracking-[0.45em] text-[#c8a763] mb-3 uppercase">
            Annual Exhibition · 2025
          </div>
          <h1 className="text-4xl sm:text-[2.7rem] font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#fdf6e6] to-[#d6bd86] mb-3 tracking-wide">
            年度訓練成果展
          </h1>
          <div className="flex items-center justify-center gap-3 text-sm text-[#b9a888]">
            <span className="w-10 h-px bg-[#c8a763]/50" />
            <span>國際評量應用發展協會 × 為恭紀念醫院</span>
            <span className="w-10 h-px bg-[#c8a763]/50" />
          </div>
        </div>

        {/* 成效數據預告 */}
        <div className="flex items-stretch gap-3 sm:gap-5 mb-9">
          {lobbyInfo.stats.map((s) => (
            <div
              key={s.label}
              className="px-5 sm:px-7 py-3 rounded-xl bg-white/[0.04] border border-[#c8a763]/25 backdrop-blur-sm text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold text-[#e8c87a]">
                {s.value}
              </div>
              <div className="text-[10px] sm:text-[11px] text-white/55 mt-0.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* 進入按鈕 */}
        <button
          onClick={onEnter}
          className="group relative px-14 py-4 overflow-hidden rounded-2xl bg-gradient-to-r from-[#7a2230] to-[#9c3040] hover:from-[#8a2838] hover:to-[#b03848] text-[#fdf2e2] text-lg font-bold transition-all duration-300 border border-[#c8a763]/50 shadow-xl shadow-black/40 hover:scale-[1.03]"
        >
          <span className="relative z-10 flex items-center gap-2 tracking-wider">
            進入展覽館
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e8c87a]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>

        {/* 操作說明 */}
        <p className="mt-9 text-[11px] text-white/35 text-center max-w-sm px-6 leading-relaxed">
          進入後可用「上一件／下一件」逐件巡覽，或開「展品目錄」直接點選任一展品
        </p>
      </div>

      {/* 角落金框裝飾 */}
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
            } ${pos.includes("left") ? "left-0" : "right-0"} w-full h-px bg-[#c8a763]`}
          />
          <div
            className={`absolute ${
              pos.includes("top") ? "top-0" : "bottom-0"
            } ${pos.includes("left") ? "left-0" : "right-0"} w-px h-full bg-[#c8a763]`}
          />
        </div>
      ))}
    </div>
  );
}
