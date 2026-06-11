"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import ExhibitionHall from "./ExhibitionHall";
import Zone from "./Zone";
import GuidedTour from "./GuidedTour";
import PlayerControls from "./PlayerControls";
import Particles from "./Particles";
import { zones } from "@/data/exhibitions";

interface ExhibitionProps {
  currentZoneIndex: number;
  controlMode: "guided" | "free";
  joystickInput: { x: number; y: number };
  onSelectWork: (id: string) => void;
}

export default function Exhibition({
  currentZoneIndex,
  controlMode,
  joystickInput,
  onSelectWork,
}: ExhibitionProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.7, 5], fov: 65, near: 0.1, far: 200 }}
      style={{ width: "100vw", height: "100vh" }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      onCreated={({ gl }) => {
        gl.setClearColor("#050a18");
      }}
    >
      <Suspense fallback={null}>
        <ExhibitionHall />

        {zones.map((zone) => (
          <Zone
            key={zone.id}
            zoneId={zone.id}
            onSelectWork={onSelectWork}
          />
        ))}

        <Particles count={300} />

        <GuidedTour
          currentZoneIndex={currentZoneIndex}
          enabled={controlMode === "guided"}
        />

        <PlayerControls
          enabled={controlMode === "free"}
          joystickInput={joystickInput}
        />

        {/* 深度霧氣 */}
        <fog attach="fog" args={["#050a18", 15, 70]} />

        {/* 後處理特效 */}
        <EffectComposer>
          <Bloom
            intensity={1.2}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.1} darkness={0.7} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
