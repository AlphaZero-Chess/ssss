import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// CHESS 3D MODE - ALPHAZERO NEURAL AESTHETIC
// Clean, sophisticated 3D chess board with neural glow effects
// ═══════════════════════════════════════════════════════════════════════════════

// Files and ranks for board coordinates
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

// Parse FEN to get piece positions
const parseFEN = (fen) => {
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
        const piece = char.toUpperCase();
        pieces[square] = color + piece;
        fileIndex++;
      }
    }
  });
  
  return pieces;
};

// ═══════════════════════════════════════════════════════════════════════════════
// NEURAL SEAL COMPONENT - Rotating geometric patterns
// ═══════════════════════════════════════════════════════════════════════════════
const NeuralSeal = ({ size, speed, reverse, opacity = 0.6 }) => {
  const markerCount = 8;
  
  return (
    <div 
      className="neural-seal-3d"
      style={{
        width: size,
        height: size,
        animation: `${reverse ? 'seal-rotate-reverse' : 'seal-rotate'} ${speed}s linear infinite`,
        opacity
      }}
    >
      {/* Outer ring */}
      <div className="seal-ring-outer" style={{ width: size, height: size }} />
      
      {/* Markers around the ring */}
      {Array.from({ length: markerCount }, (_, i) => (
        <div 
          key={i}
          className="seal-marker"
          style={{
            transform: `rotate(${(360 / markerCount) * i}deg) translateY(${-size / 2 + 8}px)`,
          }}
        />
      ))}
      
      {/* Inner ring */}
      <div 
        className="seal-ring-inner"
        style={{
          width: size * 0.65,
          height: size * 0.65
        }}
      >
        {Array.from({ length: 4 }, (_, i) => (
          <div 
            key={i}
            className="seal-marker-inner"
            style={{
              transform: `rotate(${90 * i}deg) translateY(${-size * 0.28}px)`
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3D CHESS PIECE COMPONENT - Sophisticated geometric design (no emoji)
// ═══════════════════════════════════════════════════════════════════════════════
const ChessPiece3D = ({ piece, square, isSelected, onClick, lastMove }) => {
  if (!piece) return null;
  
  const isWhite = piece[0] === 'w';
  const pieceType = piece[1];
  const isLastMoveSquare = lastMove && (lastMove.from === square || lastMove.to === square);
  
  // Get piece height multiplier based on type
  const getHeightClass = () => {
    switch (pieceType) {
      case 'K': return 'piece-king';
      case 'Q': return 'piece-queen';
      case 'R': return 'piece-rook';
      case 'B': return 'piece-bishop';
      case 'N': return 'piece-knight';
      case 'P': return 'piece-pawn';
      default: return 'piece-pawn';
    }
  };
  
  return (
    <div 
      className={`chess-piece-3d ${isSelected ? 'selected' : ''} ${isLastMoveSquare ? 'last-move' : ''} ${isWhite ? 'white-piece' : 'black-piece'} ${getHeightClass()}`}
      onClick={onClick}
      data-testid={`piece-${square}`}
    >
      {/* Piece body - sophisticated 3D geometric form */}
      <div className="piece-body">
        <div className="piece-base-ring" />
        <div className="piece-column" />
        <div className="piece-crown" />
        <div className="piece-core" />
      </div>
      
      {/* Selection glow */}
      {isSelected && <div className="piece-selection-aura" />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN CHESS 3D MODE COMPONENT
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
  const [rotationX, setRotationX] = useState(55);
  const [rotationZ, setRotationZ] = useState(playerColor === 'white' ? 0 : 180);
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Parse position
  const pieces = useMemo(() => parseFEN(position), [position]);
  
  // Generate board squares
  const squares = useMemo(() => {
    const result = [];
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const square = FILES[file] + RANKS[rank];
        const isLight = (rank + file) % 2 === 0;
        const piece = pieces[square];
        const isLegal = legalMoves.includes(square);
        const isSelected = selectedSquare === square;
        
        result.push({
          square,
          file,
          rank,
          isLight,
          piece,
          isLegal,
          isSelected
        });
      }
    }
    return result;
  }, [pieces, legalMoves, selectedSquare]);

  // Mouse drag for rotation
  const handleMouseDown = useCallback((e) => {
    if (e.button === 2) { // Right click for rotation
      setIsDragging(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    
    setRotationZ(prev => prev + deltaX * 0.5);
    setRotationX(prev => Math.max(20, Math.min(80, prev - deltaY * 0.5)));
    
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Update rotation when player color changes
  useEffect(() => {
    setRotationZ(playerColor === 'white' ? 0 : 180);
  }, [playerColor]);

  const squareSize = boardSize / 8;

  return (
    <div 
      className="chess-3d-container"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onContextMenu={(e) => e.preventDefault()}
      style={{ 
        width: boardSize + 100, 
        height: boardSize + 100,
        perspective: '1200px'
      }}
      data-testid="chess-3d-mode"
    >
      {/* Clean neural background */}
      <div className="chess-3d-neural-bg">
        <div className="neural-layer neural-1" />
        <div className="neural-layer neural-2" />
      </div>

      {/* Subtle neural seals in background */}
      <NeuralSeal size={boardSize * 1.6} speed={80} reverse={false} opacity={0.1} />
      <NeuralSeal size={boardSize * 1.2} speed={60} reverse={true} opacity={0.15} />

      {/* 3D Board with perspective */}
      <div 
        className="chess-3d-board-wrapper"
        style={{
          transform: `rotateX(${rotationX}deg) rotateZ(${rotationZ}deg)`,
          width: boardSize,
          height: boardSize
        }}
      >
        {/* Board base */}
        <div className="board-base-3d">
          <div className="board-edge edge-north" />
          <div className="board-edge edge-south" />
          <div className="board-edge edge-east" />
          <div className="board-edge edge-west" />
          
          {/* Corner accents */}
          <div className="corner-accent corner-nw" />
          <div className="corner-accent corner-ne" />
          <div className="corner-accent corner-sw" />
          <div className="corner-accent corner-se" />
        </div>

        {/* Board squares */}
        <div className="chess-3d-squares">
          {squares.map(({ square, file, rank, isLight, piece, isLegal, isSelected }) => (
            <div
              key={square}
              className={`chess-3d-square ${isLight ? 'light' : 'dark'} ${isLegal ? 'legal-move' : ''} ${isSelected ? 'selected' : ''}`}
              style={{
                width: squareSize,
                height: squareSize,
                left: file * squareSize,
                top: rank * squareSize
              }}
              onClick={() => onSquareClick && onSquareClick(square)}
              data-testid={`square-${square}`}
            >
              {/* Legal move indicator */}
              {isLegal && !piece && (
                <div className="legal-move-indicator">
                  <div className="legal-dot" />
                </div>
              )}
              {isLegal && piece && (
                <div className="legal-capture-indicator" />
              )}
              
              {/* Chess piece - 3D geometric */}
              {piece && (
                <ChessPiece3D 
                  piece={piece}
                  square={square}
                  isSelected={isSelected}
                  onClick={() => onSquareClick && onSquareClick(square)}
                  lastMove={lastMove}
                />
              )}
            </div>
          ))}
        </div>

        {/* Board coordinates - counter-rotated to always face camera */}
        <div className="board-coordinates-3d">
          {FILES.map((f, i) => (
            <span 
              key={f} 
              className="coord-file" 
              style={{ 
                left: i * squareSize + squareSize / 2,
                transform: `translateX(-50%) rotateZ(${-rotationZ}deg)`
              }}
            >
              {f}
            </span>
          ))}
          {RANKS.map((r, i) => (
            <span 
              key={r} 
              className="coord-rank" 
              style={{ 
                top: i * squareSize + squareSize / 2,
                transform: `translateY(-50%) rotateZ(${-rotationZ}deg)`
              }}
            >
              {r}
            </span>
          ))}
        </div>
      </div>

      {/* Thinking indicator */}
      {isThinking && (
        <div className="thinking-indicator-3d">
          <div className="thinking-spinner" />
          <span className="thinking-text">NEURAL PROCESSING...</span>
        </div>
      )}

      {/* Rotation hint */}
      <div className="rotation-hint">
        Right-click + drag to rotate
      </div>

      {/* Styles */}
      <style>{`
        .chess-3d-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: transparent;
          border-radius: 16px;
          user-select: none;
        }

        /* ═══ NEURAL BACKGROUND ═══ */
        .chess-3d-neural-bg {
          position: absolute;
          inset: -50px;
          pointer-events: none;
          z-index: 0;
        }

        .neural-layer {
          position: absolute;
          inset: 0;
          border-radius: 20px;
        }

        .neural-1 {
          background: radial-gradient(ellipse at 30% 30%, 
            rgba(191, 0, 255, 0.08) 0%, 
            rgba(15, 5, 30, 0.8) 40%, 
            rgba(5, 0, 15, 0.95) 70%);
        }

        .neural-2 {
          background: radial-gradient(ellipse at 70% 70%, 
            rgba(255, 0, 191, 0.05) 0%, 
            transparent 50%);
        }

        /* ═══ NEURAL SEALS ═══ */
        .neural-seal-3d {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 1;
        }

        .seal-ring-outer {
          position: absolute;
          border: 1px solid rgba(191, 0, 255, 0.25);
          border-radius: 50%;
        }

        .seal-ring-inner {
          position: absolute;
          border: 1px solid rgba(255, 0, 191, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .seal-marker {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(191, 0, 255, 0.5);
          border-radius: 50%;
        }

        .seal-marker-inner {
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(255, 204, 0, 0.4);
          border-radius: 50%;
        }

        @keyframes seal-rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes seal-rotate-reverse {
          from { transform: translate(-50%, -50%) rotate(360deg); }
          to { transform: translate(-50%, -50%) rotate(0deg); }
        }

        /* ═══ 3D BOARD ═══ */
        .chess-3d-board-wrapper {
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.1s ease-out;
          z-index: 5;
        }

        .board-base-3d {
          position: absolute;
          inset: -12px;
          background: linear-gradient(145deg, 
            #2a1a4a 0%, 
            #1a0a3a 50%, 
            #150830 100%);
          border: 2px solid rgba(191, 0, 255, 0.3);
          border-radius: 8px;
          transform: translateZ(-20px);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.8),
            0 0 30px rgba(191, 0, 255, 0.15);
        }

        .board-edge {
          position: absolute;
          background: linear-gradient(to bottom, #3a2a5a, #1a0a3a);
        }

        .edge-north, .edge-south {
          left: 0;
          right: 0;
          height: 20px;
        }

        .edge-north { top: -20px; transform: rotateX(90deg); transform-origin: bottom; }
        .edge-south { bottom: -20px; transform: rotateX(-90deg); transform-origin: top; }

        .edge-east, .edge-west {
          top: 0;
          bottom: 0;
          width: 20px;
        }

        .edge-east { right: -20px; transform: rotateY(90deg); transform-origin: left; }
        .edge-west { left: -20px; transform: rotateY(-90deg); transform-origin: right; }

        .corner-accent {
          position: absolute;
          width: 16px;
          height: 16px;
          background: radial-gradient(circle, rgba(191, 0, 255, 0.6) 0%, transparent 70%);
          border-radius: 50%;
        }

        .corner-nw { top: -4px; left: -4px; }
        .corner-ne { top: -4px; right: -4px; }
        .corner-sw { bottom: -4px; left: -4px; }
        .corner-se { bottom: -4px; right: -4px; }

        /* ═══ BOARD SQUARES ═══ */
        .chess-3d-squares {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }

        .chess-3d-square {
          position: absolute;
          cursor: pointer;
          transition: all 0.15s ease;
          transform-style: preserve-3d;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chess-3d-square.light {
          background: linear-gradient(145deg, 
            rgba(160, 140, 180, 0.9) 0%, 
            rgba(140, 120, 160, 0.85) 100%);
        }

        .chess-3d-square.dark {
          background: linear-gradient(145deg, 
            rgba(60, 40, 100, 0.95) 0%, 
            rgba(40, 25, 70, 0.9) 100%);
        }

        .chess-3d-square:hover {
          transform: translateZ(3px);
          box-shadow: 0 0 12px rgba(191, 0, 255, 0.35);
        }

        .chess-3d-square.selected {
          background: linear-gradient(145deg, 
            rgba(0, 255, 136, 0.5) 0%, 
            rgba(0, 200, 100, 0.4) 100%) !important;
          box-shadow: 0 0 16px rgba(0, 255, 136, 0.5);
        }

        .legal-move-indicator {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .legal-dot {
          width: 25%;
          height: 25%;
          background: radial-gradient(circle, 
            rgba(0, 255, 136, 0.7) 0%, 
            rgba(0, 200, 100, 0.3) 60%, 
            transparent 100%);
          border-radius: 50%;
          animation: legal-pulse 1s ease-in-out infinite;
        }

        .legal-capture-indicator {
          position: absolute;
          inset: 4px;
          border: 2px solid rgba(255, 100, 100, 0.5);
          border-radius: 50%;
          animation: capture-pulse 1s ease-in-out infinite;
        }

        @keyframes legal-pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.15); opacity: 1; }
        }

        @keyframes capture-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }

        /* ═══ 3D CHESS PIECES - GEOMETRIC DESIGN ═══ */
        .chess-piece-3d {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 85%;
          height: 85%;
          transform-style: preserve-3d;
          transition: transform 0.2s ease;
          cursor: pointer;
          z-index: 10;
        }

        .chess-piece-3d:hover {
          transform: translateZ(6px) scale(1.08);
        }

        .chess-piece-3d.selected {
          transform: translateZ(10px) scale(1.12);
        }

        .piece-body {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
        }

        /* Base ring */
        .piece-base-ring {
          position: absolute;
          bottom: 10%;
          width: 70%;
          height: 12%;
          border-radius: 50%;
          transform: rotateX(75deg);
        }

        /* Column */
        .piece-column {
          position: absolute;
          bottom: 15%;
          width: 35%;
          border-radius: 3px 3px 8px 8px;
        }

        /* Crown */
        .piece-crown {
          position: absolute;
          border-radius: 50%;
        }

        /* Core glow */
        .piece-core {
          position: absolute;
          border-radius: 50%;
        }

        /* White pieces */
        .white-piece .piece-base-ring {
          background: linear-gradient(to bottom, #e8e0f8 0%, #c0b0d8 100%);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }

        .white-piece .piece-column {
          background: linear-gradient(to right, #e8e0f8 0%, #d0c0e8 50%, #e8e0f8 100%);
          box-shadow: 0 0 8px rgba(160, 120, 255, 0.3);
        }

        .white-piece .piece-crown {
          background: radial-gradient(circle at 30% 30%, #ffffff 0%, #e0d0f0 60%, #c8b8e0 100%);
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.4);
        }

        .white-piece .piece-core {
          background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(160, 120, 255, 0.4) 100%);
        }

        /* Black pieces */
        .black-piece .piece-base-ring {
          background: linear-gradient(to bottom, #2a1848 0%, #180a30 100%);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
        }

        .black-piece .piece-column {
          background: linear-gradient(to right, #2a1848 0%, #1a0a38 50%, #2a1848 100%);
          box-shadow: 0 0 8px rgba(191, 0, 255, 0.4);
        }

        .black-piece .piece-crown {
          background: radial-gradient(circle at 30% 30%, #3a2858 0%, #2a1848 60%, #1a0a38 100%);
          box-shadow: 0 0 12px rgba(191, 0, 255, 0.3);
        }

        .black-piece .piece-core {
          background: radial-gradient(circle, rgba(191, 0, 255, 0.8) 0%, rgba(100, 0, 150, 0.3) 100%);
        }

        /* Piece type sizing */
        .piece-king .piece-column { height: 45%; }
        .piece-king .piece-crown { top: 12%; width: 40%; height: 28%; }
        .piece-king .piece-core { top: 5%; width: 20%; height: 12%; }

        .piece-queen .piece-column { height: 42%; }
        .piece-queen .piece-crown { top: 14%; width: 38%; height: 26%; }
        .piece-queen .piece-core { top: 8%; width: 18%; height: 10%; }

        .piece-rook .piece-column { height: 38%; width: 40%; border-radius: 2px; }
        .piece-rook .piece-crown { top: 18%; width: 42%; height: 20%; border-radius: 3px; }
        .piece-rook .piece-core { top: 12%; width: 16%; height: 10%; }

        .piece-bishop .piece-column { height: 40%; }
        .piece-bishop .piece-crown { top: 14%; width: 32%; height: 28%; border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; }
        .piece-bishop .piece-core { top: 6%; width: 14%; height: 10%; }

        .piece-knight .piece-column { height: 35%; }
        .piece-knight .piece-crown { top: 16%; width: 36%; height: 30%; border-radius: 40% 60% 50% 50%; transform: rotate(-15deg); }
        .piece-knight .piece-core { top: 14%; left: 55%; width: 12%; height: 10%; }

        .piece-pawn .piece-column { height: 30%; }
        .piece-pawn .piece-crown { top: 22%; width: 28%; height: 24%; }
        .piece-pawn .piece-core { top: 18%; width: 12%; height: 10%; }

        /* Selection aura */
        .piece-selection-aura {
          position: absolute;
          inset: -8px;
          background: radial-gradient(circle, rgba(0, 255, 136, 0.4) 0%, transparent 70%);
          border-radius: 50%;
          animation: selection-pulse 1s ease-in-out infinite;
        }

        @keyframes selection-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        /* Last move highlight */
        .chess-piece-3d.last-move::after {
          content: '';
          position: absolute;
          inset: -4px;
          border: 2px solid rgba(255, 204, 0, 0.5);
          border-radius: 50%;
          animation: last-move-glow 2s ease-in-out infinite;
        }

        @keyframes last-move-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }

        /* ═══ BOARD COORDINATES ═══ */
        .board-coordinates-3d {
          position: absolute;
          inset: 0;
          pointer-events: none;
          transform-style: preserve-3d;
        }

        .coord-file {
          position: absolute;
          bottom: -20px;
          font-family: 'Orbitron', sans-serif;
          font-size: 10px;
          color: rgba(191, 0, 255, 0.5);
          display: inline-block;
          transform-origin: center center;
        }

        .coord-rank {
          position: absolute;
          left: -18px;
          font-family: 'Orbitron', sans-serif;
          font-size: 10px;
          color: rgba(191, 0, 255, 0.5);
          display: inline-block;
          transform-origin: center center;
        }

        /* ═══ THINKING INDICATOR ═══ */
        .thinking-indicator-3d {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 20;
        }

        .thinking-spinner {
          width: 40px;
          height: 40px;
          border: 2px solid rgba(191, 0, 255, 0.2);
          border-top-color: rgba(191, 0, 255, 0.8);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .thinking-text {
          font-family: 'Orbitron', sans-serif;
          font-size: 11px;
          color: rgba(191, 0, 255, 0.8);
          letter-spacing: 2px;
        }

        /* ═══ ROTATION HINT ═══ */
        .rotation-hint {
          position: absolute;
          bottom: 5px;
          right: 10px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 10px;
          color: rgba(150, 130, 180, 0.4);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default Chess3DMode;
