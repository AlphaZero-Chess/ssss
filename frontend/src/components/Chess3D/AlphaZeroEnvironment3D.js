import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Elder Futhark Runes - Sacred symbols of AlphaZero mastery
const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];

// ==================== OVERWHELMING SOPHISTICATED COSMIC PARTICLE FIELD ====================
export const CosmicParticleField = ({ count = 5500 }) => {
  const particlesRef = useRef();
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Spread in massive sphere with depth variation and clustering
      const radius = 45 + Math.random() * 250;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // AlphaZero color palette: deep purple, hot pink, gold, ethereal white, cyan
      const colorChoice = Math.random();
      if (colorChoice < 0.28) {
        // Deep purple
        colors[i * 3] = 0.5 + Math.random() * 0.3;
        colors[i * 3 + 1] = 0;
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      } else if (colorChoice < 0.48) {
        // Hot pink/magenta
        colors[i * 3] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0;
        colors[i * 3 + 2] = 0.5 + Math.random() * 0.4;
      } else if (colorChoice < 0.68) {
        // Gold/amber
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.65 + Math.random() * 0.35;
        colors[i * 3 + 2] = 0;
      } else if (colorChoice < 0.85) {
        // Ethereal white/cyan
        colors[i * 3] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.85 + Math.random() * 0.15;
        colors[i * 3 + 2] = 1;
      } else {
        // Cyan accent
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 2] = 1;
      }
      
      sizes[i] = 0.12 + Math.random() * 1;
    }
    
    return { positions, colors, sizes };
  }, [count]);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0001;
      particlesRef.current.rotation.x += 0.00005;
      particlesRef.current.rotation.z += 0.00002;
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
        size={0.7}
        vertexColors
        transparent
        opacity={0.92}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ==================== ULTRA SOPHISTICATED NEURAL NETWORK ====================
export const NeuralNetworkViz = () => {
  const nodesRef = useRef();
  const connectionsRef = useRef();
  
  const networkData = useMemo(() => {
    const nodes = [];
    const connections = [];
    
    // Create neural network layers (like AlphaZero's deep architecture)
    const layers = [8, 12, 18, 24, 18, 12, 8];
    let nodeIndex = 0;
    
    layers.forEach((nodeCount, layerIdx) => {
      const layerX = (layerIdx - 3) * 12;
      for (let i = 0; i < nodeCount; i++) {
        const y = (i - nodeCount / 2) * 3.5;
        const z = -35 + (Math.random() - 0.5) * 10;
        nodes.push({
          id: nodeIndex++,
          position: [layerX, y, z],
          layer: layerIdx,
          activation: Math.random(),
          phase: Math.random() * Math.PI * 2,
          size: 0.3 + Math.random() * 0.25
        });
      }
    });
    
    // Create connections between layers
    let offset = 0;
    for (let l = 0; l < layers.length - 1; l++) {
      const currentStart = offset;
      const nextStart = offset + layers[l];
      
      for (let i = 0; i < layers[l]; i++) {
        const connectCount = Math.min(3 + Math.floor(Math.random() * 2), layers[l + 1]);
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
        const pulse = Math.sin(state.clock.elapsedTime * 2.8 + data.phase) * 0.5 + 0.5;
        node.material.emissiveIntensity = 0.5 + pulse * 0.7;
        node.scale.setScalar((data.size || 0.35) * (0.8 + pulse * 0.5));
      });
    }
    
    if (connectionsRef.current) {
      connectionsRef.current.children.forEach((conn, i) => {
        const data = networkData.connections[i];
        const pulse = Math.sin(state.clock.elapsedTime * 4 + data.phase) * 0.5 + 0.5;
        conn.material.opacity = 0.1 + pulse * 0.3;
      });
    }
  });
  
  return (
    <group>
      {/* Nodes */}
      <group ref={nodesRef}>
        {networkData.nodes.map((node) => (
          <mesh key={node.id} position={node.position}>
            <sphereGeometry args={[node.size || 0.35, 20, 20]} />
            <meshStandardMaterial
              color={node.layer % 2 === 0 ? "#bf00ff" : "#ff00bf"}
              emissive={node.layer % 2 === 0 ? "#bf00ff" : "#ff00bf"}
              emissiveIntensity={0.6}
              transparent
              opacity={0.88}
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
                color={i % 3 === 0 ? "#ff00bf" : i % 3 === 1 ? "#bf00ff" : "#ffcc00"}
                transparent
                opacity={0.18}
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

// ==================== ELECTRIFYING LIGHTNING BOLTS ====================
export const LightningBolts = () => {
  const boltsRef = useRef();
  
  const bolts = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const startX = (Math.random() - 0.5) * 60;
      const startZ = (Math.random() - 0.5) * 60 - 35;
      const startY = 35 + Math.random() * 25;
      const points = [];
      let x = startX;
      let y = startY;
      let z = startZ;
      
      for (let j = 0; j < 16; j++) {
        points.push(new THREE.Vector3(x, y, z));
        x += (Math.random() - 0.5) * 6;
        y -= 4;
        z += (Math.random() - 0.5) * 4;
      }
      
      return {
        points,
        phase: Math.random() * Math.PI * 2,
        duration: 0.08 + Math.random() * 0.12,
        color: i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#bf00ff' : '#00ffff'
      };
    });
  }, []);
  
  useFrame((state) => {
    if (boltsRef.current) {
      boltsRef.current.children.forEach((bolt, i) => {
        const data = bolts[i];
        const flashCycle = (state.clock.elapsedTime * 2.5 + data.phase) % 5;
        bolt.visible = flashCycle < data.duration;
        if (bolt.material) {
          bolt.material.opacity = flashCycle < data.duration ? 0.95 : 0;
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
            <tubeGeometry args={[curve, 28, 0.15, 8, false]} />
            <meshStandardMaterial
              color={bolt.color}
              emissive={bolt.color}
              emissiveIntensity={4}
              transparent
              opacity={0.95}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// ==================== ETHEREAL RINGS - COMPLEX ====================
export const EtherealRings = () => {
  const ringsRef = useRef();
  
  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.z = state.clock.elapsedTime * (i % 2 === 0 ? 0.12 : -0.1);
        ring.rotation.x = Math.sin(state.clock.elapsedTime * 0.25 + i) * 0.12;
      });
    }
  });
  
  const rings = [
    { radius: 14, color: '#bf00ff', opacity: 0.45, thickness: 0.1 },
    { radius: 18, color: '#ff00bf', opacity: 0.35, thickness: 0.08 },
    { radius: 22, color: '#ffcc00', opacity: 0.28, thickness: 0.06 },
    { radius: 26, color: '#bf00ff', opacity: 0.2, thickness: 0.05 },
    { radius: 30, color: '#ff00bf', opacity: 0.15, thickness: 0.04 }
  ];
  
  return (
    <group ref={ringsRef} rotation={[Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      {rings.map((ring, i) => (
        <mesh key={i}>
          <torusGeometry args={[ring.radius, ring.thickness, 8, 80]} />
          <meshStandardMaterial
            color={ring.color}
            emissive={ring.color}
            emissiveIntensity={0.7}
            transparent
            opacity={ring.opacity}
          />
        </mesh>
      ))}
    </group>
  );
};

// ==================== CENTRAL ENERGY CORE - SOPHISTICATED ====================
export const EnergyCore = () => {
  const coreRef = useRef();
  const ringsRef = useRef();
  const innerCoreRef = useRef();
  
  useFrame((state) => {
    if (coreRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2.8) * 0.28 + 1;
      coreRef.current.scale.setScalar(pulse);
      coreRef.current.material.emissiveIntensity = 0.7 + Math.sin(state.clock.elapsedTime * 4) * 0.35;
    }
    
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.x = state.clock.elapsedTime * 1.5;
      innerCoreRef.current.rotation.y = state.clock.elapsedTime * 2;
    }
    
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.x = state.clock.elapsedTime * (0.28 + i * 0.15);
        ring.rotation.y = state.clock.elapsedTime * (0.4 - i * 0.12);
      });
    }
  });
  
  return (
    <group position={[0, 0, -40]}>
      {/* Central orb */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[3, 40, 40]} />
        <meshStandardMaterial
          color="#bf00ff"
          emissive="#ff00bf"
          emissiveIntensity={0.9}
          transparent
          opacity={0.92}
        />
      </mesh>
      
      {/* Inner rotating core */}
      <group ref={innerCoreRef}>
        <mesh>
          <octahedronGeometry args={[1.8, 0]} />
          <meshStandardMaterial
            color="#ffcc00"
            emissive="#ffcc00"
            emissiveIntensity={2}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
      </group>
      
      {/* Orbiting rings */}
      <group ref={ringsRef}>
        {[4.5, 6, 7.5, 9].map((radius, i) => (
          <mesh key={i}>
            <torusGeometry args={[radius, 0.07, 8, 56]} />
            <meshStandardMaterial
              color={i === 0 ? '#bf00ff' : i === 1 ? '#ff00bf' : i === 2 ? '#ffcc00' : '#00ffff'}
              emissive={i === 0 ? '#bf00ff' : i === 1 ? '#ff00bf' : i === 2 ? '#ffcc00' : '#00ffff'}
              emissiveIntensity={1}
              transparent
              opacity={0.75 - i * 0.1}
            />
          </mesh>
        ))}
      </group>
      
      {/* Light sources */}
      <pointLight color="#bf00ff" intensity={8} distance={50} />
      <pointLight color="#ff00bf" intensity={4} distance={35} />
      <pointLight color="#ffcc00" intensity={2} distance={25} />
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
