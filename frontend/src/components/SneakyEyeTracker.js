import React, { useState, useEffect, useRef, useMemo } from 'react';

/**
 * SneakyEyeTracker - A mysterious eye that subtly follows the cursor
 * 
 * This component wraps an eye emoji and makes it track the cursor in a 
 * sneaky, mysterious way. The movement is subtle and not obvious.
 * 
 * Usage:
 * <SneakyEyeTracker size="large" glowColor="#bf00ff">
 *   👁
 * </SneakyEyeTracker>
 * 
 * Or with image:
 * <SneakyEyeTracker size="large" glowColor="#bf00ff" useImage />
 * 
 * Props:
 * - size: 'small' | 'large' - determines the eye size and tracking intensity
 * - glowColor: string - the glow color for the eye
 * - className: string - additional classes
 * - style: object - additional inline styles
 * - enableTracking: boolean - enables/disables tracking (default: true)
 * - useImage: boolean - use eye-icon.png instead of emoji (default: true)
 * - children: the eye emoji to display (fallback if useImage is false)
 */
const SneakyEyeTracker = ({ 
  children, 
  size = 'large', 
  glowColor = '#bf00ff',
  className = '',
  style = {},
  enableTracking = true,
  useImage = true
}) => {
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const eyeRef = useRef(null);
  const animationFrameRef = useRef(null);
  const targetOffsetRef = useRef({ x: 0, y: 0 });
  const currentOffsetRef = useRef({ x: 0, y: 0 });
  
  // Configuration based on size - using useMemo for stable reference
  const config = useMemo(() => {
    const configs = {
      small: {
        maxOffset: 3,        // Maximum pixel offset
        smoothing: 0.08,     // How quickly eye catches up (lower = slower/sneakier)
        deadZone: 150,       // Pixels from eye center where tracking doesn't activate
      },
      large: {
        maxOffset: 5,
        smoothing: 0.06,
        deadZone: 200,
      }
    };
    return configs[size] || { maxOffset: 4, smoothing: 0.07, deadZone: 175 };
  }, [size]);

  // Set up animation and mouse tracking
  useEffect(() => {
    if (!enableTracking) return;
    
    let isActive = true;
    const { smoothing, deadZone, maxOffset } = config;
    
    // Smooth animation loop
    const animate = () => {
      if (!isActive) return;
      
      const dx = targetOffsetRef.current.x - currentOffsetRef.current.x;
      const dy = targetOffsetRef.current.y - currentOffsetRef.current.y;
      
      // Apply smoothing for sneaky movement
      currentOffsetRef.current.x += dx * smoothing;
      currentOffsetRef.current.y += dy * smoothing;
      
      // Only update state if there's meaningful change (performance optimization)
      const threshold = 0.01;
      if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
        setEyeOffset({
          x: currentOffsetRef.current.x,
          y: currentOffsetRef.current.y
        });
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Mouse move handler
    const handleMouseMove = (e) => {
      if (!eyeRef.current || !isActive) return;
      
      const rect = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Apply dead zone - only track if cursor is far enough
      if (distance < deadZone) {
        // Gradually return to center when cursor is close
        targetOffsetRef.current = { x: 0, y: 0 };
        return;
      }
      
      // Calculate direction and apply max offset with easing
      const adjustedDistance = distance - deadZone;
      const maxTrackDistance = 800; // Beyond this distance, max offset is applied
      const intensity = Math.min(1, adjustedDistance / maxTrackDistance);
      
      // Add mysterious "lag" effect - eye doesn't perfectly track
      const mysterySway = Math.sin(Date.now() / 2000) * 0.3; // Subtle oscillation
      
      const normalizedX = deltaX / distance;
      const normalizedY = deltaY / distance;
      
      targetOffsetRef.current = {
        x: normalizedX * maxOffset * intensity * (1 + mysterySway),
        y: normalizedY * maxOffset * intensity * (1 - mysterySway * 0.5)
      };
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      isActive = false;
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enableTracking, config]);

  // Reset on touch devices (no hover tracking)
  useEffect(() => {
    const handleTouchStart = () => {
      targetOffsetRef.current = { x: 0, y: 0 };
    };
    
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    return () => window.removeEventListener('touchstart', handleTouchStart);
  }, []);

  // Build the size classes
  const sizeClasses = size === 'large' 
    ? 'text-7xl sm:text-8xl' 
    : 'text-3xl sm:text-4xl';

  // Image dimensions based on size
  const imageDimensions = size === 'large' 
    ? { width: 80, height: 80 } 
    : { width: 35, height: 35 };

  return (
    <span
      ref={eyeRef}
      className={`inline-block transition-transform duration-500 ${sizeClasses} ${className}`}
      style={{
        filter: `drop-shadow(${glowColor} 0px 0px ${size === 'large' ? '30px' : '15px'})`,
        transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px) scale(${style.transform?.includes('scale') ? '' : '1'})`,
        animation: size === 'large' ? '3s ease-in-out 0s infinite normal none running float' : 'none',
        willChange: 'transform',
        ...style
      }}
    >
      {useImage ? (
        <img 
          src="/eye-icon.png" 
          alt="Eye" 
          width={imageDimensions.width}
          height={imageDimensions.height}
          style={{ 
            display: 'inline-block',
            verticalAlign: 'middle'
          }}
        />
      ) : (
        children
      )}
    </span>
  );
};

export default SneakyEyeTracker;
