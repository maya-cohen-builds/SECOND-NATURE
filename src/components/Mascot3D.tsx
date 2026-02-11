import { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import mascotImage from '@/assets/mascot-warrior.png';

function MascotSprite({ hovered }: { hovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, mascotImage);
  const { pointer } = useThree();

  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Subtle idle breathing (micro-hover)
    const t = performance.now() * 0.001;
    const breathe = Math.sin(t * 1.2) * 0.04;
    meshRef.current.position.y = breathe;

    // Gentle parallax on hover
    if (hovered) {
      const targetRotX = -pointer.y * 0.08;
      const targetRotY = pointer.x * 0.08;
      meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * delta * 3;
      meshRef.current.rotation.y += (targetRotY - meshRef.current.rotation.y) * delta * 3;
    } else {
      meshRef.current.rotation.x += (0 - meshRef.current.rotation.x) * delta * 3;
      meshRef.current.rotation.y += (0 - meshRef.current.rotation.y) * delta * 3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2.4, 2.4]} />
      <meshStandardMaterial
        map={texture}
        transparent
        alphaTest={0.05}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

interface Mascot3DProps {
  className?: string;
  size?: number;
}

export default function Mascot3D({ className, size = 80 }: Mascot3DProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={className}
      style={{ width: size, height: size, cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 35 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[0, 1, 3]} intensity={0.4} />
        <MascotSprite hovered={hovered} />
      </Canvas>
    </div>
  );
}
