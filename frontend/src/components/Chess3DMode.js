import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// CHESS 3D MODE - ALPHAZERO HIDDEN MASTER AESTHETIC
// Highly sophisticated 3D chess board with rune-engraved chains,
// complex magic seals, and the overwhelming AlphaZero visual signature
// SEAL-STYLE CHAIN PLACEMENT - Matching HiddenMasterLock aesthetic
// ═══════════════════════════════════════════════════════════════════════════════

// Rune symbols matching the HiddenMasterLock seal
const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];

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
// TRUE 3D CHAIN LINK COMPONENT - Sophisticated seal-style design
// ═══════════════════════════════════════════════════════════════════════════════
const ChainLink3D = ({ rune, delay, size = 'normal' }) => {
  const sizeStyles = {
    small: { width: 14, height: 10, fontSize: 6 },
    normal: { width: 18, height: 13, fontSize: 7 },
    large: { width: 22, height: 16, fontSize: 9 }
  };
  const s = sizeStyles[size] || sizeStyles.normal;
  
  return (
    <div 
      className="true-chain-link-3d"
      style={{
        width: s.width,
        height: s.height,
        animationDelay: `${delay}s`
      }}
    >
      {/* 3D Chain torus effect */}
      <div className="chain-torus-outer" />
      <div className="chain-torus-inner" />
      <div className="chain-torus-shine" />
      <div className="chain-rune-container">
        <span style={{ fontSize: s.fontSize }}>{rune}</span>
      </div>
      <div className="chain-electric-spark" />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SOPHISTICATED SEAL-STYLE CHAIN RING - Concentric pattern like HiddenMasterLock
// ═══════════════════════════════════════════════════════════════════════════════
const SealChainRing = ({ radius, linkCount, rotationSpeed, reverse, baseDelay = 0 }) => {
  const chains = useMemo(() => {
    return Array.from({ length: linkCount }, (_, i) => {
      const angle = (i / linkCount) * 360;
      return {
        angle,
        rune: RUNES[i % RUNES.length],
        delay: baseDelay + i * 0.05
      };
    });
  }, [linkCount, baseDelay]);

  return (
    <div 
      className="seal-chain-ring"
      style={{
        width: radius * 2,
        height: radius * 2,
        animation: `seal-ring-rotate ${rotationSpeed}s linear infinite ${reverse ? 'reverse' : ''}`
      }}
    >
      {chains.map((chain, i) => (
        <div
          key={i}
          className="seal-chain-link-wrapper"
          style={{
            transform: `rotate(${chain.angle}deg) translateY(${-radius + 9}px)`
          }}
        >
          <ChainLink3D rune={chain.rune} delay={chain.delay} size="small" />
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SOPHISTICATED CROSS CHAIN - Seal binding pattern
// ═══════════════════════════════════════════════════════════════════════════════
const CrossChain = ({ length, direction, offset = 0 }) => {
  const links = useMemo(() => {
    return Array.from({ length }, (_, i) => ({
      rune: RUNES[(i + offset) % RUNES.length],
      delay: i * 0.06
    }));
  }, [length, offset]);

  const isVertical = direction === 'vertical';
  
  return (
    <div 
      className="cross-chain-3d"
      style={{
        flexDirection: isVertical ? 'column' : 'row'
      }}
    >
      {links.map((link, i) => (
        <ChainLink3D key={i} rune={link.rune} delay={link.delay} size="normal" />
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
// TRUE 3D CHESS PIECE - CSS-based 3D rendering (NOT emoji)
// Sophisticated geometric shapes with depth, lighting, and materials
// ═══════════════════════════════════════════════════════════════════════════════
const ChessPiece3D = ({ piece, square, isSelected, onClick, lastMove, playerColor }) => {
  if (!piece) return null;
  
  const isWhite = piece[0] === 'w';
  const pieceType = piece[1]; // K, Q, R, B, N, P
  const isLastMoveSquare = lastMove && (lastMove.from === square || lastMove.to === square);
  
  // Get piece component based on type
  const PieceGeometry = () => {
    switch(pieceType) {
      case 'K': return <KingPiece3D isWhite={isWhite} />;
      case 'Q': return <QueenPiece3D isWhite={isWhite} />;
      case 'R': return <RookPiece3D isWhite={isWhite} />;
      case 'B': return <BishopPiece3D isWhite={isWhite} />;
      case 'N': return <KnightPiece3D isWhite={isWhite} />;
      case 'P': return <PawnPiece3D isWhite={isWhite} />;
      default: return <PawnPiece3D isWhite={isWhite} />;
    }
  };
  
  return (
    <div 
      className={`chess-piece-3d-true ${isSelected ? 'selected' : ''} ${isLastMoveSquare ? 'last-move' : ''}`}
      onClick={onClick}
      data-testid={`piece-${square}`}
    >
      <div className="piece-shadow-3d" />
      <div className={`piece-container-3d ${isWhite ? 'white-piece-3d' : 'black-piece-3d'}`}>
        <PieceGeometry />
      </div>
      {/* Rune engraving on piece base */}
      <div className="piece-rune-engraving-3d">
        {RUNES[(square.charCodeAt(0) + square.charCodeAt(1)) % RUNES.length]}
      </div>
      {/* Selection aura */}
      {isSelected && <div className="piece-selection-aura" />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// INDIVIDUAL 3D PIECE COMPONENTS - True 3D appearance using CSS
// ═══════════════════════════════════════════════════════════════════════════════

// KING - The AlphaZero Seal - Supreme with cross
const KingPiece3D = ({ isWhite }) => (
  <div className="piece-3d king-3d">
    {/* Base */}
    <div className={`piece-base-cylinder ${isWhite ? 'white' : 'black'}`} />
    {/* Body */}
    <div className={`piece-body-tapered ${isWhite ? 'white' : 'black'}`} />
    {/* Crown band */}
    <div className="piece-crown-band" />
    {/* THE CROSS - AlphaZero symbol */}
    <div className="king-cross-vertical" />
    <div className="king-cross-horizontal" />
    <div className="king-cross-orb" />
    {/* Glow aura */}
    <div className="piece-glow-aura king-aura" />
  </div>
);

// QUEEN - Neural Empress with crown spires
const QueenPiece3D = ({ isWhite }) => (
  <div className="piece-3d queen-3d">
    {/* Base */}
    <div className={`piece-base-cylinder ${isWhite ? 'white' : 'black'}`} />
    {/* Body */}
    <div className={`piece-body-elegant ${isWhite ? 'white' : 'black'}`} />
    {/* Crown spires */}
    <div className="queen-crown-container">
      {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
        <div key={angle} className="queen-spire" style={{ transform: `rotate(${angle}deg) translateY(-8px)` }} />
      ))}
    </div>
    {/* Central orb */}
    <div className="queen-central-orb" />
    <div className="piece-glow-aura queen-aura" />
  </div>
);

// ROOK - Monolithic Obelisk (NO tower)
const RookPiece3D = ({ isWhite }) => (
  <div className="piece-3d rook-3d">
    {/* Base */}
    <div className={`piece-base-cylinder wide ${isWhite ? 'white' : 'black'}`} />
    {/* Monolith body */}
    <div className={`piece-body-monolith ${isWhite ? 'white' : 'black'}`} />
    {/* Cap */}
    <div className={`piece-cap-flat ${isWhite ? 'white' : 'black'}`} />
    {/* Octahedron crown */}
    <div className="rook-octahedron" />
    <div className="piece-glow-aura rook-aura" />
  </div>
);

// BISHOP - Neural Spire with mitre
const BishopPiece3D = ({ isWhite }) => (
  <div className="piece-3d bishop-3d">
    {/* Base */}
    <div className={`piece-base-cylinder ${isWhite ? 'white' : 'black'}`} />
    {/* Body */}
    <div className={`piece-body-tapered ${isWhite ? 'white' : 'black'}`} />
    {/* Mitre dome */}
    <div className={`bishop-mitre ${isWhite ? 'white' : 'black'}`} />
    {/* Spire */}
    <div className="bishop-spire" />
    {/* Tip orb */}
    <div className="bishop-tip-orb" />
    <div className="piece-glow-aura bishop-aura" />
  </div>
);

// KNIGHT - Neural Algorithm Beast
const KnightPiece3D = ({ isWhite }) => (
  <div className="piece-3d knight-3d">
    {/* Base */}
    <div className={`piece-base-cylinder ${isWhite ? 'white' : 'black'}`} />
    {/* Body stem */}
    <div className={`knight-body-stem ${isWhite ? 'white' : 'black'}`} />
    {/* Abstract head */}
    <div className={`knight-head-abstract ${isWhite ? 'white' : 'black'}`} />
    {/* Neural crest */}
    <div className="knight-crest" />
    {/* Eye sensor */}
    <div className={`knight-eye ${isWhite ? 'cyan' : 'red'}`} />
    <div className="piece-glow-aura knight-aura" />
  </div>
);

// PAWN - Neural Node Sentinel
const PawnPiece3D = ({ isWhite }) => (
  <div className="piece-3d pawn-3d">
    {/* Base */}
    <div className={`piece-base-cylinder small ${isWhite ? 'white' : 'black'}`} />
    {/* Stem */}
    <div className={`pawn-stem ${isWhite ? 'white' : 'black'}`} />
    {/* Sphere head */}
    <div className={`pawn-sphere ${isWhite ? 'white' : 'black'}`} />
    {/* Inner glow */}
    <div className="pawn-inner-glow" />
    <div className="piece-glow-aura pawn-aura" />
  </div>
);

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

      {/* ═══ SOPHISTICATED SEAL-STYLE CHAIN SYSTEM ═══ */}
      {/* Concentric chain rings - like HiddenMasterLock seal */}
      <div className="seal-chain-system">
        {/* Outer chain ring */}
        <SealChainRing radius={boardSize * 0.65} linkCount={32} rotationSpeed={40} reverse={false} baseDelay={0} />
        {/* Middle chain ring */}
        <SealChainRing radius={boardSize * 0.52} linkCount={24} rotationSpeed={35} reverse={true} baseDelay={0.5} />
        {/* Inner chain ring */}
        <SealChainRing radius={boardSize * 0.40} linkCount={16} rotationSpeed={30} reverse={false} baseDelay={1} />
        
        {/* Cross chains - binding pattern */}
        <div className="cross-chains-container">
          {/* Horizontal cross chain */}
          <div className="cross-chain-position horizontal">
            <CrossChain length={14} direction="horizontal" offset={0} />
          </div>
          {/* Vertical cross chain */}
          <div className="cross-chain-position vertical">
            <CrossChain length={14} direction="vertical" offset={12} />
          </div>
          {/* Diagonal chains */}
          <div className="cross-chain-position diagonal-1">
            <CrossChain length={10} direction="horizontal" offset={4} />
          </div>
          <div className="cross-chain-position diagonal-2">
            <CrossChain length={10} direction="horizontal" offset={8} />
          </div>
        </div>
        
        {/* Corner anchor chains */}
        <div className="corner-anchor-chains">
          <div className="corner-chain corner-tl">
            {[0,1,2,3].map(i => <ChainLink3D key={i} rune={RUNES[i]} delay={i*0.1} size="normal" />)}
          </div>
          <div className="corner-chain corner-tr">
            {[4,5,6,7].map(i => <ChainLink3D key={i} rune={RUNES[i]} delay={i*0.1} size="normal" />)}
          </div>
          <div className="corner-chain corner-bl">
            {[8,9,10,11].map(i => <ChainLink3D key={i} rune={RUNES[i]} delay={i*0.1} size="normal" />)}
          </div>
          <div className="corner-chain corner-br">
            {[12,13,14,15].map(i => <ChainLink3D key={i} rune={RUNES[i]} delay={i*0.1} size="normal" />)}
          </div>
        </div>
      </div>

      {/* Electric arcs effect */}
      <div className="electric-arcs-3d">
        {Array.from({ length: 8 }, (_, i) => (
          <div 
            key={i}
            className="electric-arc-3d"
            style={{
              left: `${15 + (i * 10)}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.2}s`,
              transform: `rotate(${i * 45}deg)`
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

        @keyframes seal-ring-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes rune-glow-3d {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        /* ═══ SOPHISTICATED SEAL-STYLE CHAIN SYSTEM ═══ */
        .seal-chain-system {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 2;
        }

        .seal-chain-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
        }

        .seal-chain-link-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-origin: center center;
        }

        /* TRUE 3D CHAIN LINK */
        .true-chain-link-3d {
          position: relative;
          border-radius: 50%;
          background: linear-gradient(145deg, 
            #5a3a8a 0%, 
            #3a2a5a 25%,
            #2a1a4a 50%, 
            #1a0a3a 75%,
            #3a2a5a 100%);
          border: 2px solid #4a3a6a;
          box-shadow: 
            inset 0 2px 4px rgba(180, 130, 255, 0.4),
            inset 0 -2px 4px rgba(0, 0, 0, 0.8),
            0 0 8px rgba(150, 100, 255, 0.6),
            0 0 15px rgba(100, 50, 200, 0.4),
            0 2px 4px rgba(0, 0, 0, 0.6);
          animation: chain-link-pulse 2s ease-in-out infinite;
          transform-style: preserve-3d;
        }

        .chain-torus-outer {
          position: absolute;
          inset: -1px;
          border-radius: 50%;
          border: 2px solid rgba(150, 100, 255, 0.5);
          background: transparent;
        }

        .chain-torus-inner {
          position: absolute;
          inset: 2px;
          border-radius: 50%;
          background: radial-gradient(ellipse at 30% 30%, 
            rgba(100, 70, 150, 0.6) 0%,
            rgba(40, 20, 80, 0.8) 50%,
            rgba(20, 10, 40, 0.9) 100%);
        }

        .chain-torus-shine {
          position: absolute;
          top: 2px;
          left: 20%;
          width: 40%;
          height: 30%;
          background: linear-gradient(180deg, 
            rgba(255, 255, 255, 0.3) 0%,
            transparent 100%);
          border-radius: 50%;
        }

        .chain-rune-container {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(220, 180, 255, 0.95);
          text-shadow: 
            0 0 4px rgba(200, 150, 255, 1),
            0 0 8px rgba(150, 100, 255, 0.8);
          font-family: serif;
        }

        .chain-electric-spark {
          position: absolute;
          top: 50%;
          right: -6px;
          width: 8px;
          height: 2px;
          background: linear-gradient(90deg, 
            rgba(200, 150, 255, 0.9) 0%, 
            rgba(255, 220, 255, 1) 50%, 
            transparent 100%);
          transform: translateY(-50%);
          animation: spark-flicker 0.4s ease-in-out infinite;
          filter: blur(0.5px);
        }

        @keyframes chain-link-pulse {
          0%, 100% { 
            box-shadow: 
              inset 0 2px 4px rgba(180, 130, 255, 0.4),
              inset 0 -2px 4px rgba(0, 0, 0, 0.8),
              0 0 8px rgba(150, 100, 255, 0.6),
              0 0 15px rgba(100, 50, 200, 0.4);
          }
          50% { 
            box-shadow: 
              inset 0 2px 4px rgba(200, 150, 255, 0.6),
              inset 0 -2px 4px rgba(0, 0, 0, 0.8),
              0 0 15px rgba(180, 130, 255, 0.8),
              0 0 25px rgba(130, 80, 230, 0.5),
              0 0 35px rgba(100, 50, 200, 0.3);
          }
        }

        @keyframes spark-flicker {
          0%, 100% { opacity: 0.2; transform: translateY(-50%) scaleX(0.5); }
          25% { opacity: 1; transform: translateY(-50%) scaleX(1.3); }
          50% { opacity: 0; }
          75% { opacity: 0.7; transform: translateY(-50%) scaleX(1); }
        }

        /* Cross chains container */
        .cross-chains-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
        }

        .cross-chain-3d {
          display: flex;
          gap: 2px;
          align-items: center;
          justify-content: center;
        }

        .cross-chain-position {
          position: absolute;
        }

        .cross-chain-position.horizontal {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .cross-chain-position.vertical {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .cross-chain-position.diagonal-1 {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .cross-chain-position.diagonal-2 {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
        }

        /* Corner anchor chains */
        .corner-anchor-chains {
          position: absolute;
          inset: -15px;
        }

        .corner-chain {
          position: absolute;
          display: flex;
          gap: 2px;
        }

        .corner-chain.corner-tl {
          top: 0;
          left: 0;
          transform: rotate(-45deg);
        }

        .corner-chain.corner-tr {
          top: 0;
          right: 0;
          transform: rotate(45deg);
        }

        .corner-chain.corner-bl {
          bottom: 0;
          left: 0;
          transform: rotate(45deg);
        }

        .corner-chain.corner-br {
          bottom: 0;
          right: 0;
          transform: rotate(-45deg);
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

        /* ═══ TRUE 3D CHESS PIECES ═══ */
        .chess-piece-3d-true {
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

        .chess-piece-3d-true:hover {
          transform: translateZ(8px) scale(1.08);
        }

        .chess-piece-3d-true.selected {
          transform: translateZ(12px) scale(1.12);
          animation: piece-selected-glow-3d 1s ease-in-out infinite;
        }

        .chess-piece-3d-true.last-move {
          animation: last-move-highlight-3d 2s ease-in-out infinite;
        }

        @keyframes piece-selected-glow-3d {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(100, 255, 150, 0.8)); }
          50% { filter: drop-shadow(0 0 20px rgba(100, 255, 150, 1)); }
        }

        @keyframes last-move-highlight-3d {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(255, 255, 100, 0.6)); }
          50% { filter: drop-shadow(0 0 15px rgba(255, 255, 100, 0.9)); }
        }

        .piece-shadow-3d {
          position: absolute;
          bottom: -2px;
          width: 70%;
          height: 10px;
          background: radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%);
          border-radius: 50%;
          transform: translateZ(-5px) rotateX(80deg);
        }

        .piece-container-3d {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
        }

        .piece-rune-engraving-3d {
          position: absolute;
          bottom: 0;
          font-size: 8px;
          color: rgba(150, 100, 255, 0.6);
          text-shadow: 0 0 4px rgba(150, 100, 255, 0.8);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .chess-piece-3d-true:hover .piece-rune-engraving-3d {
          opacity: 1;
        }

        .piece-selection-aura {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: radial-gradient(circle, 
            rgba(100, 255, 150, 0.3) 0%, 
            transparent 70%);
          animation: aura-pulse-3d 1.5s ease-in-out infinite;
        }

        @keyframes aura-pulse-3d {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 0.9; }
        }

        /* ═══ 3D PIECE GEOMETRIES ═══ */
        .piece-3d {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          transform-style: preserve-3d;
        }

        /* Base cylinder */
        .piece-base-cylinder {
          width: 65%;
          height: 12%;
          border-radius: 50%;
          position: relative;
          transform: translateY(2px);
        }

        .piece-base-cylinder.white {
          background: linear-gradient(135deg, 
            #f8f0ff 0%, 
            #e8dff8 30%, 
            #d0c0e8 60%, 
            #e0d0f0 100%);
          box-shadow: 
            inset 0 2px 4px rgba(255, 255, 255, 0.8),
            inset 0 -3px 6px rgba(100, 70, 150, 0.3),
            0 3px 8px rgba(0, 0, 0, 0.5),
            0 0 12px rgba(150, 100, 255, 0.3);
        }

        .piece-base-cylinder.black {
          background: linear-gradient(135deg, 
            #3a2a5a 0%, 
            #2a1a4a 30%, 
            #1a0a3a 60%, 
            #2a1a4a 100%);
          box-shadow: 
            inset 0 2px 4px rgba(150, 100, 255, 0.3),
            inset 0 -3px 6px rgba(0, 0, 0, 0.8),
            0 3px 8px rgba(0, 0, 0, 0.7),
            0 0 12px rgba(191, 0, 255, 0.4);
        }

        .piece-base-cylinder.wide {
          width: 75%;
        }

        .piece-base-cylinder.small {
          width: 55%;
        }

        /* Tapered body */
        .piece-body-tapered {
          width: 50%;
          height: 40%;
          position: absolute;
          bottom: 12%;
          clip-path: polygon(15% 100%, 85% 100%, 70% 0%, 30% 0%);
        }

        .piece-body-tapered.white {
          background: linear-gradient(135deg, 
            #f8f0ff 0%, 
            #e8dff8 40%, 
            #d8c8f0 100%);
          box-shadow: 
            inset 3px 0 6px rgba(255, 255, 255, 0.4),
            inset -3px 0 6px rgba(100, 70, 150, 0.2);
        }

        .piece-body-tapered.black {
          background: linear-gradient(135deg, 
            #4a3a6a 0%, 
            #2a1a4a 40%, 
            #1a0a3a 100%);
          box-shadow: 
            inset 3px 0 6px rgba(150, 100, 255, 0.2),
            inset -3px 0 6px rgba(0, 0, 0, 0.4);
        }

        /* Elegant body for queen */
        .piece-body-elegant {
          width: 50%;
          height: 45%;
          position: absolute;
          bottom: 12%;
          border-radius: 30% 30% 10% 10%;
        }

        .piece-body-elegant.white {
          background: linear-gradient(135deg, 
            #f8f0ff 0%, 
            #e8dff8 40%, 
            #d8c8f0 100%);
        }

        .piece-body-elegant.black {
          background: linear-gradient(135deg, 
            #4a3a6a 0%, 
            #2a1a4a 40%, 
            #1a0a3a 100%);
        }

        /* Monolith body for rook */
        .piece-body-monolith {
          width: 55%;
          height: 50%;
          position: absolute;
          bottom: 12%;
          border-radius: 8% 8% 0 0;
        }

        .piece-body-monolith.white {
          background: linear-gradient(135deg, 
            #f8f0ff 0%, 
            #e8dff8 40%, 
            #d8c8f0 100%);
        }

        .piece-body-monolith.black {
          background: linear-gradient(135deg, 
            #4a3a6a 0%, 
            #2a1a4a 40%, 
            #1a0a3a 100%);
        }

        /* Flat cap for rook */
        .piece-cap-flat {
          width: 60%;
          height: 10%;
          position: absolute;
          top: 25%;
          border-radius: 4px;
        }

        .piece-cap-flat.white {
          background: linear-gradient(180deg, #f8f0ff, #e8dff8);
        }

        .piece-cap-flat.black {
          background: linear-gradient(180deg, #4a3a6a, #2a1a4a);
        }

        /* Crown band */
        .piece-crown-band {
          width: 45%;
          height: 8%;
          position: absolute;
          top: 28%;
          border-radius: 50%;
          background: linear-gradient(135deg, 
            #ffcc00 0%, 
            #ff9900 50%, 
            #ffcc00 100%);
          box-shadow: 
            0 0 10px rgba(255, 200, 50, 0.8),
            inset 0 1px 2px rgba(255, 255, 255, 0.6);
        }

        /* King cross */
        .king-cross-vertical {
          width: 8%;
          height: 25%;
          position: absolute;
          top: 8%;
          background: linear-gradient(180deg, 
            #ffcc00 0%, 
            #ffaa00 50%, 
            #ffcc00 100%);
          box-shadow: 
            0 0 8px rgba(255, 200, 50, 0.9),
            0 0 15px rgba(255, 180, 0, 0.5);
          border-radius: 2px;
        }

        .king-cross-horizontal {
          width: 22%;
          height: 8%;
          position: absolute;
          top: 15%;
          background: linear-gradient(90deg, 
            #ffcc00 0%, 
            #ffaa00 50%, 
            #ffcc00 100%);
          box-shadow: 
            0 0 8px rgba(255, 200, 50, 0.9),
            0 0 15px rgba(255, 180, 0, 0.5);
          border-radius: 2px;
        }

        .king-cross-orb {
          width: 12%;
          height: 12%;
          position: absolute;
          top: 12%;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, 
            #ffffff 0%, 
            #ffee88 40%, 
            #ffcc00 100%);
          box-shadow: 
            0 0 15px rgba(255, 255, 255, 0.9),
            0 0 25px rgba(255, 200, 50, 0.7);
        }

        /* Queen crown */
        .queen-crown-container {
          position: absolute;
          top: 15%;
          width: 45%;
          height: 20%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .queen-spire {
          position: absolute;
          width: 6%;
          height: 80%;
          background: linear-gradient(180deg, 
            #ffcc00 0%, 
            #ffaa00 100%);
          border-radius: 2px 2px 0 0;
          transform-origin: bottom center;
          box-shadow: 0 0 6px rgba(255, 200, 50, 0.7);
        }

        .queen-central-orb {
          width: 18%;
          height: 18%;
          position: absolute;
          top: 8%;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, 
            #ffee88 0%, 
            #ffcc00 60%, 
            #ff9900 100%);
          box-shadow: 
            0 0 12px rgba(255, 200, 50, 0.9),
            0 0 20px rgba(255, 180, 0, 0.5);
        }

        /* Rook octahedron */
        .rook-octahedron {
          width: 16%;
          height: 16%;
          position: absolute;
          top: 12%;
          background: linear-gradient(135deg, 
            #ffcc00 0%, 
            #ff9900 100%);
          transform: rotate(45deg);
          box-shadow: 
            0 0 10px rgba(255, 200, 50, 0.9),
            inset 2px 2px 4px rgba(255, 255, 255, 0.4);
        }

        /* Bishop mitre */
        .bishop-mitre {
          width: 40%;
          height: 25%;
          position: absolute;
          top: 25%;
          border-radius: 50% 50% 0 0;
        }

        .bishop-mitre.white {
          background: linear-gradient(180deg, #f8f0ff, #e8dff8);
        }

        .bishop-mitre.black {
          background: linear-gradient(180deg, #4a3a6a, #2a1a4a);
        }

        .bishop-spire {
          width: 6%;
          height: 20%;
          position: absolute;
          top: 8%;
          background: linear-gradient(180deg, 
            #e8dff8 0%, 
            #d0c0e8 100%);
          clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
        }

        .bishop-tip-orb {
          width: 10%;
          height: 10%;
          position: absolute;
          top: 5%;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, 
            #ffee88 0%, 
            #ffcc00 100%);
          box-shadow: 0 0 8px rgba(255, 200, 50, 0.8);
        }

        /* Knight */
        .knight-body-stem {
          width: 45%;
          height: 35%;
          position: absolute;
          bottom: 12%;
          border-radius: 20%;
        }

        .knight-body-stem.white {
          background: linear-gradient(135deg, #f8f0ff, #e8dff8);
        }

        .knight-body-stem.black {
          background: linear-gradient(135deg, #4a3a6a, #2a1a4a);
        }

        .knight-head-abstract {
          width: 40%;
          height: 30%;
          position: absolute;
          top: 20%;
          transform: rotate(20deg);
          border-radius: 30% 70% 30% 10%;
        }

        .knight-head-abstract.white {
          background: linear-gradient(135deg, #f8f0ff, #e8dff8);
        }

        .knight-head-abstract.black {
          background: linear-gradient(135deg, #4a3a6a, #2a1a4a);
        }

        .knight-crest {
          width: 15%;
          height: 20%;
          position: absolute;
          top: 12%;
          left: 55%;
          transform: rotate(-10deg);
          clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
          background: linear-gradient(180deg, #d0c0e8, #b0a0d0);
        }

        .knight-eye {
          width: 12%;
          height: 12%;
          position: absolute;
          top: 28%;
          left: 35%;
          border-radius: 50%;
          box-shadow: 
            0 0 10px currentColor,
            0 0 20px currentColor;
        }

        .knight-eye.cyan {
          background: radial-gradient(circle, #00ffff, #0088aa);
          color: #00ffff;
        }

        .knight-eye.red {
          background: radial-gradient(circle, #ff4444, #aa0000);
          color: #ff0040;
        }

        /* Pawn */
        .pawn-stem {
          width: 35%;
          height: 30%;
          position: absolute;
          bottom: 12%;
          border-radius: 20% 20% 0 0;
        }

        .pawn-stem.white {
          background: linear-gradient(135deg, #f8f0ff, #e8dff8);
        }

        .pawn-stem.black {
          background: linear-gradient(135deg, #4a3a6a, #2a1a4a);
        }

        .pawn-sphere {
          width: 38%;
          height: 38%;
          position: absolute;
          top: 18%;
          border-radius: 50%;
        }

        .pawn-sphere.white {
          background: radial-gradient(circle at 30% 30%, 
            #ffffff 0%, 
            #f8f0ff 30%, 
            #e8dff8 60%, 
            #d8c8f0 100%);
          box-shadow: 
            inset 3px 3px 8px rgba(255, 255, 255, 0.8),
            inset -2px -2px 6px rgba(100, 70, 150, 0.2),
            0 0 15px rgba(150, 100, 255, 0.3);
        }

        .pawn-sphere.black {
          background: radial-gradient(circle at 30% 30%, 
            #5a4a7a 0%, 
            #3a2a5a 30%, 
            #2a1a4a 60%, 
            #1a0a3a 100%);
          box-shadow: 
            inset 3px 3px 8px rgba(150, 100, 255, 0.3),
            inset -2px -2px 6px rgba(0, 0, 0, 0.5),
            0 0 15px rgba(191, 0, 255, 0.4);
        }

        .pawn-inner-glow {
          width: 20%;
          height: 20%;
          position: absolute;
          top: 27%;
          border-radius: 50%;
          background: radial-gradient(circle, 
            rgba(255, 200, 255, 0.8) 0%, 
            transparent 70%);
          animation: inner-glow-pulse 2s ease-in-out infinite;
        }

        @keyframes inner-glow-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.2); }
        }

        /* Piece glow auras */
        .piece-glow-aura {
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          pointer-events: none;
          opacity: 0.4;
        }

        .king-aura {
          background: radial-gradient(circle, rgba(255, 200, 50, 0.4) 0%, transparent 70%);
        }

        .queen-aura {
          background: radial-gradient(circle, rgba(255, 180, 100, 0.3) 0%, transparent 70%);
        }

        .rook-aura {
          background: radial-gradient(circle, rgba(150, 100, 255, 0.3) 0%, transparent 70%);
        }

        .bishop-aura {
          background: radial-gradient(circle, rgba(200, 150, 255, 0.3) 0%, transparent 70%);
        }

        .knight-aura {
          background: radial-gradient(circle, rgba(100, 200, 255, 0.3) 0%, transparent 70%);
        }

        .pawn-aura {
          background: radial-gradient(circle, rgba(180, 150, 220, 0.25) 0%, transparent 70%);
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
