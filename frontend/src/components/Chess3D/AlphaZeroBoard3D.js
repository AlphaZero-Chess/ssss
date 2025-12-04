import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AlphaZeroPiece3D } from './AlphaZeroPieces3D';

// Rune symbols
const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];

// Convert chess notation to 3D position
const squareTo3D = (square, boardSize = 8) => {
  const file = square.charCodeAt(0) - 97;
  const rank = parseInt(square[1]) - 1;
  const offset = (boardSize - 1) / 2;
  return [
    (file - offset) * 1.1,
    0.55,
    (offset - rank) * 1.1
  ];
};

// ==================== Neural Network Board Square ====================
const NeuralSquare = ({ position, isLight, isHighlighted, isValidMove, isLastMove, onClick }) => {
  const meshRef = useRef();
  const glowRef = useRef();
  
  const color = useMemo(() => {
    if (isHighlighted) return '#bf00ff';
    if (isValidMove) return '#00ff88';
    if (isLastMove) return '#ffcc00';
    if (isLight) return '#3a3050';
    return '#1a1028';
  }, [isLight, isHighlighted, isValidMove, isLastMove]);
  
  useFrame((state) => {
    if (meshRef.current && (isHighlighted || isValidMove || isLastMove)) {
      const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.3 + 0.7;
      meshRef.current.material.emissiveIntensity = pulse * (isHighlighted ? 0.6 : 0.3);
    }
    if (glowRef.current) {
      glowRef.current.intensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });
  
  const emissiveColor = isHighlighted ? '#bf00ff' : isValidMove ? '#00ff88' : isLastMove ? '#ffcc00' : color;
  
  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        receiveShadow
        onClick={onClick}
      >
        <boxGeometry args={[1, 0.15, 1]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.6}
          roughness={0.3}
          transmission={isLight ? 0.1 : 0.05}
          thickness={0.5}
          emissive={emissiveColor}
          emissiveIntensity={isHighlighted || isValidMove || isLastMove ? 0.4 : 0.05}
          clearcoat={0.5}
          clearcoatRoughness={0.3}
        />
      </mesh>
      
      {/* Valid move indicator orb */}
      {isValidMove && (
        <mesh position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={1}
            transparent
            opacity={0.7}
          />
        </mesh>
      )}
    </group>
  );
};

// ==================== Neural Chain Border ====================
const NeuralChainBorder = () => {
  const chainsRef = useRef();
  
  useFrame((state) => {
    if (chainsRef.current) {
      chainsRef.current.children.forEach((chain, i) => {
        if (chain.material) {
          const pulse = Math.sin(state.clock.elapsedTime * 3 + i * 0.5) * 0.4 + 0.6;
          chain.material.emissiveIntensity = pulse;
        }
      });
    }
  });
  
  const createChainSegments = (start, end, count) => {
    const segments = [];
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const x = start[0] + (end[0] - start[0]) * t;
      const z = start[1] + (end[1] - start[1]) * t;
      segments.push({ x, z, index: i });
    }
    return segments;
  };
  
  const borders = [
    { start: [-4.8, -4.8], end: [4.8, -4.8] }, // Bottom
    { start: [4.8, -4.8], end: [4.8, 4.8] },   // Right
    { start: [4.8, 4.8], end: [-4.8, 4.8] },   // Top
    { start: [-4.8, 4.8], end: [-4.8, -4.8] }  // Left
  ];
  
  return (
    <group ref={chainsRef}>
      {borders.map((border, bi) => (
        createChainSegments(border.start, border.end, 16).map((seg, si) => (
          <mesh
            key={`${bi}-${si}`}
            position={[seg.x, -0.05, seg.z]}
          >
            <boxGeometry args={[0.3, 0.12, 0.2]} />
            <meshStandardMaterial
              color="#2a1a4a"
              emissive="#bf00ff"
              emissiveIntensity={0.5}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        ))
      ))}
    </group>
  );
};

// ==================== Rune Circle Seal ====================
const RuneCircleSeal = ({ radius = 6 }) => {
  const outerRef = useRef();
  const innerRef = useRef();
  
  useFrame((state) => {
    if (outerRef.current) {
      outerRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
    if (innerRef.current) {
      innerRef.current.rotation.z = -state.clock.elapsedTime * 0.15;
    }
  });
  
  return (
    <group position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer rune ring */}
      <group ref={outerRef}>
        <mesh>
          <torusGeometry args={[radius, 0.06, 8, 64]} />
          <meshStandardMaterial
            color="#bf00ff"
            emissive="#bf00ff"
            emissiveIntensity={0.6}
            transparent
            opacity={0.7}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        
        {/* Outer ring rune markers */}
        {RUNES.slice(0, 12).map((rune, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0.05
              ]}
            >
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial
                color="#ff00bf"
                emissive="#ff00bf"
                emissiveIntensity={1}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Inner rune ring */}
      <group ref={innerRef}>
        <mesh>
          <torusGeometry args={[radius * 0.7, 0.04, 8, 48]} />
          <meshStandardMaterial
            color="#ff00bf"
            emissive="#ff00bf"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        
        {/* Inner ring markers */}
        {RUNES.slice(12, 18).map((rune, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius * 0.7,
                Math.sin(angle) * radius * 0.7,
                0.05
              ]}
            >
              <octahedronGeometry args={[0.06, 0]} />
              <meshStandardMaterial
                color="#ffcc00"
                emissive="#ffcc00"
                emissiveIntensity={1.2}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Center neural pattern */}
      <mesh>
        <ringGeometry args={[0.5, 0.6, 6]} />
        <meshStandardMaterial
          color="#ffcc00"
          emissive="#ffcc00"
          emissiveIntensity={0.8}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
};

// ==================== Energy Chains Connecting Board ====================
const EnergyChains = () => {
  const chainsRef = useRef();
  
  const chainData = useMemo(() => {
    const chains = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 5.5;
      chains.push({
        start: [Math.cos(angle) * radius, 6, Math.sin(angle) * radius],
        end: [Math.cos(angle) * 1.5, 0.3, Math.sin(angle) * 1.5],
        phase: i * 0.8
      });
    }
    return chains;
  }, []);
  
  useFrame((state) => {
    if (chainsRef.current) {
      chainsRef.current.children.forEach((chain, i) => {
        if (chain.material) {
          const pulse = Math.sin(state.clock.elapsedTime * 4 + chainData[i].phase) * 0.4 + 0.6;
          chain.material.opacity = pulse;
          chain.material.emissiveIntensity = pulse * 1.5;
        }
      });
    }
  });
  
  return (
    <group ref={chainsRef}>
      {chainData.map((chain, i) => {
        const points = [];
        const segments = 25;
        for (let j = 0; j <= segments; j++) {
          const t = j / segments;
          const x = chain.start[0] + (chain.end[0] - chain.start[0]) * t;
          const y = chain.start[1] + (chain.end[1] - chain.start[1]) * t + Math.sin(t * Math.PI) * 1.5;
          const z = chain.start[2] + (chain.end[2] - chain.start[2]) * t;
          // Add wave effect
          const wave = Math.sin(t * Math.PI * 4 + i) * 0.15;
          points.push(new THREE.Vector3(x + wave, y, z + wave));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        
        return (
          <mesh key={i}>
            <tubeGeometry args={[curve, 32, 0.025, 8, false]} />
            <meshStandardMaterial
              color="#bf00ff"
              emissive="#ff00bf"
              emissiveIntensity={1}
              transparent
              opacity={0.7}
              metalness={0.9}
              roughness={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// ==================== Neural Particle Field ====================
const NeuralParticles = ({ count = 300 }) => {
  const particlesRef = useRef();
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = Math.random() * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
      
      // Color variation: purple, pink, gold
      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        colors[i * 3] = 0.75;
        colors[i * 3 + 1] = 0;
        colors[i * 3 + 2] = 1;
      } else if (colorChoice < 0.8) {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0;
        colors[i * 3 + 2] = 0.75;
      } else {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 0;
      }
    }
    
    return { positions, colors };
  }, [count]);
  
  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += 0.015;
        
        if (positions[i * 3 + 1] > 12) {
          positions[i * 3 + 1] = 0;
        }
        
        // Subtle spiral motion
        const angle = state.clock.elapsedTime * 0.3 + i * 0.05;
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
        size={0.08}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
};

// ==================== Main AlphaZero 3D Board Scene ====================
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
  
  // Gentle floating animation for the entire board
  useFrame((state) => {
    if (boardRef.current) {
      boardRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
      boardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.015;
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
          position: [(file - offset) * 1.1, 0, (offset - rank) * 1.1],
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
      {/* Rune circle seal beneath board */}
      <RuneCircleSeal radius={6} />
      
      {/* Energy chains from above */}
      <EnergyChains />
      
      {/* Neural particles */}
      <NeuralParticles count={250} />
      
      {/* Main board group */}
      <group ref={boardRef} position={boardPosition}>
        {/* Board base - dark crystalline */}
        <mesh position={[0, -0.15, 0]} receiveShadow>
          <boxGeometry args={[9.5, 0.25, 9.5]} />
          <meshPhysicalMaterial
            color="#0a0818"
            metalness={0.8}
            roughness={0.2}
            emissive="#1a0030"
            emissiveIntensity={0.2}
            transmission={0.1}
            thickness={1}
          />
        </mesh>
        
        {/* Glowing edge */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[9.8, 0.08, 9.8]} />
          <meshStandardMaterial
            color="#bf00ff"
            emissive="#bf00ff"
            emissiveIntensity={0.6}
            transparent
            opacity={0.7}
          />
        </mesh>
        
        {/* Neural chain border */}
        <NeuralChainBorder />
        
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
        
        {/* Chess pieces - AlphaZero style */}
        {pieceElements.map((piece) => (
          <AlphaZeroPiece3D
            key={piece.key}
            type={piece.type}
            color={piece.color}
            position={piece.position}
            isSelected={selectedSquare === piece.square}
            isHovered={false}
            onClick={(e) => {
              e.stopPropagation();
              onPieceClick?.(piece.square);
            }}
          />
        ))}
        
        {/* Ethereal glow under board */}
        <pointLight position={[0, -1.5, 0]} intensity={2} color="#bf00ff" distance={12} />
      </group>
    </group>
  );
};

export { AlphaZeroBoard3DScene, squareTo3D };
export default AlphaZeroBoard3DScene;
