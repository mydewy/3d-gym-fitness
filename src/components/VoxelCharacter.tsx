import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

function VoxelBox({ position, args, color }: {
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

// Jump rope that rotates around the character - thick tube mesh
function JumpRopeRope() {
  const SEGMENTS = 20;
  const meshRef = useRef<THREE.Mesh>(null!);
  const ROPE_RADIUS = 1.0;
  const ROPE_THICKNESS = 0.035;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;
    const ropeSpeed = 8;
    // Negate angle so the rope rotates forward (over the head first, then under feet)
    const angle = -(t * ropeSpeed) % (Math.PI * 2);

    const handSpread = 0.5;
    const handY = 0.0;

    // Build curve points for the rope
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= SEGMENTS; i++) {
      const frac = i / SEGMENTS;
      const x = (frac - 0.5) * handSpread * 2;
      const arcT = frac * Math.PI;
      const sagFactor = Math.sin(arcT);
      const ry = Math.sin(angle) * sagFactor * ROPE_RADIUS;
      const rz = Math.cos(angle) * sagFactor * ROPE_RADIUS;
      points.push(new THREE.Vector3(x, handY + ry, rz));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const newGeo = new THREE.TubeGeometry(curve, SEGMENTS * 2, ROPE_THICKNESS, 6, false);

    // Replace geometry
    meshRef.current.geometry.dispose();
    meshRef.current.geometry = newGeo;
  });

  return (
    <mesh ref={meshRef}>
      <tubeGeometry args={[
        new THREE.CatmullRomCurve3([new THREE.Vector3(-0.5, 0, 0), new THREE.Vector3(0.5, 0, 0)]),
        4, ROPE_THICKNESS, 6, false
      ]} />
      <meshStandardMaterial color="#333333" />
    </mesh>
  );
}

// Jump rope handles held in hands - visible size
function JumpRopeHandle() {
  return (
    <group>
      {/* Handle grip */}
      <mesh>
        <cylinderGeometry args={[0.045, 0.045, 0.25, 8]} />
        <meshStandardMaterial color="#ff4488" />
      </mesh>
      {/* Handle cap */}
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.05, 8]} />
        <meshStandardMaterial color="#ffaacc" />
      </mesh>
      {/* Handle bottom */}
      <mesh position={[0, -0.14, 0]}>
        <cylinderGeometry args={[0.05, 0.04, 0.04, 8]} />
        <meshStandardMaterial color="#ffaacc" />
      </mesh>
    </group>
  );
}

export function VoxelCharacter({ isExercising, currentExercise, exerciseProgress, isWalking }: {
  isExercising: boolean;
  currentExercise: string | null;
  exerciseProgress: number;
  isWalking: boolean;
}) {
  const characterScale = useGameStore(s => s.characterScale);

  const leftArmRef = useRef<THREE.Group>(null!);
  const rightArmRef = useRef<THREE.Group>(null!);
  const leftLegRef = useRef<THREE.Group>(null!);
  const rightLegRef = useRef<THREE.Group>(null!);
  const wholeBodyRef = useRef<THREE.Group>(null!);
  const ponytailRef = useRef<THREE.Group>(null!);
  const leftWristRef = useRef<THREE.Group>(null!);
  const rightWristRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    let leftArmX = 0;
    let rightArmX = 0;
    let leftArmZ = 0;
    let rightArmZ = 0;
    let leftWristZ = 0;
    let rightWristZ = 0;
    let leftLegX = 0;
    let rightLegX = 0;
    let bodyY = 0;

    if (isExercising && currentExercise) {
      const speed = 6;
      const cycle = Math.sin(t * speed);

      switch (currentExercise) {
        case 'barbell': {
          // Deadlift: bend forward at hips, arms straight down, then stand up
          // cycle goes -1 to 1. Map to: 0=standing, 1=bent over
          const bendAmount = (1 - cycle) * 0.5; // 0 to 1
          // Torso tilts forward (hip hinge)
          // Arms hang straight down relative to torso
          leftArmX = rightArmX = 0.4 + bendAmount * 0.6; // arms angle forward
          // Legs bend slightly (knee flexion)
          leftLegX = bendAmount * 0.3;
          rightLegX = leftLegX;
          // Body dips down when bent
          bodyY = -bendAmount * 0.2;
          break;
        }
        case 'dumbbell':
          leftArmX = rightArmX = -1.2 + Math.abs(cycle) * 1.2;
          bodyY = Math.abs(cycle) * 0.15;
          leftLegX = (1 - Math.abs(cycle)) * 0.15;
          rightLegX = leftLegX;
          break;
        case 'kettlebell': {
          // Kettlebell swing: hip hinge back then explosive hip thrust forward
          // Arms swing from between legs to overhead
          const swingPhase = (cycle + 1) / 2; // 0 to 1
          // 0 = arms between legs (hinged), 1 = arms overhead (standing tall)
          leftArmX = rightArmX = 1.0 - swingPhase * 2.8; // 1.0 (down/back) to -1.8 (overhead)
          // Hip hinge: bend forward at bottom, stand tall at top
          leftLegX = (1 - swingPhase) * 0.35;
          rightLegX = leftLegX;
          bodyY = swingPhase * 0.12;
          break;
        }
        case 'jumprope': {
          // Rope rotation speed - must match JumpRopeRope component
          const ropeSpeed = 8;
          const angle = -(t * ropeSpeed) % (Math.PI * 2);

          // Jump when rope passes under feet
          const jumpPhase = Math.max(0, Math.sin(angle));
          bodyY = jumpPhase * 0.45;

          // Arms spread outward from body
          // Z rotation: left arm NEGATIVE = outward, right arm POSITIVE = outward
          leftArmX = 0.15;
          rightArmX = 0.15;
          leftArmZ = -0.5;
          rightArmZ = 0.5;

          // Wrist flick
          leftWristZ = -Math.sin(angle) * 0.25;
          rightWristZ = Math.sin(angle) * 0.25;

          // Slight knee bend on landing
          const kneePhase = Math.max(0, -Math.sin(angle)) * 0.15;
          leftLegX = kneePhase;
          rightLegX = kneePhase;
          break;
        }
        case 'pullup': {
          // Pull-up: arms up gripping bar, body pulls up and down
          const pullPhase = (cycle + 1) / 2; // 0=hanging, 1=chin above bar
          // Arms always pointing up, elbow bends at top
          leftArmX = -2.8 + pullPhase * 0.8;
          rightArmX = leftArmX;
          leftArmZ = 0.3; // arms slightly spread
          rightArmZ = -0.3;
          // Body rises
          bodyY = pullPhase * 0.7;
          // Slight leg cross/kick for realism
          leftLegX = Math.sin(t * 4) * 0.06;
          rightLegX = -leftLegX;
          break;
        }
        case 'rings':
          bodyY = Math.abs(cycle) * 1.0;
          leftArmX = rightArmX = -2.8 + Math.abs(cycle) * 1.2;
          leftLegX = cycle * 0.12;
          rightLegX = -leftLegX;
          break;
      }
    } else if (isWalking) {
      const walkSpeed = 8;
      const swing = Math.sin(t * walkSpeed);
      leftArmX = -swing * 0.6;
      rightArmX = swing * 0.6;
      leftLegX = swing * 0.7;
      rightLegX = -swing * 0.7;
      bodyY = Math.abs(Math.sin(t * walkSpeed * 2)) * 0.04;
    } else {
      bodyY = Math.sin(t * 2) * 0.03;
      leftArmX = Math.sin(t * 1.5) * 0.03;
      rightArmX = Math.sin(t * 1.5) * 0.03;
    }

    if (wholeBodyRef.current) wholeBodyRef.current.position.y = bodyY;

    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = leftArmX;
      leftArmRef.current.rotation.z = leftArmZ;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = rightArmX;
      rightArmRef.current.rotation.z = rightArmZ;
    }
    if (leftWristRef.current) leftWristRef.current.rotation.z = leftWristZ;
    if (rightWristRef.current) rightWristRef.current.rotation.z = rightWristZ;
    if (leftLegRef.current) leftLegRef.current.rotation.x = leftLegX;
    if (rightLegRef.current) rightLegRef.current.rotation.x = rightLegX;

    if (ponytailRef.current) {
      const bouncy = currentExercise === 'jumprope' && isExercising;
      const swayX = bouncy ? Math.sin(t * 8) * 0.3 : isWalking ? Math.sin(t * 8) * 0.15 : Math.sin(t * 1.5) * 0.03;
      const swayZ = (bouncy || isWalking) ? Math.cos(t * 8) * 0.1 : 0;
      ponytailRef.current.rotation.x = swayX;
      ponytailRef.current.rotation.z = swayZ;
    }
  });

  const skin = '#ffe0bd';
  const hair = '#1a0a00';
  const headband = '#ff4488';
  const tank = '#44ddff';
  const shorts = '#222222';
  const shoes = '#ff6644';

  return (
    <group scale={[characterScale, characterScale, characterScale]}>
      {/* Whole body moves up/down together */}
      <group ref={wholeBodyRef}>
        {/* === LEGS (pivot at hip) === */}
        {/* Left leg */}
        <group ref={leftLegRef} position={[-0.15, 0.55, 0]}>
          <VoxelBox position={[0, -0.15, 0]} args={[0.22, 0.45, 0.25]} color={shorts} />
          <VoxelBox position={[0, -0.5, 0]} args={[0.2, 0.3, 0.22]} color={skin} />
          <VoxelBox position={[0, -0.7, 0.04]} args={[0.22, 0.1, 0.3]} color={shoes} />
        </group>
        {/* Right leg */}
        <group ref={rightLegRef} position={[0.15, 0.55, 0]}>
          <VoxelBox position={[0, -0.15, 0]} args={[0.22, 0.45, 0.25]} color={shorts} />
          <VoxelBox position={[0, -0.5, 0]} args={[0.2, 0.3, 0.22]} color={skin} />
          <VoxelBox position={[0, -0.7, 0.04]} args={[0.22, 0.1, 0.3]} color={shoes} />
        </group>

        {/* === UPPER BODY === */}
        <group position={[0, 0.7, 0]}>
          {/* Torso - crop tank */}
          <VoxelBox position={[0, 0.25, 0]} args={[0.5, 0.4, 0.3]} color={tank} />
          {/* Midriff - exposed skin */}
          <VoxelBox position={[0, 0, 0]} args={[0.45, 0.15, 0.28]} color={skin} />

          {/* Left arm */}
          <group ref={leftArmRef} position={[-0.35, 0.3, 0]}>
            <VoxelBox position={[0, -0.05, 0]} args={[0.18, 0.15, 0.2]} color={skin} />
            <VoxelBox position={[0, -0.25, 0]} args={[0.16, 0.25, 0.18]} color={skin} />
            <group ref={leftWristRef} position={[0, -0.47, 0]}>
              <VoxelBox position={[0, 0, 0]} args={[0.14, 0.2, 0.16]} color={skin} />
              {/* Jump rope handle in left hand - extends below fist */}
              {isExercising && currentExercise === 'jumprope' && (
                <group position={[0, -0.18, 0]}>
                  <JumpRopeHandle />
                </group>
              )}
            </group>
          </group>

          {/* Right arm */}
          <group ref={rightArmRef} position={[0.35, 0.3, 0]}>
            <VoxelBox position={[0, -0.05, 0]} args={[0.18, 0.15, 0.2]} color={skin} />
            <VoxelBox position={[0, -0.25, 0]} args={[0.16, 0.25, 0.18]} color={skin} />
            <group ref={rightWristRef} position={[0, -0.47, 0]}>
              <VoxelBox position={[0, 0, 0]} args={[0.14, 0.2, 0.16]} color={skin} />
              {/* Jump rope handle in right hand - extends below fist */}
              {isExercising && currentExercise === 'jumprope' && (
                <group position={[0, -0.18, 0]}>
                  <JumpRopeHandle />
                </group>
              )}
            </group>
          </group>

          {/* Jump rope - rope rendered at upper body level, handles in hands */}
          {isExercising && currentExercise === 'jumprope' && (
            <JumpRopeRope />
          )}

          {/* Head */}
          <group position={[0, 0.65, 0]}>
            <VoxelBox position={[0, 0, 0]} args={[0.4, 0.4, 0.4]} color={skin} />
            <VoxelBox position={[0, 0.18, -0.02]} args={[0.44, 0.12, 0.44]} color={hair} />
            <VoxelBox position={[-0.2, 0.05, -0.05]} args={[0.08, 0.25, 0.4]} color={hair} />
            <VoxelBox position={[0.2, 0.05, -0.05]} args={[0.08, 0.25, 0.4]} color={hair} />
            <VoxelBox position={[0, 0, -0.2]} args={[0.38, 0.35, 0.08]} color={hair} />
            <VoxelBox position={[0, 0.12, 0]} args={[0.46, 0.08, 0.46]} color={headband} />

            {/* Ponytail */}
            <group ref={ponytailRef} position={[0, 0.1, -0.25]}>
              <VoxelBox position={[0, 0, 0]} args={[0.15, 0.15, 0.12]} color={hair} />
              <VoxelBox position={[0, -0.18, -0.06]} args={[0.12, 0.2, 0.1]} color={hair} />
              <VoxelBox position={[0, -0.38, -0.04]} args={[0.1, 0.18, 0.08]} color={hair} />
            </group>

            {/* Eyes */}
            <VoxelBox position={[-0.1, 0.02, 0.2]} args={[0.08, 0.06, 0.02]} color="#222222" />
            <VoxelBox position={[0.1, 0.02, 0.2]} args={[0.08, 0.06, 0.02]} color="#222222" />
            <VoxelBox position={[-0.08, 0.04, 0.21]} args={[0.03, 0.03, 0.01]} color="#ffffff" />
            <VoxelBox position={[0.12, 0.04, 0.21]} args={[0.03, 0.03, 0.01]} color="#ffffff" />
            <VoxelBox position={[0, -0.1, 0.2]} args={[0.12, 0.03, 0.02]} color="#ee8877" />
            <VoxelBox position={[-0.14, -0.04, 0.19]} args={[0.08, 0.05, 0.01]} color="#ffaaaa" />
            <VoxelBox position={[0.14, -0.04, 0.19]} args={[0.08, 0.05, 0.01]} color="#ffaaaa" />
          </group>
        </group>
      </group>
    </group>
  );
}
