import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function CrystallineShard({ position, scale, rotationSpeed }: { position: [number, number, number]; scale: number; rotationSpeed: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * rotationSpeed;
      ref.current.rotation.x += delta * rotationSpeed * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial
        color="#2bb4c4"
        metalness={0.1}
        roughness={0.05}
        transmission={0.6}
        thickness={0.8}
        ior={2.2}
        envMapIntensity={1.5}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

function CoreNode() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={groupRef}>
        {/* Central crystal */}
        <CrystallineShard position={[0, 0, 0]} scale={0.55} rotationSpeed={0.3} />
        {/* Orbiting fragments */}
        <CrystallineShard position={[0.7, 0.3, 0.2]} scale={0.18} rotationSpeed={0.8} />
        <CrystallineShard position={[-0.5, -0.4, 0.4]} scale={0.14} rotationSpeed={-0.6} />
        <CrystallineShard position={[0.2, 0.5, -0.5]} scale={0.12} rotationSpeed={1.0} />
        {/* Subtle glow point */}
        <pointLight position={[0, 0, 0]} intensity={0.6} color="#4dd0e1" distance={3} />
      </group>
    </Float>
  );
}

interface SignalNode3DProps {
  size?: number;
  className?: string;
}

export default function SignalNode3D({ size = 80, className }: SignalNode3DProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 35 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 3, 3]} intensity={1.0} />
        <directionalLight position={[-2, 1, -2]} intensity={0.3} color="#4dd0e1" />
        <CoreNode />
      </Canvas>
    </div>
  );
}
