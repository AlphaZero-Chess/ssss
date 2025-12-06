import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AlphaZeroPiece3D } from './AlphaZeroPieces3D';

// Elder Futhark Runes - Sacred symbols
const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];

// Convert chess notation to 3D position
const squareTo3D = (square, boardSize = 8) => {
  const file = square.charCodeAt(0) - 97;
  const rank = parseInt(square[1]) - 1;
  const offset = (boardSize - 1) / 2;
  return [
    (file - offset) * 1.12,
    0.58,
    (offset - rank) * 1.12
  ];
};

// ==================== SOPHISTICATED NEURAL SQUARE ====================
const NeuralSquare = ({ position, isLight, isHighlighted, isValidMove, isLastMove, onClick }) => {
  const meshRef = useRef();
  const glowRef = useRef();
  const innerPatternRef = useRef();
  
  const color = useMemo(() => {
    if (isHighlighted) return '#bf00ff';
    if (isValidMove) return '#00ff88';
    if (isLastMove) return '#ffcc00';
    if (isLight) return '#3a3060';
    return '#160c28';
  }, [isLight, isHighlighted, isValidMove, isLastMove]);
  
  useFrame((state) => {
    if (meshRef.current && (isHighlighted || isValidMove || isLastMove)) {
      const pulse = Math.sin(state.clock.elapsedTime * 4.5) * 0.4 + 0.6;
      meshRef.current.material.emissiveIntensity = pulse * (isHighlighted ? 0.85 : 0.45);
    }
    if (innerPatternRef.current) {
      innerPatternRef.current.rotation.z = state.clock.elapsedTime * 0.15;
    }
  });
  
  const emissiveColor = isHighlighted ? '#bf00ff' : isValidMove ? '#00ff88' : isLastMove ? '#ffcc00' : '#180a32';
  
  return (
    <group position={position}>
      {/* Main square - crystalline */}
      <mesh ref={meshRef} receiveShadow onClick={onClick}>
        <boxGeometry args={[1.02, 0.18, 1.02]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.72}
          roughness={0.22}
          transmission={isLight ? 0.15 : 0.08}
          thickness={0.8}
          emissive={emissiveColor}
          emissiveIntensity={isHighlighted || isValidMove || isLastMove ? 0.6 : 0.1}
          clearcoat={0.7}
          clearcoatRoughness={0.2}
        />
      </mesh>
      
      {/* Inner neural grid pattern */}
      <group ref={innerPatternRef} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[0.18, 0.22, 4]} />
          <meshStandardMaterial
            color={isLight ? '#5845a8' : '#2a1850'}
            emissive={isLight ? '#4535a0' : '#200a45'}
            emissiveIntensity={0.35}
            transparent
            opacity={0.45}
          />
        </mesh>
        {/* Inner detail ring */}
        <mesh>
          <ringGeometry args={[0.08, 0.11, 6]} />
          <meshStandardMaterial
            color={isLight ? '#6050b0' : '#301860'}
            emissive={isLight ? '#5040a0' : '#250c50'}
            emissiveIntensity={0.25}
            transparent
            opacity={0.35}
          />
        </mesh>
      </group>
      
      {/* Valid move indicator - sophisticated */}
      {isValidMove && (
        <group position={[0, 0.25, 0]}>
          <mesh>
            <sphereGeometry args={[0.14, 24, 24]} />
            <meshStandardMaterial
              color="#00ff88"
              emissive="#00ff88"
              emissiveIntensity={1.5}
              transparent
              opacity={0.9}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.2, 18, 18]} />
            <meshStandardMaterial
              color="#00ff88"
              emissive="#00ff88"
              emissiveIntensity={0.5}
              transparent
              opacity={0.28}
            />
          </mesh>
          {/* Pulsing ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.015, 6, 20]} />
            <meshStandardMaterial
              color="#00ff88"
              emissive="#00ff88"
              emissiveIntensity={0.8}
              transparent
              opacity={0.6}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};

// ==================== BADASS CHAIN BORDER - SEAL OF THE HIDDEN MASTER ====================
const SealChainBorder = () => {
  const chainsRef = useRef();
  
  useFrame((state) => {
    if (chainsRef.current) {
      chainsRef.current.children.forEach((child, i) => {
        if (child.material) {
          const pulse = Math.sin(state.clock.elapsedTime * 4 + i * 0.25) * 0.4 + 0.6;
          child.material.emissiveIntensity = pulse;
        }
      });
    }
  });
  
  const createChainLinks = (start, end, count) => {
    const links = [];
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const x = start[0] + (end[0] - start[0]) * t;
      const z = start[1] + (end[1] - start[1]) * t;
      const wave = Math.sin(t * Math.PI * 4) * 0.08;
      links.push({
        position: [x + (start[0] === end[0] ? wave : 0), 0.05, z + (start[0] !== end[0] ? wave : 0)],
        rotation: start[0] === end[0] ? [0, Math.PI / 2, 0] : [0, 0, 0],
        index: i,
        isSpecial: i % 4 === 0
      });
    }
    return links;
  };
  
  const borders = [
    { start: [-5.2, -5.2], end: [5.2, -5.2] },
    { start: [5.2, -5.2], end: [5.2, 5.2] },
    { start: [5.2, 5.2], end: [-5.2, 5.2] },
    { start: [-5.2, 5.2], end: [-5.2, -5.2] }
  ];
  
  return (
    <group ref={chainsRef}>
      {borders.map((border, bi) => (
        createChainLinks(border.start, border.end, 24).map((link, li) => (
          <group key={`${bi}-${li}`} position={link.position} rotation={link.rotation}>
            {/* Primary chain link torus */}
            <mesh>
              <torusGeometry args={[0.1, 0.032, 10, 20]} />
              <meshStandardMaterial
                color="#2a1850"
                emissive={link.isSpecial ? '#ff00bf' : '#bf00ff'}
                emissiveIntensity={0.7}
                metalness={0.96}
                roughness={0.12}
              />
            </mesh>
            {/* Secondary inner ring */}
            <mesh>
              <torusGeometry args={[0.065, 0.015, 8, 16]} />
              <meshStandardMaterial
                color="#ffcc00"
                emissive="#ffcc00"
                emissiveIntensity={0.9}
                transparent
                opacity={0.75}
              />
            </mesh>
            {/* Inner glow node */}
            {link.isSpecial && (
              <mesh>
                <sphereGeometry args={[0.05, 14, 14]} />
                <meshStandardMaterial
                  color="#ff00bf"
                  emissive="#ff00bf"
                  emissiveIntensity={1.5}
                />
              </mesh>
            )}
          </group>
        ))
      ))}
    </group>
  );
};

// ==================== THE SEAL - ULTRA SOPHISTICATED RUNIC CIRCLES ====================
const RunicSealCircles = () => {
  const outerRef = useRef();
  const middleRef = useRef();
  const innerRef = useRef();
  const coreRef = useRef();
  const ultraInnerRef = useRef();
  
  useFrame((state) => {
    if (outerRef.current) outerRef.current.rotation.z = state.clock.elapsedTime * 0.07;
    if (middleRef.current) middleRef.current.rotation.z = -state.clock.elapsedTime * 0.11;
    if (innerRef.current) innerRef.current.rotation.z = state.clock.elapsedTime * 0.16;
    if (ultraInnerRef.current) ultraInnerRef.current.rotation.z = -state.clock.elapsedTime * 0.22;
    if (coreRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2.8) * 0.22 + 1;
      coreRef.current.scale.setScalar(pulse);
    }
  });
  
  return (
    <group position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer ring with 20 rune markers */}
      <group ref={outerRef}>
        <mesh>
          <torusGeometry args={[7, 0.08, 10, 96]} />
          <meshStandardMaterial
            color="#bf00ff"
            emissive="#bf00ff"
            emissiveIntensity={0.8}
            transparent
            opacity={0.85}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[7.2, 0.04, 8, 80]} />
          <meshStandardMaterial
            color="#ff00bf"
            emissive="#ff00bf"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
        {Array.from({ length: 20 }, (_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 7, Math.sin(angle) * 7, 0.08]}>
              <octahedronGeometry args={[0.12, 0]} />
              <meshStandardMaterial
                color={i % 3 === 0 ? '#ffcc00' : '#ff00bf'}
                emissive={i % 3 === 0 ? '#ffcc00' : '#ff00bf'}
                emissiveIntensity={1.8}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Middle ring with 16 markers */}
      <group ref={middleRef}>
        <mesh>
          <torusGeometry args={[6, 0.06, 10, 80]} />
          <meshStandardMaterial
            color="#ff00bf"
            emissive="#ff00bf"
            emissiveIntensity={0.7}
            transparent
            opacity={0.78}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[5.8, 0.035, 8, 72]} />
          <meshStandardMaterial
            color="#bf00ff"
            emissive="#bf00ff"
            emissiveIntensity={0.45}
            transparent
            opacity={0.55}
          />
        </mesh>
        {Array.from({ length: 16 }, (_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 6, Math.sin(angle) * 6, 0.06]}>
              <dodecahedronGeometry args={[0.1, 0]} />
              <meshStandardMaterial
                color={i % 4 === 0 ? '#ffcc00' : '#bf00ff'}
                emissive={i % 4 === 0 ? '#ffcc00' : '#bf00ff'}
                emissiveIntensity={2}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Inner ring with 12 markers */}
      <group ref={innerRef}>
        <mesh>
          <torusGeometry args={[5, 0.045, 10, 64]} />
          <meshStandardMaterial
            color="#ffcc00"
            emissive="#ffcc00"
            emissiveIntensity={0.6}
            transparent
            opacity={0.7}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[4.8, 0.025, 8, 56]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.4}
            transparent
            opacity={0.5}
          />
        </mesh>
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 5, Math.sin(angle) * 5, 0.05]}>
              <tetrahedronGeometry args={[0.12, 0]} />
              <meshStandardMaterial
                color="#bf00ff"
                emissive="#bf00ff"
                emissiveIntensity={1.5}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Ultra inner ring with 8 markers */}
      <group ref={ultraInnerRef}>
        <mesh>
          <torusGeometry args={[4, 0.035, 8, 52]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 4, Math.sin(angle) * 4, 0.04]}>
              <icosahedronGeometry args={[0.08, 0]} />
              <meshStandardMaterial
                color="#ffcc00"
                emissive="#ffcc00"
                emissiveIntensity={1.8}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Core hexagonal seal */}
      <group ref={coreRef}>
        <mesh>
          <ringGeometry args={[0.7, 0.95, 6]} />
          <meshStandardMaterial
            color="#ffcc00"
            emissive="#ffcc00"
            emissiveIntensity={1.2}
            transparent
            opacity={0.75}
          />
        </mesh>
        <mesh>
          <ringGeometry args={[0.35, 0.6, 6]} />
          <meshStandardMaterial
            color="#bf00ff"
            emissive="#bf00ff"
            emissiveIntensity={0.9}
            transparent
            opacity={0.65}
          />
        </mesh>
        <mesh>
          <circleGeometry args={[0.3, 6]} />
          <meshStandardMaterial
            color="#ff00bf"
            emissive="#ff00bf"
            emissiveIntensity={1.5}
            transparent
            opacity={0.55}
          />
        </mesh>
      </group>
    </group>
  );
};

// ==================== ENERGY CHAINS FROM ABOVE - BADASS ====================
const EnergyChains = () => {
  const chainsRef = useRef();
  
  const chainData = useMemo(() => {
    const chains = [];
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const radius = 6.2;
      chains.push({
        start: [Math.cos(angle) * radius, 10, Math.sin(angle) * radius],
        end: [Math.cos(angle) * 2, 0.25, Math.sin(angle) * 2],
        phase: i * 0.4,
        color: i % 4 === 0 ? '#bf00ff' : i % 4 === 1 ? '#ff00bf' : i % 4 === 2 ? '#ffcc00' : '#00ffff'
      });
    }
    return chains;
  }, []);
  
  useFrame((state) => {
    if (chainsRef.current) {
      chainsRef.current.children.forEach((chain, i) => {
        if (chain.material) {
          const pulse = Math.sin(state.clock.elapsedTime * 5 + chainData[i].phase) * 0.4 + 0.6;
          chain.material.opacity = pulse;
          chain.material.emissiveIntensity = pulse * 2;
        }
      });
    }
  });
  
  return (
    <group ref={chainsRef}>
      {chainData.map((chain, i) => {
        const points = [];
        const segments = 36;
        for (let j = 0; j <= segments; j++) {
          const t = j / segments;
          const x = chain.start[0] + (chain.end[0] - chain.start[0]) * t;
          const y = chain.start[1] + (chain.end[1] - chain.start[1]) * t + Math.sin(t * Math.PI) * 2.5;
          const z = chain.start[2] + (chain.end[2] - chain.start[2]) * t;
          // Complex wave effect
          const wave1 = Math.sin(t * Math.PI * 6 + i * 0.4) * 0.15;
          const wave2 = Math.cos(t * Math.PI * 4 + i * 0.3) * 0.08;
          points.push(new THREE.Vector3(x + wave1, y, z + wave2));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        
        return (
          <mesh key={i}>
            <tubeGeometry args={[curve, 48, 0.025, 10, false]} />
            <meshStandardMaterial
              color={chain.color}
              emissive={chain.color}
              emissiveIntensity={1.5}
              transparent
              opacity={0.8}
              metalness={0.92}
              roughness={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// ==================== NEURAL PARTICLE FIELD ====================
const NeuralParticles = ({ count = 500 }) => {
  const particlesRef = useRef();
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = Math.random() * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 22;
      
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        colors[i * 3] = 0.75;
        colors[i * 3 + 1] = 0;
        colors[i * 3 + 2] = 1;
      } else if (colorChoice < 0.7) {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0;
        colors[i * 3 + 2] = 0.75;
      } else if (colorChoice < 0.9) {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 0;
      } else {
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      }
    }
    
    return { positions, colors };
  }, [count]);
  
  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += 0.014;
        
        if (positions[i * 3 + 1] > 16) {
          positions[i * 3 + 1] = 0;
        }
        
        const angle = state.clock.elapsedTime * 0.4 + i * 0.035;
        positions[i * 3] += Math.sin(angle) * 0.005;
        positions[i * 3 + 2] += Math.cos(angle) * 0.005;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
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
        size={0.07}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ==================== CORNER ANCHORS - SOPHISTICATED ====================
const CornerAnchors = () => {
  const anchorsRef = useRef();
  
  useFrame((state) => {
    if (anchorsRef.current) {
      anchorsRef.current.children.forEach((anchor, i) => {
        anchor.rotation.y = state.clock.elapsedTime * (i % 2 === 0 ? 0.6 : -0.6);
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2.5 + i * 0.8) * 0.12;
        anchor.scale.setScalar(scale);
      });
    }
  });
  
  const corners = [
    [-5, -5],
    [-5, 5],
    [5, -5],
    [5, 5]
  ];
  
  return (
    <group ref={anchorsRef}>
      {corners.map(([x, z], i) => (
        <group key={i} position={[x, 0.15, z]}>
          {/* Primary octahedron */}
          <mesh>
            <octahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial
              color="#bf00ff"
              emissive="#ff00bf"
              emissiveIntensity={1.4}
              metalness={0.96}
              roughness={0.08}
            />
          </mesh>
          {/* Secondary wireframe */}
          <mesh>
            <octahedronGeometry args={[0.42, 0]} />
            <meshStandardMaterial
              color="#bf00ff"
              emissive="#bf00ff"
              emissiveIntensity={0.5}
              transparent
              opacity={0.3}
              wireframe
            />
          </mesh>
          {/* Inner golden core */}
          <mesh>
            <icosahedronGeometry args={[0.15, 0]} />
            <meshStandardMaterial
              color="#ffcc00"
              emissive="#ffcc00"
              emissiveIntensity={2}
            />
          </mesh>
          {/* Glow */}
          <pointLight color="#bf00ff" intensity={2} distance={4} />
        </group>
      ))}
    </group>
  );
};

// ==================== MAIN ALPHAZERO 3D BOARD SCENE ====================
const AlphaZeroBoard3DScene = ({
  boardPosition = [0, 0, 0],
  pieces,
  selectedSquare,
  validMoves,
  lastMove,
  onSquareClick,
  onPieceClick,
  playerColor
}) => {
  const boardRef = useRef();
  
  useFrame((state) => {
    if (boardRef.current) {
      boardRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.07;
      boardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.012;
    }
  });
  
  // Generate squares
  const squares = useMemo(() => {
    const squareData = [];
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const isLight = (rank + file) % 2 === 1;
        const square = String.fromCharCode(97 + file) + (rank + 1);
        const offset = 3.5;
        squareData.push({
          key: square,
          position: [(file - offset) * 1.12, 0, (offset - rank) * 1.12],
          isLight,
          square
        });
      }
    }
    return squareData;
  }, []);
  
  // Parse pieces
  const pieceElements = useMemo(() => {
    if (!pieces) return [];
    
    const elements = [];
    Object.entries(pieces).forEach(([square, piece]) => {
      if (piece) {
        const pos = squareTo3D(square);
        elements.push({
          key: square,
          type: piece.type,
          color: piece.color === 'w' ? 'white' : 'black',
          position: pos,
          square
        });
      }
    });
    
    return elements;
  }, [pieces]);
  
  return (
    <group rotation={playerColor === 'black' ? [0, Math.PI, 0] : [0, 0, 0]}>
      {/* THE SEAL - Ultra sophisticated runic circles beneath */}
      <RunicSealCircles />
      
      {/* Energy chains from above - BADASS */}
      <EnergyChains />
      
      {/* Neural particles */}
      <NeuralParticles count={450} />
      
      {/* Corner anchors */}
      <CornerAnchors />
      
      {/* Main board group */}
      <group ref={boardRef} position={boardPosition}>
        {/* Board base - deep crystalline */}
        <mesh position={[0, -0.2, 0]} receiveShadow>
          <boxGeometry args={[10.5, 0.35, 10.5]} />
          <meshPhysicalMaterial
            color="#060310"
            metalness={0.88}
            roughness={0.12}
            emissive="#180035"
            emissiveIntensity={0.28}
            transmission={0.18}
            thickness={2}
          />
        </mesh>
        
        {/* Glowing edge frame - primary */}
        <mesh position={[0, -0.06, 0]}>
          <boxGeometry args={[10.8, 0.12, 10.8]} />
          <meshStandardMaterial
            color="#bf00ff"
            emissive="#bf00ff"
            emissiveIntensity={0.8}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Inner edge glow */}
        <mesh position={[0, -0.03, 0]}>
          <boxGeometry args={[10.3, 0.08, 10.3]} />
          <meshStandardMaterial
            color="#ff00bf"
            emissive="#ff00bf"
            emissiveIntensity={0.55}
            transparent
            opacity={0.55}
          />
        </mesh>
        
        {/* Ultra inner glow */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[9.8, 0.05, 9.8]} />
          <meshStandardMaterial
            color="#ffcc00"
            emissive="#ffcc00"
            emissiveIntensity={0.35}
            transparent
            opacity={0.4}
          />
        </mesh>
        
        {/* Chain border */}
        <SealChainBorder />
        
        {/* Board squares */}
        {squares.map((sq) => {
          const isHighlighted = selectedSquare === sq.square;
          const isValidMoveSquare = validMoves?.includes(sq.square);
          const isLastMoveSquare = lastMove && (lastMove.from === sq.square || lastMove.to === sq.square);
          
          return (
            <NeuralSquare
              key={sq.key}
              position={sq.position}
              isLight={sq.isLight}
              isHighlighted={isHighlighted}
              isValidMove={isValidMoveSquare}
              isLastMove={isLastMoveSquare}
              onClick={(e) => {
                e.stopPropagation();
                onSquareClick?.(sq.square);
              }}
            />
          );
        })}
        
        {/* Chess pieces - ALPHAZERO STYLE */}
        {pieceElements.map((piece) => (
          <AlphaZeroPiece3D
            key={piece.key}
            type={piece.type}
            color={piece.color}
            position={piece.position}
            isSelected={selectedSquare === piece.square}
            isHovered={false}
            playerColor={playerColor}
            onClick={(e) => {
              e.stopPropagation();
              onPieceClick?.(piece.square);
            }}
          />
        ))}
        
        {/* Ethereal glow beneath board */}
        <pointLight position={[0, -2.5, 0]} intensity={4} color="#bf00ff" distance={18} />
        <pointLight position={[0, -2, 0]} intensity={2} color="#ff00bf" distance={12} />
        <pointLight position={[0, -1.5, 0]} intensity={1} color="#ffcc00" distance={8} />
      </group>
    </group>
  );
};

export { AlphaZeroBoard3DScene, squareTo3D };
export default AlphaZeroBoard3DScene;
