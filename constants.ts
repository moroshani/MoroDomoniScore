import { GameModeDetails, GameModeType } from './types';

export const GAME_MODES: GameModeDetails[] = [
  {
    type: GameModeType.TwoPlayers,
    title: '۲ بازیکن',
    description: '۱ به ۱ - تا ۱۰۱ امتیاز',
    teams: 2,
    playersPerTeam: 1,
    pointCap: 101,
  },
  {
    type: GameModeType.ThreePlayers,
    title: '۳ بازیکن',
    description: '۱ به ۱ به ۱ - تا ۱۵۱ امتیاز',
    teams: 3,
    playersPerTeam: 1,
    pointCap: 151,
  },
  {
    type: GameModeType.FourPlayers,
    title: '۴ بازیکن',
    description: '۲ به ۲ - تا ۱۵۱ امتیاز',
    teams: 2,
    playersPerTeam: 2,
    pointCap: 151,
  },
];

export const DEFAULT_GAMES_PER_SET = 3;
export const DEFAULT_SETS_PER_NIGHT = 1;
