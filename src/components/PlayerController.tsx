import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { VoxelCharacter } from './VoxelCharacter';
import { useGameStore } from '../store/gameStore';

const MOVE_SPEED = 5;
const BOUNDS = 11;

export function PlayerController() {
  const rigidBodyRef = useRef<RapierRigidBody>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const keysRef = useRef({ w: false, a: false, s: false, d: false, space: false });
  const [facing, setFacing] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const nearStationRef = useRef<string | null>(null);
  const [nearStation, setNearStation] = useState<string | null>(null);

  const isExercising = useGameStore(s => s.isExercising);
  const currentExercise = useGameStore(s => s.currentExercise);
  const exerciseProgress = useGameStore(s => s.exerciseProgress);
  const startExercise = useGameStore(s => s.startExercise);
  const tick = useGameStore(s => s.tick);
  const { camera } = useThree();

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') keysRef.current.w = true;
      if (key === 'a' || key === 'arrowleft') keysRef.current.a = true;
      if (key === 's' || key === 'arrowdown') keysRef.current.s = true;
      if (key === 'd' || key === 'arrowright') keysRef.current.d = true;
      if (key === ' ' || key === 'e') keysRef.current.space = true;
    };
    const onUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') keysRef.current.w = false;
      if (key === 'a' || key === 'arrowleft') keysRef.current.a = false;
      if (key === 's' || key === 'arrowdown') keysRef.current.s = false;
      if (key === 'd' || key === 'arrowright') keysRef.current.d = false;
      if (key === ' ' || key === 'e') keysRef.current.space = false;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  useFrame(() => {
    if (!rigidBodyRef.current) return;
    const keys = keysRef.current;

    if (isExercising) {
      tick();
    }

    if (keys.space && nearStationRef.current && !isExercising) {
      startExercise(nearStationRef.current);
      keys.space = false;
    }

    if (!isExercising) {
      const pos = rigidBodyRef.current.translation();

      // Get camera forward/right projected onto XZ plane
      const camForward = new THREE.Vector3();
      camera.getWorldDirection(camForward);
      camForward.y = 0;
      camForward.normalize();

      const camRight = new THREE.Vector3();
      camRight.crossVectors(camForward, new THREE.Vector3(0, 1, 0)).normalize();

      // Build movement direction relative to camera
      const moveDir = new THREE.Vector3(0, 0, 0);
      if (keys.w) moveDir.add(camForward);
      if (keys.s) moveDir.sub(camForward);
      if (keys.d) moveDir.add(camRight);
      if (keys.a) moveDir.sub(camRight);

      if (moveDir.lengthSq() > 0) {
        moveDir.normalize().multiplyScalar(MOVE_SPEED);
      }

      const velocity = { x: moveDir.x, y: rigidBodyRef.current.linvel().y, z: moveDir.z };

      // Clamp to bounds
      if (pos.x < -BOUNDS && velocity.x < 0) velocity.x = 0;
      if (pos.x > BOUNDS && velocity.x > 0) velocity.x = 0;
      if (pos.z < -BOUNDS && velocity.z < 0) velocity.z = 0;
      if (pos.z > BOUNDS && velocity.z > 0) velocity.z = 0;

      rigidBodyRef.current.setLinvel(velocity, true);

      const moving = moveDir.lengthSq() > 0;
      setIsWalking(moving);
      if (moving) {
        setFacing(Math.atan2(moveDir.x, moveDir.z));
      }

      // Proximity check to stations
      const stationPositions: Record<string, [number, number, number]> = {
        barbell: [-6, 0, -4],
        dumbbell: [0, 0, -4.5],
        kettlebell: [6, 0, -4],
        jumprope: [-6, 0, 4],
        pullup: [4, 0, 4],
        rings: [4, 0, 8],
      };

      let closest: string | null = null;
      let closestDist = 3.0;
      for (const [name, spos] of Object.entries(stationPositions)) {
        const dx = pos.x - spos[0];
        const dz = pos.z - spos[2];
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < closestDist) {
          closestDist = dist;
          closest = name;
        }
      }
      nearStationRef.current = closest;
      setNearStation(closest);
    } else {
      const curVel = rigidBodyRef.current.linvel();
      rigidBodyRef.current.setLinvel({ x: 0, y: curVel.y, z: 0 }, true);
      setIsWalking(false);
    }

    // Smooth rotation
    if (groupRef.current) {
      const diff = facing - groupRef.current.rotation.y;
      const norm = Math.atan2(Math.sin(diff), Math.cos(diff));
      groupRef.current.rotation.y += norm * 0.15;
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      position={[0, 0.8, 2]}
      enabledRotations={[false, false, false]}
      mass={1}
      linearDamping={5}
      name="player"
    >
      {/* Collider centered on character - half-height 0.75, offset down so feet touch floor */}
      <CuboidCollider args={[0.25, 0.75, 0.2]} position={[0, 0, 0]} />
      <group ref={groupRef} position={[0, -0.75, 0]}>
        <VoxelCharacter
          isExercising={isExercising}
          currentExercise={currentExercise}
          exerciseProgress={exerciseProgress}
          isWalking={isWalking}
        />
      </group>
    </RigidBody>
  );
}
