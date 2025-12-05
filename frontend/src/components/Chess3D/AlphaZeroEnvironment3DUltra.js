import React, { useRef, useMemo, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ==================== ULTRA LIGHTWEIGHT COSMIC PARTICLES ====================
const CosmicParticles = memo(({ count = 150 }) => {
  const particlesRef = useRef();
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 50 + Math.random() * 100;
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
      particlesRef.current.rotation.y += 0.00003;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.5} color="#bf00ff" transparent opacity={0.6} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
});

// ==================== STATIC NEBULA CLOUDS ====================
const NebulaBackground = memo(() => {
  const clouds = useMemo(() => [
    { position: [-70, 25, -90], scale: 35, color: '#2a0050' },
    { position: [80, -15, -80], scale: 40, color: '#500035' },
    { position: [0, 40, -110], scale: 45, color: '#250045' }
  ], []);
  
  return (
    <group>
      {clouds.map((cloud, i) => (
        <mesh key={i} position={cloud.position}>
          <sphereGeometry args={[cloud.scale, 8, 8]} />
          <meshBasicMaterial color={cloud.color} transparent opacity={0.12} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
});

// ==================== NEURAL ENERGY CORE ====================
const EnergyCore = memo(() => {
  const coreRef = useRef();
  const innerRef = useRef();
  
  useFrame((state) => {
    if (coreRef.current) {
      const scale = Math.sin(state.clock.elapsedTime * 0.8) * 0.12 + 1;
      coreRef.current.scale.setScalar(scale);
    }
    if (innerRef.current) {
      innerRef.current.rotation.y += 0.005;
      innerRef.current.rotation.x += 0.003;
    }
  });
  
  return (
    <group position={[0, 5, -40]} ref={coreRef}>
      {/* Outer energy sphere */}
      <mesh>
        <sphereGeometry args={[2.5, 20, 20]} />
        <meshStandardMaterial color="#bf00ff" emissive="#ff00bf" emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>
      {/* Inner crystalline core */}
      <group ref={innerRef}>
        <mesh>
          <octahedronGeometry args={[1.4, 0]} />
          <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={1.5} metalness={0.95} roughness={0.05} />
        </mesh>
        <mesh rotation={[0, Math.PI / 4, Math.PI / 4]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#ff00bf" emissive="#ff00bf" emissiveIntensity={2} />
        </mesh>
      </group>
      {/* Energy aura */}
      <mesh>
        <sphereGeometry args={[3.5, 16, 16]} />
        <meshStandardMaterial color="#bf00ff" emissive="#bf00ff" emissiveIntensity={0.3} transparent opacity={0.15} />
      </mesh>
      <pointLight color="#bf00ff" intensity={5} distance={40} />
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
      
      {/* Accent lights - AlphaZero purple/pink theme */}
      <pointLight position={[-12, 8, -12]} intensity={0.6} color="#bf00ff" distance={40} />
      <pointLight position={[12, 6, 12]} intensity={0.5} color="#ff00bf" distance={35} />
      <pointLight position={[0, 12, 0]} intensity={0.4} color="#e0e0ff" distance={30} />
      
      {/* Background elements - clean, neural */}
      <CosmicParticles count={120} />
      <NebulaBackground />
      <EnergyCore />
      
      {/* Deep space background */}
      <mesh>
        <sphereGeometry args={[160, 16, 16]} />
        <meshBasicMaterial color="#020208" side={THREE.BackSide} />
      </mesh>
    </>
  );
});

export default AlphaZeroEnvironment3DUltra;
