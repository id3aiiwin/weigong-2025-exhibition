"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { EffectComposer, Vignette } from "@react-three/postprocessing";
import ExhibitionHall from "./ExhibitionHall";
import Zone from "./Zone";
import GuidedTour from "./GuidedTour";
import PlayerControls from "./PlayerControls";
import Particles from "./Particles";
import { zones } from "@/data/exhibitions";
import type { StopType } from "@/data/tourStops";

interface ExhibitionProps {
  cam: [number, number, number];
  look: [number, number, number];
  controlMode: "guided" | "free";
  joystickInput: { x: number; y: number };
  onSelectExhibit: (type: StopType, id: string) => void;
}

export default function Exhibition({
  cam,
  look,
  controlMode,
  joystickInput,
  onSelectExhibit,
}: ExhibitionProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.7, 5], fov: 60, near: 0.1, far: 200 }}
      style={{ width: "100vw", height: "100vh" }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      onCreated={({ gl }) => {
        gl.setClearColor("#e7e1d4");
      }}
    >
      <Suspense fallback={null}>
        <ExhibitionHall />

        {zones.map((zone) => (
          <Zone
            key={zone.id}
            zoneId={zone.id}
            onSelectExhibit={onSelectExhibit}
          />
        ))}

        <Particles count={140} />

        <GuidedTour cam={cam} look={look} enabled={controlMode === "guided"} />

        <PlayerControls
          enabled={controlMode === "free"}
          joystickInput={joystickInput}
        />

        {/* 明亮暖調空氣感霧氣 */}
        <fog attach="fog" args={["#e3ddd0", 26, 110]} />

        {/* 後處理：僅保留極淡暈影，移除科幻泛光 */}
        <EffectComposer>
          <Vignette eskil={false} offset={0.25} darkness={0.45} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
