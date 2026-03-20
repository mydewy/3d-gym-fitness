import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { GymEquipment } from './components/GymEquipment';
import { PlayerController } from './components/PlayerController';
import { GameCamera } from './components/GameCamera';
import { AllStationLabels } from './components/StationLabel';
import { ExerciseEffect } from './components/ExerciseEffect';
import { HUD } from './components/HUD';

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
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
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
        castShadow
      />
    </>
  );
}

function Game() {
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
      <AllStationLabels />
      <ExerciseEffect />
    </>
  );
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <HUD />
      <Canvas shadows camera={{ position: [10, 12, 10], fov: 35 }}>
        <Suspense fallback={null}>
          <Game />
        </Suspense>
      </Canvas>
    </div>
  );
}
