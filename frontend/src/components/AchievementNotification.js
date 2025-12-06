import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, X } from 'lucide-react';

/**
 * ACHIEVEMENT NOTIFICATION - Toast Component
 * 
 * Displays achievement unlock notifications with:
 * - Animated entrance/exit
 * - Rarity-based styling
 * - Auto-dismiss after delay
 * - Stack support for multiple notifications
 * 
 * BACKWARD COMPATIBLE - Can be removed without affecting other components
 */

const NOTIFICATION_DURATION = 5000; // 5 seconds
const ANIMATION_DURATION = 500; // 0.5 seconds

const SingleNotification = ({ notification, onDismiss, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  const { achievement } = notification;
  const { name, description, icon, rarity, points, isSecret } = achievement;
  
  useEffect(() => {
    // Stagger entrance animation
    const entranceTimer = setTimeout(() => setIsVisible(true), index * 150);
    
    // Auto dismiss
    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, NOTIFICATION_DURATION + (index * 150));
    
    return () => {
      clearTimeout(entranceTimer);
      clearTimeout(dismissTimer);
    };
  }, [index]);
  
  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(notification.id);
    }, ANIMATION_DURATION);
  }, [notification.id, onDismiss]);
  
  return (
    <div
      className={`achievement-notification ${isVisible ? 'visible' : ''} ${isExiting ? 'exiting' : ''}`}
      style={{
        '--rarity-color': rarity.color,
        '--rarity-glow': rarity.glow,
        transform: `translateY(${index * 10}px)`,
        zIndex: 3000 - index
      }}
      data-testid={`achievement-notification-${achievement.id}`}
    >
      {/* Glow effect */}
      <div className="notification-glow" />
      
      {/* Content */}
      <div className="notification-content">
        {/* Icon */}
        <div className="notification-icon">
          {icon}
        </div>
        
        {/* Text */}
        <div className="notification-text">
          <div className="notification-header">
            <Trophy size={12} style={{ color: '#ffd700' }} />
            <span className="achievement-unlocked-text">Achievement Unlocked!</span>
            {isSecret && <span className="secret-indicator">🔓</span>}
          </div>
          <h4 className="notification-name" style={{ color: rarity.color }}>
            {name}
          </h4>
          <p className="notification-description">
            {description}
          </p>
          <div className="notification-footer">
            <span className="notification-rarity" style={{ color: rarity.color }}>
              {rarity.name}
            </span>
            <span className="notification-points">+{points} pts</span>
          </div>
        </div>
        
        {/* Close button */}
        <button className="notification-close" onClick={handleDismiss}>
          <X size={14} />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="notification-timer">
        <div 
          className="timer-fill"
          style={{
            animationDuration: `${NOTIFICATION_DURATION}ms`,
            animationDelay: `${index * 150}ms`
          }}
        />
      </div>
    </div>
  );
};

const AchievementNotification = ({ notifications, onDismiss }) => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Only show latest 3 notifications
  const visibleNotifications = notifications.slice(-3);
  
  if (visibleNotifications.length === 0) return null;
  
  return (
    <div 
      className="achievement-notifications-container"
      style={{
        position: 'fixed',
        top: isMobile ? '60px' : '80px',
        right: isMobile ? '10px' : '20px',
        zIndex: 3000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none'
      }}
    >
      {visibleNotifications.map((notification, index) => (
        <SingleNotification
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
          index={index}
        />
      ))}
      
      <style>{`
        .achievement-notification {
          position: relative;
          width: ${isMobile ? '280px' : '320px'};
          background: linear-gradient(135deg, rgba(20, 20, 35, 0.98) 0%, rgba(10, 10, 20, 0.99) 100%);
          border: 2px solid var(--rarity-color, #ff0080);
          border-radius: 12px;
          overflow: hidden;
          pointer-events: auto;
          opacity: 0;
          transform: translateX(100%) scale(0.9);
          transition: all ${ANIMATION_DURATION}ms cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 0 30px var(--rarity-glow, rgba(255, 0, 128, 0.3)), 0 10px 40px rgba(0, 0, 0, 0.4);
        }
        
        .achievement-notification.visible {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
        
        .achievement-notification.exiting {
          opacity: 0;
          transform: translateX(100%) scale(0.9);
        }
        
        .notification-glow {
          position: absolute;
          inset: -2px;
          background: linear-gradient(45deg, var(--rarity-color, #ff0080), transparent, var(--rarity-color, #ff0080));
          opacity: 0;
          animation: notification-glow 2s ease-in-out infinite;
          border-radius: 14px;
          z-index: -1;
        }
        
        @keyframes notification-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        .notification-content {
          display: flex;
          gap: 12px;
          padding: 14px;
          position: relative;
        }
        
        .notification-icon {
          font-size: 32px;
          flex-shrink: 0;
          animation: icon-bounce 0.5s ease-out 0.3s;
          filter: drop-shadow(0 0 8px var(--rarity-glow, rgba(255, 0, 128, 0.5)));
        }
        
        @keyframes icon-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        .notification-text {
          flex: 1;
          min-width: 0;
        }
        
        .notification-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }
        
        .achievement-unlocked-text {
          font-family: 'Rajdhani', sans-serif;
          font-size: 10px;
          color: #ffd700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .secret-indicator {
          font-size: 10px;
        }
        
        .notification-name {
          font-family: 'Orbitron', sans-serif;
          font-size: 13px;
          margin: 0 0 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-shadow: 0 0 10px var(--rarity-glow, rgba(255, 0, 128, 0.5));
        }
        
        .notification-description {
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          color: #999;
          margin: 0 0 6px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .notification-footer {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .notification-rarity {
          font-family: 'Orbitron', sans-serif;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .notification-points {
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          color: #ffd700;
          font-weight: bold;
        }
        
        .notification-close {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 4px;
          padding: 4px;
          cursor: pointer;
          color: #666;
          transition: all 0.2s;
          opacity: 0;
        }
        
        .achievement-notification:hover .notification-close {
          opacity: 1;
        }
        
        .notification-close:hover {
          background: rgba(255, 0, 128, 0.3);
          color: #fff;
        }
        
        .notification-timer {
          height: 3px;
          background: rgba(255, 255, 255, 0.1);
        }
        
        .timer-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--rarity-color, #ff0080), transparent);
          width: 100%;
          animation: timer-countdown linear forwards;
          transform-origin: left;
        }
        
        @keyframes timer-countdown {
          0% { transform: scaleX(1); }
          100% { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
};

export default AchievementNotification;
