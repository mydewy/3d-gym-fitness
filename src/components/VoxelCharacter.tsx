import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { handPositions } from '../store/handPositions';

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

// Jump rope: single merged mesh updated via morph-like vertex manipulation
// Uses a fat TubeGeometry-like approach but only updates positions, not recreating geometry
const _ropeUp = new THREE.Vector3(0, 1, 0);
const _ropeDir = new THREE.Vector3();
const _ropeQuat = new THREE.Quaternion();

function JumpRopeRope() {
  const SEGMENTS = 20;
  const groupRef = useRef<THREE.Group>(null!);
  const ROPE_RADIUS = 1.0;
  const ROPE_THICKNESS = 0.04;
  // Use 1.0 height cylinders scaled to actual length - avoids precision issues
  const BASE_HEIGHT = 1.0;

  const pointsRef = useRef<THREE.Vector3[]>([]);
  if (pointsRef.current.length === 0) {
    for (let i = 0; i <= SEGMENTS; i++) {
      pointsRef.current.push(new THREE.Vector3());
    }
  }

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    const ropeSpeed = 16;
    const angle = -(t * ropeSpeed) % (Math.PI * 2);
    const handSpread = 0.5;
    const handY = 0.0;

    const points = pointsRef.current;
    for (let i = 0; i <= SEGMENTS; i++) {
      const frac = i / SEGMENTS;
      const x = (frac - 0.5) * handSpread * 2;
      const arcT = frac * Math.PI;
      const sagFactor = Math.sin(arcT);
      const ry = Math.sin(angle) * sagFactor * ROPE_RADIUS;
      const rz = Math.cos(angle) * sagFactor * ROPE_RADIUS;
      points[i].set(x, handY + ry, rz);
    }

    const children = groupRef.current.children;
    for (let i = 0; i < SEGMENTS; i++) {
      const child = children[i] as THREE.Mesh;
      const a = points[i];
      const b = points[i + 1];

      // Position at midpoint
      child.position.set(
        (a.x + b.x) * 0.5,
        (a.y + b.y) * 0.5,
        (a.z + b.z) * 0.5
      );

      // Direction and length
      _ropeDir.subVectors(b, a);
      const len = _ropeDir.length();
      _ropeDir.normalize();

      // Quaternion that rotates Y-up to the segment direction
      _ropeQuat.setFromUnitVectors(_ropeUp, _ropeDir);
      child.quaternion.copy(_ropeQuat);

      // Scale: x/z = 1 (thickness is baked in geo), y = actual length
      child.scale.set(1, len / BASE_HEIGHT, 1);
    }
  });

  const sharedGeo = useMemo(() => new THREE.CylinderGeometry(ROPE_THICKNESS, ROPE_THICKNESS, BASE_HEIGHT, 5, 1), []);
  const sharedMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#333333' }), []);

  const segs = useMemo(() => {
    const arr = [];
    for (let i = 0; i < SEGMENTS; i++) {
      arr.push(<mesh key={i} geometry={sharedGeo} material={sharedMat} />);
    }
    return arr;
  }, [sharedGeo, sharedMat]);

  return <group ref={groupRef}>{segs}</group>;
}

function JumpRopeHandle() {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.045, 0.045, 0.25, 6]} />
        <meshStandardMaterial color="#ff4488" />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.05, 6]} />
        <meshStandardMaterial color="#ffaacc" />
      </mesh>
      <mesh position={[0, -0.14, 0]}>
        <cylinderGeometry args={[0.05, 0.04, 0.04, 6]} />
        <meshStandardMaterial color="#ffaacc" />
      </mesh>
    </group>
  );
}

export function VoxelCharacter({ isExercising, currentExercise, isWalkingRef, isDancingRef }: {
  isExercising: boolean;
  currentExercise: string | null;
  exerciseProgress?: number;
  isWalkingRef: React.RefObject<boolean>;
  isDancingRef: React.RefObject<boolean>;
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
          const bendAmount = (1 - cycle) * 0.5;
          leftArmX = rightArmX = 0.4 + bendAmount * 0.6;
          leftLegX = bendAmount * 0.3;
          rightLegX = leftLegX;
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
          const swingPhase = (cycle + 1) / 2;
          leftArmX = rightArmX = 1.0 - swingPhase * 2.8;
          leftLegX = (1 - swingPhase) * 0.35;
          rightLegX = leftLegX;
          bodyY = swingPhase * 0.12;
          break;
        }
        case 'jumprope': {
          const ropeSpeed = 16;
          const jumpSpeed = 8;
          const ropeAngle = -(t * ropeSpeed) % (Math.PI * 2);
          const jumpAngle = -(t * jumpSpeed) % (Math.PI * 2);
          const jumpPhase = Math.max(0, Math.sin(jumpAngle));
          bodyY = jumpPhase * 0.6;
          leftArmX = 0.15;
          rightArmX = 0.15;
          leftArmZ = -0.5;
          rightArmZ = 0.5;
          leftWristZ = -Math.sin(ropeAngle) * 0.35;
          rightWristZ = Math.sin(ropeAngle) * 0.35;
          const tuckPhase = Math.max(0, Math.sin(jumpAngle)) * 0.3;
          const landPhase = Math.max(0, -Math.sin(jumpAngle)) * 0.15;
          leftLegX = tuckPhase + landPhase;
          rightLegX = tuckPhase + landPhase;
          break;
        }
        case 'pullup': {
          const pullPhase = (cycle + 1) / 2;
          leftArmX = -2.8 + pullPhase * 0.8;
          rightArmX = leftArmX;
          leftArmZ = 0.3;
          rightArmZ = -0.3;
          bodyY = pullPhase * 0.7;
          leftLegX = Math.sin(t * 4) * 0.06;
          rightLegX = -leftLegX;
          break;
        }
        case 'rings': {
          // Ring Muscle-Up: 5-phase animation
          // Phase 0-0.15: Dead hang (arms up, body low)
          // Phase 0.15-0.4: Pull up to chin (arms bend, body rises)
          // Phase 0.4-0.55: Transition (lean forward over rings, wrists turn)
          // Phase 0.55-0.8: Push/dip (press up above rings)
          // Phase 0.8-1.0: Hold at top then descend back to hang
          const muscleUpSpeed = 3;
          const rawPhase = ((t * muscleUpSpeed) % (Math.PI * 2)) / (Math.PI * 2); // 0 to 1

          if (rawPhase < 0.15) {
            // Dead hang: arms straight up, body hangs low
            const p = rawPhase / 0.15;
            bodyY = 0.8 + p * 0.1; // slight swing
            leftArmX = rightArmX = -3.0; // arms straight up
            leftArmZ = 0.35;
            rightArmZ = -0.35;
            // Legs slightly forward for kip
            leftLegX = Math.sin(p * Math.PI) * 0.3;
            rightLegX = leftLegX;
          } else if (rawPhase < 0.4) {
            // Pull phase: pull body up, bend arms
            const p = (rawPhase - 0.15) / 0.25;
            bodyY = 0.9 + p * 1.2; // rise up
            // Arms go from straight up (-3.0) to bent (-1.8)
            leftArmX = rightArmX = -3.0 + p * 1.2;
            leftArmZ = 0.35 - p * 0.1;
            rightArmZ = -0.35 + p * 0.1;
            // Knees tuck slightly during pull
            leftLegX = 0.2 * (1 - p);
            rightLegX = leftLegX;
          } else if (rawPhase < 0.55) {
            // Transition: lean forward over the rings
            const p = (rawPhase - 0.4) / 0.15;
            bodyY = 2.1 + p * 0.4;
            // Arms transition from pull to support position
            leftArmX = rightArmX = -1.8 + p * 1.5; // from bent pull to forward lean
            leftArmZ = 0.25 - p * 0.15;
            rightArmZ = -0.25 + p * 0.15;
            // Wrists roll over
            leftWristZ = -p * 0.4;
            rightWristZ = p * 0.4;
            leftLegX = p * 0.15;
            rightLegX = leftLegX;
          } else if (rawPhase < 0.8) {
            // Push/dip: press up above rings, arms extend down
            const p = (rawPhase - 0.55) / 0.25;
            bodyY = 2.5 + p * 0.5;
            // Arms push down from bent to straight (support position)
            leftArmX = rightArmX = -0.3 + p * 0.3; // nearly straight at sides
            leftArmZ = 0.1;
            rightArmZ = -0.1;
            leftWristZ = -0.4 * (1 - p);
            rightWristZ = 0.4 * (1 - p);
            leftLegX = 0.15 * (1 - p);
            rightLegX = leftLegX;
          } else {
            // Top hold then descend
            const p = (rawPhase - 0.8) / 0.2;
            bodyY = 3.0 - p * 2.2; // descend back down
            // Arms go from support back to dead hang
            leftArmX = rightArmX = 0.0 - p * 3.0;
            leftArmZ = 0.1 + p * 0.25;
            rightArmZ = -0.1 - p * 0.25;
            leftLegX = p * 0.15;
            rightLegX = leftLegX;
          }
          break;
        }
      }
    } else if (isWalkingRef.current) {
      const walkSpeed = 8;
      const swing = Math.sin(t * walkSpeed);
      leftArmX = -swing * 0.6;
      rightArmX = swing * 0.6;
      leftLegX = swing * 0.7;
      rightLegX = -swing * 0.7;
      bodyY = Math.abs(Math.sin(t * walkSpeed * 2)) * 0.04;
    } else if (isDancingRef.current) {
      // Dance animation: funky groove
      const dSpeed = 5;
      const beat = Math.sin(t * dSpeed);
      const beat2 = Math.sin(t * dSpeed * 2);
      const beat3 = Math.cos(t * dSpeed);

      // Bounce up and down to the beat
      bodyY = Math.abs(beat2) * 0.15;

      // Arms pump and wave
      leftArmX = -1.5 + Math.sin(t * dSpeed + 1) * 0.8;
      rightArmX = -1.5 + Math.sin(t * dSpeed) * 0.8;
      leftArmZ = -0.3 + beat3 * 0.4;
      rightArmZ = 0.3 - beat3 * 0.4;

      // Wrists flick
      leftWristZ = Math.sin(t * dSpeed * 2) * 0.3;
      rightWristZ = -Math.sin(t * dSpeed * 2) * 0.3;

      // Legs step side to side
      leftLegX = beat * 0.3;
      rightLegX = -beat * 0.3;
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
      const walking = isWalkingRef.current;
      const swayX = bouncy ? Math.sin(t * 8) * 0.3 : walking ? Math.sin(t * 8) * 0.15 : Math.sin(t * 1.5) * 0.03;
      const swayZ = (bouncy || walking) ? Math.cos(t * 8) * 0.1 : 0;
      ponytailRef.current.rotation.x = swayX;
      ponytailRef.current.rotation.z = swayZ;
    }

    // Share hand world positions for rings equipment tracking
    if (isExercising && currentExercise === 'rings' && leftWristRef.current && rightWristRef.current) {
      leftWristRef.current.getWorldPosition(handPositions.left);
      rightWristRef.current.getWorldPosition(handPositions.right);
      handPositions.active = true;
    } else {
      handPositions.active = false;
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
      <group ref={wholeBodyRef}>
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

        {/* Upper body */}
        <group position={[0, 0.7, 0]}>
          <VoxelBox position={[0, 0.25, 0]} args={[0.5, 0.4, 0.3]} color={tank} />
          <VoxelBox position={[0, 0, 0]} args={[0.45, 0.15, 0.28]} color={skin} />

          {/* Left arm */}
          <group ref={leftArmRef} position={[-0.35, 0.3, 0]}>
            <VoxelBox position={[0, -0.05, 0]} args={[0.18, 0.15, 0.2]} color={skin} />
            <VoxelBox position={[0, -0.25, 0]} args={[0.16, 0.25, 0.18]} color={skin} />
            <group ref={leftWristRef} position={[0, -0.47, 0]}>
              <VoxelBox position={[0, 0, 0]} args={[0.14, 0.2, 0.16]} color={skin} />
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
              {isExercising && currentExercise === 'jumprope' && (
                <group position={[0, -0.18, 0]}>
                  <JumpRopeHandle />
                </group>
              )}
            </group>
          </group>

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

            <group ref={ponytailRef} position={[0, 0.1, -0.25]}>
              <VoxelBox position={[0, 0, 0]} args={[0.15, 0.15, 0.12]} color={hair} />
              <VoxelBox position={[0, -0.18, -0.06]} args={[0.12, 0.2, 0.1]} color={hair} />
              <VoxelBox position={[0, -0.38, -0.04]} args={[0.1, 0.18, 0.08]} color={hair} />
            </group>

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
