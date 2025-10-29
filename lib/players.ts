import type { Player } from '../types';

const PLAYERS_KEY = 'dominoScorekeeperPlayers';

export const getPlayers = (): Player[] => {
  try {
    const playersJson = localStorage.getItem(PLAYERS_KEY);
    const players = playersJson ? JSON.parse(playersJson) : [];
    return players.sort((a: Player, b: Player) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Failed to parse players from localStorage", error);
    return [];
  }
};

export const savePlayers = (players: Player[]): void => {
  try {
    const playersJson = JSON.stringify(players);
    localStorage.setItem(PLAYERS_KEY, playersJson);
  } catch (error) {
    console.error("Failed to save players to localStorage", error);
  }
};

export const updatePlayer = (updatedPlayer: Player): void => {
  const players = getPlayers();
  const playerIndex = players.findIndex(p => p.id === updatedPlayer.id);
  if (playerIndex > -1) {
    players[playerIndex] = updatedPlayer;
    savePlayers(players);
  }
};

export const deletePlayer = (playerId: string): void => {
  let players = getPlayers();
  players = players.filter(p => p.id !== playerId);
  savePlayers(players);
};