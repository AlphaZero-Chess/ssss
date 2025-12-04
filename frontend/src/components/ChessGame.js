import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { ArrowLeft, RotateCcw, Flag, Zap, Maximize2, Minimize2, Move, Box, Grid3X3 } from 'lucide-react';
import SneakyEyeTracker from './SneakyEyeTracker';

// Lazy load 3D components for AlphaZero only
const Chess3DBoard = lazy(() => import('./Chess3DBoard'));
const AlphaZeroBackground = lazy(() => import('./AlphaZeroBackground'));

// ═══════════════════════════════════════════════════════════════════════
// PERSONALITY IMPORTS - External personality files
// Each personality has unique CONFIG and OPENINGS
// ═══════════════════════════════════════════════════════════════════════
import { ELEGANT_CONFIG, ELEGANT_OPENINGS } from '../personalities/elegant';
import { NON_ELEGANT_CONFIG, NON_ELEGANT_OPENINGS } from '../personalities/nonelegant';
import { MINI_A0_CONFIG, MINI_A0_OPENINGS } from '../personalities/minia0';

// ═══════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS - Piece counting and game phase detection
// ═══════════════════════════════════════════════════════════════════════
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

function analyzePositionType(fen) {
  if (fen.indexOf("+") !== -1) return "tactical";
  
  const board = fen.split(' ')[0];
  if (board.indexOf("pp") !== -1 || board.indexOf("PP") !== -1) {
    return "positional";
  }
  return "normal";
}

// ═══════════════════════════════════════════════════════════════════════
// GET ENGINE SETTINGS - Pure function based on enemy type
// ═══════════════════════════════════════════════════════════════════════
function getEngineSettingsForEnemy(enemyId) {
  switch (enemyId) {
    case 'elegant':
      return {
        ...ELEGANT_CONFIG,
        openings: ELEGANT_OPENINGS,
        style: 'positional'
      };
    case 'nonelegant':
      return {
        ...NON_ELEGANT_CONFIG,
        openings: NON_ELEGANT_OPENINGS,
        style: 'aggressive'
      };
    case 'minia0':
      return {
        ...MINI_A0_CONFIG,
        openings: MINI_A0_OPENINGS,
        style: 'strategic'
      };
    default:
      return {
        ...ELEGANT_CONFIG,
        openings: ELEGANT_OPENINGS,
        style: 'balanced'
      };
  }
}

// Get adaptive depth based on game phase and position type
function getAdaptiveDepthForPosition(currentFen, moveNumber, enemyId) {
  const settings = getEngineSettingsForEnemy(enemyId);
  const phase = getGamePhase(moveNumber, currentFen);
  const posType = analyzePositionType(currentFen);
  
  let depth = settings.baseDepth;
  
  if (phase === "opening") {
    depth = settings.openingDepth;
  } else if (phase === "endgame") {
    depth = settings.endgameDepth;
  } else if (phase === "middlegame" || phase === "late-middlegame") {
    if (posType === "tactical") {
      depth = settings.tacticalDepth;
    } else if (posType === "positional") {
      depth = settings.positionalDepth;
    }
  }
  
  return depth;
}

// Get book move with WEIGHTED selection based on personality
function getBookMoveForPosition(fen, color, enemyId) {
  const settings = getEngineSettingsForEnemy(enemyId);
  
  // Try multiple FEN key formats
  const fenParts = fen.split(' ');
  const fenKey1 = fenParts.slice(0, 4).join(' ');
  const fenKey2 = fenParts.slice(0, 3).join(' ') + ' -';
  const fenKey3 = fenParts[0] + ' ' + fenParts[1] + ' ' + fenParts[2] + ' -';
  
  let position = settings.openings[fenKey1] || settings.openings[fenKey2] || settings.openings[fenKey3];
  
  if (!position) return null;
  
  const moves = color === 'w' ? position.white : position.black;
  if (!moves || moves.length === 0) return null;
  
  // Apply personality-specific aggression boost to first (most aggressive) option
  const aggressionBoost = settings.aggressionFactor || 0.5;
  let adjustedMoves = moves.map((m, idx) => ({
    ...m,
    weight: m.weight * (idx === 0 ? aggressionBoost + 0.15 : 1)
  }));
  
  // Weighted random selection - THIS is the key personality difference!
  const totalWeight = adjustedMoves.reduce((sum, m) => sum + m.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let moveOption of adjustedMoves) {
    random -= moveOption.weight;
    if (random <= 0) return moveOption.move;
  }
  
  return moves[0].move;
}

// ═══════════════════════════════════════════════════════════════════════
// CHESS GAME COMPONENT
// ═══════════════════════════════════════════════════════════════════════
// Starting position FEN constant
const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const ChessGame = ({ enemy, playerColor, onGameEnd, onBack }) => {
  // Create Chess instance lazily to avoid recreating on each render
  const gameRef = useRef(null);
  if (gameRef.current === null) {
    gameRef.current = new Chess();
  }
  
  // Position as FEN string - initialized with constant, NOT from ref
  // This drives both the visual display AND move validation in react-chessboard
  const [position, setPosition] = useState(STARTING_FEN);
  const [isThinking, setIsThinking] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [lastMove, setLastMove] = useState(null);
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });
  const [boardSize, setBoardSize] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('w');
  const [isInCheck, setIsInCheck] = useState(false);
  const [is3DMode, setIs3DMode] = useState(false);
  const stockfishRef = useRef(null);
  const isEngineReady = useRef(false);
  const boardContainerRef = useRef(null);
  const resizeStartRef = useRef({ x: 0, y: 0, size: 0 });
  const moveCountRef = useRef(0);
  const hasInitializedEngineMove = useRef(false);
  
  // Refs for state setters to use in callbacks (avoid stale closures)
  const setPositionRef = useRef(setPosition);
  const setCurrentTurnRef = useRef(setCurrentTurn);
  const setIsInCheckRef = useRef(setIsInCheck);
  const setMoveHistoryRef = useRef(setMoveHistory);
  const setLastMoveRef = useRef(setLastMove);
  const setCapturedPiecesRef = useRef(setCapturedPieces);
  const setGameStatusRef = useRef(setGameStatus);
  const setIsThinkingRef = useRef(setIsThinking);
  
  // Refs to store props for use in stockfish callback
  const enemyRef = useRef(enemy);
  const playerColorRef = useRef(playerColor);
  const gameStatusRef = useRef(gameStatus);
  const onGameEndRef = useRef(onGameEnd);
  
  // Keep refs updated with current values
  useEffect(() => {
    enemyRef.current = enemy;
    playerColorRef.current = playerColor;
    gameStatusRef.current = gameStatus;
    onGameEndRef.current = onGameEnd;
    // Update setter refs
    setPositionRef.current = setPosition;
    setCurrentTurnRef.current = setCurrentTurn;
    setIsInCheckRef.current = setIsInCheck;
    setMoveHistoryRef.current = setMoveHistory;
    setLastMoveRef.current = setLastMove;
    setCapturedPiecesRef.current = setCapturedPieces;
    setGameStatusRef.current = setGameStatus;
    setIsThinkingRef.current = setIsThinking;
  });

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Set initial board size based on device
  useEffect(() => {
    const initialSize = isMobile ? Math.min(280, window.innerWidth - 40) : 320;
    setBoardSize(initialSize);
  }, [isMobile]);

  // Get engine settings based on enemy type - wrapper for component use
  const getEngineSettings = useCallback(() => {
    return getEngineSettingsForEnemy(enemy?.id);
  }, [enemy]);

  // Get adaptive depth - wrapper for component use
  const getAdaptiveDepth = useCallback((currentFen, moveNumber) => {
    return getAdaptiveDepthForPosition(currentFen, moveNumber, enemy?.id);
  }, [enemy]);

  // Get book move - wrapper for component use
  const getBookMove = useCallback((fen, color) => {
    return getBookMoveForPosition(fen, color, enemy?.id);
  }, [enemy]);

  // ═══════════════════════════════════════════════════════════════════════
  // STOCKFISH ENGINE - Based on reference engine.js pattern
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    // Create Web Worker for Stockfish
    stockfishRef.current = new Worker('/stockfish.js');
    
    // Pending callback for bestmove response
    let pendingCallback = null;
    
    stockfishRef.current.onmessage = (event) => {
      const line = event.data;
      
      if (line === 'uciok') {
        stockfishRef.current.postMessage('isready');
      } else if (line === 'readyok') {
        isEngineReady.current = true;
        console.log('Stockfish engine ready');
        // If player is black, engine (white) makes first move
        // Use flag to prevent double initialization
        if (playerColorRef.current === 'black' && !hasInitializedEngineMove.current) {
          hasInitializedEngineMove.current = true;
          setTimeout(() => {
            makeEngineMove();
          }, 600);
        }
      } else if (line.startsWith('bestmove')) {
        const parts = line.split(' ');
        const bestMove = parts[1];
        console.log('Engine bestmove:', bestMove);
        if (pendingCallback && bestMove && bestMove !== '(none)') {
          pendingCallback(bestMove);
          pendingCallback = null;
        }
        setIsThinking(false);
      }
    };
    
    // Initialize UCI protocol
    stockfishRef.current.postMessage('uci');
    stockfishRef.current.postMessage('setoption name Contempt value 50');
    stockfishRef.current.postMessage('setoption name MultiPV value 1');
    
    // Function to apply engine move to the game
    function applyEngineMove(moveStr) {
      const game = gameRef.current;
      const from = moveStr.substring(0, 2);
      const to = moveStr.substring(2, 4);
      const promotion = moveStr.length > 4 ? moveStr[4] : undefined;
      
      try {
        const moveResult = game.move({
          from,
          to,
          promotion: promotion || 'q'
        });
        
        if (moveResult) {
          moveCountRef.current++;
          // Get fresh FEN after move
          const newFen = game.fen();
          
          console.log('Engine move applied:', moveResult.san, 'New FEN:', newFen);
          
          // Use refs to call the latest state setters (avoid stale closures)
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
          
          // Check game over
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
    
    // Function to trigger engine to calculate and make a move
    function makeEngineMove() {
      const game = gameRef.current;
      if (!stockfishRef.current || !isEngineReady.current) {
        console.log('Engine not ready');
        return;
      }
      if (game.isGameOver()) {
        console.log('Game is over');
        return;
      }
      
      const currentEnemyId = enemyRef.current?.id;
      const currentPlayerColor = playerColorRef.current;
      const settings = getEngineSettingsForEnemy(currentEnemyId);
      const engineColor = currentPlayerColor === 'white' ? 'b' : 'w';
      const currentMoveNumber = moveCountRef.current;
      const currentFen = game.fen();
      
      console.log('Engine calculating move for position:', currentFen);
      
      // Try book move first in opening phase
      const openingBookDepth = currentEnemyId === 'minia0' ? 12 : (currentEnemyId === 'elegant' ? 10 : 8);
      if (currentMoveNumber <= openingBookDepth) {
        const bookMove = getBookMoveForPosition(currentFen, engineColor, currentEnemyId);
        if (bookMove) {
          console.log('Using book move:', bookMove);
          const minTime = settings.thinkingTimeMin || 150;
          const maxTime = settings.thinkingTimeMax || 800;
          const thinkTime = minTime + Math.random() * (maxTime - minTime) * (settings.openingSpeed || 0.5);
          setIsThinkingRef.current(true);
          setTimeout(() => {
            applyEngineMove(bookMove);
            setIsThinkingRef.current(false);
          }, thinkTime);
          return;
        }
      }
      
      setIsThinkingRef.current(true);
      
      const adaptiveDepth = getAdaptiveDepthForPosition(currentFen, currentMoveNumber, currentEnemyId);
      const skillLevel = currentEnemyId === 'minia0' ? 15 : 20;
      
      stockfishRef.current.postMessage(`setoption name Skill Level value ${skillLevel}`);
      stockfishRef.current.postMessage(`setoption name Contempt value ${settings.contempt || 24}`);
      
      pendingCallback = applyEngineMove;
      
      stockfishRef.current.postMessage(`position fen ${currentFen}`);
      stockfishRef.current.postMessage(`go depth ${adaptiveDepth}`);
    }
    
    // Store makeEngineMove in stockfishRef so it can be called from outside
    stockfishRef.current.makeEngineMove = makeEngineMove;
    
    return () => {
      if (stockfishRef.current) {
        stockfishRef.current.terminate();
      }
    };
  }, []);

  // Handle game over
  const handleGameOver = useCallback((game) => {
    let result;
    if (game.isCheckmate()) {
      const loser = game.turn();
      const playerWon = (playerColor === 'white' && loser === 'b') || 
                        (playerColor === 'black' && loser === 'w');
      result = playerWon ? 'player' : 'enemy';
    } else if (game.isDraw() || game.isStalemate()) {
      result = 'draw';
    }
    
    setGameStatus('ended');
    setTimeout(() => onGameEnd(result), 1500);
  }, [playerColor, onGameEnd]);

  // Check if a piece is draggable - only allow player's pieces on player's turn
  // react-chessboard v5 API: canDragPiece receives { piece: { pieceType }, isSparePiece, square }
  const canDragPiece = useCallback(({ piece, square }) => {
    // Don't allow dragging when thinking or game ended
    if (isThinking || gameStatus !== 'playing') {
      return false;
    }
    
    const game = gameRef.current;
    const turn = game.turn();
    
    // Check if it's player's turn
    const isPlayerTurn = (playerColor === 'white' && turn === 'w') || 
                         (playerColor === 'black' && turn === 'b');
    
    if (!isPlayerTurn) {
      return false;
    }
    
    // Check if the piece belongs to the player
    // piece.pieceType is in format like 'wP', 'bK', etc.
    const pieceType = piece?.pieceType || '';
    const pieceColor = pieceType[0]; // 'w' or 'b'
    const playerPieceColor = playerColor === 'white' ? 'w' : 'b';
    
    return pieceColor === playerPieceColor;
  }, [isThinking, gameStatus, playerColor]);

  // Handle player move
  // react-chessboard v5 API: onPieceDrop receives { piece, sourceSquare, targetSquare }
  const onDrop = useCallback(({ piece, sourceSquare, targetSquare }) => {
    // Handle null targetSquare (piece dropped off board)
    if (!targetSquare) {
      return false;
    }
    
    // Double check game state
    if (isThinking || gameStatus !== 'playing') {
      console.log('Cannot move - thinking or game ended');
      return false;
    }
    
    const game = gameRef.current;
    const turn = game.turn();
    const isPlayerTurn = (playerColor === 'white' && turn === 'w') || 
                         (playerColor === 'black' && turn === 'b');
    
    if (!isPlayerTurn) {
      console.log('Not player turn, current turn:', turn);
      return false;
    }
    
    // Verify the piece at source square matches expected
    const pieceAtSource = game.get(sourceSquare);
    if (!pieceAtSource) {
      console.log('No piece at source:', sourceSquare);
      return false;
    }
    
    try {
      const moveResult = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });
      
      if (moveResult === null) {
        console.log('Invalid move from', sourceSquare, 'to', targetSquare);
        return false;
      }
      
      moveCountRef.current++;
      const newFen = game.fen();
      
      console.log('Player move:', moveResult.san, 'New FEN:', newFen);
      
      // Update all state - this will cause react-chessboard to re-render
      setPosition(newFen);
      setCurrentTurn(game.turn());
      setIsInCheck(game.isCheck() && !game.isCheckmate());
      setMoveHistory(prev => [...prev, moveResult.san]);
      setLastMove({ from: sourceSquare, to: targetSquare });
      
      if (moveResult.captured) {
        const capturedColor = moveResult.color === 'w' ? 'black' : 'white';
        setCapturedPieces(prev => ({
          ...prev,
          [capturedColor]: [...prev[capturedColor], moveResult.captured]
        }));
      }
      
      if (game.isGameOver()) {
        handleGameOver(game);
        return true;
      }
      
      // Trigger engine to make its move after a short delay
      setTimeout(() => {
        if (stockfishRef.current?.makeEngineMove) {
          stockfishRef.current.makeEngineMove();
        }
      }, 300);
      
      return true;
    } catch (e) {
      console.error('Move error:', e);
      return false;
    }
  }, [isThinking, gameStatus, playerColor, handleGameOver]);

  // Reset game
  const resetGame = useCallback(() => {
    const newGame = new Chess();
    gameRef.current = newGame;
    moveCountRef.current = 0;
    hasInitializedEngineMove.current = false; // Reset initialization flag
    setPosition(newGame.fen());
    setCurrentTurn('w');
    setIsInCheck(false);
    setMoveHistory([]);
    setGameStatus('playing');
    setLastMove(null);
    setCapturedPieces({ white: [], black: [] });
    setIsThinking(false);
    
    if (playerColor === 'black') {
      hasInitializedEngineMove.current = true; // Set flag before calling
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

  // Resize handlers
  const handleResizeStart = (e) => {
    e.preventDefault();
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    resizeStartRef.current = { x: clientX, y: clientY, size: boardSize };
    setIsResizing(true);
  };

  const handleResizeMove = useCallback((e) => {
    if (!isResizing) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - resizeStartRef.current.x;
    const deltaY = clientY - resizeStartRef.current.y;
    const delta = Math.max(deltaX, deltaY);
    
    const minSize = isMobile ? 200 : 240;
    const maxSize = isMobile ? Math.min(400, window.innerWidth - 40) : 600;
    const newSize = Math.max(minSize, Math.min(maxSize, resizeStartRef.current.size + delta));
    setBoardSize(newSize);
  }, [isResizing, isMobile]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
      window.addEventListener('touchmove', handleResizeMove);
      window.addEventListener('touchend', handleResizeEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
      window.removeEventListener('touchmove', handleResizeMove);
      window.removeEventListener('touchend', handleResizeEnd);
    };
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  // Quick size buttons
  const setSmallSize = () => setBoardSize(isMobile ? 220 : 280);
  const setLargeSize = () => setBoardSize(isMobile ? 340 : 480);

  // Get piece symbols for captured display
  const getPieceSymbol = (piece, color) => {
    const symbols = {
      white: { p: '♙', n: '♘', b: '♗', r: '♖', q: '♕' },
      black: { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛' }
    };
    return symbols[color]?.[piece] || '';
  };

  // Custom square styles for last move highlight
  const customSquareStyles = {};
  if (lastMove) {
    customSquareStyles[lastMove.from] = {
      backgroundColor: 'rgba(255, 255, 0, 0.35)'
    };
    customSquareStyles[lastMove.to] = {
      backgroundColor: 'rgba(255, 255, 0, 0.35)'
    };
  }

  const isPlayerTurn = (playerColor === 'white' && currentTurn === 'w') || 
                       (playerColor === 'black' && currentTurn === 'b');
  
  // Check if playing against AlphaZero (hidden master)
  const isAlphaZeroGame = enemy?.id === 'alphazero';
  
  // Toggle 3D mode handler
  const toggle3DMode = useCallback(() => {
    setIs3DMode(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-hidden" data-testid="chess-game-container" style={{ background: is3DMode ? 'transparent' : 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)' }}>
      {/* AlphaZero 3D Background - Only when 3D mode is active */}
      {isAlphaZeroGame && is3DMode && (
        <Suspense fallback={null}>
          <AlphaZeroBackground enabled={true} />
        </Suspense>
      )}
      
      {/* Standard Background - Hidden in 3D mode */}
      {!is3DMode && (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900" style={{ zIndex: 0, minHeight: '100vh', minWidth: '100vw' }} />
      )}

      {/* Main Layout */}
      <div className={`relative z-10 flex ${isMobile ? 'flex-col' : 'flex-row'} items-start justify-center gap-3 sm:gap-6 w-full max-w-6xl`}>
        
        {/* Game Info Panel - Compact for mobile */}
        <div className={`${isMobile ? 'w-full max-w-sm mx-auto order-2' : 'w-56 flex-shrink-0'}`}>
          <div 
            className="rounded-lg p-3 sm:p-4"
            style={{
              background: 'linear-gradient(180deg, rgba(20,20,35,0.9) 0%, rgba(10,10,20,0.95) 100%)',
              border: `1px solid ${enemy?.color || '#ff0080'}30`,
              backdropFilter: 'blur(10px)'
            }}
          >
            {/* Enemy Info */}
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
              {enemy?.avatar === '👁' ? (
                <SneakyEyeTracker
                  size="small"
                  glowColor={enemy?.color}
                  useImage={true}
                  className="text-2xl sm:text-3xl"
                />
              ) : (
                <span className="text-2xl sm:text-3xl" style={{ filter: `drop-shadow(0 0 8px ${enemy?.color})` }}>
                  {enemy?.avatar}
                </span>
              )}
              <div>
                <h3 
                  className="text-sm sm:text-base font-bold tracking-wide"
                  style={{ fontFamily: 'Orbitron, sans-serif', color: enemy?.color }}
                >
                  {enemy?.name}
                </h3>
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  {enemy?.difficulty}
                </p>
              </div>
            </div>

            {/* Turn Indicator */}
            <div className="mb-3">
              <div 
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all duration-300 ${isThinking ? 'animate-pulse' : ''}`}
                style={{
                  background: isPlayerTurn 
                    ? 'linear-gradient(135deg, #00ff8830 0%, #00ff4415 100%)'
                    : `linear-gradient(135deg, ${enemy?.color}30 0%, ${enemy?.color}15 100%)`,
                  border: `1px solid ${isPlayerTurn ? '#00ff8850' : enemy?.color + '50'}`
                }}
              >
                {isThinking ? (
                  <>
                    <Zap size={14} className="animate-pulse" style={{ color: enemy?.color }} />
                    <span style={{ fontFamily: 'Orbitron, sans-serif', color: enemy?.color, fontSize: '11px' }}>
                      THINKING...
                    </span>
                  </>
                ) : (
                  <span 
                    style={{ 
                      fontFamily: 'Orbitron, sans-serif', 
                      color: isPlayerTurn ? '#00ff88' : enemy?.color,
                      fontSize: '11px'
                    }}
                  >
                    {isPlayerTurn ? 'YOUR TURN' : 'OPPONENT'}
                  </span>
                )}
              </div>
            </div>

            {/* Captured Pieces */}
            <div className="mb-3">
              <h4 className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                CAPTURED
              </h4>
              <div className="flex flex-wrap gap-0.5 min-h-[22px] p-1.5 rounded bg-black/30 text-sm">
                {capturedPieces[playerColor === 'white' ? 'black' : 'white'].map((piece, i) => (
                  <span key={i}>{getPieceSymbol(piece, playerColor === 'white' ? 'black' : 'white')}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-0.5 min-h-[22px] p-1.5 rounded bg-white/5 mt-1 text-sm">
                {capturedPieces[playerColor].map((piece, i) => (
                  <span key={i}>{getPieceSymbol(piece, playerColor)}</span>
                ))}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex flex-wrap gap-1.5">
              <button
                data-testid="back-btn"
                onClick={onBack}
                className="flex items-center justify-center gap-1 py-1.5 px-3 rounded bg-white/10 hover:bg-white/20 transition-all text-xs"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                <ArrowLeft size={12} />
                BACK
              </button>
              <button
                data-testid="reset-btn"
                onClick={resetGame}
                className="flex items-center justify-center gap-1 py-1.5 px-3 rounded bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 transition-all text-xs"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                <RotateCcw size={12} />
                RESET
              </button>
              <button
                data-testid="resign-btn"
                onClick={handleResign}
                className="flex items-center justify-center gap-1 py-1.5 px-3 rounded bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-all text-xs"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                <Flag size={12} />
                RESIGN
              </button>
              
              {/* 3D Mode Toggle - AlphaZero Only */}
              {isAlphaZeroGame && (
                <button
                  data-testid="3d-mode-btn"
                  onClick={toggle3DMode}
                  className={`flex items-center justify-center gap-1 py-1.5 px-3 rounded transition-all text-xs ${
                    is3DMode 
                      ? 'bg-purple-500/40 text-purple-200 border border-purple-400/50' 
                      : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400'
                  }`}
                  style={{ 
                    fontFamily: 'Orbitron, sans-serif',
                    boxShadow: is3DMode ? '0 0 15px rgba(191, 0, 255, 0.4)' : 'none'
                  }}
                >
                  {is3DMode ? <Grid3X3 size={12} /> : <Box size={12} />}
                  {is3DMode ? '2D' : '3D'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Chess Board with Resize Handle */}
        <div className={`relative ${isMobile ? 'order-1' : ''}`} ref={boardContainerRef}>
          {/* Board Container - Conditional 2D/3D */}
          {isAlphaZeroGame && is3DMode ? (
            /* 3D Board - AlphaZero Only */
            <Suspense fallback={
              <div 
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: boardSize + 12,
                  height: boardSize + 12,
                  background: 'linear-gradient(180deg, rgba(25,25,40,0.85) 0%, rgba(15,15,25,0.9) 100%)',
                  border: '1px solid rgba(191, 0, 255, 0.25)'
                }}
              >
                <div className="text-purple-400 text-sm" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  LOADING 3D...
                </div>
              </div>
            }>
              <Chess3DBoard
                position={position}
                lastMove={lastMove}
                playerColor={playerColor}
                boardSize={boardSize + 12}
              />
            </Suspense>
          ) : (
            /* Standard 2D Board */
            <div 
              className="chess-board-wrapper p-1.5 rounded-lg relative"
              style={{
                background: 'linear-gradient(180deg, rgba(25,25,40,0.85) 0%, rgba(15,15,25,0.9) 100%)',
                boxShadow: `0 0 30px ${enemy?.color}20, 0 0 60px ${enemy?.color}08`,
                border: `1px solid ${enemy?.color}25`,
                backdropFilter: 'blur(8px)',
                width: boardSize + 12,
                height: boardSize + 12,
              }}
              data-testid="chess-board-container"
            >
              <Chessboard
                options={{
                  id: "chess-board",
                  position: position,
                  onPieceDrop: onDrop,
                  canDragPiece: canDragPiece,
                  boardWidth: boardSize,
                  boardOrientation: playerColor,
                  boardStyle: {
                    borderRadius: '6px',
                    boxShadow: 'inset 0 0 15px rgba(0,0,0,0.4)'
                  },
                  squareStyles: customSquareStyles,
                  darkSquareStyle: { backgroundColor: '#4a5568' },
                  lightSquareStyle: { backgroundColor: '#a0aec0' },
                  animationDurationInMs: 180
                }}
              />
              
              {/* Resize Handle - Bottom Right Corner */}
              <div
                className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity"
                style={{ 
                  background: `linear-gradient(135deg, transparent 50%, ${enemy?.color || '#ff0080'}60 50%)`,
                  borderBottomRightRadius: '6px'
                }}
                onMouseDown={handleResizeStart}
                onTouchStart={handleResizeStart}
                data-testid="resize-handle"
              >
                <Move size={10} className="text-white/50 rotate-45" style={{ marginTop: '4px', marginLeft: '4px' }} />
              </div>
            </div>
          )}
          
          {/* Size Controls - Only show for 2D mode */}
          {!is3DMode && (
            <div className="flex justify-center gap-2 mt-2">
              <button
                onClick={setSmallSize}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-white/10 hover:bg-white/20 transition-all"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
                data-testid="size-small-btn"
              >
                <Minimize2 size={12} />
                Small
              </button>
              <span className="text-xs text-gray-500 flex items-center" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                {boardSize}px
              </span>
              <button
                onClick={setLargeSize}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-white/10 hover:bg-white/20 transition-all"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
                data-testid="size-large-btn"
              >
                <Maximize2 size={12} />
                Large
              </button>
            </div>
          )}
          
          {/* Check indicator */}
          {isInCheck && (
            <div 
              className="absolute -top-8 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs"
              style={{
                background: 'linear-gradient(135deg, #ff0040 0%, #ff4000 100%)',
                fontFamily: 'Orbitron, sans-serif',
                animation: 'pulse 1s infinite'
              }}
            >
              CHECK!
            </div>
          )}
        </div>

        {/* Move History Panel - Compact */}
        <div className={`${isMobile ? 'w-full max-w-sm mx-auto order-3' : 'w-48 flex-shrink-0'}`}>
          <div 
            className="rounded-lg p-3 sm:p-4"
            style={{
              background: 'linear-gradient(180deg, rgba(20,20,35,0.9) 0%, rgba(10,10,20,0.95) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 
              className="text-xs font-bold tracking-wider mb-2 text-gray-400"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              MOVES
            </h3>
            
            <div 
              className={`${isMobile ? 'h-24' : 'h-48'} overflow-y-auto pr-1 custom-scrollbar`}
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              {moveHistory.length === 0 ? (
                <p className="text-gray-600 text-xs">No moves yet</p>
              ) : (
                <div className="space-y-0.5 text-xs">
                  {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-1 py-0.5 px-1.5 rounded hover:bg-white/5"
                    >
                      <span className="text-gray-600 w-4">{i + 1}.</span>
                      <span className="text-white flex-1">{moveHistory[i * 2]}</span>
                      <span className="text-gray-400 flex-1">{moveHistory[i * 2 + 1] || ''}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Player Color Indicator */}
            <div className="mt-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  PLAYING AS
                </span>
                <span 
                  className="text-xl"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.4))' }}
                >
                  {playerColor === 'white' ? '♔' : '♚'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.03);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.15);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.25);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default ChessGame;
