// FIX: Removed self-import of `GameModeDetails` which was causing a name conflict.
export enum GameScreen {
  ModeSelection,
  NameSetup,
  Scoring,
  History,
  Stats,
}

export enum GameModeType {
  TwoPlayers = '2P',
  ThreePlayers = '3P',
  FourPlayers = '4P',
}

export interface GameModeDetails {
  type: GameModeType;
  title: string;
  description: string;
  teams: number;
  playersPerTeam: number;
  pointCap: number;
}

export interface Player {
  id: string; // Using name as ID for simplicity
  name: string;
  avatar?: string; // e.g., an emoji
}

export interface Team {
  id: number;
  name: string;
  players: Player[];
  currentGameScore: number;
  gamesWon: number; // Games won in the current set
  setsWon: number;
}

// For historical records
export interface GameRecord {
  gameNumber: number;
  teams: { id: number, name: string, score: number, players: Player[] }[];
  winnerTeamId: number;
}

export interface SetRecord {
    setNumber: number;
    games: GameRecord[];
    winnerTeamId?: number;
}

export interface NightRecord {
  id: string; // Unique ID, e.g., timestamp
  date: string;
  mode: GameModeDetails;
  sets: SetRecord[];
  nightWinnerTeamId?: number;
}

export interface PlayerStats {
  name: string;
  avatar?: string;
  gamesPlayed: number;
  gamesWon: number;
  winRate: string;
  totalPoints: number;
  avgPointsPerGame: string;
  setWins: number;
  nightWins: number;
}

export interface HeadToHeadStats {
    player1Name: string;
    player2Name: string;
    gamesPlayedTogether: number;
    player1Wins: number;
    player2Wins: number;
    ties: number;
}

export interface WinState {
    winner: Team;
    level: 'game' | 'set' | 'night';
    finalScore?: number;
}