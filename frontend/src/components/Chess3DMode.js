import React, { Suspense, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import AlphaZeroBoard3DScene from './Chess3D/AlphaZeroBoard3D';
import AlphaZeroEnvironment3D from './Chess3D/AlphaZeroEnvironment3D';

// ═══════════════════════════════════════════════════════════════════════════════
// CHESS 3D MODE - ALPHAZERO HIDDEN MASTER AESTHETIC
// True 3D chess board with React Three Fiber rendering
// Features sophisticated 3D pieces, rune-engraved board, cosmic environment
// ═══════════════════════════════════════════════════════════════════════════════

// Files and ranks for board coordinates
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

// Parse FEN to get piece positions for 3D board
const parseFENForBoard = (fen) => {
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
        const pieceType = char.toLowerCase();
        pieces[square] = {
          type: pieceType,
          color: color
        };
        fileIndex++;
      }
    }
  });
  
  return pieces;
};

// Loading fallback with AlphaZero styling
const LoadingFallback = () => (
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

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN CHESS 3D MODE COMPONENT - True 3D with React Three Fiber
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
  // Parse position FEN to pieces object
  const pieces = useMemo(() => parseFENForBoard(position), [position]);
  
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

  // Calculate canvas dimensions with some padding
  const canvasWidth = boardSize + 100;
  const canvasHeight = boardSize + 100;

  return (
    <div 
      style={{ 
        width: canvasWidth, 
        height: canvasHeight,
        minHeight: '450px',
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #030308 0%, #0a0515 30%, #0f0820 60%, #030308 100%)',
        position: 'relative',
        boxShadow: '0 0 60px rgba(191, 0, 255, 0.3), 0 0 100px rgba(191, 0, 255, 0.15), inset 0 0 30px rgba(0,0,0,0.6)',
        border: '2px solid rgba(191, 0, 255, 0.3)'
      }}
      data-testid="chess-3d-mode"
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
          {/* Camera positioned for good view */}
          <PerspectiveCamera
            makeDefault
            position={playerColor === 'white' ? [0, 14, 16] : [0, 14, -16]}
            fov={45}
          />
          
          {/* Orbit Controls for rotation and zoom */}
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
          
          {/* Fog for depth effect */}
          <fog attach="fog" args={['#030308', 60, 250]} />
          
          {/* AlphaZero 3D Environment (cosmic particles, neural network, etc) */}
          <AlphaZeroEnvironment3D />
          
          {/* The 3D Chess Board with actual 3D pieces */}
          <AlphaZeroBoard3DScene
            boardPosition={[0, 0, 0]}
            pieces={pieces}
            selectedSquare={selectedSquare}
            validMoves={legalMoves}
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
            border: '1px solid rgba(255, 255, 255, 0.2)',
            zIndex: 20
          }}
        >
          NEURAL PROCESSING...
        </div>
      )}
      
      {/* Controls hint - minimal */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(200, 150, 255, 0.5)',
          fontFamily: 'Rajdhani, sans-serif',
          fontSize: '10px',
          letterSpacing: '2px',
          textAlign: 'center',
          textTransform: 'uppercase',
          pointerEvents: 'none'
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

export default Chess3DMode;
