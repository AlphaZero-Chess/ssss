import React, { useState, useEffect, useMemo, useCallback, useRef, Suspense, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════════
// CHESS 3D MODE - ULTRA FOCUS PLUS - TRUE 3D PIECES WITH THREE.JS
// Sophisticated 3D chess board with real geometric 3D pieces,
// complex magic seals, and the overwhelming AlphaZero visual signature
// ═══════════════════════════════════════════════════════════════════════════════

// Files and ranks for board coordinates
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

// Parse FEN to get piece positions
const parseFEN = (fen) => {
  const pieces = {};
  const [board] = fen.split(' ');
  const rows = board.split('/');
  
  rows.forEach((row, rankIndex) => {
    let fileIndex = 0;
    for (const char of row) {
      if (char >= '1' && char <= '8') {
        fileIndex += parseInt(char);
      } else {
        const square = FILES[fileIndex] + RANKS[rankIndex];
        const color = char === char.toUpperCase() ? 'w' : 'b';
        const piece = char.toUpperCase();
        pieces[square] = color + piece;
        fileIndex++;
      }
    }
  });
  
  return pieces;
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3D CHESS PIECE COMPONENTS - Sophisticated Geometric Pieces
// ═══════════════════════════════════════════════════════════════════════════════

// Piece colors - elegant palette
const PIECE_COLORS = {
  white: {
    main: '#e8e0f8',
    accent: '#b090ff',
    emissive: '#6040a0',
    gold: '#ffcc00'
  },
  black: {
    main: '#1a0828',
    accent: '#bf00ff',
    emissive: '#bf00ff',
    gold: '#ffcc00'
  }
};

// 3D PAWN - Neural Node Sentinel
const Pawn3D = memo(({ position, color, isSelected, onClick }) => {
  const meshRef = useRef();
  const colors = color === 'w' ? PIECE_COLORS.white : PIECE_COLORS.black;
  
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.08 + 0.15;
      meshRef.current.rotation.y += 0.02;
    }
  });
  
  return (
    <group ref={meshRef} position={position} onClick={onClick}>
      {/* Base */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.28, 0.34, 0.12, 20]} />
        <meshStandardMaterial color={colors.main} metalness={0.85} roughness={0.15} emissive={colors.emissive} emissiveIntensity={isSelected ? 0.6 : 0.15} />
      </mesh>
      {/* Base ring */}
      <mesh position={[0, 0.08, 0]}>
        <torusGeometry args={[0.3, 0.02, 8, 24]} />
        <meshStandardMaterial color={colors.accent} emissive={colors.accent} emissiveIntensity={0.6} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.16, 0.24, 0.28, 16]} />
        <meshStandardMaterial color={colors.main} metalness={0.85} roughness={0.15} emissive={colors.emissive} emissiveIntensity={isSelected ? 0.6 : 0.15} />
      </mesh>
      {/* Head sphere */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color={colors.main} metalness={0.85} roughness={0.15} emissive={colors.emissive} emissiveIntensity={isSelected ? 0.6 : 0.15} />
      </mesh>
      {/* Inner glow core */}
      <mesh position={[0, 0.5, 0]}>
        <octahedronGeometry args={[0.08, 0]} />
        <meshStandardMaterial color={colors.gold} emissive={colors.gold} emissiveIntensity={1.5} />
      </mesh>
      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.38, 0.5, 24]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1.2} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
});

// 3D ROOK - Monolithic Obelisk Fortress
const Rook3D = memo(({ position, color, isSelected, onClick }) => {
  const meshRef = useRef();
  const colors = color === 'w' ? PIECE_COLORS.white : PIECE_COLORS.black;
  
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.08 + 0.15;
      meshRef.current.rotation.y += 0.02;
    }
  });
  
  return (
    <group ref={meshRef} position={position} onClick={onClick}>
      {/* Base */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.32, 0.38, 0.16, 8]} />
        <meshStandardMaterial color={colors.main} metalness={0.85} roughness={0.15} emissive={colors.emissive} emissiveIntensity={isSelected ? 0.6 : 0.2} />
      </mesh>
      {/* Base ring */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[0.34, 0.025, 8, 24]} />
        <meshStandardMaterial color={colors.accent} emissive={colors.accent} emissiveIntensity={0.7} />
      </mesh>
      {/* Tower body */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.6, 8]} />
        <meshStandardMaterial color={colors.main} metalness={0.85} roughness={0.15} emissive={colors.emissive} emissiveIntensity={isSelected ? 0.6 : 0.2} />
      </mesh>
      {/* Mid ring */}
      <mesh position={[0, 0.4, 0]}>
        <torusGeometry args={[0.24, 0.018, 8, 24]} />
        <meshStandardMaterial color={colors.gold} emissive={colors.gold} emissiveIntensity={0.8} />
      </mesh>
      {/* Crown cap */}
      <mesh position={[0, 0.76, 0]}>
        <cylinderGeometry args={[0.26, 0.22, 0.12, 8]} />
        <meshStandardMaterial color={colors.main} metalness={0.85} roughness={0.15} emissive={colors.emissive} emissiveIntensity={isSelected ? 0.6 : 0.2} />
      </mesh>
      {/* Neural core - double octahedron */}
      <mesh position={[0, 0.9, 0]}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial color={colors.gold} emissive={colors.gold} emissiveIntensity={2} metalness={0.95} roughness={0.05} />
      </mesh>
      <mesh position={[0, 0.9, 0]} rotation={[0, Math.PI / 4, 0]}>
        <octahedronGeometry args={[0.08, 0]} />
        <meshStandardMaterial color={colors.accent} emissive={colors.accent} emissiveIntensity={2.5} />
      </mesh>
      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.42, 0.55, 24]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1.2} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
});

// 3D KNIGHT - Neural Algorithm Beast
const Knight3D = memo(({ position, color, isSelected, onClick }) => {
  const meshRef = useRef();
  const colors = color === 'w' ? PIECE_COLORS.white : PIECE_COLORS.black;
  const eyeColor = color === 'w' ? '#00ffff' : '#ff0040';
  
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.08 + 0.15;
      meshRef.current.rotation.y += 0.02;
    }
  });
  
  return (
    <group ref={meshRef} position={position} onClick={onClick}>
      {/* Base */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.28, 0.34, 0.12, 16]} />
        <meshStandardMaterial color={colors.main} metalness={0.85} roughness={0.15} emissive={colors.emissive} emissiveIntensity={isSelected ? 0.6 : 0.15} />
      </mesh>
      {/* Base ring */}
      <mesh position={[0, 0.08, 0]}>
        <torusGeometry args={[0.3, 0.02, 8, 24]} />
        <meshStandardMaterial color={colors.accent} emissive={colors.accent} emissiveIntensity={0.6} />
      </mesh>
      {/* Body stem */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 0.32, 14]} />
        <meshStandardMaterial color={colors.main} metalness={0.85} roughness={0.15} emissive={colors.emissive} emissiveIntensity={isSelected ? 0.6 : 0.15} />
      </mesh>
      {/* Head block - abstract algorithmic */}
      <mesh position={[0, 0.56, 0.08]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.28, 0.38, 0.3]} />
        <meshStandardMaterial color={colors.main} metalness={0.85} roughness={0.15} emissive={colors.emissive} emissiveIntensity={isSelected ? 0.6 : 0.15} />
      </mesh>
      {/* Crest cone */}
      <mesh position={[0, 0.84, -0.02]} rotation={[-0.2, 0, 0]}>
        <coneGeometry args={[0.1, 0.22, 10]} />
        <meshStandardMaterial color={colors.main} metalness={0.85} roughness={0.15} emissive={colors.emissive} emissiveIntensity={isSelected ? 0.6 : 0.15} />
      </mesh>
      {/* Sensor eye */}
      <mesh position={[0, 0.58, 0.22]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={3.5} />
      </mesh>
      {/* Eye glow aura */}
      <mesh position={[0, 0.58, 0.22]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={0.8} transparent opacity={0.35} />
      </mesh>
      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.38, 0.5, 24]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1.2} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
});

// 3D BISHOP - Neural Spire
const Bishop3D = memo(({ position, color, isSelected, onClick }) => {
  const meshRef = useRef();
  const colors = color === 'w' ? PIECE_COLORS.white : PIECE_COLORS.black;
  
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.08 + 0.15;
      meshRef.current.rotation.y += 0.02;
    }
  });
  
  return (
    <group ref={meshRef} position={position} onClick={onClick}>
      {/* Base */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.28, 0.34, 0.12, 18]} />
        <meshStandardMaterial color={colors.main} metalness={0.85} roughness={0.15} emissive={colors.emissive} emissiveIntensity={isSelected ? 0.6 : 0.15} />
      </mesh>
      {/* Base ring */}
      <mesh position={[0, 0.08, 0]}>
        <torusGeometry args={[0.3, 0.02, 8, 24]} />
        <meshStandardMaterial color={colors.accent} emissive={colors.accent} emissiveIntensity={0.6} />
      </mesh>
      {/* Body column */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.16, 0.24, 0.4, 16]} />
        <meshStandardMaterial color={colors.main} metalness={0.85} roughness={0.15} emissive={colors.emissive} emissiveIntensity={isSelected ? 0.6 : 0.15} />
      </mesh>
      {/* Mid ring */}
      <mesh position={[0, 0.3, 0]}>
        <torusGeometry args={[0.2, 0.015, 8, 24]} />
        <meshStandardMaterial color={colors.gold} emissive={colors.gold} emissiveIntensity={0.7} />
      </mesh>
      {/* Mitre dome */}
      <mesh position={[0, 0.62, 0]}>
        <sphereGeometry args={[0.18, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={colors.main} metalness={0.85} roughness={0.15} emissive={colors.emissive} emissiveIntensity={isSelected ? 0.6 : 0.15} />
      </mesh>
      {/* Spire */}
      <mesh position={[0, 0.86, 0]}>
        <coneGeometry args={[0.08, 0.26, 14]} />
        <meshStandardMaterial color={colors.main} metalness={0.85} roughness={0.15} emissive={colors.emissive} emissiveIntensity={isSelected ? 0.6 : 0.15} />
      </mesh>
      {/* Neural slit */}
      <mesh position={[0, 0.68, 0.13]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.03, 0.14, 0.12]} />
        <meshStandardMaterial color={colors.accent} emissive={colors.accent} emissiveIntensity={2} />
      </mesh>
      {/* Tip orb */}
      <mesh position={[0, 1.0, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color={colors.gold} emissive={colors.gold} emissiveIntensity={2.2} />
      </mesh>
      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.38, 0.5, 24]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1.2} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
});

// 3D QUEEN - Neural Empress
const Queen3D = memo(({ position, color, isSelected, onClick }) => {
  const meshRef = useRef();
  const colors = color === 'w' ? PIECE_COLORS.white : PIECE_COLORS.black;
  
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.08 + 0.15;
      meshRef.current.rotation.y += 0.02;
    }
  });
  
  return (
    <group ref={meshRef} position={position} onClick={onClick}>
      {/* Base */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.3, 0.36, 0.16, 20]} />
        <meshStandardMaterial color={colors.main} metalness={0.85} roughness={0.15} emissive={colors.emissive} emissiveIntensity={isSelected ? 0.6 : 0.2} />
      </mesh>
      {/* Base ring */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[0.32, 0.022, 8, 28]} />
        <meshStandardMaterial color={colors.accent} emissive={colors.accent} emissiveIntensity={0.7} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.18, 0.26, 0.36, 18]} />
        <meshStandardMaterial color={colors.main} metalness={0.85} roughness={0.15} emissive={colors.emissive} emissiveIntensity={isSelected ? 0.6 : 0.2} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.56, 0]}>
        <cylinderGeometry args={[0.2, 0.18, 0.1, 18]} />
        <meshStandardMaterial color={colors.main} metalness={0.85} roughness={0.15} emissive={colors.emissive} emissiveIntensity={isSelected ? 0.6 : 0.2} />
      </mesh>
      {/* Crown base */}
      <mesh position={[0, 0.66, 0]}>
        <cylinderGeometry args={[0.22, 0.2, 0.1, 18]} />
        <meshStandardMaterial color={colors.main} metalness={0.85} roughness={0.15} emissive={colors.emissive} emissiveIntensity={isSelected ? 0.6 : 0.2} />
      </mesh>
      {/* Crown spires - 8 points */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <group key={i}>
            <mesh position={[Math.cos(rad) * 0.14, 0.8, Math.sin(rad) * 0.14]}>
              <coneGeometry args={[0.035, 0.2, 8]} />
              <meshStandardMaterial color={colors.main} metalness={0.85} roughness={0.15} emissive={colors.emissive} emissiveIntensity={isSelected ? 0.6 : 0.2} />
            </mesh>
            <mesh position={[Math.cos(rad) * 0.14, 0.92, Math.sin(rad) * 0.14]}>
              <octahedronGeometry args={[0.022, 0]} />
              <meshStandardMaterial color={i % 2 === 0 ? colors.gold : colors.accent} emissive={i % 2 === 0 ? colors.gold : colors.accent} emissiveIntensity={1.8} />
            </mesh>
          </group>
        );
      })}
      {/* Central orb */}
      <mesh position={[0, 0.94, 0]}>
        <sphereGeometry args={[0.1, 20, 20]} />
        <meshStandardMaterial color={colors.gold} emissive={colors.gold} emissiveIntensity={2.5} metalness={0.95} roughness={0.05} />
      </mesh>
      {/* Aura */}
      <mesh position={[0, 0.94, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color={colors.gold} emissive={colors.gold} emissiveIntensity={0.5} transparent opacity={0.25} />
      </mesh>
      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.54, 24]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1.2} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
});

// 3D KING - The AlphaZero Seal Supreme
const King3D = memo(({ position, color, isSelected, onClick }) => {
  const meshRef = useRef();
  const colors = color === 'w' ? PIECE_COLORS.white : PIECE_COLORS.black;
  
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.08 + 0.15;
      meshRef.current.rotation.y += 0.02;
    }
  });
  
  return (
    <group ref={meshRef} position={position} onClick={onClick}>
      {/* Base */}
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.32, 0.4, 0.18, 22]} />
        <meshStandardMaterial color={colors.main} metalness={0.85} roughness={0.15} emissive={colors.emissive} emissiveIntensity={isSelected ? 0.6 : 0.2} />
      </mesh>
      {/* Base rings */}
      <mesh position={[0, 0.12, 0]}>
        <torusGeometry args={[0.35, 0.025, 8, 28]} />
        <meshStandardMaterial color={colors.accent} emissive={colors.accent} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <torusGeometry args={[0.38, 0.018, 6, 24]} />
        <meshStandardMaterial color={colors.gold} emissive={colors.gold} emissiveIntensity={0.6} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.2, 0.28, 0.4, 20]} />
        <meshStandardMaterial color={colors.main} metalness={0.85} roughness={0.15} emissive={colors.emissive} emissiveIntensity={isSelected ? 0.6 : 0.2} />
      </mesh>
      {/* Mid ring */}
      <mesh position={[0, 0.36, 0]}>
        <torusGeometry args={[0.23, 0.016, 8, 24]} />
        <meshStandardMaterial color={colors.gold} emissive={colors.gold} emissiveIntensity={0.7} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.64, 0]}>
        <cylinderGeometry args={[0.22, 0.2, 0.12, 20]} />
        <meshStandardMaterial color={colors.main} metalness={0.85} roughness={0.15} emissive={colors.emissive} emissiveIntensity={isSelected ? 0.6 : 0.2} />
      </mesh>
      {/* Crown band */}
      <mesh position={[0, 0.72, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.045, 12, 32]} />
        <meshStandardMaterial color={colors.accent} emissive={colors.accent} emissiveIntensity={1} metalness={0.95} roughness={0.1} />
      </mesh>
      {/* THE ALPHAZERO CROSS */}
      <group position={[0, 0.92, 0]}>
        {/* Vertical beam */}
        <mesh>
          <boxGeometry args={[0.06, 0.38, 0.06]} />
          <meshStandardMaterial color={colors.gold} emissive={colors.gold} emissiveIntensity={2.2} metalness={0.95} roughness={0.05} />
        </mesh>
        {/* Horizontal beam */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.24, 0.06, 0.06]} />
          <meshStandardMaterial color={colors.gold} emissive={colors.gold} emissiveIntensity={2.2} metalness={0.95} roughness={0.05} />
        </mesh>
        {/* Cross center orb */}
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.05, 14, 14]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3.5} />
        </mesh>
        {/* Cross tips */}
        <mesh position={[0.12, 0.1, 0]}>
          <octahedronGeometry args={[0.028, 0]} />
          <meshStandardMaterial color={colors.accent} emissive={colors.accent} emissiveIntensity={2} />
        </mesh>
        <mesh position={[-0.12, 0.1, 0]}>
          <octahedronGeometry args={[0.028, 0]} />
          <meshStandardMaterial color={colors.accent} emissive={colors.accent} emissiveIntensity={2} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <tetrahedronGeometry args={[0.025, 0]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
        </mesh>
      </group>
      {/* Cross aura */}
      <mesh position={[0, 0.96, 0]}>
        <sphereGeometry args={[0.24, 18, 18]} />
        <meshStandardMaterial color={colors.gold} emissive={colors.gold} emissiveIntensity={0.4} transparent opacity={0.18} />
      </mesh>
      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.44, 0.58, 24]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1.2} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// PIECE FACTORY - Maps piece codes to 3D components
// ═══════════════════════════════════════════════════════════════════════════════
const ChessPiece3D = memo(({ piece, position, isSelected, onClick }) => {
  if (!piece) return null;
  
  const color = piece[0]; // 'w' or 'b'
  const type = piece[1];  // 'K', 'Q', 'R', 'B', 'N', 'P'
  
  const props = { position, color, isSelected, onClick };
  
  switch (type) {
    case 'K': return <King3D {...props} />;
    case 'Q': return <Queen3D {...props} />;
    case 'R': return <Rook3D {...props} />;
    case 'B': return <Bishop3D {...props} />;
    case 'N': return <Knight3D {...props} />;
    case 'P': return <Pawn3D {...props} />;
    default: return null;
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3D BOARD SQUARE
// ═══════════════════════════════════════════════════════════════════════════════
const BoardSquare3D = memo(({ position, isLight, isLegal, isSelected, isLastMove, onClick }) => {
  const color = useMemo(() => {
    if (isSelected) return '#bf00ff';
    if (isLegal) return '#00ff88';
    if (isLastMove) return '#ffcc00';
    return isLight ? '#4a3a6a' : '#1a0a2a';
  }, [isLight, isSelected, isLegal, isLastMove]);
  
  const emissiveIntensity = (isSelected || isLegal || isLastMove) ? 0.4 : 0.08;
  
  return (
    <group position={position}>
      <mesh receiveShadow onClick={onClick}>
        <boxGeometry args={[0.95, 0.12, 0.95]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.6}
          roughness={0.35}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      {isLegal && (
        <mesh position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1.2} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// SEAL CIRCLE - Rotating mystical seal beneath board
// ═══════════════════════════════════════════════════════════════════════════════
const SealCircle = memo(() => {
  const circleRef = useRef();
  
  useFrame((state) => {
    if (circleRef.current) {
      circleRef.current.rotation.z = state.clock.elapsedTime * 0.04;
    }
  });
  
  return (
    <group ref={circleRef} position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer ring */}
      <mesh>
        <torusGeometry args={[5.8, 0.06, 8, 48]} />
        <meshStandardMaterial color="#bf00ff" emissive="#bf00ff" emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>
      {/* Inner ring */}
      <mesh>
        <torusGeometry args={[4.6, 0.04, 8, 36]} />
        <meshStandardMaterial color="#ff00bf" emissive="#ff00bf" emissiveIntensity={0.4} transparent opacity={0.5} />
      </mesh>
      {/* Seal markers */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 5.8, Math.sin(angle) * 5.8, 0.04]}>
            <octahedronGeometry args={[0.12, 0]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#ffcc00' : '#bf00ff'} emissive={i % 2 === 0 ? '#ffcc00' : '#bf00ff'} emissiveIntensity={1} />
          </mesh>
        );
      })}
    </group>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// CORNER ANCHORS - Glowing corner pieces
// ═══════════════════════════════════════════════════════════════════════════════
const CornerAnchors = memo(() => {
  const corners = [[-4.3, -4.3], [-4.3, 4.3], [4.3, -4.3], [4.3, 4.3]];
  
  return (
    <group>
      {corners.map(([x, z], i) => (
        <group key={i} position={[x, 0.15, z]}>
          <mesh>
            <octahedronGeometry args={[0.18, 0]} />
            <meshStandardMaterial color="#bf00ff" emissive="#bf00ff" emissiveIntensity={0.9} metalness={0.9} roughness={0.15} />
          </mesh>
          <pointLight color="#bf00ff" intensity={0.8} distance={3} />
        </group>
      ))}
    </group>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN 3D SCENE
// ═══════════════════════════════════════════════════════════════════════════════
const Chess3DScene = memo(({ pieces, selectedSquare, legalMoves, lastMove, onSquareClick, playerColor }) => {
  const controlsRef = useRef();
  
  // Generate board squares
  const squares = useMemo(() => {
    const squareData = [];
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const isLight = (rank + file) % 2 === 1;
        const square = String.fromCharCode(97 + file) + (8 - rank);
        const offset = 3.5;
        squareData.push({
          key: square,
          position: [(file - offset) * 1.0, 0, (rank - offset) * 1.0],
          isLight,
          square
        });
      }
    }
    return squareData;
  }, []);
  
  // Parse pieces
  const pieceElements = useMemo(() => {
    const elements = [];
    Object.entries(pieces).forEach(([square, piece]) => {
      if (piece) {
        const file = square.charCodeAt(0) - 97;
        const rank = 8 - parseInt(square[1]);
        const offset = 3.5;
        elements.push({
          key: square,
          piece,
          position: [(file - offset) * 1.0, 0.45, (rank - offset) * 1.0],
          square
        });
      }
    });
    return elements;
  }, [pieces]);
  
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={playerColor === 'white' ? [0, 10, 12] : [0, 10, -12]}
        fov={45}
      />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={25}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.3}
        target={[0, 0, 0]}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 12, 0]} intensity={1.2} color="#bf00ff" />
      <pointLight position={[6, 6, 6]} intensity={0.5} color="#ffcc00" />
      <pointLight position={[-6, 6, -6]} intensity={0.5} color="#ff00bf" />
      <spotLight position={[0, 15, 0]} angle={0.5} penumbra={1} intensity={0.6} color="#ffffff" />
      
      {/* Fog */}
      <fog attach="fog" args={['#030308', 20, 60]} />
      
      {/* Seal circle */}
      <SealCircle />
      
      {/* Corner anchors */}
      <CornerAnchors />
      
      {/* Board base */}
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <boxGeometry args={[9, 0.2, 9]} />
        <meshPhysicalMaterial color="#060310" metalness={0.8} roughness={0.25} emissive="#180035" emissiveIntensity={0.15} />
      </mesh>
      
      {/* Glowing edge */}
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry args={[9.2, 0.06, 9.2]} />
        <meshStandardMaterial color="#bf00ff" emissive="#bf00ff" emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>
      
      {/* Board squares */}
      {squares.map((sq) => (
        <BoardSquare3D
          key={sq.key}
          position={sq.position}
          isLight={sq.isLight}
          isSelected={selectedSquare === sq.square}
          isLegal={legalMoves?.includes(sq.square)}
          isLastMove={lastMove && (lastMove.from === sq.square || lastMove.to === sq.square)}
          onClick={(e) => {
            e.stopPropagation();
            onSquareClick?.(sq.square);
          }}
        />
      ))}
      
      {/* Chess pieces */}
      {pieceElements.map((p) => (
        <ChessPiece3D
          key={p.key}
          piece={p.piece}
          position={p.position}
          isSelected={selectedSquare === p.square}
          onClick={(e) => {
            e.stopPropagation();
            onSquareClick?.(p.square);
          }}
        />
      ))}
      
      {/* Glow beneath board */}
      <pointLight position={[0, -1.2, 0]} intensity={2} color="#bf00ff" distance={10} />
    </>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// LOADING FALLBACK
// ═══════════════════════════════════════════════════════════════════════════════
const LoadingFallback = () => (
  <mesh>
    <octahedronGeometry args={[1, 0]} />
    <meshStandardMaterial color="#bf00ff" emissive="#bf00ff" emissiveIntensity={0.5} wireframe />
  </mesh>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN CHESS 3D MODE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const Chess3DMode = ({ 
  position, 
  playerColor = 'white', 
  onSquareClick, 
  selectedSquare, 
  legalMoves = [],
  lastMove,
  isThinking,
  boardSize = 400 
}) => {
  // Parse FEN position to pieces object
  const pieces = useMemo(() => parseFEN(position), [position]);
  
  return (
    <div 
      style={{ 
        width: boardSize + 100, 
        height: boardSize + 100,
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #030308 0%, #0a0515 30%, #0f0820 60%, #030308 100%)',
        boxShadow: '0 0 60px rgba(191, 0, 255, 0.4), 0 0 100px rgba(191, 0, 255, 0.2), inset 0 0 30px rgba(0,0,0,0.6)',
        border: '2px solid rgba(191, 0, 255, 0.35)',
        position: 'relative'
      }}
      data-testid="chess-3d-mode"
    >
      <Canvas
        shadows={false}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        frameloop="demand"
        performance={{ min: 0.3, max: 1 }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Chess3DScene
            pieces={pieces}
            selectedSquare={selectedSquare}
            legalMoves={legalMoves}
            lastMove={lastMove}
            onSquareClick={onSquareClick}
            playerColor={playerColor}
          />
        </Suspense>
      </Canvas>
      
      {/* Thinking indicator */}
      {isThinking && (
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            zIndex: 10
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid #bf00ff',
              borderTop: '3px solid #ffcc00',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
          <span
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '10px',
              color: '#bf00ff',
              textShadow: '0 0 10px rgba(191, 0, 255, 0.8)',
              letterSpacing: '2px'
            }}
          >
            CALCULATING...
          </span>
        </div>
      )}
      
      {/* Controls hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(200, 150, 255, 0.4)',
          fontFamily: 'Rajdhani, sans-serif',
          fontSize: '9px',
          letterSpacing: '2px',
          textAlign: 'center',
          textTransform: 'uppercase',
          pointerEvents: 'none'
        }}
      >
        Drag to rotate • Scroll to zoom
      </div>
      
      {/* Spin animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Chess3DMode;
