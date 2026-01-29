import React, { useState, useEffect } from 'react';
import type { Player } from '../types';
import { getPlayers, savePlayers, updatePlayer, deletePlayer } from '../lib/players';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { AIAvatarGeneratorModal } from './AIAvatarGeneratorModal';
import { SparklesIcon } from './icons';
import { useAuth } from '../context/AuthContext';

const PlayerAvatar: React.FC<{ avatar?: string; className?: string }> = ({ avatar, className = "w-10 h-10" }) => {
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

  const focusTrapRef = useFocusTrap<HTMLDivElement>(isOpen);
  
  useEffect(() => {
    if(isOpen && user) {
        setPlayers(getPlayers(user.id));
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleUpdate = () => {
    if (!user) return;
    const updatedPlayers = getPlayers(user.id);
    setPlayers(updatedPlayers);
    onPlayersUpdate(updatedPlayers);
  };

  const handleAddNewPlayer = () => {
    if (!user) return;
    if (newPlayerName.trim() && !players.some(p => p.name === newPlayerName.trim())) {
      const newPlayer: Player = { id: Date.now().toString(), name: newPlayerName.trim(), avatar: newPlayerAvatar || '👤' };
      const updatedPlayers = [...players, newPlayer];
      savePlayers(user.id, updatedPlayers);
      setNewPlayerName('');
      setNewPlayerAvatar('');
      handleUpdate();
    }
  };

  const handleEdit = (player: Player) => {
    if (!user) return;
    const newName = prompt("نام جدید را وارد کنید:", player.name);
    if (newName && newName.trim()) {
      const newAvatar = prompt("ایموجی آواتار جدید را وارد کنید (برای آواتار AI از دکمه ✨ استفاده کنید):", player.avatar);
      const updated: Player = { ...player, name: newName.trim(), avatar: newAvatar || player.avatar };
      updatePlayer(user.id, updated);
      handleUpdate();
    }
  };
  
  const handleDelete = (player: Player) => {
    if (!user) return;
    if (window.confirm(`آیا از حذف ${player.name} مطمئن هستید؟`)) {
      deletePlayer(user.id, player.id);
      handleUpdate();
    }
  };

  const openAIGenerator = (player: Player) => {
    setPlayerForAIGen(player);
    setIsAIGeneratorOpen(true);
  };

  const handleAvatarGenerated = (base64Image: string) => {
    if (playerForAIGen && user) {
        const updated: Player = { ...playerForAIGen, avatar: base64Image };
        updatePlayer(user.id, updated);
        handleUpdate();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true">
        <div ref={focusTrapRef} className="glass-card rounded-3xl p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">مدیریت بازیکنان</h2>
          
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mb-6">
            {players.map(player => (
              <div key={player.id} className="flex items-center justify-between bg-gray-500/10 dark:bg-black/20 p-3 rounded-lg">
                <div className="flex items-center gap-3 flex-grow">
                    <PlayerAvatar avatar={player.avatar} />
                    <span className="font-semibold text-[var(--color-text-primary)]">{player.name}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openAIGenerator(player)} className="p-1 text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300 transition-transform hover:scale-110" title="ساخت آواتار با هوش مصنوعی">
                      <SparklesIcon className="w-5 h-5"/>
                  </button>
                  <button onClick={() => handleEdit(player)} className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-semibold">ویرایش</button>
                  <button onClick={() => handleDelete(player)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 font-semibold">حذف</button>
                </div>
              </div>
            ))}
          </div>

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
