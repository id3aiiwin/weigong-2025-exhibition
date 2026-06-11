"use client";
import { useState, useCallback, useMemo } from "react";
import { buildStops, type StopType } from "@/data/tourStops";

export type ControlMode = "guided" | "free";

export interface SelectedExhibit {
  type: StopType;
  id: string;
}

export function useExhibition() {
  const stops = useMemo(() => buildStops(), []);

  const [tourIndex, setTourIndex] = useState(0);
  const [controlMode, setControlMode] = useState<ControlMode>("guided");
  const [selected, setSelected] = useState<SelectedExhibit | null>(null);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentStop = stops[tourIndex];
  const currentZoneIndex = currentStop.zoneIndex;

  const nextStop = useCallback(() => {
    setTourIndex((i) => Math.min(i + 1, stops.length - 1));
  }, [stops.length]);

  const prevStop = useCallback(() => {
    setTourIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goToZone = useCallback(
    (zoneIndex: number) => {
      const idx = stops.findIndex((s) => s.zoneIndex === zoneIndex);
      if (idx >= 0) setTourIndex(idx);
    },
    [stops]
  );

  const focusExhibit = useCallback(
    (type: StopType, id: string) => {
      const idx = stops.findIndex((s) => s.type === type && s.id === id);
      if (idx >= 0) setTourIndex(idx);
    },
    [stops]
  );

  // 開啟檢視器（同時把鏡頭帶到該展品，若它在巡覽路徑上）
  const selectExhibit = useCallback(
    (type: StopType, id: string) => {
      setSelected({ type, id });
      focusExhibit(type, id);
    },
    [focusExhibit]
  );

  const closeViewer = useCallback(() => setSelected(null), []);

  const toggleMode = useCallback(() => {
    setControlMode((m) => (m === "guided" ? "free" : "guided"));
  }, []);

  return {
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
    focusExhibit,
    selectExhibit,
    closeViewer,
    setControlMode,
    toggleMode,
    setDirectoryOpen,
    setLoading: setIsLoading,
  };
}
