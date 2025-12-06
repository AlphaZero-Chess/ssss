import { useState, useCallback, useRef, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EnemySelect from "./components/EnemySelect";
import ColorSelect from "./components/ColorSelect";
import ChessGame from "./components/ChessGame";
import VictoryScreen from "./components/VictoryScreen";
// Achievements System - MODULAR, can be removed without breaking the app
import { AchievementsProvider, useAchievementsContext } from "./context/AchievementsContext";
import AchievementsPanel from "./components/AchievementsPanel";
import AchievementNotification from "./components/AchievementNotification";

// Main App Content - Separated for context access
function AppContent() {
  const [gameState, setGameState] = useState("enemy-select"); // enemy-select, color-select, playing, victory
  const [selectedEnemy, setSelectedEnemy] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [winner, setWinner] = useState(null);
  const [moveCount, setMoveCount] = useState(0);
  const [piecesLost, setPiecesLost] = useState(0);
  const [isAchievementsPanelOpen, setIsAchievementsPanelOpen] = useState(false);
  
  // Achievements context - BACKWARD COMPATIBLE (returns no-op if not available)
  const {
    getAllAchievements,
    statistics,
    notifications,
    dismissNotification,
    recordGameResult,
    onAlphazeroChallenged,
    isLoaded: achievementsLoaded
  } = useAchievementsContext();
  
  // Ref to track if AlphaZero challenge was recorded
  const alphazeroRecordedRef = useRef(false);

  const handleEnemySelect = useCallback((enemy) => {
    setSelectedEnemy(enemy);
    setGameState("color-select");
    
    // Track if AlphaZero was challenged (hidden master)
    if (enemy?.id === 'alphazero' && !alphazeroRecordedRef.current) {
      alphazeroRecordedRef.current = true;
      onAlphazeroChallenged();
    }
  }, [onAlphazeroChallenged]);

  const handleColorSelect = useCallback((color) => {
    setPlayerColor(color);
    setMoveCount(0);
    setPiecesLost(0);
    setGameState("playing");
  }, []);

  const handleGameEnd = useCallback((result, gameMoveCount = 0, gamePiecesLost = 0) => {
    setWinner(result);
    setMoveCount(gameMoveCount);
    setPiecesLost(gamePiecesLost);
    setGameState("victory");
    
    // Record game result for achievements
    if (selectedEnemy) {
      // Handle stalemate vs regular draw
      const resultType = result === 'draw' && gameMoveCount > 0 ? 'draw' : result;
      recordGameResult(resultType, selectedEnemy.id, gameMoveCount, gamePiecesLost);
    }
  }, [selectedEnemy, recordGameResult]);

  const handleRestart = useCallback(() => {
    setGameState("enemy-select");
    setSelectedEnemy(null);
    setPlayerColor(null);
    setWinner(null);
    setMoveCount(0);
    setPiecesLost(0);
    alphazeroRecordedRef.current = false;
  }, []);

  // Play again with the same enemy - go directly to color selection
  const handlePlayAgain = useCallback(() => {
    setPlayerColor(null);
    setWinner(null);
    setMoveCount(0);
    setPiecesLost(0);
    setGameState("color-select");
  }, []);

  // Get all achievements for the panel
  const allAchievements = achievementsLoaded ? getAllAchievements() : [];

  return (
    <div className="App">
      {/* Achievement Notifications - MODULAR */}
      <AchievementNotification 
        notifications={notifications} 
        onDismiss={dismissNotification} 
      />
      
      {/* Achievements Panel - MODULAR */}
      <AchievementsPanel
        achievements={allAchievements}
        statistics={statistics}
        isOpen={isAchievementsPanelOpen}
        onClose={() => setIsAchievementsPanelOpen(false)}
        onToggle={() => setIsAchievementsPanelOpen(prev => !prev)}
      />
      
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div className="game-container">
                {gameState === "enemy-select" && (
                  <EnemySelect onSelect={handleEnemySelect} />
                )}
                {gameState === "color-select" && (
                  <ColorSelect
                    enemy={selectedEnemy}
                    onSelect={handleColorSelect}
                    onBack={() => setGameState("enemy-select")}
                  />
                )}
                {gameState === "playing" && (
                  <ChessGame
                    enemy={selectedEnemy}
                    playerColor={playerColor}
                    onGameEnd={handleGameEnd}
                    onBack={() => setGameState("color-select")}
                  />
                )}
                {gameState === "victory" && (
                  <VictoryScreen
                    winner={winner}
                    enemy={selectedEnemy}
                    playerColor={playerColor}
                    onPlayAgain={handlePlayAgain}
                    onNewEnemy={handleRestart}
                  />
                )}
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

// Main App with Achievements Provider wrapper
function App() {
  return (
    <AchievementsProvider>
      <AppContent />
    </AchievementsProvider>
  );
}

export default App;
