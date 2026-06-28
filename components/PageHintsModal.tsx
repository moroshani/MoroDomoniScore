import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useGame } from '../context/GameContext';
import type { GameModeDetails } from '../types';
import { GameScreen } from '../types';

interface PageHintsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PageHints {
  title: string;
  tips: string[];
}

const resolveHints = (path: string, gameScreen: GameScreen, gameMode: GameModeDetails | null): PageHints => {
  if (path.startsWith('/profile')) {
    return {
      title: 'راهنمای پروفایل',
      tips: [
        'نام، ایمیل و نام کاربری را از همین صفحه بروزرسانی کنید.',
        'برای تغییر رمز عبور، ابتدا رمز فعلی را وارد کنید.',
        'حساب مدیر اصلی قابل حذف نیست.'
      ]
    };
  }
  if (path.startsWith('/settings')) {
    return {
      title: 'راهنمای تنظیمات',
      tips: [
        'تنظیمات صدا و لرزش برای نسخه آنلاین و نصب‌شده یکسان است.',
        'راهنمای نصب برنامه براساس نوع دستگاه نمایش داده می‌شود.',
        'در صورت وجود نسخه جدید، بروزرسانی را از همین صفحه اعمال کنید.'
      ]
    };
  }
  if (gameScreen === GameScreen.ModeSelection) {
    return {
      title: 'راهنمای شروع بازی',
      tips: [
        'حالت ۲، ۳ یا ۴ نفره را انتخاب کنید.',
        'در مرحله بعد فقط نام طرف های بازی و قوانین را تعیین می کنید.',
        'بازی سریع موقت است و چیزی برای بلندمدت ذخیره نمی شود.'
      ]
    };
  }
  if (gameScreen === GameScreen.NameSetup) {
    return {
      title: 'راهنمای ورود نام ها',
      tips: [
        'برای هر طرف بازی فقط نام را وارد کنید.',
        'در حالت ۴ نفره فقط نام دو تیم را وارد کنید.',
        'امتیاز برد، تعداد بازی هر ست و ست های شب را تعیین کنید.',
        'این اطلاعات فقط برای همین بازی استفاده می شود.'
      ]
    };
  }
  return {
    title: 'راهنمای امتیازدهی',
    tips: [
      'امتیاز هر تیم را در کادر مربوط وارد کنید.',
      'واگرد فقط آخرین دور را لغو می‌کند.',
      'برای دیدن جزئیات بیشتر، گزارش دورها را باز کنید.'
    ]
  };
};

export const PageHintsModal: React.FC<PageHintsModalProps> = ({ isOpen, onClose }) => {
  const focusTrapRef = useFocusTrap<HTMLDivElement>(isOpen);
  const location = useLocation();
  const { gameScreen, gameMode } = useGame();
  const hints = useMemo(() => resolveHints(location.pathname, gameScreen, gameMode), [location.pathname, gameScreen, gameMode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true">
      <div ref={focusTrapRef} className="glass-card rounded-3xl p-6 max-w-lg w-full text-right">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">{hints.title}</h2>
          <button onClick={onClose} className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary">بستن</button>
        </div>
        <ul className="space-y-3 text-text-secondary-light dark:text-text-secondary-dark">
          {hints.tips.map((tip, index) => (
            <li key={`${tip}-${index}`} className="flex items-start gap-2">
              <span className="mt-1 inline-block w-2 h-2 rounded-full bg-primary" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
