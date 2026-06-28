import React from 'react';
import { usePwa } from '../context/PwaContext';

export const PwaInstallGuide: React.FC = () => {
  const {
    canInstall,
    install,
    updateAvailable,
    applyUpdate,
    checkForUpdate,
    isCheckingForUpdate,
    lastUpdateCheckAt,
    isStandalone,
    installPlatform,
    installInstructions,
    serviceWorkerSupported,
    showManualInstallHelp,
    manualInstallTitle,
    installHelpTone,
    isLikelySafariIOS
  } = usePwa();

  const platformLabel = (
    installPlatform === 'ios'
      ? 'آی‌اواس'
      : installPlatform === 'android'
        ? 'اندروید'
        : installPlatform === 'desktop'
          ? 'دسکتاپ'
          : 'قدیمی/ناسازگار'
  );

  const toneClass = installHelpTone === 'native'
    ? 'bg-emerald-500/10 border-emerald-500/30'
    : installHelpTone === 'manual'
      ? 'bg-amber-500/10 border-amber-500/30'
      : 'bg-slate-500/10 border-slate-500/20';

  return (
    <section className="glass-card p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-text-primary-light dark:text-text-primary-dark">نصب برنامه روی دستگاه</h2>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">{manualInstallTitle}</p>
        </div>
        <span className="text-xs rounded-full bg-slate-500/10 px-3 py-1 text-text-secondary-light dark:text-text-secondary-dark">
          {platformLabel}
        </span>
      </div>

      <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-1">
        <p>وضعیت نصب‌شده: <span className="font-semibold">{isStandalone ? 'بله' : 'خیر'}</span></p>
        <p>پشتیبانی سرویس‌ورکر: <span className="font-semibold">{serviceWorkerSupported ? 'بله' : 'خیر'}</span></p>
        {installPlatform === 'ios' && !isStandalone && (
          <p>نوع نصب در iOS: <span className="font-semibold">{isLikelySafariIOS ? 'دستی از Safari' : 'نیازمند باز شدن در Safari'}</span></p>
        )}
      </div>

      <div className={`rounded-2xl border p-3 sm:p-4 ${toneClass}`}>
        <ul className="space-y-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
          {installInstructions.map((step, index) => (
            <li key={`${step}-${index}`} className="flex items-start gap-2">
              <span className="mt-1 inline-block w-2 h-2 rounded-full bg-primary" />
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {showManualInstallHelp && (
        <div className="rounded-2xl bg-slate-500/10 p-3 text-xs text-text-secondary-light dark:text-text-secondary-dark">
          در iPhone و iPad، وب‌اپ‌ها معمولاً دکمه نصب خودکار ندارند. این محدودیت از Safari و خود iOS می‌آید، نه از برنامه.
        </div>
      )}

      {installPlatform === 'ios' && !isStandalone && (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-text-secondary-light dark:text-text-secondary-dark space-y-1">
          <p className="font-semibold">اگر نصب انجام نشد:</p>
          <p>1) صفحه را در Safari باز کنید (نه مرورگرهای دیگر iOS).</p>
          <p>2) یک بار صفحه را رفرش کنید و دوباره Share را باز کنید.</p>
          <p>3) اگر گزینه Add to Home Screen نبود، تب را ببندید و دوباره باز کنید.</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {canInstall && !isStandalone && (
          <button type="button" onClick={install} className="btn-primary !w-auto !px-4 !py-2 !text-xs sm:!text-sm">
            نصب برنامه
          </button>
        )}
        <button
          type="button"
          onClick={() => { void checkForUpdate(); }}
          disabled={isCheckingForUpdate}
          className="btn-secondary !w-auto !px-4 !py-2 !text-xs sm:!text-sm"
        >
          {isCheckingForUpdate ? 'در حال بررسی...' : 'بررسی نسخه جدید'}
        </button>
        {updateAvailable && (
          <button type="button" onClick={applyUpdate} className="btn-secondary !w-auto !px-4 !py-2 !text-xs sm:!text-sm">
            اعمال بروزرسانی
          </button>
        )}
      </div>
      {lastUpdateCheckAt && (
        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
          آخرین بررسی: {new Date(lastUpdateCheckAt).toLocaleString('fa-IR')}
        </p>
      )}
    </section>
  );
};
