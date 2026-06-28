import React from 'react';
import { SunIcon, MoonIcon } from './icons';

interface ThemeSwitcherProps {
  theme: string;
  toggleTheme: () => void;
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, toggleTheme, className }) => {
  const isDark = theme === 'dark';
  return (
    <div className={className} aria-label="تغییر حالت نمایش">
      <button
        type="button"
        onClick={toggleTheme}
        className={`relative w-16 h-9 rounded-full border transition-all duration-300 ${
          isDark
            ? 'bg-slate-900 border-slate-600'
            : 'bg-gradient-to-r from-amber-100 to-sky-100 border-amber-300'
        }`}
        title={isDark ? 'تغییر به حالت روشن' : 'تغییر به حالت تیره'}
      >
        <span className="absolute inset-0 flex items-center justify-between px-2">
          <SunIcon className={`w-3.5 h-3.5 transition-opacity ${isDark ? 'opacity-35 text-slate-300' : 'opacity-100 text-amber-500'}`} />
          <MoonIcon className={`w-3.5 h-3.5 transition-opacity ${isDark ? 'opacity-100 text-cyan-300' : 'opacity-35 text-slate-400'}`} />
        </span>
        <span
          className={`absolute top-1 h-7 w-7 rounded-full shadow-md flex items-center justify-center transition-all duration-300 ${
            isDark
              ? 'right-1 bg-slate-950'
              : 'left-1 bg-white'
          }`}
        >
          {isDark ? <MoonIcon className="w-4 h-4 text-cyan-300" /> : <SunIcon className="w-4 h-4 text-orange-500" />}
        </span>
      </button>
    </div>
  );
};
