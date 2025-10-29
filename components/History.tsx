import React, { useState, useEffect, useMemo } from 'react';
import { getHistory, clearHistory as clearHistoryFromStorage } from '../lib/storage';
import type { NightRecord, SetRecord, Player } from '../types';
import { CrownIcon, TrashIcon } from './icons';

interface HistoryProps {
  onBack: () => void;
}

const PlayerAvatar: React.FC<{ avatar?: string; className?: string }> = ({ avatar, className = "w-6 h-6" }) => {
    if (!avatar) return <span className={`${className} flex items-center justify-center`}>👤</span>;
    if (avatar.startsWith('data:image')) {
        return <img src={avatar} alt="player avatar" className={`${className} rounded-full object-cover`} />;
    }
    return <span className={className}>{avatar}</span>;
};

const TeamNameWithAvatars: React.FC<{ name: string; players: Player[] }> = ({ name, players }) => {
    const avatars = players.map(p => <PlayerAvatar key={p.id} avatar={p.avatar} />);
    return (
      <span className="inline-flex items-center gap-2 font-semibold">
        <div className="flex -space-x-2">{avatars}</div>
        <span>{name}</span>
      </span>
    );
};

export const History: React.FC<HistoryProps> = ({ onBack }) => {
  const [history, setHistory] = useState<NightRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setHistory(getHistory().sort((a, b) => parseInt(b.id) - parseInt(a.id)));
  }, []);

  const handleClearHistory = () => {
    if (window.confirm("آیا مطمئن هستید که می‌خواهید تمام تاریخچه بازی‌ها را برای همیشه حذف کنید؟")) {
      clearHistoryFromStorage();
      setHistory([]);
    }
  };

  const findTeamDataById = (night: NightRecord, teamId: number | undefined) => {
    if (teamId === undefined) return null;
    const team = night.sets[0]?.games[0]?.teams.find(t => t.id === teamId);
    return team ?? null;
  };
  
  const filteredHistory = useMemo(() => {
    return history.filter(night => {
      if (!searchTerm) return true;
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const playersInNight = new Set<string>();
      night.sets.forEach(set => {
        set.games.forEach(game => {
          game.teams.forEach(team => {
            team.players.forEach(player => {
              playersInNight.add(player.name.toLowerCase());
            });
          });
        });
      });
      return Array.from(playersInNight).some(playerName => playerName.includes(lowerCaseSearchTerm));
    });
  }, [history, searchTerm]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100">تاریخچه بازی‌ها</h1>
        <div className="flex items-center gap-4">
          {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="inline-flex items-center px-4 py-2 border border-red-500/50 text-sm font-medium rounded-lg text-red-700 bg-red-500/20 hover:bg-red-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/50 dark:hover:bg-red-500/30"
              >
                <TrashIcon className="w-4 h-4 ms-2"/>
                پاک کردن تاریخچه
              </button>
          )}
          <button
            onClick={onBack}
            className="btn-secondary !w-auto !py-2 !px-4 !text-sm"
          >
            بازگشت به منو
          </button>
        </div>
      </header>

      {history.length > 0 && (
        <div className="mb-8">
            <input
                type="text"
                placeholder="جستجو بر اساس نام بازیکن..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 bg-white/60 dark:bg-gray-800/40 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-teal-500/50 focus:border-teal-500 transition shadow-inner"
            />
        </div>
      )}

      {history.length === 0 ? (
        <div className="text-center glass-card p-12 rounded-3xl">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">هنوز هیچ بازی انجام نشده است</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">یک بازی انجام دهید تا تاریخچه آن را اینجا ببینید!</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center glass-card p-12 rounded-3xl">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">هیچ نتیجه‌ای یافت نشد</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">هیچ بازی با نام بازیکن "{searchTerm}" مطابقت ندارد.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredHistory.map(night => {
            const nightWinnerData = findTeamDataById(night, night.nightWinnerTeamId);
            return (
              <details key={night.id} className="glass-card rounded-3xl open:shadow-2xl transition-shadow overflow-hidden">
                <summary className="p-6 cursor-pointer flex justify-between items-center list-none">
                  <div>
                    <p className="font-bold text-2xl text-gray-800 dark:text-gray-100">{new Date(parseInt(night.id)).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-md text-gray-600 dark:text-gray-300">{night.mode.title} - {night.mode.description}</p>
                    {nightWinnerData && (
                      <div className="mt-3 flex items-center text-amber-600 dark:text-amber-400 font-bold">
                        <CrownIcon className="w-5 h-5 ms-2" />
                        <span>برنده شب: <TeamNameWithAvatars name={nightWinnerData.name} players={nightWinnerData.players}/></span>
                      </div>
                    )}
                  </div>
                  <span className="text-teal-600 dark:text-teal-400 font-semibold transform transition-transform details-arrow">-</span>
                </summary>
                <div className="border-t border-[var(--border-light)] dark:border-[var(--border-dark)] p-6 bg-gray-500/5 dark:bg-black/10 space-y-4">
                  {night.sets.map((set: SetRecord) => {
                    const setWinnerData = findTeamDataById(night, set.winnerTeamId);
                    return (
                        <div key={set.setNumber} className="border-b border-[var(--border-light)] dark:border-[var(--border-dark)] pb-4 last:border-b-0">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">ست {set.setNumber} {setWinnerData ? `- برنده: ${setWinnerData.name}`: ''}</h3>
                            {set.games.map(game => {
                                const gameWinnerTeam = game.teams.find(t => t.id === game.winnerTeamId);
                                return (
                                <div key={game.gameNumber} className="pl-4 mt-2 border-r-2 border-gray-300 dark:border-gray-600 pr-4">
                                    <h4 className="font-semibold text-md text-gray-700 dark:text-gray-300">بازی {game.gameNumber}</h4>
                                    <ul className="mt-2 space-y-1">
                                    {game.teams.map(team => (
                                        <li key={team.id} className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300"><TeamNameWithAvatars name={team.name} players={team.players}/></span>
                                        <span className={`font-bold font-numeric ${team.id === game.winnerTeamId ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-gray-100'}`}>{team.score}</span>
                                        </li>
                                    ))}
                                    </ul>
                                </div>
                                )
                            })}
                        </div>
                    )
                  })}
                </div>
              </details>
            )
          })}
        </div>
      )}
    </div>
  );
};