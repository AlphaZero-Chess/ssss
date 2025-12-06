import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * ACHIEVEMENTS SYSTEM - Core Hook
 * 
 * Sophisticated achievement tracking system with:
 * - Persistent localStorage storage
 * - Real-time progress tracking
 * - Multi-tier achievement levels
 * - Secret/hidden achievements
 * - Achievement chains and dependencies
 * - Statistics tracking
 * 
 * BACKWARD COMPATIBLE - Can be removed without affecting other components
 */

// ═══════════════════════════════════════════════════════════════════════
// ACHIEVEMENT DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════

export const ACHIEVEMENT_CATEGORIES = {
  HIDDEN_SECRETS: 'hidden_secrets',
  VICTORIES: 'victories',
  DEFEATS: 'defeats',
  DRAWS: 'draws',
  MASTERY: 'mastery',
  EXPLORATION: 'exploration',
  LEGENDARY: 'legendary'
};

export const ACHIEVEMENT_RARITY = {
  COMMON: { name: 'Common', color: '#8B8B8B', glow: 'rgba(139, 139, 139, 0.5)' },
  UNCOMMON: { name: 'Uncommon', color: '#1EFF00', glow: 'rgba(30, 255, 0, 0.5)' },
  RARE: { name: 'Rare', color: '#0070DD', glow: 'rgba(0, 112, 221, 0.5)' },
  EPIC: { name: 'Epic', color: '#A335EE', glow: 'rgba(163, 53, 238, 0.5)' },
  LEGENDARY: { name: 'Legendary', color: '#FF8000', glow: 'rgba(255, 128, 0, 0.5)' },
  MYTHIC: { name: 'Mythic', color: '#E6CC80', glow: 'rgba(230, 204, 128, 0.6)' },
  TRANSCENDENT: { name: 'Transcendent', color: '#bf00ff', glow: 'rgba(191, 0, 255, 0.6)' }
};

export const ACHIEVEMENTS = {
  // ═══════════════════════════════════════════════════════════════════════
  // HIDDEN SECRETS CATEGORY - Unlocking hidden content
  // ═══════════════════════════════════════════════════════════════════════
  SEAL_BREAKER: {
    id: 'seal_breaker',
    name: 'Seal Breaker',
    description: 'Spoke the ancient name and broke the mystical seal',
    secretDescription: 'Type the secret code to unlock the hidden master',
    icon: '🔓',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN_SECRETS,
    rarity: ACHIEVEMENT_RARITY.LEGENDARY,
    isSecret: true,
    points: 100,
    unlockCondition: 'hidden_master_unlocked'
  },
  
  ALPHA_AWAKENER: {
    id: 'alpha_awakener',
    name: 'Alpha Awakener',
    description: 'Awakened the dormant AlphaZero from its eternal slumber',
    secretDescription: 'Unlock and challenge the hidden AlphaZero master',
    icon: '👁',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN_SECRETS,
    rarity: ACHIEVEMENT_RARITY.TRANSCENDENT,
    isSecret: true,
    points: 150,
    unlockCondition: 'alphazero_challenged',
    requires: ['seal_breaker']
  },
  
  RUNE_READER: {
    id: 'rune_reader',
    name: 'Rune Reader',
    description: 'Deciphered the mystical runes guarding the hidden master',
    secretDescription: 'Observe the chain runes before breaking the seal',
    icon: 'ᚠ',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN_SECRETS,
    rarity: ACHIEVEMENT_RARITY.EPIC,
    isSecret: true,
    points: 75,
    unlockCondition: 'runes_observed'
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // EASTER EGGS CATEGORY
  // ═══════════════════════════════════════════════════════════════════════
  CREWMATE_FINDER: {
    id: 'crewmate_finder',
    name: 'Crewmate Finder',
    description: 'Found the suspicious red crewmate hiding at the edge',
    secretDescription: 'Discover the Among Us easter egg on mobile',
    icon: '🔴',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN_SECRETS,
    rarity: ACHIEVEMENT_RARITY.RARE,
    isSecret: true,
    points: 50,
    unlockCondition: 'crewmate_found'
  },
  
  LAPTOP_SHAKER: {
    id: 'laptop_shaker',
    name: 'Laptop Shaker',
    description: 'Shook the crewmate until it dropped its laptop',
    secretDescription: 'Shake the Among Us character vigorously',
    icon: '💻',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN_SECRETS,
    rarity: ACHIEVEMENT_RARITY.EPIC,
    isSecret: true,
    points: 75,
    unlockCondition: 'laptop_dropped',
    requires: ['crewmate_finder']
  },
  
  KEYBOARD_HACKER: {
    id: 'keyboard_hacker',
    name: 'Keyboard Hacker',
    description: 'Used the dropped laptop to access the secret keyboard',
    secretDescription: 'Open the laptop and use the AlphaZero keyboard',
    icon: '⌨️',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN_SECRETS,
    rarity: ACHIEVEMENT_RARITY.LEGENDARY,
    isSecret: true,
    points: 100,
    unlockCondition: 'keyboard_used',
    requires: ['laptop_shaker']
  },
  
  EASTER_EGG_HUNTER: {
    id: 'easter_egg_hunter',
    name: 'Easter Egg Hunter',
    description: 'Discovered all hidden easter eggs in the game',
    secretDescription: 'Find every secret easter egg',
    icon: '🥚',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN_SECRETS,
    rarity: ACHIEVEMENT_RARITY.MYTHIC,
    isSecret: true,
    points: 200,
    unlockCondition: 'all_easter_eggs',
    requires: ['crewmate_finder', 'laptop_shaker', 'keyboard_hacker', 'seal_breaker']
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // VICTORIES CATEGORY
  // ═══════════════════════════════════════════════════════════════════════
  FIRST_BLOOD: {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Won your first chess game',
    icon: '⚔️',
    category: ACHIEVEMENT_CATEGORIES.VICTORIES,
    rarity: ACHIEVEMENT_RARITY.COMMON,
    isSecret: false,
    points: 10,
    unlockCondition: 'wins_1',
    progress: { current: 0, target: 1, type: 'wins' }
  },
  
  WARRIOR: {
    id: 'warrior',
    name: 'Warrior',
    description: 'Won 5 games against the AI',
    icon: '🗡️',
    category: ACHIEVEMENT_CATEGORIES.VICTORIES,
    rarity: ACHIEVEMENT_RARITY.UNCOMMON,
    isSecret: false,
    points: 25,
    unlockCondition: 'wins_5',
    progress: { current: 0, target: 5, type: 'wins' }
  },
  
  CHAMPION: {
    id: 'champion',
    name: 'Champion',
    description: 'Won 10 games - A true chess champion',
    icon: '🏆',
    category: ACHIEVEMENT_CATEGORIES.VICTORIES,
    rarity: ACHIEVEMENT_RARITY.RARE,
    isSecret: false,
    points: 50,
    unlockCondition: 'wins_10',
    progress: { current: 0, target: 10, type: 'wins' }
  },
  
  GRANDMASTER: {
    id: 'grandmaster',
    name: 'Grandmaster',
    description: 'Won 25 games - Achieved grandmaster status',
    icon: '👑',
    category: ACHIEVEMENT_CATEGORIES.VICTORIES,
    rarity: ACHIEVEMENT_RARITY.EPIC,
    isSecret: false,
    points: 100,
    unlockCondition: 'wins_25',
    progress: { current: 0, target: 25, type: 'wins' }
  },
  
  LEGEND: {
    id: 'legend',
    name: 'Legend',
    description: 'Won 50 games - Your name echoes through chess history',
    icon: '⭐',
    category: ACHIEVEMENT_CATEGORIES.VICTORIES,
    rarity: ACHIEVEMENT_RARITY.LEGENDARY,
    isSecret: false,
    points: 200,
    unlockCondition: 'wins_50',
    progress: { current: 0, target: 50, type: 'wins' }
  },
  
  IMMORTAL: {
    id: 'immortal',
    name: 'Immortal',
    description: 'Won 100 games - Transcended mortal chess',
    icon: '💫',
    category: ACHIEVEMENT_CATEGORIES.VICTORIES,
    rarity: ACHIEVEMENT_RARITY.MYTHIC,
    isSecret: false,
    points: 500,
    unlockCondition: 'wins_100',
    progress: { current: 0, target: 100, type: 'wins' }
  },
  
  ELEGANT_SLAYER: {
    id: 'elegant_slayer',
    name: 'Elegant Slayer',
    description: 'Defeated The Elegant master',
    icon: '♚',
    category: ACHIEVEMENT_CATEGORIES.VICTORIES,
    rarity: ACHIEVEMENT_RARITY.RARE,
    isSecret: false,
    points: 50,
    unlockCondition: 'defeat_elegant'
  },
  
  CRUSHER_CRUSHER: {
    id: 'crusher_crusher',
    name: 'Crusher Crusher',
    description: 'Crushed The Crusher at its own game',
    icon: '♛',
    category: ACHIEVEMENT_CATEGORIES.VICTORIES,
    rarity: ACHIEVEMENT_RARITY.RARE,
    isSecret: false,
    points: 50,
    unlockCondition: 'defeat_nonelegant'
  },
  
  ALPHA_TAMER: {
    id: 'alpha_tamer',
    name: 'Alpha Tamer',
    description: 'Showed Mini Alpha who the real master is',
    icon: '♞',
    category: ACHIEVEMENT_CATEGORIES.VICTORIES,
    rarity: ACHIEVEMENT_RARITY.UNCOMMON,
    isSecret: false,
    points: 35,
    unlockCondition: 'defeat_minia0'
  },
  
  NEURAL_CONQUEROR: {
    id: 'neural_conqueror',
    name: 'Neural Conqueror',
    description: 'Defeated the AlphaZero Hidden Master - The impossible achieved',
    secretDescription: 'Beat the hidden AlphaZero master',
    icon: '🧠',
    category: ACHIEVEMENT_CATEGORIES.LEGENDARY,
    rarity: ACHIEVEMENT_RARITY.TRANSCENDENT,
    isSecret: true,
    points: 500,
    unlockCondition: 'defeat_alphazero',
    requires: ['alpha_awakener']
  },
  
  PERFECT_GAME: {
    id: 'perfect_game',
    name: 'Perfect Game',
    description: 'Won a game without losing any pieces',
    icon: '💎',
    category: ACHIEVEMENT_CATEGORIES.VICTORIES,
    rarity: ACHIEVEMENT_RARITY.MYTHIC,
    isSecret: false,
    points: 250,
    unlockCondition: 'perfect_win'
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // DEFEATS CATEGORY - Learning from losses
  // ═══════════════════════════════════════════════════════════════════════
  LEARNING_EXPERIENCE: {
    id: 'learning_experience',
    name: 'Learning Experience',
    description: 'Lost your first game - Every master was once a disaster',
    icon: '📚',
    category: ACHIEVEMENT_CATEGORIES.DEFEATS,
    rarity: ACHIEVEMENT_RARITY.COMMON,
    isSecret: false,
    points: 5,
    unlockCondition: 'losses_1',
    progress: { current: 0, target: 1, type: 'losses' }
  },
  
  PERSISTENT: {
    id: 'persistent',
    name: 'Persistent',
    description: 'Lost 10 games but keep coming back',
    icon: '🔄',
    category: ACHIEVEMENT_CATEGORIES.DEFEATS,
    rarity: ACHIEVEMENT_RARITY.UNCOMMON,
    isSecret: false,
    points: 20,
    unlockCondition: 'losses_10',
    progress: { current: 0, target: 10, type: 'losses' }
  },
  
  NEVER_GIVE_UP: {
    id: 'never_give_up',
    name: 'Never Give Up',
    description: 'Lost 25 games - Your perseverance is admirable',
    icon: '💪',
    category: ACHIEVEMENT_CATEGORIES.DEFEATS,
    rarity: ACHIEVEMENT_RARITY.RARE,
    isSecret: false,
    points: 50,
    unlockCondition: 'losses_25',
    progress: { current: 0, target: 25, type: 'losses' }
  },
  
  CRUSHED_BY_ELEGANT: {
    id: 'crushed_by_elegant',
    name: 'Elegantly Crushed',
    description: 'Fell to The Elegant\'s superior positional play',
    icon: '😵',
    category: ACHIEVEMENT_CATEGORIES.DEFEATS,
    rarity: ACHIEVEMENT_RARITY.COMMON,
    isSecret: false,
    points: 10,
    unlockCondition: 'lost_to_elegant'
  },
  
  DEMOLISHED_BY_CRUSHER: {
    id: 'demolished_by_crusher',
    name: 'Demolished',
    description: 'Got demolished by The Crusher\'s aggressive attacks',
    icon: '💥',
    category: ACHIEVEMENT_CATEGORIES.DEFEATS,
    rarity: ACHIEVEMENT_RARITY.COMMON,
    isSecret: false,
    points: 10,
    unlockCondition: 'lost_to_nonelegant'
  },
  
  OUTSMARTED_BY_MINI: {
    id: 'outsmarted_by_mini',
    name: 'Outsmarted',
    description: 'Got outsmarted by Mini Alpha\'s balanced approach',
    icon: '🎯',
    category: ACHIEVEMENT_CATEGORIES.DEFEATS,
    rarity: ACHIEVEMENT_RARITY.COMMON,
    isSecret: false,
    points: 10,
    unlockCondition: 'lost_to_minia0'
  },
  
  NEURAL_DOMINATED: {
    id: 'neural_dominated',
    name: 'Neural Dominated',
    description: 'Experienced the full power of AlphaZero\'s neural network',
    secretDescription: 'Lose to the hidden AlphaZero master',
    icon: '🤖',
    category: ACHIEVEMENT_CATEGORIES.DEFEATS,
    rarity: ACHIEVEMENT_RARITY.EPIC,
    isSecret: true,
    points: 25,
    unlockCondition: 'lost_to_alphazero',
    requires: ['alpha_awakener']
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // DRAWS & STALEMATES CATEGORY
  // ═══════════════════════════════════════════════════════════════════════
  PEACEFUL_RESOLUTION: {
    id: 'peaceful_resolution',
    name: 'Peaceful Resolution',
    description: 'Achieved your first draw - Sometimes neither side wins',
    icon: '🤝',
    category: ACHIEVEMENT_CATEGORIES.DRAWS,
    rarity: ACHIEVEMENT_RARITY.UNCOMMON,
    isSecret: false,
    points: 15,
    unlockCondition: 'draws_1',
    progress: { current: 0, target: 1, type: 'draws' }
  },
  
  DIPLOMAT: {
    id: 'diplomat',
    name: 'Diplomat',
    description: 'Achieved 5 draws - A master of balanced outcomes',
    icon: '⚖️',
    category: ACHIEVEMENT_CATEGORIES.DRAWS,
    rarity: ACHIEVEMENT_RARITY.RARE,
    isSecret: false,
    points: 40,
    unlockCondition: 'draws_5',
    progress: { current: 0, target: 5, type: 'draws' }
  },
  
  STALEMATE_ARTIST: {
    id: 'stalemate_artist',
    name: 'Stalemate Artist',
    description: 'Achieved a stalemate - Neither victory nor defeat',
    icon: '🎭',
    category: ACHIEVEMENT_CATEGORIES.DRAWS,
    rarity: ACHIEVEMENT_RARITY.RARE,
    isSecret: false,
    points: 30,
    unlockCondition: 'stalemate_1',
    progress: { current: 0, target: 1, type: 'stalemates' }
  },
  
  PERPETUAL_DANCER: {
    id: 'perpetual_dancer',
    name: 'Perpetual Dancer',
    description: 'Achieved 10 draws/stalemates - The eternal dance',
    icon: '💃',
    category: ACHIEVEMENT_CATEGORIES.DRAWS,
    rarity: ACHIEVEMENT_RARITY.EPIC,
    isSecret: false,
    points: 75,
    unlockCondition: 'draws_10',
    progress: { current: 0, target: 10, type: 'draws' }
  },
  
  NEURAL_STANDOFF: {
    id: 'neural_standoff',
    name: 'Neural Standoff',
    description: 'Drew against AlphaZero - Matched the master',
    secretDescription: 'Draw against the hidden AlphaZero',
    icon: '🧬',
    category: ACHIEVEMENT_CATEGORIES.DRAWS,
    rarity: ACHIEVEMENT_RARITY.LEGENDARY,
    isSecret: true,
    points: 150,
    unlockCondition: 'draw_alphazero',
    requires: ['alpha_awakener']
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // MASTERY CATEGORY - Special achievements
  // ═══════════════════════════════════════════════════════════════════════
  ENEMY_COLLECTOR: {
    id: 'enemy_collector',
    name: 'Enemy Collector',
    description: 'Played against all available enemies',
    icon: '📦',
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    rarity: ACHIEVEMENT_RARITY.RARE,
    isSecret: false,
    points: 50,
    unlockCondition: 'all_enemies_played'
  },
  
  CONQUEROR_OF_ALL: {
    id: 'conqueror_of_all',
    name: 'Conqueror of All',
    description: 'Defeated every enemy at least once',
    icon: '🌟',
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    rarity: ACHIEVEMENT_RARITY.EPIC,
    isSecret: false,
    points: 150,
    unlockCondition: 'all_enemies_defeated'
  },
  
  WIN_STREAK_3: {
    id: 'win_streak_3',
    name: 'Hot Streak',
    description: 'Won 3 games in a row',
    icon: '🔥',
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    rarity: ACHIEVEMENT_RARITY.UNCOMMON,
    isSecret: false,
    points: 30,
    unlockCondition: 'streak_3'
  },
  
  WIN_STREAK_5: {
    id: 'win_streak_5',
    name: 'On Fire',
    description: 'Won 5 games in a row',
    icon: '🌋',
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    rarity: ACHIEVEMENT_RARITY.RARE,
    isSecret: false,
    points: 75,
    unlockCondition: 'streak_5'
  },
  
  WIN_STREAK_10: {
    id: 'win_streak_10',
    name: 'Unstoppable',
    description: 'Won 10 games in a row - Truly unstoppable',
    icon: '☄️',
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    rarity: ACHIEVEMENT_RARITY.LEGENDARY,
    isSecret: false,
    points: 200,
    unlockCondition: 'streak_10'
  },
  
  QUICK_MATE: {
    id: 'quick_mate',
    name: 'Quick Mate',
    description: 'Won a game in under 20 moves',
    icon: '⚡',
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    rarity: ACHIEVEMENT_RARITY.RARE,
    isSecret: false,
    points: 50,
    unlockCondition: 'quick_win'
  },
  
  ENDGAME_MASTER: {
    id: 'endgame_master',
    name: 'Endgame Master',
    description: 'Won a game that went beyond 60 moves',
    icon: '🎯',
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    rarity: ACHIEVEMENT_RARITY.RARE,
    isSecret: false,
    points: 50,
    unlockCondition: 'long_game_win'
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // LEGENDARY CATEGORY - Ultimate achievements
  // ═══════════════════════════════════════════════════════════════════════
  COMPLETIONIST: {
    id: 'completionist',
    name: 'Completionist',
    description: 'Unlocked 50% of all achievements',
    icon: '🎖️',
    category: ACHIEVEMENT_CATEGORIES.LEGENDARY,
    rarity: ACHIEVEMENT_RARITY.EPIC,
    isSecret: false,
    points: 100,
    unlockCondition: 'half_achievements'
  },
  
  ULTIMATE_MASTER: {
    id: 'ultimate_master',
    name: 'Ultimate Master',
    description: 'Unlocked all achievements - You are the ultimate chess master',
    icon: '🏅',
    category: ACHIEVEMENT_CATEGORIES.LEGENDARY,
    rarity: ACHIEVEMENT_RARITY.TRANSCENDENT,
    isSecret: false,
    points: 1000,
    unlockCondition: 'all_achievements'
  },
  
  POINT_COLLECTOR_100: {
    id: 'point_collector_100',
    name: 'Rising Star',
    description: 'Earned 100 achievement points',
    icon: '⭐',
    category: ACHIEVEMENT_CATEGORIES.LEGENDARY,
    rarity: ACHIEVEMENT_RARITY.UNCOMMON,
    isSecret: false,
    points: 25,
    unlockCondition: 'points_100'
  },
  
  POINT_COLLECTOR_500: {
    id: 'point_collector_500',
    name: 'Celestial',
    description: 'Earned 500 achievement points',
    icon: '🌙',
    category: ACHIEVEMENT_CATEGORIES.LEGENDARY,
    rarity: ACHIEVEMENT_RARITY.RARE,
    isSecret: false,
    points: 50,
    unlockCondition: 'points_500'
  },
  
  POINT_COLLECTOR_1000: {
    id: 'point_collector_1000',
    name: 'Cosmic Entity',
    description: 'Earned 1000 achievement points',
    icon: '🌌',
    category: ACHIEVEMENT_CATEGORIES.LEGENDARY,
    rarity: ACHIEVEMENT_RARITY.LEGENDARY,
    isSecret: false,
    points: 100,
    unlockCondition: 'points_1000'
  }
};

// ═══════════════════════════════════════════════════════════════════════
// STORAGE KEYS
// ═══════════════════════════════════════════════════════════════════════
const STORAGE_KEYS = {
  ACHIEVEMENTS: 'chess_achievements_data',
  STATISTICS: 'chess_statistics_data',
  NOTIFICATIONS_QUEUE: 'chess_achievement_notifications'
};

// ═══════════════════════════════════════════════════════════════════════
// DEFAULT STATE
// ═══════════════════════════════════════════════════════════════════════
const getDefaultStatistics = () => ({
  totalWins: 0,
  totalLosses: 0,
  totalDraws: 0,
  totalStalemates: 0,
  totalGames: 0,
  currentWinStreak: 0,
  bestWinStreak: 0,
  enemiesDefeated: [],
  enemiesLostTo: [],
  enemiesPlayed: [],
  hiddenMasterUnlocked: false,
  alphazeroUnlocked: false,
  alphazeroPlayed: false,
  crewmateFound: false,
  laptopDropped: false,
  keyboardUsed: false,
  runesObserved: false,
  perfectWins: 0,
  quickWins: 0,
  longGameWins: 0,
  lastUpdated: Date.now()
});

const getDefaultAchievements = () => ({
  unlocked: {},
  progress: {},
  totalPoints: 0,
  unlockedCount: 0,
  lastUnlocked: null
});

// ═══════════════════════════════════════════════════════════════════════
// MAIN HOOK
// ═══════════════════════════════════════════════════════════════════════
export const useAchievements = () => {
  // State
  const [achievements, setAchievements] = useState(getDefaultAchievements);
  const [statistics, setStatistics] = useState(getDefaultStatistics);
  const [notifications, setNotifications] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Refs to avoid stale closures
  const achievementsRef = useRef(achievements);
  const statisticsRef = useRef(statistics);
  
  // Keep refs updated
  useEffect(() => {
    achievementsRef.current = achievements;
    statisticsRef.current = statistics;
  }, [achievements, statistics]);
  
  // ═══════════════════════════════════════════════════════════════════════
  // PERSISTENCE - Load/Save from localStorage
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    try {
      const savedAchievements = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      const savedStatistics = localStorage.getItem(STORAGE_KEYS.STATISTICS);
      
      if (savedAchievements) {
        const parsed = JSON.parse(savedAchievements);
        setAchievements(prev => ({ ...getDefaultAchievements(), ...parsed }));
      }
      
      if (savedStatistics) {
        const parsed = JSON.parse(savedStatistics);
        setStatistics(prev => ({ ...getDefaultStatistics(), ...parsed }));
      }
      
      setIsLoaded(true);
    } catch (e) {
      console.error('Failed to load achievements:', e);
      setIsLoaded(true);
    }
  }, []);
  
  // Save to localStorage when state changes
  useEffect(() => {
    if (!isLoaded) return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
      localStorage.setItem(STORAGE_KEYS.STATISTICS, JSON.stringify(statistics));
    } catch (e) {
      console.error('Failed to save achievements:', e);
    }
  }, [achievements, statistics, isLoaded]);
  
  // ═══════════════════════════════════════════════════════════════════════
  // UNLOCK ACHIEVEMENT
  // ═══════════════════════════════════════════════════════════════════════
  const unlockAchievement = useCallback((achievementId) => {
    const achievement = ACHIEVEMENTS[achievementId.toUpperCase()] || 
      Object.values(ACHIEVEMENTS).find(a => a.id === achievementId);
    
    if (!achievement) {
      console.warn(`Achievement not found: ${achievementId}`);
      return false;
    }
    
    const currentAchievements = achievementsRef.current;
    
    // Check if already unlocked
    if (currentAchievements.unlocked[achievement.id]) {
      return false;
    }
    
    // Check requirements
    if (achievement.requires && achievement.requires.length > 0) {
      const allRequirementsMet = achievement.requires.every(
        reqId => currentAchievements.unlocked[reqId]
      );
      if (!allRequirementsMet) {
        return false;
      }
    }
    
    // Unlock the achievement
    const newUnlocked = {
      ...currentAchievements.unlocked,
      [achievement.id]: {
        unlockedAt: Date.now(),
        points: achievement.points
      }
    };
    
    const newTotalPoints = currentAchievements.totalPoints + achievement.points;
    const newUnlockedCount = currentAchievements.unlockedCount + 1;
    
    setAchievements(prev => ({
      ...prev,
      unlocked: newUnlocked,
      totalPoints: newTotalPoints,
      unlockedCount: newUnlockedCount,
      lastUnlocked: achievement.id
    }));
    
    // Add notification
    const notification = {
      id: `${achievement.id}_${Date.now()}`,
      achievement,
      timestamp: Date.now()
    };
    
    setNotifications(prev => [...prev, notification]);
    
    console.log(`Achievement Unlocked: ${achievement.name}`);
    
    // Check for meta achievements
    setTimeout(() => checkMetaAchievements(newTotalPoints, newUnlockedCount), 100);
    
    return true;
  }, []);
  
  // ═══════════════════════════════════════════════════════════════════════
  // UPDATE STATISTICS
  // ═══════════════════════════════════════════════════════════════════════
  const updateStatistics = useCallback((updates) => {
    setStatistics(prev => {
      const newStats = { ...prev, ...updates, lastUpdated: Date.now() };
      return newStats;
    });
  }, []);
  
  // ═══════════════════════════════════════════════════════════════════════
  // RECORD GAME RESULT
  // ═══════════════════════════════════════════════════════════════════════
  const recordGameResult = useCallback((result, enemyId, moveCount = 0, piecesLost = 0) => {
    const currentStats = statisticsRef.current;
    const updates = { totalGames: currentStats.totalGames + 1 };
    
    // Update enemies played
    if (!currentStats.enemiesPlayed.includes(enemyId)) {
      updates.enemiesPlayed = [...currentStats.enemiesPlayed, enemyId];
    }
    
    if (result === 'player') {
      // WIN
      updates.totalWins = currentStats.totalWins + 1;
      updates.currentWinStreak = currentStats.currentWinStreak + 1;
      
      if (updates.currentWinStreak > currentStats.bestWinStreak) {
        updates.bestWinStreak = updates.currentWinStreak;
      }
      
      // Track enemy defeated
      if (!currentStats.enemiesDefeated.includes(enemyId)) {
        updates.enemiesDefeated = [...currentStats.enemiesDefeated, enemyId];
      }
      
      // Special win conditions
      if (piecesLost === 0) {
        updates.perfectWins = currentStats.perfectWins + 1;
      }
      if (moveCount > 0 && moveCount <= 20) {
        updates.quickWins = currentStats.quickWins + 1;
      }
      if (moveCount > 60) {
        updates.longGameWins = currentStats.longGameWins + 1;
      }
      
      updateStatistics(updates);
      
      // Check victory achievements - use computed values with proper fallbacks
      const newTotalWins = updates.totalWins !== undefined ? updates.totalWins : currentStats.totalWins + 1;
      const newWinStreak = updates.currentWinStreak !== undefined ? updates.currentWinStreak : currentStats.currentWinStreak + 1;
      
      setTimeout(() => {
        checkVictoryAchievements(newTotalWins, enemyId);
        checkStreakAchievements(newWinStreak);
        checkSpecialWinAchievements(piecesLost, moveCount);
        checkMasteryAchievements(updates);
      }, 100);
      
    } else if (result === 'enemy') {
      // LOSS
      updates.totalLosses = currentStats.totalLosses + 1;
      updates.currentWinStreak = 0;
      
      // Track enemy lost to
      if (!currentStats.enemiesLostTo.includes(enemyId)) {
        updates.enemiesLostTo = [...currentStats.enemiesLostTo, enemyId];
      }
      
      updateStatistics(updates);
      
      // Check defeat achievements
      setTimeout(() => {
        checkDefeatAchievements(updates.totalLosses || currentStats.totalLosses + 1, enemyId);
      }, 100);
      
    } else if (result === 'draw') {
      // DRAW
      updates.totalDraws = currentStats.totalDraws + 1;
      updates.currentWinStreak = 0;
      
      updateStatistics(updates);
      
      // Check draw achievements
      setTimeout(() => {
        checkDrawAchievements(updates.totalDraws || currentStats.totalDraws + 1, enemyId, false);
      }, 100);
      
    } else if (result === 'stalemate') {
      // STALEMATE
      updates.totalStalemates = currentStats.totalStalemates + 1;
      updates.totalDraws = currentStats.totalDraws + 1;
      updates.currentWinStreak = 0;
      
      updateStatistics(updates);
      
      // Check stalemate achievements
      setTimeout(() => {
        checkDrawAchievements(updates.totalDraws || currentStats.totalDraws + 1, enemyId, true);
      }, 100);
    }
    
    // Check all enemies played - must include current enemyId
    const allEnemies = ['elegant', 'nonelegant', 'minia0', 'alphazero'];
    const playedEnemies = updates.enemiesPlayed || currentStats.enemiesPlayed;
    // Ensure current enemy is included in the check
    const allPlayedEnemies = playedEnemies.includes(enemyId) ? playedEnemies : [...playedEnemies, enemyId];
    if (allEnemies.every(e => allPlayedEnemies.includes(e))) {
      setTimeout(() => unlockAchievement('enemy_collector'), 150);
    }
  }, [updateStatistics, unlockAchievement]);
  
  // ═══════════════════════════════════════════════════════════════════════
  // ACHIEVEMENT CHECKERS
  // ═══════════════════════════════════════════════════════════════════════
  const checkVictoryAchievements = useCallback((totalWins, enemyId) => {
    // Count-based achievements
    if (totalWins >= 1) unlockAchievement('first_blood');
    if (totalWins >= 5) unlockAchievement('warrior');
    if (totalWins >= 10) unlockAchievement('champion');
    if (totalWins >= 25) unlockAchievement('grandmaster');
    if (totalWins >= 50) unlockAchievement('legend');
    if (totalWins >= 100) unlockAchievement('immortal');
    
    // Enemy-specific achievements
    if (enemyId === 'elegant') unlockAchievement('elegant_slayer');
    if (enemyId === 'nonelegant') unlockAchievement('crusher_crusher');
    if (enemyId === 'minia0') unlockAchievement('alpha_tamer');
    if (enemyId === 'alphazero') unlockAchievement('neural_conqueror');
  }, [unlockAchievement]);
  
  const checkDefeatAchievements = useCallback((totalLosses, enemyId) => {
    // Count-based achievements
    if (totalLosses >= 1) unlockAchievement('learning_experience');
    if (totalLosses >= 10) unlockAchievement('persistent');
    if (totalLosses >= 25) unlockAchievement('never_give_up');
    
    // Enemy-specific achievements
    if (enemyId === 'elegant') unlockAchievement('crushed_by_elegant');
    if (enemyId === 'nonelegant') unlockAchievement('demolished_by_crusher');
    if (enemyId === 'minia0') unlockAchievement('outsmarted_by_mini');
    if (enemyId === 'alphazero') unlockAchievement('neural_dominated');
  }, [unlockAchievement]);
  
  const checkDrawAchievements = useCallback((totalDraws, enemyId, isStalemate) => {
    // Count-based achievements
    if (totalDraws >= 1) unlockAchievement('peaceful_resolution');
    if (totalDraws >= 5) unlockAchievement('diplomat');
    if (totalDraws >= 10) unlockAchievement('perpetual_dancer');
    
    // Stalemate achievement
    if (isStalemate) unlockAchievement('stalemate_artist');
    
    // AlphaZero draw
    if (enemyId === 'alphazero') unlockAchievement('neural_standoff');
  }, [unlockAchievement]);
  
  const checkStreakAchievements = useCallback((currentStreak) => {
    if (currentStreak >= 3) unlockAchievement('win_streak_3');
    if (currentStreak >= 5) unlockAchievement('win_streak_5');
    if (currentStreak >= 10) unlockAchievement('win_streak_10');
  }, [unlockAchievement]);
  
  const checkSpecialWinAchievements = useCallback((piecesLost, moveCount) => {
    if (piecesLost === 0) unlockAchievement('perfect_game');
    if (moveCount > 0 && moveCount <= 20) unlockAchievement('quick_mate');
    if (moveCount > 60) unlockAchievement('endgame_master');
  }, [unlockAchievement]);
  
  const checkMasteryAchievements = useCallback((stats) => {
    const currentStats = { ...statisticsRef.current, ...stats };
    const allEnemies = ['elegant', 'nonelegant', 'minia0', 'alphazero'];
    
    // Check if all enemies defeated
    if (allEnemies.every(e => currentStats.enemiesDefeated.includes(e))) {
      unlockAchievement('conqueror_of_all');
    }
  }, [unlockAchievement]);
  
  const checkMetaAchievements = useCallback((totalPoints, unlockedCount) => {
    const totalAchievements = Object.keys(ACHIEVEMENTS).length;
    
    // Point achievements
    if (totalPoints >= 100) unlockAchievement('point_collector_100');
    if (totalPoints >= 500) unlockAchievement('point_collector_500');
    if (totalPoints >= 1000) unlockAchievement('point_collector_1000');
    
    // Completion achievements
    if (unlockedCount >= Math.floor(totalAchievements / 2)) {
      unlockAchievement('completionist');
    }
    if (unlockedCount >= totalAchievements - 1) { // -1 because ultimate_master is last
      unlockAchievement('ultimate_master');
    }
  }, [unlockAchievement]);
  
  // ═══════════════════════════════════════════════════════════════════════
  // SPECIAL EVENT TRIGGERS
  // ═══════════════════════════════════════════════════════════════════════
  const onHiddenMasterUnlocked = useCallback(() => {
    updateStatistics({ hiddenMasterUnlocked: true });
    unlockAchievement('seal_breaker');
    unlockAchievement('rune_reader');
  }, [updateStatistics, unlockAchievement]);
  
  const onAlphazeroChallenged = useCallback(() => {
    updateStatistics({ alphazeroPlayed: true });
    unlockAchievement('alpha_awakener');
  }, [updateStatistics, unlockAchievement]);
  
  const onCrewmateFound = useCallback(() => {
    updateStatistics({ crewmateFound: true });
    unlockAchievement('crewmate_finder');
  }, [updateStatistics, unlockAchievement]);
  
  const onLaptopDropped = useCallback(() => {
    updateStatistics({ laptopDropped: true });
    unlockAchievement('laptop_shaker');
  }, [updateStatistics, unlockAchievement]);
  
  const onKeyboardUsed = useCallback(() => {
    updateStatistics({ keyboardUsed: true });
    unlockAchievement('keyboard_hacker');
    
    // Check for easter egg hunter
    const stats = statisticsRef.current;
    if (stats.crewmateFound && stats.laptopDropped && stats.hiddenMasterUnlocked) {
      unlockAchievement('easter_egg_hunter');
    }
  }, [updateStatistics, unlockAchievement]);
  
  // ═══════════════════════════════════════════════════════════════════════
  // NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════════════════
  const dismissNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);
  
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  
  // ═══════════════════════════════════════════════════════════════════════
  // GETTERS
  // ═══════════════════════════════════════════════════════════════════════
  const isAchievementUnlocked = useCallback((achievementId) => {
    return !!achievements.unlocked[achievementId];
  }, [achievements.unlocked]);
  
  const getAchievementProgress = useCallback((achievementId) => {
    const achievement = ACHIEVEMENTS[achievementId.toUpperCase()] || 
      Object.values(ACHIEVEMENTS).find(a => a.id === achievementId);
    
    if (!achievement || !achievement.progress) return null;
    
    const stats = statistics;
    let current = 0;
    
    switch (achievement.progress.type) {
      case 'wins':
        current = stats.totalWins;
        break;
      case 'losses':
        current = stats.totalLosses;
        break;
      case 'draws':
        current = stats.totalDraws;
        break;
      case 'stalemates':
        current = stats.totalStalemates;
        break;
      default:
        current = 0;
    }
    
    return {
      current: Math.min(current, achievement.progress.target),
      target: achievement.progress.target,
      percentage: Math.min(100, (current / achievement.progress.target) * 100)
    };
  }, [statistics]);
  
  const getAllAchievements = useCallback(() => {
    return Object.values(ACHIEVEMENTS).map(achievement => ({
      ...achievement,
      unlocked: !!achievements.unlocked[achievement.id],
      unlockedAt: achievements.unlocked[achievement.id]?.unlockedAt || null,
      progress: getAchievementProgress(achievement.id)
    }));
  }, [achievements.unlocked, getAchievementProgress]);
  
  const getAchievementsByCategory = useCallback((category) => {
    return getAllAchievements().filter(a => a.category === category);
  }, [getAllAchievements]);
  
  const getUnlockedAchievements = useCallback(() => {
    return getAllAchievements().filter(a => a.unlocked);
  }, [getAllAchievements]);
  
  const getLockedAchievements = useCallback(() => {
    return getAllAchievements().filter(a => !a.unlocked);
  }, [getAllAchievements]);
  
  const getSecretAchievements = useCallback(() => {
    return getAllAchievements().filter(a => a.isSecret);
  }, [getAllAchievements]);
  
  // ═══════════════════════════════════════════════════════════════════════
  // RESET (for testing/debugging)
  // ═══════════════════════════════════════════════════════════════════════
  const resetAllData = useCallback(() => {
    setAchievements(getDefaultAchievements());
    setStatistics(getDefaultStatistics());
    setNotifications([]);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.STATISTICS);
  }, []);
  
  return {
    // State
    achievements,
    statistics,
    notifications,
    isLoaded,
    
    // Achievement getters
    getAllAchievements,
    getAchievementsByCategory,
    getUnlockedAchievements,
    getLockedAchievements,
    getSecretAchievements,
    isAchievementUnlocked,
    getAchievementProgress,
    
    // Actions
    unlockAchievement,
    recordGameResult,
    
    // Special events
    onHiddenMasterUnlocked,
    onAlphazeroChallenged,
    onCrewmateFound,
    onLaptopDropped,
    onKeyboardUsed,
    
    // Notifications
    dismissNotification,
    clearAllNotifications,
    
    // Debug
    resetAllData
  };
};

export default useAchievements;
