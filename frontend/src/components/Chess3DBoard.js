import React, { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Chess3DBoard - Sophisticated 3D Chess Board for AlphaZero Hidden Master
 * 
 * A highly sophisticated 3D chess view that echoes the neural network aesthetics
 * of AlphaZero. Features clean, elegant design with subtle neural connections,
 * smooth animations, and a premium feel.
 * 
 * This component is MODULAR and can be removed without affecting other files.
 */

// Neural path data for the elegant background effect
const NEURAL_PATHS = [
  { x1: 10, y1: 20, x2: 90, y2: 80 },
  { x1: 20, y1: 70, x2: 80, y2: 30 },
  { x1: 50, y1: 10, x2: 50, y2: 90 },
  { x1: 15, y1: 50, x2: 85, y2: 50 },
];

// Piece unicode symbols
const PIECE_SYMBOLS = {
  wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
  bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟',
};

// Parse FEN to get piece positions
const parseFEN = (fen) => {
  const pieces = {};
  const [position] = fen.split(' ');
  const rows = position.split('/');
  
  rows.forEach((row, rowIndex) => {
    let colIndex = 0;
    for (let char of row) {
      if (isNaN(char)) {
        const color = char === char.toUpperCase() ? 'w' : 'b';
        const piece = char.toUpperCase();
        const pieceKey = color + piece;
        const square = String.fromCharCode(97 + colIndex) + (8 - rowIndex);
        pieces[square] = pieceKey;
        colIndex++;
      } else {
        colIndex += parseInt(char);
      }
    }
  });
  
  return pieces;
};

// Square color helper
const isLightSquare = (file, rank) => {
  const fileIndex = file.charCodeAt(0) - 97;
  return (fileIndex + rank) % 2 === 1;
};

const Chess3DBoard = ({
  position,
  boardOrientation = 'white',
  onSquareClick,
  selectedSquare,
  lastMove,
  validMoves = [],
  isThinking = false,
  boardSize = 400,
}) => {
  const [hoverSquare, setHoverSquare] = useState(null);
  const [animatingPiece, setAnimatingPiece] = useState(null);

  // Memoize parsed pieces
  const pieces = useMemo(() => parseFEN(position), [position]);

  // Generate board squares
  const squares = useMemo(() => {
    const result = [];
    const files = boardOrientation === 'white' 
      ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
      : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
    const ranks = boardOrientation === 'white'
      ? [8, 7, 6, 5, 4, 3, 2, 1]
      : [1, 2, 3, 4, 5, 6, 7, 8];

    ranks.forEach((rank, rowIndex) => {
      files.forEach((file, colIndex) => {
        const square = file + rank;
        result.push({
          square,
          file,
          rank,
          rowIndex,
          colIndex,
          isLight: isLightSquare(file, rank),
          piece: pieces[square],
        });
      });
    });
    return result;
  }, [boardOrientation, pieces]);

  // Square size calculation
  const squareSize = boardSize / 8;

  // Handle square interaction
  const handleSquareClick = useCallback((square) => {
    if (onSquareClick) {
      onSquareClick(square);
    }
  }, [onSquareClick]);

  // Neural connection animation state
  const [neuralPulse, setNeuralPulse] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setNeuralPulse(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="chess-3d-container"
      style={{
        width: boardSize + 60,
        height: boardSize + 100,
        perspective: '1200px',
        perspectiveOrigin: '50% 40%',
      }}
      data-testid="chess-3d-board"
    >
      {/* Elegant Neural Background - Subtle connections */}
      <svg 
        className="neural-background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.15,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <defs>
          <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bf00ff" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#ff00bf" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffcc00" stopOpacity="0.2" />
          </linearGradient>
          <filter id="neural-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {NEURAL_PATHS.map((path, i) => (
          <g key={i}>
            <line
              x1={`${path.x1}%`}
              y1={`${path.y1}%`}
              x2={`${path.x2}%`}
              y2={`${path.y2}%`}
              stroke="url(#neural-gradient)"
              strokeWidth="1"
              filter="url(#neural-glow)"
              opacity={0.3 + Math.sin((neuralPulse + i * 25) * 0.1) * 0.2}
            />
            {/* Neural nodes */}
            <circle
              cx={`${path.x1}%`}
              cy={`${path.y1}%`}
              r="3"
              fill="#bf00ff"
              opacity={0.4 + Math.sin((neuralPulse + i * 20) * 0.15) * 0.3}
            />
            <circle
              cx={`${path.x2}%`}
              cy={`${path.y2}%`}
              r="3"
              fill="#ffcc00"
              opacity={0.4 + Math.sin((neuralPulse + i * 30) * 0.12) * 0.3}
            />
          </g>
        ))}
      </svg>

      {/* 3D Board Container */}
      <div
        className="board-3d-wrapper"
        style={{
          position: 'relative',
          width: boardSize,
          height: boardSize,
          margin: '30px auto 20px',
          transformStyle: 'preserve-3d',
          transform: 'rotateX(55deg) rotateZ(0deg)',
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Board Surface with Premium Texture */}
        <div
          className="board-surface"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #1a1025 0%, #0d0812 100%)',
            borderRadius: '8px',
            boxShadow: `
              0 30px 60px rgba(0, 0, 0, 0.8),
              0 0 1px rgba(191, 0, 255, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.05)
            `,
            transform: 'translateZ(-5px)',
          }}
        />

        {/* Board Frame - Elegant border */}
        <div
          className="board-frame"
          style={{
            position: 'absolute',
            top: -8,
            left: -8,
            right: -8,
            bottom: -8,
            border: '2px solid rgba(191, 0, 255, 0.3)',
            borderRadius: '12px',
            transform: 'translateZ(-8px)',
            background: 'linear-gradient(135deg, rgba(191, 0, 255, 0.05) 0%, transparent 50%, rgba(255, 204, 0, 0.03) 100%)',
          }}
        />

        {/* Squares Grid */}
        <div
          className="squares-grid"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gridTemplateRows: 'repeat(8, 1fr)',
            borderRadius: '6px',
            overflow: 'hidden',
            transformStyle: 'preserve-3d',
          }}
        >
          {squares.map(({ square, isLight, piece, rowIndex, colIndex }) => {
            const isSelected = selectedSquare === square;
            const isLastMoveSquare = lastMove && (lastMove.from === square || lastMove.to === square);
            const isValidMove = validMoves.includes(square);
            const isHovered = hoverSquare === square;
            
            return (
              <div
                key={square}
                className="chess-square-3d"
                data-testid={`square-${square}`}
                onClick={() => handleSquareClick(square)}
                onMouseEnter={() => setHoverSquare(square)}
                onMouseLeave={() => setHoverSquare(null)}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  background: isLight 
                    ? 'linear-gradient(135deg, #c4b7d4 0%, #a89ab8 100%)'
                    : 'linear-gradient(135deg, #5a4a70 0%, #3d3050 100%)',
                  cursor: 'pointer',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  transform: `translateZ(${isHovered ? 4 : 0}px)`,
                  boxShadow: isSelected 
                    ? 'inset 0 0 0 3px rgba(191, 0, 255, 0.8), inset 0 0 15px rgba(191, 0, 255, 0.3)'
                    : isLastMoveSquare
                    ? 'inset 0 0 0 2px rgba(255, 204, 0, 0.6), inset 0 0 10px rgba(255, 204, 0, 0.2)'
                    : isHovered
                    ? 'inset 0 0 0 2px rgba(255, 255, 255, 0.3)'
                    : 'none',
                }}
              >
                {/* Valid move indicator */}
                {isValidMove && !piece && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '30%',
                      height: '30%',
                      background: 'radial-gradient(circle, rgba(191, 0, 255, 0.6) 0%, rgba(191, 0, 255, 0.2) 70%, transparent 100%)',
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%)',
                      animation: 'pulse-soft 1.5s ease-in-out infinite',
                    }}
                  />
                )}

                {/* Capture indicator */}
                {isValidMove && piece && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: '5%',
                      border: '3px solid rgba(255, 0, 100, 0.6)',
                      borderRadius: '50%',
                      animation: 'pulse-ring 1.5s ease-in-out infinite',
                    }}
                  />
                )}

                {/* Chess Piece */}
                {piece && (
                  <div
                    className="chess-piece-3d"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) translateZ(${isHovered ? 15 : 8}px) rotateX(-55deg)`,
                      fontSize: `${squareSize * 0.75}px`,
                      color: piece[0] === 'w' ? '#fff' : '#1a1025',
                      textShadow: piece[0] === 'w'
                        ? '0 2px 8px rgba(0,0,0,0.5), 0 0 20px rgba(191, 0, 255, 0.3)'
                        : '0 2px 8px rgba(0,0,0,0.8), 0 0 15px rgba(0,0,0,0.5)',
                      filter: piece[0] === 'w' 
                        ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))'
                        : 'drop-shadow(0 4px 6px rgba(0,0,0,0.6))',
                      transition: 'transform 0.2s ease, filter 0.2s ease',
                      cursor: 'grab',
                      userSelect: 'none',
                      zIndex: isHovered ? 10 : 1,
                    }}
                  >
                    {PIECE_SYMBOLS[piece]}
                  </div>
                )}

                {/* Coordinate labels */}
                {colIndex === 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      left: '4px',
                      top: '2px',
                      fontSize: '10px',
                      fontFamily: 'Orbitron, sans-serif',
                      color: isLight ? 'rgba(90, 74, 112, 0.7)' : 'rgba(196, 183, 212, 0.5)',
                      fontWeight: 'bold',
                      transform: 'rotateX(-55deg)',
                      transformOrigin: 'top left',
                    }}
                  >
                    {boardOrientation === 'white' ? 8 - rowIndex : rowIndex + 1}
                  </span>
                )}
                {rowIndex === 7 && (
                  <span
                    style={{
                      position: 'absolute',
                      right: '4px',
                      bottom: '2px',
                      fontSize: '10px',
                      fontFamily: 'Orbitron, sans-serif',
                      color: isLight ? 'rgba(90, 74, 112, 0.7)' : 'rgba(196, 183, 212, 0.5)',
                      fontWeight: 'bold',
                      transform: 'rotateX(-55deg)',
                      transformOrigin: 'bottom right',
                    }}
                  >
                    {boardOrientation === 'white' 
                      ? String.fromCharCode(97 + colIndex)
                      : String.fromCharCode(104 - colIndex)}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Thinking indicator - Neural processing effect */}
        {isThinking && (
          <div
            className="thinking-overlay"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'transparent',
              borderRadius: '6px',
              overflow: 'hidden',
              pointerEvents: 'none',
              zIndex: 20,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '200%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent 0%, rgba(191, 0, 255, 0.1) 25%, rgba(255, 0, 191, 0.15) 50%, rgba(191, 0, 255, 0.1) 75%, transparent 100%)',
                animation: 'neural-scan 2s linear infinite',
              }}
            />
          </div>
        )}
      </div>

      {/* AlphaZero Signature Badge */}
      <div
        className="alphazero-badge"
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          background: 'linear-gradient(135deg, rgba(191, 0, 255, 0.15) 0%, rgba(255, 0, 191, 0.1) 50%, rgba(255, 204, 0, 0.05) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(191, 0, 255, 0.3)',
        }}
      >
        <span
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '10px',
            color: '#bf00ff',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          Neural View
        </span>
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: isThinking 
              ? 'linear-gradient(135deg, #bf00ff, #ff00bf)'
              : '#ffcc00',
            boxShadow: isThinking
              ? '0 0 10px #bf00ff, 0 0 20px rgba(191, 0, 255, 0.5)'
              : '0 0 8px #ffcc00',
            animation: isThinking ? 'pulse-glow 1s ease-in-out infinite' : 'none',
          }}
        />
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
        }
        
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @keyframes neural-scan {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(50%); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            opacity: 0.8;
            box-shadow: 0 0 10px #bf00ff, 0 0 20px rgba(191, 0, 255, 0.5);
          }
          50% { 
            opacity: 1;
            box-shadow: 0 0 15px #bf00ff, 0 0 30px rgba(191, 0, 255, 0.7);
          }
        }
        
        .chess-3d-container {
          position: relative;
          background: linear-gradient(180deg, rgba(15, 10, 25, 0.95) 0%, rgba(10, 5, 18, 0.98) 100%);
          border-radius: 16px;
          padding: 10px;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.6),
            0 0 1px rgba(191, 0, 255, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.03);
        }
        
        .chess-square-3d:hover {
          z-index: 5;
        }
        
        .chess-piece-3d {
          will-change: transform;
        }
        
        .chess-piece-3d:hover {
          filter: brightness(1.2) !important;
        }
      `}</style>
    </div>
  );
};

export default Chess3DBoard;
