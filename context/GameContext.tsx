import React, { createContext, useState, useEffect, useContext } from 'react';
import { GameScreen } from '../types';
import type { GameModeDetails, Team, Player, NightRecord, GameRecord, SetRecord, WinState } from '../types';
import { DEFAULT_GAMES_PER_SET, DEFAULT_SETS_PER_NIGHT } from '../constants';
import { saveHistory, getHistory } from '../lib/storage';
import { GoogleGenAI } from '@google/genai';

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
    handleNameSubmit: (playersByTeam: Player[][], customPointCap: number, customGamesPerSet: number, customSetsPerNight: number) => void;
    handleAddRound: (scores: number[]) => void;
    handleEndSet: () => void;
    handleUndoRound: () => void;
    handleAdvanceToNextStage: () => void;
    resetToModeSelection: () => void;
    isNightRecapVisible: boolean;
    nightRecapAIContent: string;
    isNightRecapLoading: boolean;
    closeRecapAndReset: () => void;
    roundHistory: { teamName: string, score: number }[];
}

const GameContext = createContext<IGameContext | undefined>(undefined);

export const GameProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
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

    const [lastRoundState, setLastRoundState] = useState<{ teams: Team[], night: NightRecord | null, roundHistory: any[] } | null>(null);
    const [canUndo, setCanUndo] = useState(false);
    const [tieBreakerMessage, setTieBreakerMessage] = useState('');
    const [roundHistory, setRoundHistory] = useState<{ teamName: string, score: number }[]>([]);

    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return storedTheme || (prefersDark ? 'dark' : 'light');
        }
        return 'light';
    });
    
    const [isNightRecapVisible, setIsNightRecapVisible] = useState(false);
    const [nightRecapAIContent, setNightRecapAIContent] = useState('');
    const [isNightRecapLoading, setIsNightRecapLoading] = useState(false);

    useEffect(() => {
        if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        } else {
        document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const handleModeSelect = (mode: GameModeDetails) => {
        setGameMode(mode);
        setGameScreen(GameScreen.NameSetup);
    };

    const handleNameSubmit = (playersByTeam: Player[][], customPointCap: number, customGamesPerSet: number, customSetsPerNight: number) => {
        const newTeams: Team[] = playersByTeam.map((players, teamIndex) => ({
        id: teamIndex,
        name: players.map(p => p.name).join(' و '),
        players,
        currentGameScore: 0,
        gamesWon: 0,
        setsWon: 0,
        }));

        setTeams(newTeams);
        setPointCap(customPointCap);
        setGamesPerSet(customGamesPerSet);
        setSetsPerNight(customSetsPerNight);
        
        if(gameMode) {
        const night: NightRecord = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            mode: gameMode,
            sets: [{ setNumber: 1, games: [] }],
        };
        setCurrentNight(night);
        }
        setGameScreen(GameScreen.Scoring);
    };

    const handleAddRound = (scores: number[]) => {
        setLastRoundState({ teams: JSON.parse(JSON.stringify(teams)), night: JSON.parse(JSON.stringify(currentNight)), roundHistory: [...roundHistory] });
        setCanUndo(true);
        setTieBreakerMessage('');

        const newHistory = scores.map((score, index) => ({ teamName: teams[index].name, score })).filter(item => item.score > 0);
        setRoundHistory(prev => [...prev, ...newHistory]);

        const teamsWithNewScores = teams.map((team, index) => ({
        ...team,
        currentGameScore: team.currentGameScore + scores[index],
        }));
        setTeams(teamsWithNewScores);

        const potentialWinners = teamsWithNewScores.filter(t => t.currentGameScore >= pointCap);
        if (potentialWinners.length > 0) {
            const gameWinner = potentialWinners.reduce((max, current) => current.currentGameScore > max.currentGameScore ? current : max);
            processGameWin(gameWinner, teamsWithNewScores);
        }
    };
    
    const processGameWin = (gameWinner: Team, finalTeamsState: Team[]) => {
        if (!currentNight) return;
    
        const gameRecord: GameRecord = {
            gameNumber: currentGameNumber,
            teams: finalTeamsState.map(t => ({ id: t.id, name: t.name, score: t.currentGameScore, players: t.players })),
            winnerTeamId: gameWinner.id,
        };
    
        const teamsAfterGameWin = finalTeamsState.map(t =>
            t.id === gameWinner.id ? { ...t, gamesWon: t.gamesWon + 1 } : t
        );
        setTeams(teamsAfterGameWin);
    
        const updatedNight: NightRecord = {
            ...currentNight,
            sets: currentNight.sets.map(s => {
                if (s.setNumber === currentSetNumber) {
                    // Create a new games array to ensure immutability
                    const newGames = [...s.games, gameRecord];
                    return { ...s, games: newGames };
                }
                return s;
            })
        };
        setCurrentNight(updatedNight);
    
        setWinState({ 
            winner: gameWinner, 
            level: 'game', 
            finalScore: gameWinner.currentGameScore 
        });
    };

    const handleEndSet = () => {
        const maxGamesWon = Math.max(...teams.map(t => t.gamesWon));
        const setWinners = teams.filter(t => t.gamesWon === maxGamesWon);

        if (setWinners.length > 1) {
            setTieBreakerMessage('نتیجه ست مساوی است! برای مشخص شدن برنده، یک بازی دیگر انجام دهید.');
            return;
        }
        setTieBreakerMessage('');

        const setWinner = setWinners[0];
        if (currentNight) {
            const updatedNight = {
                ...currentNight,
                sets: currentNight.sets.map(s => s.setNumber === currentSetNumber ? { ...s, winnerTeamId: setWinner.id } : s)
            };
            setCurrentNight(updatedNight);
        }

        const teamsAfterSetWin = teams.map(t => 
            t.id === setWinner.id ? { ...t, setsWon: t.setsWon + 1} : t
        );
        
        if (currentSetNumber >= setsPerNight) {
            const maxSetsWon = Math.max(...teamsAfterSetWin.map(t => t.setsWon));
            const nightWinners = teamsAfterSetWin.filter(t => t.setsWon === maxSetsWon);

            if (nightWinners.length > 1) {
                setTieBreakerMessage('نتیجه کلی مساوی است! برای مشخص شدن قهرمان امشب، یک ست دیگر بازی کنید.');
                setSetsPerNight(prev => prev + 1);
                setTeams(teamsAfterSetWin);
                setWinState({ winner: setWinner, level: 'set' });
                return;
            }
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
        setWinState(null);
        setCanUndo(false);
        setLastRoundState(null);
    };

    const handleNightEnd = async (nightRecord: NightRecord, nightWinner: Team) => {
        const finalNightRecord = { ...nightRecord, nightWinnerTeamId: nightWinner.id };
        const history = getHistory();
        saveHistory([...history, finalNightRecord]);
        setCurrentNight(finalNightRecord);

        // Show recap modal and fetch AI summary
        setIsNightRecapVisible(true);
        setIsNightRecapLoading(true);
        const prompt = `
            You are 'Domino Dan', a witty and enthusiastic sports commentator for domino games. Your tone should be fun, slightly dramatic, and celebratory. Your entire response must be in Persian.
            A domino night just finished. The grand winner is ${nightWinner.name}.
            Analyze the night and provide a short, fun recap (under 80 words). Mention the winner and give a humorous, positive summary of the night's battle.
            Format the output as a single string with newlines for paragraphs.
        `;
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setNightRecapAIContent(response.text);
        } catch (error) {
            console.error("Error generating recap:", error);
            setNightRecapAIContent("دومینو دان در حال استراحت است، اما این یک شب به یاد ماندنی بود! تبریک به برندگان!");
        } finally {
            setIsNightRecapLoading(false);
        }
    };

    const handleAdvanceToNextStage = () => {
        if (!winState) return;
        if (winState.level === 'game') {
            setCurrentGameNumber(prev => prev + 1);
            setTeams(teams.map(team => ({ ...team, currentGameScore: 0 })));
            setRoundHistory([]);
        } else if (winState.level === 'set') {
            setCurrentSetNumber(prev => prev + 1);
            setCurrentGameNumber(1);
            setTeams(teams.map(team => ({ ...team, currentGameScore: 0, gamesWon: 0 })));
            setRoundHistory([]);
            if (currentNight) {
                const updatedNight = {...currentNight, sets: [...currentNight.sets, { setNumber: currentSetNumber + 1, games: [] }] };
                setCurrentNight(updatedNight);
            }
        } else if (winState.level === 'night' && currentNight) {
            handleNightEnd(currentNight, winState.winner);
        }
        setWinState(null);
        setCanUndo(false);
        setLastRoundState(null);
        setTieBreakerMessage('');
    };

    const resetToModeSelection = () => {
        setGameScreen(GameScreen.ModeSelection);
        setGameMode(null);
        setTeams([]);
        setCurrentGameNumber(1);
        setCurrentSetNumber(1);
        setWinState(null);
        setCurrentNight(null);
        setCanUndo(false);
        setLastRoundState(null);
        setTieBreakerMessage('');
        setRoundHistory([]);
    };

    const closeRecapAndReset = () => {
        setIsNightRecapVisible(false);
        resetToModeSelection();
    }
    
    return (
        <GameContext.Provider value={{ 
            gameScreen, setGameScreen, gameMode, teams, currentGameNumber, currentSetNumber, winState,
            currentNight, pointCap, gamesPerSet, setsPerNight, canUndo, tieBreakerMessage, theme,
            toggleTheme, handleModeSelect, handleNameSubmit, handleAddRound, handleEndSet, handleUndoRound,
            handleAdvanceToNextStage, resetToModeSelection, isNightRecapVisible, nightRecapAIContent,
            isNightRecapLoading, closeRecapAndReset, roundHistory
        }}>
            {children}
        </GameContext.Provider>
    );
}

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};