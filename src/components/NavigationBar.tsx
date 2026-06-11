"use client";
import { zones } from "@/data/exhibitions";
import type { ControlMode } from "@/hooks/useExhibition";
import type { Stop } from "@/data/tourStops";

interface NavigationBarProps {
  currentStop: Stop;
  tourIndex: number;
  stopCount: number;
  controlMode: ControlMode;
  onPrev: () => void;
  onNext: () => void;
  onGoToZone: (index: number) => void;
  onToggleMode: () => void;
  onOpenDirectory: () => void;
  onViewCurrent: () => void;
}

export default function NavigationBar({
  currentStop,
  tourIndex,
  stopCount,
  controlMode,
  onPrev,
  onNext,
  onGoToZone,
  onToggleMode,
  onOpenDirectory,
  onViewCurrent,
}: NavigationBarProps) {
  const isFirst = tourIndex === 0;
  const isLast = tourIndex === stopCount - 1;
  const isExhibit = currentStop.type !== "zone";
  const zoneName = zones[currentStop.zoneIndex].name;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="flex flex-col items-center gap-2.5 pb-5 px-3">
        {/* 展區指示器 */}
        <div className="flex gap-2 pointer-events-auto">
          {zones.map((zone, i) => (
            <button
              key={zone.id}
              onClick={() => onGoToZone(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                i === currentStop.zoneIndex
                  ? "bg-[#4a9eff] text-white shadow-lg shadow-blue-500/30"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {zone.name}
            </button>
          ))}
        </div>

        {/* 目前位置標示 */}
        {controlMode === "guided" && (
          <div className="pointer-events-auto px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-[11px] text-white/80">
            {isExhibit ? `📍 ${zoneName}｜${currentStop.label}` : `📍 ${zoneName}`}
          </div>
        )}

        {/* 操作列 */}
        <div className="flex items-center gap-2 pointer-events-auto flex-wrap justify-center">
          {controlMode === "guided" && (
            <>
              <button
                onClick={onPrev}
                disabled={isFirst}
                className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 disabled:opacity-30 text-white text-sm font-medium transition-all backdrop-blur-sm border border-white/10"
              >
                ← 上一件
              </button>
              {isExhibit && (
                <button
                  onClick={onViewCurrent}
                  className="px-4 py-2.5 rounded-xl bg-[#4a9eff] hover:bg-[#5aa8ff] text-white text-sm font-semibold transition-all shadow-lg shadow-blue-500/30"
                >
                  🔍 查看
                </button>
              )}
              <button
                onClick={onNext}
                disabled={isLast}
                className="px-4 py-2.5 rounded-xl bg-[#4a9eff]/80 hover:bg-[#4a9eff] disabled:opacity-30 text-white text-sm font-medium transition-all backdrop-blur-sm border border-[#4a9eff]/30"
              >
                下一件 →
              </button>
            </>
          )}

          <button
            onClick={onOpenDirectory}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/85 text-xs transition-all backdrop-blur-sm border border-white/10"
          >
            📂 展品目錄
          </button>

          <button
            onClick={onToggleMode}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-xs transition-all backdrop-blur-sm border border-white/10"
          >
            {controlMode === "guided" ? "🎮 自由探索" : "🧭 導覽模式"}
          </button>
        </div>
      </div>
    </div>
  );
}
