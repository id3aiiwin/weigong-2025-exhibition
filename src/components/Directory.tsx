"use client";
import { works, photos, courses } from "@/data/exhibitions";
import { asset } from "@/lib/asset";
import type { StopType } from "@/data/tourStops";

interface DirectoryProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: StopType, id: string) => void;
}

export default function Directory({ open, onClose, onSelect }: DirectoryProps) {
  if (!open) return null;

  const pick = (type: StopType, id: string) => {
    onSelect(type, id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div
        className="relative w-full sm:w-[92vw] max-w-5xl max-h-[88vh] overflow-y-auto bg-gradient-to-b from-[#0d1f3c] to-[#0a1628] border border-[#4a9eff]/30 sm:rounded-2xl rounded-t-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#0d1f3c]/95 backdrop-blur border-b border-white/10">
          <h2 className="text-lg font-bold text-[#e0f0ff]">展品目錄</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            ✕
          </button>
        </div>

        {/* 同仁成果 */}
        <section className="px-6 pt-5">
          <h3 className="text-sm font-semibold text-[#7ac4ff] mb-3">
            同仁成果 · 共 {works.length} 位
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {works.map((w, i) => (
              <button
                key={w.id}
                onClick={() => pick("work", w.id)}
                className="group text-left rounded-xl overflow-hidden bg-white/5 hover:bg-[#4a9eff]/20 border border-white/10 hover:border-[#4a9eff]/50 transition-all"
              >
                <div className="aspect-square bg-[#0c1830] overflow-hidden flex items-center justify-center">
                  <img
                    src={asset(w.thumbnail)}
                    alt={w.author}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="px-2 py-1.5">
                  <div className="text-[11px] text-white/90 truncate">{w.author}</div>
                  <div className="text-[10px] text-white/40">
                    {w.pages.length > 0 ? `${w.pages.length} 份文件` : "簡介"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 成效亮點 */}
        <section className="px-6 pt-6">
          <h3 className="text-sm font-semibold text-[#7ac4ff] mb-3">訓練成效亮點</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((p) => (
              <button
                key={p.id}
                onClick={() => pick("highlight", p.id)}
                className="group text-left rounded-xl overflow-hidden bg-white/5 hover:bg-[#4a9eff]/20 border border-white/10 hover:border-[#4a9eff]/50 transition-all"
              >
                <div className="aspect-video bg-[#0c1830] overflow-hidden">
                  <img src={asset(p.image)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="px-2.5 py-2 text-[11px] text-white/80 leading-snug">{p.caption}</div>
              </button>
            ))}
          </div>
        </section>

        {/* 2026 展望 */}
        <section className="px-6 pt-6 pb-8">
          <h3 className="text-sm font-semibold text-[#7ac4ff] mb-3">2026 課程與展望</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {courses.map((c) => (
              <button
                key={c.id}
                onClick={() => pick("course", c.id)}
                className="group text-left rounded-xl overflow-hidden bg-white/5 hover:bg-[#4a9eff]/20 border border-white/10 hover:border-[#4a9eff]/50 transition-all"
              >
                <div className="aspect-[3/4] bg-[#0c1830] overflow-hidden">
                  <img src={asset(c.image)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="px-2 py-1.5 text-[11px] text-white/85 truncate">{c.title}</div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
