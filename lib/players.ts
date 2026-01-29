import type { Player } from '../types';

const getPlayersKey = (userId: string) => `dominoScorekeeperPlayers_${userId}`;

export const getPlayers = (userId: string): Player[] => {
  if (!userId) return [];
  try {
    const playersJson = localStorage.getItem(getPlayersKey(userId));
    const players = playersJson ? JSON.parse(playersJson) : [];
    return players.sort((a: Player, b: Player) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Failed to parse players from localStorage", error);
    return [];
  }
};

export const savePlayers = (userId: string, players: Player[]): void => {
  if (!userId) return;
  try {
    const playersJson = JSON.stringify(players);
    localStorage.setItem(getPlayersKey(userId), playersJson);
  } catch (error) {
    console.error("Failed to save players to localStorage", error);
  }
};

export const updatePlayer = (userId: string, updatedPlayer: Player): void => {
  if (!userId) return;
  const players = getPlayers(userId);
  const playerIndex = players.findIndex(p => p.id === updatedPlayer.id);
  if (playerIndex > -1) {
    players[playerIndex] = updatedPlayer;
    savePlayers(userId, players);
  }
};

export const deletePlayer = (userId: string, playerId: string): void => {
  if (!userId) return;
  let players = getPlayers(userId);
  players = players.filter(p => p.id !== playerId);
  savePlayers(userId, players);
};

export const clearPlayers = (userId: string): void => {
  if (!userId) return;
  localStorage.removeItem(getPlayersKey(userId));
};
