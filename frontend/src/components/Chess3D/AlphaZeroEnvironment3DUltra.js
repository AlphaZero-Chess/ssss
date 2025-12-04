import React, { useRef, useMemo, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ==================== ULTRA LIGHTWEIGHT PARTICLES ====================
const CosmicParticles = memo(({ count = 200 }) => {
  const particlesRef = useRef();
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 40 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, [count]);
  
  // Very slow rotation
  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.00005;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.6} color="#bf00ff" transparent opacity={0.7} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
});

// ==================== STATIC NEBULA SPHERES ====================
const NebulaBackground = memo(() => {
  const clouds = useMemo(() => [
    { position: [-60, 20, -80], scale: 30, color: '#3a0060' },
    { position: [70, -10, -70], scale: 35, color: '#600040' },
    { position: [0, 30, -100], scale: 40, color: '#300050' }
  ], []);
  
  return (
    <group>
      {clouds.map((cloud, i) => (
        <mesh key={i} position={cloud.position}>
          <sphereGeometry args={[cloud.scale, 8, 8]} />
          <meshBasicMaterial color={cloud.color} transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
});

// ==================== STATIC ETHEREAL RINGS ====================
const EtherealRings = memo(() => {
  const rings = [
    { radius: 14, color: '#bf00ff', opacity: 0.35 },
    { radius: 20, color: '#ff00bf', opacity: 0.25 },
    { radius: 26, color: '#ffcc00', opacity: 0.15 }
  ];
  
  return (
    <group rotation={[Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      {rings.map((ring, i) => (
        <mesh key={i}>
          <torusGeometry args={[ring.radius, 0.04, 6, 36]} />
          <meshStandardMaterial color={ring.color} emissive={ring.color} emissiveIntensity={0.5} transparent opacity={ring.opacity} />
        </mesh>
      ))}
    </group>
  );
});

// ==================== ENERGY CORE ====================
const EnergyCore = memo(() => {
  const coreRef = useRef();
  
  useFrame((state) => {
    if (coreRef.current) {
      const scale = Math.sin(state.clock.elapsedTime) * 0.15 + 1;
      coreRef.current.scale.setScalar(scale);
    }
  });
  
  return (
    <group position={[0, 0, -30]} ref={coreRef}>
      <mesh>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial color="#bf00ff" emissive="#ff00bf" emissiveIntensity={0.7} transparent opacity={0.85} />
      </mesh>
      <mesh>
        <octahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={1.5} metalness={0.9} roughness={0.1} />
      </mesh>
      <pointLight color="#bf00ff" intensity={4} distance={30} />
    </group>
  );
});

// ==================== MAIN ENVIRONMENT ====================
const AlphaZeroEnvironment3DUltra = memo(() => {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.35} />
      
      {/* Main directional light */}
      <directionalLight position={[10, 20, 10]} intensity={1.1} color="#ffffff" />
      
      {/* Accent lights */}
      <pointLight position={[-12, 8, -12]} intensity={0.6} color="#bf00ff" distance={40} />
      <pointLight position={[12, 6, 12]} intensity={0.5} color="#ff00bf" distance={35} />
      <pointLight position={[0, 12, 0]} intensity={0.4} color="#e0e0ff" distance={30} />
      
      {/* Background elements */}
      <CosmicParticles count={150} />
      <NebulaBackground />
      <EtherealRings />
      <EnergyCore />
      
      {/* Deep space background */}
      <mesh>
        <sphereGeometry args={[150, 16, 16]} />
        <meshBasicMaterial color="#030308" side={THREE.BackSide} />
      </mesh>
    </>
  );
});

export default AlphaZeroEnvironment3DUltra;
