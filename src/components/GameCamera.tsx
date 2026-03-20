import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export function GameCamera() {
  const controlsRef = useRef<any>(null);
  const { scene } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    if (!controlsRef.current) return;

    const player = scene.getObjectByName('player');
    if (!player) return;

    const worldPos = new THREE.Vector3();
    player.getWorldPosition(worldPos);

    // Smooth follow
    targetPos.current.lerp(worldPos, 0.08);
    controlsRef.current.target.copy(targetPos.current);
    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      enableZoom={true}
      minDistance={5}
      maxDistance={25}
      maxPolarAngle={Math.PI / 2.2}
      minPolarAngle={0.3}
    />
  );
}
