import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
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
const SPEED = 2.2;
const _leaderPos = new THREE.Vector3();
const _target = new THREE.Vector3();

interface DachshundProps {
  leaderRef: React.RefObject<THREE.Group>;
  color: string;
  bellyColor: string;
  startPosition: [number, number, number];
  followOffset: [number, number]; // [x offset, z offset] relative to leader
}

function Dachshund({ leaderRef, color, bellyColor, startPosition, followOffset }: DachshundProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const tailRef = useRef<THREE.Group>(null!);
  const frontLeftLegRef = useRef<THREE.Mesh>(null!);
  const frontRightLegRef = useRef<THREE.Mesh>(null!);
  const backLeftLegRef = useRef<THREE.Mesh>(null!);
  const backRightLegRef = useRef<THREE.Mesh>(null!);
  const earLeftRef = useRef<THREE.Mesh>(null!);
  const earRightRef = useRef<THREE.Mesh>(null!);

  const facingRef = useRef(0);
  const isMovingRef = useRef(false);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    const pos = groupRef.current.position;

    // Follow the kangaroo leader
    let targetX = startPosition[0];
    let targetZ = startPosition[2];

    if (leaderRef.current) {
      leaderRef.current.getWorldPosition(_leaderPos);
      targetX = _leaderPos.x + followOffset[0];
      targetZ = _leaderPos.z + followOffset[1];
    }

    _target.set(targetX, 0, targetZ);

    const dx = _target.x - pos.x;
    const dz = _target.z - pos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const moving = dist > 0.4;
    isMovingRef.current = moving;

    if (moving) {
      // Short legs = funny fast waddle
      const speed = dist > 3 ? SPEED * 1.5 : SPEED;
      const step = Math.min(speed * delta, dist);
      pos.x += (dx / dist) * step;
      pos.z += (dz / dist) * step;

      pos.x = Math.max(-BOUNDS, Math.min(BOUNDS, pos.x));
      pos.z = Math.max(-BOUNDS, Math.min(BOUNDS, pos.z));

      facingRef.current = Math.atan2(dx, dz);
    }

    // Smooth rotation
    const rotDiff = facingRef.current - groupRef.current.rotation.y;
    const rotNorm = Math.atan2(Math.sin(rotDiff), Math.cos(rotDiff));
    groupRef.current.rotation.y += rotNorm * 0.12;

    // Leg animation — fast little waddle
    const legSpeed = moving ? 16 : 0;
    const legSwing = Math.sin(t * legSpeed) * 0.6;
    if (frontLeftLegRef.current) frontLeftLegRef.current.rotation.x = legSwing;
    if (frontRightLegRef.current) frontRightLegRef.current.rotation.x = -legSwing;
    if (backLeftLegRef.current) backLeftLegRef.current.rotation.x = -legSwing;
    if (backRightLegRef.current) backRightLegRef.current.rotation.x = legSwing;

    // Tail wag
    if (tailRef.current) {
      const wagSpeed = moving ? 12 : 6;
      tailRef.current.rotation.z = Math.sin(t * wagSpeed) * 0.5;
      tailRef.current.rotation.x = -0.6;
    }

    // Ear flop
    const earFlop = moving ? Math.sin(t * 14) * 0.12 : 0;
    if (earLeftRef.current) earLeftRef.current.rotation.z = -0.15 + earFlop;
    if (earRightRef.current) earRightRef.current.rotation.z = 0.15 - earFlop;

    // Body waddle when moving
    pos.y = moving ? Math.abs(Math.sin(t * 16)) * 0.02 : 0;
    // Side-to-side waddle
    if (groupRef.current) {
      groupRef.current.rotation.z = moving ? Math.sin(t * 8) * 0.05 : 0;
    }
  });

  const nose = '#111111';
  const eye = '#111111';

  return (
    <group ref={groupRef} position={startPosition}>
      {/* Body — long dachshund body */}
      <Box position={[0, 0.14, 0]} args={[0.16, 0.14, 0.5]} color={color} />
      {/* Belly */}
      <Box position={[0, 0.09, 0]} args={[0.13, 0.06, 0.44]} color={bellyColor} />
      {/* Chest — slightly wider */}
      <Box position={[0, 0.15, 0.18]} args={[0.17, 0.13, 0.14]} color={color} />

      {/* Head */}
      <group position={[0, 0.2, 0.32]}>
        <Box position={[0, 0, 0]} args={[0.15, 0.13, 0.16]} color={color} />
        {/* Long snout */}
        <Box position={[0, -0.02, 0.1]} args={[0.1, 0.08, 0.12]} color={color} />
        {/* Nose */}
        <Box position={[0, -0.01, 0.17]} args={[0.05, 0.04, 0.02]} color={nose} />
        {/* Eyes */}
        <Box position={[-0.05, 0.02, 0.07]} args={[0.035, 0.04, 0.02]} color={eye} />
        <Box position={[0.05, 0.02, 0.07]} args={[0.035, 0.04, 0.02]} color={eye} />
        {/* Eye shine */}
        <Box position={[-0.04, 0.03, 0.08]} args={[0.015, 0.015, 0.01]} color="#ffffff" />
        <Box position={[0.06, 0.03, 0.08]} args={[0.015, 0.015, 0.01]} color="#ffffff" />
        {/* Eyebrows — expressive */}
        <Box position={[-0.05, 0.05, 0.075]} args={[0.04, 0.015, 0.02]} color={color} />
        <Box position={[0.05, 0.05, 0.075]} args={[0.04, 0.015, 0.02]} color={color} />

        {/* Left ear — long floppy */}
        <mesh ref={earLeftRef} position={[-0.07, 0.02, -0.02]}>
          <boxGeometry args={[0.06, 0.12, 0.08]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Right ear */}
        <mesh ref={earRightRef} position={[0.07, 0.02, -0.02]}>
          <boxGeometry args={[0.06, 0.12, 0.08]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>

      {/* Front left leg — short */}
      <mesh ref={frontLeftLegRef} position={[-0.06, 0.04, 0.16]}>
        <boxGeometry args={[0.05, 0.1, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Front right leg */}
      <mesh ref={frontRightLegRef} position={[0.06, 0.04, 0.16]}>
        <boxGeometry args={[0.05, 0.1, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Back left leg */}
      <mesh ref={backLeftLegRef} position={[-0.06, 0.04, -0.16]}>
        <boxGeometry args={[0.05, 0.1, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Back right leg */}
      <mesh ref={backRightLegRef} position={[0.06, 0.04, -0.16]}>
        <boxGeometry args={[0.05, 0.1, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Tail — thin and perky */}
      <group ref={tailRef} position={[0, 0.18, -0.28]}>
        <Box position={[0, 0.04, -0.03]} args={[0.03, 0.1, 0.03]} color={color} />
        <Box position={[0, 0.1, -0.04]} args={[0.025, 0.05, 0.025]} color={color} />
      </group>
    </group>
  );
}

export function VoxelDachshunds({ kangarooRef }: { kangarooRef: React.RefObject<THREE.Group> }) {
  return (
    <>
      {/* Dark brown dachshund */}
      <Dachshund
        leaderRef={kangarooRef}
        color="#5c3317"
        bellyColor="#8b6340"
        startPosition={[-3, 0, 5.5]}
        followOffset={[-1.0, 0.8]}
      />
      {/* Light brown dachshund */}
      <Dachshund
        leaderRef={kangarooRef}
        color="#a0724a"
        bellyColor="#d4a87c"
        startPosition={[-5, 0, 5.5]}
        followOffset={[1.0, 0.8]}
      />
    </>
  );
}
