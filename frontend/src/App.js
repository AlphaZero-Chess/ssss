import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EnemySelect from "./components/EnemySelect";
import ColorSelect from "./components/ColorSelect";
import ChessGame from "./components/ChessGame";
import ChessGame3D from "./components/ChessGame3D";
import VictoryScreen from "./components/VictoryScreen";

function App() {
  const [gameState, setGameState] = useState("enemy-select"); // enemy-select, color-select, playing, victory
  const [selectedEnemy, setSelectedEnemy] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [winner, setWinner] = useState(null);
  const [use3DMode, setUse3DMode] = useState(false); // 3D mode for AlphaZero

  const handleEnemySelect = (enemy) => {
    setSelectedEnemy(enemy);
    // Enable 3D mode for AlphaZero (Hidden Master)
    setUse3DMode(enemy?.id === 'alphazero');
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
    setUse3DMode(false);
  };

  // Play again with the same enemy - go directly to color selection
  const handlePlayAgain = () => {
    setPlayerColor(null);
    setWinner(null);
    setGameState("color-select");
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
                  use3DMode ? (
                    <ChessGame3D
                      enemy={selectedEnemy}
                      playerColor={playerColor}
                      onGameEnd={handleGameEnd}
                      onBack={() => setGameState("color-select")}
                    />
                  ) : (
                    <ChessGame
                      enemy={selectedEnemy}
                      playerColor={playerColor}
                      onGameEnd={handleGameEnd}
                      onBack={() => setGameState("color-select")}
                    />
                  )
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

export default App;
