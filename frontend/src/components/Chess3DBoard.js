import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

// Import the sophisticated AlphaZero 3D components
import AlphaZeroBoard3DScene from './Chess3D/AlphaZeroBoard3D';
import AlphaZeroEnvironment3D from './Chess3D/AlphaZeroEnvironment3D';

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

// Main 3D scene - Uses the sophisticated AlphaZero components
function Chess3DScene({ position, lastMove, playerColor, onSquareClick }) {
  // Parse position to AlphaZero format
  const pieces = useMemo(() => parseFENtoObject(position), [position]);
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
        position={playerColor === 'white' ? [0, 14, 16] : [0, 14, -16]}
        fov={45}
      />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={12}
        maxDistance={35}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.3}
        target={[0, 0, 0]}
        rotateSpeed={0.4}
        zoomSpeed={0.8}
      />
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#030308', 60, 250]} />
      
      {/* AlphaZero Environment - Sophisticated background */}
      <AlphaZeroEnvironment3D />
      
      {/* AlphaZero Board Scene - The ultimate sophisticated chess board */}
      <AlphaZeroBoard3DScene
        boardPosition={[0, 0, 0]}
        pieces={pieces}
        selectedSquare={null}
        validMoves={[]}
        lastMove={lastMove}
        onSquareClick={onSquareClick}
        onPieceClick={onSquareClick}
        playerColor={playerColor}
      />
    </>
  );
}

// Main exported component - The Ultimate AlphaZero 3D Chess Experience
const Chess3DBoard = ({ position, lastMove, playerColor, boardSize, onSquareClick }) => {
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
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Chess3DScene
            position={position}
            lastMove={lastMove}
            playerColor={playerColor}
            onSquareClick={onSquareClick}
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
};

export default Chess3DBoard;
