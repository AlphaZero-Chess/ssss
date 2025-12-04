import React, { Suspense, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import AlphaZeroBoard3DScene from './AlphaZeroBoard3D';
import AlphaZeroEnvironment3D from './AlphaZeroEnvironment3D';

// Loading fallback with AlphaZero styling
const LoadingFallback = () => {
  return (
    <mesh>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#bf00ff"
        emissive="#bf00ff"
        emissiveIntensity={0.5}
        wireframe
      />
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
 * AlphaZeroChess3DView - The Ultimate 3D Chess Experience
 * 
 * Features:
 * - Highly sophisticated neural-inspired board design
 * - Rune-engraved chains and seals (like the Hidden Master card)
 * - Electrifying cosmic background with neural network visualization
 * - Crystal pieces with AlphaZero aesthetic
 * - Clean, minimal UI - no unnecessary elements
 * 
 * Props:
 * - game: Chess.js game instance
 * - playerColor: 'white' | 'black'
 * - selectedSquare: Currently selected square
 * - lastMove: { from, to } last move made
 * - onSquareClick: (square) => void
 * - isThinking: Whether AI is thinking
 */
const AlphaZeroChess3DView = ({ 
  game, 
  playerColor = 'white',
  selectedSquare,
  lastMove,
  onSquareClick,
  isThinking = false
}) => {
  // Extract pieces from game state
  const pieces = useMemo(() => {
    return extractPiecesFromGame(game);
  }, [game?.fen?.() || game]);
  
  // Get valid moves for selected piece
  const validMoves = useMemo(() => {
    if (!selectedSquare || !game) return [];
    return getValidMovesForSquare(game, selectedSquare);
  }, [game, selectedSquare]);
  
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
        minHeight: '450px',
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #030308 0%, #0a0515 30%, #0f0820 60%, #030308 100%)',
        position: 'relative',
        boxShadow: '0 0 60px rgba(191, 0, 255, 0.3), 0 0 100px rgba(191, 0, 255, 0.15), inset 0 0 30px rgba(0,0,0,0.6)',
        border: '2px solid rgba(191, 0, 255, 0.3)'
      }}
      data-testid="alphazero-chess-3d-view"
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: 3 // ACESFilmicToneMapping
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Camera */}
          <PerspectiveCamera
            makeDefault
            position={playerColor === 'white' ? [0, 14, 16] : [0, 14, -16]}
            fov={45}
          />
          
          {/* Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={12}
            maxDistance={35}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.3}
            target={[0, 0, 0]}
            autoRotate={false}
            rotateSpeed={0.4}
            zoomSpeed={0.8}
          />
          
          {/* Fog for depth */}
          <fog attach="fog" args={['#030308', 60, 250]} />
          
          {/* AlphaZero Environment */}
          <AlphaZeroEnvironment3D />
          
          {/* AlphaZero Chess Board Scene */}
          <AlphaZeroBoard3DScene
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
      
      {/* Thinking overlay - minimal, sophisticated */}
      {isThinking && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, rgba(191, 0, 255, 0.9) 0%, rgba(255, 0, 191, 0.85) 100%)',
            padding: '10px 28px',
            borderRadius: '25px',
            color: '#fff',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '11px',
            fontWeight: 'bold',
            letterSpacing: '3px',
            boxShadow: '0 0 30px rgba(191, 0, 255, 0.6), 0 0 60px rgba(255, 0, 191, 0.3)',
            animation: 'neuralPulse 1.5s infinite',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          NEURAL PROCESSING...
        </div>
      )}
      
      {/* Controls hint - minimal */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(200, 150, 255, 0.5)',
          fontFamily: 'Rajdhani, sans-serif',
          fontSize: '10px',
          letterSpacing: '2px',
          textAlign: 'center',
          textTransform: 'uppercase'
        }}
      >
        Drag to rotate • Scroll to zoom
      </div>
      
      {/* Animation keyframes */}
      <style>{`
        @keyframes neuralPulse {
          0%, 100% { 
            opacity: 1; 
            box-shadow: 0 0 30px rgba(191, 0, 255, 0.6), 0 0 60px rgba(255, 0, 191, 0.3);
          }
          50% { 
            opacity: 0.85; 
            box-shadow: 0 0 50px rgba(191, 0, 255, 0.8), 0 0 100px rgba(255, 0, 191, 0.5);
          }
        }
      `}</style>
    </div>
  );
};

export default AlphaZeroChess3DView;
