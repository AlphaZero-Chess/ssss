import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Cosmic particle field
export const CosmicParticles = ({ count = 2000 }) => {
  const mesh = useRef();
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Spread particles in a large sphere
      const radius = 50 + Math.random() * 150;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Purple/blue/white color palette
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        // Purple
        colors[i * 3] = 0.6 + Math.random() * 0.3;
        colors[i * 3 + 1] = 0.2 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
      } else if (colorChoice < 0.7) {
        // Blue
        colors[i * 3] = 0.3 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.5 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
      } else {
        // Ethereal white
        colors[i * 3] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 2] = 1.0;
      }
      
      sizes[i] = 0.3 + Math.random() * 0.8;
    }
    
    return { positions, colors, sizes };
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.0002;
      mesh.current.rotation.x += 0.0001;
    }
  });

  return (
    <points ref={mesh}>
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
        <bufferAttribute
          attach="attributes-size"
          count={particles.sizes.length}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Ethereal nebula clouds
export const NebulaClouds = () => {
  const groupRef = useRef();
  
  const clouds = useMemo(() => {
    const cloudData = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 60 + Math.random() * 40;
      cloudData.push({
        position: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 40,
          Math.sin(angle) * radius
        ],
        scale: 15 + Math.random() * 20,
        color: i % 2 === 0 ? '#6b3fa0' : '#2d5a8a',
        opacity: 0.15 + Math.random() * 0.1
      });
    }
    return cloudData;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0003;
    }
  });

  return (
    <group ref={groupRef}>
      {clouds.map((cloud, i) => (
        <mesh key={i} position={cloud.position}>
          <sphereGeometry args={[cloud.scale, 16, 16]} />
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

// Floating energy orbs
export const EnergyOrbs = ({ count = 12 }) => {
  const groupRef = useRef();
  const orbsRef = useRef([]);
  
  const orbs = useMemo(() => {
    const orbData = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 25 + Math.random() * 15;
      orbData.push({
        initialPosition: [
          Math.cos(angle) * radius,
          -5 + Math.random() * 10,
          Math.sin(angle) * radius
        ],
        speed: 0.5 + Math.random() * 0.5,
        amplitude: 2 + Math.random() * 3,
        phase: Math.random() * Math.PI * 2,
        color: i % 3 === 0 ? '#bf00ff' : i % 3 === 1 ? '#4080ff' : '#ffffff',
        size: 0.3 + Math.random() * 0.4
      });
    }
    return orbData;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    orbsRef.current.forEach((orb, i) => {
      if (orb) {
        const data = orbs[i];
        orb.position.y = data.initialPosition[1] + Math.sin(time * data.speed + data.phase) * data.amplitude;
        orb.position.x = data.initialPosition[0] + Math.cos(time * 0.3 + data.phase) * 2;
        orb.position.z = data.initialPosition[2] + Math.sin(time * 0.3 + data.phase) * 2;
      }
    });
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <mesh
          key={i}
          ref={(el) => (orbsRef.current[i] = el)}
          position={orb.initialPosition}
        >
          <sphereGeometry args={[orb.size, 16, 16]} />
          <meshBasicMaterial
            color={orb.color}
            transparent
            opacity={0.8}
          />
          {/* Glow effect */}
          <pointLight color={orb.color} intensity={2} distance={8} />
        </mesh>
      ))}
    </group>
  );
};

// Ethereal ring around the board
export const EtherealRing = ({ radius = 12, color = '#6b3fa0' }) => {
  const ringRef = useRef();
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.002;
    }
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <torusGeometry args={[radius, 0.1, 16, 100]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
};

// Main environment component
const Environment3D = () => {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      
      {/* Main directional light - dramatic from top */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* Purple accent light */}
      <pointLight position={[-15, 10, -15]} intensity={0.8} color="#bf00ff" distance={50} />
      
      {/* Blue accent light */}
      <pointLight position={[15, 5, 15]} intensity={0.6} color="#4080ff" distance={50} />
      
      {/* Ethereal white rim light */}
      <pointLight position={[0, -10, 0]} intensity={0.4} color="#e0e0ff" distance={30} />
      
      {/* Cosmic background elements */}
      <CosmicParticles count={2500} />
      <NebulaClouds />
      <EnergyOrbs count={15} />
      <EtherealRing radius={14} color="#6b3fa0" />
      <EtherealRing radius={16} color="#4080ff" />
      
      {/* Background gradient sphere */}
      <mesh>
        <sphereGeometry args={[200, 32, 32]} />
        <meshBasicMaterial
          color="#0a0a1a"
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
};

export default Environment3D;
