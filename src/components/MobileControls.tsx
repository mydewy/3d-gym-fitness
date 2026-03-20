import { useRef, useCallback, useEffect, useState } from 'react';

interface MobileControlsProps {
  onMove: (x: number, y: number) => void;
  onAction: () => void;
  onDance: () => void;
  onJump: () => void;
}

export function MobileControls({ onMove, onAction, onDance, onJump }: MobileControlsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const activeTouch = useRef<number | null>(null);
  const centerRef = useRef({ x: 0, y: 0 });
  const RADIUS = 50;

  useEffect(() => {
    const check = () => setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleStart = useCallback((e: React.TouchEvent) => {
    if (activeTouch.current !== null) return;
    const touch = e.changedTouches[0];
    activeTouch.current = touch.identifier;
    const rect = joystickRef.current!.getBoundingClientRect();
    centerRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    updateKnob(touch.clientX, touch.clientY);
  }, []);

  const handleMove = useCallback((e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === activeTouch.current) {
        updateKnob(touch.clientX, touch.clientY);
        break;
      }
    }
  }, []);

  const handleEnd = useCallback((e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouch.current) {
        activeTouch.current = null;
        if (knobRef.current) {
          knobRef.current.style.transform = 'translate(-50%, -50%)';
        }
        onMove(0, 0);
        break;
      }
    }
  }, [onMove]);

  const updateKnob = useCallback((cx: number, cy: number) => {
    const dx = cx - centerRef.current.x;
    const dy = cy - centerRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const clampedDist = Math.min(dist, RADIUS);
    const angle = Math.atan2(dy, dx);
    const nx = Math.cos(angle) * clampedDist;
    const ny = Math.sin(angle) * clampedDist;

    if (knobRef.current) {
      knobRef.current.style.transform = `translate(calc(-50% + ${nx}px), calc(-50% + ${ny}px))`;
    }

    const normX = clampedDist > 5 ? (nx / RADIUS) : 0;
    const normY = clampedDist > 5 ? (ny / RADIUS) : 0;
    onMove(normX, normY);
  }, [onMove]);

  if (!isMobile) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, top: 0,
      pointerEvents: 'none', zIndex: 20,
    }}>
      {/* Joystick */}
      <div
        ref={joystickRef}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onTouchCancel={handleEnd}
        style={{
          position: 'absolute', bottom: 40, left: 40,
          width: 120, height: 120,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          border: '2px solid rgba(255,255,255,0.25)',
          pointerEvents: 'auto',
          touchAction: 'none',
        }}
      >
        <div
          ref={knobRef}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 48, height: 48,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.35)',
            border: '2px solid rgba(255,255,255,0.5)',
          }}
        />
      </div>

      {/* Action button */}
      <div
        onTouchStart={(e) => { e.preventDefault(); onAction(); }}
        style={{
          position: 'absolute', bottom: 60, right: 40,
          width: 72, height: 72,
          borderRadius: '50%',
          background: 'rgba(255,100,68,0.4)',
          border: '2px solid rgba(255,100,68,0.7)',
          pointerEvents: 'auto',
          touchAction: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: 11, fontWeight: 'bold',
          fontFamily: "'Press Start 2P', monospace",
          textShadow: '0 1px 3px rgba(0,0,0,0.5)',
        }}
      >
        ACT
      </div>

      {/* Jump button */}
      <div
        onTouchStart={(e) => { e.preventDefault(); onJump(); }}
        style={{
          position: 'absolute', bottom: 150, right: 40,
          width: 56, height: 56,
          borderRadius: '50%',
          background: 'rgba(68,200,100,0.4)',
          border: '2px solid rgba(68,200,100,0.7)',
          pointerEvents: 'auto',
          touchAction: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: 9, fontWeight: 'bold',
          fontFamily: "'Press Start 2P', monospace",
          textShadow: '0 1px 3px rgba(0,0,0,0.5)',
        }}
      >
        JUMP
      </div>

      {/* Dance button */}
      <div
        onTouchStart={(e) => { e.preventDefault(); onDance(); }}
        style={{
          position: 'absolute', bottom: 220, right: 50,
          width: 56, height: 56,
          borderRadius: '50%',
          background: 'rgba(200,100,255,0.4)',
          border: '2px solid rgba(200,100,255,0.7)',
          pointerEvents: 'auto',
          touchAction: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: 9, fontWeight: 'bold',
          fontFamily: "'Press Start 2P', monospace",
          textShadow: '0 1px 3px rgba(0,0,0,0.5)',
        }}
      >
        DANCE
      </div>
    </div>
  );
}
