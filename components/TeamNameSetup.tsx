import React, { useState, useEffect } from 'react';
import type { GameModeDetails, Player } from '../types';
import { getPlayers } from '../lib/players';
import { PlayerManagementModal } from './PlayerManagementModal';
import { SparklesIcon } from './icons';
import { useAuth } from '../context/AuthContext';

interface TeamNameSetupProps {
  mode: GameModeDetails;
  onSubmit: (playerNamesByTeam: Player[][], pointCap: number, gamesPerSet: number, setsPerNight: number) => void;
  onBack: () => void;
}

const PlayerAvatar: React.FC<{ avatar?: string; className?: string }> = ({ avatar, className = "w-10 h-10" }) => {
    if (!avatar) return <span className={`${className} flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-lg`}>👤</span>;
    if (avatar.startsWith('data:image')) {
        return <img src={avatar} alt="player avatar" className={`${className} rounded-full object-cover`} />;
    }
    return <span className={`${className} flex items-center justify-center rounded-full text-lg`}>{avatar}</span>;
};

export const TeamNameSetup: React.FC<TeamNameSetupProps> = ({ mode, onSubmit, onBack }) => {
  const { user } = useAuth();
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[][]>(
    Array(mode.teams).fill(null).map(() => Array(mode.playersPerTeam).fill({ id: '', name: '' }))
  );
  
  const [pointCap, setPointCap] = useState(mode.pointCap);
  const [gamesPerSet, setGamesPerSet] = useState(3);
  const [setsPerNight, setSetsPerNight] = useState(1);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [step, setStep] = useState<'players' | 'rules'>('players');

  const fetchPlayers = () => {
      if (user) {
          setAllPlayers(getPlayers(user.id));
      }
  };

  useEffect(() => {
    fetchPlayers();
  }, [user]);

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

  const flatSelectedIds = selectedPlayers.flat().map(p => p.id).filter(Boolean);
  const arePlayersValid = flatSelectedIds.length === (mode.teams * mode.playersPerTeam) && new Set(flatSelectedIds).size === flatSelectedIds.length;
  
  const playerSelectionScreen = (
    <div className="space-y-8 animate-fade-in">
        {allPlayers.length === 0 ? (
          <div className="text-center p-4 border-2 border-dashed border-primary/50 rounded-2xl">
              <SparklesIcon className="w-16 h-16 mx-auto text-primary mb-4" />
              <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">به امتیاز شمار دومینو خوش آمدید!</h3>
              <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">به نظر می‌رسد هیچ بازیکنی ثبت نشده. برای شروع، چند بازیکن اضافه کنید.</p>
              <button type="button" onClick={() => setIsPlayerModalOpen(true)} className="btn-primary mt-6">
                افزودن بازیکنان
              </button>
          </div>
        ) : (
          <div>
            {selectedPlayers.map((team, teamIndex) => (
              <div key={teamIndex} className="mb-6 last:mb-0">
                <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark border-b-2 border-slate-300 dark:border-slate-600 pb-2 mb-4">
                  {mode.playersPerTeam > 1 ? `تیم ${teamIndex + 1}` : `بازیکن ${teamIndex + 1}`}
                </h3>
                <div className="space-y-3">
                {team.map((_, playerIndex) => (
                    <select
                      key={playerIndex}
                      value={selectedPlayers[teamIndex][playerIndex].id}
                      onChange={(e) => handlePlayerSelect(teamIndex, playerIndex, e.target.value)}
                      className="form-input text-lg"
                    >
                      <option value="">یک بازیکن را انتخاب کنید</option>
                      {allPlayers.filter(p => !flatSelectedIds.includes(p.id) || p.id === selectedPlayers[teamIndex][playerIndex].id).map(p => (
                        <option key={p.id} value={p.id}>{p.avatar} {p.name}</option>
                      ))}
                    </select>
                ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {allPlayers.length > 0 && (
            <button type="button" onClick={() => setIsPlayerModalOpen(true)} className="w-full btn-secondary bg-primary/10 text-primary">مدیریت بازیکنان</button>
        )}

        <div className="flex flex-col gap-4 pt-4">
          <button
            type="button"
            onClick={() => setStep('rules')}
            disabled={!arePlayersValid}
            className="btn-primary text-lg"
          >
            ادامه
          </button>
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary text-lg"
          >
            بازگشت
          </button>
        </div>
      </div>
  );
  
  const rulesScreen = (
    <div className="space-y-8 animate-fade-in">
        <div>
          <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark border-b-2 border-slate-300 dark:border-slate-600 pb-2 mb-4">
            تیم‌های انتخاب شده
          </h3>
          <div className="space-y-3">
            {selectedPlayers.map((team, teamIndex) => (
              <div key={teamIndex} className="flex items-center gap-4 bg-slate-500/10 p-3 rounded-lg">
                <span className="font-bold text-text-secondary-light dark:text-text-secondary-dark w-20">
                  {mode.playersPerTeam > 1 ? `تیم ${teamIndex + 1}:` : `بازیکن ${teamIndex + 1}:`}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {team.map(player => (
                    <span key={player.id} className="flex items-center gap-2 font-semibold bg-white/50 dark:bg-black/20 px-3 py-1 rounded-full">
                      <PlayerAvatar avatar={player.avatar} className="w-8 h-8" />
                      {player.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
            <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark border-b-2 border-slate-300 dark:border-slate-600 pb-2 mb-4">قوانین بازی</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="point-cap" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">امتیاز برد</label>
                    <input type="number" id="point-cap" value={pointCap} onChange={e => setPointCap(parseInt(e.target.value) || 0)} className="form-input" min="1" />
                </div>
                <div>
                    <label htmlFor="games-per-set" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">بازی در ست</label>
                    <input type="number" id="games-per-set" value={gamesPerSet} onChange={e => setGamesPerSet(parseInt(e.target.value) || 0)} className="form-input" min="1" />
                </div>
                <div>
                    <label htmlFor="sets-per-night" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">ست در شب</label>
                    <input type="number" id="sets-per-night" value={setsPerNight} onChange={e => setSetsPerNight(parseInt(e.target.value) || 0)} className="form-input" min="1" />
                </div>
            </div>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <button
            type="submit"
            className="btn-primary text-lg"
          >
            شروع بازی
          </button>
          <button
            type="button"
            onClick={() => setStep('players')}
            className="btn-secondary text-lg"
          >
            بازگشت به انتخاب بازیکن
          </button>
        </div>
      </div>
  );

  return (
    <>
      <div className="w-full max-w-2xl mx-auto animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">تنظیمات بازی</h1>
          <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark mt-2">
            {mode.title} - {step === 'players' ? 'مرحله ۱: انتخاب بازیکنان' : 'مرحله ۲: تنظیم قوانین'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="glass-card p-8">
          {step === 'players' ? playerSelectionScreen : rulesScreen}
        </form>
      </div>
      {isPlayerModalOpen && (
        <PlayerManagementModal
          isOpen={isPlayerModalOpen}
          onClose={() => {
              setIsPlayerModalOpen(false);
              fetchPlayers();
          }}
          onPlayersUpdate={setAllPlayers}
        />
      )}
    </>
  );
};
