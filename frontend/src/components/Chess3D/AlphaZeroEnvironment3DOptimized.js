import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ==================== OPTIMIZED COSMIC PARTICLE FIELD ====================
// Reduced count for performance while maintaining visual impact
export const CosmicParticleField = ({ count = 800 }) => {
  const particlesRef = useRef();
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const radius = 50 + Math.random() * 150;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // AlphaZero color palette
      const colorChoice = Math.random();
      if (colorChoice < 0.35) {
        colors[i * 3] = 0.6; colors[i * 3 + 1] = 0; colors[i * 3 + 2] = 0.9;
      } else if (colorChoice < 0.6) {
        colors[i * 3] = 0.9; colors[i * 3 + 1] = 0; colors[i * 3 + 2] = 0.6;
      } else if (colorChoice < 0.8) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 0;
      } else {
        colors[i * 3] = 0.9; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 1;
      }
    }
    
    return { positions, colors };
  }, [count]);
  
  // Slower rotation for less CPU usage
  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.00008;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.8}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ==================== OPTIMIZED NEBULA CLOUDS ====================
export const NebulaClouds = () => {
  const groupRef = useRef();
  
  const clouds = useMemo(() => {
    const cloudData = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const radius = 80 + Math.random() * 40;
      cloudData.push({
        position: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 50,
          Math.sin(angle) * radius
        ],
        scale: 25 + Math.random() * 25,
        color: i % 2 === 0 ? '#3a0060' : '#600040',
        opacity: 0.15
      });
    }
    return cloudData;
  }, []);
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0002;
    }
  });
  
  return (
    <group ref={groupRef}>
      {clouds.map((cloud, i) => (
        <mesh key={i} position={cloud.position}>
          <sphereGeometry args={[cloud.scale, 12, 12]} />
          <meshBasicMaterial
            color={cloud.color}
            transparent
            opacity={cloud.opacity}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

// ==================== OPTIMIZED ENERGY ORBS ====================
export const EnergyOrbs = ({ count = 8 }) => {
  const groupRef = useRef();
  const orbsRef = useRef([]);
  
  const orbs = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = 25 + Math.random() * 15;
      return {
        initialPosition: [
          Math.cos(angle) * radius,
          -5 + Math.random() * 10,
          Math.sin(angle) * radius
        ],
        speed: 0.5 + Math.random() * 0.4,
        amplitude: 3 + Math.random() * 3,
        phase: Math.random() * Math.PI * 2,
        color: i % 3 === 0 ? '#bf00ff' : i % 3 === 1 ? '#ff00bf' : '#ffcc00',
        size: 0.5 + Math.random() * 0.4
      };
    });
  }, [count]);
  
  useFrame((state) => {
    orbsRef.current.forEach((orb, i) => {
      if (orb) {
        const data = orbs[i];
        orb.position.y = data.initialPosition[1] + Math.sin(state.clock.elapsedTime * data.speed + data.phase) * data.amplitude;
      }
    });
  });
  
  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <mesh
          key={i}
          ref={(el) => (orbsRef.current[i] = el)}
          position={orb.initialPosition}
        >
          <sphereGeometry args={[orb.size, 12, 12]} />
          <meshBasicMaterial color={orb.color} transparent opacity={0.85} />
          <pointLight color={orb.color} intensity={1.5} distance={8} />
        </mesh>
      ))}
    </group>
  );
};

// ==================== OPTIMIZED ETHEREAL RINGS ====================
export const EtherealRings = () => {
  const ringsRef = useRef();
  
  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.z = state.clock.elapsedTime * (i % 2 === 0 ? 0.08 : -0.06);
      });
    }
  });
  
  const rings = [
    { radius: 15, color: '#bf00ff', opacity: 0.4, thickness: 0.08 },
    { radius: 20, color: '#ff00bf', opacity: 0.3, thickness: 0.06 },
    { radius: 25, color: '#ffcc00', opacity: 0.2, thickness: 0.04 }
  ];
  
  return (
    <group ref={ringsRef} rotation={[Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      {rings.map((ring, i) => (
        <mesh key={i}>
          <torusGeometry args={[ring.radius, ring.thickness, 6, 48]} />
          <meshStandardMaterial
            color={ring.color}
            emissive={ring.color}
            emissiveIntensity={0.6}
            transparent
            opacity={ring.opacity}
          />
        </mesh>
      ))}
    </group>
  );
};

// ==================== OPTIMIZED ENERGY CORE ====================
export const EnergyCore = () => {
  const coreRef = useRef();
  const innerCoreRef = useRef();
  
  useFrame((state) => {
    if (coreRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 1;
      coreRef.current.scale.setScalar(pulse);
    }
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.x = state.clock.elapsedTime;
      innerCoreRef.current.rotation.y = state.clock.elapsedTime * 1.3;
    }
  });
  
  return (
    <group position={[0, 0, -35]}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[2.5, 24, 24]} />
        <meshStandardMaterial
          color="#bf00ff"
          emissive="#ff00bf"
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
      <group ref={innerCoreRef}>
        <mesh>
          <octahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial
            color="#ffcc00"
            emissive="#ffcc00"
            emissiveIntensity={1.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>
      <pointLight color="#bf00ff" intensity={6} distance={40} />
      <pointLight color="#ffcc00" intensity={2} distance={20} />
    </group>
  );
};

// ==================== Main AlphaZero Environment - OPTIMIZED ====================
const AlphaZeroEnvironment3DOptimized = () => {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      
      {/* Main lighting */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        color="#ffffff"
      />
      
      {/* AlphaZero accent lights */}
      <pointLight position={[-15, 10, -15]} intensity={0.8} color="#bf00ff" distance={50} />
      <pointLight position={[15, 8, 15]} intensity={0.6} color="#ff00bf" distance={40} />
      <pointLight position={[0, 15, 0]} intensity={0.5} color="#e0e0ff" distance={35} />
      
      {/* Optimized background elements */}
      <CosmicParticleField count={600} />
      <NebulaClouds />
      <EnergyOrbs count={6} />
      <EtherealRings />
      <EnergyCore />
      
      {/* Deep space background */}
      <mesh>
        <sphereGeometry args={[200, 24, 24]} />
        <meshBasicMaterial color="#030308" side={THREE.BackSide} />
      </mesh>
    </>
  );
};

export default AlphaZeroEnvironment3DOptimized;
