import React from 'react';
import type { Team } from '../types';
import { CrownIcon } from './icons';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface WinnerModalProps {
  winner: Team;
  level: 'game' | 'set' | 'night';
  finalScore?: number;
  gameNumber: number;
  setNumber: number;
  onNextGame: () => void;
  onNextSet: () => void;
  onNewNight: () => void;
  isOpen: boolean;
}

const Confetti: React.FC = () => {
    const colors = ['#00695C', '#FFA000', '#00BFA5', '#FFD740', '#388E3C'];
    const pieces = Array.from({ length: 50 }).map((_, i) => {
        const style = {
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${3 + Math.random() * 3}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            '--horizontal-drift': `${(Math.random() - 0.5) * 20}vw`,
        };
        return <div key={i} className="confetti-piece" style={style as React.CSSProperties} />;
    });
    return <div className="confetti-container">{pieces}</div>;
};


export const WinnerModal: React.FC<WinnerModalProps> = ({ isOpen, winner, level, finalScore, gameNumber, setNumber, onNextGame, onNextSet, onNewNight }) => {
  const focusTrapRef = useFocusTrap<HTMLDivElement>(isOpen);

  if (!isOpen) return null;

  const getTitle = () => {
    switch(level) {
        case 'game': return `برنده بازی ${gameNumber}!`;
        case 'set': return `برنده ست ${setNumber}!`;
        case 'night': return `قهرمان امشب!`;
    }
  }

  const getButton = () => {
     switch(level) {
        case 'game': return (
            <button
              onClick={onNextGame}
              className="btn-primary"
              style={{backgroundColor: 'var(--color-accent-success)'}}
            >
              شروع بازی {gameNumber + 1}
            </button>
        );
        case 'set': return (
            <button
              onClick={onNextSet}
              className="btn-primary"
              style={{backgroundColor: 'var(--color-accent-warning)'}}
            >
              شروع ست {setNumber + 1}
            </button>
        );
        case 'night': return (
             <button
                onClick={onNewNight}
                className="btn-primary"
            >
                مشاهده خلاصه شب
            </button>
        );
    }
  }
  
  const winnerAvatars = winner.players.map(p => p.avatar).join(' ');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true">
      <Confetti />
      <div ref={focusTrapRef} className="glass-card rounded-3xl p-8 max-w-sm w-full text-center transform transition-all scale-100 opacity-100 relative z-10">
        <CrownIcon className="w-24 h-24 text-yellow-400 mx-auto mb-4" />
        
        <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">{getTitle()}</h2>
        <p className="text-5xl font-black text-[var(--color-accent-primary)] mb-2 tracking-tight">{winner.name}</p>
        
        <div className="flex justify-center items-center gap-2 mb-6">
            <span className="text-4xl">{winnerAvatars}</span>
            {finalScore && level === 'game' && (
                <p className="text-lg font-bold text-[var(--color-text-secondary)]">
                    با <span className="font-numeric text-2xl text-[var(--color-text-primary)]">{finalScore}</span> امتیاز!
                </p>
            )}
        </div>
        
        <div className="animate-fade-in-slow">
            {getButton()}
        </div>
      </div>
    </div>
  );
};