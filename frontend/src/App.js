import { useState, lazy, Suspense } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EnemySelect from "./components/EnemySelect";
import ColorSelect from "./components/ColorSelect";
import ChessGame from "./components/ChessGame";
import VictoryScreen from "./components/VictoryScreen";
import ModeSelect from "./components/ModeSelect";

// Lazy load 3D component for better performance
const ChessGame3D = lazy(() => import("./components/ChessGame3D"));

// Loading fallback for 3D mode
const Loading3D = () => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center" 
       style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)' }}>
    <div className="text-center">
      <div className="inline-block w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-purple-400 text-lg font-bold tracking-widest" style={{ fontFamily: 'Orbitron, sans-serif' }}>
        LOADING 3D ARENA...
      </p>
    </div>
  </div>
);

function App() {
  // Game flow states: enemy-select -> color-select -> mode-select -> playing/playing-3d -> victory
  const [gameState, setGameState] = useState("enemy-select");
  const [selectedEnemy, setSelectedEnemy] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [winner, setWinner] = useState(null);
  const [gameMode, setGameMode] = useState("2d"); // "2d" or "3d"

  const handleEnemySelect = (enemy) => {
    setSelectedEnemy(enemy);
    setGameState("color-select");
  };

  const handleColorSelect = (color) => {
    setPlayerColor(color);
    // Go to mode selection after color selection
    setGameState("mode-select");
  };

  const handleModeSelect = (mode) => {
    setGameMode(mode);
    setGameState(mode === "3d" ? "playing-3d" : "playing");
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
    setGameMode("2d");
  };

  // Play again with the same enemy - go directly to mode selection
  const handlePlayAgain = () => {
    setPlayerColor(null);
    setWinner(null);
    setGameState("color-select");
  };

  // Switch between 2D and 3D modes during gameplay
  const handleSwitchTo2D = () => {
    setGameState("playing");
    setGameMode("2d");
  };

  const handleSwitchTo3D = () => {
    setGameState("playing-3d");
    setGameMode("3d");
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
                {gameState === "mode-select" && (
                  <ModeSelect
                    enemy={selectedEnemy}
                    playerColor={playerColor}
                    onSelectMode={handleModeSelect}
                    onBack={() => setGameState("color-select")}
                  />
                )}
                {gameState === "playing" && (
                  <ChessGame
                    enemy={selectedEnemy}
                    playerColor={playerColor}
                    onGameEnd={handleGameEnd}
                    onBack={() => setGameState("mode-select")}
                    onSwitchTo3D={handleSwitchTo3D}
                  />
                )}
                {gameState === "playing-3d" && (
                  <Suspense fallback={<Loading3D />}>
                    <ChessGame3D
                      enemy={selectedEnemy}
                      playerColor={playerColor}
                      onGameEnd={handleGameEnd}
                      onBack={() => setGameState("mode-select")}
                      onSwitchTo2D={handleSwitchTo2D}
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
