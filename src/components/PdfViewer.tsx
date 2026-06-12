"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { works, photos, courses } from "@/data/exhibitions";
import { asset } from "@/lib/asset";
import type { SelectedExhibit } from "@/hooks/useExhibition";

interface ExhibitViewerProps {
  selected: SelectedExhibit;
  onClose: () => void;
}

const MAX_ZOOM = 4;
const MIN_ZOOM = 1;

export default function PdfViewer({ selected, onClose }: ExhibitViewerProps) {
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(
    null
  );

  // 切換展品時跳到指定頁（預設第一頁）
  useEffect(() => {
    setPage(selected.page ?? 0);
  }, [selected.id, selected.page]);

  // 換頁時重設縮放
  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);
  useEffect(() => {
    resetZoom();
  }, [page, selected.id, resetZoom]);

  const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, +(z + 0.5).toFixed(2)));
  const zoomOut = () =>
    setZoom((z) => {
      const nz = Math.max(MIN_ZOOM, +(z - 0.5).toFixed(2));
      if (nz === 1) setPan({ x: 0, y: 0 });
      return nz;
    });

  const onWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (zoom <= 1) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setPan({
      x: drag.current.px + (e.clientX - drag.current.x),
      y: drag.current.py + (e.clientY - drag.current.y),
    });
  };
  const onPointerUp = () => {
    drag.current = null;
  };

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
        className="relative w-[94vw] max-w-4xl max-h-[94vh] overflow-y-auto bg-gradient-to-b from-[#0d1f3c] to-[#0a1628] border border-[#b18f4d]/40 rounded-2xl shadow-2xl shadow-black/40"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 bg-gradient-to-r from-transparent via-[#c8a763] to-transparent" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl transition-colors"
        >
          ✕
        </button>

        <div className="px-6 sm:px-8 pt-6 pb-3">
          <h2 className="text-xl font-bold text-[#f0e6cf] pr-10">{title}</h2>
          {subtitle && <p className="text-sm text-[#d6bd86] mt-1">{subtitle}</p>}
        </div>

        <div className="px-4 sm:px-6 pb-3">
          {hasImages ? (
            <div
              className="relative h-[58vh] bg-[#0c1830] rounded-lg overflow-hidden flex items-center justify-center select-none"
              onWheel={onWheel}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
              onDoubleClick={() => (zoom > 1 ? resetZoom() : setZoom(2))}
              style={{
                cursor: zoom > 1 ? (drag.current ? "grabbing" : "grab") : "default",
              }}
            >
              <img
                src={asset(images[page])}
                alt={`${title} ${page + 1}`}
                draggable={false}
                className="max-w-full max-h-full object-contain"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transition: drag.current ? "none" : "transform 0.15s ease-out",
                }}
              />

              {/* 縮放工具列 */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/55 backdrop-blur-sm rounded-full px-1.5 py-1 border border-white/15">
                <button
                  onClick={zoomOut}
                  disabled={zoom <= MIN_ZOOM}
                  className="w-9 h-9 rounded-full hover:bg-white/15 disabled:opacity-30 text-white text-lg flex items-center justify-center"
                  title="縮小"
                >
                  −
                </button>
                <span className="text-white/85 text-xs tabular-nums w-12 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  disabled={zoom >= MAX_ZOOM}
                  className="w-9 h-9 rounded-full hover:bg-white/15 disabled:opacity-30 text-white text-lg flex items-center justify-center"
                  title="放大"
                >
                  ＋
                </button>
                {zoom > 1 && (
                  <button
                    onClick={resetZoom}
                    className="w-9 h-9 rounded-full hover:bg-white/15 text-white text-sm flex items-center justify-center"
                    title="重設"
                  >
                    ↺
                  </button>
                )}
              </div>

              {/* 放大提示 */}
              {zoom === 1 && (
                <div className="absolute bottom-3 left-3 text-white/55 text-[11px] bg-black/40 rounded-full px-3 py-1.5 pointer-events-none">
                  🔍 點＋放大看內文（放大後可拖曳）
                </div>
              )}
            </div>
          ) : (
            <div className="h-[40vh] bg-gradient-to-b from-[#1a2a44] to-[#0c1830] rounded-lg flex flex-col items-center justify-center p-8">
              {fallbackThumb ? (
                <img
                  src={asset(fallbackThumb)}
                  alt={subtitle}
                  className="w-32 h-32 object-contain mb-5 drop-shadow-[0_0_20px_rgba(177,143,77,0.4)]"
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
          <div className="px-6 sm:px-8 pb-4 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white text-sm transition-colors"
            >
              ← 上一頁
            </button>
            <span className="text-[#d6bd86] text-sm tabular-nums">
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
          <div className="px-6 sm:px-8 pb-6">
            <p className="text-[#8ab4d8] text-sm leading-relaxed">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
