import React, { useState, useEffect, useCallback, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Float, MeshTransmissionMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Chess } from 'chess.js';
import { ArrowLeft, RotateCcw, Flag, Zap, Eye } from 'lucide-react';
import SneakyEyeTracker from './SneakyEyeTracker';

// Import AlphaZero settings
import { ALPHAZERO_CONFIG, ALPHAZERO_OPENINGS } from '../personalities/alphazero';

// ═══════════════════════════════════════════════════════════════════════
// CONSTANTS & RUNES - Matching HiddenMasterLock aesthetic
// ═══════════════════════════════════════════════════════════════════════
const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];
const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// AlphaZero color palette
const ALPHA_PURPLE = '#bf00ff';
const ALPHA_PINK = '#ff00bf';
const ALPHA_GOLD = '#ffcc00';

// ═══════════════════════════════════════════════════════════════════════
// 3D RUNE PARTICLE SYSTEM - Floating mystical runes
// ═══════════════════════════════════════════════════════════════════════
function RuneParticles({ count = 50 }) {
  const meshRef = useRef();
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        Math.random() * 15 - 5,
        (Math.random() - 0.5) * 20
      ],
      rune: RUNES[i % RUNES.length],
      speed: 0.2 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2
    }));
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={meshRef}>
      {particles.map((p, i) => (
        <Float key={i} speed={p.speed} floatIntensity={0.5}>
          <Text
            position={p.position}
            fontSize={0.3 + Math.random() * 0.2}
            color={i % 3 === 0 ? ALPHA_PURPLE : i % 3 === 1 ? ALPHA_PINK : ALPHA_GOLD}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000"
          >
            {p.rune}
          </Text>
        </Float>
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ELECTRIC ARC - 3D Lightning effect
// ═══════════════════════════════════════════════════════════════════════
function ElectricArc({ start, end, intensity = 1 }) {
  const lineRef = useRef();
  const points = useMemo(() => {
    const pts = [];
    const segments = 20;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = start[0] + (end[0] - start[0]) * t + (Math.random() - 0.5) * 0.3 * intensity;
      const y = start[1] + (end[1] - start[1]) * t + (Math.random() - 0.5) * 0.3 * intensity;
      const z = start[2] + (end[2] - start[2]) * t + (Math.random() - 0.5) * 0.3 * intensity;
      pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, [start, end, intensity]);

  useFrame(() => {
    if (lineRef.current) {
      // Update points for flickering effect
      const positions = lineRef.current.geometry.attributes.position.array;
      for (let i = 3; i < positions.length - 3; i += 3) {
        positions[i] += (Math.random() - 0.5) * 0.05;
        positions[i + 1] += (Math.random() - 0.5) * 0.05;
        positions[i + 2] += (Math.random() - 0.5) * 0.05;
      }
      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color={ALPHA_PURPLE} linewidth={2} transparent opacity={0.8} />
    </line>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// CHAIN LINK - 3D Rune-engraved chain link
// ═══════════════════════════════════════════════════════════════════════
function ChainLink({ position, rotation = [0, 0, 0], rune, scale = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.02;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
      {/* Torus for chain link */}
      <mesh>
        <torusGeometry args={[0.15, 0.04, 8, 16]} />
        <meshStandardMaterial
          color="#3a2a5a"
          metalness={0.9}
          roughness={0.2}
          emissive={ALPHA_PURPLE}
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Rune text on link */}
      <Text
        position={[0, 0, 0.05]}
        fontSize={0.08}
        color={ALPHA_GOLD}
        anchorX="center"
        anchorY="middle"
      >
        {rune}
      </Text>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// CHAIN SYSTEM - Connecting chains around the board
// ═══════════════════════════════════════════════════════════════════════
function ChainSystem() {
  const chains = useMemo(() => {
    const result = [];
    // Corner chains
    const corners = [
      { start: [-5, 0, -5], dir: [1, 0.5, 1] },
      { start: [5, 0, -5], dir: [-1, 0.5, 1] },
      { start: [-5, 0, 5], dir: [1, 0.5, -1] },
      { start: [5, 0, 5], dir: [-1, 0.5, -1] }
    ];

    corners.forEach((corner, ci) => {
      for (let i = 0; i < 8; i++) {
        result.push({
          position: [
            corner.start[0] + corner.dir[0] * i * 0.4,
            corner.start[1] + corner.dir[1] * i * 0.4 + 1,
            corner.start[2] + corner.dir[2] * i * 0.4
          ],
          rotation: [0, Math.PI / 4 * (ci % 2 === 0 ? 1 : -1), Math.PI / 2],
          rune: RUNES[(ci * 8 + i) % RUNES.length]
        });
      }
    });

    return result;
  }, []);

  return (
    <group>
      {chains.map((chain, i) => (
        <ChainLink
          key={i}
          position={chain.position}
          rotation={chain.rotation}
          rune={chain.rune}
          scale={0.8}
        />
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// RUNE SEAL CIRCLE - Rotating mystical seal
// ═══════════════════════════════════════════════════════════════════════
function RuneSealCircle({ radius = 6, y = -0.5 }) {
  const groupRef = useRef();
  const innerRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group position={[0, y, 0]}>
      {/* Outer ring */}
      <group ref={groupRef}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.1, radius, 64]} />
          <meshStandardMaterial
            color={ALPHA_PURPLE}
            emissive={ALPHA_PURPLE}
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Outer runes */}
        {RUNES.slice(0, 12).map((rune, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <Text
              key={`outer-${i}`}
              position={[Math.cos(angle) * radius, 0.01, Math.sin(angle) * radius]}
              rotation={[-Math.PI / 2, 0, -angle + Math.PI / 2]}
              fontSize={0.4}
              color={ALPHA_GOLD}
              anchorX="center"
              anchorY="middle"
            >
              {rune}
            </Text>
          );
        })}
      </group>

      {/* Inner ring */}
      <group ref={innerRef}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 0.5 - 0.1, radius * 0.5, 64]} />
          <meshStandardMaterial
            color={ALPHA_PINK}
            emissive={ALPHA_PINK}
            emissiveIntensity={0.4}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Inner runes */}
        {RUNES.slice(12, 18).map((rune, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <Text
              key={`inner-${i}`}
              position={[Math.cos(angle) * radius * 0.5, 0.01, Math.sin(angle) * radius * 0.5]}
              rotation={[-Math.PI / 2, 0, -angle + Math.PI / 2]}
              fontSize={0.3}
              color={ALPHA_PURPLE}
              anchorX="center"
              anchorY="middle"
            >
              {rune}
            </Text>
          );
        })}
      </group>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// CHESS PIECE 3D - Sophisticated rune-engraved piece
// ═══════════════════════════════════════════════════════════════════════
function ChessPiece3D({ type, color, position, isSelected, onClick, lastMoveSquare }) {
  const meshRef = useRef();
  const isWhite = color === 'w';
  const pieceColor = isWhite ? '#e8e8e8' : '#1a1a2e';
  const emissiveColor = isWhite ? '#ffffff' : ALPHA_PURPLE;
  const isLastMove = lastMoveSquare;

  useFrame((state) => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.position.y = position[1] + 0.3 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
        meshRef.current.rotation.y = state.clock.elapsedTime * 2;
      } else {
        meshRef.current.position.y = position[1];
        meshRef.current.rotation.y = 0;
      }
    }
  });

  // Piece geometry based on type
  const getGeometry = () => {
    switch (type) {
      case 'k': return <cylinderGeometry args={[0.25, 0.35, 0.9, 8]} />;
      case 'q': return <cylinderGeometry args={[0.22, 0.32, 0.85, 8]} />;
      case 'r': return <boxGeometry args={[0.4, 0.6, 0.4]} />;
      case 'b': return <coneGeometry args={[0.25, 0.7, 6]} />;
      case 'n': return <coneGeometry args={[0.25, 0.65, 4]} />;
      case 'p': return <cylinderGeometry args={[0.15, 0.2, 0.45, 8]} />;
      default: return <sphereGeometry args={[0.25, 16, 16]} />;
    }
  };

  // Rune for each piece type
  const pieceRune = {
    'k': 'ᛟ', 'q': 'ᛞ', 'r': 'ᛏ', 'b': 'ᛒ', 'n': 'ᛖ', 'p': 'ᚠ'
  }[type] || 'ᚨ';

  const pieceHeight = {
    'k': 0.45, 'q': 0.425, 'r': 0.3, 'b': 0.35, 'n': 0.325, 'p': 0.225
  }[type] || 0.3;

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={onClick}
    >
      {/* Base glow for selected/last move */}
      {(isSelected || isLastMove) && (
        <mesh position={[0, -pieceHeight + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.4, 32]} />
          <meshBasicMaterial
            color={isSelected ? ALPHA_GOLD : '#ffff00'}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}

      {/* Main piece mesh */}
      <mesh castShadow>
        {getGeometry()}
        <meshStandardMaterial
          color={pieceColor}
          metalness={0.7}
          roughness={0.2}
          emissive={isSelected ? ALPHA_GOLD : emissiveColor}
          emissiveIntensity={isSelected ? 0.5 : 0.1}
        />
      </mesh>

      {/* Rune engraving */}
      <Text
        position={[0, 0, 0.26]}
        fontSize={0.15}
        color={isWhite ? ALPHA_PURPLE : ALPHA_GOLD}
        anchorX="center"
        anchorY="middle"
      >
        {pieceRune}
      </Text>

      {/* Crown for King/Queen */}
      {(type === 'k' || type === 'q') && (
        <mesh position={[0, pieceHeight + 0.1, 0]}>
          <octahedronGeometry args={[0.1, 0]} />
          <meshStandardMaterial
            color={ALPHA_GOLD}
            emissive={ALPHA_GOLD}
            emissiveIntensity={0.5}
            metalness={1}
            roughness={0}
          />
        </mesh>
      )}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// CHESS BOARD 3D - Sophisticated board with rune engravings
// ═══════════════════════════════════════════════════════════════════════
function ChessBoard3D({ position, onSquareClick, selectedSquare, legalMoves, lastMove }) {
  const boardRef = useRef();

  // Generate squares
  const squares = useMemo(() => {
    const result = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isLight = (row + col) % 2 === 0;
        const squareName = String.fromCharCode(97 + col) + (8 - row);
        const isSelected = selectedSquare === squareName;
        const isLegalMove = legalMoves?.includes(squareName);
        const isLastMoveSquare = lastMove && (lastMove.from === squareName || lastMove.to === squareName);

        result.push({
          position: [col - 3.5, 0, row - 3.5],
          isLight,
          squareName,
          isSelected,
          isLegalMove,
          isLastMoveSquare
        });
      }
    }
    return result;
  }, [selectedSquare, legalMoves, lastMove]);

  return (
    <group ref={boardRef} position={position}>
      {/* Board base */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[9, 0.3, 9]} />
        <meshStandardMaterial
          color="#1a0a3a"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Squares */}
      {squares.map((sq, i) => (
        <mesh
          key={sq.squareName}
          position={[sq.position[0], 0.01, sq.position[2]]}
          onClick={() => onSquareClick(sq.squareName)}
          receiveShadow
        >
          <boxGeometry args={[0.95, 0.02, 0.95]} />
          <meshStandardMaterial
            color={sq.isLight ? '#6a5a8a' : '#2a1a4a'}
            emissive={
              sq.isSelected ? ALPHA_GOLD :
              sq.isLegalMove ? '#00ff88' :
              sq.isLastMoveSquare ? '#ffff00' :
              sq.isLight ? '#4a3a6a' : '#1a0a2a'
            }
            emissiveIntensity={
              sq.isSelected ? 0.5 :
              sq.isLegalMove ? 0.4 :
              sq.isLastMoveSquare ? 0.3 :
              0.1
            }
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
      ))}

      {/* Legal move indicators */}
      {legalMoves?.map((move) => {
        const col = move.charCodeAt(0) - 97;
        const row = 8 - parseInt(move[1]);
        return (
          <mesh
            key={`legal-${move}`}
            position={[col - 3.5, 0.05, row - 3.5]}
          >
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial
              color="#00ff88"
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}

      {/* Corner rune decorations */}
      {[[-4.2, 0.01, -4.2], [4.2, 0.01, -4.2], [-4.2, 0.01, 4.2], [4.2, 0.01, 4.2]].map((pos, i) => (
        <Text
          key={`corner-${i}`}
          position={pos}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.5}
          color={ALPHA_GOLD}
          anchorX="center"
          anchorY="middle"
        >
          {RUNES[i * 6]}
        </Text>
      ))}

      {/* File/Rank labels */}
      {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((file, i) => (
        <Text
          key={`file-${file}`}
          position={[i - 3.5, 0.01, 4.3]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.25}
          color={ALPHA_PURPLE}
          anchorX="center"
          anchorY="middle"
        >
          {file}
        </Text>
      ))}
      {['8', '7', '6', '5', '4', '3', '2', '1'].map((rank, i) => (
        <Text
          key={`rank-${rank}`}
          position={[-4.3, 0.01, i - 3.5]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.25}
          color={ALPHA_PURPLE}
          anchorX="center"
          anchorY="middle"
        >
          {rank}
        </Text>
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// NEURAL NETWORK BACKGROUND - Animated neural connections
// ═══════════════════════════════════════════════════════════════════════
function NeuralNetworkBackground() {
  const groupRef = useRef();
  const nodesRef = useRef([]);

  const nodes = useMemo(() => {
    return Array.from({ length: 30 }, () => ({
      position: [
        (Math.random() - 0.5) * 25,
        Math.random() * 12 - 4,
        (Math.random() - 0.5) * 25
      ],
      connections: []
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <group key={i}>
          {/* Node */}
          <mesh position={node.position}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color={ALPHA_PURPLE} transparent opacity={0.6} />
          </mesh>
          {/* Connections to nearby nodes */}
          {nodes.slice(i + 1, i + 4).map((target, j) => {
            const distance = Math.sqrt(
              Math.pow(target.position[0] - node.position[0], 2) +
              Math.pow(target.position[1] - node.position[1], 2) +
              Math.pow(target.position[2] - node.position[2], 2)
            );
            if (distance < 8) {
              return (
                <line key={`${i}-${j}`}>
                  <bufferGeometry>
                    <bufferAttribute
                      attach="attributes-position"
                      count={2}
                      array={new Float32Array([...node.position, ...target.position])}
                      itemSize={3}
                    />
                  </bufferGeometry>
                  <lineBasicMaterial color={ALPHA_PINK} transparent opacity={0.2} />
                </line>
              );
            }
            return null;
          })}
        </group>
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SCENE SETUP - Lighting and environment
// ═══════════════════════════════════════════════════════════════════════
function SceneSetup() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 10, 0]} intensity={1} color={ALPHA_PURPLE} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color={ALPHA_GOLD} />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color={ALPHA_PINK} />
      <spotLight
        position={[0, 15, 0]}
        angle={0.5}
        penumbra={1}
        intensity={0.8}
        color="#ffffff"
        castShadow
      />
      <fog attach="fog" args={['#0a0515', 10, 40]} />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN 3D CHESS SCENE
// ═══════════════════════════════════════════════════════════════════════
function ChessScene({ 
  position, 
  onSquareClick, 
  selectedSquare, 
  legalMoves, 
  lastMove,
  playerColor 
}) {
  const game = useMemo(() => {
    const g = new Chess();
    g.load(position);
    return g;
  }, [position]);

  // Get all pieces from FEN
  const pieces = useMemo(() => {
    const result = [];
    const board = game.board();
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece) {
          const squareName = String.fromCharCode(97 + col) + (8 - row);
          result.push({
            type: piece.type,
            color: piece.color,
            square: squareName,
            position: [col - 3.5, 0.25, row - 3.5]
          });
        }
      }
    }
    return result;
  }, [game]);

  return (
    <>
      <SceneSetup />
      
      {/* Background effects */}
      <NeuralNetworkBackground />
      <RuneParticles count={40} />
      
      {/* Mystical seal */}
      <RuneSealCircle radius={6} y={-0.6} />
      
      {/* Chains */}
      <ChainSystem />
      
      {/* Chess Board */}
      <ChessBoard3D
        position={[0, 0, 0]}
        onSquareClick={onSquareClick}
        selectedSquare={selectedSquare}
        legalMoves={legalMoves}
        lastMove={lastMove}
      />
      
      {/* Chess Pieces */}
      {pieces.map((piece) => (
        <ChessPiece3D
          key={piece.square}
          type={piece.type}
          color={piece.color}
          position={piece.position}
          isSelected={selectedSquare === piece.square}
          onClick={() => onSquareClick(piece.square)}
          lastMoveSquare={lastMove && (lastMove.from === piece.square || lastMove.to === piece.square)}
        />
      ))}
      
      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        minDistance={8}
        maxDistance={20}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        target={[0, 0, 0]}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════
function countPieces(fen) {
  let count = 0;
  const board = fen.split(' ')[0];
  for (let i = 0; i < board.length; i++) {
    const char = board[i];
    if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
      count++;
    }
  }
  return count;
}

function getGamePhase(moveNum, fen) {
  const pieces = countPieces(fen);
  if (moveNum <= 8) return "opening";
  if (moveNum <= 14 && pieces > 28) return "early-middlegame";
  if (pieces > 22) return "middlegame";
  if (pieces > 14) return "late-middlegame";
  return "endgame";
}

function getAdaptiveDepth(currentFen, moveNumber) {
  const phase = getGamePhase(moveNumber, currentFen);
  const config = ALPHAZERO_CONFIG;
  
  switch (phase) {
    case "opening": return config.openingDepth;
    case "endgame": return config.endgameDepth;
    default: return config.baseDepth;
  }
}

function getBookMove(fen, color) {
  const fenParts = fen.split(' ');
  const fenKey1 = fenParts.slice(0, 4).join(' ');
  const fenKey2 = fenParts.slice(0, 3).join(' ') + ' -';
  
  let position = ALPHAZERO_OPENINGS[fenKey1] || ALPHAZERO_OPENINGS[fenKey2];
  if (!position) return null;
  
  const moves = color === 'w' ? position.white : position.black;
  if (!moves || moves.length === 0) return null;
  
  // Weighted random selection
  const totalWeight = moves.reduce((sum, m) => sum + m.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let moveOption of moves) {
    random -= moveOption.weight;
    if (random <= 0) return moveOption.move;
  }
  
  return moves[0].move;
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT - ChessGame3D
// ═══════════════════════════════════════════════════════════════════════
const ChessGame3D = ({ enemy, playerColor, onGameEnd, onBack }) => {
  const gameRef = useRef(null);
  if (gameRef.current === null) {
    gameRef.current = new Chess();
  }

  const [position, setPosition] = useState(STARTING_FEN);
  const [isThinking, setIsThinking] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [lastMove, setLastMove] = useState(null);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });
  const [currentTurn, setCurrentTurn] = useState('w');
  
  const stockfishRef = useRef(null);
  const isEngineReady = useRef(false);
  const moveCountRef = useRef(0);
  const hasInitializedEngineMove = useRef(false);

  // Refs for state setters
  const setPositionRef = useRef(setPosition);
  const setCurrentTurnRef = useRef(setCurrentTurn);
  const setMoveHistoryRef = useRef(setMoveHistory);
  const setLastMoveRef = useRef(setLastMove);
  const setCapturedPiecesRef = useRef(setCapturedPieces);
  const setGameStatusRef = useRef(setGameStatus);
  const setIsThinkingRef = useRef(setIsThinking);
  const playerColorRef = useRef(playerColor);
  const onGameEndRef = useRef(onGameEnd);

  useEffect(() => {
    setPositionRef.current = setPosition;
    setCurrentTurnRef.current = setCurrentTurn;
    setMoveHistoryRef.current = setMoveHistory;
    setLastMoveRef.current = setLastMove;
    setCapturedPiecesRef.current = setCapturedPieces;
    setGameStatusRef.current = setGameStatus;
    setIsThinkingRef.current = setIsThinking;
    playerColorRef.current = playerColor;
    onGameEndRef.current = onGameEnd;
  });

  // Initialize Stockfish
  useEffect(() => {
    stockfishRef.current = new Worker('/stockfish.js');
    let pendingCallback = null;

    stockfishRef.current.onmessage = (event) => {
      const line = event.data;

      if (line === 'uciok') {
        stockfishRef.current.postMessage('isready');
      } else if (line === 'readyok') {
        isEngineReady.current = true;
        if (playerColorRef.current === 'black' && !hasInitializedEngineMove.current) {
          hasInitializedEngineMove.current = true;
          setTimeout(() => makeEngineMove(), 600);
        }
      } else if (line.startsWith('bestmove')) {
        const parts = line.split(' ');
        const bestMove = parts[1];
        if (pendingCallback && bestMove && bestMove !== '(none)') {
          pendingCallback(bestMove);
          pendingCallback = null;
        }
        setIsThinking(false);
      }
    };

    stockfishRef.current.postMessage('uci');
    stockfishRef.current.postMessage('setoption name Contempt value 50');

    function applyEngineMove(moveStr) {
      const game = gameRef.current;
      const from = moveStr.substring(0, 2);
      const to = moveStr.substring(2, 4);
      const promotion = moveStr.length > 4 ? moveStr[4] : undefined;

      try {
        const moveResult = game.move({
          from,
          to,
          promotion: promotion || 'q'
        });

        if (moveResult) {
          moveCountRef.current++;
          const newFen = game.fen();

          setPositionRef.current(newFen);
          setCurrentTurnRef.current(game.turn());
          setMoveHistoryRef.current(prev => [...prev, moveResult.san]);
          setLastMoveRef.current({ from, to });

          if (moveResult.captured) {
            const capturedColor = moveResult.color === 'w' ? 'black' : 'white';
            setCapturedPiecesRef.current(prev => ({
              ...prev,
              [capturedColor]: [...prev[capturedColor], moveResult.captured]
            }));
          }

          if (game.isGameOver()) {
            let result;
            if (game.isCheckmate()) {
              const loser = game.turn();
              const playerWon = (playerColorRef.current === 'white' && loser === 'b') ||
                (playerColorRef.current === 'black' && loser === 'w');
              result = playerWon ? 'player' : 'enemy';
            } else {
              result = 'draw';
            }
            setGameStatusRef.current('ended');
            setTimeout(() => onGameEndRef.current(result), 1500);
          }
        }
      } catch (e) {
        console.error('Engine move error:', e);
      }
    }

    function makeEngineMove() {
      const game = gameRef.current;
      if (!stockfishRef.current || !isEngineReady.current) return;
      if (game.isGameOver()) return;

      const currentMoveNumber = moveCountRef.current;
      const currentFen = game.fen();
      const engineColor = playerColorRef.current === 'white' ? 'b' : 'w';

      // Try book move first
      if (currentMoveNumber <= 12) {
        const bookMove = getBookMove(currentFen, engineColor);
        if (bookMove) {
          setIsThinkingRef.current(true);
          const thinkTime = 200 + Math.random() * 600;
          setTimeout(() => {
            applyEngineMove(bookMove);
            setIsThinkingRef.current(false);
          }, thinkTime);
          return;
        }
      }

      setIsThinkingRef.current(true);
      const adaptiveDepth = getAdaptiveDepth(currentFen, currentMoveNumber);

      stockfishRef.current.postMessage('setoption name Skill Level value 20');
      stockfishRef.current.postMessage(`setoption name Contempt value ${ALPHAZERO_CONFIG.contempt}`);

      pendingCallback = applyEngineMove;
      stockfishRef.current.postMessage(`position fen ${currentFen}`);
      stockfishRef.current.postMessage(`go depth ${adaptiveDepth}`);
    }

    stockfishRef.current.makeEngineMove = makeEngineMove;

    return () => {
      if (stockfishRef.current) {
        stockfishRef.current.terminate();
      }
    };
  }, []);

  // Handle square click
  const handleSquareClick = useCallback((square) => {
    if (isThinking || gameStatus !== 'playing') return;

    const game = gameRef.current;
    const turn = game.turn();
    const isPlayerTurn = (playerColor === 'white' && turn === 'w') ||
      (playerColor === 'black' && turn === 'b');

    if (!isPlayerTurn) return;

    const piece = game.get(square);

    // If a piece is already selected
    if (selectedSquare) {
      // Try to make a move
      try {
        const moveResult = game.move({
          from: selectedSquare,
          to: square,
          promotion: 'q'
        });

        if (moveResult) {
          moveCountRef.current++;
          const newFen = game.fen();

          setPosition(newFen);
          setCurrentTurn(game.turn());
          setMoveHistory(prev => [...prev, moveResult.san]);
          setLastMove({ from: selectedSquare, to: square });
          setSelectedSquare(null);
          setLegalMoves([]);

          if (moveResult.captured) {
            const capturedColor = moveResult.color === 'w' ? 'black' : 'white';
            setCapturedPieces(prev => ({
              ...prev,
              [capturedColor]: [...prev[capturedColor], moveResult.captured]
            }));
          }

          if (game.isGameOver()) {
            let result;
            if (game.isCheckmate()) {
              const loser = game.turn();
              const playerWon = (playerColor === 'white' && loser === 'b') ||
                (playerColor === 'black' && loser === 'w');
              result = playerWon ? 'player' : 'enemy';
            } else {
              result = 'draw';
            }
            setGameStatus('ended');
            setTimeout(() => onGameEnd(result), 1500);
            return;
          }

          // Trigger engine move
          setTimeout(() => {
            if (stockfishRef.current?.makeEngineMove) {
              stockfishRef.current.makeEngineMove();
            }
          }, 300);
          return;
        }
      } catch (e) {
        // Invalid move, continue to piece selection logic
      }
    }

    // Select a piece
    if (piece && piece.color === turn) {
      setSelectedSquare(square);
      // Get legal moves for this piece
      const moves = game.moves({ square, verbose: true });
      setLegalMoves(moves.map(m => m.to));
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  }, [selectedSquare, isThinking, gameStatus, playerColor, onGameEnd]);

  // Reset game
  const resetGame = useCallback(() => {
    const newGame = new Chess();
    gameRef.current = newGame;
    moveCountRef.current = 0;
    hasInitializedEngineMove.current = false;
    setPosition(newGame.fen());
    setCurrentTurn('w');
    setMoveHistory([]);
    setGameStatus('playing');
    setLastMove(null);
    setSelectedSquare(null);
    setLegalMoves([]);
    setCapturedPieces({ white: [], black: [] });
    setIsThinking(false);

    if (playerColor === 'black') {
      hasInitializedEngineMove.current = true;
      setTimeout(() => {
        if (stockfishRef.current?.makeEngineMove && isEngineReady.current) {
          stockfishRef.current.makeEngineMove();
        }
      }, 600);
    }
  }, [playerColor]);

  // Resign
  const handleResign = () => {
    setGameStatus('ended');
    onGameEnd('enemy');
  };

  // Get piece symbols
  const getPieceSymbol = (piece, color) => {
    const symbols = {
      white: { p: '♙', n: '♘', b: '♗', r: '♖', q: '♕' },
      black: { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛' }
    };
    return symbols[color]?.[piece] || '';
  };

  const isPlayerTurn = (playerColor === 'white' && currentTurn === 'w') ||
    (playerColor === 'black' && currentTurn === 'b');

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0515 0%, #1a0a3a 50%, #0a0515 100%)' }}
      data-testid="chess-game-3d-container"
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          shadows
          camera={{ position: [0, 12, 12], fov: 50 }}
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            <ChessScene
              position={position}
              onSquareClick={handleSquareClick}
              selectedSquare={selectedSquare}
              legalMoves={legalMoves}
              lastMove={lastMove}
              playerColor={playerColor}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {/* Enemy Info */}
          <div
            className="flex items-center gap-3 px-4 py-2 rounded-lg"
            style={{
              background: 'linear-gradient(180deg, rgba(40,20,60,0.95) 0%, rgba(20,10,35,0.98) 100%)',
              border: '1px solid rgba(191, 0, 255, 0.3)',
              boxShadow: '0 0 20px rgba(191, 0, 255, 0.2)'
            }}
          >
            <SneakyEyeTracker
              size="small"
              glowColor={ALPHA_PURPLE}
              useImage={true}
            />
            <div>
              <h3
                className="text-sm font-bold tracking-wide"
                style={{ fontFamily: 'Orbitron, sans-serif', color: ALPHA_PURPLE }}
              >
                {enemy?.name || 'ALPHAZERO'}
              </h3>
              <p className="text-xs" style={{ fontFamily: 'Rajdhani, sans-serif', color: ALPHA_GOLD }}>
                3D NEURAL MODE
              </p>
            </div>
          </div>

          {/* Turn Indicator */}
          <div
            className={`px-4 py-2 rounded-lg ${isThinking ? 'animate-pulse' : ''}`}
            style={{
              background: isPlayerTurn
                ? 'linear-gradient(135deg, #00ff8830 0%, #00ff4415 100%)'
                : `linear-gradient(135deg, ${ALPHA_PURPLE}30 0%, ${ALPHA_PURPLE}15 100%)`,
              border: `1px solid ${isPlayerTurn ? '#00ff8850' : ALPHA_PURPLE + '50'}`
            }}
          >
            {isThinking ? (
              <span style={{ fontFamily: 'Orbitron, sans-serif', color: ALPHA_PURPLE, fontSize: '12px' }}>
                <Zap size={14} className="inline animate-pulse mr-2" />
                NEURAL PROCESSING...
              </span>
            ) : (
              <span
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  color: isPlayerTurn ? '#00ff88' : ALPHA_PURPLE,
                  fontSize: '12px'
                }}
              >
                {isPlayerTurn ? 'YOUR TURN' : 'ALPHAZERO'}
              </span>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button
              data-testid="back-btn-3d"
              onClick={onBack}
              className="flex items-center gap-1 px-3 py-2 rounded-lg transition-all"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '11px'
              }}
            >
              <ArrowLeft size={14} />
              BACK
            </button>
            <button
              data-testid="reset-btn-3d"
              onClick={resetGame}
              className="flex items-center gap-1 px-3 py-2 rounded-lg transition-all"
              style={{
                background: 'rgba(0,100,255,0.2)',
                border: '1px solid rgba(0,150,255,0.3)',
                color: '#4dabf7',
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '11px'
              }}
            >
              <RotateCcw size={14} />
              RESET
            </button>
            <button
              data-testid="resign-btn-3d"
              onClick={handleResign}
              className="flex items-center gap-1 px-3 py-2 rounded-lg transition-all"
              style={{
                background: 'rgba(255,0,64,0.2)',
                border: '1px solid rgba(255,0,64,0.3)',
                color: '#ff6b6b',
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '11px'
              }}
            >
              <Flag size={14} />
              RESIGN
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Panel - Move History & Captured */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <div className="max-w-4xl mx-auto flex gap-4">
          {/* Captured Pieces */}
          <div
            className="flex-1 px-4 py-3 rounded-lg"
            style={{
              background: 'linear-gradient(180deg, rgba(40,20,60,0.9) 0%, rgba(20,10,35,0.95) 100%)',
              border: '1px solid rgba(191, 0, 255, 0.2)'
            }}
          >
            <h4 className="text-xs mb-2" style={{ fontFamily: 'Rajdhani, sans-serif', color: ALPHA_GOLD }}>
              CAPTURED
            </h4>
            <div className="flex gap-4">
              <div className="flex gap-1 min-h-[24px]">
                {capturedPieces[playerColor === 'white' ? 'black' : 'white'].map((piece, i) => (
                  <span key={i} className="text-lg">
                    {getPieceSymbol(piece, playerColor === 'white' ? 'black' : 'white')}
                  </span>
                ))}
              </div>
              <div className="flex gap-1 min-h-[24px] opacity-60">
                {capturedPieces[playerColor].map((piece, i) => (
                  <span key={i} className="text-lg">
                    {getPieceSymbol(piece, playerColor)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Move History */}
          <div
            className="flex-1 px-4 py-3 rounded-lg max-h-24 overflow-y-auto"
            style={{
              background: 'linear-gradient(180deg, rgba(40,20,60,0.9) 0%, rgba(20,10,35,0.95) 100%)',
              border: '1px solid rgba(191, 0, 255, 0.2)'
            }}
          >
            <h4 className="text-xs mb-2" style={{ fontFamily: 'Rajdhani, sans-serif', color: ALPHA_GOLD }}>
              MOVES
            </h4>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              {moveHistory.length === 0 ? (
                <span className="text-gray-600">No moves yet</span>
              ) : (
                Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => (
                  <span key={i} className="text-gray-300">
                    <span className="text-gray-500">{i + 1}.</span>{' '}
                    <span className="text-white">{moveHistory[i * 2]}</span>{' '}
                    <span className="text-gray-400">{moveHistory[i * 2 + 1] || ''}</span>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Playing As */}
          <div
            className="px-4 py-3 rounded-lg flex items-center gap-2"
            style={{
              background: 'linear-gradient(180deg, rgba(40,20,60,0.9) 0%, rgba(20,10,35,0.95) 100%)',
              border: '1px solid rgba(191, 0, 255, 0.2)'
            }}
          >
            <span className="text-xs" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#666' }}>
              PLAYING AS
            </span>
            <span className="text-3xl" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.4))' }}>
              {playerColor === 'white' ? '♔' : '♚'}
            </span>
          </div>
        </div>
      </div>

      {/* Rune decorations in corners */}
      <div className="absolute top-4 left-4 text-4xl opacity-30" style={{ color: ALPHA_PURPLE, textShadow: `0 0 20px ${ALPHA_PURPLE}` }}>
        ᛟ
      </div>
      <div className="absolute top-4 right-4 text-4xl opacity-30" style={{ color: ALPHA_GOLD, textShadow: `0 0 20px ${ALPHA_GOLD}` }}>
        ᛞ
      </div>
      <div className="absolute bottom-20 left-4 text-4xl opacity-30" style={{ color: ALPHA_PINK, textShadow: `0 0 20px ${ALPHA_PINK}` }}>
        ᛜ
      </div>
      <div className="absolute bottom-20 right-4 text-4xl opacity-30" style={{ color: ALPHA_PURPLE, textShadow: `0 0 20px ${ALPHA_PURPLE}` }}>
        ᛚ
      </div>
    </div>
  );
};

export default ChessGame3D;
