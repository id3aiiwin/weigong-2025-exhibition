"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useExhibition } from "@/hooks/useExhibition";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";
import NavigationBar from "@/components/NavigationBar";
import LoadingScreen from "@/components/LoadingScreen";
import PdfViewer from "@/components/PdfViewer";
import VirtualJoystick from "@/components/VirtualJoystick";

// Dynamic import to avoid SSR issues with Three.js
const Exhibition = dynamic(() => import("@/components/Exhibition"), {
  ssr: false,
});

export default function Home() {
  const {
    currentZoneIndex,
    controlMode,
    selectedWorkId,
    isLoading,
    nextZone,
    prevZone,
    goToZone,
    setControlMode,
    selectWork,
    setLoading,
  } = useExhibition();

  const { isMobile } = useDeviceDetect();
  const [joystickInput, setJoystickInput] = useState({ x: 0, y: 0 });

  const handleEnter = useCallback(() => {
    setLoading(false);
  }, [setLoading]);

  const handleToggleMode = useCallback(() => {
    setControlMode(controlMode === "guided" ? "free" : "guided");
  }, [controlMode, setControlMode]);

  const handleJoystickMove = useCallback(
    (input: { x: number; y: number }) => {
      setJoystickInput(input);
    },
    []
  );

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0a1628]">
      {/* 載入畫面 */}
      <LoadingScreen visible={isLoading} onEnter={handleEnter} />

      {/* 3D 展館 */}
      {!isLoading && (
        <>
          <Exhibition
            currentZoneIndex={currentZoneIndex}
            controlMode={controlMode}
            joystickInput={joystickInput}
            onSelectWork={selectWork}
          />

          {/* 導覽列 */}
          <NavigationBar
            currentZoneIndex={currentZoneIndex}
            controlMode={controlMode}
            onPrev={prevZone}
            onNext={nextZone}
            onGoToZone={goToZone}
            onToggleMode={handleToggleMode}
          />

          {/* 行動裝置虛擬搖桿（僅在自由走動模式） */}
          {isMobile && controlMode === "free" && (
            <VirtualJoystick onMove={handleJoystickMove} />
          )}

          {/* 目前展區名稱 */}
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <div className="px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white/80 text-sm">
              {controlMode === "free" && "🎮 自由探索模式 — "}
              按 ESC 退出
            </div>
          </div>
        </>
      )}

      {/* PDF 檢視器 */}
      {selectedWorkId && (
        <PdfViewer
          workId={selectedWorkId}
          onClose={() => selectWork(null)}
        />
      )}
    </main>
  );
}
