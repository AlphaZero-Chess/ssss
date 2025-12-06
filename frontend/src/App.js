import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EnemySelect from "./components/EnemySelect";
import ColorSelect from "./components/ColorSelect";
import ChessGame from "./components/ChessGame";
import VictoryScreen from "./components/VictoryScreen";
import { AchievementNotificationProvider } from "./components/AchievementsDisplay";
import { recordGameResult, triggerAchievementNotification } from "./utils/AchievementsManager";

function App() {
  const [gameState, setGameState] = useState("enemy-select"); // enemy-select, color-select, playing, victory
  const [selectedEnemy, setSelectedEnemy] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [winner, setWinner] = useState(null);

  const handleEnemySelect = (enemy) => {
    setSelectedEnemy(enemy);
    setGameState("color-select");
  };

  const handleColorSelect = (color) => {
    setPlayerColor(color);
    setGameState("playing");
  };

  const handleGameEnd = (result, isStalemate = false) => {
    setWinner(result);
    setGameState("victory");
    
    // Record achievement - pass enemy id and stalemate flag
    if (selectedEnemy) {
      const newAchievements = recordGameResult(result, selectedEnemy.id, isStalemate);
      // Trigger notifications for each new achievement
      newAchievements.forEach(achievement => {
        triggerAchievementNotification(achievement);
      });
    }
  };

  const handleRestart = () => {
    setGameState("enemy-select");
    setSelectedEnemy(null);
    setPlayerColor(null);
    setWinner(null);
  };

  // Play again with the same enemy - go directly to color selection
  const handlePlayAgain = () => {
    setPlayerColor(null);
    setWinner(null);
    setGameState("color-select");
  };

  return (
    <AchievementNotificationProvider>
      <div className="App">
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
    </AchievementNotificationProvider>
  );
}

export default App;
