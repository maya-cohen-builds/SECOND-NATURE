import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const NODE_COLOR = new THREE.Color('hsl(35, 92%, 55%)');
const EDGE_COLOR = new THREE.Color('hsl(35, 60%, 35%)');

const nodes: [number, number, number][] = [
  [0, 0, 0.45], [0.5, 0.35, 0.4], [-0.5, 0.3, 0.42], [0.3, -0.4, 0.38], [-0.4, -0.35, 0.4],
  [0.55, 0, 0], [-0.55, 0, 0.05], [0, 0.55, -0.05], [0, -0.55, 0.05], [0.35, 0.35, 0], [-0.35, -0.35, 0],
  [0, 0, -0.45], [0.45, 0.3, -0.4], [-0.45, 0.25, -0.42], [0.3, -0.35, -0.38], [-0.35, -0.4, -0.4],
];

const edges: [number, number][] = [
  [0, 5], [0, 6], [0, 11], [1, 5], [1, 9], [1, 12], [2, 6], [2, 7], [2, 13],
  [3, 8], [3, 5], [3, 14], [4, 6], [4, 10], [4, 15], [5, 12], [6, 13], [7, 13],
  [8, 14], [9, 12], [10, 15], [11, 12], [11, 13], [11, 14], [11, 15],
];

function LatticeGeometry({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const speedRef = useRef(0);

  useFrame((_, delta) => {
    // Smoothly ramp speed toward target
    const target = active ? 1 : 0;
    speedRef.current += (target - speedRef.current) * Math.min(delta * 2, 0.08);

    if (groupRef.current && speedRef.current > 0.001) {
      groupRef.current.rotation.y += delta * 0.18 * speedRef.current;
      groupRef.current.rotation.x += delta * 0.025 * speedRef.current;
    }
  });

  const edgeGeometries = useMemo(() => {
    return edges.map(([a, b]) => {
      const start = new THREE.Vector3(...nodes[a]);
      const end = new THREE.Vector3(...nodes[b]);
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const dir = new THREE.Vector3().subVectors(end, start);
      const len = dir.length();
      const geo = new THREE.CylinderGeometry(0.012, 0.012, len, 4);
      const quat = new THREE.Quaternion();
      quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      return { position: mid, quaternion: quat, geo };
    });
  }, []);

  return (
    <group ref={groupRef}>
      {nodes.map((pos, i) => {
        const isCenter = i === 0 || i === 11;
        return (
          <mesh key={`n${i}`} position={pos}>
            <sphereGeometry args={[isCenter ? 0.07 : 0.045, 12, 12]} />
            <meshStandardMaterial
              color={NODE_COLOR}
              emissive={NODE_COLOR}
              emissiveIntensity={isCenter ? 0.4 : 0.15}
              transparent
              opacity={0.85}
            />
          </mesh>
        );
      })}
      {edgeGeometries.map((e, i) => (
        <mesh key={`e${i}`} position={e.position} quaternion={e.quaternion} geometry={e.geo}>
          <meshStandardMaterial color={EDGE_COLOR} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export default function LatticeSpinner({ active = false }: { active?: boolean }) {
  return (
    <div className="w-24 h-24 shrink-0" style={{ mixBlendMode: 'lighten' }}>
      <Canvas
        camera={{ position: [0, 0, 2.6], fov: 32 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 2, 4]} intensity={0.7} />
        <LatticeGeometry active={active} />
      </Canvas>
    </div>
  );
}
