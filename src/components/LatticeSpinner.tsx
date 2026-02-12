import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import posLattice from '@/assets/pos-lattice.png';

function RotatingBox() {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, posLattice);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.57;
      meshRef.current.rotation.x += delta * 0.08;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.6, 1.6, 0.35]} />
      <meshStandardMaterial map={texture} transparent opacity={0.7} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function LatticeSpinner() {
  return (
    <div className="w-24 h-24 shrink-0" style={{ mixBlendMode: 'lighten' }}>
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 30 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 2, 3]} intensity={0.6} />
        <RotatingBox />
      </Canvas>
    </div>
  );
}
