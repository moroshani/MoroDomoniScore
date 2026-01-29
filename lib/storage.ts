import type { NightRecord } from '../types';
import { clearPlayers } from './players';

const getHistoryKey = (userId: string) => `dominoScorekeeperHistory_${userId}`;

export const getHistory = (userId: string): NightRecord[] => {
  if (!userId) return [];
  try {
    const historyJson = localStorage.getItem(getHistoryKey(userId));
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error("Failed to parse history from localStorage", error);
    return [];
  }
};

export const saveHistory = (userId: string, history: NightRecord[]): void => {
  if (!userId) return;
  try {
    const historyJson = JSON.stringify(history);
    localStorage.setItem(getHistoryKey(userId), historyJson);
  } catch (error)
 {
    console.error("Failed to save history to localStorage", error);
  }
};

export const clearHistory = (userId: string): void => {
    if (!userId) return;
    try {
        localStorage.removeItem(getHistoryKey(userId));
    } catch (error) {
        console.error("Failed to clear history from localStorage", error);
    }
};

export const deleteUserData = (userId: string): void => {
    if (!userId) return;
    clearHistory(userId);
    clearPlayers(userId);
};
