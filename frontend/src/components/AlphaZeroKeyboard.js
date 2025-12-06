import React, { useState, useCallback, useEffect, useMemo } from 'react';

/**
 * AlphaZeroKeyboard - A custom futuristic keyboard for the Among Us easter egg
 * 
 * Features:
 * - Custom AlphaZero-themed virtual keyboard
 * - Glowing keys with neural network aesthetic
 * - Supports typing the secret word "ALPHA"
 * - Animated feedback on key press
 * - Backspace and clear functionality
 * 
 * This component is designed to be non-breaking and retractable.
 */

// The secret code
const SECRET_CODE = 'ALPHA';

// Keyboard layout - QWERTY style but AlphaZero themed
const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
];

// Rune symbols for decoration
const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ'];

const AlphaZeroKeyboard = ({ onSecretEntered, onClose, isVisible = true }) => {
  const [inputValue, setInputValue] = useState('');
  const [pressedKey, setPressedKey] = useState(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [particles, setParticles] = useState([]);

  // Check if the entered text matches the secret code
  const checkSecret = useCallback((value) => {
    if (value === SECRET_CODE) {
      setIsUnlocking(true);
      // Trigger unlock after animation
      setTimeout(() => {
        if (onSecretEntered) {
          onSecretEntered();
        }
      }, 800);
      return true;
    }
    return false;
  }, [onSecretEntered]);

  // Handle key press
  const handleKeyPress = useCallback((key) => {
    setPressedKey(key);
    
    // Create particle effect
    const newParticle = {
      id: Date.now(),
      key,
      x: Math.random() * 100,
      y: Math.random() * 100
    };
    setParticles(prev => [...prev, newParticle]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 500);

    setTimeout(() => setPressedKey(null), 150);

    if (key === '⌫') {
      // Backspace
      setInputValue(prev => prev.slice(0, -1));
    } else {
      setInputValue(prev => {
        const newValue = (prev + key).slice(0, 5); // Max 5 characters
        checkSecret(newValue);
        return newValue;
      });
    }
  }, [checkSecret]);

  // Clear input
  const handleClear = useCallback(() => {
    setInputValue('');
  }, []);

  // Check for matching prefix
  const isValidPrefix = useMemo(() => {
    return SECRET_CODE.startsWith(inputValue);
  }, [inputValue]);

  // Progress indicators
  const progressIndicators = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      filled: i < inputValue.length,
      correct: inputValue[i] === SECRET_CODE[i],
      char: inputValue[i] || '',
      rune: RUNES[i]
    }));
  }, [inputValue]);

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <div 
      className="alphazero-keyboard-overlay"
      data-testid="alphazero-keyboard"
    >
      {/* Background blur */}
      <div className="keyboard-backdrop" onClick={onClose} />
      
      {/* Main keyboard container */}
      <div className={`keyboard-container ${isUnlocking ? 'unlocking' : ''}`}>
        {/* Neural network header decoration */}
        <div className="keyboard-header">
          <div className="neural-dots">
            {Array.from({ length: 7 }, (_, i) => (
              <div 
                key={i} 
                className="neural-dot"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          <div className="keyboard-title">
            <span className="title-rune">ᛟ</span>
            <span className="title-text">ALPHAZERO INTERFACE</span>
            <span className="title-rune">ᛟ</span>
          </div>
        </div>

        {/* Input display */}
        <div className="input-display">
          <div className="input-label">ENTER ANCIENT NAME</div>
          <div className="input-boxes">
            {progressIndicators.map((indicator, i) => (
              <div 
                key={i}
                className={`input-box ${indicator.filled ? 'filled' : ''} ${indicator.filled && indicator.correct ? 'correct' : ''} ${indicator.filled && !indicator.correct ? 'incorrect' : ''}`}
                data-testid={`input-box-${i}`}
              >
                <span className="box-rune">{indicator.rune}</span>
                <span className="box-char">{indicator.char}</span>
                <div className="box-glow" />
              </div>
            ))}
          </div>
          {!isValidPrefix && inputValue.length > 0 && (
            <div className="input-error">SEQUENCE INVALID</div>
          )}
        </div>

        {/* Keyboard keys */}
        <div className="keyboard-keys">
          {KEYBOARD_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="keyboard-row">
              {row.map((key) => {
                const isPressed = pressedKey === key;
                const isBackspace = key === '⌫';
                const isHighlighted = !isBackspace && SECRET_CODE.includes(key);
                
                return (
                  <button
                    key={key}
                    className={`keyboard-key ${isPressed ? 'pressed' : ''} ${isHighlighted ? 'highlighted' : ''} ${isBackspace ? 'backspace' : ''}`}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleKeyPress(key);
                    }}
                    data-testid={`key-${key === '⌫' ? 'backspace' : key}`}
                  >
                    <span className="key-char">{key}</span>
                    <div className="key-glow" />
                    <div className="key-circuit" />
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="keyboard-actions">
          <button 
            className="action-btn clear-btn"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClear();
            }}
            data-testid="clear-btn"
          >
            <span>CLEAR</span>
          </button>
          <button 
            className="action-btn close-btn"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onClose) onClose();
            }}
            data-testid="close-keyboard-btn"
          >
            <span>CLOSE</span>
          </button>
        </div>

        {/* Particle effects */}
        <div className="particle-container">
          {particles.map(particle => (
            <div 
              key={particle.id}
              className="key-particle"
              style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
            >
              {particle.key}
            </div>
          ))}
        </div>

        {/* Unlock effect */}
        {isUnlocking && (
          <div className="unlock-effect" data-testid="unlock-effect">
            <div className="unlock-burst" />
            <div className="unlock-text">ACCESS GRANTED</div>
            <div className="unlock-runes">
              {RUNES.map((rune, i) => (
                <span 
                  key={i} 
                  className="unlock-rune"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {rune}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Circuit decoration */}
        <div className="circuit-lines">
          <svg className="circuit-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 L20,50 L25,45 L35,45 L40,50 L100,50" className="circuit-path" />
            <path d="M50,0 L50,20 L55,25 L55,35 L50,40 L50,100" className="circuit-path" />
          </svg>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .alphazero-keyboard-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 16px;
          animation: fade-in 0.3s ease-out;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .keyboard-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
        }

        .keyboard-container {
          position: relative;
          width: 100%;
          max-width: 400px;
          background: linear-gradient(180deg, rgba(30, 15, 50, 0.98) 0%, rgba(15, 8, 30, 0.99) 100%);
          border: 2px solid rgba(191, 0, 255, 0.5);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 
            0 0 30px rgba(191, 0, 255, 0.3),
            0 0 60px rgba(191, 0, 255, 0.15),
            inset 0 0 30px rgba(191, 0, 255, 0.05);
          transform: translateY(0);
          animation: slide-up-keyboard 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          overflow: hidden;
          touch-action: manipulation;
          -webkit-touch-callout: none;
        }

        @keyframes slide-up-keyboard {
          from { 
            transform: translateY(100%);
            opacity: 0;
          }
          to { 
            transform: translateY(0);
            opacity: 1;
          }
        }

        .keyboard-container.unlocking {
          animation: unlock-pulse 0.8s ease-out forwards;
        }

        @keyframes unlock-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); box-shadow: 0 0 60px rgba(0, 255, 136, 0.5); }
          100% { transform: scale(1); opacity: 0; }
        }

        .keyboard-header {
          text-align: center;
          margin-bottom: 16px;
        }

        .neural-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .neural-dot {
          width: 6px;
          height: 6px;
          background: #bf00ff;
          border-radius: 50%;
          animation: neural-pulse 1.5s ease-in-out infinite;
          box-shadow: 0 0 8px #bf00ff;
        }

        @keyframes neural-pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .keyboard-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .title-rune {
          font-size: 16px;
          color: #bf00ff;
          text-shadow: 0 0 10px #bf00ff;
        }

        .title-text {
          font-family: 'Orbitron', sans-serif;
          font-size: 12px;
          color: #e0a0ff;
          letter-spacing: 3px;
        }

        .input-display {
          margin-bottom: 16px;
        }

        .input-label {
          font-family: 'Rajdhani', sans-serif;
          font-size: 10px;
          color: rgba(200, 150, 255, 0.6);
          text-align: center;
          letter-spacing: 2px;
          margin-bottom: 8px;
        }

        .input-boxes {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .input-box {
          width: 48px;
          height: 56px;
          background: rgba(20, 10, 40, 0.8);
          border: 2px solid rgba(191, 0, 255, 0.3);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.2s ease;
        }

        .input-box.filled {
          border-color: rgba(191, 0, 255, 0.6);
          background: rgba(40, 20, 60, 0.9);
        }

        .input-box.correct {
          border-color: rgba(0, 255, 136, 0.6);
          box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
        }

        .input-box.incorrect {
          border-color: rgba(255, 0, 80, 0.6);
          box-shadow: 0 0 15px rgba(255, 0, 80, 0.3);
          animation: shake-box 0.3s ease;
        }

        @keyframes shake-box {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }

        .box-rune {
          font-size: 10px;
          color: rgba(191, 0, 255, 0.4);
          position: absolute;
          top: 4px;
        }

        .box-char {
          font-family: 'Orbitron', sans-serif;
          font-size: 24px;
          font-weight: bold;
          color: #e0a0ff;
          text-shadow: 0 0 10px rgba(191, 0, 255, 0.5);
        }

        .box-glow {
          position: absolute;
          inset: -2px;
          border-radius: 8px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .input-box.filled .box-glow {
          opacity: 1;
          background: radial-gradient(circle at center, rgba(191, 0, 255, 0.2) 0%, transparent 70%);
        }

        .input-error {
          font-family: 'Orbitron', sans-serif;
          font-size: 9px;
          color: #ff0050;
          text-align: center;
          margin-top: 8px;
          letter-spacing: 2px;
          animation: blink-error 0.5s ease infinite;
        }

        @keyframes blink-error {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .keyboard-keys {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;
          touch-action: manipulation;
          pointer-events: auto;
        }

        .keyboard-row {
          display: flex;
          justify-content: center;
          gap: 4px;
          touch-action: manipulation;
          pointer-events: auto;
        }

        .keyboard-key {
          width: 32px;
          height: 40px;
          background: linear-gradient(180deg, rgba(50, 30, 80, 0.9) 0%, rgba(30, 15, 50, 0.95) 100%);
          border: 1px solid rgba(191, 0, 255, 0.3);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
          transition: all 0.15s ease;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          user-select: none;
          -webkit-user-select: none;
          pointer-events: auto;
        }

        .keyboard-key:active,
        .keyboard-key.pressed {
          transform: scale(0.95);
          background: linear-gradient(180deg, rgba(80, 40, 120, 0.95) 0%, rgba(50, 25, 80, 0.98) 100%);
          border-color: rgba(191, 0, 255, 0.8);
          box-shadow: 0 0 15px rgba(191, 0, 255, 0.4);
        }

        .keyboard-key.highlighted {
          border-color: rgba(255, 204, 0, 0.5);
          box-shadow: 0 0 10px rgba(255, 204, 0, 0.2);
        }

        .keyboard-key.highlighted .key-char {
          color: #ffcc00;
        }

        .keyboard-key.backspace {
          width: 48px;
          background: linear-gradient(180deg, rgba(80, 20, 40, 0.9) 0%, rgba(50, 10, 30, 0.95) 100%);
          border-color: rgba(255, 0, 80, 0.3);
        }

        .keyboard-key.backspace:active {
          border-color: rgba(255, 0, 80, 0.8);
          box-shadow: 0 0 15px rgba(255, 0, 80, 0.4);
        }

        .key-char {
          font-family: 'Orbitron', sans-serif;
          font-size: 14px;
          font-weight: bold;
          color: #c8a0e0;
          z-index: 2;
          pointer-events: none;
        }

        .key-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(191, 0, 255, 0.3) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.15s ease;
          pointer-events: none;
        }

        .keyboard-key:active .key-glow,
        .keyboard-key.pressed .key-glow {
          opacity: 1;
        }

        .key-circuit {
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(191, 0, 255, 0.4), transparent);
          pointer-events: none;
        }

        .keyboard-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .action-btn {
          padding: 10px 24px;
          font-family: 'Orbitron', sans-serif;
          font-size: 11px;
          font-weight: bold;
          letter-spacing: 2px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          user-select: none;
          -webkit-user-select: none;
          pointer-events: auto;
        }

        .clear-btn {
          background: linear-gradient(180deg, rgba(60, 60, 80, 0.9) 0%, rgba(40, 40, 60, 0.95) 100%);
          border: 1px solid rgba(150, 150, 200, 0.3);
          color: #a0a0c0;
        }

        .clear-btn:active {
          transform: scale(0.95);
          border-color: rgba(150, 150, 200, 0.6);
        }

        .close-btn {
          background: linear-gradient(180deg, rgba(80, 40, 80, 0.9) 0%, rgba(50, 25, 50, 0.95) 100%);
          border: 1px solid rgba(191, 0, 255, 0.3);
          color: #c080c0;
        }

        .close-btn:active {
          transform: scale(0.95);
          border-color: rgba(191, 0, 255, 0.6);
        }

        .particle-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .key-particle {
          position: absolute;
          font-family: 'Orbitron', sans-serif;
          font-size: 16px;
          color: #bf00ff;
          text-shadow: 0 0 10px #bf00ff;
          animation: particle-float 0.5s ease-out forwards;
          pointer-events: none;
        }

        @keyframes particle-float {
          from { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to { 
            opacity: 0;
            transform: translateY(-30px) scale(0.5);
          }
        }

        .unlock-effect {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(0, 20, 10, 0.95);
          z-index: 10;
          animation: unlock-appear 0.3s ease-out;
        }

        @keyframes unlock-appear {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .unlock-burst {
          position: absolute;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(0, 255, 136, 0.4) 0%, transparent 70%);
          animation: burst 0.8s ease-out;
        }

        @keyframes burst {
          from { transform: scale(0); opacity: 1; }
          to { transform: scale(3); opacity: 0; }
        }

        .unlock-text {
          font-family: 'Orbitron', sans-serif;
          font-size: 20px;
          font-weight: bold;
          color: #00ff88;
          text-shadow: 0 0 20px #00ff88;
          letter-spacing: 4px;
          animation: glow-text 0.5s ease infinite alternate;
        }

        @keyframes glow-text {
          from { text-shadow: 0 0 20px #00ff88; }
          to { text-shadow: 0 0 30px #00ff88, 0 0 50px #00ff88; }
        }

        .unlock-runes {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }

        .unlock-rune {
          font-size: 18px;
          color: #00ff88;
          text-shadow: 0 0 10px #00ff88;
          animation: rune-appear 0.3s ease-out forwards;
          opacity: 0;
        }

        @keyframes rune-appear {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .circuit-lines {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.3;
        }

        .circuit-svg {
          width: 100%;
          height: 100%;
        }

        .circuit-path {
          fill: none;
          stroke: #bf00ff;
          stroke-width: 0.5;
          stroke-dasharray: 10 5;
          animation: circuit-flow 2s linear infinite;
        }

        @keyframes circuit-flow {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -30; }
        }
      `}</style>
    </div>
  );
};

export default AlphaZeroKeyboard;
