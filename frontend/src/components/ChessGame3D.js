import React, { useState, useEffect, useCallback, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Text, useTexture, Html } from '@react-three/drei';
import { Chess } from 'chess.js';
import * as THREE from 'three';
import { ArrowLeft, RotateCcw, Flag, Zap, Eye, EyeOff, Crosshair } from 'lucide-react';
import SneakyEyeTracker from './SneakyEyeTracker';

// Personality imports
import { ELEGANT_CONFIG, ELEGANT_OPENINGS } from '../personalities/elegant';
import { NON_ELEGANT_CONFIG, NON_ELEGANT_OPENINGS } from '../personalities/nonelegant';
import { MINI_A0_CONFIG, MINI_A0_OPENINGS } from '../personalities/minia0';

// ═══════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
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

function getEngineSettingsForEnemy(enemyId) {
  switch (enemyId) {
    case 'elegant':
      return { ...ELEGANT_CONFIG, openings: ELEGANT_OPENINGS, style: 'positional' };
    case 'nonelegant':
      return { ...NON_ELEGANT_CONFIG, openings: NON_ELEGANT_OPENINGS, style: 'aggressive' };
    case 'minia0':
      return { ...MINI_A0_CONFIG, openings: MINI_A0_OPENINGS, style: 'strategic' };
    default:
      return { ...ELEGANT_CONFIG, openings: ELEGANT_OPENINGS, style: 'balanced' };
  }
}

function getAdaptiveDepthForPosition(currentFen, moveNumber, enemyId) {
  const settings = getEngineSettingsForEnemy(enemyId);
  const phase = getGamePhase(moveNumber, currentFen);
  const posType = analyzePositionType(currentFen);
  
  let depth = settings.baseDepth;
  if (phase === "opening") depth = settings.openingDepth;
  else if (phase === "endgame") depth = settings.endgameDepth;
  else if (phase === "middlegame" || phase === "late-middlegame") {
    if (posType === "tactical") depth = settings.tacticalDepth;
    else if (posType === "positional") depth = settings.positionalDepth;
  }
  return depth;
}

function getBookMoveForPosition(fen, color, enemyId) {
  const settings = getEngineSettingsForEnemy(enemyId);
  const fenParts = fen.split(' ');
  const fenKey1 = fenParts.slice(0, 4).join(' ');
  const fenKey2 = fenParts.slice(0, 3).join(' ') + ' -';
  const fenKey3 = fenParts[0] + ' ' + fenParts[1] + ' ' + fenParts[2] + ' -';
  
  let position = settings.openings[fenKey1] || settings.openings[fenKey2] || settings.openings[fenKey3];
  if (!position) return null;
  
  const moves = color === 'w' ? position.white : position.black;
  if (!moves || moves.length === 0) return null;
  
  const aggressionBoost = settings.aggressionFactor || 0.5;
  let adjustedMoves = moves.map((m, idx) => ({
    ...m,
    weight: m.weight * (idx === 0 ? aggressionBoost + 0.15 : 1)
  }));
  
  const totalWeight = adjustedMoves.reduce((sum, m) => sum + m.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let moveOption of adjustedMoves) {
    random -= moveOption.weight;
    if (random <= 0) return moveOption.move;
  }
  
  return moves[0].move;
}

// ═══════════════════════════════════════════════════════════════════════
// 3D CHESS PIECE COMPONENT
// ═══════════════════════════════════════════════════════════════════════
const pieceGeometries = {
  k: { height: 1.2, radius: 0.3, name: 'King' },
  q: { height: 1.1, radius: 0.28, name: 'Queen' },
  r: { height: 0.8, radius: 0.25, name: 'Rook' },
  b: { height: 0.95, radius: 0.22, name: 'Bishop' },
  n: { height: 0.85, radius: 0.24, name: 'Knight' },
  p: { height: 0.6, radius: 0.18, name: 'Pawn' }
};

function ChessPiece3D({ piece, position, isSelected, isValidMove, onClick, isAnimating, targetPosition, enemyColor }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const currentPos = useRef(new THREE.Vector3(...position));
  
  const pieceType = piece.type.toLowerCase();
  const isWhite = piece.color === 'w';
  const geo = pieceGeometries[pieceType];
  
  // Fighter game inspired colors
  const baseColor = isWhite 
    ? new THREE.Color('#e8e8e8') 
    : new THREE.Color('#1a1a2e');
  
  const emissiveColor = isWhite
    ? new THREE.Color('#00ffff')
    : new THREE.Color(enemyColor || '#ff0080');

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smooth animation to target position
      if (isAnimating && targetPosition) {
        currentPos.current.lerp(new THREE.Vector3(...targetPosition), 0.15);
        meshRef.current.position.copy(currentPos.current);
      } else {
        currentPos.current.set(...position);
        meshRef.current.position.set(...position);
      }
      
      // Hover/selection effects
      const targetY = position[1] + (hovered || isSelected ? 0.15 : 0);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
      
      // Fighting game pulse effect
      if (isSelected) {
        const pulse = Math.sin(state.clock.elapsedTime * 8) * 0.05 + 1;
        meshRef.current.scale.setScalar(pulse);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[geo.radius + 0.08, geo.radius + 0.1, 0.1, 16]} />
        <meshStandardMaterial 
          color={baseColor} 
          metalness={0.7} 
          roughness={0.3}
          emissive={isSelected ? emissiveColor : '#000000'}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, geo.height / 2 + 0.1, 0]}>
        <cylinderGeometry args={[geo.radius * 0.7, geo.radius, geo.height, 16]} />
        <meshStandardMaterial 
          color={baseColor} 
          metalness={0.6} 
          roughness={0.4}
          emissive={hovered || isSelected ? emissiveColor : '#000000'}
          emissiveIntensity={hovered ? 0.3 : isSelected ? 0.5 : 0}
        />
      </mesh>
      
      {/* Crown/Top */}
      {pieceType === 'k' && (
        <mesh position={[0, geo.height + 0.2, 0]}>
          <octahedronGeometry args={[0.15, 0]} />
          <meshStandardMaterial 
            color={isWhite ? '#ffd700' : '#ff0080'} 
            metalness={0.9} 
            roughness={0.1}
            emissive={isWhite ? '#ffd700' : '#ff0080'}
            emissiveIntensity={0.4}
          />
        </mesh>
      )}
      
      {pieceType === 'q' && (
        <mesh position={[0, geo.height + 0.15, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial 
            color={isWhite ? '#ffd700' : '#ff00bf'} 
            metalness={0.9} 
            roughness={0.1}
            emissive={isWhite ? '#ffd700' : '#ff00bf'}
            emissiveIntensity={0.4}
          />
        </mesh>
      )}
      
      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[geo.radius + 0.15, geo.radius + 0.25, 32]} />
          <meshBasicMaterial 
            color={emissiveColor} 
            transparent 
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Hover indicator */}
      {hovered && !isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[geo.radius + 0.1, geo.radius + 0.15, 32]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 3D CHESS BOARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════
function ChessBoard3D({ validMoves, lastMove, onSquareClick, enemyColor }) {
  const squares = useMemo(() => {
    const result = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isLight = (row + col) % 2 === 0;
        const square = String.fromCharCode(97 + col) + (row + 1);
        const isValidMove = validMoves.includes(square);
        const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
        
        result.push({
          position: [col - 3.5, 0, row - 3.5],
          isLight,
          square,
          isValidMove,
          isLastMove
        });
      }
    }
    return result;
  }, [validMoves, lastMove]);

  return (
    <group>
      {/* Board base */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[9, 0.2, 9]} />
        <meshStandardMaterial color="#1a0a2e" metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Board border glow */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[8.4, 0.15, 8.4]} />
        <meshStandardMaterial 
          color="#2a1a4a" 
          metalness={0.6} 
          roughness={0.4}
          emissive={enemyColor || '#ff0080'}
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Squares */}
      {squares.map((sq) => (
        <group key={sq.square} position={sq.position}>
          <mesh 
            position={[0, 0.01, 0]} 
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={() => onSquareClick(sq.square)}
          >
            <planeGeometry args={[0.95, 0.95]} />
            <meshStandardMaterial 
              color={sq.isLight ? '#3a3a5a' : '#1a1a2e'}
              metalness={0.3}
              roughness={0.7}
              emissive={sq.isLastMove ? '#ffff00' : (sq.isValidMove ? '#00ff88' : '#000000')}
              emissiveIntensity={sq.isLastMove ? 0.3 : (sq.isValidMove ? 0.4 : 0)}
            />
          </mesh>
          
          {/* Valid move indicator */}
          {sq.isValidMove && (
            <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.15, 16]} />
              <meshBasicMaterial color="#00ff88" transparent opacity={0.7} />
            </mesh>
          )}
        </group>
      ))}
      
      {/* Arena floor effect */}
      <mesh position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#0a0a15" 
          metalness={0.2} 
          roughness={0.9}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ARENA ENVIRONMENT
// ═══════════════════════════════════════════════════════════════════════
function ArenaEnvironment({ enemyColor }) {
  const lightRef = useRef();
  
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <>
      {/* Main lights */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-5, 10, -5]} intensity={0.4} />
      
      {/* Arena spotlights */}
      <spotLight
        ref={lightRef}
        position={[0, 8, 0]}
        angle={0.5}
        penumbra={0.5}
        intensity={0.6}
        color="#ffffff"
        castShadow
      />
      
      {/* Colored accent lights */}
      <pointLight position={[6, 3, 6]} intensity={0.4} color="#00ffff" distance={15} />
      <pointLight position={[-6, 3, -6]} intensity={0.4} color={enemyColor || '#ff0080'} distance={15} />
      <pointLight position={[6, 3, -6]} intensity={0.3} color="#ff00bf" distance={12} />
      <pointLight position={[-6, 3, 6]} intensity={0.3} color="#00ff88" distance={12} />
      
      {/* Arena pillars */}
      {[[-5, 0, -5], [5, 0, -5], [-5, 0, 5], [5, 0, 5]].map((pos, i) => (
        <group key={i} position={pos}>
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.3, 0.4, 4, 8]} />
            <meshStandardMaterial 
              color="#2a1a4a" 
              metalness={0.7} 
              roughness={0.3}
              emissive={i % 2 === 0 ? '#00ffff' : (enemyColor || '#ff0080')}
              emissiveIntensity={0.2}
            />
          </mesh>
          {/* Pillar top light */}
          <pointLight 
            position={[0, 4.2, 0]} 
            intensity={0.3} 
            color={i % 2 === 0 ? '#00ffff' : (enemyColor || '#ff0080')} 
            distance={8} 
          />
        </group>
      ))}
      
      {/* Particle ring effect */}
      <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6, 6.1, 64]} />
        <meshBasicMaterial color={enemyColor || '#ff0080'} transparent opacity={0.5} />
      </mesh>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// CAMERA CONTROLLER
// ═══════════════════════════════════════════════════════════════════════
function CameraController({ playerColor, freeCamera }) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  
  useEffect(() => {
    if (!freeCamera) {
      const isWhite = playerColor === 'white';
      targetPosition.current.set(0, 8, isWhite ? 8 : -8);
    }
  }, [playerColor, freeCamera]);
  
  useFrame(() => {
    if (!freeCamera) {
      camera.position.lerp(targetPosition.current, 0.02);
      camera.lookAt(targetLookAt.current);
    }
  });
  
  return freeCamera ? <OrbitControls enablePan={true} enableZoom={true} maxPolarAngle={Math.PI / 2.1} minDistance={5} maxDistance={20} /> : null;
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN 3D CHESS GAME COMPONENT
// ═══════════════════════════════════════════════════════════════════════
const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const ChessGame3D = ({ enemy, playerColor, onGameEnd, onBack, onSwitchTo2D }) => {
  const gameRef = useRef(null);
  if (gameRef.current === null) {
    gameRef.current = new Chess();
  }
  
  const [position, setPosition] = useState(STARTING_FEN);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [lastMove, setLastMove] = useState(null);
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });
  const [currentTurn, setCurrentTurn] = useState('w');
  const [isInCheck, setIsInCheck] = useState(false);
  const [freeCamera, setFreeCamera] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
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
  
  const enemyRef = useRef(enemy);
  const playerColorRef = useRef(playerColor);
  const gameStatusRef = useRef(gameStatus);
  const onGameEndRef = useRef(onGameEnd);
  
  useEffect(() => {
    enemyRef.current = enemy;
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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Stockfish engine setup (same as 2D version)
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
    stockfishRef.current.postMessage('setoption name MultiPV value 1');
    
    function applyEngineMove(moveStr) {
      const game = gameRef.current;
      const from = moveStr.substring(0, 2);
      const to = moveStr.substring(2, 4);
      const promotion = moveStr.length > 4 ? moveStr[4] : undefined;
      
      try {
        const moveResult = game.move({ from, to, promotion: promotion || 'q' });
        
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
      
      const currentEnemyId = enemyRef.current?.id;
      const currentPlayerColor = playerColorRef.current;
      const settings = getEngineSettingsForEnemy(currentEnemyId);
      const engineColor = currentPlayerColor === 'white' ? 'b' : 'w';
      const currentMoveNumber = moveCountRef.current;
      const currentFen = game.fen();
      
      const openingBookDepth = currentEnemyId === 'minia0' ? 12 : (currentEnemyId === 'elegant' ? 10 : 8);
      if (currentMoveNumber <= openingBookDepth) {
        const bookMove = getBookMoveForPosition(currentFen, engineColor, currentEnemyId);
        if (bookMove) {
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
    
    stockfishRef.current.makeEngineMove = makeEngineMove;
    
    return () => {
      if (stockfishRef.current) stockfishRef.current.terminate();
    };
  }, []);

  // Get pieces from current position
  const pieces = useMemo(() => {
    const game = gameRef.current;
    const result = [];
    const board = game.board();
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[7 - row][col];
        if (piece) {
          const square = String.fromCharCode(97 + col) + (row + 1);
          result.push({
            piece,
            square,
            position: [col - 3.5, 0.1, row - 3.5]
          });
        }
      }
    }
    return result;
  }, [position]);

  const handleSquareClick = useCallback((square) => {
    if (isThinking || gameStatus !== 'playing') return;
    
    const game = gameRef.current;
    const turn = game.turn();
    const isPlayerTurn = (playerColor === 'white' && turn === 'w') || 
                         (playerColor === 'black' && turn === 'b');
    
    if (!isPlayerTurn) return;
    
    const pieceAtSquare = game.get(square);
    const playerPieceColor = playerColor === 'white' ? 'w' : 'b';
    
    // If clicking on own piece, select it
    if (pieceAtSquare && pieceAtSquare.color === playerPieceColor) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setValidMoves(moves.map(m => m.to));
      return;
    }
    
    // If a piece is selected and clicking on valid move
    if (selectedSquare && validMoves.includes(square)) {
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
        }
      } catch (e) {
        console.error('Move error:', e);
      }
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  }, [selectedSquare, validMoves, isThinking, gameStatus, playerColor, onGameEnd]);

  const handlePieceClick = useCallback((square) => {
    handleSquareClick(square);
  }, [handleSquareClick]);

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

  const handleResign = () => {
    setGameStatus('ended');
    onGameEnd('enemy');
  };

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
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-hidden" 
         data-testid="chess-game-3d-container" 
         style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)' }}>
      
      {/* 3D Canvas */}
      <div className={`absolute inset-0 ${isMobile ? 'top-0' : 'top-0'}`} style={{ zIndex: 1 }}>
        <Canvas shadows gl={{ antialias: true }} dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 8, playerColor === 'white' ? 8 : -8]} fov={50} />
          <CameraController playerColor={playerColor} freeCamera={freeCamera} />
          
          <Suspense fallback={null}>
            <ArenaEnvironment enemyColor={enemy?.color} />
            <ChessBoard3D 
              validMoves={validMoves} 
              lastMove={lastMove} 
              onSquareClick={handleSquareClick}
              enemyColor={enemy?.color}
            />
            
            {pieces.map(({ piece, square, position }) => (
              <ChessPiece3D
                key={square}
                piece={piece}
                position={position}
                isSelected={selectedSquare === square}
                isValidMove={validMoves.includes(square)}
                onClick={() => handlePieceClick(square)}
                enemyColor={enemy?.color}
              />
            ))}
          </Suspense>
          
          {/* Fighter game style text */}
          {isInCheck && (
            <Html center position={[0, 4, 0]}>
              <div className="text-red-500 text-4xl font-black animate-pulse" 
                   style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 20px #ff0040' }}>
                CHECK!
              </div>
            </Html>
          )}
          
          {isThinking && (
            <Html center position={[0, 3.5, 0]}>
              <div className="text-purple-400 text-xl font-bold flex items-center gap-2" 
                   style={{ fontFamily: 'Orbitron, sans-serif' }}>
                <Zap className="animate-pulse" size={20} />
                THINKING...
              </div>
            </Html>
          )}
        </Canvas>
      </div>
      
      {/* UI Overlay */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {/* Top Bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
          {/* Enemy Info */}
          <div 
            className="rounded-lg p-3 backdrop-blur-md"
            style={{
              background: 'rgba(10,10,20,0.8)',
              border: `1px solid ${enemy?.color || '#ff0080'}40`
            }}
          >
            <div className="flex items-center gap-3">
              {enemy?.avatar === '👁' ? (
                <SneakyEyeTracker size="small" glowColor={enemy?.color} useImage={true} />
              ) : (
                <span className="text-2xl" style={{ filter: `drop-shadow(0 0 8px ${enemy?.color})` }}>
                  {enemy?.avatar}
                </span>
              )}
              <div>
                <h3 className="text-sm font-bold tracking-wide" style={{ fontFamily: 'Orbitron, sans-serif', color: enemy?.color }}>
                  {enemy?.name}
                </h3>
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  {enemy?.difficulty}
                </p>
              </div>
            </div>
          </div>
          
          {/* Mode indicator */}
          <div 
            className="rounded-lg px-4 py-2 flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #bf00ff40 0%, #ff00bf40 100%)',
              border: '1px solid #bf00ff60'
            }}
          >
            <Crosshair size={16} className="text-purple-400" />
            <span className="text-xs font-bold tracking-widest text-purple-300" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              3D ARENA MODE
            </span>
          </div>
          
          {/* Turn Indicator */}
          <div 
            className={`rounded-lg px-4 py-2 ${isThinking ? 'animate-pulse' : ''}`}
            style={{
              background: isPlayerTurn 
                ? 'linear-gradient(135deg, #00ff8830 0%, #00ff4415 100%)'
                : `linear-gradient(135deg, ${enemy?.color}30 0%, ${enemy?.color}15 100%)`,
              border: `1px solid ${isPlayerTurn ? '#00ff8850' : enemy?.color + '50'}`
            }}
          >
            <span style={{ fontFamily: 'Orbitron, sans-serif', color: isPlayerTurn ? '#00ff88' : enemy?.color, fontSize: '11px' }}>
              {isThinking ? 'THINKING...' : (isPlayerTurn ? 'YOUR TURN' : 'OPPONENT')}
            </span>
          </div>
        </div>
        
        {/* Bottom Controls */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-auto">
          {/* Left controls */}
          <div className="flex flex-col gap-2">
            <button
              data-testid="back-btn-3d"
              onClick={onBack}
              className="flex items-center justify-center gap-1 py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-xs"
              style={{ fontFamily: 'Orbitron, sans-serif', backdropFilter: 'blur(8px)' }}
            >
              <ArrowLeft size={14} />
              BACK
            </button>
            
            <button
              data-testid="switch-2d-btn"
              onClick={onSwitchTo2D}
              className="flex items-center justify-center gap-1 py-2 px-4 rounded-lg transition-all text-xs"
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                background: 'linear-gradient(135deg, #4a3a6a 0%, #2a1a4a 100%)',
                border: '1px solid #8a4aaa50'
              }}
            >
              <EyeOff size={14} />
              SWITCH TO 2D
            </button>
          </div>
          
          {/* Center - Captured pieces */}
          <div 
            className="rounded-lg p-3 max-w-xs"
            style={{
              background: 'rgba(10,10,20,0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <h4 className="text-xs text-gray-500 mb-1 text-center" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              CAPTURED
            </h4>
            <div className="flex justify-center gap-4">
              <div className="flex gap-0.5 text-lg">
                {capturedPieces[playerColor === 'white' ? 'black' : 'white'].map((piece, i) => (
                  <span key={i}>{getPieceSymbol(piece, playerColor === 'white' ? 'black' : 'white')}</span>
                ))}
              </div>
              <div className="w-px bg-white/20" />
              <div className="flex gap-0.5 text-lg">
                {capturedPieces[playerColor].map((piece, i) => (
                  <span key={i}>{getPieceSymbol(piece, playerColor)}</span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right controls */}
          <div className="flex flex-col gap-2">
            <button
              data-testid="camera-toggle-btn"
              onClick={() => setFreeCamera(!freeCamera)}
              className="flex items-center justify-center gap-1 py-2 px-4 rounded-lg transition-all text-xs"
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                background: freeCamera ? 'linear-gradient(135deg, #00ffff40 0%, #0080ff40 100%)' : 'rgba(255,255,255,0.1)',
                border: freeCamera ? '1px solid #00ffff60' : '1px solid transparent',
                backdropFilter: 'blur(8px)'
              }}
            >
              <Eye size={14} className={freeCamera ? 'text-cyan-400' : ''} />
              {freeCamera ? 'FREE CAM' : 'LOCKED CAM'}
            </button>
            
            <button
              data-testid="reset-btn-3d"
              onClick={resetGame}
              className="flex items-center justify-center gap-1 py-2 px-4 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 transition-all text-xs"
              style={{ fontFamily: 'Orbitron, sans-serif', backdropFilter: 'blur(8px)' }}
            >
              <RotateCcw size={14} />
              RESET
            </button>
            
            <button
              data-testid="resign-btn-3d"
              onClick={handleResign}
              className="flex items-center justify-center gap-1 py-2 px-4 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-all text-xs"
              style={{ fontFamily: 'Orbitron, sans-serif', backdropFilter: 'blur(8px)' }}
            >
              <Flag size={14} />
              RESIGN
            </button>
          </div>
        </div>
        
        {/* Move History (side panel) */}
        <div 
          className="absolute right-4 top-1/2 -translate-y-1/2 w-40 rounded-lg p-3 pointer-events-auto"
          style={{
            background: 'rgba(10,10,20,0.8)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(8px)',
            maxHeight: '200px'
          }}
        >
          <h3 className="text-xs font-bold tracking-wider mb-2 text-gray-400" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            MOVES
          </h3>
          <div className="h-32 overflow-y-auto pr-1 custom-scrollbar" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            {moveHistory.length === 0 ? (
              <p className="text-gray-600 text-xs">No moves yet</p>
            ) : (
              <div className="space-y-0.5 text-xs">
                {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => (
                  <div key={i} className="flex items-center gap-1 py-0.5 px-1 rounded hover:bg-white/5">
                    <span className="text-gray-600 w-4">{i + 1}.</span>
                    <span className="text-white flex-1">{moveHistory[i * 2]}</span>
                    <span className="text-gray-400 flex-1">{moveHistory[i * 2 + 1] || ''}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessGame3D;
