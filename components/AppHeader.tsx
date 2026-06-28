import React, { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Bars3Icon,
  LogoutIcon,
  QuestionMarkCircleIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  DevicePhoneMobileIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  DominoLogoIcon
} from './icons';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useUIActions } from '../context/UIActionsContext';
import { usePwa } from '../context/PwaContext';

interface AppHeaderProps {
  isAuthenticated: boolean;
  userName?: string | null;
  userAvatar?: string | null;
  onLogout: () => void;
  theme: string;
  toggleTheme: () => void;
  onOpenHints: () => void;
  compact?: boolean;
}

const drawerLinkClass = 'flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800';

export const AppHeader: React.FC<AppHeaderProps> = ({
  isAuthenticated,
  userName,
  userAvatar,
  onLogout,
  theme,
  toggleTheme,
  onOpenHints,
  compact = false
}) => {
  const { actions } = useUIActions();
  const { canInstall, install, isStandalone, showManualInstallHelp, installPlatform } = usePwa();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const hasGameTools = useMemo(
    () => !!(actions.toggleSound || actions.toggleHaptics),
    [actions]
  );

  useEffect(() => {
    if (!isMenuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full overflow-x-clip">
      <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-b border-white/30 dark:border-slate-700/40">
        <div className={`max-w-7xl mx-auto px-3 sm:px-4 ${compact ? 'py-1.5' : 'py-2'} flex items-center justify-between gap-2`}>
          <div className="flex items-center gap-2 min-w-0">
            <NavLink to="/" className="flex items-center gap-2 text-sm sm:text-base font-extrabold min-w-0">
              <DominoLogoIcon className="w-7 h-7 text-primary shrink-0" />
              <span className="text-primary truncate">دومینو</span>
              <span className="text-text-secondary-light dark:text-text-secondary-dark hidden sm:inline truncate">امتیازشمار</span>
            </NavLink>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAuthenticated && !compact && (
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-slate-500/10 px-2 py-1 max-w-[12rem]">
                {userAvatar ? (
                  userAvatar.startsWith('data:image') ? (
                    <img src={userAvatar} alt="user avatar" className="w-6 h-6 rounded-full object-cover border border-slate-300 dark:border-slate-700" />
                  ) : (
                    <span className="w-6 h-6 rounded-full flex items-center justify-center bg-slate-500/20 text-xs">{userAvatar}</span>
                  )
                ) : (
                  <span className="w-6 h-6 rounded-full flex items-center justify-center bg-slate-500/20 text-xs">👤</span>
                )}
                <span className="hidden xl:inline text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark truncate">
                  {userName}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="px-3 py-2 rounded-full bg-slate-500/10 hover:bg-slate-500/20 flex items-center gap-1.5"
              aria-label="باز کردن منو"
            >
              <Bars3Icon className="w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark" />
              <span className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark hidden sm:inline">منو</span>
            </button>
          </div>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        />
        <aside
          className={`absolute top-0 right-0 h-full w-80 max-w-[90vw] bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 transform transition-transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          aria-hidden={!isMenuOpen}
        >
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="font-bold text-text-primary-light dark:text-text-primary-dark">منو</span>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm text-text-secondary-light dark:text-text-secondary-dark"
            >
              بستن
            </button>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-56px)]">
            <div className="space-y-2">
              <NavLink to="/" onClick={() => setIsMenuOpen(false)} className={drawerLinkClass}>
                <DominoLogoIcon className="w-4 h-4" />
                بازی سریع
              </NavLink>
              {isAuthenticated && (
                <NavLink to="/profile" onClick={() => setIsMenuOpen(false)} className={drawerLinkClass}>
                  <UserCircleIcon className="w-4 h-4" />
                  پروفایل
                </NavLink>
              )}
              {isAuthenticated && (
                <NavLink to="/settings" onClick={() => setIsMenuOpen(false)} className={drawerLinkClass}>
                  <Cog6ToothIcon className="w-4 h-4" />
                  تنظیمات
                </NavLink>
              )}
              {isAuthenticated && (
                <NavLink to="/access" onClick={() => setIsMenuOpen(false)} className={drawerLinkClass}>
                  <DevicePhoneMobileIcon className="w-4 h-4" />
                  راه‌های دسترسی
                </NavLink>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                onOpenHints();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-500/10 text-text-secondary-light dark:text-text-secondary-dark hover:bg-slate-500/20"
            >
              <QuestionMarkCircleIcon className="w-4 h-4" />
              راهنمای صفحه
            </button>

            {canInstall && !isStandalone && (
              <button
                type="button"
                onClick={() => {
                  void install();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-primary text-white"
              >
                نصب برنامه
              </button>
            )}

            {showManualInstallHelp && installPlatform === 'ios' && (
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-3 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                در iPhone و iPad، نصب از داخل Safari و با گزینه Add to Home Screen انجام می‌شود.
              </div>
            )}

            {hasGameTools && (
              <div className="space-y-2">
                <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">ابزار بازی</div>
                <button
                  type="button"
                  onClick={() => actions.toggleSound?.()}
                  disabled={!actions.toggleSound}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-500/10 hover:bg-slate-500/20 disabled:opacity-50"
                >
                  {actions.soundEnabled ? <SpeakerWaveIcon className="w-4 h-4" /> : <SpeakerXMarkIcon className="w-4 h-4" />}
                  {actions.soundEnabled ? 'قطع صدا' : 'وصل صدا'}
                </button>
                <button
                  type="button"
                  onClick={() => actions.toggleHaptics?.()}
                  disabled={!actions.toggleHaptics}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-500/10 hover:bg-slate-500/20 disabled:opacity-50"
                >
                  <DevicePhoneMobileIcon className="w-4 h-4" />
                  {actions.hapticsEnabled ? 'غیرفعال کردن لرزش' : 'فعال کردن لرزش'}
                </button>
              </div>
            )}

            <div className="flex items-center justify-between rounded-xl bg-slate-500/10 px-3 py-2">
              <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">حالت نمایش</span>
              <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
            </div>

            {isAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-500/20"
              >
                <LogoutIcon className="w-4 h-4" />
                خروج از حساب
              </button>
            )}
          </div>
        </aside>
      </div>
    </header>
  );
};
