import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// CHESS 3D MODE - ALPHAZERO HIDDEN MASTER AESTHETIC
// Highly sophisticated 3D chess board with rune-engraved chains,
// complex magic seals, and the overwhelming AlphaZero visual signature
// ═══════════════════════════════════════════════════════════════════════════════

// Rune symbols matching the HiddenMasterLock seal
const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];

// Advanced chess piece unicode with sophisticated styling
const PIECE_SYMBOLS = {
  'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
  'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟'
};

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
// SOPHISTICATED CHAIN COMPONENT - Matching HiddenMasterLock aesthetic
// ═══════════════════════════════════════════════════════════════════════════════
const RuneChain = ({ position, rotation, count, type, delay = 0 }) => {
  const links = useMemo(() => (
    Array.from({ length: count }, (_, i) => ({
      rune: RUNES[i % RUNES.length],
      delay: i * 0.08 + delay
    }))
  ), [count, delay]);

  return (
    <div 
      className="rune-chain-3d"
      style={{
        position: 'absolute',
        ...position,
        transform: rotation,
        display: 'flex',
        gap: '2px',
        flexDirection: type === 'vertical' ? 'column' : 'row'
      }}
    >
      {links.map((link, i) => (
        <div 
          key={i}
          className="chain-link-3d"
          style={{ animationDelay: `${link.delay}s` }}
        >
          <span className="chain-rune-3d">{link.rune}</span>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAGIC SEAL COMPONENT - Complex rotating rune circles
// ═══════════════════════════════════════════════════════════════════════════════
const MagicSeal = ({ size, speed, reverse, opacity = 0.6 }) => {
  const runeCount = Math.floor(size / 15);
  
  return (
    <div 
      className="magic-seal-3d"
      style={{
        width: size,
        height: size,
        animation: `${reverse ? 'seal-rotate-reverse' : 'seal-rotate'} ${speed}s linear infinite`,
        opacity
      }}
    >
      {Array.from({ length: runeCount }, (_, i) => (
        <span 
          key={i}
          className="seal-rune-3d"
          style={{
            transform: `rotate(${(360 / runeCount) * i}deg) translateY(${-size / 2 + 12}px)`,
            animationDelay: `${i * 0.1}s`
          }}
        >
          {RUNES[i % RUNES.length]}
        </span>
      ))}
      {/* Inner ring */}
      <div 
        className="seal-inner-ring"
        style={{
          width: size * 0.65,
          height: size * 0.65
        }}
      >
        {Array.from({ length: 6 }, (_, i) => (
          <span 
            key={i}
            className="seal-rune-inner-3d"
            style={{
              transform: `rotate(${60 * i}deg) translateY(${-size * 0.25}px)`
            }}
          >
            {RUNES[(i + 12) % RUNES.length]}
          </span>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SOPHISTICATED 3D CHESS PIECE
// Counter-rotation applied to keep pieces upright when board is rotated
// ═══════════════════════════════════════════════════════════════════════════════
const ChessPiece3D = ({ piece, square, isSelected, onClick, lastMove, playerColor, boardRotationZ = 0 }) => {
  if (!piece) return null;
  
  const isWhite = piece[0] === 'w';
  const symbol = PIECE_SYMBOLS[piece];
  const isLastMoveSquare = lastMove && (lastMove.from === square || lastMove.to === square);
  
  // Counter-rotate the piece symbol to keep it upright when board is rotated
  // This fixes the "crown on ground" bug for both white and black pieces
  const counterRotation = -boardRotationZ;
  
  return (
    <div 
      className={`chess-piece-3d ${isSelected ? 'selected' : ''} ${isLastMoveSquare ? 'last-move' : ''}`}
      onClick={onClick}
      data-testid={`piece-${square}`}
    >
      <div className="piece-glow" />
      <div className="piece-base" />
      <span 
        className={`piece-symbol ${isWhite ? 'white-piece' : 'black-piece'}`}
        style={{
          textShadow: isWhite 
            ? '0 0 15px rgba(255, 220, 180, 0.9), 0 0 30px rgba(255, 200, 150, 0.6), 0 2px 4px rgba(0, 0, 0, 0.8)'
            : '0 0 15px rgba(150, 100, 255, 0.9), 0 0 30px rgba(120, 80, 200, 0.6), 0 2px 4px rgba(0, 0, 0, 0.8)',
          transform: `rotateZ(${counterRotation}deg)`,
          display: 'inline-block'
        }}
      >
        {symbol}
      </span>
      {/* Rune engraving on piece base */}
      <div className="piece-rune-engraving" style={{ transform: `rotateZ(${counterRotation}deg)` }}>
        {RUNES[(square.charCodeAt(0) + square.charCodeAt(1)) % RUNES.length]}
      </div>
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
      {/* Sophisticated background with void effect */}
      <div className="chess-3d-void-bg">
        <div className="void-layer-3d void-1" />
        <div className="void-layer-3d void-2" />
        <div className="void-layer-3d void-3" />
      </div>

      {/* Complex magic seals in background */}
      <MagicSeal size={boardSize * 1.8} speed={60} reverse={false} opacity={0.15} />
      <MagicSeal size={boardSize * 1.4} speed={45} reverse={true} opacity={0.2} />
      <MagicSeal size={boardSize * 1.0} speed={30} reverse={false} opacity={0.25} />

      {/* Rune chains - HIDDEN (can be re-enabled by uncommenting)
      <div className="chains-wrapper-3d">
        <RuneChain position={{ top: 0, left: '50%', transform: 'translateX(-50%)' }} rotation="" count={18} type="horizontal" delay={0} />
        <RuneChain position={{ top: 20, left: '50%', transform: 'translateX(-50%)' }} rotation="" count={16} type="horizontal" delay={0.2} />
        <RuneChain position={{ bottom: 0, left: '50%', transform: 'translateX(-50%)' }} rotation="" count={18} type="horizontal" delay={0.4} />
        <RuneChain position={{ bottom: 20, left: '50%', transform: 'translateX(-50%)' }} rotation="" count={16} type="horizontal" delay={0.6} />
        <RuneChain position={{ left: 0, top: '50%', transform: 'translateY(-50%)' }} rotation="" count={16} type="vertical" delay={0.1} />
        <RuneChain position={{ left: 20, top: '50%', transform: 'translateY(-50%)' }} rotation="" count={14} type="vertical" delay={0.3} />
        <RuneChain position={{ right: 0, top: '50%', transform: 'translateY(-50%)' }} rotation="" count={16} type="vertical" delay={0.5} />
        <RuneChain position={{ right: 20, top: '50%', transform: 'translateY(-50%)' }} rotation="" count={14} type="vertical" delay={0.7} />
        <RuneChain position={{ top: -10, left: -10 }} rotation="rotate(45deg)" count={12} type="horizontal" delay={0.8} />
        <RuneChain position={{ top: -10, right: -10 }} rotation="rotate(-45deg)" count={12} type="horizontal" delay={0.9} />
        <RuneChain position={{ bottom: -10, left: -10 }} rotation="rotate(-45deg)" count={12} type="horizontal" delay={1.0} />
        <RuneChain position={{ bottom: -10, right: -10 }} rotation="rotate(45deg)" count={12} type="horizontal" delay={1.1} />
        <RuneChain position={{ top: '50%', left: -30, transform: 'translateY(-50%)' }} rotation="" count={20} type="horizontal" delay={1.2} />
        <RuneChain position={{ left: '50%', top: -30, transform: 'translateX(-50%)' }} rotation="" count={20} type="vertical" delay={1.3} />
      </div>
      */}

      {/* Electric arcs effect */}
      <div className="electric-arcs-3d">
        {Array.from({ length: 12 }, (_, i) => (
          <div 
            key={i}
            className="electric-arc-3d"
            style={{
              left: `${10 + (i * 8)}%`,
              top: `${15 + (i % 4) * 20}%`,
              animationDelay: `${i * 0.15}s`
            }}
          />
        ))}
      </div>

      {/* 3D Board with perspective */}
      <div 
        className="chess-3d-board-wrapper"
        style={{
          transform: `rotateX(${rotationX}deg) rotateZ(${rotationZ}deg)`,
          width: boardSize,
          height: boardSize
        }}
      >
        {/* Board base with sophisticated engraving */}
        <div className="board-base-3d">
          <div className="board-edge edge-north" />
          <div className="board-edge edge-south" />
          <div className="board-edge edge-east" />
          <div className="board-edge edge-west" />
          
          {/* Corner rune stones */}
          <div className="corner-stone corner-nw"><span>ᛟ</span></div>
          <div className="corner-stone corner-ne"><span>ᛞ</span></div>
          <div className="corner-stone corner-sw"><span>ᛜ</span></div>
          <div className="corner-stone corner-se"><span>ᛚ</span></div>
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
              {/* Square engraving pattern */}
              <div className="square-engraving">
                {(file + rank) % 3 === 0 && <span className="square-rune">{RUNES[(file * 8 + rank) % RUNES.length]}</span>}
              </div>
              
              {/* Legal move indicator */}
              {isLegal && !piece && (
                <div className="legal-move-indicator">
                  <div className="legal-dot" />
                </div>
              )}
              {isLegal && piece && (
                <div className="legal-capture-indicator" />
              )}
              
              {/* Chess piece */}
              {piece && (
                <ChessPiece3D 
                  piece={piece}
                  square={square}
                  isSelected={isSelected}
                  onClick={() => onSquareClick && onSquareClick(square)}
                  lastMove={lastMove}
                  playerColor={playerColor}
                  boardRotationZ={rotationZ}
                />
              )}
            </div>
          ))}
        </div>

        {/* Board coordinates */}
        <div className="board-coordinates-3d">
          {FILES.map((f, i) => (
            <span key={f} className="coord-file" style={{ left: i * squareSize + squareSize / 2 }}>{f}</span>
          ))}
          {RANKS.map((r, i) => (
            <span key={r} className="coord-rank" style={{ top: i * squareSize + squareSize / 2 }}>{r}</span>
          ))}
        </div>

        {/* Center seal on board */}
        <div className="board-center-seal">
          <MagicSeal size={squareSize * 3} speed={20} reverse={true} opacity={0.3} />
        </div>
      </div>

      {/* Thinking indicator with AlphaZero aesthetic */}
      {isThinking && (
        <div className="thinking-indicator-3d">
          <div className="thinking-seal">
            <MagicSeal size={60} speed={2} reverse={false} opacity={0.9} />
          </div>
          <span className="thinking-text">CALCULATING...</span>
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

        /* ═══ VOID BACKGROUND ═══ */
        .chess-3d-void-bg {
          position: absolute;
          inset: -50px;
          pointer-events: none;
          z-index: 0;
        }

        .void-layer-3d {
          position: absolute;
          inset: 0;
          border-radius: 20px;
        }

        .void-1 {
          background: radial-gradient(ellipse at 30% 20%, 
            transparent 5%, 
            rgba(15, 5, 30, 0.7) 30%, 
            rgba(5, 0, 15, 0.9) 70%);
          animation: void-drift-3d-1 8s ease-in-out infinite;
        }

        .void-2 {
          background: radial-gradient(ellipse at 70% 80%, 
            transparent 5%, 
            rgba(30, 10, 50, 0.6) 25%, 
            rgba(10, 0, 25, 0.85) 60%);
          animation: void-drift-3d-2 10s ease-in-out infinite;
        }

        .void-3 {
          background: radial-gradient(ellipse at 50% 50%, 
            rgba(80, 40, 120, 0.1) 0%, 
            rgba(40, 20, 80, 0.3) 30%, 
            transparent 60%);
          animation: void-pulse-3d 4s ease-in-out infinite;
        }

        @keyframes void-drift-3d-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10px, -10px) scale(1.02); }
        }

        @keyframes void-drift-3d-2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-10px, 10px); }
        }

        @keyframes void-pulse-3d {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }

        /* ═══ MAGIC SEALS ═══ */
        .magic-seal-3d {
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

        .seal-rune-3d {
          position: absolute;
          font-size: 14px;
          color: rgba(150, 100, 255, 0.7);
          text-shadow: 
            0 0 8px rgba(150, 100, 255, 0.9),
            0 0 16px rgba(100, 50, 200, 0.6);
          animation: rune-glow-3d 2s ease-in-out infinite;
        }

        .seal-inner-ring {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(150, 100, 255, 0.3);
          border-radius: 50%;
        }

        .seal-rune-inner-3d {
          position: absolute;
          font-size: 12px;
          color: rgba(200, 150, 255, 0.8);
          text-shadow: 0 0 10px rgba(200, 150, 255, 1);
        }

        @keyframes seal-rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes seal-rotate-reverse {
          from { transform: translate(-50%, -50%) rotate(360deg); }
          to { transform: translate(-50%, -50%) rotate(0deg); }
        }

        @keyframes rune-glow-3d {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        /* ═══ RUNE CHAINS ═══ */
        .chains-wrapper-3d {
          position: absolute;
          inset: -20px;
          pointer-events: none;
          z-index: 2;
        }

        .rune-chain-3d {
          pointer-events: none;
        }

        .chain-link-3d {
          width: 16px;
          height: 12px;
          background: linear-gradient(145deg, 
            #4a2a7a 0%, 
            #2a1a4a 40%, 
            #1a0a3a 70%, 
            #3a2a5a 100%);
          border: 2px solid #3a2a5a;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            inset 0 1px 3px rgba(150, 100, 255, 0.3),
            inset 0 -1px 3px rgba(0, 0, 0, 0.7),
            0 0 6px rgba(100, 50, 200, 0.5),
            0 0 12px rgba(80, 0, 180, 0.3);
          animation: chain-rattle-3d 0.4s ease-in-out infinite, chain-glow-3d 1.5s ease-in-out infinite;
        }

        .chain-rune-3d {
          font-size: 7px;
          color: rgba(200, 150, 255, 0.9);
          text-shadow: 0 0 4px rgba(150, 100, 255, 0.8);
        }

        @keyframes chain-rattle-3d {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(2deg); }
          75% { transform: rotate(-2deg); }
        }

        @keyframes chain-glow-3d {
          0%, 100% { 
            box-shadow: 
              inset 0 1px 3px rgba(150, 100, 255, 0.3),
              0 0 6px rgba(100, 50, 200, 0.5);
          }
          50% { 
            box-shadow: 
              inset 0 1px 3px rgba(150, 100, 255, 0.5),
              0 0 12px rgba(120, 70, 220, 0.7),
              0 0 20px rgba(100, 20, 200, 0.4);
          }
        }

        /* ═══ ELECTRIC ARCS ═══ */
        .electric-arcs-3d {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
        }

        .electric-arc-3d {
          position: absolute;
          width: 50px;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(150, 100, 255, 0.8) 20%, 
            rgba(220, 180, 255, 1) 50%, 
            rgba(150, 100, 255, 0.8) 80%, 
            transparent 100%);
          border-radius: 2px;
          filter: blur(1px);
          animation: arc-flash-3d 0.6s ease-in-out infinite;
        }

        @keyframes arc-flash-3d {
          0%, 100% { opacity: 0; transform: scaleX(0.5); }
          15% { opacity: 1; transform: scaleX(1.2); }
          30% { opacity: 0.2; }
          45% { opacity: 0.9; transform: scaleX(1); }
          60% { opacity: 0; }
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
            #3a2a5a 0%, 
            #2a1a4a 30%, 
            #1a0a3a 70%, 
            #2a1a4a 100%);
          border: 3px solid #4a3a6a;
          border-radius: 8px;
          transform: translateZ(-20px);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.8),
            inset 0 2px 10px rgba(150, 100, 255, 0.2),
            inset 0 -2px 10px rgba(0, 0, 0, 0.5);
        }

        .board-edge {
          position: absolute;
          background: linear-gradient(to bottom, #4a3a6a, #2a1a4a);
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

        .corner-stone {
          position: absolute;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #5a4a7a 0%, #3a2a5a 100%);
          border: 2px solid #6a5a8a;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: rgba(200, 150, 255, 0.9);
          text-shadow: 0 0 8px rgba(150, 100, 255, 0.8);
          box-shadow: 
            0 0 10px rgba(150, 100, 255, 0.5),
            inset 0 1px 3px rgba(255, 255, 255, 0.1);
          animation: corner-pulse 3s ease-in-out infinite;
        }

        .corner-nw { top: -6px; left: -6px; }
        .corner-ne { top: -6px; right: -6px; }
        .corner-sw { bottom: -6px; left: -6px; }
        .corner-se { bottom: -6px; right: -6px; }

        @keyframes corner-pulse {
          0%, 100% { box-shadow: 0 0 10px rgba(150, 100, 255, 0.5); }
          50% { box-shadow: 0 0 20px rgba(150, 100, 255, 0.8), 0 0 30px rgba(100, 50, 200, 0.4); }
        }

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
            rgba(180, 160, 200, 0.9) 0%, 
            rgba(160, 140, 180, 0.85) 50%, 
            rgba(140, 120, 160, 0.9) 100%);
          box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.2);
        }

        .chess-3d-square.dark {
          background: linear-gradient(145deg, 
            rgba(80, 60, 120, 0.95) 0%, 
            rgba(60, 40, 100, 0.9) 50%, 
            rgba(50, 30, 80, 0.95) 100%);
          box-shadow: inset 0 0 8px rgba(100, 70, 150, 0.3);
        }

        .chess-3d-square:hover {
          transform: translateZ(3px);
          box-shadow: 0 0 15px rgba(150, 100, 255, 0.4);
        }

        .chess-3d-square.selected {
          background: linear-gradient(145deg, 
            rgba(100, 200, 150, 0.7) 0%, 
            rgba(80, 180, 130, 0.6) 100%) !important;
          box-shadow: 0 0 20px rgba(100, 255, 150, 0.6);
        }

        .chess-3d-square.legal-move {
          cursor: pointer;
        }

        .square-engraving {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .square-rune {
          font-size: 10px;
          color: rgba(150, 100, 200, 0.3);
          animation: square-rune-glow 4s ease-in-out infinite;
        }

        @keyframes square-rune-glow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
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
            rgba(150, 100, 255, 0.8) 0%, 
            rgba(100, 50, 200, 0.4) 60%, 
            transparent 100%);
          border-radius: 50%;
          animation: legal-pulse 1s ease-in-out infinite;
        }

        .legal-capture-indicator {
          position: absolute;
          inset: 2px;
          border: 3px solid rgba(255, 100, 100, 0.6);
          border-radius: 50%;
          animation: capture-pulse 1s ease-in-out infinite;
        }

        @keyframes legal-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
        }

        @keyframes capture-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        /* ═══ CHESS PIECES ═══ */
        .chess-piece-3d {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 90%;
          height: 90%;
          transform-style: preserve-3d;
          transition: transform 0.2s ease;
          cursor: pointer;
          z-index: 10;
        }

        .chess-piece-3d:hover {
          transform: translateZ(8px) scale(1.1);
        }

        .chess-piece-3d.selected {
          transform: translateZ(12px) scale(1.15);
          animation: piece-selected-glow 1s ease-in-out infinite;
        }

        .chess-piece-3d.last-move {
          animation: last-move-highlight 2s ease-in-out infinite;
        }

        @keyframes piece-selected-glow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(100, 255, 150, 0.8)); }
          50% { filter: drop-shadow(0 0 20px rgba(100, 255, 150, 1)); }
        }

        @keyframes last-move-highlight {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(255, 255, 100, 0.6)); }
          50% { filter: drop-shadow(0 0 15px rgba(255, 255, 100, 0.9)); }
        }

        .piece-glow {
          position: absolute;
          inset: -5px;
          background: radial-gradient(circle, 
            rgba(150, 100, 255, 0.3) 0%, 
            transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .piece-base {
          position: absolute;
          bottom: -2px;
          width: 70%;
          height: 8px;
          background: linear-gradient(to bottom, 
            rgba(50, 30, 80, 0.8) 0%, 
            rgba(30, 15, 50, 0.9) 100%);
          border-radius: 50%;
          transform: translateZ(-5px) rotateX(80deg);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
        }

        .piece-symbol {
          font-size: 2.2em;
          line-height: 1;
          transition: all 0.2s ease;
        }

        .piece-symbol.white-piece {
          color: #fff8e8;
          filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.5));
        }

        .piece-symbol.black-piece {
          color: #2a1a4a;
          filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
        }

        .piece-rune-engraving {
          position: absolute;
          bottom: 0;
          font-size: 8px;
          color: rgba(150, 100, 255, 0.6);
          text-shadow: 0 0 4px rgba(150, 100, 255, 0.8);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .chess-piece-3d:hover .piece-rune-engraving {
          opacity: 1;
        }

        /* ═══ BOARD COORDINATES ═══ */
        .board-coordinates-3d {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .coord-file {
          position: absolute;
          bottom: -20px;
          transform: translateX(-50%);
          font-family: 'Orbitron', sans-serif;
          font-size: 10px;
          color: rgba(200, 150, 255, 0.7);
          text-shadow: 0 0 5px rgba(150, 100, 255, 0.5);
        }

        .coord-rank {
          position: absolute;
          left: -18px;
          transform: translateY(-50%);
          font-family: 'Orbitron', sans-serif;
          font-size: 10px;
          color: rgba(200, 150, 255, 0.7);
          text-shadow: 0 0 5px rgba(150, 100, 255, 0.5);
        }

        /* ═══ CENTER SEAL ═══ */
        .board-center-seal {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 1;
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

        .thinking-seal {
          position: relative;
        }

        .thinking-text {
          font-family: 'Orbitron', sans-serif;
          font-size: 11px;
          color: rgba(200, 150, 255, 0.9);
          text-shadow: 0 0 10px rgba(150, 100, 255, 0.8);
          letter-spacing: 3px;
          animation: thinking-pulse 1s ease-in-out infinite;
        }

        @keyframes thinking-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        /* ═══ ROTATION HINT ═══ */
        .rotation-hint {
          position: absolute;
          bottom: 5px;
          right: 10px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 10px;
          color: rgba(150, 130, 180, 0.5);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default Chess3DMode;
