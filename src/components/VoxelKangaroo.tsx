import { useRef, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

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

const BOUNDS = 10;
const SPEED = 2.0;
const JUMP_FORCE = 4;
const _playerPos = new THREE.Vector3();
const _kangarooTarget = new THREE.Vector3();

export function VoxelKangaroo({ externalRef }: { externalRef?: React.RefObject<THREE.Group | null> }) {
  const groupRef = useRef<THREE.Group>(null!);
  const setRef = useCallback((node: THREE.Group | null) => {
    (groupRef as React.MutableRefObject<THREE.Group | null>).current = node;
    if (externalRef) (externalRef as React.MutableRefObject<THREE.Group | null>).current = node;
  }, [externalRef]);
  const bodyRef = useRef<THREE.Group>(null!);
  const tailRef = useRef<THREE.Group>(null!);
  const leftArmRef = useRef<THREE.Group>(null!);
  const rightArmRef = useRef<THREE.Group>(null!);
  const leftLegRef = useRef<THREE.Group>(null!);
  const rightLegRef = useRef<THREE.Group>(null!);
  const earLeftRef = useRef<THREE.Mesh>(null!);
  const earRightRef = useRef<THREE.Mesh>(null!);

  // AI state
  const stateRef = useRef<'wander' | 'hop' | 'idle' | 'exercise'>('wander');
  const targetRef = useRef(new THREE.Vector3(-3, 0, -3));
  const timerRef = useRef(0);
  const facingRef = useRef(0);
  const hopVelocityRef = useRef(0);
  const hopTimerRef = useRef(0);
  const isAirborneRef = useRef(false);

  const { scene } = useThree();

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    const pos = groupRef.current.position;

    // Find player
    const player = scene.getObjectByName('player');
    if (player) {
      player.getWorldPosition(_playerPos);
    }

    timerRef.current -= delta;
    hopTimerRef.current -= delta;

    const distToPlayer = player ? new THREE.Vector2(pos.x - _playerPos.x, pos.z - _playerPos.z).length() : 999;

    // State machine
    if (distToPlayer < 4 && distToPlayer > 2) {
      stateRef.current = 'hop';
      _kangarooTarget.set(_playerPos.x, 0, _playerPos.z);
      const angle = Math.atan2(pos.x - _playerPos.x, pos.z - _playerPos.z);
      _kangarooTarget.x += Math.sin(angle) * 2;
      _kangarooTarget.z += Math.cos(angle) * 2;
      targetRef.current.copy(_kangarooTarget);
    } else if (distToPlayer <= 2) {
      // Idle near player — occasionally do a little exercise
      if (stateRef.current !== 'idle' && stateRef.current !== 'exercise') {
        stateRef.current = 'idle';
        timerRef.current = 2 + Math.random() * 3;
      }
      if (stateRef.current === 'idle' && timerRef.current <= 0) {
        // Randomly start shadow-boxing
        stateRef.current = 'exercise';
        timerRef.current = 3 + Math.random() * 2;
      }
      if (stateRef.current === 'exercise' && timerRef.current <= 0) {
        stateRef.current = 'idle';
        timerRef.current = 2 + Math.random() * 3;
      }
    } else {
      // Wander by hopping
      if (stateRef.current !== 'wander' || timerRef.current <= 0) {
        stateRef.current = 'wander';
        targetRef.current.set(
          (Math.random() - 0.5) * BOUNDS * 1.6,
          0,
          (Math.random() - 0.5) * BOUNDS * 1.6
        );
        timerRef.current = 4 + Math.random() * 5;
      }
    }

    // Movement — kangaroo hops!
    const target = targetRef.current;
    const dx = target.x - pos.x;
    const dz = target.z - pos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const wantMove = (stateRef.current === 'wander' || stateRef.current === 'hop') && dist > 0.5;

    // Hop physics
    if (wantMove) {
      // Start a new hop
      if (hopTimerRef.current <= 0 && !isAirborneRef.current) {
        hopVelocityRef.current = JUMP_FORCE;
        isAirborneRef.current = true;
        hopTimerRef.current = 0.6; // delay between hops
      }

      facingRef.current = Math.atan2(dx, dz);
    } else if ((stateRef.current === 'idle' || stateRef.current === 'exercise') && player) {
      facingRef.current = Math.atan2(_playerPos.x - pos.x, _playerPos.z - pos.z);
    }

    // Apply hop gravity
    if (isAirborneRef.current) {
      hopVelocityRef.current -= 12 * delta;
      pos.y += hopVelocityRef.current * delta;

      // Move forward while in air
      if (wantMove) {
        const speed = stateRef.current === 'hop' ? SPEED * 1.4 : SPEED;
        const step = speed * delta;
        pos.x += (dx / dist) * step;
        pos.z += (dz / dist) * step;
      }

      if (pos.y <= 0) {
        pos.y = 0;
        hopVelocityRef.current = 0;
        isAirborneRef.current = false;
      }
    }

    // Clamp to bounds
    pos.x = Math.max(-BOUNDS, Math.min(BOUNDS, pos.x));
    pos.z = Math.max(-BOUNDS, Math.min(BOUNDS, pos.z));

    // Smooth rotation
    const rotDiff = facingRef.current - groupRef.current.rotation.y;
    const rotNorm = Math.atan2(Math.sin(rotDiff), Math.cos(rotDiff));
    groupRef.current.rotation.y += rotNorm * 0.1;

    // Body tilt when hopping
    if (bodyRef.current) {
      const tilt = isAirborneRef.current ? -0.15 : 0;
      bodyRef.current.rotation.x += (tilt - bodyRef.current.rotation.x) * 0.2;
    }

    // Leg animation
    if (leftLegRef.current && rightLegRef.current) {
      if (isAirborneRef.current) {
        // Legs tucked while airborne
        const tuck = hopVelocityRef.current > 0 ? -0.6 : 0.3;
        leftLegRef.current.rotation.x = tuck;
        rightLegRef.current.rotation.x = tuck;
      } else {
        leftLegRef.current.rotation.x = 0;
        rightLegRef.current.rotation.x = 0;
      }
    }

    // Arm animation
    if (leftArmRef.current && rightArmRef.current) {
      if (stateRef.current === 'exercise') {
        // Shadow boxing!
        const punch = Math.sin(t * 8);
        leftArmRef.current.rotation.x = -1.2 + (punch > 0 ? punch * 0.8 : 0);
        rightArmRef.current.rotation.x = -1.2 + (punch < 0 ? -punch * 0.8 : 0);
        leftArmRef.current.rotation.z = -0.2;
        rightArmRef.current.rotation.z = 0.2;
      } else if (isAirborneRef.current) {
        // Arms forward when hopping
        leftArmRef.current.rotation.x = -0.4;
        rightArmRef.current.rotation.x = -0.4;
        leftArmRef.current.rotation.z = -0.15;
        rightArmRef.current.rotation.z = 0.15;
      } else {
        // Relaxed pose — arms slightly in front
        leftArmRef.current.rotation.x = -0.3;
        rightArmRef.current.rotation.x = -0.3;
        leftArmRef.current.rotation.z = -0.1;
        rightArmRef.current.rotation.z = 0.1;
      }
    }

    // Tail animation
    if (tailRef.current) {
      const baseAngle = isAirborneRef.current ? 0.6 : 0.3;
      tailRef.current.rotation.x = baseAngle + Math.sin(t * 3) * 0.1;
      tailRef.current.rotation.z = Math.sin(t * 4) * 0.08;
    }

    // Ear wiggle
    if (earLeftRef.current) earLeftRef.current.rotation.z = -0.2 + Math.sin(t * 5) * 0.1;
    if (earRightRef.current) earRightRef.current.rotation.z = 0.2 - Math.sin(t * 5) * 0.1;
  });

  const fur = '#c4884d';
  const belly = '#f0d9a8';
  const nose = '#332211';
  const eye = '#111111';
  const innerEar = '#e8a87c';

  return (
    <group ref={setRef} position={[-4, 0, 5]} scale={[1.3, 1.3, 1.3]}>
      {/* Name tag */}
      <Html center position={[0, 1.8, 0]} distanceFactor={10}>
        <div style={{
          color: '#ffcc00',
          fontSize: 11,
          fontWeight: 'bold',
          fontFamily: "'Press Start 2P', monospace",
          textShadow: '0 2px 6px rgba(0,0,0,0.8)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          SICO
        </div>
      </Html>

      <group ref={bodyRef}>
        {/* Torso — broad chest */}
        <Box position={[0, 0.7, 0]} args={[0.48, 0.55, 0.38]} color={fur} />
        {/* Pecs */}
        <Box position={[0, 0.8, 0.12]} args={[0.42, 0.2, 0.12]} color={fur} />
        {/* Belly */}
        <Box position={[0, 0.62, 0.12]} args={[0.34, 0.4, 0.16]} color={belly} />

        {/* Head */}
        <group position={[0, 1.1, 0.1]}>
          <Box position={[0, 0, 0]} args={[0.32, 0.28, 0.3]} color={fur} />
          {/* Snout */}
          <Box position={[0, -0.06, 0.16]} args={[0.18, 0.14, 0.14]} color={belly} />
          {/* Nose */}
          <Box position={[0, -0.02, 0.24]} args={[0.08, 0.05, 0.02]} color={nose} />
          {/* Mouth line */}
          <Box position={[0, -0.1, 0.22]} args={[0.06, 0.02, 0.02]} color={nose} />
          {/* Eyes */}
          <Box position={[-0.09, 0.04, 0.14]} args={[0.05, 0.06, 0.02]} color={eye} />
          <Box position={[0.09, 0.04, 0.14]} args={[0.05, 0.06, 0.02]} color={eye} />
          {/* Eye shine */}
          <Box position={[-0.08, 0.05, 0.155]} args={[0.02, 0.02, 0.01]} color="#ffffff" />
          <Box position={[0.1, 0.05, 0.155]} args={[0.02, 0.02, 0.01]} color="#ffffff" />

          {/* Left ear */}
          <mesh ref={earLeftRef} position={[-0.1, 0.2, 0]}>
            <boxGeometry args={[0.08, 0.2, 0.06]} />
            <meshStandardMaterial color={fur} />
          </mesh>
          <Box position={[-0.1, 0.2, 0.01]} args={[0.05, 0.14, 0.03]} color={innerEar} />

          {/* Right ear */}
          <mesh ref={earRightRef} position={[0.1, 0.2, 0]}>
            <boxGeometry args={[0.08, 0.2, 0.06]} />
            <meshStandardMaterial color={fur} />
          </mesh>
          <Box position={[0.1, 0.2, 0.01]} args={[0.05, 0.14, 0.03]} color={innerEar} />
        </group>

        {/* Left arm — muscular */}
        <group ref={leftArmRef} position={[-0.28, 0.88, 0.05]}>
          {/* Shoulder cap */}
          <Box position={[0, 0.02, 0]} args={[0.18, 0.1, 0.16]} color={fur} />
          {/* Upper arm / bicep */}
          <Box position={[0, -0.1, 0]} args={[0.16, 0.18, 0.16]} color={fur} />
          {/* Bicep bulge */}
          <Box position={[0.02, -0.08, 0.06]} args={[0.12, 0.12, 0.08]} color={fur} />
          {/* Forearm */}
          <Box position={[0, -0.24, 0]} args={[0.13, 0.14, 0.13]} color={fur} />
          {/* Fist */}
          <Box position={[0, -0.34, 0]} args={[0.1, 0.1, 0.1]} color={fur} />
        </group>

        {/* Right arm — muscular */}
        <group ref={rightArmRef} position={[0.28, 0.88, 0.05]}>
          {/* Shoulder cap */}
          <Box position={[0, 0.02, 0]} args={[0.18, 0.1, 0.16]} color={fur} />
          {/* Upper arm / bicep */}
          <Box position={[0, -0.1, 0]} args={[0.16, 0.18, 0.16]} color={fur} />
          {/* Bicep bulge */}
          <Box position={[-0.02, -0.08, 0.06]} args={[0.12, 0.12, 0.08]} color={fur} />
          {/* Forearm */}
          <Box position={[0, -0.24, 0]} args={[0.13, 0.14, 0.13]} color={fur} />
          {/* Fist */}
          <Box position={[0, -0.34, 0]} args={[0.1, 0.1, 0.1]} color={fur} />
        </group>

        {/* Left leg — big and powerful */}
        <group ref={leftLegRef} position={[-0.13, 0.35, 0]}>
          {/* Thigh */}
          <Box position={[0, -0.05, 0]} args={[0.16, 0.2, 0.2]} color={fur} />
          {/* Shin */}
          <Box position={[0, -0.2, 0.04]} args={[0.12, 0.16, 0.14]} color={fur} />
          {/* Foot — long kangaroo foot */}
          <Box position={[0, -0.3, 0.12]} args={[0.12, 0.06, 0.28]} color={fur} />
          <Box position={[0, -0.3, 0.22]} args={[0.1, 0.04, 0.08]} color={belly} />
        </group>

        {/* Right leg */}
        <group ref={rightLegRef} position={[0.13, 0.35, 0]}>
          <Box position={[0, -0.05, 0]} args={[0.16, 0.2, 0.2]} color={fur} />
          <Box position={[0, -0.2, 0.04]} args={[0.12, 0.16, 0.14]} color={fur} />
          <Box position={[0, -0.3, 0.12]} args={[0.12, 0.06, 0.28]} color={fur} />
          <Box position={[0, -0.3, 0.22]} args={[0.1, 0.04, 0.08]} color={belly} />
        </group>

        {/* Tail — thick and long */}
        <group ref={tailRef} position={[0, 0.45, -0.2]}>
          <Box position={[0, -0.05, -0.1]} args={[0.14, 0.14, 0.22]} color={fur} />
          <Box position={[0, -0.1, -0.28]} args={[0.12, 0.12, 0.18]} color={fur} />
          <Box position={[0, -0.12, -0.42]} args={[0.1, 0.1, 0.14]} color={fur} />
          <Box position={[0, -0.12, -0.52]} args={[0.08, 0.08, 0.08]} color={fur} />
        </group>
      </group>
    </group>
  );
}
