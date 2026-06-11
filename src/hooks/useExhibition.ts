"use client";
import { create } from "zustand";
import { zones } from "@/data/exhibitions";

// We'll use zustand-like pattern with React state instead to avoid extra dep
import { useState, useCallback } from "react";

export type ControlMode = "guided" | "free";

export interface ExhibitionState {
  currentZoneIndex: number;
  controlMode: ControlMode;
  selectedWorkId: string | null;
  isLoading: boolean;
}

export function useExhibition() {
  const [state, setState] = useState<ExhibitionState>({
    currentZoneIndex: 0,
    controlMode: "guided",
    selectedWorkId: null,
    isLoading: true,
  });

  const goToZone = useCallback((index: number) => {
    if (index >= 0 && index < zones.length) {
      setState((s) => ({ ...s, currentZoneIndex: index }));
    }
  }, []);

  const nextZone = useCallback(() => {
    setState((s) => ({
      ...s,
      currentZoneIndex: Math.min(s.currentZoneIndex + 1, zones.length - 1),
    }));
  }, []);

  const prevZone = useCallback(() => {
    setState((s) => ({
      ...s,
      currentZoneIndex: Math.max(s.currentZoneIndex - 1, 0),
    }));
  }, []);

  const setControlMode = useCallback((mode: ControlMode) => {
    setState((s) => ({ ...s, controlMode: mode }));
  }, []);

  const selectWork = useCallback((id: string | null) => {
    setState((s) => ({ ...s, selectedWorkId: id }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState((s) => ({ ...s, isLoading: loading }));
  }, []);

  return {
    ...state,
    currentZone: zones[state.currentZoneIndex],
    goToZone,
    nextZone,
    prevZone,
    setControlMode,
    selectWork,
    setLoading,
  };
}
