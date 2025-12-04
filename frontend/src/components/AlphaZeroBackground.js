import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Rune symbols
const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];

// Neural network nodes
function NeuralNetwork() {
  const nodesRef = useRef();
  const linesRef = useRef();
  
  const nodes = useMemo(() => {
    const nodeData = [];
    // Create layers of neural network
    const layers = [8, 12, 16, 12, 8];
    let nodeId = 0;
    
    layers.forEach((nodeCount, layerIndex) => {
      const layerX = (layerIndex - 2) * 8;
      for (let i = 0; i < nodeCount; i++) {
        const y = (i - nodeCount / 2) * 2;
        const z = (Math.random() - 0.5) * 4;
        nodeData.push({
          id: nodeId++,
          position: [layerX, y, z - 15],
          layer: layerIndex,
          activation: Math.random()
        });
      }
    });
    return nodeData;
  }, []);
  
  const connections = useMemo(() => {
    const conns = [];
    const layers = [8, 12, 16, 12, 8];
    let offset = 0;
    
    for (let l = 0; l < layers.length - 1; l++) {
      const currentLayerStart = offset;
      const nextLayerStart = offset + layers[l];
      
      // Connect some nodes randomly (not all for performance)
      for (let i = 0; i < layers[l]; i++) {
        const connectCount = Math.min(3, layers[l + 1]);
        for (let j = 0; j < connectCount; j++) {
          const targetIdx = Math.floor(Math.random() * layers[l + 1]);
          conns.push({
            from: currentLayerStart + i,
            to: nextLayerStart + targetIdx,
            strength: Math.random()
          });
        }
      }
      offset += layers[l];
    }
    return conns;
  }, []);
  
  useFrame((state) => {
    if (nodesRef.current) {
      nodesRef.current.children.forEach((node, i) => {
        const pulse = Math.sin(state.clock.elapsedTime * 2 + nodes[i].activation * Math.PI * 2) * 0.5 + 0.5;
        node.material.emissiveIntensity = 0.5 + pulse * 0.5;
        node.scale.setScalar(0.8 + pulse * 0.4);
      });
    }
    
    if (linesRef.current) {
      linesRef.current.children.forEach((line, i) => {
        const pulse = Math.sin(state.clock.elapsedTime * 3 + connections[i].strength * Math.PI * 2) * 0.5 + 0.5;
        line.material.opacity = 0.1 + pulse * 0.3;
      });
    }
  });
  
  return (
    <group>
      {/* Nodes */}
      <group ref={nodesRef}>
        {nodes.map((node) => (
          <mesh key={node.id} position={node.position}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color="#bf00ff"
              emissive="#bf00ff"
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>
      
      {/* Connections */}
      <group ref={linesRef}>
        {connections.map((conn, i) => {
          const from = nodes[conn.from].position;
          const to = nodes[conn.to].position;
          const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          
          return (
            <line key={i} geometry={geometry}>
              <lineBasicMaterial color="#ff00bf" transparent opacity={0.2} />
            </line>
          );
        })}
      </group>
    </group>
  );
}

// Floating energy orbs
function EnergyOrbs() {
  const orbsRef = useRef();
  const count = 30;
  
  const orbs = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20 - 10
      ],
      speed: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      size: 0.3 + Math.random() * 0.7
    }));
  }, []);
  
  useFrame((state) => {
    if (orbsRef.current) {
      orbsRef.current.children.forEach((orb, i) => {
        const data = orbs[i];
        orb.position.x = data.position[0] + Math.sin(state.clock.elapsedTime * data.speed + data.phase) * 3;
        orb.position.y = data.position[1] + Math.cos(state.clock.elapsedTime * data.speed * 0.7 + data.phase) * 2;
        orb.material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2 + data.phase) * 0.3;
      });
    }
  });
  
  return (
    <group ref={orbsRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position}>
          <sphereGeometry args={[orb.size, 16, 16]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? '#bf00ff' : i % 3 === 1 ? '#ff00bf' : '#ffcc00'}
            emissive={i % 3 === 0 ? '#bf00ff' : i % 3 === 1 ? '#ff00bf' : '#ffcc00'}
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

// Lightning bolts
function LightningBolts() {
  const boltsRef = useRef();
  
  const bolts = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const startX = (Math.random() - 0.5) * 30;
      const startY = 20;
      const points = [];
      let x = startX;
      let y = startY;
      
      for (let j = 0; j < 10; j++) {
        points.push(new THREE.Vector3(x, y, -15 + Math.random() * 5));
        x += (Math.random() - 0.5) * 4;
        y -= 4;
      }
      
      return {
        points,
        phase: Math.random() * Math.PI * 2
      };
    });
  }, []);
  
  useFrame((state) => {
    if (boltsRef.current) {
      boltsRef.current.children.forEach((bolt, i) => {
        const flash = Math.sin(state.clock.elapsedTime * 8 + bolts[i].phase);
        bolt.visible = flash > 0.7;
        if (bolt.material) {
          bolt.material.opacity = flash > 0.7 ? 0.8 : 0;
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
            <tubeGeometry args={[curve, 20, 0.1, 8, false]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#bf00ff"
              emissiveIntensity={2}
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Rotating rune circles
function RuneCircles() {
  const circlesRef = useRef();
  
  useFrame((state) => {
    if (circlesRef.current) {
      circlesRef.current.children.forEach((circle, i) => {
        circle.rotation.z = state.clock.elapsedTime * (i % 2 === 0 ? 0.1 : -0.1);
      });
    }
  });
  
  const circles = [
    { radius: 12, runeCount: 12, z: -20 },
    { radius: 18, runeCount: 18, z: -25 },
    { radius: 25, runeCount: 24, z: -30 }
  ];
  
  return (
    <group ref={circlesRef}>
      {circles.map((circle, ci) => (
        <group key={ci} position={[0, 0, circle.z]}>
          {/* Circle ring */}
          <mesh>
            <torusGeometry args={[circle.radius, 0.1, 8, 64]} />
            <meshStandardMaterial
              color="#bf00ff"
              emissive="#bf00ff"
              emissiveIntensity={0.5}
              transparent
              opacity={0.4}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Particle field
function ParticleField() {
  const particlesRef = useRef();
  const count = 500;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;
      
      // Color variation: purple, pink, gold
      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        colors[i * 3] = 0.75; // Purple
        colors[i * 3 + 1] = 0;
        colors[i * 3 + 2] = 1;
      } else if (colorChoice < 0.8) {
        colors[i * 3] = 1; // Pink
        colors[i * 3 + 1] = 0;
        colors[i * 3 + 2] = 0.75;
      } else {
        colors[i * 3] = 1; // Gold
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 0;
      }
    }
    
    return { positions, colors };
  }, []);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// Pulsing central energy core
function EnergyCore() {
  const coreRef = useRef();
  const ringsRef = useRef();
  
  useFrame((state) => {
    if (coreRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 1;
      coreRef.current.scale.setScalar(pulse);
      coreRef.current.material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
    }
    
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.x = state.clock.elapsedTime * (0.2 + i * 0.1);
        ring.rotation.y = state.clock.elapsedTime * (0.3 - i * 0.1);
      });
    }
  });
  
  return (
    <group position={[0, 0, -20]}>
      {/* Central orb */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[2, 32, 32]} />
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
        {[3, 4, 5].map((radius, i) => (
          <mesh key={i}>
            <torusGeometry args={[radius, 0.05, 8, 64]} />
            <meshStandardMaterial
              color={i === 0 ? '#bf00ff' : i === 1 ? '#ff00bf' : '#ffcc00'}
              emissive={i === 0 ? '#bf00ff' : i === 1 ? '#ff00bf' : '#ffcc00'}
              emissiveIntensity={0.8}
              transparent
              opacity={0.6}
            />
          </mesh>
        ))}
      </group>
      
      {/* Light source */}
      <pointLight color="#bf00ff" intensity={5} distance={30} />
    </group>
  );
}

// Main background scene
function BackgroundScene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 10, 10]} color="#bf00ff" intensity={2} />
      <pointLight position={[-10, -10, 5]} color="#ff00bf" intensity={1} />
      <pointLight position={[10, 5, 0]} color="#ffcc00" intensity={0.5} />
      
      <NeuralNetwork />
      <EnergyOrbs />
      <LightningBolts />
      <RuneCircles />
      <ParticleField />
      <EnergyCore />
      
      <fog attach="fog" args={['#0a0a15', 10, 60]} />
    </>
  );
}

// Exported background component
const AlphaZeroBackground = ({ enabled = true }) => {
  if (!enabled) return null;
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(135deg, #0a0510 0%, #150520 30%, #0a0a1a 70%, #050510 100%)'
      }}
      data-testid="alphazero-background"
    >
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        <BackgroundScene />
      </Canvas>
    </div>
  );
};

export default AlphaZeroBackground;
