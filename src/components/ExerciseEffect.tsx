import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

// Floating particles when exercising (sweat drops / energy particles)
export function ExerciseEffect() {
  const isExercising = useGameStore(s => s.isExercising);
  const particlesRef = useRef<THREE.Points>(null!);
  const { scene } = useThree();

  const count = 20;
  const positions = useRef(new Float32Array(count * 3));
  const velocities = useRef(new Float32Array(count * 3));
  const lifetimes = useRef(new Float32Array(count));

  useFrame(() => {
    if (!particlesRef.current) return;
    const player = scene.getObjectByName('player');
    if (!player) return;

    const playerPos = new THREE.Vector3();
    player.getWorldPosition(playerPos);

    const posArray = positions.current;
    const velArray = velocities.current;
    const lifeArray = lifetimes.current;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      if (isExercising) {
        lifeArray[i] -= 0.02;
        if (lifeArray[i] <= 0) {
          // Respawn particle near player
          posArray[i3] = playerPos.x + (Math.random() - 0.5) * 0.8;
          posArray[i3 + 1] = playerPos.y + 1 + Math.random() * 0.5;
          posArray[i3 + 2] = playerPos.z + (Math.random() - 0.5) * 0.8;
          velArray[i3] = (Math.random() - 0.5) * 0.02;
          velArray[i3 + 1] = 0.02 + Math.random() * 0.03;
          velArray[i3 + 2] = (Math.random() - 0.5) * 0.02;
          lifeArray[i] = 0.5 + Math.random() * 0.5;
        } else {
          posArray[i3] += velArray[i3];
          posArray[i3 + 1] += velArray[i3 + 1];
          posArray[i3 + 2] += velArray[i3 + 2];
        }
      } else {
        // Hide particles
        posArray[i3 + 1] = -100;
        lifeArray[i] = 0;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffcc00"
        size={0.12}
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  );
}
