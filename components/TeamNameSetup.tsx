import React, { useState, useEffect } from 'react';
import type { GameModeDetails, Player } from '../types';
import { getPlayers } from '../lib/players';
import { PlayerManagementModal } from './PlayerManagementModal';

interface TeamNameSetupProps {
  mode: GameModeDetails;
  onSubmit: (playerNamesByTeam: Player[][], pointCap: number, gamesPerSet: number, setsPerNight: number) => void;
  onBack: () => void;
}

export const TeamNameSetup: React.FC<TeamNameSetupProps> = ({ mode, onSubmit, onBack }) => {
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[][]>(
    Array(mode.teams).fill(null).map(() => Array(mode.playersPerTeam).fill({ id: '', name: '' }))
  );
  
  const [pointCap, setPointCap] = useState(mode.pointCap);
  const [gamesPerSet, setGamesPerSet] = useState(3);
  const [setsPerNight, setSetsPerNight] = useState(1);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);

  useEffect(() => {
    setAllPlayers(getPlayers());
  }, []);

  const handlePlayerSelect = (teamIndex: number, playerIndex: number, playerId: string) => {
    const newSelectedPlayers = selectedPlayers.map(team => [...team]);
    const player = allPlayers.find(p => p.id === playerId) || { id: '', name: '' };
    newSelectedPlayers[teamIndex][playerIndex] = player;
    setSelectedPlayers(newSelectedPlayers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (arePlayersValid && pointCap > 0 && gamesPerSet > 0 && setsPerNight > 0) {
      onSubmit(selectedPlayers, pointCap, gamesPerSet, setsPerNight);
    }
  };

  const flatSelectedIds = selectedPlayers.flat().map(p => p.id);
  const arePlayersValid = flatSelectedIds.every(id => id !== '') && new Set(flatSelectedIds).size === flatSelectedIds.length;

  return (
    <>
      <div className="w-full max-w-lg mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">تنظیمات بازی</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{mode.title} - بازیکنان را انتخاب کنید</p>
        </div>
        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 space-y-6">
          {selectedPlayers.map((team, teamIndex) => (
            <div key={teamIndex} className="space-y-4">
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 border-b-2 border-[var(--border-light)] dark:border-[var(--border-dark)] pb-3">
                {mode.playersPerTeam > 1 ? `تیم ${teamIndex + 1}` : `بازیکن ${teamIndex + 1}`}
              </h3>
              {team.map((_, playerIndex) => (
                <div key={playerIndex}>
                  <label htmlFor={`player-select-${teamIndex}-${playerIndex}`} className="sr-only">
                    بازیکن {playerIndex + 1}
                  </label>
                  <select
                    id={`player-select-${teamIndex}-${playerIndex}`}
                    value={selectedPlayers[teamIndex][playerIndex].id}
                    onChange={(e) => handlePlayerSelect(teamIndex, playerIndex, e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  >
                    <option value="">یک بازیکن را انتخاب کنید</option>
                    {allPlayers.filter(p => !flatSelectedIds.includes(p.id) || p.id === selectedPlayers[teamIndex][playerIndex].id).map(p => (
                      <option key={p.id} value={p.id}>{p.avatar} {p.name}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          ))}
          
          <div className="border-t-2 border-[var(--border-light)] dark:border-[var(--border-dark)] pt-6">
              <button type="button" onClick={() => setIsPlayerModalOpen(true)} className="w-full px-4 py-3 bg-gray-500/20 dark:bg-gray-600/40 text-gray-800 dark:text-gray-100 font-bold rounded-lg hover:bg-gray-500/30 dark:hover:bg-gray-600/60 transition">مدیریت بازیکنان</button>
          </div>

          <div className="border-t-2 border-[var(--border-light)] dark:border-[var(--border-dark)] pt-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">قوانین بازی</h3>
              <div>
                  <label htmlFor="point-cap" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">امتیاز برای برد بازی</label>
                  <input type="number" id="point-cap" value={pointCap} onChange={e => setPointCap(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" min="1" />
              </div>
              <div>
                  <label htmlFor="games-per-set" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تعداد بازی در هر ست</label>
                  <input type="number" id="games-per-set" value={gamesPerSet} onChange={e => setGamesPerSet(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" min="1" />
              </div>
              <div>
                  <label htmlFor="sets-per-night" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تعداد ست در هر شب</label>
                  <input type="number" id="sets-per-night" value={setsPerNight} onChange={e => setSetsPerNight(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" min="1" />
              </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={!arePlayersValid}
              className="btn-primary"
            >
              شروع بازی
            </button>
            <button
              type="button"
              onClick={onBack}
              className="btn-secondary"
            >
              بازگشت
            </button>
          </div>
        </form>
      </div>
      {isPlayerModalOpen && (
        <PlayerManagementModal
          isOpen={isPlayerModalOpen}
          onClose={() => setIsPlayerModalOpen(false)}
          onPlayersUpdate={setAllPlayers}
        />
      )}
    </>
  );
};
