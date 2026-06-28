import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePwa } from '../context/PwaContext';
import { useAuth } from '../context/AuthContext';

const myketUrl = import.meta.env.VITE_MYKET_APP_URL || 'https://myket.ir';
const bazaarEnabled = String(import.meta.env.VITE_ENABLE_BAZAAR || '').toLowerCase() === 'true' || String(import.meta.env.VITE_ENABLE_BAZAAR || '') === '1';
const bazaarUrl = import.meta.env.VITE_BAZAAR_APP_URL || '';
const directDownloadUrl = import.meta.env.VITE_DIRECT_DOWNLOAD_URL || '';
const directDownloadShaUrl = import.meta.env.VITE_DIRECT_DOWNLOAD_SHA256_URL || '';
const androidReleaseVersion = import.meta.env.VITE_ANDROID_RELEASE_VERSION || '';
const androidReleaseDate = import.meta.env.VITE_ANDROID_RELEASE_DATE || '';
const androidReleaseSha256 = import.meta.env.VITE_ANDROID_RELEASE_SHA256 || '';
const androidReleaseSizeBytes = import.meta.env.VITE_ANDROID_RELEASE_SIZE_BYTES || '';

export const AccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, authScreen, setAuthScreen } = useAuth();
  const { canInstall, install, installPlatform, isStandalone } = usePwa();
  const releaseSizeLabel = (() => {
    const size = Number(androidReleaseSizeBytes);
    if (!Number.isFinite(size) || size <= 0) return '';
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  })();

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 animate-fade-in">
      <header className="glass-card p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark">Dominoyar</h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
            صفحه معرفی و دسترسی عمومی: نصب اندروید، نسخه وب، PWA و دانلود مستقیم.
          </p>
        </div>
        {isAuthenticated ? (
          <button onClick={() => navigate('/')} className="btn-secondary !w-auto !px-4 !py-2 !text-xs sm:!text-sm">ورود به بازی</button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setAuthScreen('login');
                navigate('/auth');
              }}
              className="btn-primary !w-auto !px-4 !py-2 !text-xs sm:!text-sm"
            >
              ورود
            </button>
            <button
              onClick={() => {
                setAuthScreen('register');
                navigate('/auth');
              }}
              className="btn-secondary !w-auto !px-4 !py-2 !text-xs sm:!text-sm"
            >
              ثبت‌نام
            </button>
          </div>
        )}
      </header>

      <section className="glass-card p-4 sm:p-6 space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-text-primary-light dark:text-text-primary-dark">نصب اندروید</h2>
        <div className={`grid gap-3 ${bazaarEnabled && bazaarUrl ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
          <a href={myketUrl} target="_blank" rel="noreferrer" className="btn-primary text-center">نصب از مایکت</a>
          {bazaarEnabled && bazaarUrl && (
            <a href={bazaarUrl} target="_blank" rel="noreferrer" className="btn-secondary text-center">نصب از کافه‌بازار</a>
          )}
        </div>
        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
          در انتشار عمومی، مسیر اصلی نصب اندروید مایکت است. {bazaarEnabled && bazaarUrl ? 'مسیر کافه‌بازار نیز برای انتشار دو‌فروشگاهی فعال است.' : ''}
        </p>
      </section>

      <section className="glass-card p-4 sm:p-6 space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-text-primary-light dark:text-text-primary-dark">نسخه وب و PWA</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              if (isAuthenticated) {
                navigate('/');
              } else {
                setAuthScreen('login');
                navigate('/auth');
              }
            }}
            className="btn-secondary !w-auto !px-4 !py-2 !text-xs sm:!text-sm"
          >
            {isAuthenticated ? 'باز کردن بازی وب' : 'ورود به نسخه وب'}
          </button>
          {canInstall && !isStandalone && (
            <button type="button" onClick={() => { void install(); }} className="btn-primary !w-auto !px-4 !py-2 !text-xs sm:!text-sm">
              نصب PWA
            </button>
          )}
        </div>
        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
          پلتفرم فعلی: {installPlatform === 'ios' ? 'iOS' : installPlatform === 'android' ? 'Android' : installPlatform === 'desktop' ? 'Desktop' : 'Unsupported'}
        </p>
      </section>

      <section className="glass-card p-4 sm:p-6 space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-text-primary-light dark:text-text-primary-dark">دانلود مستقیم</h2>
        {directDownloadUrl ? (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <a href={directDownloadUrl} target="_blank" rel="noreferrer" className="btn-secondary !w-auto !px-4 !py-2 !text-xs sm:!text-sm inline-flex">دانلود مستقیم APK</a>
              {directDownloadShaUrl && (
                <a href={directDownloadShaUrl} target="_blank" rel="noreferrer" className="btn-secondary !w-auto !px-4 !py-2 !text-xs sm:!text-sm inline-flex">دانلود فایل SHA-256</a>
              )}
            </div>
            {(androidReleaseVersion || androidReleaseDate || androidReleaseSha256) && (
              <div className="rounded-2xl bg-slate-500/10 p-3 text-xs text-text-secondary-light dark:text-text-secondary-dark space-y-1">
                {!!androidReleaseVersion && <p>نسخه اندروید: <span className="font-semibold">{androidReleaseVersion}</span></p>}
                {!!androidReleaseDate && <p>تاریخ انتشار: <span className="font-semibold">{androidReleaseDate}</span></p>}
                {!!releaseSizeLabel && <p>حجم فایل: <span className="font-semibold">{releaseSizeLabel}</span></p>}
                {!!androidReleaseSha256 && (
                  <p className="break-all">
                    SHA-256: <span className="font-mono">{androidReleaseSha256}</span>
                  </p>
                )}
              </div>
            )}
            <div className="rounded-2xl bg-amber-500/10 border border-amber-600/30 p-3 text-xs text-amber-800 dark:text-amber-200 space-y-1">
              <p className="font-semibold">هشدار انطباق انتشار</p>
              <p>دانلود مستقیم فقط مسیر کنترل‌شده برای تست/پایلوت یا شرایط اضطراری است.</p>
              <p>پیش از نصب، مقدار SHA-256 و نسخه را با اطلاعیه رسمی انتشار تطبیق دهید.</p>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              این مسیر کنترل‌شده است. قبل از نصب، نسخه و SHA-256 را با اطلاعیه رسمی انتشار تطبیق دهید.
            </p>
          </div>
        ) : (
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
            لینک دانلود مستقیم هنوز تنظیم نشده است.
          </p>
        )}
      </section>

      {!isAuthenticated && (
        <section className="glass-card p-4 sm:p-6 space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-text-primary-light dark:text-text-primary-dark">شروع سریع</h2>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            برای استفاده از بازی، یک حساب بسازید یا وارد شوید. اگر قبلاً عضو هستید، مستقیم وارد نسخه وب شوید.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setAuthScreen(authScreen || 'login');
                navigate('/auth');
              }}
              className="btn-primary !w-auto !px-4 !py-2 !text-xs sm:!text-sm"
            >
              ورود / ثبت‌نام
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
