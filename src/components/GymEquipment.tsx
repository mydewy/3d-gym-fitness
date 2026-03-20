import { useMemo } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

function Box({ position, args, color, rotation }: {
  position: [number, number, number];
  args: [number, number, number];
  color: string;
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Cyl({ position, args, color, rotation }: {
  position: [number, number, number];
  args: [number, number, number, number];
  color: string;
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={args} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function MetalCyl({ position, args, color, rotation }: {
  position: [number, number, number];
  args: [number, number, number, number];
  color: string;
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={args} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

// ========== BARBELL (-6, 0, -4) ==========
function Barbell() {
  // Barbell rests on the floor on its plates (plate radius ~0.35, so center at y=0.35)
  const barY = 0.35;
  return (
    <group>
      {/* Bar - horizontal along X axis */}
      <MetalCyl position={[-6, barY, -4]} args={[0.05, 0.05, 2.8, 8]} color="#c0c0c0" rotation={[0, 0, Math.PI / 2]} />
      {/* Plates left - rotated to sit vertically on the bar (faces along X) */}
      <Cyl position={[-7.2, barY, -4]} args={[0.35, 0.35, 0.12, 16]} color="#cc2222" rotation={[0, 0, Math.PI / 2]} />
      <Cyl position={[-7.35, barY, -4]} args={[0.3, 0.3, 0.1, 16]} color="#aa1111" rotation={[0, 0, Math.PI / 2]} />
      {/* Plates right */}
      <Cyl position={[-4.8, barY, -4]} args={[0.35, 0.35, 0.12, 16]} color="#2222cc" rotation={[0, 0, Math.PI / 2]} />
      <Cyl position={[-4.65, barY, -4]} args={[0.3, 0.3, 0.1, 16]} color="#1111aa" rotation={[0, 0, Math.PI / 2]} />
      {/* Collars */}
      <Cyl position={[-7.05, barY, -4]} args={[0.08, 0.08, 0.08, 8]} color="#888888" rotation={[0, 0, Math.PI / 2]} />
      <Cyl position={[-4.95, barY, -4]} args={[0.08, 0.08, 0.08, 8]} color="#888888" rotation={[0, 0, Math.PI / 2]} />
    </group>
  );
}

// ========== DUMBBELL RACK (0, 0, -4) ==========
function DumbbellRack() {
  return (
    <group>
      {/* Rack structure */}
      <Box position={[0, 0.5, -5.2]} args={[2.8, 0.1, 0.6]} color="#333333" />
      {/* Rack legs */}
      <Box position={[-1.2, 0.25, -5.2]} args={[0.1, 0.5, 0.5]} color="#333333" />
      <Box position={[1.2, 0.25, -5.2]} args={[0.1, 0.5, 0.5]} color="#333333" />
      {/* Dumbbell 1 (left) */}
      <Box position={[-0.6, 0.65, -5.2]} args={[0.15, 0.15, 0.55]} color="#aaaaaa" />
      <Box position={[-0.6, 0.65, -5.5]} args={[0.3, 0.3, 0.1]} color="#ff6600" />
      <Box position={[-0.6, 0.65, -4.9]} args={[0.3, 0.3, 0.1]} color="#ff6600" />
      {/* Dumbbell 2 (center) */}
      <Box position={[0, 0.65, -5.2]} args={[0.15, 0.15, 0.55]} color="#aaaaaa" />
      <Box position={[0, 0.65, -5.5]} args={[0.35, 0.35, 0.1]} color="#22aa22" />
      <Box position={[0, 0.65, -4.9]} args={[0.35, 0.35, 0.1]} color="#22aa22" />
      {/* Dumbbell 3 (right) */}
      <Box position={[0.6, 0.65, -5.2]} args={[0.15, 0.15, 0.55]} color="#aaaaaa" />
      <Box position={[0.6, 0.65, -5.5]} args={[0.4, 0.4, 0.1]} color="#cc2222" />
      <Box position={[0.6, 0.65, -4.9]} args={[0.4, 0.4, 0.1]} color="#cc2222" />
    </group>
  );
}

// ========== KETTLEBELL (6, 0, -4) ==========
function Kettlebells() {
  return (
    <group>
      {/* KB 1 - small black */}
      <mesh position={[5.6, 0.3, -4]} castShadow>
        <sphereGeometry args={[0.28, 8, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Handle */}
      <Cyl position={[5.6, 0.65, -4]} args={[0.15, 0.15, 0.06, 8]} color="#333333" />
      <Box position={[5.6, 0.55, -4]} args={[0.04, 0.2, 0.04]} color="#333333" />
      <Box position={[5.48, 0.55, -4]} args={[0.04, 0.2, 0.04]} color="#333333" />
      <Box position={[5.72, 0.55, -4]} args={[0.04, 0.2, 0.04]} color="#333333" />

      {/* KB 2 - big red */}
      <mesh position={[6.3, 0.35, -4]} castShadow>
        <sphereGeometry args={[0.33, 8, 8]} />
        <meshStandardMaterial color="#cc3300" />
      </mesh>
      <Cyl position={[6.3, 0.75, -4]} args={[0.17, 0.17, 0.06, 8]} color="#333333" />
      <Box position={[6.3, 0.63, -4]} args={[0.04, 0.22, 0.04]} color="#333333" />
      <Box position={[6.15, 0.63, -4]} args={[0.04, 0.22, 0.04]} color="#333333" />
      <Box position={[6.45, 0.63, -4]} args={[0.04, 0.22, 0.04]} color="#333333" />

      {/* KB 3 - yellow */}
      <mesh position={[6.9, 0.32, -3.7]} castShadow>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#ddaa00" />
      </mesh>
      <Cyl position={[6.9, 0.7, -3.7]} args={[0.16, 0.16, 0.06, 8]} color="#333333" />
      <Box position={[6.9, 0.58, -3.7]} args={[0.04, 0.2, 0.04]} color="#333333" />
      <Box position={[6.76, 0.58, -3.7]} args={[0.04, 0.2, 0.04]} color="#333333" />
      <Box position={[7.04, 0.58, -3.7]} args={[0.04, 0.2, 0.04]} color="#333333" />
    </group>
  );
}

// ========== JUMP ROPE (-6, 0, 4) ==========
function JumpRope() {
  const isExercising = useGameStore(s => s.isExercising);
  const currentExercise = useGameStore(s => s.currentExercise);
  const isJumping = isExercising && currentExercise === 'jumprope';

  const ropeGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.3, 0.35, 0),
      new THREE.Vector3(-0.15, 0.05, 0.15),
      new THREE.Vector3(0, -0.02, 0.2),
      new THREE.Vector3(0.15, 0.05, 0.15),
      new THREE.Vector3(0.3, 0.35, 0),
    ]);
    return new THREE.TubeGeometry(curve, 20, 0.025, 8, false);
  }, []);

  // Hide equipment when character is using it
  if (isJumping) return null;

  return (
    <group>
      {/* Handle left - standing upright on the mat */}
      <Cyl position={[-6.3, 0.2, 4]} args={[0.05, 0.05, 0.35, 6]} color="#ff4488" />
      <Cyl position={[-6.3, 0.4, 4]} args={[0.06, 0.06, 0.06, 6]} color="#ffaacc" />
      {/* Handle right - standing upright on the mat */}
      <Cyl position={[-5.7, 0.2, 4]} args={[0.05, 0.05, 0.35, 6]} color="#ff4488" />
      <Cyl position={[-5.7, 0.4, 4]} args={[0.06, 0.06, 0.06, 6]} color="#ffaacc" />
      {/* Rope draped between handles on the ground */}
      <mesh position={[-6, 0.04, 4]} geometry={ropeGeo}>
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
}

// ========== PULL-UP BAR (4, 0, 4) ==========
function PullUpBar() {
  return (
    <group>
      {/* Left post */}
      <Box position={[2.8, 2, 4]} args={[0.2, 4, 0.2]} color="#222222" />
      {/* Right post */}
      <Box position={[5.2, 2, 4]} args={[0.2, 4, 0.2]} color="#222222" />
      {/* Cross brace bottom */}
      <Box position={[4, 0.3, 4]} args={[2.6, 0.1, 0.15]} color="#333333" />
      {/* Bar */}
      <MetalCyl position={[4, 4, 4]} args={[0.05, 0.05, 2.6, 12]} color="#c0c0c0" rotation={[0, 0, 1.57]} />
      {/* Second bar (for variety) */}
      <MetalCyl position={[4, 3.5, 3.8]} args={[0.04, 0.04, 2.2, 12]} color="#aaaaaa" rotation={[0, 0, 1.57]} />
    </group>
  );
}

// ========== RINGS (4, 0, 8) ==========
function Rings() {
  return (
    <group>
      {/* Frame posts */}
      <Box position={[2.8, 2.5, 8]} args={[0.2, 5, 0.2]} color="#222222" />
      <Box position={[5.2, 2.5, 8]} args={[0.2, 5, 0.2]} color="#222222" />
      {/* Top bar */}
      <Box position={[4, 5, 8]} args={[2.6, 0.15, 0.15]} color="#222222" />
      {/* Cross brace */}
      <Box position={[4, 0.3, 8]} args={[2.6, 0.1, 0.15]} color="#333333" />

      {/* Left strap + ring */}
      <Box position={[3.5, 3.5, 8]} args={[0.04, 2.8, 0.04]} color="#ffcc00" />
      <mesh position={[3.5, 2.0, 8]}>
        <torusGeometry args={[0.16, 0.025, 8, 16]} />
        <meshStandardMaterial color="#dddddd" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Right strap + ring */}
      <Box position={[4.5, 3.5, 8]} args={[0.04, 2.8, 0.04]} color="#ffcc00" />
      <mesh position={[4.5, 2.0, 8]}>
        <torusGeometry args={[0.16, 0.025, 8, 16]} />
        <meshStandardMaterial color="#dddddd" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

// ========== GYM ENVIRONMENT ==========
function GymStructure() {
  return (
    <group>
      {/* Floor */}
      <Box position={[0, -0.25, 0]} args={[24, 0.5, 24]} color="#3a3a3a" />

      {/* Rubber mats */}
      <Box position={[-6, 0.02, -4]} args={[4, 0.05, 3]} color="#2d2d2d" />
      <Box position={[0, 0.02, -4.5]} args={[3.5, 0.05, 2.5]} color="#2d2d2d" />
      <Box position={[6, 0.02, -4]} args={[3, 0.05, 3]} color="#2d2d2d" />
      <Box position={[-6, 0.02, 4]} args={[3.5, 0.05, 3]} color="#1a3a1a" />
      <Box position={[4, 0.02, 4]} args={[3.5, 0.05, 2.5]} color="#2d1a1a" />
      <Box position={[4, 0.02, 8]} args={[3.5, 0.05, 2.5]} color="#1a1a2d" />

      {/* Walls */}
      <Box position={[0, 3, -12]} args={[24, 6, 0.5]} color="#555555" />
      <Box position={[-12, 3, 0]} args={[0.5, 6, 24]} color="#4a4a4a" />
      <Box position={[12, 3, 0]} args={[0.5, 6, 24]} color="#4a4a4a" />
      <Box position={[0, 3, 12]} args={[24, 6, 0.5]} color="#4a4a4a" />

      {/* Wall decorations */}
      <Box position={[0, 4.5, -11.7]} args={[10, 0.3, 0.1]} color="#ff4444" />
      <Box position={[0, 4, -11.7]} args={[3, 1.5, 0.1]} color="#111111" />

      {/* Chalk bucket */}
      <Cyl position={[-10, 0.35, -10]} args={[0.3, 0.25, 0.7, 6]} color="#eeeeee" />
      {/* Water bottle */}
      <Cyl position={[10, 0.3, -10]} args={[0.1, 0.1, 0.5, 6]} color="#4488ff" />
      {/* Foam roller */}
      <Cyl position={[10, 0.15, 8]} args={[0.15, 0.15, 0.8, 8]} color="#6644aa" rotation={[0, 0, 1.57]} />
    </group>
  );
}

export function GymEquipment() {
  return (
    <group>
      <GymStructure />
      <Barbell />
      <DumbbellRack />
      <Kettlebells />
      <JumpRope />
      <PullUpBar />
      <Rings />
    </group>
  );
}
