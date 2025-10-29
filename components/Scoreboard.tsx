import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Team } from '../types';
import { TrophyIcon } from './icons';

interface ScoreboardProps {
  teams: Team[];
  gameNumber: number;
  setNumber: number;
  pointCap: number;
  onAddRound: (scores: number[]) => void;
  onNewNight: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onEndSet: () => void;
  canEndSet: boolean;
  tieBreakerMessage: string;
  roundHistory: { teamName: string; score: number }[];
}

const teamColors = [
    'var(--color-accent-primary)',
    'var(--color-accent-warning)',
    'var(--color-accent-success)'
];

const PlayerAvatar: React.FC<{ avatar?: string; className?: string }> = ({ avatar, className = "w-10 h-10" }) => {
    if (!avatar) return <span className={`${className} flex items-center justify-center text-3xl`}>👤</span>;
    if (avatar.startsWith('data:image')) {
        return <img src={avatar} alt="player avatar" className={`${className} rounded-full object-cover shadow-md`} />;
    }
    return <span className={`${className} flex items-center justify-center text-3xl`}>{avatar}</span>;
};

export const Scoreboard: React.FC<ScoreboardProps> = ({ teams, gameNumber, setNumber, pointCap, onAddRound, onNewNight, onUndo, canUndo, onEndSet, canEndSet, tieBreakerMessage, roundHistory }) => {
  const [roundScores, setRoundScores] = useState<number[]>(Array(teams.length).fill(0));
  const [lastUpdatedTeamId, setLastUpdatedTeamId] = useState<number | null>(null);
  const prevTeamsRef = useRef<Team[]>(teams);

  useEffect(() => {
    // Reset scores on new game/set
    if (teams.every(t => t.currentGameScore === 0)) {
      setRoundScores(Array(teams.length).fill(0));
    }

    // Detect score changes for animation
    const updatedTeam = teams.find((team, index) => team.currentGameScore !== prevTeamsRef.current[index]?.currentGameScore);
    if (updatedTeam) {
        setLastUpdatedTeamId(updatedTeam.id);
        const timer = setTimeout(() => setLastUpdatedTeamId(null), 500); // Animation duration
        return () => clearTimeout(timer);
    }
    prevTeamsRef.current = JSON.parse(JSON.stringify(teams)); // Deep copy for reliable comparison
  }, [teams, gameNumber, setNumber]);

  const handleScoreChange = (index: number, value: number) => {
    const newScores = [...roundScores];
    newScores[index] = Math.max(0, value);
    setRoundScores(newScores);
  };

  const handleAddScores = () => {
    onAddRound(roundScores);
    setRoundScores(Array(teams.length).fill(0));
  };
  
  const isRoundInputValid = roundScores.some(s => s > 0);

  const teamNameWithAvatar = (team: Team) => {
    const avatars = team.players.map(p => <PlayerAvatar key={p.id} avatar={p.avatar} /> );
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center justify-center -space-x-4">
                {avatars}
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors[team.id % teamColors.length] }}></span>
                <span className="text-xl font-bold">{team.name}</span>
            </div>
        </div>
    )
  }

  const reversedRoundHistory = useMemo(() => [...roundHistory].reverse(), [roundHistory]);

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 flex flex-col gap-8">
        <header>
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
              <h1 className="text-4xl font-extrabold text-[var(--color-text-primary)]">
                <span className="font-light text-[var(--color-text-secondary)]">ست</span> {setNumber}, <span className="font-light text-[var(--color-text-secondary)]">بازی</span> {gameNumber}
              </h1>
              <div className="flex gap-2">
                  <button onClick={onEndSet} disabled={!canEndSet} className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400/50 disabled:cursor-not-allowed shadow-md">پایان ست</button>
                  <button onClick={onNewNight} className="bg-red-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-red-700 transition shadow-md">ریست کردن شب</button>
              </div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center text-[var(--color-accent-primary)] font-bold text-xl">
            اولین تیمی که به {pointCap} امتیاز برسد برنده بازی است!
          </div>
          {tieBreakerMessage && (
              <div className="mt-4 bg-yellow-400/30 dark:bg-yellow-500/20 border-r-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg shadow-md" role="alert">
                  <p className="font-bold">{tieBreakerMessage}</p>
              </div>
          )}
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div key={team.id} className="glass-card rounded-3xl p-6 flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] flex items-center h-28">{teamNameWithAvatar(team)}</h2>
              <div className={`font-numeric text-8xl font-black text-[var(--color-accent-primary)] my-4 ${lastUpdatedTeamId === team.id ? 'animate-score-pop' : ''}`}>{team.currentGameScore}</div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-amber-600 dark:text-amber-400 mt-auto">
                  <div className="flex items-center space-x-1 rtl:space-x-reverse glass-card rounded-full px-3 py-1 text-sm">
                      <TrophyIcon className="w-4 h-4"/>
                      <span className="font-semibold">ست‌ها: {team.setsWon}</span>
                  </div>
                   <div className="flex items-center space-x-1 rtl:space-x-reverse glass-card rounded-full px-3 py-1 text-sm">
                      <TrophyIcon className="w-4 h-4"/>
                      <span className="font-semibold">بردها: {team.gamesWon}</span>
                  </div>
              </div>
            </div>
          ))}
        </main>

        <footer className="glass-card rounded-3xl p-8 mt-auto">
          <h3 className="text-2xl font-bold text-center text-[var(--color-text-primary)] mb-6">امتیازات این دور را وارد کنید</h3>
          <div className={`grid grid-cols-1 ${teams.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-8 mb-6`}>
            {teams.map((team, index) => (
              <div key={team.id} className="flex flex-col items-center">
                <label htmlFor={`score-input-${team.id}`} className="block text-xl font-medium text-[var(--color-text-secondary)] text-center mb-4 h-16 flex items-center">{team.name}</label>
                <div className="w-full flex flex-col items-center gap-2">
                    <div className="flex items-center gap-3">
                        <button onClick={() => handleScoreChange(index, roundScores[index] - 1)} className="font-black text-3xl bg-gray-500/10 dark:bg-gray-700/50 rounded-md w-10 h-10 flex items-center justify-center">-</button>
                        <input type="number" id={`score-input-${team.id}`} value={roundScores[index]} onChange={(e) => handleScoreChange(index, parseInt(e.target.value) || 0)} className="w-28 text-center text-5xl font-black text-[var(--color-accent-primary)] bg-transparent border-b-2 border-gray-400/50 dark:border-gray-500/50 focus:outline-none focus:border-[var(--color-accent-primary)] font-numeric" />
                        <button onClick={() => handleScoreChange(index, roundScores[index] + 1)} className="font-black text-3xl bg-gray-500/10 dark:bg-gray-700/50 rounded-md w-10 h-10 flex items-center justify-center">+</button>
                    </div>
                  <input type="range" id={`score-slider-${team.id}`} min="0" max="60" step="1" value={roundScores[index]} onChange={(e) => handleScoreChange(index, parseInt(e.target.value))} className="w-full h-3 bg-gray-200/50 rounded-lg appearance-none cursor-pointer dark:bg-gray-700/50 accent-[var(--color-accent-primary)] mt-4" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleAddScores} disabled={!isRoundInputValid} className="flex-grow w-full bg-[var(--color-accent-success-light)] text-white font-bold py-4 text-lg rounded-xl hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-green-500/50 disabled:bg-gray-400/50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-lg">افزودن امتیازات دور</button>
            <button onClick={onUndo} disabled={!canUndo} className="sm:w-1/3 w-full bg-amber-500 text-white font-bold py-4 text-lg rounded-xl hover:bg-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-500/50 disabled:bg-gray-400/50 disabled:cursor-not-allowed transition shadow-md">واگرد</button>
          </div>
        </footer>
      </div>

      <aside className="glass-card rounded-3xl p-6 lg:col-span-1 h-full">
        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 border-b-2 pb-3 border-[var(--color-border)]">گزارش امتیاز بازی</h3>
        {roundHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-[var(--color-text-secondary)]">
            <p className="text-lg">گزارش خالی است</p>
            <p className="mt-2">امتیازات دور اول را اضافه کنید تا گزارش شروع شود.</p>
          </div>
        ) : (
          <ul className="space-y-3 h-full max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
            {reversedRoundHistory.map((entry, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-500/10 dark:bg-black/20 p-3 rounded-lg animate-fade-in">
                <span className="font-semibold text-[var(--color-text-primary)]">{entry.teamName}</span>
                <span className="font-bold text-[var(--color-accent-success)] font-numeric">+{entry.score}</span>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
};