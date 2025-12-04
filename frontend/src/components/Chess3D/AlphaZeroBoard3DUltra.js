import React, { useRef, useMemo, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ==================== LIGHTWEIGHT PIECE COMPONENT ====================
const ChessPiece3D = memo(({ type, color, position, isSelected }) => {
  const meshRef = useRef();
  const isWhite = color === 'white';
  const baseColor = isWhite ? '#e8e0f8' : '#1a0828';
  const emissiveColor = isWhite ? '#6040a0' : '#bf00ff';
  const goldAccent = '#ffcc00';
  
  // Minimal animation - only selected pieces
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.15 + 0.2;
      meshRef.current.rotation.y += 0.015;
    }
  });
  
  // Piece geometry based on type
  const getPieceGeometry = () => {
    switch (type) {
      case 'p': // Pawn
        return (
          <group>
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.22, 0.28, 0.12, 16]} />
              <meshStandardMaterial color={baseColor} metalness={0.8} roughness={0.2} emissive={emissiveColor} emissiveIntensity={0.15} />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.14, 0.2, 0.24, 14]} />
              <meshStandardMaterial color={baseColor} metalness={0.8} roughness={0.2} emissive={emissiveColor} emissiveIntensity={0.15} />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <sphereGeometry args={[0.15, 18, 18]} />
              <meshStandardMaterial color={baseColor} metalness={0.8} roughness={0.2} emissive={emissiveColor} emissiveIntensity={0.15} />
            </mesh>
          </group>
        );
        
      case 'r': // Rook - MONOLITHIC OBELISK, NO TOWER
        return (
          <group>
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.26, 0.32, 0.12, 8]} />
              <meshStandardMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.18, 0.24, 0.5, 8]} />
              <meshStandardMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0, 0.7, 0]}>
              <cylinderGeometry args={[0.2, 0.18, 0.1, 8]} />
              <meshStandardMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0, 0.82, 0]}>
              <octahedronGeometry args={[0.1, 0]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={1.5} metalness={0.95} roughness={0.05} />
            </mesh>
          </group>
        );
        
      case 'n': // Knight
        return (
          <group>
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.24, 0.28, 0.12, 14]} />
              <meshStandardMaterial color={baseColor} metalness={0.8} roughness={0.2} emissive={emissiveColor} emissiveIntensity={0.15} />
            </mesh>
            <mesh position={[0, 0.32, 0]}>
              <cylinderGeometry args={[0.16, 0.22, 0.32, 12]} />
              <meshStandardMaterial color={baseColor} metalness={0.8} roughness={0.2} emissive={emissiveColor} emissiveIntensity={0.15} />
            </mesh>
            <mesh position={[0, 0.55, 0.06]} rotation={[0.35, 0, 0]}>
              <boxGeometry args={[0.22, 0.35, 0.24]} />
              <meshStandardMaterial color={baseColor} metalness={0.8} roughness={0.2} emissive={emissiveColor} emissiveIntensity={0.15} />
            </mesh>
            <mesh position={[0, 0.58, 0.2]}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshStandardMaterial color={isWhite ? '#00ffff' : '#ff0040'} emissive={isWhite ? '#00ffff' : '#ff0040'} emissiveIntensity={2.5} />
            </mesh>
          </group>
        );
        
      case 'b': // Bishop
        return (
          <group>
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.24, 0.28, 0.12, 16]} />
              <meshStandardMaterial color={baseColor} metalness={0.8} roughness={0.2} emissive={emissiveColor} emissiveIntensity={0.15} />
            </mesh>
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.14, 0.22, 0.36, 14]} />
              <meshStandardMaterial color={baseColor} metalness={0.8} roughness={0.2} emissive={emissiveColor} emissiveIntensity={0.15} />
            </mesh>
            <mesh position={[0, 0.6, 0]}>
              <sphereGeometry args={[0.16, 18, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={baseColor} metalness={0.8} roughness={0.2} emissive={emissiveColor} emissiveIntensity={0.15} />
            </mesh>
            <mesh position={[0, 0.82, 0]}>
              <coneGeometry args={[0.06, 0.2, 12]} />
              <meshStandardMaterial color={baseColor} metalness={0.8} roughness={0.2} emissive={emissiveColor} emissiveIntensity={0.15} />
            </mesh>
            <mesh position={[0, 0.95, 0]}>
              <sphereGeometry args={[0.035, 10, 10]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={1.8} />
            </mesh>
          </group>
        );
        
      case 'q': // Queen
        return (
          <group>
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.26, 0.32, 0.12, 18]} />
              <meshStandardMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.16, 0.24, 0.36, 16]} />
              <meshStandardMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.2, 0.16, 0.14, 16]} />
              <meshStandardMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.2} />
            </mesh>
            {/* Crown spires */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <mesh key={i} position={[Math.cos(rad) * 0.12, 0.76, Math.sin(rad) * 0.12]}>
                  <coneGeometry args={[0.03, 0.16, 8]} />
                  <meshStandardMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.2} />
                </mesh>
              );
            })}
            <mesh position={[0, 0.88, 0]}>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={2} metalness={0.95} roughness={0.05} />
            </mesh>
          </group>
        );
        
      case 'k': // King - THE ALPHAZERO SEAL
        return (
          <group>
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.28, 0.34, 0.14, 20]} />
              <meshStandardMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0, 0.36, 0]}>
              <cylinderGeometry args={[0.18, 0.26, 0.38, 18]} />
              <meshStandardMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.2, 0.18, 0.12, 18]} />
              <meshStandardMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.2} />
            </mesh>
            {/* THE ALPHAZERO CROSS */}
            <mesh position={[0, 0.82, 0]}>
              <boxGeometry args={[0.05, 0.32, 0.05]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={2} metalness={0.95} roughness={0.05} />
            </mesh>
            <mesh position={[0, 0.88, 0]}>
              <boxGeometry args={[0.2, 0.05, 0.05]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={2} metalness={0.95} roughness={0.05} />
            </mesh>
            <mesh position={[0, 0.88, 0]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} />
            </mesh>
          </group>
        );
        
      default:
        return (
          <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
        );
    }
  };
  
  return (
    <group ref={meshRef} position={position}>
      {getPieceGeometry()}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.45, 24]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1.5} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
});

// ==================== LIGHTWEIGHT SEAL CIRCLE (STATIC) ====================
const SealCircle = memo(() => {
  const circleRef = useRef();
  
  // Single slow rotation
  useFrame((state) => {
    if (circleRef.current) {
      circleRef.current.rotation.z = state.clock.elapsedTime * 0.03;
    }
  });
  
  return (
    <group ref={circleRef} position={[0, -0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer ring */}
      <mesh>
        <torusGeometry args={[6.5, 0.05, 8, 48]} />
        <meshStandardMaterial color="#bf00ff" emissive="#bf00ff" emissiveIntensity={0.6} transparent opacity={0.7} />
      </mesh>
      
      {/* Inner ring */}
      <mesh>
        <torusGeometry args={[5.2, 0.04, 8, 36]} />
        <meshStandardMaterial color="#ff00bf" emissive="#ff00bf" emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>
      
      {/* 8 Seal markers */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 6.5, Math.sin(angle) * 6.5, 0.05]}>
            <octahedronGeometry args={[0.12, 0]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#ffcc00' : '#bf00ff'} emissive={i % 2 === 0 ? '#ffcc00' : '#bf00ff'} emissiveIntensity={1.2} />
          </mesh>
        );
      })}
      
      {/* Center hexagon */}
      <mesh>
        <ringGeometry args={[0.5, 0.7, 6]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={0.8} transparent opacity={0.6} />
      </mesh>
    </group>
  );
});

// ==================== LIGHTWEIGHT CHAIN BORDER ====================
const ChainBorder = memo(() => {
  // Static chain geometry - no animations
  const chainLinks = useMemo(() => {
    const links = [];
    const size = 5;
    const linkCount = 12; // Per side
    
    // Four sides
    const sides = [
      { start: [-size, -size], end: [size, -size], axis: 'x' },
      { start: [size, -size], end: [size, size], axis: 'z' },
      { start: [size, size], end: [-size, size], axis: 'x' },
      { start: [-size, size], end: [-size, -size], axis: 'z' }
    ];
    
    sides.forEach((side, sideIdx) => {
      for (let i = 0; i < linkCount; i++) {
        const t = i / linkCount;
        const x = side.start[0] + (side.end[0] - side.start[0]) * t;
        const z = side.start[1] + (side.end[1] - side.start[1]) * t;
        links.push({
          position: [x, 0.06, z],
          rotation: side.axis === 'x' ? [0, 0, 0] : [0, Math.PI / 2, 0],
          isSpecial: i % 4 === 0
        });
      }
    });
    
    return links;
  }, []);
  
  return (
    <group>
      {chainLinks.map((link, i) => (
        <group key={i} position={link.position} rotation={link.rotation}>
          <mesh>
            <torusGeometry args={[0.06, 0.02, 6, 12]} />
            <meshStandardMaterial color="#2a1850" emissive={link.isSpecial ? '#ffcc00' : '#bf00ff'} emissiveIntensity={link.isSpecial ? 0.8 : 0.4} metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
});

// ==================== BOARD SQUARE ====================
const BoardSquare = memo(({ position, isLight, isHighlighted, isValidMove, isLastMove, onClick }) => {
  const color = useMemo(() => {
    if (isHighlighted) return '#bf00ff';
    if (isValidMove) return '#00ff88';
    if (isLastMove) return '#ffcc00';
    if (isLight) return '#3a3060';
    return '#160c28';
  }, [isLight, isHighlighted, isValidMove, isLastMove]);
  
  return (
    <group position={position}>
      <mesh receiveShadow onClick={onClick}>
        <boxGeometry args={[1.02, 0.16, 1.02]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.65}
          roughness={0.3}
          emissive={isHighlighted || isValidMove || isLastMove ? color : '#180a32'}
          emissiveIntensity={isHighlighted || isValidMove || isLastMove ? 0.5 : 0.08}
        />
      </mesh>
      {isValidMove && (
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1} transparent opacity={0.85} />
        </mesh>
      )}
    </group>
  );
});

// ==================== CORNER ANCHORS ====================
const CornerAnchors = memo(() => {
  const corners = [[-5, -5], [-5, 5], [5, -5], [5, 5]];
  
  return (
    <group>
      {corners.map(([x, z], i) => (
        <group key={i} position={[x, 0.15, z]}>
          <mesh>
            <octahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial color="#bf00ff" emissive="#bf00ff" emissiveIntensity={1} metalness={0.9} roughness={0.15} />
          </mesh>
          <pointLight color="#bf00ff" intensity={1} distance={4} />
        </group>
      ))}
    </group>
  );
});

// ==================== MAIN SCENE ====================
const AlphaZeroBoard3DUltra = memo(({
  pieces,
  selectedSquare,
  validMoves = [],
  lastMove,
  onSquareClick,
  playerColor
}) => {
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
        const file = square.charCodeAt(0) - 97;
        const rank = parseInt(square[1]) - 1;
        const offset = 3.5;
        elements.push({
          key: square,
          type: piece.type,
          color: piece.color === 'w' ? 'white' : 'black',
          position: [(file - offset) * 1.12, 0.55, (offset - rank) * 1.12],
          square
        });
      }
    });
    
    return elements;
  }, [pieces]);
  
  return (
    <group rotation={playerColor === 'black' ? [0, Math.PI, 0] : [0, 0, 0]}>
      {/* SEAL CIRCLE beneath board */}
      <SealCircle />
      
      {/* Corner anchors */}
      <CornerAnchors />
      
      {/* Board base */}
      <mesh position={[0, -0.18, 0]} receiveShadow>
        <boxGeometry args={[10.2, 0.3, 10.2]} />
        <meshPhysicalMaterial color="#060310" metalness={0.85} roughness={0.2} emissive="#180035" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Glowing edge */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[10.5, 0.08, 10.5]} />
        <meshStandardMaterial color="#bf00ff" emissive="#bf00ff" emissiveIntensity={0.6} transparent opacity={0.7} />
      </mesh>
      
      {/* Chain border */}
      <ChainBorder />
      
      {/* Board squares */}
      {squares.map((sq) => (
        <BoardSquare
          key={sq.key}
          position={sq.position}
          isLight={sq.isLight}
          isHighlighted={selectedSquare === sq.square}
          isValidMove={validMoves?.includes(sq.square)}
          isLastMove={lastMove && (lastMove.from === sq.square || lastMove.to === sq.square)}
          onClick={(e) => {
            e.stopPropagation();
            onSquareClick?.(sq.square);
          }}
        />
      ))}
      
      {/* Chess pieces */}
      {pieceElements.map((piece) => (
        <ChessPiece3D
          key={piece.key}
          type={piece.type}
          color={piece.color}
          position={piece.position}
          isSelected={selectedSquare === piece.square}
        />
      ))}
      
      {/* Glow beneath board */}
      <pointLight position={[0, -1.5, 0]} intensity={2.5} color="#bf00ff" distance={12} />
    </group>
  );
});

export default AlphaZeroBoard3DUltra;
