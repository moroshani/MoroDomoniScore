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
    'text-cyan-500', // primary
    'text-amber-500', // accent
    'text-emerald-500'
];

const teamBorderColors = [
    'border-cyan-500',
    'border-amber-500',
    'border-emerald-500'
];

const PlayerAvatar: React.FC<{ avatar?: string; className?: string }> = ({ avatar, className = "w-12 h-12" }) => {
    if (!avatar) return <span className={`${className} flex items-center justify-center text-3xl`}>👤</span>;
    if (avatar.startsWith('data:image')) {
        return <img src={avatar} alt="player avatar" className={`${className} rounded-full object-cover shadow-md border-2 border-white dark:border-slate-600`} />;
    }
    return <span className={`${className} flex items-center justify-center text-3xl`}>{avatar}</span>;
};

export const Scoreboard: React.FC<ScoreboardProps> = ({ teams, gameNumber, setNumber, pointCap, onAddRound, onNewNight, onUndo, canUndo, onEndSet, canEndSet, tieBreakerMessage, roundHistory }) => {
  const [roundScores, setRoundScores] = useState<number[]>(Array(teams.length).fill(0));
  const [lastUpdatedTeamId, setLastUpdatedTeamId] = useState<number | null>(null);
  const prevTeamsRef = useRef<Team[]>(teams);
  const historyListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (teams.every(t => t.currentGameScore === 0)) {
      setRoundScores(Array(teams.length).fill(0));
    }
    const updatedTeam = teams.find((team, index) => team.currentGameScore !== prevTeamsRef.current[index]?.currentGameScore);
    if (updatedTeam) {
        setLastUpdatedTeamId(updatedTeam.id);
        const timer = setTimeout(() => setLastUpdatedTeamId(null), 600);
        return () => clearTimeout(timer);
    }
    prevTeamsRef.current = JSON.parse(JSON.stringify(teams));
  }, [teams, gameNumber, setNumber]);

  useEffect(() => {
    if(historyListRef.current) {
        historyListRef.current.scrollTop = 0;
    }
  }, [roundHistory])

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

  const teamNameWithAvatar = (team: Team) => (
    <div className="flex flex-col items-center justify-center gap-3">
        <div className="flex -space-x-4 hover:space-x-0 transition-all duration-300">
            {team.players.map(p => <PlayerAvatar key={p.id} avatar={p.avatar} /> )}
        </div>
        <span className="text-xl font-bold">{team.name}</span>
    </div>
  );
  
  const reversedRoundHistory = useMemo(() => [...roundHistory].reverse(), [roundHistory]);

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
            <header className="space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                    <h1 className="text-4xl font-extrabold text-text-primary-light dark:text-text-primary-dark">
                        <span className="font-light text-text-secondary-light dark:text-text-secondary-dark">ست</span> {setNumber}, <span className="font-light text-text-secondary-light dark:text-text-secondary-dark">بازی</span> {gameNumber}
                    </h1>
                    <div className="flex gap-2">
                        <button onClick={onEndSet} disabled={!canEndSet} className="btn bg-blue-500 text-white text-sm py-2 px-3">پایان ست</button>
                        <button onClick={onNewNight} className="btn bg-danger text-white text-sm py-2 px-3">ریست کردن شب</button>
                    </div>
                </div>
                <div className="glass-card text-center p-3 text-lg font-bold">
                    اولین تیمی که به {pointCap} امتیاز برسد برنده بازی است!
                </div>
                {tieBreakerMessage && (
                    <div className="bg-amber-500/20 text-amber-700 dark:text-amber-300 p-3 rounded-xl" role="alert">
                        {tieBreakerMessage}
                    </div>
                )}
            </header>

            <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teams.map((team, index) => (
                <div key={team.id} className={`glass-card text-center h-full border-t-4 ${teamBorderColors[team.id % teamBorderColors.length]}`}>
                  <div className="p-6 flex flex-col items-center h-full">
                    <div className="mb-4 min-h-[110px]">{teamNameWithAvatar(team)}</div>
                    <div className={`text-7xl lg:text-8xl font-black font-numeric my-auto ${teamColors[team.id % teamColors.length]} ${lastUpdatedTeamId === team.id ? 'animate-bounce' : ''}`}>{team.currentGameScore}</div>
                    <div className="flex gap-2 mt-4 text-sm">
                        <span className="bg-slate-200 dark:bg-slate-700 rounded-full px-3 py-1 font-semibold flex items-center gap-1"><TrophyIcon className="w-4 h-4"/> ست: {team.setsWon}</span>
                        <span className="bg-slate-200 dark:bg-slate-700 rounded-full px-3 py-1 font-semibold flex items-center gap-1"><TrophyIcon className="w-4 h-4"/> برد: {team.gamesWon}</span>
                    </div>
                  </div>
                </div>
              ))}
            </main>

            <footer className="glass-card p-6 mt-auto">
              <h3 className="text-2xl font-bold text-center mb-6">امتیازات این دور را وارد کنید</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {teams.map((team, index) => (
                  <div key={team.id} className="text-center">
                    <label htmlFor={`score-input-${team.id}`} className="font-bold text-lg mb-3 block">{team.name}</label>
                    <input 
                      type="number" 
                      id={`score-input-${team.id}`} 
                      value={roundScores[index] === 0 ? '' : roundScores[index]} 
                      onChange={(e) => handleScoreChange(index, parseInt(e.target.value) || 0)} 
                      className={`form-input text-center text-5xl font-extrabold font-numeric p-1 h-20 ${teamColors[team.id % teamColors.length]}`}
                    />
                    <input type="range" id={`score-slider-${team.id}`} min="0" max="60" step="1" value={roundScores[index]} onChange={(e) => handleScoreChange(index, parseInt(e.target.value))} className="w-full mt-4 h-3 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleAddScores} disabled={!isRoundInputValid} className="btn-primary flex-grow !bg-success !text-lg">افزودن امتیازات</button>
                <button onClick={onUndo} disabled={!canUndo} className="btn-secondary !bg-accent !text-white !text-lg">واگرد</button>
              </div>
            </footer>
        </div>

        <aside className="lg:col-span-1 glass-card p-4 h-[calc(100vh-4rem)] lg:h-auto">
            <h3 className="text-xl font-bold mb-3 border-b-2 border-slate-300 dark:border-slate-600 pb-2">گزارش امتیاز بازی</h3>
            {roundHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary-light dark:text-text-secondary-dark">
                    <p className="text-lg">گزارش خالی است</p>
                    <p className="mt-2">امتیازات دور اول را اضافه کنید.</p>
                </div>
            ) : (
                <ul ref={historyListRef} className="space-y-2 h-full overflow-y-auto pr-2">
                    {reversedRoundHistory.map((entry, index) => (
                    <li key={index} className="flex justify-between items-center p-3 rounded-lg bg-slate-500/10 animate-fade-in">
                        <span className="font-semibold">{entry.teamName}</span>
                        <span className="font-bold text-success font-numeric">+{entry.score}</span>
                    </li>
                    ))}
                </ul>
            )}
        </aside>
      </div>
    </div>
  );
};
