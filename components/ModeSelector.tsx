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
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-gray-100 tracking-tighter">
          امتیاز شمار دومینو
        </h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          حالت بازی خود را انتخاب کنید یا به سوابق گذشته نگاهی بیندازید.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {GAME_MODES.map((mode) => (
          <button
            key={mode.type}
            onClick={() => onSelect(mode)}
            className="group glass-card rounded-3xl p-8 text-center hover:-translate-y-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-teal-500/50 hover:shadow-2xl"
          >
            <UsersIcon className="w-20 h-20 mx-auto text-teal-600 group-hover:text-teal-500 transition-colors duration-300 dark:text-teal-400" />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-6">{mode.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{mode.description}</p>
          </button>
        ))}
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <button
          onClick={onViewHistory}
          className="btn-secondary"
        >
          <HistoryIcon className="w-5 h-5 ms-3" />
          مشاهده تاریخچه بازی‌ها
        </button>
        <button
          onClick={onViewStats}
          className="btn-primary"
        >
          <ChartBarIcon className="w-5 h-5 ms-3" />
          آمار بازیکنان
        </button>
      </div>
    </div>
  );
};
