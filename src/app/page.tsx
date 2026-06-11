"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useExhibition } from "@/hooks/useExhibition";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";
import NavigationBar from "@/components/NavigationBar";
import LoadingScreen from "@/components/LoadingScreen";
import PdfViewer from "@/components/PdfViewer";
import Directory from "@/components/Directory";
import VirtualJoystick from "@/components/VirtualJoystick";

const Exhibition = dynamic(() => import("@/components/Exhibition"), {
  ssr: false,
});

export default function Home() {
  const {
    stops,
    tourIndex,
    currentStop,
    currentZoneIndex,
    controlMode,
    selected,
    directoryOpen,
    isLoading,
    nextStop,
    prevStop,
    goToZone,
    selectExhibit,
    closeViewer,
    toggleMode,
    setDirectoryOpen,
    setLoading,
  } = useExhibition();

  const { isMobile } = useDeviceDetect();
  const [joystickInput, setJoystickInput] = useState({ x: 0, y: 0 });

  const handleJoystickMove = useCallback(
    (input: { x: number; y: number }) => setJoystickInput(input),
    []
  );

  const viewCurrent = useCallback(() => {
    if (currentStop.type !== "zone" && currentStop.id) {
      selectExhibit(currentStop.type, currentStop.id);
    }
  }, [currentStop, selectExhibit]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0a1628]">
      <LoadingScreen visible={isLoading} onEnter={() => setLoading(false)} />

      {!isLoading && (
        <>
          <Exhibition
            cam={currentStop.cam}
            look={currentStop.look}
            controlMode={controlMode}
            joystickInput={joystickInput}
            onSelectExhibit={selectExhibit}
          />

          <NavigationBar
            currentStop={currentStop}
            tourIndex={tourIndex}
            stopCount={stops.length}
            controlMode={controlMode}
            onPrev={prevStop}
            onNext={nextStop}
            onGoToZone={goToZone}
            onToggleMode={toggleMode}
            onOpenDirectory={() => setDirectoryOpen(true)}
            onViewCurrent={viewCurrent}
          />

          {isMobile && controlMode === "free" && (
            <VirtualJoystick onMove={handleJoystickMove} />
          )}

          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40">
            <div className="px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white/80 text-sm">
              {controlMode === "free" ? "🎮 自由探索模式" : "🧭 導覽模式"}
            </div>
          </div>
        </>
      )}

      <Directory
        open={directoryOpen}
        onClose={() => setDirectoryOpen(false)}
        onSelect={selectExhibit}
      />

      {selected && <PdfViewer selected={selected} onClose={closeViewer} />}
    </main>
  );
}
