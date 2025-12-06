/**
 * AchievementsManager.js
 * Self-contained achievement system for Chess Masters game
 * 
 * This module handles all achievement tracking, storage, and unlocking.
 * Uses localStorage for persistence.
 * 
 * BACKWARD COMPATIBLE: This is a standalone utility that doesn't affect
 * existing functionality if not used.
 */

// Achievement definitions
export const ACHIEVEMENTS = {
  // Victory achievements
  FIRST_VICTORY: {
    id: 'first_victory',
    name: 'First Victory',
    description: 'Win your first chess game',
    icon: '🏆',
    category: 'victories',
    rarity: 'common'
  },
  CHECKMATE_MASTER: {
    id: 'checkmate_master',
    name: 'Checkmate Master',
    description: 'Win 5 chess games',
    icon: '👑',
    category: 'victories',
    rarity: 'rare',
    requirement: 5
  },
  CHAMPION: {
    id: 'champion',
    name: 'Grand Champion',
    description: 'Defeat all 4 unique enemies',
    icon: '🎖️',
    category: 'victories',
    rarity: 'legendary'
  },
  
  // Enemy-specific victories
  ELEGANT_CONQUEROR: {
    id: 'elegant_conqueror',
    name: 'Elegant Conqueror',
    description: 'Defeat The Elegant',
    icon: '♚',
    category: 'enemies',
    rarity: 'uncommon',
    enemyId: 'elegant'
  },
  CRUSHER_CRUSHER: {
    id: 'crusher_crusher',
    name: 'Crusher Crusher',
    description: 'Defeat The Crusher',
    icon: '♛',
    category: 'enemies',
    rarity: 'uncommon',
    enemyId: 'nonelegant'
  },
  ALPHA_TAMER: {
    id: 'alpha_tamer',
    name: 'Alpha Tamer',
    description: 'Defeat Mini Alpha',
    icon: '♞',
    category: 'enemies',
    rarity: 'uncommon',
    enemyId: 'minia0'
  },
  NEURAL_VICTOR: {
    id: 'neural_victor',
    name: 'Neural Network Victor',
    description: 'Defeat the legendary AlphaZero',
    icon: '🧠',
    category: 'enemies',
    rarity: 'legendary',
    enemyId: 'alphazero'
  },
  
  // Draw/Stalemate achievements
  DRAW_SPECIALIST: {
    id: 'draw_specialist',
    name: 'Draw Specialist',
    description: 'Achieve a draw in a chess game',
    icon: '⚖️',
    category: 'outcomes',
    rarity: 'uncommon'
  },
  STALEMATE_STRATEGIST: {
    id: 'stalemate_strategist',
    name: 'Stalemate Strategist',
    description: 'Force a stalemate',
    icon: '🔒',
    category: 'outcomes',
    rarity: 'rare'
  },
  
  // Loss achievements
  LEARNING_EXPERIENCE: {
    id: 'learning_experience',
    name: 'Learning Experience',
    description: 'Lose your first game - every master was once a beginner',
    icon: '📚',
    category: 'outcomes',
    rarity: 'common'
  },
  
  // Easter egg achievements
  HIDDEN_MASTER_REVEALED: {
    id: 'hidden_master_revealed',
    name: 'Hidden Master Revealed',
    description: 'Unlock the secret AlphaZero enemy',
    icon: '👁️',
    category: 'secrets',
    rarity: 'epic'
  },
  SECRET_HUNTER: {
    id: 'secret_hunter',
    name: 'Secret Hunter',
    description: 'Discover the Among Us easter egg',
    icon: '🔍',
    category: 'secrets',
    rarity: 'rare'
  },
  LAPTOP_HACKER: {
    id: 'laptop_hacker',
    name: 'Laptop Hacker',
    description: 'Open the secret laptop',
    icon: '💻',
    category: 'secrets',
    rarity: 'uncommon'
  }
};

// Storage key for achievements data
const ACHIEVEMENTS_STORAGE_KEY = 'chess_masters_achievements';
const STATS_STORAGE_KEY = 'chess_masters_stats';

/**
 * Get current achievements data from localStorage
 * @returns {Object} Achievement data with unlocked achievements and stats
 */
export function getAchievementsData() {
  try {
    const stored = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading achievements:', e);
  }
  
  // Return default structure
  return {
    unlocked: {},
    unlockedAt: {},
    stats: {
      totalWins: 0,
      totalLosses: 0,
      totalDraws: 0,
      totalStalemates: 0,
      enemiesDefeated: [],
      gamesPlayed: 0
    }
  };
}

/**
 * Save achievements data to localStorage
 * @param {Object} data - Achievement data to save
 */
export function saveAchievementsData(data) {
  try {
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving achievements:', e);
  }
}

/**
 * Check if an achievement is unlocked
 * @param {string} achievementId - The achievement ID to check
 * @returns {boolean}
 */
export function isAchievementUnlocked(achievementId) {
  const data = getAchievementsData();
  return !!data.unlocked[achievementId];
}

/**
 * Unlock an achievement
 * @param {string} achievementId - The achievement ID to unlock
 * @returns {Object|null} The achievement object if newly unlocked, null if already unlocked
 */
export function unlockAchievement(achievementId) {
  const data = getAchievementsData();
  
  // Find the achievement definition
  const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === achievementId);
  if (!achievement) {
    console.warn('Achievement not found:', achievementId);
    return null;
  }
  
  // Check if already unlocked
  if (data.unlocked[achievementId]) {
    return null;
  }
  
  // Unlock it
  data.unlocked[achievementId] = true;
  data.unlockedAt[achievementId] = Date.now();
  saveAchievementsData(data);
  
  console.log('🏆 Achievement Unlocked:', achievement.name);
  return achievement;
}

/**
 * Get all unlocked achievements
 * @returns {Array} Array of unlocked achievement objects
 */
export function getUnlockedAchievements() {
  const data = getAchievementsData();
  return Object.values(ACHIEVEMENTS).filter(a => data.unlocked[a.id]);
}

/**
 * Get all achievements with their unlock status
 * @returns {Array} Array of all achievements with unlocked boolean
 */
export function getAllAchievements() {
  const data = getAchievementsData();
  return Object.values(ACHIEVEMENTS).map(a => ({
    ...a,
    unlocked: !!data.unlocked[a.id],
    unlockedAt: data.unlockedAt[a.id] || null
  }));
}

/**
 * Get achievement statistics
 * @returns {Object} Stats object
 */
export function getStats() {
  const data = getAchievementsData();
  return data.stats || {
    totalWins: 0,
    totalLosses: 0,
    totalDraws: 0,
    totalStalemates: 0,
    enemiesDefeated: [],
    gamesPlayed: 0
  };
}

/**
 * Record a game result and check for achievements
 * @param {string} result - 'player' for win, 'enemy' for loss, 'draw' for draw
 * @param {string} enemyId - The enemy that was played against
 * @param {boolean} isStalemate - Whether the draw was a stalemate
 * @returns {Array} Array of newly unlocked achievements
 */
export function recordGameResult(result, enemyId, isStalemate = false) {
  const data = getAchievementsData();
  const newlyUnlocked = [];
  
  // Update stats
  data.stats.gamesPlayed = (data.stats.gamesPlayed || 0) + 1;
  
  if (result === 'player') {
    // Player won
    data.stats.totalWins = (data.stats.totalWins || 0) + 1;
    
    // Track unique enemies defeated
    if (!data.stats.enemiesDefeated) {
      data.stats.enemiesDefeated = [];
    }
    if (enemyId && !data.stats.enemiesDefeated.includes(enemyId)) {
      data.stats.enemiesDefeated.push(enemyId);
    }
    
    // Check for first victory
    if (!data.unlocked[ACHIEVEMENTS.FIRST_VICTORY.id]) {
      data.unlocked[ACHIEVEMENTS.FIRST_VICTORY.id] = true;
      data.unlockedAt[ACHIEVEMENTS.FIRST_VICTORY.id] = Date.now();
      newlyUnlocked.push(ACHIEVEMENTS.FIRST_VICTORY);
    }
    
    // Check for checkmate master (5 wins)
    if (data.stats.totalWins >= 5 && !data.unlocked[ACHIEVEMENTS.CHECKMATE_MASTER.id]) {
      data.unlocked[ACHIEVEMENTS.CHECKMATE_MASTER.id] = true;
      data.unlockedAt[ACHIEVEMENTS.CHECKMATE_MASTER.id] = Date.now();
      newlyUnlocked.push(ACHIEVEMENTS.CHECKMATE_MASTER);
    }
    
    // Check for enemy-specific achievements
    const enemyAchievements = {
      'elegant': ACHIEVEMENTS.ELEGANT_CONQUEROR,
      'nonelegant': ACHIEVEMENTS.CRUSHER_CRUSHER,
      'minia0': ACHIEVEMENTS.ALPHA_TAMER,
      'alphazero': ACHIEVEMENTS.NEURAL_VICTOR
    };
    
    const enemyAchievement = enemyAchievements[enemyId];
    if (enemyAchievement && !data.unlocked[enemyAchievement.id]) {
      data.unlocked[enemyAchievement.id] = true;
      data.unlockedAt[enemyAchievement.id] = Date.now();
      newlyUnlocked.push(enemyAchievement);
    }
    
    // Check for champion (all 4 enemies defeated)
    if (data.stats.enemiesDefeated.length >= 4 && !data.unlocked[ACHIEVEMENTS.CHAMPION.id]) {
      const allEnemies = ['elegant', 'nonelegant', 'minia0', 'alphazero'];
      const hasAll = allEnemies.every(e => data.stats.enemiesDefeated.includes(e));
      if (hasAll) {
        data.unlocked[ACHIEVEMENTS.CHAMPION.id] = true;
        data.unlockedAt[ACHIEVEMENTS.CHAMPION.id] = Date.now();
        newlyUnlocked.push(ACHIEVEMENTS.CHAMPION);
      }
    }
    
  } else if (result === 'enemy') {
    // Player lost
    data.stats.totalLosses = (data.stats.totalLosses || 0) + 1;
    
    // Check for learning experience (first loss)
    if (!data.unlocked[ACHIEVEMENTS.LEARNING_EXPERIENCE.id]) {
      data.unlocked[ACHIEVEMENTS.LEARNING_EXPERIENCE.id] = true;
      data.unlockedAt[ACHIEVEMENTS.LEARNING_EXPERIENCE.id] = Date.now();
      newlyUnlocked.push(ACHIEVEMENTS.LEARNING_EXPERIENCE);
    }
    
  } else if (result === 'draw') {
    // Draw
    data.stats.totalDraws = (data.stats.totalDraws || 0) + 1;
    
    // Check for draw specialist
    if (!data.unlocked[ACHIEVEMENTS.DRAW_SPECIALIST.id]) {
      data.unlocked[ACHIEVEMENTS.DRAW_SPECIALIST.id] = true;
      data.unlockedAt[ACHIEVEMENTS.DRAW_SPECIALIST.id] = Date.now();
      newlyUnlocked.push(ACHIEVEMENTS.DRAW_SPECIALIST);
    }
    
    // Check for stalemate achievement
    if (isStalemate) {
      data.stats.totalStalemates = (data.stats.totalStalemates || 0) + 1;
      if (!data.unlocked[ACHIEVEMENTS.STALEMATE_STRATEGIST.id]) {
        data.unlocked[ACHIEVEMENTS.STALEMATE_STRATEGIST.id] = true;
        data.unlockedAt[ACHIEVEMENTS.STALEMATE_STRATEGIST.id] = Date.now();
        newlyUnlocked.push(ACHIEVEMENTS.STALEMATE_STRATEGIST);
      }
    }
  }
  
  saveAchievementsData(data);
  return newlyUnlocked;
}

/**
 * Record hidden master unlock achievement
 * @returns {Object|null} Achievement if newly unlocked
 */
export function recordHiddenMasterUnlock() {
  return unlockAchievement(ACHIEVEMENTS.HIDDEN_MASTER_REVEALED.id);
}

/**
 * Record easter egg discovery
 * @param {string} type - Type of easter egg: 'among_us' or 'laptop'
 * @returns {Object|null} Achievement if newly unlocked
 */
export function recordEasterEggFound(type) {
  if (type === 'among_us') {
    return unlockAchievement(ACHIEVEMENTS.SECRET_HUNTER.id);
  } else if (type === 'laptop') {
    return unlockAchievement(ACHIEVEMENTS.LAPTOP_HACKER.id);
  }
  return null;
}

/**
 * Get completion percentage
 * @returns {number} Percentage of achievements unlocked (0-100)
 */
export function getCompletionPercentage() {
  const total = Object.keys(ACHIEVEMENTS).length;
  const unlocked = getUnlockedAchievements().length;
  return Math.round((unlocked / total) * 100);
}

/**
 * Reset all achievements (for testing)
 */
export function resetAchievements() {
  localStorage.removeItem(ACHIEVEMENTS_STORAGE_KEY);
  console.log('Achievements reset');
}

// Export a singleton notification callback system
let achievementNotificationCallback = null;

/**
 * Set the callback for achievement notifications
 * @param {Function} callback - Function to call when achievement unlocked
 */
export function setAchievementNotificationCallback(callback) {
  achievementNotificationCallback = callback;
}

/**
 * Trigger achievement notification
 * @param {Object} achievement - The achievement that was unlocked
 */
export function triggerAchievementNotification(achievement) {
  if (achievementNotificationCallback && achievement) {
    achievementNotificationCallback(achievement);
  }
}

export default {
  ACHIEVEMENTS,
  getAchievementsData,
  isAchievementUnlocked,
  unlockAchievement,
  getUnlockedAchievements,
  getAllAchievements,
  getStats,
  recordGameResult,
  recordHiddenMasterUnlock,
  recordEasterEggFound,
  getCompletionPercentage,
  resetAchievements,
  setAchievementNotificationCallback,
  triggerAchievementNotification
};
