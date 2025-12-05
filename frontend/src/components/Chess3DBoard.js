import React, { useState, useRef, useCallback, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Environment } from '@react-three/drei';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════
// 3D CHESS PIECE COMPONENTS - Sophisticated geometric designs
// ═══════════════════════════════════════════════════════════════════════

// Piece color materials
const PIECE_MATERIALS = {
  white: {
    base: '#f0e6d3',
    accent: '#ffffff',
    glow: '#00ffff',
  },
  black: {
    base: '#1a1a2e',
    accent: '#2d2d44',
    glow: '#bf00ff',
  }
};

// Sophisticated piece designs using geometric primitives
const PawnMesh = ({ color, isHovered, isSelected }) => {
  const colors = PIECE_MATERIALS[color];
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current && (isHovered || isSelected)) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.02 + 0.35;
    }
  });

  return (
    <group ref={ref} position={[0, 0.35, 0]}>
      {/* Base */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.15, 32]} />
        <meshStandardMaterial color={colors.base} metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 0.25, 32]} />
        <meshStandardMaterial color={colors.base} metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color={colors.accent} metalness={0.5} roughness={0.2} />
      </mesh>
      {/* Glow ring when selected/hovered */}
      {(isHovered || isSelected) && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.32, 0.38, 32]} />
          <meshBasicMaterial color={isSelected ? '#ffcc00' : colors.glow} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
};

const RookMesh = ({ color, isHovered, isSelected }) => {
  const colors = PIECE_MATERIALS[color];
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current && (isHovered || isSelected)) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.02 + 0.45;
    }
  });

  return (
    <group ref={ref} position={[0, 0.45, 0]}>
      {/* Base */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.32, 0.18, 32]} />
        <meshStandardMaterial color={colors.base} metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Tower body */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, 0.5, 32]} />
        <meshStandardMaterial color={colors.base} metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Crown top */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.2, 0.12, 32]} />
        <meshStandardMaterial color={colors.accent} metalness={0.5} roughness={0.2} />
      </mesh>
      {/* Battlements - simplified */}
      {[0, 1, 2, 3].map((i) => (
        <mesh 
          key={i} 
          position={[
            Math.cos(i * Math.PI / 2) * 0.18, 
            0.78, 
            Math.sin(i * Math.PI / 2) * 0.18
          ]} 
          castShadow
        >
          <boxGeometry args={[0.1, 0.12, 0.1]} />
          <meshStandardMaterial color={colors.accent} metalness={0.5} roughness={0.2} />
        </mesh>
      ))}
      {(isHovered || isSelected) && (
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.42, 32]} />
          <meshBasicMaterial color={isSelected ? '#ffcc00' : colors.glow} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
};

const KnightMesh = ({ color, isHovered, isSelected }) => {
  const colors = PIECE_MATERIALS[color];
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current && (isHovered || isSelected)) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.02 + 0.45;
    }
  });

  return (
    <group ref={ref} position={[0, 0.45, 0]}>
      {/* Base */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.15, 32]} />
        <meshStandardMaterial color={colors.base} metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.25, 0]} rotation={[0.2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.2, 0.35, 32]} />
        <meshStandardMaterial color={colors.base} metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Head - abstracted horse */}
      <mesh position={[0, 0.48, 0.08]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.18, 0.35, 0.25]} />
        <meshStandardMaterial color={colors.accent} metalness={0.5} roughness={0.2} />
      </mesh>
      {/* Mane */}
      <mesh position={[0, 0.55, -0.05]} rotation={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.08, 0.2, 0.15]} />
        <meshStandardMaterial color={colors.base} metalness={0.4} roughness={0.3} />
      </mesh>
      {(isHovered || isSelected) && (
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.32, 0.38, 32]} />
          <meshBasicMaterial color={isSelected ? '#ffcc00' : colors.glow} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
};

const BishopMesh = ({ color, isHovered, isSelected }) => {
  const colors = PIECE_MATERIALS[color];
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current && (isHovered || isSelected)) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.02 + 0.5;
    }
  });

  return (
    <group ref={ref} position={[0, 0.5, 0]}>
      {/* Base */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.15, 32]} />
        <meshStandardMaterial color={colors.base} metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Body - tapered */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.2, 0.5, 32]} />
        <meshStandardMaterial color={colors.base} metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Mitre head */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <sphereGeometry args={[0.12, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color={colors.accent} metalness={0.5} roughness={0.2} />
      </mesh>
      {/* Top sphere */}
      <mesh position={[0, 0.78, 0]} castShadow>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={colors.accent} metalness={0.6} roughness={0.1} />
      </mesh>
      {(isHovered || isSelected) && (
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.32, 0.38, 32]} />
          <meshBasicMaterial color={isSelected ? '#ffcc00' : colors.glow} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
};

const QueenMesh = ({ color, isHovered, isSelected }) => {
  const colors = PIECE_MATERIALS[color];
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current && (isHovered || isSelected)) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.02 + 0.55;
    }
  });

  return (
    <group ref={ref} position={[0, 0.55, 0]}>
      {/* Base */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.32, 0.18, 32]} />
        <meshStandardMaterial color={colors.base} metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.22, 0.5, 32]} />
        <meshStandardMaterial color={colors.base} metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Crown base */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.12, 0.1, 32]} />
        <meshStandardMaterial color={colors.accent} metalness={0.5} roughness={0.2} />
      </mesh>
      {/* Crown points */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh 
          key={i} 
          position={[
            Math.cos(i * Math.PI / 3) * 0.12, 
            0.78, 
            Math.sin(i * Math.PI / 3) * 0.12
          ]} 
          castShadow
        >
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color={colors.accent} metalness={0.6} roughness={0.1} />
        </mesh>
      ))}
      {/* Center jewel */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={color === 'white' ? '#00ffff' : '#bf00ff'} emissive={color === 'white' ? '#00ffff' : '#bf00ff'} emissiveIntensity={0.5} metalness={0.8} roughness={0.1} />
      </mesh>
      {(isHovered || isSelected) && (
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.42, 32]} />
          <meshBasicMaterial color={isSelected ? '#ffcc00' : colors.glow} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
};

const KingMesh = ({ color, isHovered, isSelected }) => {
  const colors = PIECE_MATERIALS[color];
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current && (isHovered || isSelected)) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.02 + 0.6;
    }
  });

  return (
    <group ref={ref} position={[0, 0.6, 0]}>
      {/* Base */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.32, 0.18, 32]} />
        <meshStandardMaterial color={colors.base} metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.22, 0.6, 32]} />
        <meshStandardMaterial color={colors.base} metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Crown collar */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.1, 0.08, 32]} />
        <meshStandardMaterial color={colors.accent} metalness={0.5} roughness={0.2} />
      </mesh>
      {/* Cross vertical */}
      <mesh position={[0, 0.92, 0]} castShadow>
        <boxGeometry args={[0.06, 0.25, 0.06]} />
        <meshStandardMaterial color={colors.accent} metalness={0.6} roughness={0.1} />
      </mesh>
      {/* Cross horizontal */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[0.18, 0.06, 0.06]} />
        <meshStandardMaterial color={colors.accent} metalness={0.6} roughness={0.1} />
      </mesh>
      {(isHovered || isSelected) && (
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.42, 32]} />
          <meshBasicMaterial color={isSelected ? '#ffcc00' : colors.glow} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
};

// Piece component selector
const ChessPiece3D = ({ piece, color, position, isHovered, isSelected, onClick }) => {
  const pieceComponents = {
    p: PawnMesh,
    r: RookMesh,
    n: KnightMesh,
    b: BishopMesh,
    q: QueenMesh,
    k: KingMesh,
  };

  const PieceComponent = pieceComponents[piece.toLowerCase()];
  if (!PieceComponent) return null;

  // Rotate black pieces to face the player
  const rotation = color === 'black' ? [0, Math.PI, 0] : [0, 0, 0];

  return (
    <group 
      position={position} 
      rotation={rotation}
      onClick={onClick}
      onPointerOver={(e) => { e.stopPropagation(); }}
      onPointerOut={(e) => { e.stopPropagation(); }}
    >
      <PieceComponent color={color} isHovered={isHovered} isSelected={isSelected} />
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// 3D CHESSBOARD
// ═══════════════════════════════════════════════════════════════════════

const ChessSquare = ({ position, isLight, isHighlighted, isValidMove, onClick, children }) => {
  const [hovered, setHovered] = useState(false);
  
  const baseColor = isLight ? '#c4b998' : '#6d5c47';
  const hoveredColor = isLight ? '#d4c9a8' : '#7d6c57';
  const highlightColor = 'rgba(255, 255, 0, 0.4)';
  const validMoveColor = 'rgba(0, 255, 136, 0.5)';
  
  let squareColor = hovered ? hoveredColor : baseColor;
  
  return (
    <group position={position}>
      {/* Main square */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        onClick={onClick}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        receiveShadow
      >
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial 
          color={squareColor} 
          metalness={0.1} 
          roughness={0.8}
        />
      </mesh>
      
      {/* Highlight overlay */}
      {isHighlighted && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#ffff00" transparent opacity={0.4} />
        </mesh>
      )}
      
      {/* Valid move indicator */}
      {isValidMove && (
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 32]} />
          <meshBasicMaterial color="#00ff88" transparent opacity={0.7} />
        </mesh>
      )}
      
      {children}
    </group>
  );
};

const BoardFrame = () => {
  return (
    <group>
      {/* Frame base */}
      <mesh position={[3.5, -0.15, 3.5]} receiveShadow>
        <boxGeometry args={[9.2, 0.2, 9.2]} />
        <meshStandardMaterial color="#2a1a0a" metalness={0.3} roughness={0.7} />
      </mesh>
      
      {/* Frame edge - raised border */}
      {[
        { pos: [-0.6, 0, 3.5], size: [0.3, 0.15, 8.4] },
        { pos: [7.6, 0, 3.5], size: [0.3, 0.15, 8.4] },
        { pos: [3.5, 0, -0.6], size: [9, 0.15, 0.3] },
        { pos: [3.5, 0, 7.6], size: [9, 0.15, 0.3] },
      ].map((edge, i) => (
        <mesh key={i} position={edge.pos} castShadow receiveShadow>
          <boxGeometry args={edge.size} />
          <meshStandardMaterial color="#1a0a00" metalness={0.4} roughness={0.6} />
        </mesh>
      ))}
      
      {/* Corner accents */}
      {[
        [-0.6, -0.6],
        [7.6, -0.6],
        [-0.6, 7.6],
        [7.6, 7.6],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.05, z]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.25, 16]} />
          <meshStandardMaterial color="#3a2a1a" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
};

// File and rank labels
const BoardLabels = ({ playerColor }) => {
  const files = playerColor === 'white' ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
  const ranks = playerColor === 'white' ? ['1', '2', '3', '4', '5', '6', '7', '8'] : ['8', '7', '6', '5', '4', '3', '2', '1'];
  
  return (
    <group>
      {/* File labels (bottom) */}
      {files.map((file, i) => (
        <Text
          key={`file-${file}`}
          position={[i + 0.5, 0.01, 8.2]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.3}
          color="#8a7a6a"
          anchorX="center"
          anchorY="middle"
        >
          {file}
        </Text>
      ))}
      {/* Rank labels (left side) */}
      {ranks.map((rank, i) => (
        <Text
          key={`rank-${rank}`}
          position={[-0.8, 0.01, i + 0.5]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.3}
          color="#8a7a6a"
          anchorX="center"
          anchorY="middle"
        >
          {rank}
        </Text>
      ))}
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// MAIN 3D BOARD SCENE
// ═══════════════════════════════════════════════════════════════════════

const ChessScene = ({ 
  position, 
  playerColor, 
  lastMove, 
  selectedSquare, 
  validMoves, 
  onSquareClick,
  onPieceClick 
}) => {
  const { camera } = useThree();
  
  // Parse FEN position to get piece positions
  const parseFen = useCallback((fen) => {
    const pieces = [];
    const fenBoard = fen.split(' ')[0];
    const rows = fenBoard.split('/');
    
    rows.forEach((row, rowIndex) => {
      let colIndex = 0;
      for (const char of row) {
        if (char >= '1' && char <= '8') {
          colIndex += parseInt(char);
        } else {
          const color = char === char.toUpperCase() ? 'white' : 'black';
          const pieceType = char.toLowerCase();
          const file = String.fromCharCode(97 + colIndex);
          const rank = 8 - rowIndex;
          pieces.push({
            type: pieceType,
            color,
            square: `${file}${rank}`,
            position: [colIndex, rowIndex]
          });
          colIndex++;
        }
      }
    });
    
    return pieces;
  }, []);

  const pieces = useMemo(() => parseFen(position), [position, parseFen]);

  // Convert square notation to board coordinates
  const squareToCoords = useCallback((square, forPlayerColor) => {
    const file = square.charCodeAt(0) - 97;
    const rank = parseInt(square[1]) - 1;
    
    if (forPlayerColor === 'white') {
      return [file, 7 - rank];
    } else {
      return [7 - file, rank];
    }
  }, []);

  // Convert board coordinates to square notation
  const coordsToSquare = useCallback((col, row, forPlayerColor) => {
    let file, rank;
    if (forPlayerColor === 'white') {
      file = String.fromCharCode(97 + col);
      rank = 8 - row;
    } else {
      file = String.fromCharCode(97 + (7 - col));
      rank = row + 1;
    }
    return `${file}${rank}`;
  }, []);

  // Determine highlighted squares from last move
  const highlightedSquares = useMemo(() => {
    if (!lastMove) return new Set();
    return new Set([lastMove.from, lastMove.to]);
  }, [lastMove]);

  // Valid move squares
  const validMoveSquares = useMemo(() => new Set(validMoves || []), [validMoves]);

  return (
    <>
      {/* Lighting setup - sophisticated ambient */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-5, 8, -5]} intensity={0.5} color="#bf00ff" />
      <pointLight position={[10, 8, 10]} intensity={0.3} color="#00ffff" />
      
      {/* Board frame */}
      <BoardFrame />
      
      {/* Board labels */}
      <BoardLabels playerColor={playerColor} />
      
      {/* Chess squares */}
      {Array.from({ length: 8 }, (_, row) => 
        Array.from({ length: 8 }, (_, col) => {
          const square = coordsToSquare(col, row, playerColor);
          const isLight = (col + row) % 2 === 0;
          const isHighlighted = highlightedSquares.has(square);
          const isValidMove = validMoveSquares.has(square);
          const isSelected = selectedSquare === square;
          
          return (
            <ChessSquare
              key={`${col}-${row}`}
              position={[col + 0.5, 0, row + 0.5]}
              isLight={isLight}
              isHighlighted={isHighlighted || isSelected}
              isValidMove={isValidMove}
              onClick={(e) => {
                e.stopPropagation();
                onSquareClick(square);
              }}
            />
          );
        })
      )}
      
      {/* Chess pieces */}
      {pieces.map((piece) => {
        const [col, row] = squareToCoords(piece.square, playerColor);
        const isHovered = false;
        const isSelected = selectedSquare === piece.square;
        
        return (
          <ChessPiece3D
            key={`${piece.square}-${piece.type}-${piece.color}`}
            piece={piece.type}
            color={piece.color}
            position={[col + 0.5, 0, row + 0.5]}
            isHovered={isHovered}
            isSelected={isSelected}
            onClick={(e) => {
              e.stopPropagation();
              onPieceClick(piece.square);
            }}
          />
        );
      })}
      
      {/* Reflective floor plane - very subtle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.5, -0.25, 3.5]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#0a0a15" 
          metalness={0.9} 
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Camera controls */}
      <OrbitControls 
        enablePan={false}
        minDistance={6}
        maxDistance={18}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        target={[3.5, 0, 3.5]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// MAIN EXPORT COMPONENT
// ═══════════════════════════════════════════════════════════════════════

const Chess3DBoard = ({ 
  position, 
  playerColor = 'white', 
  boardSize = 400,
  lastMove,
  onMove,
  canMove,
  game // chess.js instance
}) => {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  
  // Calculate valid moves for a piece
  const calculateValidMoves = useCallback((square) => {
    if (!game) return [];
    
    try {
      const moves = game.moves({ square, verbose: true });
      return moves.map(m => m.to);
    } catch {
      return [];
    }
  }, [game]);
  
  // Handle square/piece click
  const handleSquareClick = useCallback((square) => {
    if (!canMove) return;
    
    // If we have a selected piece and click on a valid move square
    if (selectedSquare && validMoves.includes(square)) {
      // Make the move
      const moveResult = onMove({
        sourceSquare: selectedSquare,
        targetSquare: square,
        piece: null
      });
      
      if (moveResult !== false) {
        setSelectedSquare(null);
        setValidMoves([]);
      }
      return;
    }
    
    // Check if there's a piece on this square that belongs to the player
    const piece = game?.get(square);
    const playerPieceColor = playerColor === 'white' ? 'w' : 'b';
    
    if (piece && piece.color === playerPieceColor) {
      // Select this piece
      setSelectedSquare(square);
      setValidMoves(calculateValidMoves(square));
    } else {
      // Deselect
      setSelectedSquare(null);
      setValidMoves([]);
    }
  }, [selectedSquare, validMoves, canMove, onMove, game, playerColor, calculateValidMoves]);
  
  const handlePieceClick = useCallback((square) => {
    handleSquareClick(square);
  }, [handleSquareClick]);

  // Calculate camera position based on player color
  const cameraPosition = playerColor === 'white' 
    ? [3.5, 8, 12] 
    : [3.5, 8, -5];

  return (
    <div 
      style={{ 
        width: boardSize, 
        height: boardSize, 
        borderRadius: '8px',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #0a0a15 0%, #1a1a2e 100%)',
        boxShadow: '0 0 40px rgba(191, 0, 255, 0.3), inset 0 0 60px rgba(0, 0, 0, 0.5)'
      }}
      data-testid="chess-3d-board"
    >
      <Canvas shadows>
        <PerspectiveCamera 
          makeDefault 
          position={cameraPosition} 
          fov={45}
        />
        <Suspense fallback={null}>
          <ChessScene
            position={position}
            playerColor={playerColor}
            lastMove={lastMove}
            selectedSquare={selectedSquare}
            validMoves={validMoves}
            onSquareClick={handleSquareClick}
            onPieceClick={handlePieceClick}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Chess3DBoard;
