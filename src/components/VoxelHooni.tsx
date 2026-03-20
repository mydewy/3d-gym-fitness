import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const _playerPos = new THREE.Vector3();
const _hooniWorldPos = new THREE.Vector3();

function Box({ position, args, color }: {
  position: [number, number, number];
  args: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function BenchPressRack() {
  const steel = '#444444';
  const pad = '#1a1a1a';
  const stitch = '#333333';

  return (
    <group>
      {/* Pad */}
      <Box position={[0, 0.44, 0]} args={[0.35, 0.08, 1.6]} color={pad} />
      <Box position={[0, 0.485, 0]} args={[0.02, 0.005, 1.5]} color={stitch} />
      <Box position={[0, 0.43, 0]} args={[0.37, 0.06, 1.62]} color="#252525" />
      {/* Frame */}
      <Box position={[0, 0.22, 0]} args={[0.08, 0.04, 1.4]} color={steel} />
      {/* Legs */}
      <Box position={[-0.2, 0.11, 0.65]} args={[0.05, 0.22, 0.05]} color={steel} />
      <Box position={[0.2, 0.11, 0.65]} args={[0.05, 0.22, 0.05]} color={steel} />
      <Box position={[0, 0.02, 0.65]} args={[0.45, 0.04, 0.05]} color={steel} />
      <Box position={[-0.2, 0.11, -0.65]} args={[0.05, 0.22, 0.05]} color={steel} />
      <Box position={[0.2, 0.11, -0.65]} args={[0.05, 0.22, 0.05]} color={steel} />
      <Box position={[0, 0.02, -0.65]} args={[0.45, 0.04, 0.05]} color={steel} />
      {/* Feet */}
      <Box position={[-0.2, 0.01, 0.65]} args={[0.07, 0.02, 0.07]} color="#222222" />
      <Box position={[0.2, 0.01, 0.65]} args={[0.07, 0.02, 0.07]} color="#222222" />
      <Box position={[-0.2, 0.01, -0.65]} args={[0.07, 0.02, 0.07]} color="#222222" />
      <Box position={[0.2, 0.01, -0.65]} args={[0.07, 0.02, 0.07]} color="#222222" />
      {/* Rack uprights */}
      <Box position={[-0.4, 0.7, -0.6]} args={[0.06, 0.9, 0.06]} color={steel} />
      <Box position={[0.4, 0.7, -0.6]} args={[0.06, 0.9, 0.06]} color={steel} />
      {/* Hooks */}
      <Box position={[-0.4, 1.1, -0.55]} args={[0.08, 0.04, 0.1]} color={steel} />
      <Box position={[0.4, 1.1, -0.55]} args={[0.08, 0.04, 0.1]} color={steel} />
    </group>
  );
}

// Head component (shared between poses)
function HooniHead({ skin, hair, glassFrame }: { skin: string; hair: string; glassFrame: string }) {
  return (
    <>
      <Box position={[0, 0, 0]} args={[0.4, 0.4, 0.4]} color={skin} />
      {/* Hair */}
      <Box position={[0, 0.19, -0.02]} args={[0.44, 0.08, 0.44]} color={hair} />
      <Box position={[-0.11, 0.14, 0.15]} args={[0.18, 0.08, 0.12]} color={hair} />
      <Box position={[-0.12, 0.08, 0.17]} args={[0.16, 0.08, 0.08]} color={hair} />
      <Box position={[-0.13, 0.03, 0.18]} args={[0.14, 0.06, 0.06]} color={hair} />
      <Box position={[0.11, 0.14, 0.15]} args={[0.18, 0.08, 0.12]} color={hair} />
      <Box position={[0.12, 0.08, 0.17]} args={[0.16, 0.08, 0.08]} color={hair} />
      <Box position={[0.13, 0.03, 0.18]} args={[0.14, 0.06, 0.06]} color={hair} />
      <Box position={[0, 0.17, 0.14]} args={[0.03, 0.04, 0.06]} color={skin} />
      <Box position={[-0.2, 0.04, -0.04]} args={[0.08, 0.24, 0.38]} color={hair} />
      <Box position={[0.2, 0.04, -0.04]} args={[0.08, 0.24, 0.38]} color={hair} />
      <Box position={[0, 0.02, -0.2]} args={[0.38, 0.3, 0.06]} color={hair} />
      {/* Glasses */}
      <Box position={[-0.1, 0.01, 0.2]} args={[0.14, 0.12, 0.03]} color={glassFrame} />
      <Box position={[-0.1, 0.01, 0.215]} args={[0.09, 0.07, 0.01]} color={skin} />
      <Box position={[0.1, 0.01, 0.2]} args={[0.14, 0.12, 0.03]} color={glassFrame} />
      <Box position={[0.1, 0.01, 0.215]} args={[0.09, 0.07, 0.01]} color={skin} />
      <Box position={[0, 0.01, 0.215]} args={[0.06, 0.04, 0.02]} color={glassFrame} />
      <Box position={[-0.2, 0.01, 0.1]} args={[0.03, 0.03, 0.22]} color={glassFrame} />
      <Box position={[0.2, 0.01, 0.1]} args={[0.03, 0.03, 0.22]} color={glassFrame} />
      {/* Eyes */}
      <Box position={[-0.1, 0.01, 0.22]} args={[0.06, 0.05, 0.01]} color="#222222" />
      <Box position={[0.1, 0.01, 0.22]} args={[0.06, 0.05, 0.01]} color="#222222" />
      <Box position={[-0.08, 0.025, 0.225]} args={[0.025, 0.025, 0.01]} color="#ffffff" />
      <Box position={[0.12, 0.025, 0.225]} args={[0.025, 0.025, 0.01]} color="#ffffff" />
      {/* Eyebrows */}
      <Box position={[-0.1, 0.08, 0.2]} args={[0.1, 0.025, 0.02]} color={hair} />
      <Box position={[0.1, 0.08, 0.2]} args={[0.1, 0.025, 0.02]} color={hair} />
      {/* Nose */}
      <Box position={[0, -0.04, 0.21]} args={[0.06, 0.06, 0.02]} color="#f5d0a0" />
      {/* Mouth */}
      <Box position={[0, -0.12, 0.2]} args={[0.1, 0.03, 0.02]} color="#cc8877" />
    </>
  );
}

export function VoxelHooni() {
  const groupRef = useRef<THREE.Group>(null!);
  const sittingGroupRef = useRef<THREE.Group>(null!);
  const lyingGroupRef = useRef<THREE.Group>(null!);
  const headSittingRef = useRef<THREE.Group>(null!);
  const barbellGroupRef = useRef<THREE.Group>(null!);
  // Lying pose arm refs
  const lyingLeftArmRef = useRef<THREE.Group>(null!);
  const lyingRightArmRef = useRef<THREE.Group>(null!);

  const stateRef = useRef<'sitting' | 'benchpress'>('sitting');
  const timerRef = useRef(5 + Math.random() * 8);

  const { scene } = useThree();

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    timerRef.current -= delta;

    // State toggle
    if (stateRef.current === 'sitting' && timerRef.current <= 0) {
      stateRef.current = 'benchpress';
      timerRef.current = 8 + Math.random() * 6;
    } else if (stateRef.current === 'benchpress' && timerRef.current <= 0) {
      stateRef.current = 'sitting';
      timerRef.current = 5 + Math.random() * 8;
    }

    const isBenching = stateRef.current === 'benchpress';

    // Toggle visibility
    if (sittingGroupRef.current) sittingGroupRef.current.visible = !isBenching;
    if (lyingGroupRef.current) lyingGroupRef.current.visible = isBenching;

    // Bench press animation
    if (isBenching) {
      const press = (Math.sin(t * 3) + 1) * 0.5; // 0 (down at chest) to 1 (up, arms extended)
      const barbellY = 0.72 + press * 0.4;

      if (barbellGroupRef.current) {
        barbellGroupRef.current.position.y = barbellY;
        barbellGroupRef.current.position.z = -0.1; // over chest
      }

      if (lyingLeftArmRef.current && lyingRightArmRef.current) {
        const armRotation = -press * 0.7;
        lyingLeftArmRef.current.rotation.z = 1.2 + armRotation;
        lyingRightArmRef.current.rotation.z = -(1.2 + armRotation);
      }
    } else {
      // Park barbell on rack hooks
      if (barbellGroupRef.current) {
        barbellGroupRef.current.position.y = 1.1;
        barbellGroupRef.current.position.z = -0.55; // on hooks
      }
    }

    // Head tracks player when sitting
    if (!isBenching && headSittingRef.current && groupRef.current) {
      const player = scene.getObjectByName('player');
      if (player) {
        player.getWorldPosition(_playerPos);
        groupRef.current.getWorldPosition(_hooniWorldPos);
        const dx = _playerPos.x - _hooniWorldPos.x;
        const dz = _playerPos.z - _hooniWorldPos.z;
        const worldAngle = Math.atan2(dx, dz);
        const bodyFacing = Math.PI * 0.5;
        const localAngle = worldAngle - bodyFacing;
        const normAngle = Math.atan2(Math.sin(localAngle), Math.cos(localAngle));
        const clampedY = Math.max(-1.2, Math.min(1.2, normAngle));
        headSittingRef.current.rotation.y += (clampedY - headSittingRef.current.rotation.y) * 0.08;
        headSittingRef.current.rotation.x = Math.sin(t * 0.7) * 0.03;
      }
    }
  });

  const skin = '#ffe0bd';
  const hair = '#1a1000';
  const tank = '#111111';
  const shorts = '#777777';
  const shoes = '#111111';
  const glassFrame = '#332211';

  return (
    <group ref={groupRef} position={[-8, 0, 8]}>
      <BenchPressRack />

      {/* Barbell — moves between rack and chest */}
      <group ref={barbellGroupRef} position={[0, 1.1, -0.55]}>
        <Box position={[0, 0, 0]} args={[1.4, 0.04, 0.04]} color="#aaaaaa" />
        <Box position={[-0.5, 0, 0]} args={[0.04, 0.22, 0.22]} color="#333333" />
        <Box position={[-0.505, 0, 0]} args={[0.02, 0.24, 0.24]} color="#444444" />
        <Box position={[-0.55, 0, 0]} args={[0.04, 0.2, 0.2]} color="#333333" />
        <Box position={[0.5, 0, 0]} args={[0.04, 0.22, 0.22]} color="#333333" />
        <Box position={[0.505, 0, 0]} args={[0.02, 0.24, 0.24]} color="#444444" />
        <Box position={[0.55, 0, 0]} args={[0.04, 0.2, 0.2]} color="#333333" />
        <Box position={[-0.45, 0, 0]} args={[0.03, 0.06, 0.06]} color="#888888" />
        <Box position={[0.45, 0, 0]} args={[0.03, 0.06, 0.06]} color="#888888" />
      </group>

      {/* Name tag */}
      <Html center position={[0, 2.3, 0]} distanceFactor={10}>
        <div style={{
          color: '#88ccff', fontSize: 11, fontWeight: 'bold',
          fontFamily: "'Press Start 2P', monospace",
          textShadow: '0 2px 6px rgba(0,0,0,0.8)',
          whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none',
        }}>
          HOONI
        </div>
      </Html>

      {/* ===== SITTING POSE ===== */}
      <group ref={sittingGroupRef} position={[0, 0.46, 0.3]} rotation={[0, Math.PI * 0.5, 0]}>
        {/* Legs */}
        <group position={[-0.15, 0, 0]}>
          <Box position={[0, 0, 0.18]} args={[0.22, 0.2, 0.35]} color={shorts} />
          <Box position={[0, -0.25, 0.35]} args={[0.2, 0.3, 0.22]} color={skin} />
          <Box position={[0, -0.42, 0.39]} args={[0.22, 0.1, 0.3]} color={shoes} />
        </group>
        <group position={[0.15, 0, 0]}>
          <Box position={[0, 0, 0.18]} args={[0.22, 0.2, 0.35]} color={shorts} />
          <Box position={[0, -0.25, 0.35]} args={[0.2, 0.3, 0.22]} color={skin} />
          <Box position={[0, -0.42, 0.39]} args={[0.22, 0.1, 0.3]} color={shoes} />
        </group>
        {/* Upper body */}
        <group position={[0, 0.15, 0]}>
          <Box position={[0, 0.25, 0]} args={[0.5, 0.4, 0.3]} color={tank} />
          <Box position={[0, 0, 0]} args={[0.45, 0.15, 0.28]} color={skin} />
          {/* Arms — clasped on knees */}
          <group position={[-0.33, 0.25, 0]}>
            <Box position={[0, -0.12, 0]} args={[0.16, 0.2, 0.18]} color={skin} />
            <Box position={[0.08, -0.28, 0.15]} args={[0.14, 0.14, 0.22]} color={skin} />
            <Box position={[0.14, -0.3, 0.3]} args={[0.12, 0.1, 0.12]} color={skin} />
          </group>
          <group position={[0.33, 0.25, 0]}>
            <Box position={[0, -0.12, 0]} args={[0.16, 0.2, 0.18]} color={skin} />
            <Box position={[-0.08, -0.28, 0.15]} args={[0.14, 0.14, 0.22]} color={skin} />
            <Box position={[-0.14, -0.3, 0.3]} args={[0.12, 0.1, 0.12]} color={skin} />
          </group>
          <Box position={[0, -0.13, 0.3]} args={[0.14, 0.1, 0.12]} color={skin} />
          {/* Head */}
          <group ref={headSittingRef} position={[0, 0.65, 0]}>
            <HooniHead skin={skin} hair={hair} glassFrame={glassFrame} />
          </group>
        </group>
      </group>

      {/* ===== LYING POSE (bench press) ===== */}
      <group ref={lyingGroupRef} visible={false}>
        {/* Upper body on pad — pad top Y=0.48 */}
        {/* Chest */}
        <Box position={[0, 0.6, -0.15]} args={[0.5, 0.2, 0.45]} color={tank} />
        {/* Belly */}
        <Box position={[0, 0.58, 0.15]} args={[0.45, 0.18, 0.2]} color={skin} />
        {/* Hips on pad edge */}
        <Box position={[0, 0.56, 0.42]} args={[0.45, 0.18, 0.28]} color={shorts} />

        {/* Head — rotated to face ceiling */}
        <group position={[0, 0.68, -0.5]} rotation={[-Math.PI * 0.5, 0, 0]}>
          <HooniHead skin={skin} hair={hair} glassFrame={glassFrame} />
        </group>

        {/* Arms — pivot from shoulders */}
        <group ref={lyingLeftArmRef} position={[-0.3, 0.6, -0.15]}>
          <Box position={[-0.12, 0, 0]} args={[0.2, 0.16, 0.16]} color={skin} />
          <Box position={[-0.2, 0.12, 0]} args={[0.14, 0.2, 0.14]} color={skin} />
          <Box position={[-0.2, 0.25, 0]} args={[0.1, 0.1, 0.1]} color={skin} />
        </group>
        <group ref={lyingRightArmRef} position={[0.3, 0.6, -0.15]}>
          <Box position={[0.12, 0, 0]} args={[0.2, 0.16, 0.16]} color={skin} />
          <Box position={[0.2, 0.12, 0]} args={[0.14, 0.2, 0.14]} color={skin} />
          <Box position={[0.2, 0.25, 0]} args={[0.1, 0.1, 0.1]} color={skin} />
        </group>

        {/* Legs — straight down from hips */}
        {/* Left leg */}
        <group position={[-0.14, 0, 0.55]}>
          <Box position={[0, 0.4, 0]} args={[0.22, 0.3, 0.22]} color={shorts} />
          <Box position={[0, 0.16, 0]} args={[0.2, 0.22, 0.18]} color={skin} />
          <Box position={[0, 0.04, 0]} args={[0.2, 0.08, 0.28]} color={shoes} />
        </group>
        {/* Right leg */}
        <group position={[0.14, 0, 0.55]}>
          <Box position={[0, 0.4, 0]} args={[0.22, 0.3, 0.22]} color={shorts} />
          <Box position={[0, 0.16, 0]} args={[0.2, 0.22, 0.18]} color={skin} />
          <Box position={[0, 0.04, 0]} args={[0.2, 0.08, 0.28]} color={shoes} />
        </group>
      </group>
    </group>
  );
}
