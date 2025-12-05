/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Text, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO 3D CHESS BOARD - Sophisticated Neural Network Aesthetic
// A premium 3D chess experience exclusively for the Hidden Master
// ═══════════════════════════════════════════════════════════════════════

// Chess piece 3D geometries - Sleek, minimalist design
const PIECE_SCALE = 0.35;
const BOARD_SIZE = 8;
const SQUARE_SIZE = 1;

// Parse FEN to get piece positions
const parseFEN = (fen) => {
  const pieces = [];
  const [position] = fen.split(' ');
  const rows = position.split('/');
  
  rows.forEach((row, rowIndex) => {
    let colIndex = 0;
    for (const char of row) {
      if (/\d/.test(char)) {
        colIndex += parseInt(char);
      } else {
        const isWhite = char === char.toUpperCase();
        const pieceType = char.toLowerCase();
        pieces.push({
          type: pieceType,
          color: isWhite ? 'white' : 'black',
          position: [colIndex, 7 - rowIndex],
          key: `${pieceType}-${colIndex}-${7 - rowIndex}`
        });
        colIndex++;
      }
    }
  });
  
  return pieces;
};

// Convert board position to 3D coordinates
const boardTo3D = (col, row) => {
  return [
    (col - 3.5) * SQUARE_SIZE,
    0,
    (row - 3.5) * SQUARE_SIZE
  ];
};

// Elegant Chess Piece Component
const ChessPiece = ({ type, color, position, isSelected, onClick, lastMoveSquare }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [col, row] = position;
  const pos3D = boardTo3D(col, row);
  const isLastMove = lastMoveSquare && lastMoveSquare[0] === col && lastMoveSquare[1] === row;
  
  // Smooth floating animation
  useFrame((state) => {
    if (meshRef.current) {
      const baseY = 0.3;
      const floatHeight = hovered ? 0.15 : (isSelected ? 0.2 : 0.05);
      meshRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 2 + col + row) * floatHeight;
      
      if (hovered || isSelected) {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.1;
      }
    }
  });
  
  // Piece geometry based on type
  const geometry = useMemo(() => {
    switch (type) {
      case 'k': // King
        return (
          <group scale={PIECE_SCALE}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.5, 0.7, 0.3, 32]} />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.35, 0.45, 0.7, 32]} />
            </mesh>
            <mesh position={[0, 1.1, 0]}>
              <sphereGeometry args={[0.25, 32, 32]} />
            </mesh>
            {/* Crown cross */}
            <mesh position={[0, 1.5, 0]}>
              <boxGeometry args={[0.08, 0.4, 0.08]} />
            </mesh>
            <mesh position={[0, 1.6, 0]}>
              <boxGeometry args={[0.25, 0.08, 0.08]} />
            </mesh>
          </group>
        );
      case 'q': // Queen
        return (
          <group scale={PIECE_SCALE}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.5, 0.65, 0.3, 32]} />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.3, 0.45, 0.7, 32]} />
            </mesh>
            <mesh position={[0, 1.0, 0]}>
              <torusGeometry args={[0.25, 0.08, 16, 32]} />
            </mesh>
            <mesh position={[0, 1.3, 0]}>
              <sphereGeometry args={[0.18, 32, 32]} />
            </mesh>
          </group>
        );
      case 'r': // Rook
        return (
          <group scale={PIECE_SCALE}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.45, 0.55, 0.3, 32]} />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.35, 0.4, 0.7, 32]} />
            </mesh>
            <mesh position={[0, 0.95, 0]}>
              <cylinderGeometry args={[0.4, 0.35, 0.2, 32]} />
            </mesh>
            {/* Battlements */}
            {[0, 90, 180, 270].map((angle) => (
              <mesh key={angle} position={[Math.cos(angle * Math.PI / 180) * 0.25, 1.15, Math.sin(angle * Math.PI / 180) * 0.25]}>
                <boxGeometry args={[0.15, 0.2, 0.15]} />
              </mesh>
            ))}
          </group>
        );
      case 'b': // Bishop
        return (
          <group scale={PIECE_SCALE}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.4, 0.5, 0.3, 32]} />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.25, 0.35, 0.6, 32]} />
            </mesh>
            <mesh position={[0, 1.0, 0]}>
              <sphereGeometry args={[0.28, 32, 32]} />
            </mesh>
            <mesh position={[0, 1.35, 0]}>
              <sphereGeometry args={[0.1, 32, 32]} />
            </mesh>
          </group>
        );
      case 'n': // Knight
        return (
          <group scale={PIECE_SCALE}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.4, 0.5, 0.3, 32]} />
            </mesh>
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.25, 0.35, 0.4, 32]} />
            </mesh>
            {/* Horse head shape */}
            <mesh position={[0, 0.9, 0.1]} rotation={[-0.3, 0, 0]}>
              <boxGeometry args={[0.25, 0.5, 0.4]} />
            </mesh>
            <mesh position={[0, 1.2, 0.25]} rotation={[-0.5, 0, 0]}>
              <boxGeometry args={[0.2, 0.3, 0.25]} />
            </mesh>
            {/* Ear */}
            <mesh position={[0, 1.35, -0.05]} rotation={[0.3, 0, 0]}>
              <coneGeometry args={[0.08, 0.2, 8]} />
            </mesh>
          </group>
        );
      case 'p': // Pawn
      default:
        return (
          <group scale={PIECE_SCALE}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.35, 0.4, 0.2, 32]} />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.2, 0.3, 0.4, 32]} />
            </mesh>
            <mesh position={[0, 0.65, 0]}>
              <sphereGeometry args={[0.22, 32, 32]} />
            </mesh>
          </group>
        );
    }
  }, [type]);
  
  // Material colors
  const primaryColor = color === 'white' ? '#e8e4e0' : '#1a1520';
  const emissiveColor = color === 'white' ? '#bf00ff' : '#ff00bf';
  const emissiveIntensity = hovered ? 0.6 : (isSelected ? 0.8 : (isLastMove ? 0.3 : 0.1));
  
  return (
    <group
      ref={meshRef}
      position={[pos3D[0], pos3D[1] + 0.3, pos3D[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick(col, row);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      <group>
        {React.cloneElement(geometry, {
          children: React.Children.map(geometry.props.children, (child) => {
            if (child && child.type === 'mesh') {
              return React.cloneElement(child, {
                children: [
                  child.props.children,
                  <meshStandardMaterial
                    key="material"
                    color={primaryColor}
                    metalness={0.7}
                    roughness={0.2}
                    emissive={emissiveColor}
                    emissiveIntensity={emissiveIntensity}
                  />
                ]
              });
            }
            return child;
          })
        })}
      </group>
      
      {/* Selection/Hover glow ring */}
      {(hovered || isSelected || isLastMove) && (
        <mesh position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.45, 32]} />
          <meshBasicMaterial 
            color={isSelected ? '#ffcc00' : (isLastMove ? '#00ff88' : emissiveColor)} 
            transparent 
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
};

// Render all pieces from a specific array
const PieceRenderer = ({ pieces, selectedSquare, onSquareClick, lastMove }) => {
  return pieces.map((piece) => (
    <ChessPiece
      key={piece.key}
      type={piece.type}
      color={piece.color}
      position={piece.position}
      isSelected={selectedSquare && selectedSquare[0] === piece.position[0] && selectedSquare[1] === piece.position[1]}
      onClick={onSquareClick}
      lastMoveSquare={lastMove ? (lastMove.to ? [lastMove.to.charCodeAt(0) - 97, parseInt(lastMove.to[1]) - 1] : null) : null}
    />
  ));
};

// Chess Board Squares
const BoardSquare = ({ col, row, isHighlighted, isValidMove, isSelected, onClick, isLastMoveFrom, isLastMoveTo }) => {
  const isLight = (col + row) % 2 === 1;
  const pos = boardTo3D(col, row);
  const [hovered, setHovered] = useState(false);
  
  // Colors - AlphaZero neural purple theme
  const lightColor = '#2d2438';
  const darkColor = '#1a1525';
  const highlightColor = '#bf00ff';
  const validMoveColor = '#00ff88';
  const lastMoveColor = '#ffcc00';
  
  let squareColor = isLight ? lightColor : darkColor;
  let emissive = '#000000';
  let emissiveIntensity = 0;
  
  if (isLastMoveFrom || isLastMoveTo) {
    emissive = lastMoveColor;
    emissiveIntensity = 0.15;
  }
  if (isHighlighted || isSelected) {
    emissive = highlightColor;
    emissiveIntensity = 0.3;
  }
  if (isValidMove) {
    emissive = validMoveColor;
    emissiveIntensity = 0.2;
  }
  if (hovered) {
    emissiveIntensity += 0.15;
  }
  
  return (
    <group position={pos}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick && onClick(col, row);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[SQUARE_SIZE * 0.98, SQUARE_SIZE * 0.98]} />
        <meshStandardMaterial
          color={squareColor}
          metalness={0.3}
          roughness={0.7}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      
      {/* Valid move indicator */}
      {isValidMove && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.15, 32]} />
          <meshBasicMaterial color={validMoveColor} transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
};

// The complete chess board
const ChessBoard = ({ selectedSquare, validMoves, onSquareClick, lastMove }) => {
  const squares = [];
  
  // Parse last move for highlighting
  let lastMoveFrom = null;
  let lastMoveTo = null;
  if (lastMove) {
    if (lastMove.from) {
      lastMoveFrom = [lastMove.from.charCodeAt(0) - 97, parseInt(lastMove.from[1]) - 1];
    }
    if (lastMove.to) {
      lastMoveTo = [lastMove.to.charCodeAt(0) - 97, parseInt(lastMove.to[1]) - 1];
    }
  }
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const squareKey = `${String.fromCharCode(97 + col)}${row + 1}`;
      const isValidMove = validMoves && validMoves.includes(squareKey);
      const isSelected = selectedSquare && selectedSquare[0] === col && selectedSquare[1] === row;
      const isLastMoveFrom = lastMoveFrom && lastMoveFrom[0] === col && lastMoveFrom[1] === row;
      const isLastMoveTo = lastMoveTo && lastMoveTo[0] === col && lastMoveTo[1] === row;
      
      squares.push(
        <BoardSquare
          key={`${col}-${row}`}
          col={col}
          row={row}
          isValidMove={isValidMove}
          isSelected={isSelected}
          onClick={onSquareClick}
          isLastMoveFrom={isLastMoveFrom}
          isLastMoveTo={isLastMoveTo}
        />
      );
    }
  }
  
  return (
    <group>
      {/* Board base */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[9, 0.3, 9]} />
        <meshStandardMaterial
          color="#0d0a12"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Board frame with neural glow */}
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry args={[8.4, 0.04, 8.4]} />
        <meshStandardMaterial
          color="#1a1525"
          metalness={0.5}
          roughness={0.5}
          emissive="#bf00ff"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Squares */}
      {squares}
      
      {/* Coordinate labels */}
      {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((letter, i) => (
        <Text
          key={`file-${letter}`}
          position={[(i - 3.5), 0.01, 4.3]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.25}
          color="#bf00ff"
          anchorX="center"
          anchorY="middle"
        >
          {letter}
        </Text>
      ))}
      {[1, 2, 3, 4, 5, 6, 7, 8].map((num, i) => (
        <Text
          key={`rank-${num}`}
          position={[-4.3, 0.01, (i - 3.5)]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.25}
          color="#bf00ff"
          anchorX="center"
          anchorY="middle"
        >
          {num}
        </Text>
      ))}
    </group>
  );
};

// Neural energy particles floating around the board
const NeuralParticles = () => {
  const particlesRef = useRef();
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });
  
  return (
    <group ref={particlesRef}>
      <Sparkles
        count={100}
        scale={12}
        size={1.5}
        speed={0.3}
        color="#bf00ff"
        opacity={0.4}
      />
      <Sparkles
        count={50}
        scale={10}
        size={2}
        speed={0.2}
        color="#ffcc00"
        opacity={0.3}
      />
    </group>
  );
};

// AlphaZero neural seal in the center (subtle)
const NeuralSeal = () => {
  const sealRef = useRef();
  
  useFrame((state) => {
    if (sealRef.current) {
      sealRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });
  
  return (
    <group ref={sealRef} position={[0, -0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer ring */}
      <mesh>
        <ringGeometry args={[4.5, 4.6, 64]} />
        <meshBasicMaterial color="#bf00ff" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Inner neural pattern rings */}
      {[3.8, 3.0, 2.2].map((radius, i) => (
        <mesh key={i}>
          <ringGeometry args={[radius, radius + 0.05, 64]} />
          <meshBasicMaterial 
            color={i % 2 === 0 ? '#bf00ff' : '#ffcc00'} 
            transparent 
            opacity={0.15 - i * 0.03} 
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {/* Neural nodes */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 4.2;
        return (
          <mesh key={`node-${i}`} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0.01]}>
            <circleGeometry args={[0.08, 16]} />
            <meshBasicMaterial color="#bf00ff" transparent opacity={0.5} />
          </mesh>
        );
      })}
    </group>
  );
};

// Camera setup with auto-rotation
const CameraController = ({ playerColor }) => {
  const { camera } = useThree();
  const controlsRef = useRef();
  
  useEffect(() => {
    // Set camera position based on player color
    const zPosition = playerColor === 'white' ? 12 : -12;
    camera.position.set(0, 10, zPosition);
    camera.lookAt(0, 0, 0);
  }, [camera, playerColor]);
  
  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={8}
      maxDistance={18}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.5}
      enableDamping
      dampingFactor={0.05}
    />
  );
};

// Main scene component
const Scene = ({ 
  position, 
  playerColor, 
  selectedSquare, 
  validMoves, 
  onSquareClick, 
  lastMove,
  isThinking 
}) => {
  const pieces = useMemo(() => parseFEN(position), [position]);
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 10, 0]} intensity={1} color="#ffffff" />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#bf00ff" />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ff00bf" />
      <spotLight
        position={[0, 15, 0]}
        angle={0.5}
        penumbra={0.5}
        intensity={0.8}
        castShadow
      />
      
      {/* Camera controls */}
      <CameraController playerColor={playerColor} />
      
      {/* Neural seal under the board */}
      <NeuralSeal />
      
      {/* Chess board */}
      <ChessBoard
        selectedSquare={selectedSquare}
        validMoves={validMoves}
        onSquareClick={onSquareClick}
        lastMove={lastMove}
      />
      
      {/* Chess pieces */}
      <PieceRenderer
        pieces={pieces}
        selectedSquare={selectedSquare}
        onSquareClick={onSquareClick}
        lastMove={lastMove}
      />
      
      {/* Floating particles */}
      <NeuralParticles />
      
      {/* Thinking indicator */}
      {isThinking && (
        <Float speed={5} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[0, 3, 0]}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial
              color="#bf00ff"
              emissive="#bf00ff"
              emissiveIntensity={2}
              transparent
              opacity={0.8}
            />
          </mesh>
        </Float>
      )}
    </>
  );
};

// Loading fallback
const LoadingFallback = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="#bf00ff" />
  </mesh>
);

// Main exported component
const Chess3DBoard = ({
  position = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  playerColor = 'white',
  onMove,
  validMovesForSquare,
  isThinking = false,
  lastMove = null,
  gameRef
}) => {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  
  // Handle square click
  const handleSquareClick = useCallback((col, row) => {
    const squareKey = `${String.fromCharCode(97 + col)}${row + 1}`;
    
    if (selectedSquare) {
      // Try to make a move
      const fromSquare = `${String.fromCharCode(97 + selectedSquare[0])}${selectedSquare[1] + 1}`;
      
      if (validMoves.includes(squareKey)) {
        // Valid move - execute it
        onMove && onMove(fromSquare, squareKey);
        setSelectedSquare(null);
        setValidMoves([]);
      } else {
        // Check if clicking on own piece to select it
        if (validMovesForSquare) {
          const moves = validMovesForSquare(squareKey);
          if (moves && moves.length > 0) {
            setSelectedSquare([col, row]);
            setValidMoves(moves);
          } else {
            setSelectedSquare(null);
            setValidMoves([]);
          }
        } else {
          setSelectedSquare(null);
          setValidMoves([]);
        }
      }
    } else {
      // Select piece
      if (validMovesForSquare) {
        const moves = validMovesForSquare(squareKey);
        if (moves && moves.length > 0) {
          setSelectedSquare([col, row]);
          setValidMoves(moves);
        }
      }
    }
  }, [selectedSquare, validMoves, onMove, validMovesForSquare]);
  
  // Reset selection when position changes
  useEffect(() => {
    setSelectedSquare(null);
    setValidMoves([]);
  }, [position]);
  
  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%',
        background: 'radial-gradient(ellipse at center, #1a1525 0%, #0a0812 100%)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
      data-testid="chess-3d-board"
    >
      <Canvas
        camera={{ position: [0, 10, 12], fov: 45 }}
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <color attach="background" args={['#0a0812']} />
        <fog attach="fog" args={['#0a0812', 15, 30]} />
        
        <Suspense fallback={<LoadingFallback />}>
          <Scene
            position={position}
            playerColor={playerColor}
            selectedSquare={selectedSquare}
            validMoves={validMoves}
            onSquareClick={handleSquareClick}
            lastMove={lastMove}
            isThinking={isThinking}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Chess3DBoard;
