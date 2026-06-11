"use client";
import { useRef, useCallback } from "react";

interface VirtualJoystickProps {
  onMove: (input: { x: number; y: number }) => void;
}

export default function VirtualJoystick({ onMove }: VirtualJoystickProps) {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const RADIUS = 40;

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      dragging.current = true;
      startPos.current = { x: clientX, y: clientY };
    },
    []
  );

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!dragging.current || !knobRef.current) return;
      let dx = clientX - startPos.current.x;
      let dy = clientY - startPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > RADIUS) {
        dx = (dx / dist) * RADIUS;
        dy = (dy / dist) * RADIUS;
      }
      knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
      onMove({ x: dx / RADIUS, y: dy / RADIUS });
    },
    [onMove]
  );

  const handleEnd = useCallback(() => {
    dragging.current = false;
    if (knobRef.current) {
      knobRef.current.style.transform = "translate(0px, 0px)";
    }
    onMove({ x: 0, y: 0 });
  }, [onMove]);

  return (
    <div
      ref={baseRef}
      className="fixed bottom-8 left-8 w-28 h-28 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50 touch-none"
      onTouchStart={(e) => {
        const t = e.touches[0];
        handleStart(t.clientX, t.clientY);
      }}
      onTouchMove={(e) => {
        const t = e.touches[0];
        handleMove(t.clientX, t.clientY);
      }}
      onTouchEnd={handleEnd}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
      <div
        ref={knobRef}
        className="w-12 h-12 rounded-full bg-white/40 border-2 border-white/60 transition-none"
      />
    </div>
  );
}
