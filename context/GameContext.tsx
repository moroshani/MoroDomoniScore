import React, { createContext, useState, useEffect, useContext } from 'react';
import { GameScreen } from '../types';
import type { GameModeDetails, Team, Player, NightRecord, GameRecord, WinState, RoundHistoryItem, AuditLogEntry } from '../types';
import { DEFAULT_GAMES_PER_SET, DEFAULT_SETS_PER_NIGHT } from '../constants';
import { useAuth } from './AuthContext';

interface IGameContext {
  gameScreen: GameScreen;
  setGameScreen: (screen: GameScreen) => void;
  gameMode: GameModeDetails | null;
  teams: Team[];
  currentGameNumber: number;
  currentSetNumber: number;
  winState: WinState | null;
  currentNight: NightRecord | null;
  pointCap: number;
  gamesPerSet: number;
  setsPerNight: number;
  canUndo: boolean;
  tieBreakerMessage: string;
  theme: string;
  toggleTheme: () => void;
  handleModeSelect: (mode: GameModeDetails) => void;
  handleNameSubmit: (playersByTeam: Player[][], teamNames: string[], customPointCap: number, customGamesPerSet: number, customSetsPerNight: number) => void;
  handleAddRound: (scores: number[]) => void;
  handleEndSet: () => void;
  handleUndoRound: () => void;
  startEditLastRound: () => number[] | null;
  handleAdvanceToNextStage: () => void;
  resetToModeSelection: () => void;
  isNightRecapVisible: boolean;
  nightRecapContent: string;
  isNightRecapLoading: boolean;
  closeRecapAndReset: () => void;
  roundHistory: RoundHistoryItem[];
  auditLog: AuditLogEntry[];
  editingRoundNumber: number | null;
}

const GameContext = createContext<IGameContext | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const progressKey = user?.id ? `domino-progress-${user.id}` : null;
  const [gameScreen, setGameScreen] = useState<GameScreen>(GameScreen.ModeSelection);
  const [gameMode, setGameMode] = useState<GameModeDetails | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentGameNumber, setCurrentGameNumber] = useState(1);
  const [currentSetNumber, setCurrentSetNumber] = useState(1);
  const [winState, setWinState] = useState<WinState | null>(null);
  const [currentNight, setCurrentNight] = useState<NightRecord | null>(null);

  const [pointCap, setPointCap] = useState(101);
  const [gamesPerSet, setGamesPerSet] = useState(DEFAULT_GAMES_PER_SET);
  const [setsPerNight, setSetsPerNight] = useState(DEFAULT_SETS_PER_NIGHT);

  const [lastRoundState, setLastRoundState] = useState<{
    teams: Team[];
    night: NightRecord | null;
    roundHistory: RoundHistoryItem[];
    roundCounter: number;
    lastRoundScores: number[];
  } | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [tieBreakerMessage, setTieBreakerMessage] = useState('');
  const [roundCounter, setRoundCounter] = useState(1);
  const [roundHistory, setRoundHistory] = useState<RoundHistoryItem[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [editingRoundNumber, setEditingRoundNumber] = useState<number | null>(null);

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return storedTheme || (prefersDark ? 'dark' : 'light');
    }
    return 'light';
  });

  const [isNightRecapVisible, setIsNightRecapVisible] = useState(false);
  const [nightRecapContent, setNightRecapContent] = useState('');
  const [isNightRecapLoading, setIsNightRecapLoading] = useState(false);

  const buildNightRecap = (nightRecord: NightRecord, nightWinner: Team) => {
    const totalGames = nightRecord.sets.reduce((acc, set) => acc + set.games.length, 0);
    const totalRounds = roundHistory.length;
    return [
      `برنده بزرگ امشب: ${nightWinner.name}`,
      `تعداد ست‌ها: ${nightRecord.sets.length}`,
      `تعداد بازی‌ها: ${totalGames}`,
      `تعداد دورها: ${totalRounds}`,
      'خسته نباشید؛ یک شب رقابتی و جذاب ثبت شد.'
    ].join('\n');
  };

  const clearSavedProgress = () => {
    if (typeof window === 'undefined' || !progressKey) return;
    localStorage.removeItem(progressKey);
  };

  const restoreProgress = () => {
    if (typeof window === 'undefined' || !progressKey) return false;
    const raw = localStorage.getItem(progressKey);
    if (!raw) return false;
    try {
      const saved = JSON.parse(raw);
      if (!saved || saved.gameScreen !== GameScreen.Scoring) return false;
      const shouldRestore = window.confirm('یک بازی ناتمام پیدا شد. ادامه می‌دهید؟');
      if (!shouldRestore) {
        clearSavedProgress();
        return false;
      }
      setGameMode(saved.gameMode);
      setTeams(saved.teams || []);
      setCurrentGameNumber(saved.currentGameNumber || 1);
      setCurrentSetNumber(saved.currentSetNumber || 1);
      setPointCap(saved.pointCap || 101);
      setGamesPerSet(saved.gamesPerSet || DEFAULT_GAMES_PER_SET);
      setSetsPerNight(saved.setsPerNight || DEFAULT_SETS_PER_NIGHT);
      setRoundCounter(saved.roundCounter || 1);
      setRoundHistory(saved.roundHistory || []);
      setAuditLog(saved.auditLog || []);
      setCurrentNight(saved.currentNight || null);
      setTieBreakerMessage(saved.tieBreakerMessage || '');
      setEditingRoundNumber(null);
      setCanUndo(false);
      setLastRoundState(null);
      setWinState(null);
      setIsNightRecapVisible(false);
      setGameScreen(GameScreen.Scoring);
      return true;
    } catch (_error) {
      clearSavedProgress();
      return false;
    }
  };

  useEffect(() => {
    if (!user) {
      resetToModeSelection();
      return;
    }
    const restored = restoreProgress();
    if (!restored) {
      resetToModeSelection();
    }
  }, [user]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const createAuditEntry = (action: AuditLogEntry['action'], roundNumber?: number, details?: string): AuditLogEntry => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    action,
    roundNumber,
    actor: user?.name || 'ناشناس',
    createdAt: new Date().toISOString(),
    details
  });

  const handleModeSelect = (mode: GameModeDetails) => {
    setGameMode(mode);
    setGameScreen(GameScreen.NameSetup);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !progressKey || !user) return;
    if (gameScreen !== GameScreen.Scoring) {
      clearSavedProgress();
      return;
    }
    const payload = {
      gameScreen,
      gameMode,
      teams,
      currentGameNumber,
      currentSetNumber,
      pointCap,
      gamesPerSet,
      setsPerNight,
      roundCounter,
      roundHistory,
      auditLog,
      currentNight,
      tieBreakerMessage,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(progressKey, JSON.stringify(payload));
  }, [
    user,
    progressKey,
    gameScreen,
    gameMode,
    teams,
    currentGameNumber,
    currentSetNumber,
    pointCap,
    gamesPerSet,
    setsPerNight,
    roundCounter,
    roundHistory,
    auditLog,
    currentNight,
    tieBreakerMessage
  ]);

  const handleNameSubmit = (playersByTeam: Player[][], teamNames: string[], customPointCap: number, customGamesPerSet: number, customSetsPerNight: number) => {
    const newTeams: Team[] = playersByTeam.map((players, teamIndex) => ({
      id: teamIndex,
      name: teamNames[teamIndex] || players.map((p) => p.name).join(' و '),
      players,
      currentGameScore: 0,
      gamesWon: 0,
      setsWon: 0
    }));

    setTeams(newTeams);
    setPointCap(customPointCap);
    setGamesPerSet(customGamesPerSet);
    setSetsPerNight(customSetsPerNight);
    setRoundCounter(1);
    setRoundHistory([]);
    setAuditLog([]);
    setEditingRoundNumber(null);
    setCanUndo(false);
    setLastRoundState(null);
    setTieBreakerMessage('');

    if (gameMode) {
      const night: NightRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        mode: gameMode,
        sets: [{ setNumber: 1, games: [] }]
      };
      setCurrentNight(night);
    }
    setGameScreen(GameScreen.Scoring);
  };

  const upsertCurrentGame = (night: NightRecord, nextTeams: Team[]): NightRecord => {
    const currentSet = night.sets.find((set) => set.setNumber === currentSetNumber);
    const currentGame: GameRecord = {
      gameNumber: currentGameNumber,
      teams: nextTeams.map((team) => ({
        id: team.id,
        name: team.name,
        score: team.currentGameScore,
        players: team.players
      })),
      winnerTeamId: nextTeams.reduce((best, team) => team.currentGameScore > (best?.currentGameScore ?? -1) ? team : best, nextTeams[0]).id
    };

    const updatedSets = night.sets.map((set) => {
      if (set.setNumber !== currentSetNumber) return set;
      const otherGames = (currentSet?.games || []).filter((game) => game.gameNumber !== currentGameNumber);
      return {
        ...set,
        games: [...otherGames, currentGame].sort((a, b) => a.gameNumber - b.gameNumber)
      };
    });

    return { ...night, sets: updatedSets };
  };

  const getWinningTeams = (currentTeams: Team[], scoreCap: number) => {
    const maxScore = Math.max(...currentTeams.map((team) => team.currentGameScore));
    if (maxScore < scoreCap) return [];
    return currentTeams.filter((team) => team.currentGameScore === maxScore);
  };

  const handleAddRound = (scores: number[]) => {
    if (!currentNight) return;
    const previousTeams = teams.map((team) => ({ ...team, players: [...team.players] }));
    const previousNight = currentNight ? JSON.parse(JSON.stringify(currentNight)) as NightRecord : null;
    const previousRounds = [...roundHistory];

    const nextTeams = teams.map((team, index) => ({
      ...team,
      currentGameScore: team.currentGameScore + (scores[index] || 0)
    }));

    const roundEntry: RoundHistoryItem = {
      id: `${Date.now()}-${roundCounter}`,
      roundNumber: roundCounter,
      type: 'standard',
      scores: nextTeams.map((team, index) => ({
        teamId: team.id,
        teamName: team.name,
        score: scores[index] || 0
      })).filter((item) => item.score > 0),
      createdAt: new Date().toISOString()
    };

    const updatedNight = upsertCurrentGame(currentNight, nextTeams);
    setTeams(nextTeams);
    setCurrentNight(updatedNight);
    setRoundHistory((prev) => [...prev, roundEntry]);
    setAuditLog((prev) => [...prev, createAuditEntry(editingRoundNumber ? 'round_edited' : 'round_added', roundCounter)]);
    setLastRoundState({
      teams: previousTeams,
      night: previousNight,
      roundHistory: previousRounds,
      roundCounter,
      lastRoundScores: scores
    });
    setCanUndo(true);
    setTieBreakerMessage('');
    setEditingRoundNumber(null);

    const gameWinners = getWinningTeams(nextTeams, pointCap);
    if (gameWinners.length !== 1) {
      if (gameWinners.length > 1) {
        setTieBreakerMessage('بازی در وضعیت برابر است؛ تا تعیین برنده ادامه دهید.');
      }
      setRoundCounter((prev) => prev + 1);
      return;
    }

    const gameWinner = gameWinners[0];
    const teamsAfterGameWin = nextTeams.map((team) => ({
      ...team,
      gamesWon: team.gamesWon + (team.id === gameWinner.id ? 1 : 0)
    }));
    setTeams(teamsAfterGameWin);

    const setWinnerCandidates = teamsAfterGameWin.filter((team) => team.gamesWon >= gamesPerSet);
    if (setWinnerCandidates.length !== 1) {
      setWinState({ winner: gameWinner, level: 'game', finalScore: gameWinner.currentGameScore });
      setRoundCounter((prev) => prev + 1);
      return;
    }

    const setWinner = setWinnerCandidates[0];
    const teamsAfterSetWin = teamsAfterGameWin.map((team) => ({
      ...team,
      setsWon: team.setsWon + (team.id === setWinner.id ? 1 : 0)
    }));

    if (currentNight) {
      const updatedSets = currentNight.sets.map((set) => (
        set.setNumber === currentSetNumber ? { ...set, winnerTeamId: setWinner.id } : set
      ));
      setCurrentNight({ ...currentNight, sets: updatedSets, nightWinnerTeamId: undefined });
    }

    const nightWinners = teamsAfterSetWin.filter((team) => team.setsWon >= setsPerNight);
    if (nightWinners.length === 1) {
      const nightWinner = nightWinners[0];
      setTeams(teamsAfterSetWin);
      setWinState({ winner: nightWinner, level: 'night' });
    } else {
      setTeams(teamsAfterSetWin);
      setWinState({ winner: setWinner, level: 'set' });
    }

    setRoundCounter((prev) => prev + 1);
  };

  const handleEndSet = () => {
    const currentSetGames = currentNight?.sets.find((set) => set.setNumber === currentSetNumber)?.games || [];
    if (!currentNight || currentSetGames.length === 0) return;

    const maxWins = Math.max(...teams.map((team) => team.gamesWon));
    const setWinners = teams.filter((team) => team.gamesWon === maxWins && maxWins > 0);
    if (setWinners.length !== 1) {
      setTieBreakerMessage('برای پایان ست باید یک برنده مشخص وجود داشته باشد.');
      return;
    }

    const setWinner = setWinners[0];
    const teamsAfterSetWin = teams.map((team) => ({
      ...team,
      setsWon: team.setsWon + (team.id === setWinner.id ? 1 : 0)
    }));

    const updatedNight = {
      ...currentNight,
      sets: currentNight.sets.map((set) => (
        set.setNumber === currentSetNumber ? { ...set, winnerTeamId: setWinner.id } : set
      ))
    };
    setCurrentNight(updatedNight);

    const nightWinners = teamsAfterSetWin.filter((team) => team.setsWon >= setsPerNight);
    if (nightWinners.length === 1) {
      const nightWinner = nightWinners[0];
      setTeams(teamsAfterSetWin);
      setWinState({ winner: nightWinner, level: 'night' });
    } else {
      setTeams(teamsAfterSetWin);
      setWinState({ winner: setWinner, level: 'set' });
    }
  };

  const handleUndoRound = () => {
    if (!lastRoundState) return;
    setTeams(lastRoundState.teams);
    setCurrentNight(lastRoundState.night);
    setRoundHistory(lastRoundState.roundHistory);
    setRoundCounter(lastRoundState.roundCounter);
    setWinState(null);
    setCanUndo(false);
    setLastRoundState(null);
    setEditingRoundNumber(null);
    setTieBreakerMessage('');
    setAuditLog((prev) => [...prev, createAuditEntry('round_undone', lastRoundState.roundCounter)]);
  };

  const startEditLastRound = () => {
    if (!lastRoundState) return null;
    setTeams(lastRoundState.teams);
    setCurrentNight(lastRoundState.night);
    setRoundHistory(lastRoundState.roundHistory);
    setRoundCounter(lastRoundState.roundCounter);
    setWinState(null);
    setCanUndo(false);
    setLastRoundState(null);
    setEditingRoundNumber(lastRoundState.roundCounter);
    setTieBreakerMessage('');
    return lastRoundState.lastRoundScores;
  };

  const handleNightEnd = async (nightRecord: NightRecord, nightWinner: Team) => {
    if (!user) return;
    const finalNightRecord = { ...nightRecord, nightWinnerTeamId: nightWinner.id, rounds: roundHistory, auditLog };
    setCurrentNight(finalNightRecord);
    setIsNightRecapVisible(true);
    setIsNightRecapLoading(true);
    setNightRecapContent(buildNightRecap(finalNightRecord, nightWinner));
    setIsNightRecapLoading(false);
  };

  const handleAdvanceToNextStage = () => {
    if (!winState) return;
    if (winState.level === 'game') {
      setCurrentGameNumber((prev) => prev + 1);
      setTeams(teams.map((team) => ({ ...team, currentGameScore: 0 })));
      setRoundHistory([]);
      setRoundCounter(1);
      setAuditLog([]);
    } else if (winState.level === 'set') {
      setCurrentSetNumber((prev) => prev + 1);
      setCurrentGameNumber(1);
      setTeams(teams.map((team) => ({ ...team, currentGameScore: 0, gamesWon: 0 })));
      setRoundHistory([]);
      setRoundCounter(1);
      setAuditLog([]);
      if (currentNight) {
        const updatedNight = { ...currentNight, sets: [...currentNight.sets, { setNumber: currentSetNumber + 1, games: [] }] };
        setCurrentNight(updatedNight);
      }
    } else if (winState.level === 'night' && currentNight) {
      void handleNightEnd(currentNight, winState.winner);
    }
    setWinState(null);
    setCanUndo(false);
    setLastRoundState(null);
    setTieBreakerMessage('');
    setEditingRoundNumber(null);
  };

  const resetToModeSelection = () => {
    setGameScreen(GameScreen.ModeSelection);
    setGameMode(null);
    setTeams([]);
    setCurrentGameNumber(1);
    setCurrentSetNumber(1);
    setWinState(null);
    setCurrentNight(null);
    setPointCap(101);
    setGamesPerSet(DEFAULT_GAMES_PER_SET);
    setSetsPerNight(DEFAULT_SETS_PER_NIGHT);
    setLastRoundState(null);
    setCanUndo(false);
    setTieBreakerMessage('');
    setRoundCounter(1);
    setRoundHistory([]);
    setAuditLog([]);
    setEditingRoundNumber(null);
    setIsNightRecapVisible(false);
    setNightRecapContent('');
    setIsNightRecapLoading(false);
    clearSavedProgress();
  };

  const closeRecapAndReset = () => {
    setIsNightRecapVisible(false);
    setNightRecapContent('');
    setIsNightRecapLoading(false);
    resetToModeSelection();
  };

  return (
    <GameContext.Provider
      value={{
        gameScreen,
        setGameScreen,
        gameMode,
        teams,
        currentGameNumber,
        currentSetNumber,
        winState,
        currentNight,
        pointCap,
        gamesPerSet,
        setsPerNight,
        canUndo,
        tieBreakerMessage,
        theme,
        toggleTheme,
        handleModeSelect,
        handleNameSubmit,
        handleAddRound,
        handleEndSet,
        handleUndoRound,
        startEditLastRound,
        handleAdvanceToNextStage,
        resetToModeSelection,
        isNightRecapVisible,
        nightRecapContent,
        isNightRecapLoading,
        closeRecapAndReset,
        roundHistory,
        auditLog,
        editingRoundNumber
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
