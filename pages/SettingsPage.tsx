import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePwa } from '../context/PwaContext';
import { useAuth } from '../context/AuthContext';
import { PwaInstallGuide } from '../components/PwaInstallGuide';
import { getHapticsEnabled, getSoundEnabled, setHapticsEnabled, setSoundEnabled } from '../lib/preferences';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isOfflineSession } = useAuth();
  const {
    isStandalone,
    updateAvailable,
    applyUpdate,
    checkForUpdate,
    isCheckingForUpdate,
    lastUpdateCheckAt,
    installPlatform,
    showManualInstallHelp,
    isLikelySafariIOS
  } = usePwa();
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [hapticsEnabled, setHapticsEnabledState] = useState(true);
  const [updateCheckMessage, setUpdateCheckMessage] = useState('');

  useEffect(() => {
    setSoundEnabledState(getSoundEnabled());
    setHapticsEnabledState(getHapticsEnabled());
  }, []);

  const handleSoundToggle = () => {
    const nextValue = !soundEnabled;
    setSoundEnabledState(nextValue);
    setSoundEnabled(nextValue);
  };

  const handleHapticsToggle = () => {
    const nextValue = !hapticsEnabled;
    setHapticsEnabledState(nextValue);
    setHapticsEnabled(nextValue);
  };

  const handleCheckForUpdate = async () => {
    const found = await checkForUpdate();
    setUpdateCheckMessage(found ? 'نسخه جدید پیدا شد. می توانید همین الان اعمال کنید.' : 'هم اکنون نسخه شما به روز است.');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 animate-fade-in">
      {isOfflineSession && (
        <section className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-text-secondary-light dark:text-text-secondary-dark">
          حالت آفلاین فعال است. شما با جلسه ذخیره‌شده محلی وارد شده‌اید و برخی عملیات شبکه‌ای تا اتصال دوباره در دسترس نیست.
        </section>
      )}
      <header className="glass-card p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark">تنظیمات برنامه</h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
            تنظیمات پایه تجربه کاربری و نصب برنامه در این صفحه قرار دارد.
          </p>
        </div>
        <button onClick={() => navigate('/')} className="btn-secondary !w-auto !px-4 !py-2 !text-xs sm:!text-sm">بازگشت</button>
      </header>

      <section className="glass-card p-4 sm:p-6 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-text-primary-light dark:text-text-primary-dark">تجربه کاربری</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">صدا</label>
            <button onClick={handleSoundToggle} className="btn-secondary !justify-between">
              <span>وضعیت</span>
              <span>{soundEnabled ? 'روشن' : 'خاموش'}</span>
            </button>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">لرزش</label>
            <button onClick={handleHapticsToggle} className="btn-secondary !justify-between">
              <span>وضعیت</span>
              <span>{hapticsEnabled ? 'روشن' : 'خاموش'}</span>
            </button>
          </div>
        </div>
        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
          این تنظیمات در حافظه محلی دستگاه ذخیره می شوند و روی تجربه بازی سریع اثر می گذارند.
        </p>
      </section>

      <PwaInstallGuide />

      <section className="glass-card p-4 sm:p-6 space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-text-primary-light dark:text-text-primary-dark">نسخه نصب شده و بروزرسانی</h2>
        <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-1">
          <p>حالت نصب شده: <span className="font-semibold">{isStandalone ? 'بله' : 'خیر'}</span></p>
          <p>پلتفرم تشخیص داده‌شده: <span className="font-semibold">{installPlatform === 'ios' ? 'آی‌اواس' : installPlatform === 'android' ? 'اندروید' : installPlatform === 'desktop' ? 'دسکتاپ' : 'ناسازگار/قدیمی'}</span></p>
        </div>
        {showManualInstallHelp && installPlatform === 'ios' && (
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-text-secondary-light dark:text-text-secondary-dark">
            {isLikelySafariIOS
              ? 'روی iPhone و iPad، نصب برنامه از مسیر Share > Add to Home Screen انجام می‌شود و iOS دکمه نصب خودکار وب‌اپ را نشان نمی‌دهد.'
              : 'اگر از مرورگری غیر از Safari استفاده می‌کنید، برای نصب برنامه این صفحه را در Safari باز کنید.'}
          </div>
        )}
        {installPlatform === 'ios' && (
          <div className="rounded-2xl bg-slate-500/10 p-3 text-xs text-text-secondary-light dark:text-text-secondary-dark">
            نکته: پس از نصب روی iOS، برای دریافت نسخه جدید ممکن است لازم باشد برنامه را کامل ببندید و دوباره باز کنید.
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCheckForUpdate}
            disabled={isCheckingForUpdate}
            className="btn-secondary !w-auto !px-4 !py-2 !text-xs sm:!text-sm"
          >
            {isCheckingForUpdate ? 'در حال بررسی...' : 'بررسی بروزرسانی'}
          </button>
          {updateAvailable && (
            <button
              type="button"
              onClick={applyUpdate}
              className="btn-primary !w-auto !px-4 !py-2 !text-xs sm:!text-sm"
            >
              اعمال بروزرسانی جدید
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="btn-secondary !w-auto !px-4 !py-2 !text-xs sm:!text-sm"
          >
            رفتن به پروفایل
          </button>
          <button
            type="button"
            onClick={() => navigate('/access')}
            className="btn-secondary !w-auto !px-4 !py-2 !text-xs sm:!text-sm"
          >
            راه‌های دسترسی
          </button>
        </div>
        {!updateAvailable && (
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">در حال حاضر نسخه جدیدی در صف نصب نیست.</p>
        )}
        {!!updateCheckMessage && (
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{updateCheckMessage}</p>
        )}
        {!!lastUpdateCheckAt && (
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
            آخرین بررسی: {new Date(lastUpdateCheckAt).toLocaleString('fa-IR')}
          </p>
        )}
      </section>
    </div>
  );
};
