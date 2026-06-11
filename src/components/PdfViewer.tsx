"use client";
import { useState, useEffect } from "react";
import { works, photos, courses } from "@/data/exhibitions";
import { asset } from "@/lib/asset";
import type { SelectedExhibit } from "@/hooks/useExhibition";

interface ExhibitViewerProps {
  selected: SelectedExhibit;
  onClose: () => void;
}

export default function PdfViewer({ selected, onClose }: ExhibitViewerProps) {
  const [page, setPage] = useState(0);

  // 切換展品時重設頁碼
  useEffect(() => {
    setPage(0);
  }, [selected.id]);

  // 整理出統一的顯示資料
  let title = "";
  let subtitle = "";
  let description = "";
  let images: string[] = [];
  let fallbackThumb = "";

  if (selected.type === "work") {
    const w = works.find((x) => x.id === selected.id);
    if (!w) return null;
    title = w.title;
    subtitle = w.author;
    description = w.description;
    images = w.pages;
    fallbackThumb = w.thumbnail;
  } else if (selected.type === "highlight") {
    const p = photos.find((x) => x.id === selected.id);
    if (!p) return null;
    title = "訓練成效亮點";
    subtitle = p.caption;
    images = [p.image];
  } else {
    const c = courses.find((x) => x.id === selected.id);
    if (!c) return null;
    title = c.title;
    subtitle = c.date;
    description = c.description;
    images = [c.image];
  }

  const hasImages = images.length > 0;
  const total = Math.max(images.length, 1);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div
        className="relative w-[92vw] max-w-4xl max-h-[92vh] overflow-y-auto bg-gradient-to-b from-[#0d1f3c] to-[#0a1628] border border-[#4a9eff]/30 rounded-2xl shadow-2xl shadow-blue-900/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 bg-gradient-to-r from-transparent via-[#4a9eff] to-transparent" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl transition-colors"
        >
          ✕
        </button>

        <div className="px-8 pt-6 pb-3">
          <h2 className="text-xl font-bold text-[#e0f0ff] pr-10">{title}</h2>
          {subtitle && <p className="text-sm text-[#7ac4ff] mt-1">{subtitle}</p>}
        </div>

        <div className="px-8 pb-4">
          {hasImages ? (
            <div className="relative aspect-video bg-[#0c1830] rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={asset(images[page])}
                alt={`${title} ${page + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-b from-[#1a2a44] to-[#0c1830] rounded-lg flex flex-col items-center justify-center p-8">
              {fallbackThumb ? (
                <img
                  src={asset(fallbackThumb)}
                  alt={subtitle}
                  className="w-32 h-32 object-contain mb-5 drop-shadow-[0_0_20px_rgba(74,158,255,0.4)]"
                />
              ) : (
                <div className="text-6xl mb-4 opacity-30">📄</div>
              )}
              <p className="text-[#a8cdf0] text-sm leading-relaxed text-center max-w-lg">
                {description}
              </p>
            </div>
          )}
        </div>

        {total > 1 && (
          <div className="px-8 pb-4 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white text-sm transition-colors"
            >
              ← 上一頁
            </button>
            <span className="text-[#8ab4d8] text-sm tabular-nums">
              {page + 1} / {total}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(total - 1, p + 1))}
              disabled={page === total - 1}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white text-sm transition-colors"
            >
              下一頁 →
            </button>
          </div>
        )}

        {description && hasImages && (
          <div className="px-8 pb-6">
            <p className="text-[#8ab4d8] text-sm leading-relaxed">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
