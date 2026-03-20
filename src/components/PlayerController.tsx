import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { VoxelCharacter } from './VoxelCharacter';
import { useGameStore } from '../store/gameStore';

const MOVE_SPEED = 5;
const BOUNDS = 11;

// Reusable vectors (avoid GC every frame)
const _camForward = new THREE.Vector3();
const _camRight = new THREE.Vector3();
const _moveDir = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);

const stationPositions: Record<string, [number, number, number]> = {
  barbell: [-6, 0, -4],
  dumbbell: [0, 0, -4.5],
  kettlebell: [6, 0, -4],
  jumprope: [-6, 0, 4],
  pullup: [4, 0, 4],
  rings: [4, 0, 8],
};

export function PlayerController() {
  const rigidBodyRef = useRef<RapierRigidBody>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const keysRef = useRef({ w: false, a: false, s: false, d: false, space: false, e: false });
  const facingRef = useRef(0);
  const isWalkingRef = useRef(false);
  const isDancingRef = useRef(false);
  const isJumpingRef = useRef(false);
  const nearStationRef = useRef<string | null>(null);

  const isExercising = useGameStore(s => s.isExercising);
  const currentExercise = useGameStore(s => s.currentExercise);
  const exerciseProgress = useGameStore(s => s.exerciseProgress);
  const startExercise = useGameStore(s => s.startExercise);
  const tick = useGameStore(s => s.tick);
  const mobileInput = useGameStore(s => s.mobileInput);
  const mobileAction = useGameStore(s => s.mobileAction);
  const clearMobileAction = useGameStore(s => s.clearMobileAction);
  const mobileDance = useGameStore(s => s.mobileDance);
  const clearMobileDance = useGameStore(s => s.clearMobileDance);
  const mobileJump = useGameStore(s => s.mobileJump);
  const clearMobileJump = useGameStore(s => s.clearMobileJump);
  const { camera } = useThree();

  // Keyboard event listeners (attached once via ref check)
  const listenersAttached = useRef(false);
  if (!listenersAttached.current) {
    listenersAttached.current = true;
    const onDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') keysRef.current.w = true;
      if (key === 'a' || key === 'arrowleft') keysRef.current.a = true;
      if (key === 's' || key === 'arrowdown') keysRef.current.s = true;
      if (key === 'd' || key === 'arrowright') keysRef.current.d = true;
      if (key === ' ') keysRef.current.space = true;
      if (key === 'e') keysRef.current.e = true;
      if (key === 't') isDancingRef.current = !isDancingRef.current;
    };
    const onUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') keysRef.current.w = false;
      if (key === 'a' || key === 'arrowleft') keysRef.current.a = false;
      if (key === 's' || key === 'arrowdown') keysRef.current.s = false;
      if (key === 'd' || key === 'arrowright') keysRef.current.d = false;
      if (key === ' ') keysRef.current.space = false;
      if (key === 'e') keysRef.current.e = false;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
  }

  useFrame(() => {
    if (!rigidBodyRef.current) return;
    const keys = keysRef.current;

    if (isExercising) {
      tick();
    }

    if ((keys.e || mobileAction) && nearStationRef.current && !isExercising) {
      startExercise(nearStationRef.current);
      keys.e = false;
      isDancingRef.current = false;
      if (mobileAction) clearMobileAction();

      // Face toward the station when starting exercise
      const station = stationPositions[nearStationRef.current];
      if (station) {
        const pos = rigidBodyRef.current.translation();
        facingRef.current = Math.atan2(station[0] - pos.x, station[2] - pos.z);
      }
    }
    if (mobileAction && !nearStationRef.current) clearMobileAction();

    if (mobileDance) {
      isDancingRef.current = !isDancingRef.current;
      clearMobileDance();
    }

    if (!isExercising) {
      const pos = rigidBodyRef.current.translation();

      camera.getWorldDirection(_camForward);
      _camForward.y = 0;
      _camForward.normalize();
      _camRight.crossVectors(_camForward, _up).normalize();

      _moveDir.set(0, 0, 0);
      if (keys.w) _moveDir.add(_camForward);
      if (keys.s) _moveDir.sub(_camForward);
      if (keys.d) _moveDir.add(_camRight);
      if (keys.a) _moveDir.sub(_camRight);

      // Mobile joystick
      if (Math.abs(mobileInput.x) > 0.05 || Math.abs(mobileInput.y) > 0.05) {
        _moveDir.x += _camRight.x * mobileInput.x - _camForward.x * mobileInput.y;
        _moveDir.z += _camRight.z * mobileInput.x - _camForward.z * mobileInput.y;
      }

      const hasInput = _moveDir.lengthSq() > 0;
      if (hasInput) {
        _moveDir.normalize().multiplyScalar(MOVE_SPEED);
      }

      let vy = rigidBodyRef.current.linvel().y;
      let vx = _moveDir.x;
      let vz = _moveDir.z;

      if (pos.x < -BOUNDS && vx < 0) vx = 0;
      if (pos.x > BOUNDS && vx > 0) vx = 0;
      if (pos.z < -BOUNDS && vz < 0) vz = 0;
      if (pos.z > BOUNDS && vz > 0) vz = 0;

      // Jump: only when on/near ground
      const onGround = pos.y < 1.2;
      const wantJump = keys.space || mobileJump;
      if (wantJump && onGround && !isJumpingRef.current) {
        vy = 8;
        isJumpingRef.current = true;
      }
      if (!keys.space && !mobileJump) {
        isJumpingRef.current = false;
      }
      if (mobileJump) clearMobileJump();

      rigidBodyRef.current.setLinvel({ x: vx, y: vy, z: vz }, true);

      isWalkingRef.current = hasInput;
      if (hasInput) {
        facingRef.current = Math.atan2(_moveDir.x, _moveDir.z);
        isDancingRef.current = false;
      }

      // Proximity check
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
    } else {
      const curVel = rigidBodyRef.current.linvel();
      rigidBodyRef.current.setLinvel({ x: 0, y: curVel.y, z: 0 }, true);
      isWalkingRef.current = false;
    }

    // Smooth rotation
    if (groupRef.current) {
      const diff = facingRef.current - groupRef.current.rotation.y;
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
      <CuboidCollider args={[0.25, 0.75, 0.2]} position={[0, 0, 0]} />
      <group ref={groupRef} position={[0, -0.75, 0]}>
        <VoxelCharacter
          isExercising={isExercising}
          currentExercise={currentExercise}
          exerciseProgress={exerciseProgress}
          isWalkingRef={isWalkingRef}
          isDancingRef={isDancingRef}
        />
      </group>
    </RigidBody>
  );
}
