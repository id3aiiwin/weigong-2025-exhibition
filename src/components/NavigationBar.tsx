"use client";
import { zones } from "@/data/exhibitions";
import type { ControlMode } from "@/hooks/useExhibition";

interface NavigationBarProps {
  currentZoneIndex: number;
  controlMode: ControlMode;
  onPrev: () => void;
  onNext: () => void;
  onGoToZone: (index: number) => void;
  onToggleMode: () => void;
}

export default function NavigationBar({
  currentZoneIndex,
  controlMode,
  onPrev,
  onNext,
  onGoToZone,
  onToggleMode,
}: NavigationBarProps) {
  const isFirst = currentZoneIndex === 0;
  const isLast = currentZoneIndex === zones.length - 1;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="flex flex-col items-center gap-3 pb-6 px-4">
        {/* 展區指示器 */}
        <div className="flex gap-2 pointer-events-auto">
          {zones.map((zone, i) => (
            <button
              key={zone.id}
              onClick={() => onGoToZone(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                i === currentZoneIndex
                  ? "bg-[#4a9eff] text-white shadow-lg shadow-blue-500/30"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {zone.name}
            </button>
          ))}
        </div>

        {/* 導覽按鈕 */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {controlMode === "guided" && (
            <>
              <button
                onClick={onPrev}
                disabled={isFirst}
                className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-medium transition-all backdrop-blur-sm border border-white/10"
              >
                ← 上一區
              </button>
              <button
                onClick={onNext}
                disabled={isLast}
                className="px-5 py-2.5 rounded-xl bg-[#4a9eff]/80 hover:bg-[#4a9eff] disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-medium transition-all backdrop-blur-sm border border-[#4a9eff]/30 shadow-lg shadow-blue-500/20"
              >
                下一區 →
              </button>
            </>
          )}

          {/* 模式切換 */}
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
