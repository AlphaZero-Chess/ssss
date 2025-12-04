import React, { Suspense, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Chess3DScene from './Chess3DBoard';
import Environment3D from './Environment3D';

// Loading fallback for 3D scene
const LoadingFallback = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#6b3fa0" wireframe />
    </mesh>
  );
};

// Convert chess.js game state to pieces object
const extractPiecesFromGame = (game) => {
  if (!game) return {};
  
  const pieces = {};
  const board = game.board();
  
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file];
      if (piece) {
        const square = String.fromCharCode(97 + file) + (8 - rank);
        pieces[square] = {
          type: piece.type,
          color: piece.color
        };
      }
    }
  }
  
  return pieces;
};

// Get valid moves for a square
const getValidMovesForSquare = (game, square) => {
  if (!game || !square) return [];
  
  const moves = game.moves({ square, verbose: true });
  return moves.map(m => m.to);
};

/**
 * Chess3DView - Main 3D Chess visualization component
 * 
 * This component provides a 3D view of the chess game with:
 * - Floating crystal chess board
 * - Cosmic purple/blue environment
 * - Crystal/glass chess pieces
 * - Interactive piece selection and movement
 * 
 * Props:
 * - game: Chess.js game instance
 * - playerColor: 'white' | 'black'
 * - selectedSquare: Currently selected square
 * - lastMove: { from, to } last move made
 * - onSquareClick: (square) => void
 * - enemyColor: Color theme for enemy (optional)
 * - isThinking: Whether AI is thinking
 */
const Chess3DView = ({ 
  game, 
  playerColor = 'white',
  selectedSquare,
  lastMove,
  onSquareClick,
  enemyColor = '#bf00ff',
  isThinking = false
}) => {
  // Extract pieces from game state
  const pieces = useMemo(() => {
    return extractPiecesFromGame(game);
  }, [game?.fen?.()]);
  
  // Get valid moves for selected piece
  const validMoves = useMemo(() => {
    if (!selectedSquare || !game) return [];
    return getValidMovesForSquare(game, selectedSquare);
  }, [game, selectedSquare, game?.fen?.()]);
  
  // Handle square/piece clicks
  const handleSquareClick = useCallback((square) => {
    if (onSquareClick) {
      onSquareClick(square);
    }
  }, [onSquareClick]);
  
  const handlePieceClick = useCallback((square) => {
    if (onSquareClick) {
      onSquareClick(square);
    }
  }, [onSquareClick]);

  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '400px',
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 100%)',
        position: 'relative'
      }}
      data-testid="chess-3d-view"
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Camera */}
          <PerspectiveCamera
            makeDefault
            position={playerColor === 'white' ? [0, 12, 14] : [0, 12, -14]}
            fov={45}
          />
          
          {/* Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={30}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.5}
            target={[0, 0, 0]}
            autoRotate={false}
            rotateSpeed={0.5}
          />
          
          {/* Fog for depth */}
          <fog attach="fog" args={['#0a0a1a', 50, 200]} />
          
          {/* Environment (cosmic background, particles, lights) */}
          <Environment3D />
          
          {/* Chess Scene (board + pieces) */}
          <Chess3DScene
            boardPosition={[0, 0, 0]}
            pieces={pieces}
            selectedSquare={selectedSquare}
            validMoves={validMoves}
            lastMove={lastMove}
            onSquareClick={handleSquareClick}
            onPieceClick={handlePieceClick}
            playerColor={playerColor}
          />
        </Suspense>
      </Canvas>
      
      {/* Thinking overlay */}
      {isThinking && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(107, 63, 160, 0.9)',
            padding: '8px 20px',
            borderRadius: '20px',
            color: '#fff',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '12px',
            letterSpacing: '2px',
            boxShadow: '0 0 20px rgba(191, 0, 255, 0.5)',
            animation: 'pulse 1.5s infinite'
          }}
        >
          AI THINKING...
        </div>
      )}
      
      {/* Controls hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255, 255, 255, 0.5)',
          fontFamily: 'Rajdhani, sans-serif',
          fontSize: '11px',
          letterSpacing: '1px',
          textAlign: 'center'
        }}
      >
        DRAG TO ROTATE • SCROLL TO ZOOM
      </div>
    </div>
  );
};

export default Chess3DView;
