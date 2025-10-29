import type { NightRecord } from '../types';

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
