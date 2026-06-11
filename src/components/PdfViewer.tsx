"use client";
import { useState } from "react";
import { works } from "@/data/exhibitions";
import { asset } from "@/lib/asset";

interface PdfViewerProps {
  workId: string;
  onClose: () => void;
}

export default function PdfViewer({ workId, onClose }: PdfViewerProps) {
  const work = works.find((w) => w.id === workId);
  const [currentPage, setCurrentPage] = useState(0);

  if (!work) return null;

  const hasPages = work.pages.length > 0;
  const totalPages = hasPages ? work.pages.length : 1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      {/* 背景模糊 */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* 內容卡片 */}
      <div
        className="relative w-[90vw] max-w-3xl max-h-[90vh] bg-gradient-to-b from-[#0d1f3c] to-[#0a1628] border border-[#4a9eff]/30 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 頂部光條 */}
        <div className="h-1 bg-gradient-to-r from-transparent via-[#4a9eff] to-transparent" />

        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl transition-colors"
        >
          ✕
        </button>

        {/* 標題區 */}
        <div className="px-8 pt-6 pb-4">
          <h2 className="text-xl font-bold text-[#e0f0ff]">{work.title}</h2>
          <p className="text-sm text-[#4a9eff] mt-1">{work.author}</p>
        </div>

        {/* 內容區 */}
        <div className="px-8 pb-4">
          {hasPages ? (
            /* PDF 頁面圖片 */
            <div className="relative aspect-video bg-[#1a2a44] rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={asset(work.pages[currentPage])}
                alt={`${work.title} 第 ${currentPage + 1} 頁`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            /* 無簡報頁時：顯示單位代表圖與說明 */
            <div className="aspect-[3/4] bg-gradient-to-b from-[#1a2a44] to-[#0c1830] rounded-lg flex flex-col items-center justify-center p-8">
              {work.thumbnail ? (
                <img
                  src={asset(work.thumbnail)}
                  alt={work.author}
                  className="w-40 h-40 object-contain mb-6 drop-shadow-[0_0_20px_rgba(74,158,255,0.4)]"
                />
              ) : (
                <div className="text-6xl mb-4 opacity-30">📄</div>
              )}
              <p className="text-[#a8cdf0] text-sm leading-relaxed text-center max-w-md">
                {work.description}
              </p>
            </div>
          )}
        </div>

        {/* 翻頁控制 */}
        {totalPages > 1 && (
          <div className="px-8 pb-6 flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm transition-colors"
            >
              ← 上一頁
            </button>
            <span className="text-[#8ab4d8] text-sm">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
              }
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm transition-colors"
            >
              下一頁 →
            </button>
          </div>
        )}

        {/* 說明文字 */}
        <div className="px-8 pb-6">
          <p className="text-[#8ab4d8] text-sm leading-relaxed">
            {work.description}
          </p>
        </div>
      </div>
    </div>
  );
}
