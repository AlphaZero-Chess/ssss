import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AlphaZeroPiece3D } from './AlphaZeroPieces3D';

// Elder Futhark Runes
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

// ==================== NEURAL NETWORK SQUARE ====================
const NeuralSquare = ({ position, isLight, isHighlighted, isValidMove, isLastMove, onClick }) => {
  const meshRef = useRef();
  const glowRef = useRef();
  const runeRef = useRef();
  
  const color = useMemo(() => {
    if (isHighlighted) return '#bf00ff';
    if (isValidMove) return '#00ff88';
    if (isLastMove) return '#ffcc00';
    if (isLight) return '#3a3058';
    return '#18102a';
  }, [isLight, isHighlighted, isValidMove, isLastMove]);
  
  useFrame((state) => {
    if (meshRef.current && (isHighlighted || isValidMove || isLastMove)) {
      const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.35 + 0.65;
      meshRef.current.material.emissiveIntensity = pulse * (isHighlighted ? 0.7 : 0.35);
    }
    if (runeRef.current) {
      runeRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });
  
  const emissiveColor = isHighlighted ? '#bf00ff' : isValidMove ? '#00ff88' : isLastMove ? '#ffcc00' : '#1a0a30';
  
  return (
    <group position={position}>
      {/* Main square */}
      <mesh ref={meshRef} receiveShadow onClick={onClick}>
        <boxGeometry args={[1, 0.16, 1]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.65}
          roughness={0.25}
          transmission={isLight ? 0.12 : 0.06}
          thickness={0.6}
          emissive={emissiveColor}
          emissiveIntensity={isHighlighted || isValidMove || isLastMove ? 0.5 : 0.08}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
        />
      </mesh>
      
      {/* Inner grid pattern - neural network feel */}
      <mesh position={[0, 0.085, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.18, 4]} />
        <meshStandardMaterial
          color={isLight ? '#5040a0' : '#2a1848'}
          emissive={isLight ? '#4030a0' : '#200840'}
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>
      
      {/* Valid move indicator */}
      {isValidMove && (
        <group ref={runeRef} position={[0, 0.2, 0]}>
          <mesh>
            <sphereGeometry args={[0.12, 20, 20]} />
            <meshStandardMaterial
              color="#00ff88"
              emissive="#00ff88"
              emissiveIntensity={1.2}
              transparent
              opacity={0.85}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial
              color="#00ff88"
              emissive="#00ff88"
              emissiveIntensity={0.4}
              transparent
              opacity={0.25}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};

// ==================== COMPLEX CHAIN BORDER ====================
const ChainBorder = () => {
  const chainsRef = useRef();
  
  useFrame((state) => {
    if (chainsRef.current) {
      chainsRef.current.children.forEach((child, i) => {
        if (child.material) {
          const pulse = Math.sin(state.clock.elapsedTime * 3.5 + i * 0.3) * 0.4 + 0.6;
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
      links.push({
        position: [x, 0, z],
        rotation: start[0] === end[0] ? [0, Math.PI / 2, 0] : [0, 0, 0],
        index: i
      });
    }
    return links;
  };
  
  const borders = [
    { start: [-5, -5], end: [5, -5] },
    { start: [5, -5], end: [5, 5] },
    { start: [5, 5], end: [-5, 5] },
    { start: [-5, 5], end: [-5, -5] }
  ];
  
  return (
    <group ref={chainsRef}>
      {borders.map((border, bi) => (
        createChainLinks(border.start, border.end, 20).map((link, li) => (
          <group key={`${bi}-${li}`} position={link.position} rotation={link.rotation}>
            {/* Chain link torus */}
            <mesh>
              <torusGeometry args={[0.08, 0.025, 8, 16]} />
              <meshStandardMaterial
                color="#2a1848"
                emissive="#bf00ff"
                emissiveIntensity={0.6}
                metalness={0.95}
                roughness={0.15}
              />
            </mesh>
            {/* Inner glow */}
            {li % 3 === 0 && (
              <mesh>
                <sphereGeometry args={[0.04, 12, 12]} />
                <meshStandardMaterial
                  color="#ff00bf"
                  emissive="#ff00bf"
                  emissiveIntensity={1.2}
                />
              </mesh>
            )}
          </group>
        ))
      ))}
    </group>
  );
};

// ==================== THE SEAL - RUNIC CIRCLES ====================
const RunicSealCircles = () => {
  const outerRef = useRef();
  const middleRef = useRef();
  const innerRef = useRef();
  const coreRef = useRef();
  
  useFrame((state) => {
    if (outerRef.current) outerRef.current.rotation.z = state.clock.elapsedTime * 0.08;
    if (middleRef.current) middleRef.current.rotation.z = -state.clock.elapsedTime * 0.12;
    if (innerRef.current) innerRef.current.rotation.z = state.clock.elapsedTime * 0.18;
    if (coreRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2.5) * 0.2 + 1;
      coreRef.current.scale.setScalar(pulse);
    }
  });
  
  return (
    <group position={[0, -0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer ring with 16 rune markers */}
      <group ref={outerRef}>
        <mesh>
          <torusGeometry args={[6.5, 0.06, 8, 80]} />
          <meshStandardMaterial
            color="#bf00ff"
            emissive="#bf00ff"
            emissiveIntensity={0.7}
            transparent
            opacity={0.8}
          />
        </mesh>
        {Array.from({ length: 16 }, (_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 6.5, Math.sin(angle) * 6.5, 0.05]}>
              <octahedronGeometry args={[0.1, 0]} />
              <meshStandardMaterial
                color="#ff00bf"
                emissive="#ff00bf"
                emissiveIntensity={1.5}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Middle ring with 12 markers */}
      <group ref={middleRef}>
        <mesh>
          <torusGeometry args={[5.5, 0.045, 8, 64]} />
          <meshStandardMaterial
            color="#ff00bf"
            emissive="#ff00bf"
            emissiveIntensity={0.6}
            transparent
            opacity={0.7}
          />
        </mesh>
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 5.5, Math.sin(angle) * 5.5, 0.05]}>
              <dodecahedronGeometry args={[0.08, 0]} />
              <meshStandardMaterial
                color="#ffcc00"
                emissive="#ffcc00"
                emissiveIntensity={1.8}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Inner ring with 8 markers */}
      <group ref={innerRef}>
        <mesh>
          <torusGeometry args={[4.5, 0.035, 8, 48]} />
          <meshStandardMaterial
            color="#ffcc00"
            emissive="#ffcc00"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 4.5, Math.sin(angle) * 4.5, 0.05]}>
              <tetrahedronGeometry args={[0.1, 0]} />
              <meshStandardMaterial
                color="#bf00ff"
                emissive="#bf00ff"
                emissiveIntensity={1.3}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Core hexagonal seal */}
      <group ref={coreRef}>
        <mesh>
          <ringGeometry args={[0.6, 0.8, 6]} />
          <meshStandardMaterial
            color="#ffcc00"
            emissive="#ffcc00"
            emissiveIntensity={1}
            transparent
            opacity={0.7}
          />
        </mesh>
        <mesh>
          <ringGeometry args={[0.3, 0.5, 6]} />
          <meshStandardMaterial
            color="#bf00ff"
            emissive="#bf00ff"
            emissiveIntensity={0.8}
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>
    </group>
  );
};

// ==================== ENERGY CHAINS FROM ABOVE ====================
const EnergyChains = () => {
  const chainsRef = useRef();
  
  const chainData = useMemo(() => {
    const chains = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 5.8;
      chains.push({
        start: [Math.cos(angle) * radius, 8, Math.sin(angle) * radius],
        end: [Math.cos(angle) * 1.8, 0.2, Math.sin(angle) * 1.8],
        phase: i * 0.5,
        color: i % 3 === 0 ? '#bf00ff' : i % 3 === 1 ? '#ff00bf' : '#ffcc00'
      });
    }
    return chains;
  }, []);
  
  useFrame((state) => {
    if (chainsRef.current) {
      chainsRef.current.children.forEach((chain, i) => {
        if (chain.material) {
          const pulse = Math.sin(state.clock.elapsedTime * 4.5 + chainData[i].phase) * 0.4 + 0.6;
          chain.material.opacity = pulse;
          chain.material.emissiveIntensity = pulse * 1.8;
        }
      });
    }
  });
  
  return (
    <group ref={chainsRef}>
      {chainData.map((chain, i) => {
        const points = [];
        const segments = 30;
        for (let j = 0; j <= segments; j++) {
          const t = j / segments;
          const x = chain.start[0] + (chain.end[0] - chain.start[0]) * t;
          const y = chain.start[1] + (chain.end[1] - chain.start[1]) * t + Math.sin(t * Math.PI) * 2;
          const z = chain.start[2] + (chain.end[2] - chain.start[2]) * t;
          // Add wave effect
          const wave = Math.sin(t * Math.PI * 5 + i * 0.5) * 0.12;
          points.push(new THREE.Vector3(x + wave, y, z + wave));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        
        return (
          <mesh key={i}>
            <tubeGeometry args={[curve, 40, 0.02, 8, false]} />
            <meshStandardMaterial
              color={chain.color}
              emissive={chain.color}
              emissiveIntensity={1.2}
              transparent
              opacity={0.75}
              metalness={0.9}
              roughness={0.25}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// ==================== NEURAL PARTICLE FIELD ====================
const NeuralParticles = ({ count = 400 }) => {
  const particlesRef = useRef();
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = Math.random() * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
      
      const colorChoice = Math.random();
      if (colorChoice < 0.45) {
        colors[i * 3] = 0.75;
        colors[i * 3 + 1] = 0;
        colors[i * 3 + 2] = 1;
      } else if (colorChoice < 0.75) {
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
        positions[i * 3 + 1] += 0.012;
        
        if (positions[i * 3 + 1] > 14) {
          positions[i * 3 + 1] = 0;
        }
        
        const angle = state.clock.elapsedTime * 0.35 + i * 0.04;
        positions[i * 3] += Math.sin(angle) * 0.004;
        positions[i * 3 + 2] += Math.cos(angle) * 0.004;
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
        size={0.06}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ==================== CORNER ANCHORS ====================
const CornerAnchors = () => {
  const anchorsRef = useRef();
  
  useFrame((state) => {
    if (anchorsRef.current) {
      anchorsRef.current.children.forEach((anchor, i) => {
        anchor.rotation.y = state.clock.elapsedTime * (i % 2 === 0 ? 0.5 : -0.5);
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.1;
        anchor.scale.setScalar(scale);
      });
    }
  });
  
  const corners = [
    [-4.8, -4.8],
    [-4.8, 4.8],
    [4.8, -4.8],
    [4.8, 4.8]
  ];
  
  return (
    <group ref={anchorsRef}>
      {corners.map(([x, z], i) => (
        <group key={i} position={[x, 0.1, z]}>
          <mesh>
            <octahedronGeometry args={[0.25, 0]} />
            <meshStandardMaterial
              color="#bf00ff"
              emissive="#ff00bf"
              emissiveIntensity={1.2}
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>
          <mesh>
            <octahedronGeometry args={[0.35, 0]} />
            <meshStandardMaterial
              color="#bf00ff"
              emissive="#bf00ff"
              emissiveIntensity={0.4}
              transparent
              opacity={0.25}
              wireframe
            />
          </mesh>
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
      boardRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.06;
      boardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.01;
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
      {/* THE SEAL - Runic circles beneath */}
      <RunicSealCircles />
      
      {/* Energy chains from above - BADASS */}
      <EnergyChains />
      
      {/* Neural particles */}
      <NeuralParticles count={350} />
      
      {/* Corner anchors */}
      <CornerAnchors />
      
      {/* Main board group */}
      <group ref={boardRef} position={boardPosition}>
        {/* Board base - crystalline dark */}
        <mesh position={[0, -0.18, 0]} receiveShadow>
          <boxGeometry args={[10, 0.3, 10]} />
          <meshPhysicalMaterial
            color="#080410"
            metalness={0.85}
            roughness={0.15}
            emissive="#1a0030"
            emissiveIntensity={0.25}
            transmission={0.15}
            thickness={1.5}
          />
        </mesh>
        
        {/* Glowing edge frame */}
        <mesh position={[0, -0.08, 0]}>
          <boxGeometry args={[10.3, 0.1, 10.3]} />
          <meshStandardMaterial
            color="#bf00ff"
            emissive="#bf00ff"
            emissiveIntensity={0.7}
            transparent
            opacity={0.75}
          />
        </mesh>
        
        {/* Inner edge glow */}
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[9.8, 0.06, 9.8]} />
          <meshStandardMaterial
            color="#ff00bf"
            emissive="#ff00bf"
            emissiveIntensity={0.5}
            transparent
            opacity={0.5}
          />
        </mesh>
        
        {/* Chain border */}
        <ChainBorder />
        
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
            onClick={(e) => {
              e.stopPropagation();
              onPieceClick?.(piece.square);
            }}
          />
        ))}
        
        {/* Ethereal glow beneath board */}
        <pointLight position={[0, -2, 0]} intensity={3} color="#bf00ff" distance={15} />
        <pointLight position={[0, -1.5, 0]} intensity={1.5} color="#ff00bf" distance={10} />
      </group>
    </group>
  );
};

export { AlphaZeroBoard3DScene, squareTo3D };
export default AlphaZeroBoard3DScene;
