import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Lock, Star, X, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { ACHIEVEMENT_CATEGORIES, ACHIEVEMENT_RARITY } from '../hooks/useAchievements';

/**
 * ACHIEVEMENTS PANEL - UI Component
 * 
 * Displays achievements in a sophisticated, collapsible panel
 * Features:
 * - Category filtering
 * - Progress tracking
 * - Secret achievement hiding
 * - Animated unlock effects
 * - Responsive design
 * 
 * BACKWARD COMPATIBLE - Can be removed without affecting other components
 */

const categoryInfo = {
  [ACHIEVEMENT_CATEGORIES.HIDDEN_SECRETS]: {
    name: 'Hidden Secrets',
    icon: '🔐',
    description: 'Discover hidden content and easter eggs'
  },
  [ACHIEVEMENT_CATEGORIES.VICTORIES]: {
    name: 'Victories',
    icon: '⚔️',
    description: 'Win games against AI opponents'
  },
  [ACHIEVEMENT_CATEGORIES.DEFEATS]: {
    name: 'Defeats',
    icon: '📚',
    description: 'Learn from your losses'
  },
  [ACHIEVEMENT_CATEGORIES.DRAWS]: {
    name: 'Draws & Stalemates',
    icon: '⚖️',
    description: 'Achieve balanced outcomes'
  },
  [ACHIEVEMENT_CATEGORIES.MASTERY]: {
    name: 'Mastery',
    icon: '🎯',
    description: 'Demonstrate chess mastery'
  },
  [ACHIEVEMENT_CATEGORIES.EXPLORATION]: {
    name: 'Exploration',
    icon: '🗺️',
    description: 'Explore all game features'
  },
  [ACHIEVEMENT_CATEGORIES.LEGENDARY]: {
    name: 'Legendary',
    icon: '🌟',
    description: 'Achieve legendary status'
  }
};

const AchievementCard = ({ achievement, showSecrets }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { unlocked, isSecret, name, description, secretDescription, icon, rarity, points, progress, unlockedAt } = achievement;
  
  // For locked secret achievements, show hidden info
  const displayName = (!unlocked && isSecret && !showSecrets) ? '???' : name;
  const displayDescription = (!unlocked && isSecret && !showSecrets) ? secretDescription || 'This achievement is hidden' : description;
  const displayIcon = (!unlocked && isSecret && !showSecrets) ? '❓' : icon;
  
  const formattedDate = unlockedAt ? new Date(unlockedAt).toLocaleDateString() : null;
  
  return (
    <div
      className={`achievement-card ${unlocked ? 'unlocked' : 'locked'} ${isSecret ? 'secret' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: unlocked 
          ? `linear-gradient(135deg, ${rarity.color}15 0%, rgba(20,20,35,0.95) 100%)`
          : 'linear-gradient(135deg, rgba(20,20,35,0.9) 0%, rgba(10,10,20,0.95) 100%)',
        border: `2px solid ${unlocked ? rarity.color + '60' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: unlocked && isHovered 
          ? `0 0 25px ${rarity.glow}, 0 8px 32px rgba(0,0,0,0.4)`
          : '0 4px 16px rgba(0,0,0,0.3)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.3s ease'
      }}
      data-testid={`achievement-card-${achievement.id}`}
    >
      {/* Icon */}
      <div 
        className="achievement-icon"
        style={{
          filter: unlocked 
            ? `drop-shadow(0 0 8px ${rarity.glow})`
            : 'grayscale(100%) brightness(0.5)',
          opacity: unlocked ? 1 : 0.5
        }}
      >
        {displayIcon}
      </div>
      
      {/* Content */}
      <div className="achievement-content">
        <div className="achievement-header">
          <h4 
            className="achievement-name"
            style={{ color: unlocked ? rarity.color : '#666' }}
          >
            {displayName}
          </h4>
          {isSecret && (
            <span className="secret-badge" title="Secret Achievement">
              {unlocked ? '🔓' : '🔒'}
            </span>
          )}
        </div>
        
        <p className="achievement-description">
          {displayDescription}
        </p>
        
        {/* Progress bar for non-unlocked achievements with progress */}
        {!unlocked && progress && progress.target > 1 && (
          <div className="achievement-progress">
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill"
                style={{ 
                  width: `${progress.percentage}%`,
                  background: `linear-gradient(90deg, ${rarity.color}80, ${rarity.color})`
                }}
              />
            </div>
            <span className="progress-text">
              {progress.current}/{progress.target}
            </span>
          </div>
        )}
        
        {/* Footer */}
        <div className="achievement-footer">
          <span 
            className="achievement-rarity"
            style={{ color: rarity.color }}
          >
            {rarity.name}
          </span>
          <span className="achievement-points">
            {unlocked ? `+${points}` : points} pts
          </span>
          {formattedDate && (
            <span className="achievement-date">
              {formattedDate}
            </span>
          )}
        </div>
      </div>
      
      {/* Lock overlay */}
      {!unlocked && (
        <div className="lock-overlay">
          <Lock size={16} />
        </div>
      )}
    </div>
  );
};

const AchievementsPanel = ({ 
  achievements, 
  statistics, 
  isOpen, 
  onClose,
  onToggle 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSecrets, setShowSecrets] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Group achievements by category
  const groupedAchievements = useMemo(() => {
    const groups = {};
    achievements.forEach(achievement => {
      const category = achievement.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(achievement);
    });
    return groups;
  }, [achievements]);
  
  // Calculate stats
  const totalAchievements = achievements.length;
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const completionPercentage = Math.round((unlockedCount / totalAchievements) * 100);
  
  // Filter achievements based on selected category
  const filteredAchievements = useMemo(() => {
    if (selectedCategory === 'all') return achievements;
    return achievements.filter(a => a.category === selectedCategory);
  }, [achievements, selectedCategory]);
  
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  if (!isOpen) {
    return (
      <button
        className="achievements-toggle-btn"
        onClick={onToggle}
        data-testid="achievements-toggle-btn"
        style={{
          position: 'fixed',
          top: isMobile ? '10px' : '20px',
          right: isMobile ? '10px' : '20px',
          zIndex: 1000,
          background: 'linear-gradient(135deg, #ff008050 0%, #7928ca50 100%)',
          border: '2px solid #ff0080',
          borderRadius: '12px',
          padding: isMobile ? '8px 12px' : '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontFamily: 'Orbitron, sans-serif',
          fontSize: isMobile ? '10px' : '12px',
          color: '#fff',
          boxShadow: '0 0 20px rgba(255, 0, 128, 0.3)',
          transition: 'all 0.3s ease'
        }}
      >
        <Trophy size={isMobile ? 14 : 16} />
        <span>{unlockedCount}/{totalAchievements}</span>
      </button>
    );
  }
  
  return (
    <div 
      className="achievements-panel-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      data-testid="achievements-panel"
    >
      <div 
        className="achievements-panel"
        style={{
          width: isMobile ? '95%' : '700px',
          maxHeight: isMobile ? '85vh' : '80vh',
          margin: isMobile ? '10px auto' : '50px auto'
        }}
      >
        {/* Header */}
        <div className="panel-header">
          <div className="header-left">
            <Trophy size={24} style={{ color: '#ffd700' }} />
            <h2>Achievements</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-label">Unlocked</span>
            <span className="stat-value">{unlockedCount}/{totalAchievements}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Points</span>
            <span className="stat-value" style={{ color: '#ffd700' }}>{totalPoints}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completion</span>
            <span className="stat-value">{completionPercentage}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Games</span>
            <span className="stat-value">{statistics.totalGames}</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="completion-progress">
          <div 
            className="completion-fill"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        
        {/* Controls */}
        <div className="panel-controls">
          <div className="category-filter">
            <button
              className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
            {Object.entries(categoryInfo).map(([key, info]) => (
              <button
                key={key}
                className={`filter-btn ${selectedCategory === key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(key)}
                title={info.description}
              >
                {info.icon}
              </button>
            ))}
          </div>
          
          <button
            className={`secrets-toggle ${showSecrets ? 'active' : ''}`}
            onClick={() => setShowSecrets(!showSecrets)}
            title={showSecrets ? 'Hide secret details' : 'Show secret details'}
          >
            {showSecrets ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
        
        {/* Achievements List */}
        <div className="achievements-list">
          {selectedCategory === 'all' ? (
            // Grouped view
            Object.entries(groupedAchievements).map(([category, categoryAchievements]) => {
              const info = categoryInfo[category] || { name: category, icon: '📦' };
              const unlockedInCategory = categoryAchievements.filter(a => a.unlocked).length;
              const isExpanded = expandedCategories[category] !== false;
              
              return (
                <div key={category} className="category-group">
                  <button 
                    className="category-header"
                    onClick={() => toggleCategory(category)}
                  >
                    <div className="category-info">
                      <span className="category-icon">{info.icon}</span>
                      <span className="category-name">{info.name}</span>
                      <span className="category-count">
                        {unlockedInCategory}/{categoryAchievements.length}
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  
                  {isExpanded && (
                    <div className="category-achievements">
                      {categoryAchievements.map(achievement => (
                        <AchievementCard
                          key={achievement.id}
                          achievement={achievement}
                          showSecrets={showSecrets}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            // Flat filtered view
            <div className="filtered-achievements">
              {filteredAchievements.map(achievement => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  showSecrets={showSecrets}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Game Statistics Footer */}
        <div className="game-stats-footer">
          <h4>Game Statistics</h4>
          <div className="game-stats-grid">
            <div className="game-stat">
              <span className="stat-icon">🏆</span>
              <span className="stat-num" style={{ color: '#00ff88' }}>{statistics.totalWins}</span>
              <span className="stat-name">Wins</span>
            </div>
            <div className="game-stat">
              <span className="stat-icon">💀</span>
              <span className="stat-num" style={{ color: '#ff4444' }}>{statistics.totalLosses}</span>
              <span className="stat-name">Losses</span>
            </div>
            <div className="game-stat">
              <span className="stat-icon">🤝</span>
              <span className="stat-num" style={{ color: '#888' }}>{statistics.totalDraws}</span>
              <span className="stat-name">Draws</span>
            </div>
            <div className="game-stat">
              <span className="stat-icon">🔥</span>
              <span className="stat-num" style={{ color: '#ff8800' }}>{statistics.bestWinStreak}</span>
              <span className="stat-name">Best Streak</span>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .achievements-panel-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          overflow-y: auto;
          padding: 20px;
        }
        
        .achievements-panel {
          background: linear-gradient(180deg, rgba(20, 20, 35, 0.98) 0%, rgba(10, 10, 20, 0.99) 100%);
          border: 2px solid rgba(255, 0, 128, 0.3);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 0 60px rgba(255, 0, 128, 0.2), 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: linear-gradient(90deg, rgba(255, 0, 128, 0.1) 0%, rgba(121, 40, 202, 0.1) 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .header-left h2 {
          font-family: 'Orbitron', sans-serif;
          font-size: 20px;
          color: #fff;
          margin: 0;
          background: linear-gradient(90deg, #ff0080, #7928ca);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .close-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          color: #fff;
          transition: all 0.2s;
        }
        
        .close-btn:hover {
          background: rgba(255, 0, 128, 0.3);
        }
        
        .stats-bar {
          display: flex;
          justify-content: space-around;
          padding: 16px;
          background: rgba(0, 0, 0, 0.3);
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        
        .stat-label {
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .stat-value {
          font-family: 'Orbitron', sans-serif;
          font-size: 16px;
          color: #fff;
        }
        
        .completion-progress {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          margin: 0 16px 16px;
          border-radius: 2px;
          overflow: hidden;
        }
        
        .completion-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff0080, #7928ca);
          transition: width 0.5s ease;
        }
        
        .panel-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px 16px;
          gap: 12px;
        }
        
        .category-filter {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        
        .filter-btn {
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: #888;
          font-family: 'Rajdhani', sans-serif;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .filter-btn:hover {
          background: rgba(255, 0, 128, 0.1);
          border-color: rgba(255, 0, 128, 0.3);
        }
        
        .filter-btn.active {
          background: rgba(255, 0, 128, 0.2);
          border-color: #ff0080;
          color: #ff0080;
        }
        
        .secrets-toggle {
          padding: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: #666;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .secrets-toggle:hover, .secrets-toggle.active {
          background: rgba(191, 0, 255, 0.1);
          border-color: rgba(191, 0, 255, 0.3);
          color: #bf00ff;
        }
        
        .achievements-list {
          max-height: 400px;
          overflow-y: auto;
          padding: 0 16px;
        }
        
        .category-group {
          margin-bottom: 12px;
        }
        
        .category-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          cursor: pointer;
          color: #fff;
          transition: all 0.2s;
        }
        
        .category-header:hover {
          background: rgba(255, 0, 128, 0.05);
          border-color: rgba(255, 0, 128, 0.2);
        }
        
        .category-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .category-icon {
          font-size: 16px;
        }
        
        .category-name {
          font-family: 'Orbitron', sans-serif;
          font-size: 12px;
        }
        
        .category-count {
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          color: #666;
          padding: 2px 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        
        .category-achievements {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 10px;
          padding: 10px 0;
        }
        
        .filtered-achievements {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 10px;
        }
        
        .achievement-card {
          position: relative;
          display: flex;
          gap: 12px;
          padding: 14px;
          border-radius: 10px;
          cursor: default;
        }
        
        .achievement-icon {
          font-size: 28px;
          flex-shrink: 0;
        }
        
        .achievement-content {
          flex: 1;
          min-width: 0;
        }
        
        .achievement-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }
        
        .achievement-name {
          font-family: 'Orbitron', sans-serif;
          font-size: 12px;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .secret-badge {
          font-size: 10px;
        }
        
        .achievement-description {
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          color: #999;
          margin: 0 0 8px;
          line-height: 1.4;
        }
        
        .achievement-progress {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        
        .progress-bar-bg {
          flex: 1;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .progress-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.3s ease;
        }
        
        .progress-text {
          font-family: 'Rajdhani', sans-serif;
          font-size: 10px;
          color: #666;
        }
        
        .achievement-footer {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .achievement-rarity {
          font-family: 'Orbitron', sans-serif;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .achievement-points {
          font-family: 'Rajdhani', sans-serif;
          font-size: 10px;
          color: #ffd700;
        }
        
        .achievement-date {
          font-family: 'Rajdhani', sans-serif;
          font-size: 10px;
          color: #555;
          margin-left: auto;
        }
        
        .lock-overlay {
          position: absolute;
          top: 8px;
          right: 8px;
          color: #444;
        }
        
        .game-stats-footer {
          padding: 16px;
          background: rgba(0, 0, 0, 0.3);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          margin-top: 16px;
        }
        
        .game-stats-footer h4 {
          font-family: 'Orbitron', sans-serif;
          font-size: 11px;
          color: #666;
          margin: 0 0 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .game-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        
        .game-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        
        .game-stat .stat-icon {
          font-size: 18px;
        }
        
        .game-stat .stat-num {
          font-family: 'Orbitron', sans-serif;
          font-size: 18px;
        }
        
        .game-stat .stat-name {
          font-family: 'Rajdhani', sans-serif;
          font-size: 10px;
          color: #666;
          text-transform: uppercase;
        }
        
        /* Custom scrollbar */
        .achievements-list::-webkit-scrollbar {
          width: 6px;
        }
        
        .achievements-list::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 3px;
        }
        
        .achievements-list::-webkit-scrollbar-thumb {
          background: rgba(255, 0, 128, 0.3);
          border-radius: 3px;
        }
        
        .achievements-list::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 0, 128, 0.5);
        }
        
        @media (max-width: 768px) {
          .stats-bar {
            flex-wrap: wrap;
            gap: 12px;
          }
          
          .stat-item {
            flex: 1 1 40%;
          }
          
          .category-filter {
            justify-content: center;
          }
          
          .game-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .category-achievements,
          .filtered-achievements {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AchievementsPanel;
