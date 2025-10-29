import React from 'react';
import { SunIcon, MoonIcon } from './icons';

interface ThemeSwitcherProps {
  theme: string;
  toggleTheme: () => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, toggleTheme }) => {
  return (
    <div 
      className="fixed top-4 right-4 z-50"
      aria-label="Toggle theme"
    >
      <button
        onClick={toggleTheme}
        className="w-16 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center p-1 transition-colors duration-300"
      >
        <span
          className={`w-6 h-6 rounded-full bg-white dark:bg-slate-900 shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-8' : 'translate-x-0'} flex items-center justify-center`}
        >
          {theme === 'dark' ? <MoonIcon className="w-4 h-4 text-yellow-300" /> : <SunIcon className="w-4 h-4 text-orange-500" />}
        </span>
      </button>
    </div>
  );
};
