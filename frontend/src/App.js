import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EnemySelect from "./components/EnemySelect";
import ColorSelect from "./components/ColorSelect";
import ChessGame from "./components/ChessGame";
import VictoryScreen from "./components/VictoryScreen";

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

  const handleGameEnd = (result) => {
    setWinner(result);
    setGameState("victory");
  };

  const handleRestart = () => {
    setGameState("enemy-select");
    setSelectedEnemy(null);
    setPlayerColor(null);
    setWinner(null);
  };

  return (
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
                    onRestart={handleRestart}
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

export default App;
