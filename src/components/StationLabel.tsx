import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface StationLabelProps {
  position: [number, number, number];
  label: string;
  icon: string;
  color: string;
}

export function StationLabel({ position, label, icon, color }: StationLabelProps) {
  const ref = useRef<THREE.Group>(null!);
  const { scene } = useThree();

  useFrame(() => {
    if (!ref.current) return;
    const player = scene.getObjectByName('player');
    if (!player) return;

    const playerPos = new THREE.Vector3();
    player.getWorldPosition(playerPos);

    const dist = playerPos.distanceTo(new THREE.Vector3(...position));
    const show = dist < 4;
    ref.current.visible = show;
  });

  return (
    <group ref={ref} position={position}>
      <Html center distanceFactor={10}>
        <div style={{
          background: `linear-gradient(135deg, ${color}, ${color}dd)`,
          color: 'white',
          padding: '6px 14px',
          borderRadius: 12,
          fontSize: 12,
          fontFamily: "'Press Start 2P', monospace",
          fontWeight: 'bold',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          boxShadow: `0 4px 16px ${color}66`,
          border: '2px solid rgba(255,255,255,0.3)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          <div style={{ fontSize: 18, marginBottom: 2 }}>{icon}</div>
          <div>{label}</div>
          <div style={{ fontSize: 8, opacity: 0.7, marginTop: 2 }}>SPACE</div>
        </div>
      </Html>
    </group>
  );
}

export function AllStationLabels() {
  return (
    <>
      <StationLabel position={[-6, 2.5, -4]} label="DEADLIFT" icon="🏋️" color="#cc2222" />
      <StationLabel position={[0, 2.5, -4]} label="DUMBBELL" icon="💪" color="#ff6600" />
      <StationLabel position={[6, 2.5, -4]} label="KETTLEBELL" icon="🔔" color="#cc3300" />
      <StationLabel position={[-6, 2.5, 4]} label="JUMP ROPE" icon="⚡" color="#ff4488" />
      <StationLabel position={[4, 5.5, 4]} label="PULL-UP" icon="🔝" color="#4488ff" />
      <StationLabel position={[4, 6.5, 8]} label="RINGS" icon="⭕" color="#ffaa00" />
    </>
  );
}
