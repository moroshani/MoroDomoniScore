import React, { useEffect, useState } from 'react';
import type { Player } from '../types';
import { getPlayers, savePlayers, updatePlayer, deletePlayer } from '../lib/players';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { AIAvatarGeneratorModal } from './AIAvatarGeneratorModal';
import { SparklesIcon } from './icons';
import { useAuth } from '../context/AuthContext';

const PlayerAvatar: React.FC<{ avatar?: string; className?: string }> = ({ avatar, className = 'w-10 h-10' }) => {
  if (!avatar) return <span className={`${className} flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-lg`}>👤</span>;
  if (avatar.startsWith('data:image')) {
    return <img src={avatar} alt="player avatar" className={`${className} rounded-full object-cover`} />;
  }
  return <span className={`${className} flex items-center justify-center rounded-full text-lg`}>{avatar}</span>;
};

interface PlayerManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayersUpdate: (players: Player[]) => void;
}

export const PlayerManagementModal: React.FC<PlayerManagementModalProps> = ({ isOpen, onClose, onPlayersUpdate }) => {
  const { user } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerAvatar, setNewPlayerAvatar] = useState('');
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [playerForAIGen, setPlayerForAIGen] = useState<Player | null>(null);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const focusTrapRef = useFocusTrap<HTMLDivElement>(isOpen);

  useEffect(() => {
    let isMounted = true;

    const loadPlayers = async () => {
      if (!isOpen || !user) return;
      setIsLoadingPlayers(true);
      setError(null);

      try {
        const remotePlayers = await getPlayers(user.id);
        if (!isMounted) return;
        setPlayers(remotePlayers);
        onPlayersUpdate(remotePlayers);
      } catch (err) {
        console.error('Failed to load players', err);
        if (isMounted) {
          setError('بارگذاری بازیکنان انجام نشد. لطفاً اتصال یا تنظیمات سوپابیس را بررسی کنید.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingPlayers(false);
        }
      }
    };

    loadPlayers();

    return () => {
      isMounted = false;
    };
  }, [isOpen, user, onPlayersUpdate]);

  if (!isOpen) return null;

  const refreshPlayers = async () => {
    if (!user) return;
    try {
      const remotePlayers = await getPlayers(user.id);
      setPlayers(remotePlayers);
      onPlayersUpdate(remotePlayers);
      setError(null);
    } catch (err) {
      console.error('Failed to refresh players', err);
      setError('به‌روزرسانی لیست بازیکنان انجام نشد.');
    }
  };

  const handleAddNewPlayer = async () => {
    if (!user) return;
    const trimmedName = newPlayerName.trim();
    if (!trimmedName || players.some(p => p.name === trimmedName)) return;

    const generatedId = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`;
    const newPlayer: Player = { id: generatedId, name: trimmedName, avatar: newPlayerAvatar || '👤' };
    const nextPlayers = [...players, newPlayer];

    try {
      await savePlayers(user.id, nextPlayers);
      setNewPlayerName('');
      setNewPlayerAvatar('');
      await refreshPlayers();
    } catch (err) {
      console.error('Failed to add player', err);
      setError('افزودن بازیکن جدید انجام نشد.');
    }
  };

  const handleEdit = async (player: Player) => {
    if (!user) return;
    const newName = prompt('نام جدید را وارد کنید:', player.name);
    if (!newName || !newName.trim()) return;

    const newAvatar = prompt('ایموجی آواتار جدید را وارد کنید (برای آواتار AI از دکمه ✨ استفاده کنید):', player.avatar);
    const updated: Player = { ...player, name: newName.trim(), avatar: newAvatar || player.avatar };

    try {
      await updatePlayer(user.id, updated);
      await refreshPlayers();
    } catch (err) {
      console.error('Failed to update player', err);
      setError('به‌روزرسانی بازیکن انجام نشد.');
    }
  };

  const handleDelete = async (player: Player) => {
    if (!user) return;
    if (!window.confirm(`آیا از حذف ${player.name} مطمئن هستید؟`)) return;

    try {
      await deletePlayer(user.id, player.id);
      await refreshPlayers();
    } catch (err) {
      console.error('Failed to delete player', err);
      setError('حذف بازیکن انجام نشد.');
    }
  };

  const handleAvatarGenerated = async (base64Image: string) => {
    if (!playerForAIGen || !user) return;
    const updated: Player = { ...playerForAIGen, avatar: base64Image };

    try {
      await updatePlayer(user.id, updated);
      await refreshPlayers();
    } catch (err) {
      console.error('Failed to update player avatar', err);
      setError('ذخیره آواتار انجام نشد.');
    }
  };

  const openAIGenerator = (player: Player) => {
    setPlayerForAIGen(player);
    setIsAIGeneratorOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true">
        <div ref={focusTrapRef} className="glass-card rounded-3xl p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">مدیریت بازیکنان</h2>

          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mb-6">
            {isLoadingPlayers ? (
              <p className="text-center text-[var(--color-text-secondary)]">در حال بارگذاری بازیکنان...</p>
            ) : players.length === 0 ? (
              <p className="text-center text-[var(--color-text-secondary)]">هیچ بازیکن ذخیره‌شده‌ای وجود ندارد.</p>
            ) : (
              players.map(player => (
                <div key={player.id} className="flex items-center justify-between bg-gray-500/10 dark:bg-black/20 p-3 rounded-lg">
                  <div className="flex items-center gap-3 flex-grow">
                    <PlayerAvatar avatar={player.avatar} />
                    <span className="font-semibold text-[var(--color-text-primary)]">{player.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openAIGenerator(player)} className="p-1 text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300 transition-transform hover:scale-110" title="ساخت آواتار با هوش مصنوعی">
                      <SparklesIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleEdit(player)} className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-semibold">ویرایش</button>
                    <button onClick={() => handleDelete(player)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 font-semibold">حذف</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-300 bg-red-500/10 dark:bg-red-500/20 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="border-t-2 border-[var(--color-border)] pt-6 space-y-4">
            <h3 className="text-lg font-bold text-[var(--color-text-secondary)]">افزودن بازیکن جدید</h3>
            <div className="flex gap-2">
              <input type="text" value={newPlayerAvatar} onChange={e => setNewPlayerAvatar(e.target.value)} placeholder="👤" className="form-input w-16 text-center px-2 py-2" />
              <input type="text" value={newPlayerName} onChange={e => setNewPlayerName(e.target.value)} placeholder="نام بازیکن جدید" className="form-input flex-grow" />
              <button type="button" onClick={handleAddNewPlayer} className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition">افزودن</button>
            </div>
          </div>

          <button onClick={onClose} className="w-full mt-8 bg-gray-500/20 dark:bg-gray-600/40 text-[var(--color-text-primary)] font-bold py-3 rounded-lg hover:bg-gray-500/30 dark:hover:bg-gray-600/60 transition">بستن</button>
        </div>
      </div>
      {isAIGeneratorOpen && playerForAIGen && (
        <AIAvatarGeneratorModal
          isOpen={isAIGeneratorOpen}
          onClose={() => setIsAIGeneratorOpen(false)}
          onAvatarGenerated={handleAvatarGenerated}
          playerName={playerForAIGen.name}
        />
      )}
    </>
  );
};
