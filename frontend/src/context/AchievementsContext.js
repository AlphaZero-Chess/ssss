import React, { createContext, useContext } from 'react';
import { useAchievements } from '../hooks/useAchievements';

/**
 * ACHIEVEMENTS CONTEXT - Provider Component
 * 
 * Provides achievement state and actions to the entire app
 * Uses the useAchievements hook internally
 * 
 * BACKWARD COMPATIBLE - Can be removed without affecting other components
 * Just wrap your App component with AchievementsProvider to enable
 */

const AchievementsContext = createContext(null);

export const AchievementsProvider = ({ children }) => {
  const achievementsSystem = useAchievements();
  
  return (
    <AchievementsContext.Provider value={achievementsSystem}>
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievementsContext = () => {
  const context = useContext(AchievementsContext);
  if (!context) {
    // Return a no-op object if used outside provider (backward compatibility)
    return {
      achievements: { unlocked: {}, progress: {}, totalPoints: 0, unlockedCount: 0, lastUnlocked: null },
      statistics: { totalWins: 0, totalLosses: 0, totalDraws: 0, totalGames: 0 },
      notifications: [],
      isLoaded: false,
      getAllAchievements: () => [],
      getAchievementsByCategory: () => [],
      getUnlockedAchievements: () => [],
      getLockedAchievements: () => [],
      getSecretAchievements: () => [],
      isAchievementUnlocked: () => false,
      getAchievementProgress: () => null,
      unlockAchievement: () => false,
      recordGameResult: () => {},
      onHiddenMasterUnlocked: () => {},
      onAlphazeroChallenged: () => {},
      onCrewmateFound: () => {},
      onLaptopDropped: () => {},
      onKeyboardUsed: () => {},
      dismissNotification: () => {},
      clearAllNotifications: () => {},
      resetAllData: () => {}
    };
  }
  return context;
};

export default AchievementsContext;
