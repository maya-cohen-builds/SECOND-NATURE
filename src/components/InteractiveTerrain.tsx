import { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

function TerrainMesh({ imageUrl }: { imageUrl: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef}>
        <boxGeometry args={[2.4, 1.6, 2.4]} />
        <meshPhysicalMaterial
          map={texture}
          transparent
          opacity={0.92}
          roughness={0.1}
          metalness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={1.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

interface InteractiveTerrainProps {
  imageUrl: string;
  className?: string;
}

export function InteractiveTerrain({ imageUrl, className }: InteractiveTerrainProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: hovered ? 'grab' : 'default' }}
    >
      <Canvas
        camera={{ position: [3, 2.5, 3], fov: 40 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-3, 2, -3]} intensity={0.4} color="#4dd0e1" />
        <pointLight position={[0, 3, 0]} intensity={0.8} color="#80deea" />
        <TerrainMesh imageUrl={imageUrl} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2.5}
          maxDistance={7}
          autoRotate={!hovered}
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
}
