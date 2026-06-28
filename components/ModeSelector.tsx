import React from 'react';
import { GAME_MODES } from '../constants';
import type { GameModeDetails } from '../types';
import { UsersIcon } from './icons';

interface ModeSelectorProps {
  onSelect: (mode: GameModeDetails) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelect }) => {
  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      <div className="text-center mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-text-primary-light dark:text-text-primary-dark">
          دومینویار
        </h1>
        <p className="text-sm sm:text-lg text-text-secondary-light dark:text-text-secondary-dark mt-3">
          یکی از حالت های سریع بازی را انتخاب کنید و امتیازها را ثبت کنید.
        </p>
      </div>
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
        {GAME_MODES.map((mode) => (
          <button
            key={mode.type}
            onClick={() => onSelect(mode)}
            className="glass-card text-center p-4 sm:p-6 h-full w-full transform hover:-translate-y-2 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-primary/50"
          >
            <div className="flex flex-col items-center">
              <UsersIcon className="w-12 h-12 sm:w-20 sm:h-20 mx-auto text-primary" />
              <h2 className="text-base sm:text-2xl font-bold mt-3 text-text-primary-light dark:text-text-primary-dark">{mode.title}</h2>
              <p className="text-[11px] sm:text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">{mode.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
