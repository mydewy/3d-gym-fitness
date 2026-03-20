import * as THREE from 'three';

// Shared mutable hand world positions — written by VoxelCharacter, read by Rings
export const handPositions = {
  left: new THREE.Vector3(),
  right: new THREE.Vector3(),
  active: false,
};
