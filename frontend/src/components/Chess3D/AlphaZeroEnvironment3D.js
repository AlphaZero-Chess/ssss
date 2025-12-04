import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Rune symbols for environment decorations
const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];

// ==================== Deep Space Cosmic Particles ====================
export const CosmicParticleField = ({ count = 3000 }) => {
  const particlesRef = useRef();
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Spread in massive sphere
      const radius = 60 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // AlphaZero color palette: purple, pink, gold, white
      const colorChoice = Math.random();
      if (colorChoice < 0.35) {
        // Deep purple
        colors[i * 3] = 0.6 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0;
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
      } else if (colorChoice < 0.6) {
        // Hot pink
        colors[i * 3] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 1] = 0;
        colors[i * 3 + 2] = 0.6 + Math.random() * 0.3;
      } else if (colorChoice < 0.8) {
        // Gold
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.75 + Math.random() * 0.25;
        colors[i * 3 + 2] = 0;
      } else {
        // Ethereal white
        colors[i * 3] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 2] = 1;
      }
      
      sizes[i] = 0.2 + Math.random() * 0.8;
    }
    
    return { positions, colors, sizes };
  }, [count]);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.00015;
      particlesRef.current.rotation.x += 0.00008;
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
        size={0.6}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ==================== Neural Network Visualization ====================
export const NeuralNetworkViz = () => {
  const nodesRef = useRef();
  const connectionsRef = useRef();
  
  const networkData = useMemo(() => {
    const nodes = [];
    const connections = [];
    
    // Create neural network layers (like AlphaZero's architecture)
    const layers = [6, 10, 14, 18, 14, 10, 6];
    let nodeIndex = 0;
    
    layers.forEach((nodeCount, layerIdx) => {
      const layerX = (layerIdx - 3) * 10;
      for (let i = 0; i < nodeCount; i++) {
        const y = (i - nodeCount / 2) * 3;
        const z = -30 + (Math.random() - 0.5) * 8;
        nodes.push({
          id: nodeIndex++,
          position: [layerX, y, z],
          layer: layerIdx,
          activation: Math.random(),
          phase: Math.random() * Math.PI * 2
        });
      }
    });
    
    // Create connections between layers
    let offset = 0;
    for (let l = 0; l < layers.length - 1; l++) {
      const currentStart = offset;
      const nextStart = offset + layers[l];
      
      for (let i = 0; i < layers[l]; i++) {
        const connectCount = Math.min(2 + Math.floor(Math.random() * 2), layers[l + 1]);
        for (let j = 0; j < connectCount; j++) {
          const targetIdx = Math.floor(Math.random() * layers[l + 1]);
          connections.push({
            from: currentStart + i,
            to: nextStart + targetIdx,
            strength: Math.random(),
            phase: Math.random() * Math.PI * 2
          });
        }
      }
      offset += layers[l];
    }
    
    return { nodes, connections };
  }, []);
  
  useFrame((state) => {
    if (nodesRef.current) {
      nodesRef.current.children.forEach((node, i) => {
        const data = networkData.nodes[i];
        const pulse = Math.sin(state.clock.elapsedTime * 2.5 + data.phase) * 0.5 + 0.5;
        node.material.emissiveIntensity = 0.4 + pulse * 0.6;
        node.scale.setScalar(0.7 + pulse * 0.4);
      });
    }
    
    if (connectionsRef.current) {
      connectionsRef.current.children.forEach((conn, i) => {
        const data = networkData.connections[i];
        const pulse = Math.sin(state.clock.elapsedTime * 3.5 + data.phase) * 0.5 + 0.5;
        conn.material.opacity = 0.08 + pulse * 0.25;
      });
    }
  });
  
  return (
    <group>
      {/* Nodes */}
      <group ref={nodesRef}>
        {networkData.nodes.map((node) => (
          <mesh key={node.id} position={node.position}>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial
              color="#bf00ff"
              emissive="#bf00ff"
              emissiveIntensity={0.5}
              transparent
              opacity={0.85}
            />
          </mesh>
        ))}
      </group>
      
      {/* Connections */}
      <group ref={connectionsRef}>
        {networkData.connections.map((conn, i) => {
          const fromNode = networkData.nodes[conn.from];
          const toNode = networkData.nodes[conn.to];
          if (!fromNode || !toNode) return null;
          
          const points = [
            new THREE.Vector3(...fromNode.position),
            new THREE.Vector3(...toNode.position)
          ];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          
          return (
            <line key={i} geometry={geometry}>
              <lineBasicMaterial
                color="#ff00bf"
                transparent
                opacity={0.15}
              />
            </line>
          );
        })}
      </group>
    </group>
  );
};

// ==================== Nebula Clouds ====================
export const NebulaClouds = () => {
  const groupRef = useRef();
  
  const clouds = useMemo(() => {
    const cloudData = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 70 + Math.random() * 50;
      cloudData.push({
        position: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 60,
          Math.sin(angle) * radius
        ],
        scale: 20 + Math.random() * 30,
        color: i % 3 === 0 ? '#3a0060' : i % 3 === 1 ? '#600040' : '#302060',
        opacity: 0.12 + Math.random() * 0.1
      });
    }
    return cloudData;
  }, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.00025;
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

// ==================== Energy Orbs ====================
export const EnergyOrbs = ({ count = 20 }) => {
  const groupRef = useRef();
  const orbsRef = useRef([]);
  
  const orbs = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = 30 + Math.random() * 20;
      return {
        initialPosition: [
          Math.cos(angle) * radius,
          -8 + Math.random() * 16,
          Math.sin(angle) * radius
        ],
        speed: 0.4 + Math.random() * 0.6,
        amplitude: 3 + Math.random() * 4,
        phase: Math.random() * Math.PI * 2,
        color: i % 4 === 0 ? '#bf00ff' : i % 4 === 1 ? '#ff00bf' : i % 4 === 2 ? '#ffcc00' : '#ffffff',
        size: 0.4 + Math.random() * 0.6
      };
    });
  }, [count]);
  
  useFrame((state) => {
    orbsRef.current.forEach((orb, i) => {
      if (orb) {
        const data = orbs[i];
        orb.position.y = data.initialPosition[1] + Math.sin(state.clock.elapsedTime * data.speed + data.phase) * data.amplitude;
        orb.position.x = data.initialPosition[0] + Math.cos(state.clock.elapsedTime * 0.25 + data.phase) * 3;
        orb.position.z = data.initialPosition[2] + Math.sin(state.clock.elapsedTime * 0.25 + data.phase) * 3;
      }
    });
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0008;
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
          <pointLight color={orb.color} intensity={2.5} distance={10} />
        </mesh>
      ))}
    </group>
  );
};

// ==================== Lightning Bolts ====================
export const LightningBolts = () => {
  const boltsRef = useRef();
  
  const bolts = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const startX = (Math.random() - 0.5) * 50;
      const startZ = (Math.random() - 0.5) * 50 - 30;
      const startY = 30 + Math.random() * 20;
      const points = [];
      let x = startX;
      let y = startY;
      let z = startZ;
      
      for (let j = 0; j < 12; j++) {
        points.push(new THREE.Vector3(x, y, z));
        x += (Math.random() - 0.5) * 5;
        y -= 5;
        z += (Math.random() - 0.5) * 3;
      }
      
      return {
        points,
        phase: Math.random() * Math.PI * 2,
        duration: 0.1 + Math.random() * 0.1
      };
    });
  }, []);
  
  useFrame((state) => {
    if (boltsRef.current) {
      boltsRef.current.children.forEach((bolt, i) => {
        const data = bolts[i];
        const flashCycle = (state.clock.elapsedTime * 2 + data.phase) % 4;
        bolt.visible = flashCycle < data.duration;
        if (bolt.material) {
          bolt.material.opacity = flashCycle < data.duration ? 0.9 : 0;
        }
      });
    }
  });
  
  return (
    <group ref={boltsRef}>
      {bolts.map((bolt, i) => {
        const curve = new THREE.CatmullRomCurve3(bolt.points);
        return (
          <mesh key={i}>
            <tubeGeometry args={[curve, 24, 0.12, 8, false]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#bf00ff"
              emissiveIntensity={3}
              transparent
              opacity={0.9}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// ==================== Ethereal Rings ====================
export const EtherealRings = () => {
  const ringsRef = useRef();
  
  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.z = state.clock.elapsedTime * (i % 2 === 0 ? 0.15 : -0.12);
        ring.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.1;
      });
    }
  });
  
  const rings = [
    { radius: 16, color: '#bf00ff', opacity: 0.4 },
    { radius: 20, color: '#ff00bf', opacity: 0.3 },
    { radius: 25, color: '#ffcc00', opacity: 0.25 }
  ];
  
  return (
    <group ref={ringsRef} rotation={[Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      {rings.map((ring, i) => (
        <mesh key={i}>
          <torusGeometry args={[ring.radius, 0.12, 8, 64]} />
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

// ==================== Central Energy Core ====================
export const EnergyCore = () => {
  const coreRef = useRef();
  const ringsRef = useRef();
  
  useFrame((state) => {
    if (coreRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2.5) * 0.25 + 1;
      coreRef.current.scale.setScalar(pulse);
      coreRef.current.material.emissiveIntensity = 0.6 + Math.sin(state.clock.elapsedTime * 3.5) * 0.3;
    }
    
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.x = state.clock.elapsedTime * (0.25 + i * 0.12);
        ring.rotation.y = state.clock.elapsedTime * (0.35 - i * 0.1);
      });
    }
  });
  
  return (
    <group position={[0, 0, -35]}>
      {/* Central orb */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial
          color="#bf00ff"
          emissive="#ff00bf"
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Orbiting rings */}
      <group ref={ringsRef}>
        {[4, 5.5, 7].map((radius, i) => (
          <mesh key={i}>
            <torusGeometry args={[radius, 0.06, 8, 48]} />
            <meshStandardMaterial
              color={i === 0 ? '#bf00ff' : i === 1 ? '#ff00bf' : '#ffcc00'}
              emissive={i === 0 ? '#bf00ff' : i === 1 ? '#ff00bf' : '#ffcc00'}
              emissiveIntensity={0.9}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}
      </group>
      
      {/* Light source */}
      <pointLight color="#bf00ff" intensity={6} distance={40} />
      <pointLight color="#ff00bf" intensity={3} distance={25} />
    </group>
  );
};

// ==================== Main AlphaZero Environment ====================
const AlphaZeroEnvironment3D = () => {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.25} />
      
      {/* Main dramatic lighting */}
      <directionalLight
        position={[12, 25, 12]}
        intensity={1.3}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* AlphaZero accent lights */}
      <pointLight position={[-20, 12, -20]} intensity={1} color="#bf00ff" distance={60} />
      <pointLight position={[20, 8, 20]} intensity={0.8} color="#ff00bf" distance={50} />
      <pointLight position={[0, -8, 0]} intensity={0.5} color="#ffcc00" distance={35} />
      
      {/* Rim lights */}
      <pointLight position={[0, 20, 0]} intensity={0.6} color="#e0e0ff" distance={40} />
      
      {/* Cosmic background elements */}
      <CosmicParticleField count={3500} />
      <NebulaClouds />
      <NeuralNetworkViz />
      <EnergyOrbs count={24} />
      <LightningBolts />
      <EtherealRings />
      <EnergyCore />
      
      {/* Deep space background sphere */}
      <mesh>
        <sphereGeometry args={[300, 32, 32]} />
        <meshBasicMaterial
          color="#030308"
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
};

export default AlphaZeroEnvironment3D;
