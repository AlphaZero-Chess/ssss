import { useState, lazy, Suspense } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EnemySelect from "./components/EnemySelect";
import ColorSelect from "./components/ColorSelect";
import ChessGame from "./components/ChessGame";
import VictoryScreen from "./components/VictoryScreen";

// Lazy load 3D component for better performance
const ChessGame3D = lazy(() => import("./components/ChessGame3D"));

// Loading component for 3D mode
const Loading3D = () => (
  <div className="fixed inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a0520 0%, #1a0a40 50%, #0a0520 100%)' }}>
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-purple-400 text-lg" style={{ fontFamily: 'Orbitron, sans-serif' }}>ENTERING 3D REALM...</p>
      <p className="text-gray-500 text-sm mt-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Loading fantasy world</p>
    </div>
  </div>
);

function App() {
  const [gameState, setGameState] = useState("enemy-select"); // enemy-select, color-select, playing, playing-3d, victory
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

  // Play again with the same enemy - go directly to color selection
  const handlePlayAgain = () => {
    setPlayerColor(null);
    setWinner(null);
    setGameState("color-select");
  };

  // Switch to 3D mode
  const handleSwitch3D = () => {
    setGameState("playing-3d");
  };

  // Switch to 2D mode
  const handleSwitch2D = () => {
    setGameState("playing");
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
                    onSwitch3D={handleSwitch3D}
                  />
                )}
                {gameState === "playing-3d" && (
                  <Suspense fallback={<Loading3D />}>
                    <ChessGame3D
                      enemy={selectedEnemy}
                      playerColor={playerColor}
                      onGameEnd={handleGameEnd}
                      onBack={() => setGameState("color-select")}
                      onSwitch2D={handleSwitch2D}
                    />
                  </Suspense>
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
