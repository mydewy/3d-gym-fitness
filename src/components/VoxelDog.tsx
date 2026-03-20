import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
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
const SPEED = 1.8;
const _playerPos = new THREE.Vector3();
const _dogTarget = new THREE.Vector3();

export function VoxelDog() {
  const groupRef = useRef<THREE.Group>(null!);
  const tailRef = useRef<THREE.Group>(null!);
  const frontLeftLegRef = useRef<THREE.Mesh>(null!);
  const frontRightLegRef = useRef<THREE.Mesh>(null!);
  const backLeftLegRef = useRef<THREE.Mesh>(null!);
  const backRightLegRef = useRef<THREE.Mesh>(null!);
  const earLeftRef = useRef<THREE.Mesh>(null!);
  const earRightRef = useRef<THREE.Mesh>(null!);

  // AI state
  const stateRef = useRef<'wander' | 'follow' | 'idle'>('wander');
  const targetRef = useRef(new THREE.Vector3(2, 0, 2));
  const timerRef = useRef(0);
  const facingRef = useRef(0);
  const isMovingRef = useRef(false);

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

    // State machine
    const distToPlayer = player ? pos.distanceTo(_playerPos) : 999;

    if (distToPlayer < 5 && distToPlayer > 2) {
      // Follow player when nearby but not too close
      stateRef.current = 'follow';
      _dogTarget.set(_playerPos.x, 0, _playerPos.z);
      // Offset slightly so dog doesn't stand on player
      const angle = Math.atan2(pos.x - _playerPos.x, pos.z - _playerPos.z);
      _dogTarget.x += Math.sin(angle) * 1.5;
      _dogTarget.z += Math.cos(angle) * 1.5;
      targetRef.current.copy(_dogTarget);
    } else if (distToPlayer <= 2) {
      // Sit near player
      stateRef.current = 'idle';
      if (timerRef.current <= 0) {
        timerRef.current = 2 + Math.random() * 3;
      }
    } else {
      // Wander
      if (stateRef.current !== 'wander' || timerRef.current <= 0) {
        stateRef.current = 'wander';
        targetRef.current.set(
          (Math.random() - 0.5) * BOUNDS * 1.6,
          0,
          (Math.random() - 0.5) * BOUNDS * 1.6
        );
        timerRef.current = 3 + Math.random() * 4;
      }
    }

    // Movement
    const target = targetRef.current;
    const dx = target.x - pos.x;
    const dz = target.z - pos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const moving = (stateRef.current === 'wander' || stateRef.current === 'follow') && dist > 0.3;
    isMovingRef.current = moving;

    if (moving) {
      const speed = stateRef.current === 'follow' ? SPEED * 1.3 : SPEED;
      const step = Math.min(speed * delta, dist);
      pos.x += (dx / dist) * step;
      pos.z += (dz / dist) * step;

      // Clamp to bounds
      pos.x = Math.max(-BOUNDS, Math.min(BOUNDS, pos.x));
      pos.z = Math.max(-BOUNDS, Math.min(BOUNDS, pos.z));

      // Face direction
      facingRef.current = Math.atan2(dx, dz);
    } else if (stateRef.current === 'idle' && player) {
      // Face player when idle near them
      facingRef.current = Math.atan2(_playerPos.x - pos.x, _playerPos.z - pos.z);
    }

    // Smooth rotation
    const diff = facingRef.current - groupRef.current.rotation.y;
    const norm = Math.atan2(Math.sin(diff), Math.cos(diff));
    groupRef.current.rotation.y += norm * 0.1;

    // Leg animation
    const legSwing = moving ? Math.sin(t * 12) * 0.5 : 0;
    if (frontLeftLegRef.current) frontLeftLegRef.current.rotation.x = legSwing;
    if (frontRightLegRef.current) frontRightLegRef.current.rotation.x = -legSwing;
    if (backLeftLegRef.current) backLeftLegRef.current.rotation.x = -legSwing;
    if (backRightLegRef.current) backRightLegRef.current.rotation.x = legSwing;

    // Tail wag
    if (tailRef.current) {
      const wagSpeed = distToPlayer < 3 ? 14 : moving ? 8 : 4;
      const wagAmount = distToPlayer < 3 ? 0.6 : moving ? 0.4 : 0.2;
      tailRef.current.rotation.z = Math.sin(t * wagSpeed) * wagAmount;
      // Tail curls up when happy (near player)
      tailRef.current.rotation.x = distToPlayer < 3 ? -0.8 : -0.4;
    }

    // Ear flop
    if (earLeftRef.current) earLeftRef.current.rotation.z = moving ? Math.sin(t * 10) * 0.15 - 0.1 : -0.1;
    if (earRightRef.current) earRightRef.current.rotation.z = moving ? -Math.sin(t * 10) * 0.15 + 0.1 : 0.1;

    // Body bob when moving
    pos.y = moving ? Math.abs(Math.sin(t * 12)) * 0.04 : 0;
  });

  const white = '#f5f5f5';
  const nose = '#222222';
  const tongue = '#ff7799';
  const eye = '#111111';
  const inner_ear = '#ffcccc';

  return (
    <group ref={groupRef} position={[3, 0, 3]}>
      {/* Body */}
      <Box position={[0, 0.28, 0]} args={[0.28, 0.22, 0.45]} color={white} />

      {/* Chest - slightly wider */}
      <Box position={[0, 0.3, 0.12]} args={[0.26, 0.2, 0.15]} color={white} />

      {/* Head */}
      <group position={[0, 0.4, 0.28]}>
        <Box position={[0, 0, 0]} args={[0.24, 0.2, 0.22]} color={white} />
        {/* Snout */}
        <Box position={[0, -0.04, 0.12]} args={[0.14, 0.1, 0.12]} color={white} />
        {/* Nose */}
        <Box position={[0, -0.01, 0.19]} args={[0.06, 0.05, 0.02]} color={nose} />
        {/* Tongue (sticking out slightly) */}
        <Box position={[0, -0.08, 0.16]} args={[0.04, 0.02, 0.06]} color={tongue} />
        {/* Eyes */}
        <Box position={[-0.07, 0.03, 0.1]} args={[0.04, 0.05, 0.02]} color={eye} />
        <Box position={[0.07, 0.03, 0.1]} args={[0.04, 0.05, 0.02]} color={eye} />
        {/* Eye shine */}
        <Box position={[-0.06, 0.04, 0.115]} args={[0.02, 0.02, 0.01]} color="#ffffff" />
        <Box position={[0.08, 0.04, 0.115]} args={[0.02, 0.02, 0.01]} color="#ffffff" />

        {/* Left ear */}
        <mesh ref={earLeftRef} position={[-0.1, 0.1, 0.02]}>
          <boxGeometry args={[0.08, 0.14, 0.04]} />
          <meshStandardMaterial color={white} />
        </mesh>
        <Box position={[-0.1, 0.06, 0.025]} args={[0.05, 0.08, 0.02]} color={inner_ear} />

        {/* Right ear */}
        <mesh ref={earRightRef} position={[0.1, 0.1, 0.02]}>
          <boxGeometry args={[0.08, 0.14, 0.04]} />
          <meshStandardMaterial color={white} />
        </mesh>
        <Box position={[0.1, 0.06, 0.025]} args={[0.05, 0.08, 0.02]} color={inner_ear} />
      </group>

      {/* Front left leg */}
      <mesh ref={frontLeftLegRef} position={[-0.1, 0.1, 0.14]}>
        <boxGeometry args={[0.08, 0.2, 0.08]} />
        <meshStandardMaterial color={white} />
      </mesh>
      {/* Front right leg */}
      <mesh ref={frontRightLegRef} position={[0.1, 0.1, 0.14]}>
        <boxGeometry args={[0.08, 0.2, 0.08]} />
        <meshStandardMaterial color={white} />
      </mesh>
      {/* Back left leg */}
      <mesh ref={backLeftLegRef} position={[-0.1, 0.1, -0.14]}>
        <boxGeometry args={[0.08, 0.2, 0.08]} />
        <meshStandardMaterial color={white} />
      </mesh>
      {/* Back right leg */}
      <mesh ref={backRightLegRef} position={[0.1, 0.1, -0.14]}>
        <boxGeometry args={[0.08, 0.2, 0.08]} />
        <meshStandardMaterial color={white} />
      </mesh>

      {/* Tail */}
      <group ref={tailRef} position={[0, 0.35, -0.25]}>
        <Box position={[0, 0.06, -0.04]} args={[0.05, 0.14, 0.05]} color={white} />
        <Box position={[0, 0.14, -0.06]} args={[0.04, 0.06, 0.04]} color={white} />
      </group>
    </group>
  );
}
