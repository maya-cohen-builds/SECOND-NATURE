import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/* ── Mascot sub-parts ─────────────────────────────────────── */

function Horn({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <mesh position={position} rotation={rotation}>
      <coneGeometry args={[0.08, 0.28, 6]} />
      <meshPhysicalMaterial
        color="#c45a20"
        metalness={0.3}
        roughness={0.25}
        clearcoat={0.6}
      />
    </mesh>
  );
}

function Eye({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Sclera */}
      <mesh>
        <sphereGeometry args={[0.065, 12, 12]} />
        <meshPhysicalMaterial color="#f0e8d8" metalness={0} roughness={0.3} />
      </mesh>
      {/* Pupil */}
      <mesh position={[0, 0, 0.05]}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshPhysicalMaterial color="#1a1a1a" metalness={0.1} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Arm({ position, rotZ }: { position: [number, number, number]; rotZ: number }) {
  return (
    <group position={position} rotation={[0, 0, rotZ]}>
      {/* Upper arm */}
      <mesh position={[0, -0.1, 0]}>
        <capsuleGeometry args={[0.05, 0.12, 4, 8]} />
        <meshPhysicalMaterial
          color="#d4651e"
          metalness={0.15}
          roughness={0.3}
          clearcoat={0.4}
        />
      </mesh>
      {/* Fist */}
      <mesh position={[0, -0.22, 0]}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshPhysicalMaterial
          color="#e8a050"
          metalness={0.1}
          roughness={0.35}
        />
      </mesh>
    </group>
  );
}

function Leg({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <capsuleGeometry args={[0.055, 0.1, 4, 8]} />
      <meshPhysicalMaterial
        color="#8b3510"
        metalness={0.2}
        roughness={0.35}
        clearcoat={0.3}
      />
    </mesh>
  );
}

/* ── Full mascot ──────────────────────────────────────────── */

function MascotBody({ hovered }: { hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Subtle idle breathing
    groupRef.current.scale.setScalar(1 + Math.sin(t * 1.8) * 0.012);
    // Slow body rotation
    groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.12;

    if (headRef.current) {
      // Gentle head tilt
      headRef.current.rotation.z = Math.sin(t * 0.6) * 0.04;
      headRef.current.rotation.x = Math.sin(t * 0.9) * 0.03;
    }
  });

  const bodyColor = '#d4651e';
  const armorColor = '#8b3510';

  return (
    <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.35}>
      <group ref={groupRef} scale={hovered ? 1.08 : 1}>
        {/* ── Head ── */}
        <group ref={headRef} position={[0, 0.32, 0]}>
          {/* Main head sphere */}
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshPhysicalMaterial
              color={bodyColor}
              metalness={0.15}
              roughness={0.25}
              clearcoat={0.5}
              clearcoatRoughness={0.2}
              envMapIntensity={1.2}
            />
          </mesh>

          {/* Brow ridge */}
          <mesh position={[0, 0.06, 0.22]} scale={[1.1, 0.4, 0.5]}>
            <sphereGeometry args={[0.14, 10, 10]} />
            <meshPhysicalMaterial
              color={armorColor}
              metalness={0.25}
              roughness={0.3}
              clearcoat={0.4}
            />
          </mesh>

          {/* Eyes */}
          <Eye position={[-0.1, 0.04, 0.26]} />
          <Eye position={[0.1, 0.04, 0.26]} />

          {/* Mouth area */}
          <mesh position={[0, -0.1, 0.25]} scale={[0.7, 0.3, 0.4]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshPhysicalMaterial
              color="#b8501a"
              metalness={0.1}
              roughness={0.4}
            />
          </mesh>

          {/* Horns */}
          <Horn position={[-0.18, 0.26, 0]} rotation={[0, 0, 0.4]} />
          <Horn position={[0.18, 0.26, 0]} rotation={[0, 0, -0.4]} />
        </group>

        {/* ── Torso / Armor ── */}
        <mesh position={[0, -0.05, 0]}>
          <capsuleGeometry args={[0.18, 0.15, 6, 12]} />
          <meshPhysicalMaterial
            color={armorColor}
            metalness={0.3}
            roughness={0.25}
            clearcoat={0.6}
            clearcoatRoughness={0.15}
          />
        </mesh>

        {/* Chest plate accent */}
        <mesh position={[0, 0, 0.15]} scale={[0.7, 0.6, 0.3]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshPhysicalMaterial
            color="#e8a050"
            metalness={0.35}
            roughness={0.2}
            clearcoat={0.7}
          />
        </mesh>

        {/* ── Arms ── */}
        <Arm position={[-0.25, 0.02, 0]} rotZ={0.3} />
        <Arm position={[0.25, 0.02, 0]} rotZ={-0.3} />

        {/* ── Legs ── */}
        <Leg position={[-0.1, -0.3, 0]} />
        <Leg position={[0.1, -0.3, 0]} />

        {/* ── Ambient glow ── */}
        <pointLight
          position={[0, 0.1, 0.3]}
          intensity={hovered ? 0.8 : 0.35}
          color="#e8a050"
          distance={2.5}
        />
      </group>
    </Float>
  );
}

/* ── Exported component ───────────────────────────────────── */

interface SignalNode3DProps {
  size?: number;
  className?: string;
}

export default function SignalNode3D({ size = 80, className }: SignalNode3DProps) {
  const [hovered, setHovered] = useState(false);
  const [ready, setReady] = useState(false);

  return (
    <div
      className={className}
      style={{ width: size, height: size, opacity: ready ? 1 : 0, transition: 'opacity 0.4s ease' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0.1, 2.8], fov: 30 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
        onCreated={() => setReady(true)}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 3]} intensity={1.2} />
        <directionalLight position={[-2, 1, -2]} intensity={0.3} color="#e8a050" />
        <MascotBody hovered={hovered} />
      </Canvas>
    </div>
  );
}
