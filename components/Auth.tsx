import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AtSymbolIcon, LockClosedIcon, UserCircleIcon, DominoLogoIcon, EyeIcon, EyeSlashIcon } from './icons';
import { getRememberMePreference, setRememberMePreference } from '../lib/api';

export const Auth: React.FC = () => {
  const { authScreen, setAuthScreen, login, register, isLoading, isOfflineSession } = useAuth();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(getRememberMePreference);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (authScreen === 'login') {
        await login(identifier, password, rememberMe);
      } else {
        await register(name, username, email, password, true);
      }
    } catch (error) {
      console.error('Authentication failed', error);
    }
  };

  const isLogin = authScreen === 'login';

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      {isOfflineSession && (
        <div className="mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-text-secondary-light dark:text-text-secondary-dark">
          حالت آفلاین فعال است. با اتصال قطع، از جلسه ذخیره‌شده محلی استفاده می‌کنید.
        </div>
      )}
      <div className="text-center mb-6">
        <DominoLogoIcon className="w-16 h-16 mx-auto text-primary mb-3" />
        <h1 className="text-2xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">
          {isLogin ? 'خوش آمدید' : 'ایجاد حساب کاربری'}
        </h1>
        <p className="text-sm sm:text-lg text-text-secondary-light dark:text-text-secondary-dark mt-2">
          {isLogin ? 'برای ادامه وارد حساب خود شوید' : 'برای شروع یک حساب جدید بسازید'}
        </p>
      </div>

      <div className="glass-card p-5 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {!isLogin && (
            <>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary-light dark:text-text-secondary-dark">
                  <UserCircleIcon className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  placeholder="نام کامل"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input pr-10"
                  required
                />
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary-light dark:text-text-secondary-dark">
                  <AtSymbolIcon className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  placeholder="نام کاربری"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input pr-10"
                  required
                />
              </div>
            </>
          )}
          {isLogin ? (
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary-light dark:text-text-secondary-dark">
                <AtSymbolIcon className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="ایمیل یا نام کاربری"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="form-input pr-10"
                required
              />
            </div>
          ) : (
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary-light dark:text-text-secondary-dark">
                <AtSymbolIcon className="w-5 h-5" />
              </span>
              <input
                type="email"
                placeholder="ایمیل"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input pr-10"
                required
              />
            </div>
          )}
          <div className="relative">
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary-light dark:text-text-secondary-dark">
              <LockClosedIcon className="w-5 h-5" />
            </span>
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="رمز عبور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input pr-10 pl-12"
              required
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible((value) => !value)}
              className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary"
              aria-label={isPasswordVisible ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'}
            >
              {isPasswordVisible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
          {isLogin && (
            <label className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => {
                  const value = event.target.checked;
                  setRememberMe(value);
                  setRememberMePreference(value);
                }}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              مرا به خاطر بسپار
            </label>
          )}

          <button type="submit" className="btn-primary w-full !text-base sm:!text-lg" disabled={isLoading}>
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (isLogin ? 'ورود' : 'ثبت نام')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          <span className="text-text-secondary-light dark:text-text-secondary-dark">
            {isLogin ? 'حساب کاربری ندارید؟' : 'قبلاً ثبت نام کرده اید؟'}
          </span>
          <button
            onClick={() => setAuthScreen(isLogin ? 'register' : 'login')}
            className="font-semibold text-primary hover:underline ml-1"
          >
            {isLogin ? 'ثبت نام کنید' : 'وارد شوید'}
          </button>
        </p>
      </div>
    </div>
  );
};
