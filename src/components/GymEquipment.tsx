import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { handPositions } from '../store/handPositions';

function Box({ position, args, color, rotation }: {
  position: [number, number, number];
  args: [number, number, number];
  color: string;
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Cyl({ position, args, color, rotation }: {
  position: [number, number, number];
  args: [number, number, number, number];
  color: string;
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={args} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function MetalCyl({ position, args, color, rotation }: {
  position: [number, number, number];
  args: [number, number, number, number];
  color: string;
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={args} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

// ========== BARBELL (-6, 0, -4) ==========
function Barbell() {
  const barY = 0.35;
  return (
    <group>
      <MetalCyl position={[-6, barY, -4]} args={[0.05, 0.05, 2.8, 8]} color="#c0c0c0" rotation={[0, 0, Math.PI / 2]} />
      <Cyl position={[-7.2, barY, -4]} args={[0.35, 0.35, 0.12, 16]} color="#cc2222" rotation={[0, 0, Math.PI / 2]} />
      <Cyl position={[-7.35, barY, -4]} args={[0.3, 0.3, 0.1, 16]} color="#aa1111" rotation={[0, 0, Math.PI / 2]} />
      <Cyl position={[-4.8, barY, -4]} args={[0.35, 0.35, 0.12, 16]} color="#2222cc" rotation={[0, 0, Math.PI / 2]} />
      <Cyl position={[-4.65, barY, -4]} args={[0.3, 0.3, 0.1, 16]} color="#1111aa" rotation={[0, 0, Math.PI / 2]} />
      <Cyl position={[-7.05, barY, -4]} args={[0.08, 0.08, 0.08, 8]} color="#888888" rotation={[0, 0, Math.PI / 2]} />
      <Cyl position={[-4.95, barY, -4]} args={[0.08, 0.08, 0.08, 8]} color="#888888" rotation={[0, 0, Math.PI / 2]} />
    </group>
  );
}

// ========== DUMBBELL RACK (0, 0, -4) ==========
function DumbbellRack() {
  return (
    <group>
      <Box position={[0, 0.5, -5.2]} args={[2.8, 0.1, 0.6]} color="#333333" />
      <Box position={[-1.2, 0.25, -5.2]} args={[0.1, 0.5, 0.5]} color="#333333" />
      <Box position={[1.2, 0.25, -5.2]} args={[0.1, 0.5, 0.5]} color="#333333" />
      <Box position={[-0.6, 0.65, -5.2]} args={[0.15, 0.15, 0.55]} color="#aaaaaa" />
      <Box position={[-0.6, 0.65, -5.5]} args={[0.3, 0.3, 0.1]} color="#ff6600" />
      <Box position={[-0.6, 0.65, -4.9]} args={[0.3, 0.3, 0.1]} color="#ff6600" />
      <Box position={[0, 0.65, -5.2]} args={[0.15, 0.15, 0.55]} color="#aaaaaa" />
      <Box position={[0, 0.65, -5.5]} args={[0.35, 0.35, 0.1]} color="#22aa22" />
      <Box position={[0, 0.65, -4.9]} args={[0.35, 0.35, 0.1]} color="#22aa22" />
      <Box position={[0.6, 0.65, -5.2]} args={[0.15, 0.15, 0.55]} color="#aaaaaa" />
      <Box position={[0.6, 0.65, -5.5]} args={[0.4, 0.4, 0.1]} color="#cc2222" />
      <Box position={[0.6, 0.65, -4.9]} args={[0.4, 0.4, 0.1]} color="#cc2222" />
    </group>
  );
}

// ========== KETTLEBELL (6, 0, -4) ==========
function Kettlebells() {
  return (
    <group>
      <mesh position={[5.6, 0.3, -4]} castShadow>
        <sphereGeometry args={[0.28, 8, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <Cyl position={[5.6, 0.65, -4]} args={[0.15, 0.15, 0.06, 8]} color="#333333" />
      <Box position={[5.6, 0.55, -4]} args={[0.04, 0.2, 0.04]} color="#333333" />
      <Box position={[5.48, 0.55, -4]} args={[0.04, 0.2, 0.04]} color="#333333" />
      <Box position={[5.72, 0.55, -4]} args={[0.04, 0.2, 0.04]} color="#333333" />
      <mesh position={[6.3, 0.35, -4]} castShadow>
        <sphereGeometry args={[0.33, 8, 8]} />
        <meshStandardMaterial color="#cc3300" />
      </mesh>
      <Cyl position={[6.3, 0.75, -4]} args={[0.17, 0.17, 0.06, 8]} color="#333333" />
      <Box position={[6.3, 0.63, -4]} args={[0.04, 0.22, 0.04]} color="#333333" />
      <Box position={[6.15, 0.63, -4]} args={[0.04, 0.22, 0.04]} color="#333333" />
      <Box position={[6.45, 0.63, -4]} args={[0.04, 0.22, 0.04]} color="#333333" />
      <mesh position={[6.9, 0.32, -3.7]} castShadow>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#ddaa00" />
      </mesh>
      <Cyl position={[6.9, 0.7, -3.7]} args={[0.16, 0.16, 0.06, 8]} color="#333333" />
      <Box position={[6.9, 0.58, -3.7]} args={[0.04, 0.2, 0.04]} color="#333333" />
      <Box position={[6.76, 0.58, -3.7]} args={[0.04, 0.2, 0.04]} color="#333333" />
      <Box position={[7.04, 0.58, -3.7]} args={[0.04, 0.2, 0.04]} color="#333333" />
    </group>
  );
}

// ========== JUMP ROPE (-6, 0, 4) ==========
function JumpRope() {
  const isExercising = useGameStore(s => s.isExercising);
  const currentExercise = useGameStore(s => s.currentExercise);
  const isJumping = isExercising && currentExercise === 'jumprope';

  const ropeGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.3, 0.35, 0),
      new THREE.Vector3(-0.15, 0.05, 0.15),
      new THREE.Vector3(0, -0.02, 0.2),
      new THREE.Vector3(0.15, 0.05, 0.15),
      new THREE.Vector3(0.3, 0.35, 0),
    ]);
    return new THREE.TubeGeometry(curve, 20, 0.025, 8, false);
  }, []);

  if (isJumping) return null;

  return (
    <group>
      <Cyl position={[-6.3, 0.2, 4]} args={[0.05, 0.05, 0.35, 6]} color="#ff4488" />
      <Cyl position={[-6.3, 0.4, 4]} args={[0.06, 0.06, 0.06, 6]} color="#ffaacc" />
      <Cyl position={[-5.7, 0.2, 4]} args={[0.05, 0.05, 0.35, 6]} color="#ff4488" />
      <Cyl position={[-5.7, 0.4, 4]} args={[0.06, 0.06, 0.06, 6]} color="#ffaacc" />
      <mesh position={[-6, 0.04, 4]} geometry={ropeGeo}>
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
}

// ========== PULL-UP BAR (4, 0, 4) ==========
function PullUpBar() {
  return (
    <group>
      <Box position={[2.8, 2, 4]} args={[0.2, 4, 0.2]} color="#222222" />
      <Box position={[5.2, 2, 4]} args={[0.2, 4, 0.2]} color="#222222" />
      <Box position={[4, 0.3, 4]} args={[2.6, 0.1, 0.15]} color="#333333" />
      <MetalCyl position={[4, 4, 4]} args={[0.05, 0.05, 2.6, 12]} color="#c0c0c0" rotation={[0, 0, 1.57]} />
      <MetalCyl position={[4, 3.5, 3.8]} args={[0.04, 0.04, 2.2, 12]} color="#aaaaaa" rotation={[0, 0, 1.57]} />
    </group>
  );
}

// ========== RINGS (4, 0, 8) ==========
// Ring Y positions animated during muscle-up
function Rings() {
  const isExercising = useGameStore(s => s.isExercising);
  const currentExercise = useGameStore(s => s.currentExercise);
  const isRings = isExercising && currentExercise === 'rings';

  const leftStrapRef = useRef<THREE.Mesh>(null!);
  const rightStrapRef = useRef<THREE.Mesh>(null!);
  const leftRingRef = useRef<THREE.Mesh>(null!);
  const rightRingRef = useRef<THREE.Mesh>(null!);

  // Default ring height and strap center
  const TOP_Y = 7.0; // where straps attach to top bar
  const DEFAULT_RING_Y = 2.0;
  const LEFT_X = 3.5;
  const RIGHT_X = 4.5;
  const Z = 8;

  useFrame(() => {
    let ringLY = DEFAULT_RING_Y;
    let ringRY = DEFAULT_RING_Y;
    let leftX = LEFT_X;
    let rightX = RIGHT_X;

    if (isRings && handPositions.active) {
      // Directly use hand world positions
      leftX = handPositions.left.x;
      ringLY = handPositions.left.y;
      rightX = handPositions.right.x;
      ringRY = handPositions.right.y;
    }

    // Update ring positions
    if (leftRingRef.current) {
      leftRingRef.current.position.x = leftX;
      leftRingRef.current.position.y = ringLY;
    }
    if (rightRingRef.current) {
      rightRingRef.current.position.x = rightX;
      rightRingRef.current.position.y = ringRY;
    }

    // Update straps: each strap goes from TOP_Y down to its ring
    if (leftStrapRef.current) {
      const h = TOP_Y - ringLY;
      leftStrapRef.current.position.x = leftX;
      leftStrapRef.current.position.y = ringLY + h / 2;
      leftStrapRef.current.scale.y = h / 5.0;
    }
    if (rightStrapRef.current) {
      const h = TOP_Y - ringRY;
      rightStrapRef.current.position.x = rightX;
      rightStrapRef.current.position.y = ringRY + h / 2;
      rightStrapRef.current.scale.y = h / 5.0;
    }
  });

  return (
    <group>
      {/* Frame posts */}
      <Box position={[2.8, 3.5, 8]} args={[0.2, 7, 0.2]} color="#222222" />
      <Box position={[5.2, 3.5, 8]} args={[0.2, 7, 0.2]} color="#222222" />
      {/* Top bar */}
      <Box position={[4, 7, 8]} args={[2.6, 0.15, 0.15]} color="#222222" />
      {/* Cross brace */}
      <Box position={[4, 0.3, 8]} args={[2.6, 0.1, 0.15]} color="#333333" />

      {/* Left strap (dynamic) */}
      <mesh ref={leftStrapRef} position={[LEFT_X, 4.5, Z]}>
        <boxGeometry args={[0.04, 5.0, 0.04]} />
        <meshStandardMaterial color="#ffcc00" />
      </mesh>
      {/* Left ring (dynamic) */}
      <mesh ref={leftRingRef} position={[LEFT_X, DEFAULT_RING_Y, Z]}>
        <torusGeometry args={[0.16, 0.025, 8, 16]} />
        <meshStandardMaterial color="#dddddd" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Right strap (dynamic) */}
      <mesh ref={rightStrapRef} position={[RIGHT_X, 4.5, Z]}>
        <boxGeometry args={[0.04, 5.0, 0.04]} />
        <meshStandardMaterial color="#ffcc00" />
      </mesh>
      {/* Right ring (dynamic) */}
      <mesh ref={rightRingRef} position={[RIGHT_X, DEFAULT_RING_Y, Z]}>
        <torusGeometry args={[0.16, 0.025, 8, 16]} />
        <meshStandardMaterial color="#dddddd" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

// ========== GYM SIGN ("DURI GYM") - pixel art style ==========
// 5x7 pixel font bitmaps for each character
const PIXEL_FONT: Record<string, number[]> = {
  D: [0b11110,0b10001,0b10001,0b10001,0b10001,0b10001,0b11110],
  U: [0b10001,0b10001,0b10001,0b10001,0b10001,0b10001,0b01110],
  R: [0b11110,0b10001,0b10001,0b11110,0b10100,0b10010,0b10001],
  I: [0b01110,0b00100,0b00100,0b00100,0b00100,0b00100,0b01110],
  G: [0b01110,0b10001,0b10000,0b10111,0b10001,0b10001,0b01110],
  Y: [0b10001,0b10001,0b01010,0b00100,0b00100,0b00100,0b00100],
  M: [0b10001,0b11011,0b10101,0b10101,0b10001,0b10001,0b10001],
  ' ': [0b00000,0b00000,0b00000,0b00000,0b00000,0b00000,0b00000],
};

function GymSign() {
  const texture = useMemo(() => {
    // Small canvas, then scale up with nearest-neighbor for crisp pixels
    const text = 'DURI GYM';
    const charW = 5;
    const charH = 7;
    const gap = 1;
    const padding = 2;
    const totalW = text.length * (charW + gap) - gap + padding * 2;
    const totalH = charH + padding * 2;

    // Draw at tiny resolution
    const small = document.createElement('canvas');
    small.width = totalW;
    small.height = totalH;
    const sCtx = small.getContext('2d')!;
    sCtx.fillStyle = '#0a1a3a';
    sCtx.fillRect(0, 0, totalW, totalH);

    // Draw each character pixel by pixel
    for (let ci = 0; ci < text.length; ci++) {
      const ch = text[ci];
      const bitmap = PIXEL_FONT[ch] || PIXEL_FONT[' '];
      const ox = padding + ci * (charW + gap);
      for (let row = 0; row < charH; row++) {
        for (let col = 0; col < charW; col++) {
          const bit = (bitmap[row] >> (charW - 1 - col)) & 1;
          if (bit) {
            sCtx.fillStyle = '#ffffff';
            sCtx.fillRect(ox + col, padding + row, 1, 1);
          }
        }
      }
    }

    // Scale up to larger canvas with nearest-neighbor
    const scale = 5;
    const big = document.createElement('canvas');
    big.width = totalW * scale;
    big.height = totalH * scale;
    const bCtx = big.getContext('2d')!;
    bCtx.imageSmoothingEnabled = false;
    bCtx.drawImage(small, 0, 0, big.width, big.height);

    const t = new THREE.CanvasTexture(big);
    t.minFilter = THREE.NearestFilter;
    t.magFilter = THREE.NearestFilter;
    return t;
  }, []);

  return (
    <mesh position={[0, 2.8, -11.68]}>
      <planeGeometry args={[24, 1.2]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

// ========== GYM TIMER (CrossFit-style segment display) ==========
// 7-segment display patterns: each segment [a,b,c,d,e,f,g] = top, top-right, bottom-right, bottom, bottom-left, top-left, middle
const SEVEN_SEG: Record<string, boolean[]> = {
  '0': [true, true, true, true, true, true, false],
  '1': [false, true, true, false, false, false, false],
  '2': [true, true, false, true, true, false, true],
  '3': [true, true, true, true, false, false, true],
  '4': [false, true, true, false, false, true, true],
  '5': [true, false, true, true, false, true, true],
  '6': [true, false, true, true, true, true, true],
  '7': [true, true, true, false, false, false, false],
  '8': [true, true, true, true, true, true, true],
  '9': [true, true, true, true, false, true, true],
  'F': [true, false, false, false, true, true, true],
  'R': [true, false, false, false, true, true, true], // same as F for simplicity
  ' ': [false, false, false, false, false, false, false],
};

function drawSegment(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  segments: boolean[], color: string, dimColor: string
) {
  const sw = w * 0.18; // segment width
  const sh = h * 0.03; // segment thickness
  const gap = sw * 0.08;

  // Segment positions: [x, y, width, height] for each of 7 segments
  // a=top, b=top-right, c=bottom-right, d=bottom, e=bottom-left, f=top-left, g=middle
  const segs: [number, number, number, number, boolean][] = [
    // a - top horizontal
    [x + gap, y, w - gap * 2, sh, true],
    // b - top right vertical
    [x + w - sw, y + gap, sw, h / 2 - gap, false],
    // c - bottom right vertical
    [x + w - sw, y + h / 2 + gap, sw, h / 2 - gap, false],
    // d - bottom horizontal
    [x + gap, y + h - sh, w - gap * 2, sh, true],
    // e - bottom left vertical
    [x, y + h / 2 + gap, sw, h / 2 - gap, false],
    // f - top left vertical
    [x, y + gap, sw, h / 2 - gap, false],
    // g - middle horizontal
    [x + gap, y + h / 2 - sh / 2, w - gap * 2, sh, true],
  ];

  for (let i = 0; i < 7; i++) {
    const [sx, sy, swidth, sheight] = segs[i];
    ctx.fillStyle = segments[i] ? color : dimColor;
    ctx.fillRect(sx, sy, swidth, sheight);
  }
}

function GymTimer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const isExercising = useGameStore(s => s.isExercising);
  const exerciseProgress = useGameStore(s => s.exerciseProgress);
  const currentExercise = useGameStore(s => s.currentExercise);
  const stats = useGameStore(s => s.stats);

  const canvas = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 128;
    canvasRef.current = c;
    return c;
  }, []);

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    textureRef.current = t;
    return t;
  }, [canvas]);

  useFrame(() => {
    const ctx = canvas.getContext('2d');
    if (!ctx || !textureRef.current) return;

    // Background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, 512, 128);

    // Subtle border
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 510, 126);

    const dimGreen = '#0a2a0a';
    const dimRed = '#2a0a0a';
    const green = '#00ff44';
    const red = '#ff2222';

    // Left side: Round indicator (green) — "R" + level number
    const roundStr = 'R' + String(stats.level).padStart(1, ' ');
    const leftChars = roundStr.split('');
    const charW = 42;
    const charH = 90;
    const leftStartX = 20;
    const charY = 19;

    for (let i = 0; i < leftChars.length; i++) {
      const ch = leftChars[i];
      const segs = SEVEN_SEG[ch] || SEVEN_SEG[' '];
      drawSegment(ctx, leftStartX + i * (charW + 10), charY, charW, charH, segs, green, dimGreen);
    }

    // Right side: Timer (red) — MM:SS
    let minutes = 0;
    let seconds = 0;
    if (isExercising && currentExercise) {
      const configs: Record<string, number> = {
        barbell: 120, dumbbell: 90, kettlebell: 100,
        jumprope: 80, pullup: 100, rings: 150,
      };
      const maxDur = configs[currentExercise] || 100;
      const remaining = Math.max(0, maxDur - exerciseProgress);
      // Convert frames to rough seconds (60fps)
      const totalSec = Math.ceil(remaining / 60 * 10);
      minutes = Math.floor(totalSec / 60);
      seconds = totalSec % 60;
    } else {
      // Show current time when not exercising
      const now = new Date();
      minutes = now.getMinutes();
      seconds = now.getSeconds();
    }

    const timeStr = String(minutes).padStart(2, '0') + String(seconds).padStart(2, '0');
    const rightStartX = 250;

    for (let i = 0; i < 4; i++) {
      const ch = timeStr[i];
      const segs = SEVEN_SEG[ch] || SEVEN_SEG['0'];
      const xOff = i >= 2 ? 30 : 0; // extra space after colon
      drawSegment(ctx, rightStartX + i * (charW + 10) + xOff, charY, charW, charH, segs, red, dimRed);
    }

    // Colon between MM and SS
    const colonX = rightStartX + 2 * (charW + 10) + 8;
    const dotSize = 8;
    ctx.fillStyle = red;
    ctx.fillRect(colonX, charY + charH * 0.28, dotSize, dotSize);
    ctx.fillRect(colonX, charY + charH * 0.62, dotSize, dotSize);

    textureRef.current.needsUpdate = true;
  });

  return (
    <mesh position={[0, 4, -11.7]}>
      <boxGeometry args={[3, 0.8, 0.12]} />
      <meshStandardMaterial color="#000000" />
      {/* Screen face */}
      <mesh position={[0, 0, 0.065]}>
        <planeGeometry args={[2.8, 0.7]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </mesh>
  );
}

// ========== GYM ENVIRONMENT ==========
function GymStructure() {
  return (
    <group>
      {/* Floor */}
      <Box position={[0, -0.25, 0]} args={[24, 0.5, 24]} color="#3a3a3a" />

      {/* Rubber mats */}
      <Box position={[-6, 0.02, -4]} args={[4, 0.05, 3]} color="#2d2d2d" />
      <Box position={[0, 0.02, -4.5]} args={[3.5, 0.05, 2.5]} color="#2d2d2d" />
      <Box position={[6, 0.02, -4]} args={[3, 0.05, 3]} color="#2d2d2d" />
      <Box position={[-6, 0.02, 4]} args={[3.5, 0.05, 3]} color="#1a3a1a" />
      <Box position={[4, 0.02, 4]} args={[3.5, 0.05, 2.5]} color="#2d1a1a" />
      <Box position={[4, 0.02, 8]} args={[3.5, 0.05, 2.5]} color="#1a1a2d" />

      {/* Wall decorations */}
      <Box position={[0, 4.5, -11.7]} args={[10, 0.3, 0.1]} color="#ff4444" />
      <GymSign />
      <GymTimer />

      {/* Chalk bucket */}
      <Cyl position={[-10, 0.35, -10]} args={[0.3, 0.25, 0.7, 6]} color="#eeeeee" />
      {/* Water bottle */}
      <Cyl position={[10, 0.3, -10]} args={[0.1, 0.1, 0.5, 6]} color="#4488ff" />
      {/* Foam roller */}
      <Cyl position={[10, 0.15, 8]} args={[0.15, 0.15, 0.8, 8]} color="#6644aa" rotation={[0, 0, 1.57]} />
    </group>
  );
}

// Wall transparency: if camera is on the outside of a wall (beyond it),
// that wall fades out so it never blocks the view.
// Each wall has a "normal" pointing inward — if camera is on the outside, fade it.
// wall normal: the direction from wall toward gym center (0,0,0)
interface WallInfo {
  pos: [number, number, number];
  size: [number, number, number];
  color: string;
  // axis: which axis the wall blocks ('z' for back/front walls, 'x' for left/right)
  axis: 'x' | 'z';
  // inward: +1 if gym center is in the + direction from the wall, -1 if in - direction
  inward: number;
}

const WALLS: WallInfo[] = [
  { pos: [0, 3, -12], size: [24, 6, 0.5], color: '#888888', axis: 'z', inward: 1 },   // back wall, center is +z
  { pos: [-12, 3, 0], size: [0.5, 6, 24], color: '#7a7a7a', axis: 'x', inward: 1 },   // left wall, center is +x
  { pos: [12, 3, 0],  size: [0.5, 6, 24], color: '#7a7a7a', axis: 'x', inward: -1 },  // right wall, center is -x
  { pos: [0, 3, 12],  size: [24, 6, 0.5], color: '#7a7a7a', axis: 'z', inward: -1 },  // front wall, center is -z
];

function TransparentWalls() {
  const matRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([null, null, null, null]);
  const { camera } = useThree();

  useFrame(() => {
    for (let i = 0; i < WALLS.length; i++) {
      const mat = matRefs.current[i];
      if (!mat) continue;

      const wall = WALLS[i];
      const wallVal = wall.axis === 'x' ? wall.pos[0] : wall.pos[2];
      const camVal = wall.axis === 'x' ? camera.position.x : camera.position.z;

      // Camera is "outside" if it's on the opposite side of the wall from center
      // Outside means: (camVal - wallVal) * inward < 0
      const camOffset = (camVal - wallVal) * wall.inward;
      // Fade when camera is outside or very close to the wall
      const shouldFade = camOffset < 2;

      const targetOpacity = shouldFade ? 0.0 : 1;
      mat.opacity += (targetOpacity - mat.opacity) * 0.2;
      mat.transparent = true;
      mat.depthWrite = mat.opacity > 0.5;
    }
  });

  return (
    <>
      {WALLS.map((wall, i) => (
        <mesh key={i} position={wall.pos} receiveShadow>
          <boxGeometry args={wall.size} />
          <meshStandardMaterial
            ref={(r) => { matRefs.current[i] = r; }}
            color={wall.color}
            transparent
          />
        </mesh>
      ))}
    </>
  );
}

export function GymEquipment() {
  return (
    <group>
      <GymStructure />
      <TransparentWalls />
      <Barbell />
      <DumbbellRack />
      <Kettlebells />
      <JumpRope />
      <PullUpBar />
      <Rings />
    </group>
  );
}
