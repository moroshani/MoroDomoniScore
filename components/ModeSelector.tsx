import React from 'react';
import { GAME_MODES } from '../constants';
import type { GameModeDetails } from '../types';
import { UsersIcon, HistoryIcon, ChartBarIcon } from './icons';

interface ModeSelectorProps {
  onSelect: (mode: GameModeDetails) => void;
  onViewHistory: () => void;
  onViewStats: () => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelect, onViewHistory, onViewStats }) => {
  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-5xl md:text-7xl font-black text-text-primary-light dark:text-text-primary-dark">
          امتیاز شمار دومینو
        </h1>
        <p className="text-lg md:text-xl text-text-secondary-light dark:text-text-secondary-dark mt-4">
          حالت بازی خود را انتخاب کنید یا به سوابق گذشته نگاهی بیندازید.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {GAME_MODES.map((mode) => (
          <button
            key={mode.type}
            onClick={() => onSelect(mode)}
            className="glass-card text-center p-8 h-full w-full transform hover:-translate-y-2 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-primary/50"
          >
            <div className="flex flex-col items-center">
              <UsersIcon className="w-24 h-24 mx-auto text-primary" />
              <h2 className="text-3xl font-bold mt-6 text-text-primary-light dark:text-text-primary-dark">{mode.title}</h2>
              <p className="text-md text-text-secondary-light dark:text-text-secondary-dark mt-2">{mode.description}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={onViewStats}
          className="btn-primary"
        >
          <ChartBarIcon className="w-6 h-6" />
          <span>آمار بازیکنان</span>
        </button>
        <button
          onClick={onViewHistory}
          className="btn-secondary"
        >
          <HistoryIcon className="w-6 h-6" />
          <span>مشاهده تاریخچه بازی‌ها</span>
        </button>
      </div>
    </div>
  );
};
