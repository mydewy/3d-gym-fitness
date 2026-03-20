import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { GymEquipment } from './components/GymEquipment';
import { PlayerController } from './components/PlayerController';
import { GameCamera } from './components/GameCamera';
import { ExerciseEffect } from './components/ExerciseEffect';
import { VoxelDog } from './components/VoxelDog';
import { VoxelKangaroo } from './components/VoxelKangaroo';
import { VoxelDachshunds } from './components/VoxelDachshund';
import { VoxelHooni } from './components/VoxelHooni';
import { HUD } from './components/HUD';
import { MobileControls } from './components/MobileControls';
import { useGameStore } from './store/gameStore';

function GymWalls() {
  return (
    <>
      {/* Floor collider */}
      <RigidBody type="fixed" position={[0, -0.25, 0]}>
        <CuboidCollider args={[12, 0.25, 12]} />
      </RigidBody>
      {/* Wall colliders */}
      <RigidBody type="fixed" position={[0, 3, -12]}>
        <CuboidCollider args={[12, 3, 0.25]} />
      </RigidBody>
      <RigidBody type="fixed" position={[0, 3, 12]}>
        <CuboidCollider args={[12, 3, 0.25]} />
      </RigidBody>
      <RigidBody type="fixed" position={[-12, 3, 0]}>
        <CuboidCollider args={[0.25, 3, 12]} />
      </RigidBody>
      <RigidBody type="fixed" position={[12, 3, 0]}>
        <CuboidCollider args={[0.25, 3, 12]} />
      </RigidBody>
    </>
  );
}

function Lights() {
  return (
    <>
      <ambientLight color="#ffeedd" intensity={0.7} />
      <directionalLight
        position={[10, 20, 10]}
        color="#fff5e6"
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <spotLight
        position={[0, 12, 0]}
        color="#ffffff"
        intensity={80}
        angle={1.2}
        penumbra={0.5}
      />
    </>
  );
}

function Game() {
  const kangarooRef = useRef<THREE.Group>(null!);

  return (
    <>
      <GameCamera />
      <color attach="background" args={['#1a1a2e']} />
      <fog attach="fog" args={['#1a1a2e', 25, 55]} />
      <Lights />

      <Physics gravity={[0, -20, 0]}>
        <GymWalls />
        <PlayerController />
      </Physics>

      <GymEquipment />
      <VoxelDog />
      <VoxelKangaroo externalRef={kangarooRef} />
      <VoxelDachshunds kangarooRef={kangarooRef} />
      <VoxelHooni />
      <ExerciseEffect />
    </>
  );
}

export default function App() {
  const setMobileInput = useGameStore(s => s.setMobileInput);
  const triggerMobileAction = useGameStore(s => s.triggerMobileAction);
  const triggerMobileDance = useGameStore(s => s.triggerMobileDance);
  const triggerMobileJump = useGameStore(s => s.triggerMobileJump);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'none' }}>
      <HUD />
      <MobileControls onMove={setMobileInput} onAction={triggerMobileAction} onDance={triggerMobileDance} onJump={triggerMobileJump} />
      <Canvas shadows camera={{ position: [10, 12, 10], fov: 35 }}>
        <Suspense fallback={null}>
          <Game />
        </Suspense>
      </Canvas>
    </div>
  );
}
