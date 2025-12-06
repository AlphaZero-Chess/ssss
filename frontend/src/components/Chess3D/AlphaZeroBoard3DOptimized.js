import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AlphaZeroPiece3DOptimized } from './AlphaZeroPieces3DOptimized';

// Convert chess notation to 3D position
const squareTo3D = (square, boardSize = 8) => {
  const file = square.charCodeAt(0) - 97;
  const rank = parseInt(square[1]) - 1;
  const offset = (boardSize - 1) / 2;
  return [
    (file - offset) * 1.12,
    0.58,
    (offset - rank) * 1.12
  ];
};

// ==================== OPTIMIZED NEURAL SQUARE ====================
const NeuralSquare = ({ position, isLight, isHighlighted, isValidMove, isLastMove, onClick }) => {
  const meshRef = useRef();
  
  const color = useMemo(() => {
    if (isHighlighted) return '#bf00ff';
    if (isValidMove) return '#00ff88';
    if (isLastMove) return '#ffcc00';
    if (isLight) return '#3a3060';
    return '#160c28';
  }, [isLight, isHighlighted, isValidMove, isLastMove]);
  
  const emissiveColor = isHighlighted ? '#bf00ff' : isValidMove ? '#00ff88' : isLastMove ? '#ffcc00' : '#180a32';
  const emissiveIntensity = isHighlighted || isValidMove || isLastMove ? 0.6 : 0.1;
  
  return (
    <group position={position}>
      <mesh ref={meshRef} receiveShadow onClick={onClick}>
        <boxGeometry args={[1.02, 0.18, 1.02]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.7}
          roughness={0.25}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          clearcoat={0.5}
        />
      </mesh>
      
      {/* Valid move indicator */}
      {isValidMove && (
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={1.2}
            transparent
            opacity={0.9}
          />
        </mesh>
      )}
    </group>
  );
};

// ==================== OPTIMIZED SEAL CHAIN BORDER ====================
const SealChainBorder = () => {
  const chainsRef = useRef();
  
  useFrame((state) => {
    if (chainsRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.3 + 0.7;
      chainsRef.current.children.forEach((child) => {
        if (child.material) {
          child.material.emissiveIntensity = pulse;
        }
      });
    }
  });
  
  // Simplified chain with fewer links
  const createChainLinks = (start, end, count) => {
    const links = [];
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const x = start[0] + (end[0] - start[0]) * t;
      const z = start[1] + (end[1] - start[1]) * t;
      links.push({
        position: [x, 0.05, z],
        rotation: start[0] === end[0] ? [0, Math.PI / 2, 0] : [0, 0, 0],
        isSpecial: i % 3 === 0
      });
    }
    return links;
  };
  
  const borders = [
    { start: [-5.2, -5.2], end: [5.2, -5.2] },
    { start: [5.2, -5.2], end: [5.2, 5.2] },
    { start: [5.2, 5.2], end: [-5.2, 5.2] },
    { start: [-5.2, 5.2], end: [-5.2, -5.2] }
  ];
  
  return (
    <group ref={chainsRef}>
      {borders.map((border, bi) => (
        createChainLinks(border.start, border.end, 16).map((link, li) => (
          <group key={`${bi}-${li}`} position={link.position} rotation={link.rotation}>
            <mesh>
              <torusGeometry args={[0.08, 0.025, 8, 16]} />
              <meshStandardMaterial
                color="#2a1850"
                emissive={link.isSpecial ? '#ff00bf' : '#bf00ff'}
                emissiveIntensity={0.6}
                metalness={0.95}
                roughness={0.15}
              />
            </mesh>
            {link.isSpecial && (
              <mesh>
                <sphereGeometry args={[0.04, 10, 10]} />
                <meshStandardMaterial
                  color="#ffcc00"
                  emissive="#ffcc00"
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

// ==================== OPTIMIZED RUNIC SEAL CIRCLES ====================
const RunicSealCircles = () => {
  const outerRef = useRef();
  const innerRef = useRef();
  const coreRef = useRef();
  
  useFrame((state) => {
    if (outerRef.current) outerRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    if (innerRef.current) innerRef.current.rotation.z = -state.clock.elapsedTime * 0.08;
    if (coreRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.15 + 1;
      coreRef.current.scale.setScalar(pulse);
    }
  });
  
  return (
    <group position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer ring with markers */}
      <group ref={outerRef}>
        <mesh>
          <torusGeometry args={[7, 0.06, 8, 64]} />
          <meshStandardMaterial
            color="#bf00ff"
            emissive="#bf00ff"
            emissiveIntensity={0.7}
            transparent
            opacity={0.8}
          />
        </mesh>
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 7, Math.sin(angle) * 7, 0.08]}>
              <octahedronGeometry args={[0.1, 0]} />
              <meshStandardMaterial
                color={i % 3 === 0 ? '#ffcc00' : '#ff00bf'}
                emissive={i % 3 === 0 ? '#ffcc00' : '#ff00bf'}
                emissiveIntensity={1.5}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Inner ring */}
      <group ref={innerRef}>
        <mesh>
          <torusGeometry args={[5.5, 0.04, 8, 48]} />
          <meshStandardMaterial
            color="#ff00bf"
            emissive="#ff00bf"
            emissiveIntensity={0.6}
            transparent
            opacity={0.7}
          />
        </mesh>
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 5.5, Math.sin(angle) * 5.5, 0.06]}>
              <tetrahedronGeometry args={[0.08, 0]} />
              <meshStandardMaterial
                color="#ffcc00"
                emissive="#ffcc00"
                emissiveIntensity={1.5}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Core hexagonal seal */}
      <group ref={coreRef}>
        <mesh>
          <ringGeometry args={[0.6, 0.85, 6]} />
          <meshStandardMaterial
            color="#ffcc00"
            emissive="#ffcc00"
            emissiveIntensity={1}
            transparent
            opacity={0.7}
          />
        </mesh>
        <mesh>
          <circleGeometry args={[0.5, 6]} />
          <meshStandardMaterial
            color="#bf00ff"
            emissive="#bf00ff"
            emissiveIntensity={0.8}
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>
    </group>
  );
};

// ==================== OPTIMIZED CORNER ANCHORS ====================
const CornerAnchors = () => {
  const anchorsRef = useRef();
  
  useFrame((state) => {
    if (anchorsRef.current) {
      anchorsRef.current.children.forEach((anchor, i) => {
        anchor.rotation.y = state.clock.elapsedTime * (i % 2 === 0 ? 0.4 : -0.4);
      });
    }
  });
  
  const corners = [[-5, -5], [-5, 5], [5, -5], [5, 5]];
  
  return (
    <group ref={anchorsRef}>
      {corners.map(([x, z], i) => (
        <group key={i} position={[x, 0.15, z]}>
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
            <icosahedronGeometry args={[0.12, 0]} />
            <meshStandardMaterial
              color="#ffcc00"
              emissive="#ffcc00"
              emissiveIntensity={1.8}
            />
          </mesh>
          <pointLight color="#bf00ff" intensity={1.5} distance={3} />
        </group>
      ))}
    </group>
  );
};

// ==================== MAIN ALPHAZERO 3D BOARD SCENE - OPTIMIZED ====================
const AlphaZeroBoard3DSceneOptimized = ({
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
      boardRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
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
      
      {/* Corner anchors */}
      <CornerAnchors />
      
      {/* Main board group */}
      <group ref={boardRef} position={boardPosition}>
        {/* Board base */}
        <mesh position={[0, -0.2, 0]} receiveShadow>
          <boxGeometry args={[10.5, 0.35, 10.5]} />
          <meshPhysicalMaterial
            color="#060310"
            metalness={0.85}
            roughness={0.15}
            emissive="#180035"
            emissiveIntensity={0.25}
          />
        </mesh>
        
        {/* Glowing edge frame */}
        <mesh position={[0, -0.06, 0]}>
          <boxGeometry args={[10.8, 0.1, 10.8]} />
          <meshStandardMaterial
            color="#bf00ff"
            emissive="#bf00ff"
            emissiveIntensity={0.7}
            transparent
            opacity={0.75}
          />
        </mesh>
        
        {/* Chain border */}
        <SealChainBorder />
        
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
          <AlphaZeroPiece3DOptimized
            key={piece.key}
            type={piece.type}
            color={piece.color}
            position={piece.position}
            isSelected={selectedSquare === piece.square}
            playerColor={playerColor}
            onClick={(e) => {
              e.stopPropagation();
              onPieceClick?.(piece.square);
            }}
          />
        ))}
        
        {/* Glow beneath board */}
        <pointLight position={[0, -2, 0]} intensity={3} color="#bf00ff" distance={15} />
      </group>
    </group>
  );
};

export { AlphaZeroBoard3DSceneOptimized, squareTo3D };
export default AlphaZeroBoard3DSceneOptimized;
