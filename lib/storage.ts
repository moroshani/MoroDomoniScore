import type { NightRecord } from '../types';
// FIX: Import savePlayers to clear player data, resolving a dependency for deleteProfileData.
import { savePlayers } from './players';

const HISTORY_KEY = 'dominoScorekeeperHistory';

export const getHistory = (): NightRecord[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error("Failed to parse history from localStorage", error);
    return [];
  }
};

export const saveHistory = (history: NightRecord[]): void => {
  try {
    const historyJson = JSON.stringify(history);
    localStorage.setItem(HISTORY_KEY, historyJson);
  } catch (error) {
    console.error("Failed to save history to localStorage", error);
  }
};

export const clearHistory = (): void => {
    try {
        localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
        console.error("Failed to clear history from localStorage", error);
    }
};

// FIX: Added missing deleteProfileData function to resolve import error in AuthContext.
/**
 * Deletes all game and player data from localStorage.
 * NOTE: The current storage implementation is global, not per-profile.
 * This function clears all data regardless of the profileId provided.
 * @param _profileId - Included for future compatibility but currently unused.
 */
export const deleteProfileData = (_profileId: string): void => {
    clearHistory();
    savePlayers([]); // Clears all players by saving an empty array.
};
