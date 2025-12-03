import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * AmongUsEasterEgg - A draggable Among Us character that unlocks mobile keyboard
 * 
 * Features:
 * - Red crewmate peeks from edge of screen
 * - Can be dragged around
 * - Shake the character to drop a laptop
 * - Tap the laptop to open it and unlock mobile keyboard
 * 
 * This component is designed to be mobile-aware and non-breaking.
 * It only shows on mobile/touch devices.
 */

const SHAKE_THRESHOLD = 15; // Minimum shake intensity to trigger laptop drop
const SHAKE_COUNT_THRESHOLD = 5; // Number of shakes needed
const SHAKE_TIMEOUT = 500; // Time window for shake detection (ms)

const AmongUsEasterEgg = ({ onUnlockKeyboard }) => {
  // State for the crewmate
  const [crewmatePosition, setCrewmatePosition] = useState({ x: -40, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isPeeking, setIsPeeking] = useState(true);
  
  // State for shake detection
  const [shakeCount, setShakeCount] = useState(0);
  const [lastShakeTime, setLastShakeTime] = useState(0);
  
  // State for the laptop
  const [laptopDropped, setLaptopDropped] = useState(false);
  const [laptopPosition, setLaptopPosition] = useState({ x: 0, y: 0 });
  const [laptopOpen, setLaptopOpen] = useState(false);
  const [keyboardUnlocked, setKeyboardUnlocked] = useState(false);
  
  // State for mobile detection
  const [isMobile, setIsMobile] = useState(false);
  
  // Refs for drag tracking
  const dragStartRef = useRef({ x: 0, y: 0 });
  const lastPositionsRef = useRef([]);
  const crewmateRef = useRef(null);
  
  // Detect mobile device and set initial position
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768 || 
        ('ontouchstart' in window) || 
        (navigator.maxTouchPoints > 0);
      setIsMobile(mobile);
      
      // Set initial peek position based on screen size when mobile is detected
      if (mobile) {
        const screenHeight = window.innerHeight;
        setCrewmatePosition({ x: -40, y: screenHeight * 0.3 });
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Peek animation - character bounces out periodically
  useEffect(() => {
    if (!isPeeking || isDragging || laptopDropped) return;
    
    const peekInterval = setInterval(() => {
      // Quick peek out animation
      setCrewmatePosition(prev => ({ ...prev, x: -20 }));
      setTimeout(() => {
        if (isPeeking && !isDragging) {
          setCrewmatePosition(prev => ({ ...prev, x: -40 }));
        }
      }, 1500);
    }, 5000);

    return () => clearInterval(peekInterval);
  }, [isPeeking, isDragging, laptopDropped]);

  // Shake detection from position history
  const detectShake = useCallback((positions) => {
    if (positions.length < 3) return false;
    
    let totalMovement = 0;
    for (let i = 1; i < positions.length; i++) {
      const dx = positions[i].x - positions[i-1].x;
      const dy = positions[i].y - positions[i-1].y;
      totalMovement += Math.sqrt(dx * dx + dy * dy);
    }
    
    // Calculate average movement per sample
    const avgMovement = totalMovement / (positions.length - 1);
    
    // Check for direction changes (shake pattern)
    let directionChanges = 0;
    for (let i = 2; i < positions.length; i++) {
      const dx1 = positions[i-1].x - positions[i-2].x;
      const dx2 = positions[i].x - positions[i-1].x;
      const dy1 = positions[i-1].y - positions[i-2].y;
      const dy2 = positions[i].y - positions[i-1].y;
      
      if ((dx1 * dx2 < 0) || (dy1 * dy2 < 0)) {
        directionChanges++;
      }
    }
    
    return avgMovement > SHAKE_THRESHOLD && directionChanges >= 2;
  }, []);

  // Drop laptop function - MUST be declared before handleDragMove which uses it
  const dropLaptop = useCallback((x, y) => {
    setLaptopDropped(true);
    setLaptopPosition({ x: x + 30, y: y + 60 });
    
    // Hide crewmate after dropping laptop
    setTimeout(() => {
      setIsVisible(false);
    }, 500);
  }, []);

  // Handle touch/mouse start
  const handleDragStart = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    setIsPeeking(false);
    
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    dragStartRef.current = {
      x: clientX - crewmatePosition.x,
      y: clientY - crewmatePosition.y
    };
    
    lastPositionsRef.current = [{ x: clientX, y: clientY, time: Date.now() }];
  }, [crewmatePosition]);

  // Handle touch/mouse move
  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;
    
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    // Update position
    const newX = clientX - dragStartRef.current.x;
    const newY = clientY - dragStartRef.current.y;
    
    // Constrain to screen bounds
    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - 80;
    
    setCrewmatePosition({
      x: Math.max(-40, Math.min(maxX, newX)),
      y: Math.max(0, Math.min(maxY, newY))
    });
    
    // Track positions for shake detection
    const now = Date.now();
    lastPositionsRef.current.push({ x: clientX, y: clientY, time: now });
    
    // Keep only recent positions (last 300ms)
    lastPositionsRef.current = lastPositionsRef.current.filter(
      pos => now - pos.time < 300
    );
    
    // Check for shake
    if (!laptopDropped && detectShake(lastPositionsRef.current)) {
      const now = Date.now();
      if (now - lastShakeTime > SHAKE_TIMEOUT) {
        setShakeCount(prev => {
          const newCount = prev + 1;
          if (newCount >= SHAKE_COUNT_THRESHOLD) {
            // Drop the laptop!
            dropLaptop(newX, newY);
            return 0;
          }
          return newCount;
        });
        setLastShakeTime(now);
        lastPositionsRef.current = [];
      }
    }
  }, [isDragging, laptopDropped, lastShakeTime, detectShake, dropLaptop]);

  // Handle touch/mouse end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    lastPositionsRef.current = [];
  }, []);

  // Handle laptop tap
  const handleLaptopTap = useCallback(() => {
    if (!laptopOpen) {
      setLaptopOpen(true);
      
      // After laptop opens, unlock keyboard
      setTimeout(() => {
        setKeyboardUnlocked(true);
        if (onUnlockKeyboard) {
          onUnlockKeyboard();
        }
      }, 1000);
    }
  }, [laptopOpen, onUnlockKeyboard]);

  // Add global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Don't render on desktop if not needed
  if (!isMobile && !laptopDropped && !keyboardUnlocked) {
    return null;
  }

  // If keyboard is already unlocked, just return null
  if (keyboardUnlocked && !laptopOpen) {
    return null;
  }

  return (
    <>
      {/* Among Us Crewmate */}
      {isVisible && !keyboardUnlocked && (
        <div
          ref={crewmateRef}
          className={`among-us-crewmate ${isDragging ? 'dragging' : ''} ${isPeeking ? 'peeking' : ''}`}
          style={{
            position: 'fixed',
            left: crewmatePosition.x,
            top: crewmatePosition.y,
            zIndex: 9999,
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none',
            userSelect: 'none',
          }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          data-testid="among-us-crewmate"
        >
          {/* Crewmate SVG */}
          <svg 
            width="60" 
            height="80" 
            viewBox="0 0 60 80"
            className="crewmate-svg"
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
              transition: isDragging ? 'none' : 'transform 0.3s ease'
            }}
          >
            {/* Body */}
            <ellipse cx="30" cy="50" rx="22" ry="28" fill="#c51111" />
            
            {/* Backpack */}
            <rect x="4" y="35" width="10" height="25" rx="4" fill="#a00d0d" />
            
            {/* Visor */}
            <ellipse cx="38" cy="38" rx="14" ry="12" fill="#1d4b8c" />
            <ellipse cx="40" cy="36" rx="10" ry="8" fill="#84d2f6" />
            <ellipse cx="44" cy="34" rx="4" ry="3" fill="#c4eeff" opacity="0.7" />
            
            {/* Legs */}
            <ellipse cx="22" cy="74" rx="8" ry="6" fill="#c51111" />
            <ellipse cx="38" cy="74" rx="8" ry="6" fill="#c51111" />
            
            {/* Shadow */}
            <ellipse cx="30" cy="78" rx="18" ry="4" fill="rgba(0,0,0,0.2)" />
          </svg>
          
          {/* Shake indicator */}
          {shakeCount > 0 && shakeCount < SHAKE_COUNT_THRESHOLD && (
            <div className="shake-indicator" data-testid="shake-indicator">
              <span className="shake-stars">
                {'⭐'.repeat(shakeCount)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Dropped Laptop */}
      {laptopDropped && !keyboardUnlocked && (
        <div
          className={`dropped-laptop ${laptopOpen ? 'open' : 'closed'}`}
          style={{
            position: 'fixed',
            left: laptopPosition.x,
            top: laptopPosition.y,
            zIndex: 9998,
          }}
          onClick={handleLaptopTap}
          data-testid="dropped-laptop"
        >
          <div className="laptop-container">
            {/* Laptop Screen */}
            <div className={`laptop-screen ${laptopOpen ? 'open' : ''}`}>
              {laptopOpen && (
                <div className="laptop-content">
                  <div className="mini-website">
                    <div className="mini-header">
                      <span className="mini-title">CHESS MASTERS</span>
                    </div>
                    <div className="mini-body">
                      <div className="mini-card" />
                      <div className="mini-card" />
                      <div className="mini-card" />
                    </div>
                  </div>
                  <div className="unlock-message">
                    KEYBOARD UNLOCKED!
                  </div>
                </div>
              )}
            </div>
            
            {/* Laptop Base */}
            <div className="laptop-base">
              <div className="laptop-keyboard">
                {!laptopOpen && (
                  <span className="tap-hint">TAP TO OPEN</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .among-us-crewmate {
          animation: crewmate-idle 2s ease-in-out infinite;
        }
        
        .among-us-crewmate.peeking {
          animation: crewmate-peek 0.5s ease-out;
        }
        
        .among-us-crewmate.dragging {
          animation: crewmate-wiggle 0.1s linear infinite;
        }
        
        .among-us-crewmate.dragging .crewmate-svg {
          transform: scale(1.1);
        }
        
        @keyframes crewmate-idle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes crewmate-peek {
          0% { transform: translateX(-20px); }
          50% { transform: translateX(10px); }
          100% { transform: translateX(0); }
        }
        
        @keyframes crewmate-wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        
        .shake-indicator {
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 16px;
          pointer-events: none;
          animation: float-up 0.5s ease-out;
        }
        
        @keyframes float-up {
          from { opacity: 1; transform: translateX(-50%) translateY(0); }
          to { opacity: 0.5; transform: translateX(-50%) translateY(-10px); }
        }
        
        .dropped-laptop {
          cursor: pointer;
          animation: laptop-drop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        @keyframes laptop-drop {
          0% { transform: translateY(-50px) rotate(-180deg); opacity: 0; }
          100% { transform: translateY(0) rotate(0deg); opacity: 1; }
        }
        
        .laptop-container {
          perspective: 500px;
        }
        
        .laptop-screen {
          width: 100px;
          height: 65px;
          background: linear-gradient(180deg, #2a2a3a 0%, #1a1a2a 100%);
          border: 2px solid #444;
          border-bottom: none;
          border-radius: 6px 6px 0 0;
          transform-origin: bottom center;
          transform: rotateX(90deg);
          transition: transform 0.5s ease-out;
          overflow: hidden;
        }
        
        .laptop-screen.open {
          transform: rotateX(20deg);
        }
        
        .laptop-content {
          width: 100%;
          height: 100%;
          padding: 4px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .mini-website {
          flex: 1;
          background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
          border-radius: 2px;
          padding: 3px;
          overflow: hidden;
        }
        
        .mini-header {
          background: linear-gradient(90deg, #ff0080 0%, #7928ca 100%);
          padding: 2px 4px;
          border-radius: 2px;
          margin-bottom: 3px;
        }
        
        .mini-title {
          font-size: 5px;
          color: white;
          font-family: 'Orbitron', sans-serif;
          font-weight: bold;
        }
        
        .mini-body {
          display: flex;
          gap: 2px;
          justify-content: center;
        }
        
        .mini-card {
          width: 18px;
          height: 24px;
          background: linear-gradient(180deg, rgba(25,25,45,0.9) 0%, rgba(12,12,25,0.98) 100%);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 2px;
        }
        
        .unlock-message {
          font-size: 6px;
          color: #00ff88;
          text-align: center;
          font-family: 'Orbitron', sans-serif;
          font-weight: bold;
          animation: blink 0.5s infinite;
          text-shadow: 0 0 5px #00ff88;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .laptop-base {
          width: 110px;
          height: 8px;
          background: linear-gradient(180deg, #555 0%, #333 100%);
          border-radius: 0 0 4px 4px;
          margin-left: -5px;
          position: relative;
        }
        
        .laptop-keyboard {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .tap-hint {
          font-size: 6px;
          color: rgba(255,255,255,0.6);
          font-family: 'Orbitron', sans-serif;
          animation: pulse-hint 1.5s infinite;
        }
        
        @keyframes pulse-hint {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default AmongUsEasterEgg;
