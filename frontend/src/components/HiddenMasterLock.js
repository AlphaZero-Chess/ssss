import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import AmongUsEasterEgg from './AmongUsEasterEgg';

// Secret code: Type "ALPHA" to unlock the hidden master
const SECRET_CODE = ['a', 'l', 'p', 'h', 'a'];
const STORAGE_KEY = 'hiddenMasterUnlocked';

// Rune symbols for the chains
const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];

const HiddenMasterLock = ({ children, onUnlock }) => {
  // Initialize state based on localStorage
  const [isLocked, setIsLocked] = useState(() => {
    const unlocked = localStorage.getItem(STORAGE_KEY);
    return unlocked !== 'true';
  });
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [codeProgress, setCodeProgress] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [electricPulse, setElectricPulse] = useState(0);
  const hintTimerRef = useRef(null);
  
  // Mobile-specific states
  const [isMobile, setIsMobile] = useState(false);
  const [mobileKeyboardEnabled, setMobileKeyboardEnabled] = useState(false);
  const [mobileInputValue, setMobileInputValue] = useState('');
  const mobileInputRef = useRef(null);
  
  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768 || 
        ('ontouchstart' in window) || 
        (navigator.maxTouchPoints > 0);
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Electric pulse effect
  useEffect(() => {
    if (isLocked && !isUnlocking) {
      const pulseInterval = setInterval(() => {
        setElectricPulse(prev => (prev + 1) % 100);
      }, 50);
      return () => clearInterval(pulseInterval);
    }
  }, [isLocked, isUnlocking]);

  // Trigger unlock function
  const triggerUnlock = useCallback(() => {
    setIsUnlocking(true);
    
    // After animation completes, set unlocked state
    setTimeout(() => {
      setIsLocked(false);
      setIsUnlocking(false);
      localStorage.setItem(STORAGE_KEY, 'true');
      if (onUnlock) onUnlock();
    }, 3500);
  }, [onUnlock]);

  // Handle mobile input change (must be after triggerUnlock)
  const handleMobileInputChange = useCallback((e) => {
    const value = e.target.value.toLowerCase();
    setMobileInputValue(value);
    
    // Check if the entered text matches the secret code
    const secretWord = SECRET_CODE.join('');
    
    if (value === secretWord) {
      // Unlock!
      triggerUnlock();
      setMobileInputValue('');
    } else if (!secretWord.startsWith(value) && value.length > 0) {
      // Wrong input, reset
      setMobileInputValue('');
    }
    
    // Update code progress based on input
    const progressLength = value.length;
    const matchingChars = [];
    for (let i = 0; i < progressLength; i++) {
      if (value[i] === SECRET_CODE[i]) {
        matchingChars.push(value[i]);
      } else {
        break;
      }
    }
    setCodeProgress(matchingChars);
  }, [triggerUnlock]);
  
  // Handle mobile keyboard unlock from Among Us easter egg
  const handleMobileKeyboardUnlock = useCallback(() => {
    setMobileKeyboardEnabled(true);
    // Focus the input after a brief delay
    setTimeout(() => {
      if (mobileInputRef.current) {
        mobileInputRef.current.focus();
      }
    }, 100);
  }, []);

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

  // Generate massive chain links with runes
  const generateChainLinks = useCallback((count, type) => {
    return Array.from({ length: count }, (_, i) => (
      <div 
        key={i} 
        className={`chain-link-massive chain-link-${type}`}
        style={{ 
          animationDelay: `${i * 0.08}s`,
          '--rune-content': `"${RUNES[i % RUNES.length]}"`
        }}
        data-rune={RUNES[i % RUNES.length]}
      >
        <div className="chain-link-inner">
          <span className="rune-symbol">{RUNES[i % RUNES.length]}</span>
        </div>
        <div className="chain-electric-arc" />
      </div>
    ));
  }, []);

  // Memoize smoke particles
  const smokeParticles = useMemo(() => (
    Array.from({ length: 35 }, (_, i) => (
      <div 
        key={i} 
        className={`void-particle ${isUnlocking ? 'particle-disperse' : ''}`}
        style={{
          left: `${5 + (i * 13) % 90}%`,
          top: `${5 + (i * 17) % 90}%`,
          animationDelay: `${(i * 0.15) % 3}s`,
          animationDuration: `${2 + (i * 0.1) % 2}s`
        }}
      />
    ))
  ), [isUnlocking]);

  // Generate electric arcs for the void
  const electricArcs = useMemo(() => (
    Array.from({ length: 8 }, (_, i) => (
      <div 
        key={i}
        className="void-electric-arc"
        style={{
          left: `${10 + i * 10}%`,
          top: `${20 + (i % 3) * 25}%`,
          animationDelay: `${i * 0.3}s`
        }}
      />
    ))
  ), []);

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

      {/* VOID OVERLAY - Abyssal darkness with mystical energy leaking */}
      <div className={`void-overlay ${isUnlocking ? 'void-disperse' : ''}`}>
        <div className="void-layer void-layer-1" />
        <div className="void-layer void-layer-2" />
        <div className="void-layer void-layer-3" />
        <div className="void-layer void-layer-4" />
        <div className="void-particles">
          {smokeParticles}
        </div>
        {/* Mystical aura leaking through */}
        <div className="aura-leak" />
        {/* Electric energy within the void */}
        <div className="void-electric-container">
          {electricArcs}
        </div>
      </div>

      {/* MASSIVE RUNE-ENGRAVED CHAINS */}
      <div className={`chains-container-massive ${isUnlocking ? 'chains-disintegrate' : ''}`}>
        {/* Main horizontal binding chains */}
        <div className="chain-massive chain-h-massive chain-h-1">
          {generateChainLinks(16, 'horizontal')}
        </div>
        <div className="chain-massive chain-h-massive chain-h-2">
          {generateChainLinks(16, 'horizontal')}
        </div>
        <div className="chain-massive chain-h-massive chain-h-3">
          {generateChainLinks(16, 'horizontal')}
        </div>
        
        {/* Main vertical restraint chains */}
        <div className="chain-massive chain-v-massive chain-v-1">
          {generateChainLinks(20, 'vertical')}
        </div>
        <div className="chain-massive chain-v-massive chain-v-2">
          {generateChainLinks(20, 'vertical')}
        </div>
        <div className="chain-massive chain-v-massive chain-v-3">
          {generateChainLinks(20, 'vertical')}
        </div>

        {/* Cross binding chains */}
        <div className="chain-massive chain-diagonal chain-d-1">
          {generateChainLinks(18, 'diagonal')}
        </div>
        <div className="chain-massive chain-diagonal chain-d-2">
          {generateChainLinks(18, 'diagonal')}
        </div>
        <div className="chain-massive chain-diagonal chain-d-3">
          {generateChainLinks(18, 'diagonal')}
        </div>
        <div className="chain-massive chain-diagonal chain-d-4">
          {generateChainLinks(18, 'diagonal')}
        </div>

        {/* Corner anchor chains */}
        <div className="chain-corner chain-corner-tl">
          {generateChainLinks(8, 'corner')}
        </div>
        <div className="chain-corner chain-corner-tr">
          {generateChainLinks(8, 'corner')}
        </div>
        <div className="chain-corner chain-corner-bl">
          {generateChainLinks(8, 'corner')}
        </div>
        <div className="chain-corner chain-corner-br">
          {generateChainLinks(8, 'corner')}
        </div>

        {/* Electric field overlay */}
        <div className="electric-field" />
        
        {/* Rune circle seal */}
        <div className="rune-seal-circle">
          <div className="rune-ring rune-ring-outer">
            {RUNES.slice(0, 12).map((rune, i) => (
              <span key={i} className="seal-rune" style={{ transform: `rotate(${i * 30}deg) translateY(-85px)` }}>
                {rune}
              </span>
            ))}
          </div>
          <div className="rune-ring rune-ring-inner">
            {RUNES.slice(12, 18).map((rune, i) => (
              <span key={i} className="seal-rune-inner" style={{ transform: `rotate(${i * 60}deg) translateY(-50px)` }}>
                {rune}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ANCIENT PADLOCK */}
      <div className={`padlock-container-massive ${isUnlocking ? 'padlock-fall-massive' : ''}`}>
        <div className="padlock-massive">
          {/* Shackle with runes */}
          <div className="padlock-shackle-massive">
            <div className="shackle-inner-massive" />
            <div className="shackle-rune shackle-rune-left">ᛟ</div>
            <div className="shackle-rune shackle-rune-right">ᛞ</div>
          </div>
          {/* Main body with engravings */}
          <div className="padlock-body-massive">
            <div className="padlock-face">
              <div className="padlock-eye">
                <div className="padlock-eye-glow" />
              </div>
              <div className="padlock-rune-engrave">
                <span>ᚠᚢᚦᚨᚱᚲ</span>
              </div>
              <div className="padlock-keyhole-massive">
                <div className="keyhole-void" />
              </div>
            </div>
            <div className="padlock-side-runes">
              <span className="side-rune side-rune-1">ᛏ</span>
              <span className="side-rune side-rune-2">ᛒ</span>
              <span className="side-rune side-rune-3">ᛖ</span>
            </div>
          </div>
          {/* Power glow */}
          <div className="padlock-power-glow" />
          {/* Electric arcs around padlock */}
          <div className="padlock-electric">
            <div className="padlock-arc padlock-arc-1" />
            <div className="padlock-arc padlock-arc-2" />
            <div className="padlock-arc padlock-arc-3" />
            <div className="padlock-arc padlock-arc-4" />
          </div>
        </div>
      </div>

      {/* Code Progress Indicator */}
      {codeProgress.length > 0 && !isUnlocking && (
        <div className="code-progress-massive" data-testid="code-progress">
          {SECRET_CODE.map((_, i) => (
            <div 
              key={i} 
              className={`progress-rune ${i < codeProgress.length ? 'active' : ''}`}
            >
              <span>{RUNES[i]}</span>
            </div>
          ))}
        </div>
      )}

      {/* Hint */}
      {showHint && !isUnlocking && (
        <div className="unlock-hint-massive" data-testid="unlock-hint">
          <span className="hint-text-massive">⚡ SPEAK THE ANCIENT NAME ⚡</span>
        </div>
      )}

      {/* Unlocking text */}
      {isUnlocking && (
        <div className="unlocking-text-massive" data-testid="unlocking-text">
          <div className="seal-break-effect">
            <span className="break-rune">ᛟ</span>
            <span className="break-rune">ᛞ</span>
            <span className="break-rune">ᛜ</span>
          </div>
          <span className="seal-broken-text">SEAL BROKEN</span>
          <div className="seal-break-effect">
            <span className="break-rune">ᛚ</span>
            <span className="break-rune">ᛗ</span>
            <span className="break-rune">ᛖ</span>
          </div>
        </div>
      )}
      
      {/* Mobile keyboard input - only shows when enabled via Among Us easter egg */}
      {isMobile && mobileKeyboardEnabled && !isUnlocking && (
        <div className="mobile-keyboard-input-wrapper" data-testid="mobile-keyboard-input">
          <div className="mobile-input-container">
            <input
              ref={mobileInputRef}
              type="text"
              value={mobileInputValue}
              onChange={handleMobileInputChange}
              placeholder="TYPE THE ANCIENT NAME..."
              className="mobile-secret-input"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              maxLength={5}
            />
            <div className="mobile-input-hint">
              Type the secret word to break the seal
            </div>
          </div>
        </div>
      )}
      
      {/* Among Us Easter Egg - Only shows on mobile when keyboard not yet unlocked */}
      {isMobile && !mobileKeyboardEnabled && !isUnlocking && isLocked && (
        <AmongUsEasterEgg onUnlockKeyboard={handleMobileKeyboardUnlock} />
      )}
      
      {/* Mobile keyboard input styles */}
      <style>{`
        .mobile-keyboard-input-wrapper {
          position: absolute;
          bottom: -100px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 30;
          animation: slide-up 0.5s ease-out;
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        .mobile-input-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        
        .mobile-secret-input {
          width: 200px;
          padding: 12px 16px;
          font-family: 'Orbitron', sans-serif;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 4px;
          text-align: center;
          background: linear-gradient(180deg, rgba(40,20,60,0.95) 0%, rgba(20,10,35,0.98) 100%);
          border: 2px solid rgba(191, 0, 255, 0.5);
          border-radius: 8px;
          color: #e0a0ff;
          outline: none;
          box-shadow: 
            0 0 15px rgba(191, 0, 255, 0.3),
            inset 0 0 10px rgba(191, 0, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .mobile-secret-input:focus {
          border-color: rgba(191, 0, 255, 0.8);
          box-shadow: 
            0 0 25px rgba(191, 0, 255, 0.5),
            0 0 50px rgba(191, 0, 255, 0.2),
            inset 0 0 15px rgba(191, 0, 255, 0.2);
        }
        
        .mobile-secret-input::placeholder {
          color: rgba(200, 150, 255, 0.4);
          font-size: 10px;
          letter-spacing: 2px;
        }
        
        .mobile-input-hint {
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          color: rgba(200, 150, 255, 0.6);
          text-align: center;
          animation: pulse-hint 2s infinite;
        }
        
        @keyframes pulse-hint {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default HiddenMasterLock;
