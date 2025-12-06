/**
 * AchievementsDisplay.js
 * A self-contained component to display achievements
 * 
 * Can be toggled on/off without affecting other components.
 * BACKWARD COMPATIBLE - purely additive functionality.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, X, Star, Lock, Award, Target, Eye, Sparkles } from 'lucide-react';
import {
  getAllAchievements,
  getStats,
  getCompletionPercentage,
  setAchievementNotificationCallback
} from '../utils/AchievementsManager';

// Rarity colors
const RARITY_COLORS = {
  common: { bg: '#4a5568', glow: '#718096', text: '#e2e8f0' },
  uncommon: { bg: '#38a169', glow: '#48bb78', text: '#c6f6d5' },
  rare: { bg: '#3182ce', glow: '#4299e1', text: '#bee3f8' },
  epic: { bg: '#805ad5', glow: '#9f7aea', text: '#e9d8fd' },
  legendary: { bg: '#d69e2e', glow: '#ecc94b', text: '#fefcbf' }
};

// Category icons
const CATEGORY_ICONS = {
  victories: Trophy,
  enemies: Target,
  outcomes: Star,
  secrets: Eye
};

/**
 * Achievement Notification Toast
 * Shows when a new achievement is unlocked
 */
export const AchievementNotification = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const rarity = RARITY_COLORS[achievement?.rarity || 'common'];
  
  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
    
    // Auto close after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  if (!achievement) return null;
  
  return (
    <div 
      className={`fixed top-4 right-4 z-[9999] transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
      data-testid="achievement-notification"
    >
      <div 
        className="relative p-4 rounded-xl min-w-[280px] max-w-[350px]"
        style={{
          background: 'linear-gradient(135deg, rgba(25,25,45,0.98) 0%, rgba(12,12,25,0.99) 100%)',
          border: `2px solid ${rarity.glow}`,
          boxShadow: `0 0 30px ${rarity.glow}50, 0 0 60px ${rarity.glow}25`
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} style={{ color: rarity.glow }} className="animate-pulse" />
          <span 
            className="text-xs font-bold tracking-widest"
            style={{ fontFamily: 'Orbitron, sans-serif', color: rarity.glow }}
          >
            ACHIEVEMENT UNLOCKED!
          </span>
        </div>
        
        {/* Achievement Info */}
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
            style={{ 
              background: `linear-gradient(135deg, ${rarity.bg}80 0%, ${rarity.bg}40 100%)`,
              border: `1px solid ${rarity.glow}60`
            }}
          >
            {achievement.icon}
          </div>
          <div className="flex-1">
            <h4 
              className="font-bold text-white text-sm"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              {achievement.name}
            </h4>
            <p 
              className="text-xs text-gray-400"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              {achievement.description}
            </p>
          </div>
        </div>
        
        {/* Rarity Badge */}
        <div 
          className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-bold"
          style={{ 
            background: rarity.bg, 
            color: rarity.text,
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '9px'
          }}
        >
          {achievement.rarity?.toUpperCase()}
        </div>
        
        {/* Close button */}
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
        >
          <X size={12} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};

/**
 * Achievements Panel
 * Full panel showing all achievements
 */
export const AchievementsPanel = ({ isOpen, onClose }) => {
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({});
  const [completion, setCompletion] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setAchievements(getAllAchievements());
      setStats(getStats());
      setCompletion(getCompletionPercentage());
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);
  
  const categories = ['all', 'victories', 'enemies', 'outcomes', 'secrets'];
  
  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className={`fixed inset-0 z-[9998] flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
      data-testid="achievements-panel"
    >
      <div 
        className={`relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl transition-all duration-500 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'}`}
        style={{
          background: 'linear-gradient(180deg, rgba(25,25,45,0.98) 0%, rgba(12,12,25,0.99) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 0 60px rgba(0,0,0,0.5)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Trophy size={24} className="text-yellow-500" />
              <h2 
                className="text-xl sm:text-2xl font-black tracking-wider text-white"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                ACHIEVEMENTS
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              data-testid="close-achievements-btn"
            >
              <X size={18} className="text-gray-400" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              <span>COMPLETION</span>
              <span>{completion}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000"
                style={{ 
                  width: `${completion}%`,
                  background: 'linear-gradient(90deg, #ff0080 0%, #7928ca 50%, #00ffff 100%)'
                }}
              />
            </div>
          </div>
          
          {/* Stats Summary */}
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
              <Trophy size={14} className="text-green-500" />
              <span className="text-xs text-green-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                {stats.totalWins || 0} Wins
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30">
              <Target size={14} className="text-red-500" />
              <span className="text-xs text-red-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                {stats.totalLosses || 0} Losses
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-500/10 border border-gray-500/30">
              <Star size={14} className="text-gray-400" />
              <span className="text-xs text-gray-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                {stats.totalDraws || 0} Draws
              </span>
            </div>
          </div>
        </div>
        
        {/* Category Tabs */}
        <div className="flex gap-1 px-4 sm:px-6 pt-4 overflow-x-auto">
          {categories.map(cat => {
            const Icon = CATEGORY_ICONS[cat] || Award;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                {cat !== 'all' && <Icon size={12} />}
                {cat.toUpperCase()}
              </button>
            );
          })}
        </div>
        
        {/* Achievements Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredAchievements.map(achievement => {
              const rarity = RARITY_COLORS[achievement.rarity || 'common'];
              return (
                <div 
                  key={achievement.id}
                  className={`relative p-3 rounded-xl transition-all duration-300 ${
                    achievement.unlocked 
                      ? 'opacity-100' 
                      : 'opacity-50 grayscale'
                  }`}
                  style={{
                    background: achievement.unlocked 
                      ? `linear-gradient(135deg, ${rarity.bg}20 0%, ${rarity.bg}10 100%)`
                      : 'rgba(30,30,40,0.5)',
                    border: `1px solid ${achievement.unlocked ? rarity.glow + '40' : 'rgba(255,255,255,0.05)'}`
                  }}
                  data-testid={`achievement-${achievement.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                      style={{ 
                        background: achievement.unlocked 
                          ? `linear-gradient(135deg, ${rarity.bg}60 0%, ${rarity.bg}30 100%)`
                          : 'rgba(40,40,50,0.8)',
                        border: `1px solid ${achievement.unlocked ? rarity.glow + '40' : 'rgba(255,255,255,0.1)'}`
                      }}
                    >
                      {achievement.unlocked ? achievement.icon : <Lock size={16} className="text-gray-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 
                        className="font-bold text-sm text-white truncate"
                        style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px' }}
                      >
                        {achievement.unlocked ? achievement.name : '???'}
                      </h4>
                      <p 
                        className="text-xs text-gray-400 line-clamp-2"
                        style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '11px' }}
                      >
                        {achievement.unlocked ? achievement.description : 'Achievement locked'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Rarity indicator */}
                  <div 
                    className="absolute top-2 right-2 w-2 h-2 rounded-full"
                    style={{ 
                      background: achievement.unlocked ? rarity.glow : '#4a5568',
                      boxShadow: achievement.unlocked ? `0 0 6px ${rarity.glow}` : 'none'
                    }}
                  />
                </div>
              );
            })}
          </div>
          
          {filteredAchievements.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Award size={32} className="mx-auto mb-2 opacity-50" />
              <p style={{ fontFamily: 'Rajdhani, sans-serif' }}>No achievements in this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Achievements Button
 * A button to open the achievements panel, typically placed on the main screen
 */
export const AchievementsButton = ({ onClick }) => {
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    const achievements = getAllAchievements();
    setUnlockedCount(achievements.filter(a => a.unlocked).length);
    setTotal(achievements.length);
  }, []);
  
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
      style={{
        background: 'linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(255,140,0,0.1) 100%)',
        border: '1px solid rgba(255,215,0,0.3)',
        boxShadow: '0 0 20px rgba(255,215,0,0.15)'
      }}
      data-testid="achievements-button"
    >
      <Trophy size={18} className="text-yellow-500" />
      <span 
        className="text-sm font-bold tracking-wider text-yellow-400"
        style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px' }}
      >
        {unlockedCount}/{total}
      </span>
    </button>
  );
};

/**
 * Achievement Notification Provider
 * Manages the notification queue and displays them one at a time
 */
export const AchievementNotificationProvider = ({ children }) => {
  const [notificationQueue, setNotificationQueue] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);
  
  // Set up notification callback
  useEffect(() => {
    setAchievementNotificationCallback((achievement) => {
      setNotificationQueue(prev => [...prev, achievement]);
    });
    
    return () => setAchievementNotificationCallback(null);
  }, []);
  
  // Process notification queue
  useEffect(() => {
    if (!currentNotification && notificationQueue.length > 0) {
      setCurrentNotification(notificationQueue[0]);
      setNotificationQueue(prev => prev.slice(1));
    }
  }, [currentNotification, notificationQueue]);
  
  const handleClose = useCallback(() => {
    setCurrentNotification(null);
  }, []);
  
  return (
    <>
      {children}
      {currentNotification && (
        <AchievementNotification 
          achievement={currentNotification} 
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default {
  AchievementNotification,
  AchievementsPanel,
  AchievementsButton,
  AchievementNotificationProvider
};
