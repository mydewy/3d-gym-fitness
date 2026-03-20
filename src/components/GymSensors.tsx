import { CuboidCollider, RigidBody } from '@react-three/rapier';

interface SensorProps {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
}

function Sensor({ id, position, size }: SensorProps) {
  return (
    <RigidBody type="fixed" position={position} name={id} sensor>
      <CuboidCollider args={[size[0] / 2, size[1] / 2, size[2] / 2]} sensor />
    </RigidBody>
  );
}

export function GymSensors() {
  return (
    <>
      <Sensor id="sensor-barbell" position={[-6, 1, -4]} size={[4, 2, 3.5]} />
      <Sensor id="sensor-dumbbell" position={[0, 1, -4.5]} size={[3.5, 2, 3]} />
      <Sensor id="sensor-kettlebell" position={[6, 1, -4]} size={[3.5, 2, 3.5]} />
      <Sensor id="sensor-jumprope" position={[-6, 1, 4]} size={[4, 2, 3.5]} />
      <Sensor id="sensor-pullup" position={[4, 1, 4]} size={[3.5, 2, 3]} />
      <Sensor id="sensor-rings" position={[4, 1, 8]} size={[3.5, 2, 3]} />
    </>
  );
}
