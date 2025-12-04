import React, { useState, useEffect, useCallback, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Sky, 
  Cloud, 
  Stars,
  Text3D,
  Center,
  Float,
  MeshReflectorMaterial,
  useTexture,
  Sparkles,
  PointMaterial,
  Points
} from '@react-three/drei';
import * as THREE from 'three';
import { Chess } from 'chess.js';
import { ArrowLeft, RotateCcw, Flag, Zap, Cube, Square } from 'lucide-react';
import SneakyEyeTracker from './SneakyEyeTracker';

// Personality imports
import { ELEGANT_CONFIG, ELEGANT_OPENINGS } from '../personalities/elegant';
import { NON_ELEGANT_CONFIG, NON_ELEGANT_OPENINGS } from '../personalities/nonelegant';
import { MINI_A0_CONFIG, MINI_A0_OPENINGS } from '../personalities/minia0';

// ═══════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS - Same as 2D version
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

function analyzePositionType(fen) {
  if (fen.indexOf("+") !== -1) return "tactical";
  const board = fen.split(' ')[0];
  if (board.indexOf("pp") !== -1 || board.indexOf("PP") !== -1) {
    return "positional";
  }
  return "normal";
}

function getEngineSettingsForEnemy(enemyId) {
  switch (enemyId) {
    case 'elegant':
      return { ...ELEGANT_CONFIG, openings: ELEGANT_OPENINGS, style: 'positional' };
    case 'nonelegant':
      return { ...NON_ELEGANT_CONFIG, openings: NON_ELEGANT_OPENINGS, style: 'aggressive' };
    case 'minia0':
      return { ...MINI_A0_CONFIG, openings: MINI_A0_OPENINGS, style: 'strategic' };
    default:
      return { ...ELEGANT_CONFIG, openings: ELEGANT_OPENINGS, style: 'balanced' };
  }
}

function getAdaptiveDepthForPosition(currentFen, moveNumber, enemyId) {
  const settings = getEngineSettingsForEnemy(enemyId);
  const phase = getGamePhase(moveNumber, currentFen);
  const posType = analyzePositionType(currentFen);
  let depth = settings.baseDepth;
  if (phase === "opening") depth = settings.openingDepth;
  else if (phase === "endgame") depth = settings.endgameDepth;
  else if (phase === "middlegame" || phase === "late-middlegame") {
    if (posType === "tactical") depth = settings.tacticalDepth;
    else if (posType === "positional") depth = settings.positionalDepth;
  }
  return depth;
}

function getBookMoveForPosition(fen, color, enemyId) {
  const settings = getEngineSettingsForEnemy(enemyId);
  const fenParts = fen.split(' ');
  const fenKey1 = fenParts.slice(0, 4).join(' ');
  const fenKey2 = fenParts.slice(0, 3).join(' ') + ' -';
  const fenKey3 = fenParts[0] + ' ' + fenParts[1] + ' ' + fenParts[2] + ' -';
  let position = settings.openings[fenKey1] || settings.openings[fenKey2] || settings.openings[fenKey3];
  if (!position) return null;
  const moves = color === 'w' ? position.white : position.black;
  if (!moves || moves.length === 0) return null;
  const aggressionBoost = settings.aggressionFactor || 0.5;
  let adjustedMoves = moves.map((m, idx) => ({
    ...m,
    weight: m.weight * (idx === 0 ? aggressionBoost + 0.15 : 1)
  }));
  const totalWeight = adjustedMoves.reduce((sum, m) => sum + m.weight, 0);
  let random = Math.random() * totalWeight;
  for (let moveOption of adjustedMoves) {
    random -= moveOption.weight;
    if (random <= 0) return moveOption.move;
  }
  return moves[0].move;
}

// ═══════════════════════════════════════════════════════════════════════
// 3D ENVIRONMENT COMPONENTS
// ═══════════════════════════════════════════════════════════════════════

// Floating particles for dreamy effect
function DreamParticles({ count = 500 }) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = Math.random() * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return positions;
  }, [count]);

  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#8866ff"
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

// Animated trees for the environment
function MagicalTree({ position, scale = 1 }) {
  const ref = useRef();
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  
  useFrame((state) => {
    if (ref.current) {
      // Gentle swaying
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + offset) * 0.02;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.2, 0.35, 3, 8]} />
        <meshStandardMaterial color="#4a3728" roughness={0.9} />
      </mesh>
      {/* Foliage - multiple layers */}
      <mesh position={[0, 4, 0]}>
        <coneGeometry args={[1.5, 3, 8]} />
        <meshStandardMaterial color="#1a4d2e" roughness={0.8} />
      </mesh>
      <mesh position={[0, 5.5, 0]}>
        <coneGeometry args={[1.2, 2.5, 8]} />
        <meshStandardMaterial color="#2d5a3f" roughness={0.8} />
      </mesh>
      <mesh position={[0, 6.7, 0]}>
        <coneGeometry args={[0.8, 2, 8]} />
        <meshStandardMaterial color="#3d6b4f" roughness={0.8} />
      </mesh>
      {/* Magical glow particles */}
      <Sparkles count={20} scale={3} size={2} speed={0.3} color="#88ffaa" position={[0, 4, 0]} />
    </group>
  );
}

// Small creature - rabbit-like
function SmallCreature({ position }) {
  const ref = useRef();
  const [targetPos, setTargetPos] = useState(position);
  const currentPos = useRef(new THREE.Vector3(...position));
  
  useFrame((state, delta) => {
    if (ref.current) {
      // Gentle hopping animation
      ref.current.position.y = position[1] + Math.abs(Math.sin(state.clock.elapsedTime * 2)) * 0.1;
      
      // Occasionally move to new position
      if (Math.random() < 0.002) {
        setTargetPos([
          position[0] + (Math.random() - 0.5) * 5,
          position[1],
          position[2] + (Math.random() - 0.5) * 5
        ]);
      }
      
      // Smoothly move towards target
      currentPos.current.lerp(new THREE.Vector3(...targetPos), delta * 0.5);
      ref.current.position.x = currentPos.current.x;
      ref.current.position.z = currentPos.current.z;
      
      // Face movement direction
      const dir = new THREE.Vector3(targetPos[0] - ref.current.position.x, 0, targetPos[2] - ref.current.position.z);
      if (dir.length() > 0.1) {
        ref.current.rotation.y = Math.atan2(dir.x, dir.z);
      }
    }
  });

  return (
    <group ref={ref} position={position} scale={0.3}>
      {/* Body */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#e8d5c4" roughness={0.9} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.6, 0.3]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#f0e6dc" roughness={0.9} />
      </mesh>
      {/* Ears */}
      <mesh position={[-0.1, 0.9, 0.2]} rotation={[0.3, 0, -0.2]}>
        <capsuleGeometry args={[0.05, 0.3, 4, 8]} />
        <meshStandardMaterial color="#f5ebe0" roughness={0.9} />
      </mesh>
      <mesh position={[0.1, 0.9, 0.2]} rotation={[0.3, 0, 0.2]}>
        <capsuleGeometry args={[0.05, 0.3, 4, 8]} />
        <meshStandardMaterial color="#f5ebe0" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Butterfly creature
function Butterfly({ position }) {
  const ref = useRef();
  const startPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const color = useMemo(() => 
    ['#ff88dd', '#88ddff', '#ffdd88', '#88ffbb'][Math.floor(Math.random() * 4)],
  []);
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      // Fluttering path
      ref.current.position.x = startPos.x + Math.sin(t * 0.5) * 3;
      ref.current.position.y = startPos.y + Math.sin(t * 0.7) * 2;
      ref.current.position.z = startPos.z + Math.cos(t * 0.4) * 3;
      // Wing flapping
      ref.current.children.forEach((wing, i) => {
        if (wing.name === 'wing') {
          wing.rotation.y = Math.sin(t * 15) * 0.8 * (i === 0 ? 1 : -1);
        }
      });
    }
  });

  return (
    <group ref={ref} position={position} scale={0.15}>
      {/* Body */}
      <mesh>
        <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
        <meshStandardMaterial color="#333" roughness={0.8} />
      </mesh>
      {/* Wings */}
      <mesh name="wing" position={[-0.3, 0, 0]}>
        <planeGeometry args={[0.8, 0.6]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
      <mesh name="wing" position={[0.3, 0, 0]}>
        <planeGeometry args={[0.8, 0.6]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 3D CHESS BOARD
// ═══════════════════════════════════════════════════════════════════════

// Rune symbol component
function RuneSymbol({ position, rotation = [0, 0, 0] }) {
  const symbols = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ'];
  const symbol = useMemo(() => symbols[Math.floor(Math.random() * symbols.length)], []);
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <planeGeometry args={[0.3, 0.3]} />
      <meshStandardMaterial 
        color="#8844ff"
        emissive="#8844ff"
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

// Chess piece 3D model
function ChessPiece3D({ type, color, position, isSelected, onClick, lastMove }) {
  const ref = useRef();
  const isLight = color === 'w';
  const pieceColor = isLight ? '#f0e6d8' : '#2a1a0a';
  const emissiveColor = isLight ? '#ffddbb' : '#442200';
  
  const isLastMoveSquare = lastMove && 
    (lastMove.to === position.square || lastMove.from === position.square);
  
  useFrame((state) => {
    if (ref.current) {
      // Hover/selection effect
      if (isSelected) {
        ref.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 3) * 0.1 + 0.3;
        ref.current.rotation.y += 0.02;
      } else {
        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, position.y, 0.1);
      }
    }
  });

  const pieceHeight = {
    'p': 0.4, 'r': 0.6, 'n': 0.65, 'b': 0.7, 'q': 0.85, 'k': 0.9
  }[type] || 0.5;

  const PieceMesh = () => {
    switch(type) {
      case 'p': // Pawn
        return (
          <group>
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.2, 0.25, 0.1, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.3} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.12, 0.18, 0.2, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.3} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.45, 0]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.3} roughness={0.5} />
            </mesh>
          </group>
        );
      case 'r': // Rook
        return (
          <group>
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.22, 0.27, 0.1, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.3} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.18, 0.22, 0.3, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.3} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.55, 0]}>
              <cylinderGeometry args={[0.2, 0.18, 0.15, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.3} roughness={0.5} />
            </mesh>
          </group>
        );
      case 'n': // Knight
        return (
          <group>
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.22, 0.27, 0.1, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.3} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.35, 0.05]} rotation={[0.3, 0, 0]}>
              <boxGeometry args={[0.2, 0.4, 0.15]} />
              <meshStandardMaterial color={pieceColor} metalness={0.3} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.5, 0.15]} rotation={[0.6, 0, 0]}>
              <boxGeometry args={[0.15, 0.25, 0.12]} />
              <meshStandardMaterial color={pieceColor} metalness={0.3} roughness={0.5} />
            </mesh>
          </group>
        );
      case 'b': // Bishop
        return (
          <group>
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.22, 0.27, 0.1, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.3} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.1, 0.2, 0.3, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.3} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.55, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.3} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.7, 0]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.3} roughness={0.5} />
            </mesh>
          </group>
        );
      case 'q': // Queen
        return (
          <group>
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.25, 0.3, 0.1, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.3} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.12, 0.23, 0.4, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.3} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.65, 0]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.3} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.8, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.4} emissive="#ffaa00" emissiveIntensity={0.3} />
            </mesh>
          </group>
        );
      case 'k': // King
        return (
          <group>
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.25, 0.3, 0.1, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.3} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.15, 0.23, 0.4, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.3} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.65, 0]}>
              <cylinderGeometry args={[0.12, 0.15, 0.15, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.3} roughness={0.5} />
            </mesh>
            {/* Cross on top */}
            <mesh position={[0, 0.8, 0]}>
              <boxGeometry args={[0.05, 0.2, 0.05]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.4} emissive="#ffdd00" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0, 0.85, 0]}>
              <boxGeometry args={[0.15, 0.05, 0.05]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.4} emissive="#ffdd00" emissiveIntensity={0.2} />
            </mesh>
          </group>
        );
      default:
        return (
          <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color={pieceColor} />
          </mesh>
        );
    }
  };

  return (
    <group 
      ref={ref} 
      position={[position.x, position.y, position.z]}
      onClick={onClick}
    >
      <PieceMesh />
      {/* Selection glow */}
      {isSelected && (
        <mesh position={[0, 0.01, 0]}>
          <ringGeometry args={[0.3, 0.4, 32]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={2} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* Last move highlight */}
      {isLastMoveSquare && !isSelected && (
        <mesh position={[0, 0.01, 0]}>
          <ringGeometry args={[0.35, 0.42, 32]} />
          <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={1} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

// Main chess board component
function ChessBoard3D({ game, playerColor, selectedSquare, onSquareClick, lastMove, validMoves }) {
  const boardRef = useRef();
  
  useFrame((state) => {
    if (boardRef.current) {
      // Gentle floating animation
      boardRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  // Generate board squares and pieces
  const squares = [];
  const pieces = [];
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
  
  // Determine board orientation based on player color
  const isFlipped = playerColor === 'black';
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const file = files[col];
      const rank = ranks[row];
      const square = `${file}${rank}`;
      
      // Position calculation (center the board)
      const x = (col - 3.5) * 0.6;
      const z = (isFlipped ? (7 - row) - 3.5 : row - 3.5) * 0.6;
      
      const isLight = (row + col) % 2 === 0;
      const isSelected = selectedSquare === square;
      const isValidMove = validMoves.includes(square);
      const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
      
      // Square
      squares.push(
        <mesh
          key={`square-${square}`}
          position={[x, 0, z]}
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={() => onSquareClick(square)}
        >
          <planeGeometry args={[0.58, 0.58]} />
          <meshStandardMaterial 
            color={isSelected ? '#00ff88' : isValidMove ? '#44ff88' : isLastMove ? '#ffff44' : isLight ? '#c4a77d' : '#6b4423'}
            metalness={0.1}
            roughness={0.8}
            emissive={isSelected ? '#00ff44' : isValidMove ? '#22aa44' : '#000000'}
            emissiveIntensity={isSelected ? 0.5 : isValidMove ? 0.3 : 0}
          />
        </mesh>
      );
      
      // Get piece at square
      const piece = game.get(square);
      if (piece) {
        pieces.push(
          <ChessPiece3D
            key={`piece-${square}`}
            type={piece.type}
            color={piece.color}
            position={{ x, y: 0.1, z, square }}
            isSelected={isSelected}
            onClick={() => onSquareClick(square)}
            lastMove={lastMove}
          />
        );
      }
    }
  }
  
  // Runes around the board
  const runes = [];
  for (let i = 0; i < 32; i++) {
    const angle = (i / 32) * Math.PI * 2;
    const radius = 3.2;
    runes.push(
      <RuneSymbol
        key={`rune-${i}`}
        position={[Math.cos(angle) * radius, 0.05, Math.sin(angle) * radius]}
        rotation={[-Math.PI / 2, 0, angle + Math.PI / 2]}
      />
    );
  }

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={boardRef}>
        {/* Board base with rune engravings */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[5.2, 0.3, 5.2]} />
          <meshStandardMaterial 
            color="#2a1a3a"
            metalness={0.5}
            roughness={0.3}
            emissive="#4422aa"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Glowing edge */}
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[5.3, 0.1, 5.3]} />
          <meshStandardMaterial 
            color="#6633ff"
            emissive="#6633ff"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
        
        {/* Board squares */}
        <group position={[0, 0.01, 0]}>
          {squares}
        </group>
        
        {/* Pieces */}
        {pieces}
        
        {/* Runes */}
        {runes}
        
        {/* Magical aura beneath board */}
        <Sparkles 
          count={100} 
          scale={6} 
          size={3} 
          speed={0.5} 
          color="#aa66ff" 
          position={[0, -0.5, 0]}
        />
      </group>
    </Float>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN 3D SCENE
// ═══════════════════════════════════════════════════════════════════════

function Scene3D({ game, playerColor, selectedSquare, onSquareClick, lastMove, validMoves, enemyColor }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#8866ff" />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#ff8866" />
      
      {/* Sky and environment */}
      <Sky 
        distance={450000}
        sunPosition={[5, 1, 8]}
        inclination={0.5}
        azimuth={0.25}
        rayleigh={0.5}
      />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Clouds */}
      <Cloud position={[-20, 15, -10]} speed={0.2} opacity={0.5} />
      <Cloud position={[20, 18, 10]} speed={0.2} opacity={0.4} />
      <Cloud position={[0, 20, -20]} speed={0.2} opacity={0.6} />
      
      {/* Dream particles */}
      <DreamParticles count={300} />
      
      {/* Trees */}
      <MagicalTree position={[-15, 0, -15]} scale={1.2} />
      <MagicalTree position={[18, 0, -12]} scale={0.9} />
      <MagicalTree position={[-20, 0, 10]} scale={1.1} />
      <MagicalTree position={[15, 0, 15]} scale={0.8} />
      <MagicalTree position={[-8, 0, -20]} scale={1.0} />
      <MagicalTree position={[22, 0, 5]} scale={1.3} />
      
      {/* Small creatures */}
      <SmallCreature position={[-10, 0, 8]} />
      <SmallCreature position={[12, 0, -8]} />
      <SmallCreature position={[-5, 0, 15]} />
      
      {/* Butterflies */}
      <Butterfly position={[5, 5, 5]} />
      <Butterfly position={[-8, 6, -3]} />
      <Butterfly position={[3, 4, -6]} />
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#1a3d2e" roughness={1} />
      </mesh>
      
      {/* Grass patches */}
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh 
          key={`grass-${i}`}
          position={[
            (Math.random() - 0.5) * 60,
            -4.9,
            (Math.random() - 0.5) * 60
          ]}
          rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}
        >
          <circleGeometry args={[0.5 + Math.random() * 1.5, 8]} />
          <meshStandardMaterial color="#2d5a3f" roughness={1} />
        </mesh>
      ))}
      
      {/* Chess board */}
      <ChessBoard3D 
        game={game}
        playerColor={playerColor}
        selectedSquare={selectedSquare}
        onSquareClick={onSquareClick}
        lastMove={lastMove}
        validMoves={validMoves}
      />
      
      {/* Camera controls */}
      <OrbitControls 
        enablePan={false}
        minDistance={5}
        maxDistance={20}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        target={[0, 0, 0]}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const ChessGame3D = ({ enemy, playerColor, onGameEnd, onBack, onSwitch2D }) => {
  const gameRef = useRef(null);
  if (gameRef.current === null) {
    gameRef.current = new Chess();
  }
  
  const [position, setPosition] = useState(STARTING_FEN);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [lastMove, setLastMove] = useState(null);
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });
  const [isMobile, setIsMobile] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('w');
  const [isInCheck, setIsInCheck] = useState(false);
  
  const stockfishRef = useRef(null);
  const isEngineReady = useRef(false);
  const moveCountRef = useRef(0);
  const hasInitializedEngineMove = useRef(false);
  
  // Refs for callbacks
  const setPositionRef = useRef(setPosition);
  const setCurrentTurnRef = useRef(setCurrentTurn);
  const setIsInCheckRef = useRef(setIsInCheck);
  const setMoveHistoryRef = useRef(setMoveHistory);
  const setLastMoveRef = useRef(setLastMove);
  const setCapturedPiecesRef = useRef(setCapturedPieces);
  const setGameStatusRef = useRef(setGameStatus);
  const setIsThinkingRef = useRef(setIsThinking);
  const enemyRef = useRef(enemy);
  const playerColorRef = useRef(playerColor);
  const gameStatusRef = useRef(gameStatus);
  const onGameEndRef = useRef(onGameEnd);

  useEffect(() => {
    enemyRef.current = enemy;
    playerColorRef.current = playerColor;
    gameStatusRef.current = gameStatus;
    onGameEndRef.current = onGameEnd;
    setPositionRef.current = setPosition;
    setCurrentTurnRef.current = setCurrentTurn;
    setIsInCheckRef.current = setIsInCheck;
    setMoveHistoryRef.current = setMoveHistory;
    setLastMoveRef.current = setLastMove;
    setCapturedPiecesRef.current = setCapturedPieces;
    setGameStatusRef.current = setGameStatus;
    setIsThinkingRef.current = setIsThinking;
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Stockfish engine setup
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
        const moveResult = game.move({ from, to, promotion: promotion || 'q' });
        if (moveResult) {
          moveCountRef.current++;
          const newFen = game.fen();
          setPositionRef.current(newFen);
          setCurrentTurnRef.current(game.turn());
          setIsInCheckRef.current(game.isCheck() && !game.isCheckmate());
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
      if (!stockfishRef.current || !isEngineReady.current || game.isGameOver()) return;

      const currentEnemyId = enemyRef.current?.id;
      const currentPlayerColor = playerColorRef.current;
      const settings = getEngineSettingsForEnemy(currentEnemyId);
      const engineColor = currentPlayerColor === 'white' ? 'b' : 'w';
      const currentMoveNumber = moveCountRef.current;
      const currentFen = game.fen();

      const openingBookDepth = currentEnemyId === 'minia0' ? 12 : (currentEnemyId === 'elegant' ? 10 : 8);
      if (currentMoveNumber <= openingBookDepth) {
        const bookMove = getBookMoveForPosition(currentFen, engineColor, currentEnemyId);
        if (bookMove) {
          const minTime = settings.thinkingTimeMin || 150;
          const maxTime = settings.thinkingTimeMax || 800;
          const thinkTime = minTime + Math.random() * (maxTime - minTime) * (settings.openingSpeed || 0.5);
          setIsThinkingRef.current(true);
          setTimeout(() => {
            applyEngineMove(bookMove);
            setIsThinkingRef.current(false);
          }, thinkTime);
          return;
        }
      }

      setIsThinkingRef.current(true);
      const adaptiveDepth = getAdaptiveDepthForPosition(currentFen, currentMoveNumber, currentEnemyId);
      const skillLevel = currentEnemyId === 'minia0' ? 15 : 20;

      stockfishRef.current.postMessage(`setoption name Skill Level value ${skillLevel}`);
      stockfishRef.current.postMessage(`setoption name Contempt value ${settings.contempt || 24}`);
      pendingCallback = applyEngineMove;
      stockfishRef.current.postMessage(`position fen ${currentFen}`);
      stockfishRef.current.postMessage(`go depth ${adaptiveDepth}`);
    }

    stockfishRef.current.makeEngineMove = makeEngineMove;

    return () => {
      if (stockfishRef.current) stockfishRef.current.terminate();
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

    if (selectedSquare) {
      // Try to make a move
      if (validMoves.includes(square)) {
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
            setIsInCheck(game.isCheck() && !game.isCheckmate());
            setMoveHistory(prev => [...prev, moveResult.san]);
            setLastMove({ from: selectedSquare, to: square });
            setSelectedSquare(null);
            setValidMoves([]);

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

            setTimeout(() => {
              if (stockfishRef.current?.makeEngineMove) {
                stockfishRef.current.makeEngineMove();
              }
            }, 300);
            return;
          }
        } catch (e) {
          console.error('Move error:', e);
        }
      }

      // If clicked on own piece, select it instead
      if (piece && piece.color === (playerColor === 'white' ? 'w' : 'b')) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        setValidMoves(moves.map(m => m.to));
        return;
      }

      // Deselect
      setSelectedSquare(null);
      setValidMoves([]);
    } else {
      // Select a piece
      if (piece && piece.color === (playerColor === 'white' ? 'w' : 'b')) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        setValidMoves(moves.map(m => m.to));
      }
    }
  }, [selectedSquare, validMoves, isThinking, gameStatus, playerColor, onGameEnd]);

  // Reset game
  const resetGame = useCallback(() => {
    const newGame = new Chess();
    gameRef.current = newGame;
    moveCountRef.current = 0;
    hasInitializedEngineMove.current = false;
    setPosition(newGame.fen());
    setCurrentTurn('w');
    setIsInCheck(false);
    setMoveHistory([]);
    setGameStatus('playing');
    setLastMove(null);
    setCapturedPieces({ white: [], black: [] });
    setIsThinking(false);
    setSelectedSquare(null);
    setValidMoves([]);

    if (playerColor === 'black') {
      hasInitializedEngineMove.current = true;
      setTimeout(() => {
        if (stockfishRef.current?.makeEngineMove && isEngineReady.current) {
          stockfishRef.current.makeEngineMove();
        }
      }, 600);
    }
  }, [playerColor]);

  const handleResign = () => {
    setGameStatus('ended');
    onGameEnd('enemy');
  };

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
    <div className="fixed inset-0 w-full h-full" data-testid="chess-game-3d-container">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 8, 10], fov: 50 }}
        shadows
        style={{ background: 'linear-gradient(180deg, #0a0520 0%, #1a0a40 50%, #0a0520 100%)' }}
      >
        <Suspense fallback={null}>
          <Scene3D
            game={gameRef.current}
            playerColor={playerColor}
            selectedSquare={selectedSquare}
            onSquareClick={handleSquareClick}
            lastMove={lastMove}
            validMoves={validMoves}
            enemyColor={enemy?.color}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none">
        {/* Left Panel - Enemy Info */}
        <div 
          className="pointer-events-auto rounded-lg p-3 max-w-xs"
          style={{
            background: 'linear-gradient(180deg, rgba(20,10,40,0.95) 0%, rgba(10,5,25,0.98) 100%)',
            border: `1px solid ${enemy?.color || '#8844ff'}40`,
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            {enemy?.avatar === '👁' ? (
              <SneakyEyeTracker size="small" glowColor={enemy?.color} useImage={true} />
            ) : (
              <span className="text-2xl" style={{ filter: `drop-shadow(0 0 8px ${enemy?.color})` }}>
                {enemy?.avatar}
              </span>
            )}
            <div>
              <h3 className="text-sm font-bold" style={{ fontFamily: 'Orbitron, sans-serif', color: enemy?.color }}>
                {enemy?.name}
              </h3>
              <p className="text-xs text-gray-500" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                {enemy?.difficulty}
              </p>
            </div>
          </div>

          {/* Turn Indicator */}
          <div 
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg mb-3 ${isThinking ? 'animate-pulse' : ''}`}
            style={{
              background: isPlayerTurn 
                ? 'linear-gradient(135deg, #00ff8830 0%, #00ff4415 100%)'
                : `linear-gradient(135deg, ${enemy?.color}30 0%, ${enemy?.color}15 100%)`,
              border: `1px solid ${isPlayerTurn ? '#00ff8850' : enemy?.color + '50'}`
            }}
          >
            {isThinking ? (
              <>
                <Zap size={14} className="animate-pulse" style={{ color: enemy?.color }} />
                <span style={{ fontFamily: 'Orbitron, sans-serif', color: enemy?.color, fontSize: '11px' }}>
                  THINKING...
                </span>
              </>
            ) : (
              <span style={{ fontFamily: 'Orbitron, sans-serif', color: isPlayerTurn ? '#00ff88' : enemy?.color, fontSize: '11px' }}>
                {isPlayerTurn ? 'YOUR TURN' : 'OPPONENT'}
              </span>
            )}
          </div>

          {/* Captured Pieces */}
          <div className="mb-3">
            <h4 className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>CAPTURED</h4>
            <div className="flex flex-wrap gap-0.5 min-h-[20px] p-1.5 rounded bg-black/30 text-sm">
              {capturedPieces[playerColor === 'white' ? 'black' : 'white'].map((piece, i) => (
                <span key={i}>{getPieceSymbol(piece, playerColor === 'white' ? 'black' : 'white')}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-0.5 min-h-[20px] p-1.5 rounded bg-white/5 mt-1 text-sm">
              {capturedPieces[playerColor].map((piece, i) => (
                <span key={i}>{getPieceSymbol(piece, playerColor)}</span>
              ))}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-1.5">
            <button
              data-testid="back-btn-3d"
              onClick={onBack}
              className="flex items-center justify-center gap-1 py-1.5 px-3 rounded bg-white/10 hover:bg-white/20 transition-all text-xs text-white"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              <ArrowLeft size={12} />
              BACK
            </button>
            <button
              data-testid="reset-btn-3d"
              onClick={resetGame}
              className="flex items-center justify-center gap-1 py-1.5 px-3 rounded bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 transition-all text-xs"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              <RotateCcw size={12} />
              RESET
            </button>
            <button
              data-testid="resign-btn-3d"
              onClick={handleResign}
              className="flex items-center justify-center gap-1 py-1.5 px-3 rounded bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-all text-xs"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              <Flag size={12} />
              RESIGN
            </button>
          </div>
        </div>

        {/* Right Panel - Mode Switch & Move History */}
        <div 
          className="pointer-events-auto rounded-lg p-3"
          style={{
            background: 'linear-gradient(180deg, rgba(20,10,40,0.95) 0%, rgba(10,5,25,0.98) 100%)',
            border: '1px solid rgba(136,68,255,0.3)',
            backdropFilter: 'blur(10px)',
            minWidth: '180px'
          }}
        >
          {/* 2D/3D Toggle */}
          <div className="mb-3">
            <button
              data-testid="switch-to-2d-btn"
              onClick={onSwitch2D}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/50 hover:to-blue-600/50 transition-all text-white"
              style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px' }}
            >
              <Square size={14} />
              SWITCH TO 2D
            </button>
          </div>

          {/* Move History */}
          <h3 className="text-xs font-bold tracking-wider mb-2 text-gray-400" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            MOVES
          </h3>
          <div className="h-32 overflow-y-auto pr-1 custom-scrollbar" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            {moveHistory.length === 0 ? (
              <p className="text-gray-600 text-xs">No moves yet</p>
            ) : (
              <div className="space-y-0.5 text-xs">
                {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => (
                  <div key={i} className="flex items-center gap-1 py-0.5 px-1.5 rounded hover:bg-white/5 text-white">
                    <span className="text-gray-600 w-4">{i + 1}.</span>
                    <span className="flex-1">{moveHistory[i * 2]}</span>
                    <span className="text-gray-400 flex-1">{moveHistory[i * 2 + 1] || ''}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Player Color */}
          <div className="mt-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500" style={{ fontFamily: 'Rajdhani, sans-serif' }}>PLAYING AS</span>
              <span className="text-xl text-white" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.4))' }}>
                {playerColor === 'white' ? '♔' : '♚'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Check indicator */}
      {isInCheck && (
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #ff0040 0%, #ff4000 100%)',
            fontFamily: 'Orbitron, sans-serif',
            animation: 'pulse 1s infinite',
            fontSize: '14px',
            color: 'white',
            boxShadow: '0 0 30px rgba(255,0,64,0.6)'
          }}
        >
          CHECK!
        </div>
      )}

      {/* 3D Mode indicator */}
      <div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full"
        style={{
          background: 'linear-gradient(135deg, rgba(136,68,255,0.3) 0%, rgba(68,136,255,0.3) 100%)',
          border: '1px solid rgba(136,68,255,0.5)',
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '10px',
          color: '#aa88ff',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Cube size={12} className="inline mr-2" />
        3D FANTASY MODE • DRAG TO ROTATE
      </div>
    </div>
  );
};

export default ChessGame3D;
