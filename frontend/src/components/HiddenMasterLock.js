import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Lock } from 'lucide-react';

// Secret code: Type "ALPHA" to unlock the hidden master
const SECRET_CODE = ['a', 'l', 'p', 'h', 'a'];
const STORAGE_KEY = 'hiddenMasterUnlocked';

// Pre-generate random positions for smoke particles
const generateParticleStyles = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    left: `${10 + (i * 17) % 80}%`,
    top: `${10 + (i * 23) % 80}%`,
    animationDelay: `${(i * 0.3) % 2}s`,
    animationDuration: `${3 + (i * 0.2) % 2}s`
  }));
};

const PARTICLE_STYLES = generateParticleStyles(20);

const HiddenMasterLock = ({ children, onUnlock }) => {
  // Initialize state based on localStorage
  const [isLocked, setIsLocked] = useState(() => {
    const unlocked = localStorage.getItem(STORAGE_KEY);
    return unlocked !== 'true';
  });
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [codeProgress, setCodeProgress] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const hintTimerRef = useRef(null);

  // Trigger unlock function
  const triggerUnlock = useCallback(() => {
    setIsUnlocking(true);
    
    // After animation completes, set unlocked state
    setTimeout(() => {
      setIsLocked(false);
      setIsUnlocking(false);
      localStorage.setItem(STORAGE_KEY, 'true');
      if (onUnlock) onUnlock();
    }, 2500);
  }, [onUnlock]);

  // Secret code listener
  const handleKeyPress = useCallback((e) => {
    if (!isLocked || isUnlocking) return;

    const key = e.key.toLowerCase();
    
    setCodeProgress(prev => {
      const newProgress = [...prev, key];
      
      // Check if the sequence matches the start of the secret code
      const isValidProgress = SECRET_CODE.slice(0, newProgress.length).every(
        (char, i) => char === newProgress[i]
      );

      if (!isValidProgress) {
        return [key === SECRET_CODE[0] ? key : ''];
      }

      // Check if complete code entered
      if (newProgress.length === SECRET_CODE.length) {
        triggerUnlock();
        return [];
      }

      return newProgress;
    });
  }, [isLocked, isUnlocking, triggerUnlock]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Show hint after hovering for 3 seconds
  const handleMouseEnter = useCallback(() => {
    if (isLocked && !isUnlocking) {
      hintTimerRef.current = setTimeout(() => setShowHint(true), 3000);
    }
  }, [isLocked, isUnlocking]);

  const handleMouseLeave = useCallback(() => {
    setShowHint(false);
    if (hintTimerRef.current) {
      clearTimeout(hintTimerRef.current);
    }
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hintTimerRef.current) {
        clearTimeout(hintTimerRef.current);
      }
    };
  }, []);

  // Memoize particle elements
  const smokeParticles = useMemo(() => (
    PARTICLE_STYLES.map((style, i) => (
      <div 
        key={i} 
        className={`smoke-particle ${isUnlocking ? 'particle-disperse' : ''}`}
        style={style}
      />
    ))
  ), [isUnlocking]);

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div 
      className="hidden-master-lock-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid="hidden-master-lock"
    >
      {/* The card underneath - with aura leaking through */}
      <div className="locked-card-container">
        {children}
      </div>

      {/* Smoke Overlay - hollow black smoke effect */}
      <div className={`smoke-overlay ${isUnlocking ? 'smoke-disperse' : ''}`}>
        <div className="smoke-layer smoke-layer-1" />
        <div className="smoke-layer smoke-layer-2" />
        <div className="smoke-layer smoke-layer-3" />
        <div className="smoke-particles">
          {smokeParticles}
        </div>
      </div>

      {/* Chains */}
      <div className={`chains-container ${isUnlocking ? 'chains-break' : ''}`}>
        {/* Horizontal chains */}
        <div className="chain chain-h chain-h-1">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="chain-link" style={{ animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>
        <div className="chain chain-h chain-h-2">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="chain-link" style={{ animationDelay: `${i * 0.05 + 0.1}s` }} />
          ))}
        </div>
        
        {/* Vertical chains */}
        <div className="chain chain-v chain-v-1">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="chain-link" style={{ animationDelay: `${i * 0.04}s` }} />
          ))}
        </div>
        <div className="chain chain-v chain-v-2">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="chain-link" style={{ animationDelay: `${i * 0.04 + 0.15}s` }} />
          ))}
        </div>

        {/* Diagonal chains */}
        <div className="chain chain-d chain-d-1">
          {[...Array(14)].map((_, i) => (
            <div key={i} className="chain-link" style={{ animationDelay: `${i * 0.03}s` }} />
          ))}
        </div>
        <div className="chain chain-d chain-d-2">
          {[...Array(14)].map((_, i) => (
            <div key={i} className="chain-link" style={{ animationDelay: `${i * 0.03 + 0.2}s` }} />
          ))}
        </div>
      </div>

      {/* Padlock */}
      <div className={`padlock-container ${isUnlocking ? 'padlock-fall' : ''}`}>
        <div className="padlock">
          <div className="padlock-shackle">
            <div className="shackle-inner" />
          </div>
          <div className="padlock-body">
            <Lock className="padlock-icon" size={24} />
            <div className="padlock-keyhole" />
          </div>
          <div className="padlock-glow" />
        </div>
      </div>

      {/* Code Progress Indicator */}
      {codeProgress.length > 0 && !isUnlocking && (
        <div className="code-progress" data-testid="code-progress">
          {SECRET_CODE.map((_, i) => (
            <div 
              key={i} 
              className={`progress-dot ${i < codeProgress.length ? 'active' : ''}`}
            />
          ))}
        </div>
      )}

      {/* Hint */}
      {showHint && !isUnlocking && (
        <div className="unlock-hint" data-testid="unlock-hint">
          <span className="hint-text">Type the secret word...</span>
        </div>
      )}

      {/* Unlocking text */}
      {isUnlocking && (
        <div className="unlocking-text" data-testid="unlocking-text">
          <span>SEAL BROKEN</span>
        </div>
      )}
    </div>
  );
};

export default HiddenMasterLock;
