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

function FlatBench() {
  const steel = '#444444';
  const pad = '#1a1a1a';
  const stitch = '#333333';

  return (
    <group>
      {/* Pad — long and narrow, like a real flat bench */}
      <Box position={[0, 0.44, 0]} args={[0.35, 0.08, 1.6]} color={pad} />
      {/* Stitch line down center */}
      <Box position={[0, 0.485, 0]} args={[0.02, 0.005, 1.5]} color={stitch} />
      {/* Pad edge trim */}
      <Box position={[0, 0.43, 0]} args={[0.37, 0.06, 1.62]} color="#252525" />

      {/* Steel frame — center rail */}
      <Box position={[0, 0.22, 0]} args={[0.08, 0.04, 1.4]} color={steel} />

      {/* Front legs — A-frame style */}
      <Box position={[-0.2, 0.11, 0.65]} args={[0.05, 0.22, 0.05]} color={steel} />
      <Box position={[0.2, 0.11, 0.65]} args={[0.05, 0.22, 0.05]} color={steel} />
      {/* Front cross bar */}
      <Box position={[0, 0.02, 0.65]} args={[0.45, 0.04, 0.05]} color={steel} />

      {/* Back legs */}
      <Box position={[-0.2, 0.11, -0.65]} args={[0.05, 0.22, 0.05]} color={steel} />
      <Box position={[0.2, 0.11, -0.65]} args={[0.05, 0.22, 0.05]} color={steel} />
      {/* Back cross bar */}
      <Box position={[0, 0.02, -0.65]} args={[0.45, 0.04, 0.05]} color={steel} />

      {/* Rubber feet */}
      <Box position={[-0.2, 0.01, 0.65]} args={[0.07, 0.02, 0.07]} color="#222222" />
      <Box position={[0.2, 0.01, 0.65]} args={[0.07, 0.02, 0.07]} color="#222222" />
      <Box position={[-0.2, 0.01, -0.65]} args={[0.07, 0.02, 0.07]} color="#222222" />
      <Box position={[0.2, 0.01, -0.65]} args={[0.07, 0.02, 0.07]} color="#222222" />
    </group>
  );
}

export function VoxelHooni() {
  const groupRef = useRef<THREE.Group>(null!);
  const headRef = useRef<THREE.Group>(null!);
  const leftArmRef = useRef<THREE.Group>(null!);
  const rightArmRef = useRef<THREE.Group>(null!);

  const { scene } = useThree();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // Head tracks player
    if (headRef.current && groupRef.current) {
      const player = scene.getObjectByName('player');
      if (player) {
        player.getWorldPosition(_playerPos);
        groupRef.current.getWorldPosition(_hooniWorldPos);

        const dx = _playerPos.x - _hooniWorldPos.x;
        const dz = _playerPos.z - _hooniWorldPos.z;

        // Body faces +X direction (rotated Math.PI * 0.5 inside group)
        const worldAngle = Math.atan2(dx, dz);
        const bodyFacing = Math.PI * 0.5; // body rotation within group
        const localAngle = worldAngle - bodyFacing;
        const normAngle = Math.atan2(Math.sin(localAngle), Math.cos(localAngle));

        const clampedY = Math.max(-1.2, Math.min(1.2, normAngle));
        headRef.current.rotation.y += (clampedY - headRef.current.rotation.y) * 0.08;
        headRef.current.rotation.x = Math.sin(t * 0.7) * 0.03;
      }
    }

    // Arms: subtle idle breathing
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = Math.sin(t * 1.2) * 0.015;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = Math.sin(t * 1.2 + 1) * 0.015;
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
      {/* Bench stays along Z axis */}
      <FlatBench />

      {/* Name tag */}
      <Html center position={[0, 2.3, 0]} distanceFactor={10}>
        <div style={{
          color: '#88ccff',
          fontSize: 11,
          fontWeight: 'bold',
          fontFamily: "'Press Start 2P', monospace",
          textShadow: '0 2px 6px rgba(0,0,0,0.8)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          HOONI
        </div>
      </Html>

      {/* Character sitting sideways on bench, facing +X (toward gym center) */}
      <group position={[0, 0.46, 0]} rotation={[0, Math.PI * 0.5, 0]}>
        {/* Left leg — thigh on bench surface, shin hanging down sideways */}
        <group position={[-0.15, 0, 0]}>
          <Box position={[0, 0, 0.18]} args={[0.22, 0.2, 0.35]} color={shorts} />
          <Box position={[0, -0.25, 0.35]} args={[0.2, 0.3, 0.22]} color={skin} />
          <Box position={[0, -0.42, 0.39]} args={[0.22, 0.1, 0.3]} color={shoes} />
        </group>
        {/* Right leg */}
        <group position={[0.15, 0, 0]}>
          <Box position={[0, 0, 0.18]} args={[0.22, 0.2, 0.35]} color={shorts} />
          <Box position={[0, -0.25, 0.35]} args={[0.2, 0.3, 0.22]} color={skin} />
          <Box position={[0, -0.42, 0.39]} args={[0.22, 0.1, 0.3]} color={shoes} />
        </group>

        {/* Upper body */}
        <group position={[0, 0.15, 0]}>
          {/* Torso — black tank top */}
          <Box position={[0, 0.25, 0]} args={[0.5, 0.4, 0.3]} color={tank} />
          {/* Exposed waist area */}
          <Box position={[0, 0, 0]} args={[0.45, 0.15, 0.28]} color={skin} />

          {/* Left arm — upper arm down from shoulder, forearm forward to knees */}
          <group ref={leftArmRef} position={[-0.33, 0.25, 0]}>
            {/* Upper arm — going down */}
            <Box position={[0, -0.12, 0]} args={[0.16, 0.2, 0.18]} color={skin} />
            {/* Forearm — angled forward toward center */}
            <Box position={[0.08, -0.28, 0.15]} args={[0.14, 0.14, 0.22]} color={skin} />
            {/* Hand — resting on knee area, toward center */}
            <Box position={[0.14, -0.3, 0.3]} args={[0.12, 0.1, 0.12]} color={skin} />
          </group>

          {/* Right arm — mirrored */}
          <group ref={rightArmRef} position={[0.33, 0.25, 0]}>
            <Box position={[0, -0.12, 0]} args={[0.16, 0.2, 0.18]} color={skin} />
            <Box position={[-0.08, -0.28, 0.15]} args={[0.14, 0.14, 0.22]} color={skin} />
            <Box position={[-0.14, -0.3, 0.3]} args={[0.12, 0.1, 0.12]} color={skin} />
          </group>

          {/* Clasped hands — overlapping at center above knees */}
          <Box position={[0, -0.13, 0.3]} args={[0.14, 0.1, 0.12]} color={skin} />

          {/* Head */}
          <group ref={headRef} position={[0, 0.65, 0]}>
            <Box position={[0, 0, 0]} args={[0.4, 0.4, 0.4]} color={skin} />

            {/* === Hair: 5:5 center parted bangs === */}
            {/* Top hair */}
            <Box position={[0, 0.19, -0.02]} args={[0.44, 0.08, 0.44]} color={hair} />
            {/* Left bangs — layered to cover forehead left side */}
            <Box position={[-0.11, 0.14, 0.15]} args={[0.18, 0.08, 0.12]} color={hair} />
            <Box position={[-0.12, 0.08, 0.17]} args={[0.16, 0.08, 0.08]} color={hair} />
            <Box position={[-0.13, 0.03, 0.18]} args={[0.14, 0.06, 0.06]} color={hair} />
            {/* Right bangs */}
            <Box position={[0.11, 0.14, 0.15]} args={[0.18, 0.08, 0.12]} color={hair} />
            <Box position={[0.12, 0.08, 0.17]} args={[0.16, 0.08, 0.08]} color={hair} />
            <Box position={[0.13, 0.03, 0.18]} args={[0.14, 0.06, 0.06]} color={hair} />
            {/* Center part gap */}
            <Box position={[0, 0.17, 0.14]} args={[0.03, 0.04, 0.06]} color={skin} />
            {/* Side hair */}
            <Box position={[-0.2, 0.04, -0.04]} args={[0.08, 0.24, 0.38]} color={hair} />
            <Box position={[0.2, 0.04, -0.04]} args={[0.08, 0.24, 0.38]} color={hair} />
            {/* Back hair */}
            <Box position={[0, 0.02, -0.2]} args={[0.38, 0.3, 0.06]} color={hair} />

            {/* === Horn-rimmed glasses (clear lens) === */}
            {/* Left frame — thick dark brown */}
            <Box position={[-0.1, 0.01, 0.2]} args={[0.14, 0.12, 0.03]} color={glassFrame} />
            {/* Left lens hole — slightly smaller, skin color to simulate clear */}
            <Box position={[-0.1, 0.01, 0.215]} args={[0.09, 0.07, 0.01]} color={skin} />
            {/* Right frame */}
            <Box position={[0.1, 0.01, 0.2]} args={[0.14, 0.12, 0.03]} color={glassFrame} />
            {/* Right lens — clear */}
            <Box position={[0.1, 0.01, 0.215]} args={[0.09, 0.07, 0.01]} color={skin} />
            {/* Bridge */}
            <Box position={[0, 0.01, 0.215]} args={[0.06, 0.04, 0.02]} color={glassFrame} />
            {/* Temple arms */}
            <Box position={[-0.2, 0.01, 0.1]} args={[0.03, 0.03, 0.22]} color={glassFrame} />
            <Box position={[0.2, 0.01, 0.1]} args={[0.03, 0.03, 0.22]} color={glassFrame} />

            {/* Eyes visible through glasses */}
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
          </group>
        </group>
      </group>
    </group>
  );
}
