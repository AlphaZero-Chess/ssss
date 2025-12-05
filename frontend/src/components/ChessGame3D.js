import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import { ArrowLeft, RotateCcw, Flag, Zap, Eye, Grid3x3 } from 'lucide-react';
import Chess3DBoard from './Chess3DBoard';
import SneakyEyeTracker from './SneakyEyeTracker';

/**
 * ChessGame3D - Sophisticated 3D Chess Game for AlphaZero Hidden Master
 * 
 * This component provides the full chess game experience with a sophisticated
 * 3D board view. It includes toggle functionality to switch between 3D and 2D views.
 * 
 * Features:
 * - 3D perspective chess board with elegant AlphaZero aesthetics
 * - Full Stockfish engine integration
 * - Move validation and highlighting
 * - Neural network themed UI
 * 
 * This component is MODULAR and can be removed without affecting other files.
 */

// Import personality config
import { ALPHAZERO_CONFIG, ALPHAZERO_OPENINGS } from '../personalities/alphazero';

// Starting position FEN
const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// Helper functions
function countPieces(fen) {
  let count = 0;
  const board = fen.split(' ')[0];
  for (let i = 0; i < board.length; i++) {
    const char = board[i];
    if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
      count++;
    }
  }
  return count;
}

function getGamePhase(moveNum, fen) {
  const pieces = countPieces(fen);
  if (moveNum <= 8) return "opening";
  if (moveNum <= 14 && pieces > 28) return "early-middlegame";
  if (pieces > 22) return "middlegame";
  if (pieces > 14) return "late-middlegame";
  return "endgame";
}

function getAdaptiveDepth(fen, moveNumber) {
  const phase = getGamePhase(moveNumber, fen);
  const config = ALPHAZERO_CONFIG;
  
  switch (phase) {
    case "opening": return config.openingDepth;
    case "endgame": return config.endgameDepth;
    case "middlegame":
    case "late-middlegame": return config.tacticalDepth;
    default: return config.baseDepth;
  }
}

function getBookMove(fen, color) {
  const fenParts = fen.split(' ');
  const fenKey1 = fenParts.slice(0, 4).join(' ');
  const fenKey2 = fenParts.slice(0, 3).join(' ') + ' -';
  const fenKey3 = fenParts[0] + ' ' + fenParts[1] + ' ' + fenParts[2] + ' -';
  
  let position = ALPHAZERO_OPENINGS[fenKey1] || ALPHAZERO_OPENINGS[fenKey2] || ALPHAZERO_OPENINGS[fenKey3];
  
  if (!position) return null;
  
  const moves = color === 'w' ? position.white : position.black;
  if (!moves || moves.length === 0) return null;
  
  // Weighted selection
  const totalWeight = moves.reduce((sum, m) => sum + m.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let moveOption of moves) {
    random -= moveOption.weight;
    if (random <= 0) return moveOption.move;
  }
  
  return moves[0].move;
}

const ChessGame3D = ({ enemy, playerColor, onGameEnd, onBack, onToggleView }) => {
  // Game state
  const gameRef = useRef(null);
  if (gameRef.current === null) {
    gameRef.current = new Chess();
  }
  
  const [position, setPosition] = useState(STARTING_FEN);
  const [isThinking, setIsThinking] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [lastMove, setLastMove] = useState(null);
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });
  const [currentTurn, setCurrentTurn] = useState('w');
  const [isInCheck, setIsInCheck] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [boardSize, setBoardSize] = useState(380);
  const [isMobile, setIsMobile] = useState(false);
  
  // Refs
  const stockfishRef = useRef(null);
  const isEngineReady = useRef(false);
  const moveCountRef = useRef(0);
  const hasInitializedEngineMove = useRef(false);
  
  // Refs for state setters
  const setPositionRef = useRef(setPosition);
  const setCurrentTurnRef = useRef(setCurrentTurn);
  const setIsInCheckRef = useRef(setIsInCheck);
  const setMoveHistoryRef = useRef(setMoveHistory);
  const setLastMoveRef = useRef(setLastMove);
  const setCapturedPiecesRef = useRef(setCapturedPieces);
  const setGameStatusRef = useRef(setGameStatus);
  const setIsThinkingRef = useRef(setIsThinking);
  
  // Props refs
  const playerColorRef = useRef(playerColor);
  const gameStatusRef = useRef(gameStatus);
  const onGameEndRef = useRef(onGameEnd);
  
  // Update refs
  useEffect(() => {
    playerColorRef.current = playerColor;
    gameStatusRef.current = gameStatus;
    onGameEndRef.current = onGameEnd;
    setPositionRef.current = setPosition;
    setCurrentTurnRef.current = setCurrentTurn;
    setIsInCheckRef.current = setIsInCheck;
    setMoveHistoryRef.current = setMoveHistory;
    setLastMoveRef.current = setLastMove;
    setCapturedPiecesRef.current = setCapturedPieces;
    setGameStatusRef.current = setGameStatus;
    setIsThinkingRef.current = setIsThinking;
  });

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Set board size
  useEffect(() => {
    setBoardSize(isMobile ? Math.min(320, window.innerWidth - 60) : 380);
  }, [isMobile]);

  // Stockfish engine setup
  useEffect(() => {
    stockfishRef.current = new Worker('/stockfish.js');
    let pendingCallback = null;
    
    stockfishRef.current.onmessage = (event) => {
      const line = event.data;
      
      if (line === 'uciok') {
        stockfishRef.current.postMessage('isready');
      } else if (line === 'readyok') {
        isEngineReady.current = true;
        if (playerColorRef.current === 'black' && !hasInitializedEngineMove.current) {
          hasInitializedEngineMove.current = true;
          setTimeout(() => makeEngineMove(), 600);
        }
      } else if (line.startsWith('bestmove')) {
        const parts = line.split(' ');
        const bestMove = parts[1];
        if (pendingCallback && bestMove && bestMove !== '(none)') {
          pendingCallback(bestMove);
          pendingCallback = null;
        }
        setIsThinking(false);
      }
    };
    
    stockfishRef.current.postMessage('uci');
    stockfishRef.current.postMessage('setoption name Contempt value 50');
    
    function applyEngineMove(moveStr) {
      const game = gameRef.current;
      const from = moveStr.substring(0, 2);
      const to = moveStr.substring(2, 4);
      const promotion = moveStr.length > 4 ? moveStr[4] : undefined;
      
      try {
        const moveResult = game.move({
          from, to,
          promotion: promotion || 'q'
        });
        
        if (moveResult) {
          moveCountRef.current++;
          const newFen = game.fen();
          
          setPositionRef.current(newFen);
          setCurrentTurnRef.current(game.turn());
          setIsInCheckRef.current(game.isCheck() && !game.isCheckmate());
          setMoveHistoryRef.current(prev => [...prev, moveResult.san]);
          setLastMoveRef.current({ from, to });
          
          if (moveResult.captured) {
            const capturedColor = moveResult.color === 'w' ? 'black' : 'white';
            setCapturedPiecesRef.current(prev => ({
              ...prev,
              [capturedColor]: [...prev[capturedColor], moveResult.captured]
            }));
          }
          
          if (game.isGameOver()) {
            let result;
            if (game.isCheckmate()) {
              const loser = game.turn();
              const playerWon = (playerColorRef.current === 'white' && loser === 'b') || 
                                (playerColorRef.current === 'black' && loser === 'w');
              result = playerWon ? 'player' : 'enemy';
            } else {
              result = 'draw';
            }
            setGameStatusRef.current('ended');
            setTimeout(() => onGameEndRef.current(result), 1500);
          }
        }
      } catch (e) {
        console.error('Engine move error:', e);
      }
    }
    
    function makeEngineMove() {
      const game = gameRef.current;
      if (!stockfishRef.current || !isEngineReady.current || game.isGameOver()) return;
      
      const engineColor = playerColorRef.current === 'white' ? 'b' : 'w';
      const currentMoveNumber = moveCountRef.current;
      const currentFen = game.fen();
      
      // Try book move first
      if (currentMoveNumber <= 12) {
        const bookMove = getBookMove(currentFen, engineColor);
        if (bookMove) {
          const thinkTime = 200 + Math.random() * 600;
          setIsThinkingRef.current(true);
          setTimeout(() => {
            applyEngineMove(bookMove);
            setIsThinkingRef.current(false);
          }, thinkTime);
          return;
        }
      }
      
      setIsThinkingRef.current(true);
      const depth = getAdaptiveDepth(currentFen, currentMoveNumber);
      
      stockfishRef.current.postMessage('setoption name Skill Level value 20');
      stockfishRef.current.postMessage(`setoption name Contempt value ${ALPHAZERO_CONFIG.contempt}`);
      
      pendingCallback = applyEngineMove;
      stockfishRef.current.postMessage(`position fen ${currentFen}`);
      stockfishRef.current.postMessage(`go depth ${depth}`);
    }
    
    stockfishRef.current.makeEngineMove = makeEngineMove;
    
    return () => {
      if (stockfishRef.current) {
        stockfishRef.current.terminate();
      }
    };
  }, []);

  // Handle square click
  const handleSquareClick = useCallback((square) => {
    if (isThinking || gameStatus !== 'playing') return;
    
    const game = gameRef.current;
    const turn = game.turn();
    const isPlayerTurn = (playerColor === 'white' && turn === 'w') || 
                         (playerColor === 'black' && turn === 'b');
    
    if (!isPlayerTurn) return;
    
    const piece = game.get(square);
    const playerPieceColor = playerColor === 'white' ? 'w' : 'b';
    
    if (selectedSquare) {
      // Try to make a move
      if (validMoves.includes(square)) {
        try {
          const moveResult = game.move({
            from: selectedSquare,
            to: square,
            promotion: 'q'
          });
          
          if (moveResult) {
            moveCountRef.current++;
            const newFen = game.fen();
            
            setPosition(newFen);
            setCurrentTurn(game.turn());
            setIsInCheck(game.isCheck() && !game.isCheckmate());
            setMoveHistory(prev => [...prev, moveResult.san]);
            setLastMove({ from: selectedSquare, to: square });
            setSelectedSquare(null);
            setValidMoves([]);
            
            if (moveResult.captured) {
              const capturedColor = moveResult.color === 'w' ? 'black' : 'white';
              setCapturedPieces(prev => ({
                ...prev,
                [capturedColor]: [...prev[capturedColor], moveResult.captured]
              }));
            }
            
            if (game.isGameOver()) {
              let result;
              if (game.isCheckmate()) {
                const loser = game.turn();
                const playerWon = (playerColor === 'white' && loser === 'b') || 
                                  (playerColor === 'black' && loser === 'w');
                result = playerWon ? 'player' : 'enemy';
              } else {
                result = 'draw';
              }
              setGameStatus('ended');
              setTimeout(() => onGameEnd(result), 1500);
              return;
            }
            
            setTimeout(() => {
              if (stockfishRef.current?.makeEngineMove) {
                stockfishRef.current.makeEngineMove();
              }
            }, 300);
            return;
          }
        } catch (e) {
          // Invalid move
        }
      }
      
      // Clicking same square or invalid move - deselect
      if (square === selectedSquare || !piece || piece.color !== playerPieceColor) {
        setSelectedSquare(null);
        setValidMoves([]);
        return;
      }
    }
    
    // Select new piece
    if (piece && piece.color === playerPieceColor) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setValidMoves(moves.map(m => m.to));
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  }, [selectedSquare, validMoves, isThinking, gameStatus, playerColor, onGameEnd]);

  // Reset game
  const resetGame = useCallback(() => {
    const newGame = new Chess();
    gameRef.current = newGame;
    moveCountRef.current = 0;
    hasInitializedEngineMove.current = false;
    setPosition(newGame.fen());
    setCurrentTurn('w');
    setIsInCheck(false);
    setMoveHistory([]);
    setGameStatus('playing');
    setLastMove(null);
    setCapturedPieces({ white: [], black: [] });
    setIsThinking(false);
    setSelectedSquare(null);
    setValidMoves([]);
    
    if (playerColor === 'black') {
      hasInitializedEngineMove.current = true;
      setTimeout(() => {
        if (stockfishRef.current?.makeEngineMove && isEngineReady.current) {
          stockfishRef.current.makeEngineMove();
        }
      }, 600);
    }
  }, [playerColor]);

  // Resign
  const handleResign = () => {
    setGameStatus('ended');
    onGameEnd('enemy');
  };

  // Piece symbols
  const getPieceSymbol = (piece, color) => {
    const symbols = {
      white: { p: '♙', n: '♘', b: '♗', r: '♖', q: '♕' },
      black: { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛' }
    };
    return symbols[color]?.[piece] || '';
  };

  const isPlayerTurn = (playerColor === 'white' && currentTurn === 'w') || 
                       (playerColor === 'black' && currentTurn === 'b');

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-hidden"
      data-testid="chess-game-3d-container"
      style={{ 
        background: 'linear-gradient(135deg, #0a0510 0%, #150d1f 50%, #0d0815 100%)'
      }}
    >
      {/* Subtle background gradient */}
      <div 
        className="fixed inset-0" 
        style={{ 
          background: 'radial-gradient(ellipse at 50% 30%, rgba(191, 0, 255, 0.08) 0%, transparent 50%)',
          zIndex: 0 
        }} 
      />

      {/* Main Layout */}
      <div className={`relative z-10 flex ${isMobile ? 'flex-col' : 'flex-row'} items-start justify-center gap-3 sm:gap-6 w-full max-w-6xl`}>
        
        {/* Left Panel - Game Info */}
        <div className={`${isMobile ? 'w-full max-w-sm mx-auto order-2' : 'w-56 flex-shrink-0'}`}>
          <div 
            className="rounded-xl p-4"
            style={{
              background: 'linear-gradient(180deg, rgba(25, 15, 40, 0.95) 0%, rgba(15, 8, 25, 0.98) 100%)',
              border: '1px solid rgba(191, 0, 255, 0.25)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 1px rgba(191, 0, 255, 0.3)',
            }}
          >
            {/* Enemy Info */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-purple-500/20">
              <SneakyEyeTracker
                size="small"
                glowColor="#bf00ff"
                useImage={true}
                className="text-2xl"
              />
              <div>
                <h3 
                  className="text-sm font-bold tracking-wide"
                  style={{ fontFamily: 'Orbitron, sans-serif', color: '#bf00ff' }}
                >
                  ALPHAZERO
                </h3>
                <p className="text-xs text-purple-300/60" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  LEGENDARY
                </p>
              </div>
            </div>

            {/* Turn Indicator */}
            <div className="mb-4">
              <div 
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all duration-300 ${isThinking ? 'animate-pulse' : ''}`}
                style={{
                  background: isPlayerTurn 
                    ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 255, 68, 0.08) 100%)'
                    : 'linear-gradient(135deg, rgba(191, 0, 255, 0.2) 0%, rgba(255, 0, 191, 0.1) 100%)',
                  border: `1px solid ${isPlayerTurn ? 'rgba(0, 255, 136, 0.4)' : 'rgba(191, 0, 255, 0.4)'}`,
                }}
              >
                {isThinking ? (
                  <>
                    <Zap size={14} className="animate-pulse" style={{ color: '#bf00ff' }} />
                    <span style={{ fontFamily: 'Orbitron, sans-serif', color: '#bf00ff', fontSize: '11px' }}>
                      NEURAL PROCESSING...
                    </span>
                  </>
                ) : (
                  <span 
                    style={{ 
                      fontFamily: 'Orbitron, sans-serif', 
                      color: isPlayerTurn ? '#00ff88' : '#bf00ff',
                      fontSize: '11px'
                    }}
                  >
                    {isPlayerTurn ? 'YOUR TURN' : 'OPPONENT'}
                  </span>
                )}
              </div>
            </div>

            {/* Check Indicator */}
            {isInCheck && (
              <div 
                className="mb-4 py-2 px-3 rounded-lg text-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 0, 64, 0.2) 0%, rgba(255, 64, 0, 0.15) 100%)',
                  border: '1px solid rgba(255, 0, 64, 0.4)',
                }}
              >
                <span style={{ fontFamily: 'Orbitron, sans-serif', color: '#ff0040', fontSize: '12px' }}>
                  ⚠ CHECK
                </span>
              </div>
            )}

            {/* Captured Pieces */}
            <div className="mb-4">
              <h4 className="text-xs text-purple-400/60 mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                CAPTURED
              </h4>
              <div className="flex flex-wrap gap-0.5 min-h-[24px] p-2 rounded-lg bg-black/30 text-sm">
                {capturedPieces[playerColor === 'white' ? 'black' : 'white'].map((piece, i) => (
                  <span key={i}>{getPieceSymbol(piece, playerColor === 'white' ? 'black' : 'white')}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-0.5 min-h-[24px] p-2 rounded-lg bg-white/5 mt-1.5 text-sm">
                {capturedPieces[playerColor].map((piece, i) => (
                  <span key={i}>{getPieceSymbol(piece, playerColor)}</span>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-2">
              <button
                data-testid="back-btn-3d"
                onClick={onBack}
                className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg transition-all text-xs hover:bg-white/10"
                style={{ 
                  fontFamily: 'Orbitron, sans-serif',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <ArrowLeft size={12} />
                BACK
              </button>
              <button
                data-testid="view-toggle-btn"
                onClick={onToggleView}
                className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg transition-all text-xs"
                style={{ 
                  fontFamily: 'Orbitron, sans-serif',
                  background: 'linear-gradient(135deg, rgba(191, 0, 255, 0.2) 0%, rgba(255, 0, 191, 0.15) 100%)',
                  border: '1px solid rgba(191, 0, 255, 0.4)',
                  color: '#bf00ff',
                }}
              >
                <Grid3x3 size={12} />
                2D
              </button>
              <button
                data-testid="reset-btn-3d"
                onClick={resetGame}
                className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg transition-all text-xs hover:bg-blue-500/30"
                style={{ 
                  fontFamily: 'Orbitron, sans-serif',
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: '#60a5fa',
                }}
              >
                <RotateCcw size={12} />
                RESET
              </button>
              <button
                data-testid="resign-btn-3d"
                onClick={handleResign}
                className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg transition-all text-xs hover:bg-red-500/30"
                style={{ 
                  fontFamily: 'Orbitron, sans-serif',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                }}
              >
                <Flag size={12} />
                RESIGN
              </button>
            </div>
          </div>
        </div>

        {/* 3D Chess Board */}
        <div className={`relative ${isMobile ? 'order-1' : ''}`}>
          <Chess3DBoard
            position={position}
            boardOrientation={playerColor}
            onSquareClick={handleSquareClick}
            selectedSquare={selectedSquare}
            lastMove={lastMove}
            validMoves={validMoves}
            isThinking={isThinking}
            boardSize={boardSize}
          />
        </div>

        {/* Right Panel - Move History */}
        <div className={`${isMobile ? 'w-full max-w-sm mx-auto order-3' : 'w-48 flex-shrink-0'}`}>
          <div 
            className="rounded-xl p-4"
            style={{
              background: 'linear-gradient(180deg, rgba(25, 15, 40, 0.95) 0%, rgba(15, 8, 25, 0.98) 100%)',
              border: '1px solid rgba(191, 0, 255, 0.15)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            }}
          >
            <h3 
              className="text-xs font-bold tracking-wider mb-3 flex items-center gap-2"
              style={{ fontFamily: 'Orbitron, sans-serif', color: 'rgba(191, 0, 255, 0.8)' }}
            >
              <Eye size={12} />
              NEURAL LOG
            </h3>
            
            <div 
              className={`${isMobile ? 'h-24' : 'h-52'} overflow-y-auto pr-1`}
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              {moveHistory.length === 0 ? (
                <p className="text-purple-500/40 text-xs">Awaiting moves...</p>
              ) : (
                <div className="space-y-1 text-xs">
                  {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-2 py-1 px-2 rounded hover:bg-purple-500/10"
                    >
                      <span className="text-purple-500/50 w-4">{i + 1}.</span>
                      <span className="text-white/90 flex-1">{moveHistory[i * 2]}</span>
                      <span className="text-purple-300/70 flex-1">{moveHistory[i * 2 + 1] || ''}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Playing as indicator */}
            <div className="mt-3 pt-3 border-t border-purple-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-400/50" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  PLAYING AS
                </span>
                <span 
                  className="text-xl"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(191, 0, 255, 0.5))' }}
                >
                  {playerColor === 'white' ? '♔' : '♚'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessGame3D;
