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
    const colors = ['#22d3ee', '#fcd34d', '#4ade80', '#f87171'];
    const pieces = Array.from({ length: 50 }).map((_, i) => {
        const style = {
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            animation: `confetti-fall ${3 + Math.random() * 3}s ${Math.random() * 4}s linear forwards`,
            transform: `rotate(${Math.random() * 360}deg)`,
        };
        return <div key={i} className="absolute w-2 h-4 opacity-0" style={style as React.CSSProperties} />;
    });

    return (
      <>
        <style>{`
          @keyframes confetti-fall {
            0% { transform: translateY(-10vh) rotateZ(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotateZ(720deg); opacity: 0; }
          }
        `}</style>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">{pieces}</div>
      </>
    );
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
            <button onClick={onNextGame} className="btn-primary !bg-success">
              شروع بازی {gameNumber + 1}
            </button>
        );
        case 'set': return (
            <button onClick={onNextSet} className="btn-primary !bg-accent">
              شروع ست {setNumber + 1}
            </button>
        );
        case 'night': return (
             <button onClick={onNewNight} className="btn-primary">
                مشاهده خلاصه شب
            </button>
        );
    }
  }
  
  const winnerAvatars = winner.players.map(p => p.avatar).join(' ');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in" role="dialog" aria-modal="true">
      <Confetti />
      <div ref={focusTrapRef} className="glass-card p-8 max-w-sm w-full text-center relative z-10 transform transition-all scale-100 opacity-100">
        <CrownIcon className="w-24 h-24 text-accent mx-auto mb-4" />
        
        <h2 className="text-3xl font-bold mb-2">{getTitle()}</h2>
        <p className="text-5xl font-black text-primary tracking-tight">{winner.name}</p>
        
        <div className="flex justify-center items-center gap-2 my-6">
            <span className="text-4xl">{winnerAvatars}</span>
            {finalScore && level === 'game' && (
                <p className="text-lg font-bold text-text-secondary-light dark:text-text-secondary-dark">
                    با <span className="font-numeric text-2xl text-text-primary-light dark:text-text-primary-dark">{finalScore}</span> امتیاز!
                </p>
            )}
        </div>
        
        <div className="animate-fade-in">
            {getButton()}
        </div>
      </div>
    </div>
  );
};
