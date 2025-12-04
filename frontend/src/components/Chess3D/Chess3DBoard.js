import React, { useRef, useMemo, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ChessPiece3D } from './ChessPieces3D';

// Convert chess notation to 3D position
const squareTo3D = (square, boardSize = 8) => {
  const file = square.charCodeAt(0) - 97; // a=0, b=1, etc.
  const rank = parseInt(square[1]) - 1; // 1=0, 2=1, etc.
  const offset = (boardSize - 1) / 2;
  return [
    (file - offset) * 1.1,
    0.5, // Piece height above board
    (offset - rank) * 1.1
  ];
};

// Convert 3D position to chess square
const positionToSquare = (x, z, boardSize = 8) => {
  const offset = (boardSize - 1) / 2;
  const file = Math.round(x / 1.1 + offset);
  const rank = Math.round(offset - z / 1.1);
  if (file < 0 || file > 7 || rank < 0 || rank > 7) return null;
  return String.fromCharCode(97 + file) + (rank + 1);
};

// Single board square
const BoardSquare = ({ position, isLight, isHighlighted, isValidMove, onClick }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  const color = useMemo(() => {
    if (isHighlighted) return '#ffcc00';
    if (isValidMove) return '#00ff88';
    if (isLight) return '#c8c8e0';
    return '#4a4a6a';
  }, [isLight, isHighlighted, isValidMove]);
  
  const emissiveIntensity = isHighlighted ? 0.3 : isValidMove ? 0.2 : hovered ? 0.1 : 0;

  return (
    <mesh
      ref={meshRef}
      position={position}
      receiveShadow
      onClick={onClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 0.2, 1]} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.3}
        roughness={0.4}
        transmission={isLight ? 0.2 : 0.1}
        thickness={0.5}
        emissive={isHighlighted ? '#ffcc00' : isValidMove ? '#00ff88' : color}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  );
};

// Floating chess board
const ChessBoard3D = ({ position, validMoves, selectedSquare, lastMove, onSquareClick }) => {
  const boardRef = useRef();
  const edgeRef = useRef();
  
  // Gentle floating animation
  useFrame((state) => {
    if (boardRef.current) {
      boardRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      boardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.02;
    }
  });

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

  return (
    <group ref={boardRef} position={position}>
      {/* Board base */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[9.5, 0.3, 9.5]} />
        <meshPhysicalMaterial
          color="#1a1a2e"
          metalness={0.5}
          roughness={0.3}
          transmission={0.1}
          thickness={1}
        />
      </mesh>
      
      {/* Glowing edge */}
      <mesh ref={edgeRef} position={[0, -0.15, 0]}>
        <boxGeometry args={[9.8, 0.1, 9.8]} />
        <meshBasicMaterial
          color="#6b3fa0"
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Board squares */}
      {squares.map((sq) => {
        const isHighlighted = selectedSquare === sq.square || 
          (lastMove && (lastMove.from === sq.square || lastMove.to === sq.square));
        const isValidMove = validMoves?.includes(sq.square);
        
        return (
          <BoardSquare
            key={sq.key}
            position={sq.position}
            isLight={sq.isLight}
            isHighlighted={isHighlighted}
            isValidMove={isValidMove}
            onClick={(e) => {
              e.stopPropagation();
              onSquareClick?.(sq.square);
            }}
          />
        );
      })}
      
      {/* Ethereal glow under board */}
      <pointLight position={[0, -2, 0]} intensity={0.5} color="#6b3fa0" distance={15} />
    </group>
  );
};

// Main 3D scene with board and pieces
const Chess3DScene = ({ 
  boardPosition, 
  pieces, 
  selectedSquare, 
  validMoves, 
  lastMove,
  onSquareClick,
  onPieceClick,
  playerColor 
}) => {
  // Parse pieces from game state (FEN-like format from chess.js board())
  const pieceElements = useMemo(() => {
    if (!pieces) return [];
    
    const elements = [];
    // pieces is the board state from chess.js
    // Each piece has: type, color, square
    
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
      <ChessBoard3D
        position={boardPosition || [0, 0, 0]}
        selectedSquare={selectedSquare}
        validMoves={validMoves}
        lastMove={lastMove}
        onSquareClick={onSquareClick}
      />
      
      {/* Render pieces */}
      <group position={boardPosition || [0, 0, 0]}>
        {pieceElements.map((piece) => (
          <ChessPiece3D
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
      </group>
    </group>
  );
};

export { Chess3DScene, ChessBoard3D, squareTo3D, positionToSquare };
export default Chess3DScene;
