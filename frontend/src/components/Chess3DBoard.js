import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';

// Rune symbols for decorative elements
const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];

// Chess piece Unicode symbols
const PIECE_SYMBOLS = {
  wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
  bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟'
};

// Parse FEN to get piece positions
function parseFEN(fen) {
  const pieces = [];
  const [position] = fen.split(' ');
  const rows = position.split('/');
  
  rows.forEach((row, rowIndex) => {
    let colIndex = 0;
    for (const char of row) {
      if (isNaN(char)) {
        const color = char === char.toUpperCase() ? 'w' : 'b';
        const pieceType = char.toUpperCase();
        pieces.push({
          type: color + pieceType,
          row: 7 - rowIndex,
          col: colIndex
        });
        colIndex++;
      } else {
        colIndex += parseInt(char);
      }
    }
  });
  
  return pieces;
}

// Individual chess piece component
function ChessPiece({ type, position, isLastMove, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  const color = type[0] === 'w' ? '#f0f0f0' : '#1a1a2e';
  const emissiveColor = type[0] === 'w' ? '#ffffff' : '#bf00ff';
  const symbol = PIECE_SYMBOLS[type];
  
  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0] + position[2]) * 0.05;
      
      // Glow effect on hover
      if (hovered) {
        meshRef.current.scale.setScalar(1.1 + Math.sin(state.clock.elapsedTime * 4) * 0.05);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });
  
  return (
    <group
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Base glow */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 0.1, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={isLastMove ? '#ffcc00' : emissiveColor}
          emissiveIntensity={isLastMove ? 0.8 : (hovered ? 0.5 : 0.2)}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Piece body */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.6, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={emissiveColor}
          emissiveIntensity={hovered ? 0.4 : 0.15}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Piece symbol - 3D text */}
      <Text
        position={[0, 0.7, 0]}
        fontSize={0.5}
        color={type[0] === 'w' ? '#1a1a2e' : '#e0e0e0'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={emissiveColor}
      >
        {symbol}
      </Text>
      
      {/* Floating particle effect */}
      {hovered && (
        <pointLight
          position={[0, 0.5, 0]}
          color={type[0] === 'w' ? '#ffffff' : '#bf00ff'}
          intensity={2}
          distance={2}
        />
      )}
    </group>
  );
}

// Chess square component
function ChessSquare({ row, col, isLight, isHighlighted, isLastMove, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  const baseColor = isLight ? '#6b7280' : '#374151';
  const highlightColor = isLastMove ? '#fbbf24' : (isHighlighted ? '#22c55e' : baseColor);
  
  useFrame((state) => {
    if (meshRef.current && (isHighlighted || hovered)) {
      meshRef.current.material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      position={[col - 3.5, 0, row - 3.5]}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
      receiveShadow
    >
      <planeGeometry args={[0.98, 0.98]} />
      <meshStandardMaterial
        color={hovered ? '#a855f7' : highlightColor}
        emissive={isHighlighted || isLastMove ? highlightColor : '#000000'}
        emissiveIntensity={isHighlighted || isLastMove ? 0.3 : 0}
        metalness={0.3}
        roughness={0.7}
      />
    </mesh>
  );
}

// Board edge with runes
function BoardEdge() {
  const edgesRef = useRef();
  
  useFrame((state) => {
    if (edgesRef.current) {
      edgesRef.current.children.forEach((child, i) => {
        if (child.material) {
          child.material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.2;
        }
      });
    }
  });
  
  return (
    <group ref={edgesRef}>
      {/* Board frame */}
      {[[-4.5, 0], [4.5, 0], [0, -4.5], [0, 4.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.1, z]} rotation={i < 2 ? [0, 0, 0] : [0, Math.PI / 2, 0]}>
          <boxGeometry args={[i < 2 ? 0.5 : 9.5, 0.3, i < 2 ? 9.5 : 0.5]} />
          <meshStandardMaterial
            color="#2a1a4a"
            emissive="#bf00ff"
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}
      
      {/* Corner decorations */}
      {[[-4.5, -4.5], [-4.5, 4.5], [4.5, -4.5], [4.5, 4.5]].map(([x, z], i) => (
        <mesh key={`corner-${i}`} position={[x, 0, z]}>
          <octahedronGeometry args={[0.4]} />
          <meshStandardMaterial
            color="#4a2a7a"
            emissive="#ff00bf"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

// Floating rune particles
function FloatingRunes() {
  const runesRef = useRef();
  const runePositions = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 15,
        Math.random() * 8 + 2,
        (Math.random() - 0.5) * 15
      ],
      rune: RUNES[i % RUNES.length],
      speed: 0.5 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2
    }));
  }, []);
  
  useFrame((state) => {
    if (runesRef.current) {
      runesRef.current.children.forEach((child, i) => {
        const data = runePositions[i];
        child.position.y = data.position[1] + Math.sin(state.clock.elapsedTime * data.speed + data.phase) * 1;
        child.rotation.y = state.clock.elapsedTime * 0.5;
      });
    }
  });
  
  return (
    <group ref={runesRef}>
      {runePositions.map((data, i) => (
        <Text
          key={i}
          position={data.position}
          fontSize={0.8}
          color="#bf00ff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#ff00bf"
          fillOpacity={0.6}
        >
          {data.rune}
        </Text>
      ))}
    </group>
  );
}

// Electric chains effect
function ElectricChains() {
  const chainsRef = useRef();
  
  const chainPoints = useMemo(() => {
    const chains = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 6;
      chains.push({
        start: [Math.cos(angle) * radius, 5, Math.sin(angle) * radius],
        end: [Math.cos(angle) * 2, 0.5, Math.sin(angle) * 2],
        phase: i * 0.5
      });
    }
    return chains;
  }, []);
  
  useFrame((state) => {
    if (chainsRef.current) {
      chainsRef.current.children.forEach((chain, i) => {
        const intensity = 0.5 + Math.sin(state.clock.elapsedTime * 4 + chainPoints[i].phase) * 0.3;
        if (chain.material) {
          chain.material.opacity = intensity;
        }
      });
    }
  });
  
  return (
    <group ref={chainsRef}>
      {chainPoints.map((chain, i) => {
        const points = [];
        const segments = 20;
        for (let j = 0; j <= segments; j++) {
          const t = j / segments;
          const x = chain.start[0] + (chain.end[0] - chain.start[0]) * t + Math.sin(t * Math.PI * 4) * 0.3;
          const y = chain.start[1] + (chain.end[1] - chain.start[1]) * t;
          const z = chain.start[2] + (chain.end[2] - chain.start[2]) * t + Math.cos(t * Math.PI * 4) * 0.3;
          points.push(new THREE.Vector3(x, y, z));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        
        return (
          <mesh key={i}>
            <tubeGeometry args={[curve, 64, 0.03, 8, false]} />
            <meshStandardMaterial
              color="#bf00ff"
              emissive="#ff00bf"
              emissiveIntensity={1}
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Energy particles
function EnergyParticles() {
  const particlesRef = useRef();
  const count = 200;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      // Purple/pink color variation
      colors[i * 3] = 0.7 + Math.random() * 0.3;
      colors[i * 3 + 1] = Math.random() * 0.3;
      colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
    }
    
    return { positions, colors };
  }, []);
  
  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += 0.02;
        
        if (positions[i * 3 + 1] > 15) {
          positions[i * 3 + 1] = 0;
        }
        
        // Spiral motion
        const angle = state.clock.elapsedTime * 0.5 + i * 0.1;
        positions[i * 3] += Math.sin(angle) * 0.01;
        positions[i * 3 + 2] += Math.cos(angle) * 0.01;
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
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Main 3D scene
function Chess3DScene({ position, lastMove, playerColor, onSquareClick }) {
  const pieces = useMemo(() => parseFEN(position), [position]);
  const controlsRef = useRef();
  
  // Reset camera on color change
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [playerColor]);
  
  const lastMoveSquares = useMemo(() => {
    if (!lastMove) return { from: null, to: null };
    return {
      from: { row: parseInt(lastMove.from[1]) - 1, col: lastMove.from.charCodeAt(0) - 97 },
      to: { row: parseInt(lastMove.to[1]) - 1, col: lastMove.to.charCodeAt(0) - 97 }
    };
  }, [lastMove]);
  
  const isLastMoveSquare = (row, col) => {
    if (!lastMoveSquares.from) return false;
    return (lastMoveSquares.from.row === row && lastMoveSquares.from.col === col) ||
           (lastMoveSquares.to.row === row && lastMoveSquares.to.col === col);
  };
  
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={playerColor === 'white' ? [0, 8, 10] : [0, 8, -10]}
        fov={50}
      />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={8}
        maxDistance={20}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        rotateSpeed={0.5}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[0, 8, 0]} color="#bf00ff" intensity={2} distance={20} />
      <pointLight position={[-5, 5, -5]} color="#ff00bf" intensity={1} distance={15} />
      <pointLight position={[5, 5, 5]} color="#ffcc00" intensity={0.5} distance={15} />
      
      {/* Board squares */}
      <group>
        {Array.from({ length: 8 }, (_, row) =>
          Array.from({ length: 8 }, (_, col) => (
            <ChessSquare
              key={`${row}-${col}`}
              row={row}
              col={col}
              isLight={(row + col) % 2 === 1}
              isLastMove={isLastMoveSquare(row, col)}
              onClick={() => onSquareClick && onSquareClick(row, col)}
            />
          ))
        )}
      </group>
      
      {/* Board base */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[8.5, 0.2, 8.5]} />
        <meshStandardMaterial
          color="#1a0a2e"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      
      {/* Board edge decorations */}
      <BoardEdge />
      
      {/* Chess pieces */}
      {pieces.map((piece, i) => {
        const isLastMovePiece = lastMoveSquares.to &&
          piece.row === lastMoveSquares.to.row &&
          piece.col === lastMoveSquares.to.col;
        
        return (
          <ChessPiece
            key={`${piece.type}-${piece.row}-${piece.col}-${i}`}
            type={piece.type}
            position={[piece.col - 3.5, 0.1, piece.row - 3.5]}
            isLastMove={isLastMovePiece}
          />
        );
      })}
      
      {/* Atmospheric effects */}
      <FloatingRunes />
      <ElectricChains />
      <EnergyParticles />
      
      {/* Environment */}
      <fog attach="fog" args={['#0a0a15', 15, 40]} />
    </>
  );
}

// Main exported component
const Chess3DBoard = ({ position, lastMove, playerColor, boardSize, onSquareClick }) => {
  return (
    <div
      style={{
        width: boardSize,
        height: boardSize,
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a0a15 0%, #1a0a2e 100%)',
        boxShadow: '0 0 40px rgba(191, 0, 255, 0.4), 0 0 80px rgba(191, 0, 255, 0.2), inset 0 0 20px rgba(0,0,0,0.5)',
        border: '2px solid rgba(191, 0, 255, 0.3)'
      }}
      data-testid="chess-3d-board"
    >
      <Canvas shadows>
        <Chess3DScene
          position={position}
          lastMove={lastMove}
          playerColor={playerColor}
          onSquareClick={onSquareClick}
        />
      </Canvas>
    </div>
  );
};

export default Chess3DBoard;
