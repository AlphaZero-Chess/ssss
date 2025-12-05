import React, { useState, useCallback, useMemo } from 'react';
import './Chess3DBoard.css';

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO 3D CHESS BOARD - Bird's Eye View Edition
// Fighting Style Pieces • Neural Network Aesthetics • No Emojis
// ═══════════════════════════════════════════════════════════════════════

// SVG Chess Pieces - Fighting/Battle Style (No emojis, detailed vectors)
const PIECE_SVGS = {
  // WHITE PIECES - Gold/Light themed battle pieces
  wK: (
    <svg viewBox="0 0 45 45" className="chess-piece-3d white-piece">
      <g fill="none" fillRule="evenodd" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.5 11.63V6M20 8h5" strokeLinejoin="miter"/>
        <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#f0d78c" strokeLinecap="butt" strokeLinejoin="miter"/>
        <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#f0d78c"/>
        <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/>
      </g>
      <circle cx="22.5" cy="11" r="2" fill="#bf00ff" className="piece-core-glow"/>
    </svg>
  ),
  wQ: (
    <svg viewBox="0 0 45 45" className="chess-piece-3d white-piece">
      <g fill="#f0d78c" stroke="#1a1a2e" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm21 4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/>
        <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z" strokeLinecap="butt"/>
        <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" strokeLinecap="butt"/>
        <path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none"/>
      </g>
      <circle cx="22.5" cy="7.5" r="2" fill="#bf00ff" className="piece-core-glow"/>
    </svg>
  ),
  wR: (
    <svg viewBox="0 0 45 45" className="chess-piece-3d white-piece">
      <g fill="#f0d78c" stroke="#1a1a2e" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M9 39h27v-3H9v3zm3-3v-4h21v4H12zm-1-22V9h4v2h5V9h5v2h5V9h4v5" strokeLinecap="butt"/>
        <path d="M34 14l-3 3H14l-3-3"/>
        <path d="M31 17v12.5H14V17" strokeLinecap="butt" strokeLinejoin="miter"/>
        <path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/>
        <path d="M11 14h23" fill="none" strokeLinejoin="miter"/>
      </g>
    </svg>
  ),
  wB: (
    <svg viewBox="0 0 45 45" className="chess-piece-3d white-piece">
      <g fill="none" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <g fill="#f0d78c">
          <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/>
          <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/>
          <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/>
        </g>
        <path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="#1a1a2e" strokeLinejoin="miter"/>
      </g>
    </svg>
  ),
  wN: (
    <svg viewBox="0 0 45 45" className="chess-piece-3d white-piece">
      <g fill="none" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#f0d78c"/>
        <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#f0d78c"/>
        <path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#1a1a2e"/>
      </g>
    </svg>
  ),
  wP: (
    <svg viewBox="0 0 45 45" className="chess-piece-3d white-piece">
      <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#f0d78c" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  
  // BLACK PIECES - Dark/Purple themed battle pieces
  bK: (
    <svg viewBox="0 0 45 45" className="chess-piece-3d black-piece">
      <g fill="none" fillRule="evenodd" stroke="#f0d78c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.5 11.63V6" strokeLinejoin="miter"/>
        <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#1a0a2e" strokeLinecap="butt" strokeLinejoin="miter"/>
        <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#1a0a2e"/>
        <path d="M20 8h5" strokeLinejoin="miter"/>
        <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/>
      </g>
      <circle cx="22.5" cy="11" r="2" fill="#bf00ff" className="piece-core-glow"/>
    </svg>
  ),
  bQ: (
    <svg viewBox="0 0 45 45" className="chess-piece-3d black-piece">
      <g fill="#1a0a2e" stroke="#f0d78c" strokeWidth="1.5" strokeLinejoin="round">
        <circle cx="6" cy="12" r="2.75"/>
        <circle cx="14" cy="9" r="2.75"/>
        <circle cx="22.5" cy="8" r="2.75"/>
        <circle cx="31" cy="9" r="2.75"/>
        <circle cx="39" cy="12" r="2.75"/>
        <path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z" strokeLinecap="butt"/>
        <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" strokeLinecap="butt"/>
        <path d="M11 38.5a35 35 1 0 0 23 0" fill="none" strokeLinecap="butt"/>
        <path d="M11 29a35 35 1 0 1 23 0m-21.5 2.5h20m-21 3a35 35 1 0 0 22 0" fill="none"/>
      </g>
      <circle cx="22.5" cy="8" r="2" fill="#bf00ff" className="piece-core-glow"/>
    </svg>
  ),
  bR: (
    <svg viewBox="0 0 45 45" className="chess-piece-3d black-piece">
      <g fill="#1a0a2e" stroke="#f0d78c" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M9 39h27v-3H9v3zm3.5-7l1.5-2.5h17l1.5 2.5h-20zm-.5 4v-4h21v4H12z" strokeLinecap="butt"/>
        <path d="M14 29.5v-13h17v13H14z" strokeLinecap="butt" strokeLinejoin="miter"/>
        <path d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" strokeLinecap="butt"/>
        <path d="M12 35.5h21m-20-4h19m-18-2h17m-17-13h17M11 14h23" fill="none" stroke="#f0d78c" strokeLinejoin="miter"/>
      </g>
    </svg>
  ),
  bB: (
    <svg viewBox="0 0 45 45" className="chess-piece-3d black-piece">
      <g fill="none" stroke="#f0d78c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <g fill="#1a0a2e">
          <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/>
          <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/>
          <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/>
        </g>
        <path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="#f0d78c" strokeLinejoin="miter"/>
      </g>
    </svg>
  ),
  bN: (
    <svg viewBox="0 0 45 45" className="chess-piece-3d black-piece">
      <g fill="none" stroke="#f0d78c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#1a0a2e"/>
        <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#1a0a2e"/>
        <path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#f0d78c" stroke="#f0d78c"/>
      </g>
    </svg>
  ),
  bP: (
    <svg viewBox="0 0 45 45" className="chess-piece-3d black-piece">
      <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#1a0a2e" stroke="#f0d78c" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

// Board configuration
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

// Rune symbols for board decoration
const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ'];

const Chess3DBoard = ({ 
  position, 
  onSquareClick, 
  onPieceDrop,
  selectedSquare,
  validMoves = [],
  lastMove,
  playerColor = 'white',
  isThinking = false 
}) => {
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [dragOverSquare, setDragOverSquare] = useState(null);

  // Parse FEN position to get piece placement
  const parseFEN = useCallback((fen) => {
    const pieces = {};
    const fenParts = fen.split(' ');
    const rows = fenParts[0].split('/');
    
    rows.forEach((row, rankIndex) => {
      let fileIndex = 0;
      for (const char of row) {
        if (isNaN(char)) {
          const file = FILES[fileIndex];
          const rank = RANKS[rankIndex];
          const square = file + rank;
          const color = char === char.toUpperCase() ? 'w' : 'b';
          const piece = char.toLowerCase();
          pieces[square] = color + piece.toUpperCase();
          fileIndex++;
        } else {
          fileIndex += parseInt(char);
        }
      }
    });
    
    return pieces;
  }, []);

  const pieces = useMemo(() => parseFEN(position), [position, parseFEN]);

  // Get squares in correct order based on player color
  const getOrderedSquares = useCallback(() => {
    const squares = [];
    const files = playerColor === 'white' ? FILES : [...FILES].reverse();
    const ranks = playerColor === 'white' ? RANKS : [...RANKS].reverse();
    
    for (const rank of ranks) {
      for (const file of files) {
        squares.push(file + rank);
      }
    }
    return squares;
  }, [playerColor]);

  const orderedSquares = useMemo(() => getOrderedSquares(), [getOrderedSquares]);

  // Check if square is light or dark
  const isLightSquare = (square) => {
    const file = square[0];
    const rank = parseInt(square[1]);
    const fileIndex = FILES.indexOf(file);
    return (fileIndex + rank) % 2 === 1;
  };

  // Handle drag start
  const handleDragStart = (e, square, piece) => {
    setDraggedPiece({ square, piece });
    e.dataTransfer.effectAllowed = 'move';
    if (onSquareClick) onSquareClick(square);
  };

  // Handle drag over
  const handleDragOver = (e, square) => {
    e.preventDefault();
    setDragOverSquare(square);
  };

  // Handle drop
  const handleDrop = (e, targetSquare) => {
    e.preventDefault();
    if (draggedPiece && onPieceDrop) {
      onPieceDrop({
        piece: draggedPiece.piece,
        sourceSquare: draggedPiece.square,
        targetSquare
      });
    }
    setDraggedPiece(null);
    setDragOverSquare(null);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedPiece(null);
    setDragOverSquare(null);
  };

  // Handle square click
  const handleSquareClick = (square) => {
    if (onSquareClick) onSquareClick(square);
  };

  return (
    <div className="chess-3d-container" data-testid="chess-3d-board">
      {/* Neural network ambient effect */}
      <div className="neural-ambient">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="neural-node"
            style={{
              left: `${10 + (i % 4) * 28}%`,
              top: `${15 + Math.floor(i / 4) * 30}%`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>

      {/* Board frame with runes */}
      <div className="board-frame-3d">
        {/* Corner runes */}
        <span className="frame-rune corner-tl">ᛟ</span>
        <span className="frame-rune corner-tr">ᛞ</span>
        <span className="frame-rune corner-bl">ᛜ</span>
        <span className="frame-rune corner-br">ᛚ</span>
        
        {/* Edge runes */}
        <div className="frame-edge-runes top">
          {RUNES.map((rune, i) => (
            <span key={i} className="edge-rune">{rune}</span>
          ))}
        </div>
        <div className="frame-edge-runes bottom">
          {RUNES.map((rune, i) => (
            <span key={i} className="edge-rune">{rune}</span>
          ))}
        </div>

        {/* 3D Board with bird's eye perspective */}
        <div className="board-3d-perspective">
          <div className="board-3d">
            {/* Board surface glow */}
            <div className="board-surface-glow" />
            
            {/* Squares */}
            {orderedSquares.map((square, index) => {
              const piece = pieces[square];
              const isLight = isLightSquare(square);
              const isSelected = selectedSquare === square;
              const isValidMove = validMoves.includes(square);
              const isLastMoveSquare = lastMove && (lastMove.from === square || lastMove.to === square);
              const isDragOver = dragOverSquare === square;
              
              return (
                <div
                  key={square}
                  className={`
                    square-3d 
                    ${isLight ? 'light-square' : 'dark-square'}
                    ${isSelected ? 'selected' : ''}
                    ${isValidMove ? 'valid-move' : ''}
                    ${isLastMoveSquare ? 'last-move' : ''}
                    ${isDragOver ? 'drag-over' : ''}
                  `}
                  data-square={square}
                  data-testid={`square-${square}`}
                  onClick={() => handleSquareClick(square)}
                  onDragOver={(e) => handleDragOver(e, square)}
                  onDrop={(e) => handleDrop(e, square)}
                >
                  {/* Square highlight effects */}
                  {isValidMove && <div className="valid-move-indicator" />}
                  {isSelected && <div className="selected-indicator" />}
                  
                  {/* Chess piece */}
                  {piece && (
                    <div
                      className={`piece-container-3d ${draggedPiece?.square === square ? 'dragging' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, square, piece)}
                      onDragEnd={handleDragEnd}
                    >
                      {PIECE_SVGS[piece]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* File labels */}
        <div className="file-labels-3d">
          {(playerColor === 'white' ? FILES : [...FILES].reverse()).map((file) => (
            <span key={file} className="coord-label">{file}</span>
          ))}
        </div>

        {/* Rank labels */}
        <div className="rank-labels-3d">
          {(playerColor === 'white' ? RANKS : [...RANKS].reverse()).map((rank) => (
            <span key={rank} className="coord-label">{rank}</span>
          ))}
        </div>
      </div>

      {/* Thinking indicator */}
      {isThinking && (
        <div className="thinking-overlay-3d">
          <div className="thinking-neural">
            <span className="thinking-rune">ᛟ</span>
            <span className="thinking-text">CALCULATING</span>
            <span className="thinking-rune">ᛞ</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chess3DBoard;
