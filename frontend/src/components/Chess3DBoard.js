import React, { useRef, useEffect, Suspense, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

// Import ULTRA-OPTIMIZED AlphaZero 3D components (maximum performance)
import AlphaZeroBoard3DScene from './Chess3D/AlphaZeroBoard3DUltra';
import AlphaZeroEnvironment3D from './Chess3D/AlphaZeroEnvironment3DUltra';

// Parse FEN to get piece positions for the AlphaZero board format
function parseFENtoObject(fen) {
  const pieces = {};
  const [position] = fen.split(' ');
  const rows = position.split('/');
  
  rows.forEach((row, rowIndex) => {
    let colIndex = 0;
    for (const char of row) {
      if (isNaN(char)) {
        const color = char === char.toUpperCase() ? 'w' : 'b';
        const pieceType = char.toLowerCase();
        const rank = 8 - rowIndex;
        const file = String.fromCharCode(97 + colIndex);
        const square = file + rank;
        pieces[square] = {
          type: pieceType,
          color: color
        };
        colIndex++;
      } else {
        colIndex += parseInt(char);
      }
    }
  });
  
  return pieces;
}

// Loading fallback component
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

// Main 3D scene - Uses the ultra-optimized AlphaZero components
const Chess3DScene = memo(function Chess3DScene({ position, lastMove, playerColor, onSquareClick, selectedSquare, validMoves }) {
  // Parse position to AlphaZero format
  const pieces = parseFENtoObject(position);
  const controlsRef = useRef();
  
  // Reset camera on color change
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [playerColor]);
  
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={playerColor === 'white' ? [0, 28, 0.1] : [0, 28, -0.1]}
        fov={45}
      />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={12}
        maxDistance={35}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.3}
        target={[0, 0, 0]}
        rotateSpeed={0.4}
        zoomSpeed={0.8}
        touches={{
          ONE: 1,
          TWO: 2
        }}
      />
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#030308', 50, 180]} />
      
      {/* AlphaZero Environment - Ultra-optimized background */}
      <AlphaZeroEnvironment3D />
      
      {/* AlphaZero Board Scene - Ultra-optimized chess board */}
      <AlphaZeroBoard3DScene
        pieces={pieces}
        selectedSquare={selectedSquare}
        validMoves={validMoves}
        lastMove={lastMove}
        onSquareClick={onSquareClick}
        playerColor={playerColor}
      />
    </>
  );
});

// Main exported component - The Ultimate AlphaZero 3D Chess Experience
const Chess3DBoard = memo(function Chess3DBoard({ position, lastMove, playerColor, boardSize, onSquareClick, selectedSquare, validMoves }) {
  return (
    <div
      style={{
        width: boardSize,
        height: boardSize,
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #030308 0%, #0a0515 30%, #0f0820 60%, #030308 100%)',
        boxShadow: '0 0 60px rgba(191, 0, 255, 0.4), 0 0 100px rgba(191, 0, 255, 0.2), inset 0 0 30px rgba(0,0,0,0.6)',
        border: '2px solid rgba(191, 0, 255, 0.35)',
        position: 'relative'
      }}
      data-testid="chess-3d-board"
    >
      <Canvas 
        shadows={false}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          failIfMajorPerformanceCaveat: false
        }}
        frameloop="demand"
        performance={{ min: 0.3, max: 1 }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Chess3DScene
            position={position}
            lastMove={lastMove}
            playerColor={playerColor}
            onSquareClick={onSquareClick}
            selectedSquare={selectedSquare}
            validMoves={validMoves}
          />
        </Suspense>
      </Canvas>
      
      {/* Minimal UI hint */}
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
    </div>
  );
});

export default Chess3DBoard;
