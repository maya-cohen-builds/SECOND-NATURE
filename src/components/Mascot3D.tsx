import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ─── Color palette from design tokens (HSL → hex) ─── */
const COLORS = {
  body: '#1a2a38',       // dark armored base
  armor: '#2d4a5e',      // secondary armor panels
  visor: '#2bb8cc',       // primary teal (--primary 185 60% 45%)
  visorGlow: '#3dcfdf',   // visor emission
  accent: '#d4882a',      // accent amber (--accent 35 78% 52%)
  trim: '#3a5568',        // muted edge trim
  dark: '#0f1a22',        // deep shadow tone
};

/* ─── Warrior Character ─── */
function WarriorCharacter({ clicked, scrollY }: { clicked: boolean; scrollY: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const clickPhase = useRef(0);
  const clickActive = useRef(false);

  useEffect(() => {
    if (clicked) {
      clickActive.current = true;
      clickPhase.current = 0;
    }
  }, [clicked]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const t = performance.now() * 0.001;

    // Idle breathing — vertical oscillation with mass
    const breathe = Math.sin(t * 1.4) * 0.035;
    groupRef.current.position.y = breathe;

    // Subtle weight shift — rotational micro-sway
    const swayX = Math.sin(t * 0.7) * 0.015;
    const swayZ = Math.cos(t * 0.9) * 0.01;
    groupRef.current.rotation.z = swayZ;

    // Scroll reactivity — tilt and sway
    const scrollNorm = Math.min(scrollY / 2000, 1);
    const scrollTilt = scrollNorm * 0.12;
    groupRef.current.rotation.x = swayX + scrollTilt;

    // Click response — intentional forward nod
    if (clickActive.current) {
      clickPhase.current += delta * 4;
      const nodAmount = Math.sin(clickPhase.current * Math.PI) * 0.2;
      groupRef.current.rotation.x += nodAmount;

      // Slight scale pulse
      const scalePulse = 1 + Math.sin(clickPhase.current * Math.PI) * 0.06;
      groupRef.current.scale.setScalar(scalePulse);

      if (clickPhase.current >= 1) {
        clickActive.current = false;
        groupRef.current.scale.setScalar(1);
      }
    }
  });

  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: COLORS.body,
    roughness: 0.7,
    metalness: 0.3,
  }), []);

  const armorMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: COLORS.armor,
    roughness: 0.5,
    metalness: 0.4,
  }), []);

  const visorMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: COLORS.visor,
    roughness: 0.2,
    metalness: 0.6,
    emissive: COLORS.visorGlow,
    emissiveIntensity: 0.4,
  }), []);

  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: COLORS.accent,
    roughness: 0.4,
    metalness: 0.5,
    emissive: COLORS.accent,
    emissiveIntensity: 0.15,
  }), []);

  const trimMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: COLORS.trim,
    roughness: 0.6,
    metalness: 0.3,
  }), []);

  return (
    <group ref={groupRef}>
      {/* ── Head / Helmet ── */}
      <group position={[0, 0.65, 0]}>
        {/* Main helmet shell */}
        <mesh material={armorMat}>
          <sphereGeometry args={[0.38, 24, 20]} />
        </mesh>

        {/* Helmet crest / ridge */}
        <mesh position={[0, 0.18, 0]} material={accentMat}>
          <boxGeometry args={[0.06, 0.22, 0.5]} />
        </mesh>

        {/* Visor — the defining feature */}
        <mesh position={[0, -0.02, 0.3]} material={visorMat}>
          <boxGeometry args={[0.52, 0.14, 0.1]} />
        </mesh>

        {/* Visor glow strip (thinner, brighter) */}
        <mesh position={[0, -0.02, 0.36]}>
          <boxGeometry args={[0.48, 0.06, 0.02]} />
          <meshStandardMaterial
            color={COLORS.visorGlow}
            emissive={COLORS.visorGlow}
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Side panels */}
        <mesh position={[-0.32, -0.05, 0.1]} rotation={[0, 0.4, 0]} material={trimMat}>
          <boxGeometry args={[0.12, 0.2, 0.18]} />
        </mesh>
        <mesh position={[0.32, -0.05, 0.1]} rotation={[0, -0.4, 0]} material={trimMat}>
          <boxGeometry args={[0.12, 0.2, 0.18]} />
        </mesh>

        {/* Chin guard */}
        <mesh position={[0, -0.25, 0.18]} material={bodyMat}>
          <boxGeometry args={[0.3, 0.12, 0.16]} />
        </mesh>
      </group>

      {/* ── Torso ── */}
      <group position={[0, 0, 0]}>
        {/* Core body */}
        <mesh material={bodyMat}>
          <cylinderGeometry args={[0.3, 0.35, 0.7, 8]} />
        </mesh>

        {/* Chest plate */}
        <mesh position={[0, 0.08, 0.22]} material={armorMat}>
          <boxGeometry args={[0.44, 0.4, 0.1]} />
        </mesh>

        {/* Center accent line */}
        <mesh position={[0, 0.08, 0.28]} material={accentMat}>
          <boxGeometry args={[0.04, 0.34, 0.02]} />
        </mesh>

        {/* Lower body / waist */}
        <mesh position={[0, -0.4, 0]} material={bodyMat}>
          <cylinderGeometry args={[0.28, 0.2, 0.2, 8]} />
        </mesh>
      </group>

      {/* ── Shoulders ── */}
      {/* Left shoulder pad */}
      <group position={[-0.42, 0.28, 0]}>
        <mesh material={armorMat}>
          <sphereGeometry args={[0.16, 12, 10]} />
        </mesh>
        <mesh position={[0, 0.06, 0]} material={accentMat}>
          <boxGeometry args={[0.2, 0.04, 0.2]} />
        </mesh>
      </group>
      {/* Right shoulder pad */}
      <group position={[0.42, 0.28, 0]}>
        <mesh material={armorMat}>
          <sphereGeometry args={[0.16, 12, 10]} />
        </mesh>
        <mesh position={[0, 0.06, 0]} material={accentMat}>
          <boxGeometry args={[0.2, 0.04, 0.2]} />
        </mesh>
      </group>

      {/* ── Arms ── */}
      <mesh position={[-0.44, -0.05, 0]} rotation={[0, 0, 0.1]} material={trimMat}>
        <cylinderGeometry args={[0.08, 0.07, 0.4, 8]} />
      </mesh>
      <mesh position={[0.44, -0.05, 0]} rotation={[0, 0, -0.1]} material={trimMat}>
        <cylinderGeometry args={[0.08, 0.07, 0.4, 8]} />
      </mesh>

      {/* ── Ambient glow at base (presence indicator) ── */}
      <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 24]} />
        <meshStandardMaterial
          color={COLORS.visor}
          emissive={COLORS.visorGlow}
          emissiveIntensity={0.3}
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}

/* ─── Public component ─── */
interface Mascot3DProps {
  onClick?: () => void;
  className?: string;
}

export default function Mascot3D({ onClick, className }: Mascot3DProps) {
  const [clicked, setClicked] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = useCallback(() => {
    setClicked(true);
    setTimeout(() => setClicked(false), 350);
    onClick?.();
  }, [onClick]);

  return (
    <div
      className={className}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
      role="button"
      aria-label="Open training assistant"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      <Canvas
        camera={{ position: [0, 0.3, 3.2], fov: 30 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 3, 4]} intensity={0.6} />
        <directionalLight position={[-2, 1, -1]} intensity={0.2} color="#4dd0e1" />
        <pointLight position={[0, -0.5, 1]} intensity={0.3} color="#2bb8cc" distance={4} />
        <WarriorCharacter clicked={clicked} scrollY={scrollY} />
      </Canvas>
    </div>
  );
}
