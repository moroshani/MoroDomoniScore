import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

type InstallPlatform = 'android' | 'ios' | 'desktop' | 'unsupported';

interface PwaContextValue {
  canInstall: boolean;
  install: () => Promise<void>;
  updateAvailable: boolean;
  applyUpdate: () => void;
  dismissUpdate: () => void;
  checkForUpdate: () => Promise<boolean>;
  isCheckingForUpdate: boolean;
  lastUpdateCheckAt: string | null;
  isStandalone: boolean;
  installPlatform: InstallPlatform;
  installInstructions: string[];
  serviceWorkerSupported: boolean;
  isLikelySafariIOS: boolean;
  showManualInstallHelp: boolean;
  manualInstallTitle: string;
  installHelpTone: 'native' | 'manual' | 'limited';
}

const PwaContext = createContext<PwaContextValue | undefined>(undefined);

const isTouchMac = () => navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

export const PwaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installPlatform, setInstallPlatform] = useState<InstallPlatform>('unsupported');
  const [isCheckingForUpdate, setIsCheckingForUpdate] = useState(false);
  const [lastUpdateCheckAt, setLastUpdateCheckAt] = useState<string | null>(null);
  const [isLikelySafariIOS, setIsLikelySafariIOS] = useState(false);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const shouldReloadOnControllerChange = useRef(false);
  const serviceWorkerSupported = typeof window !== 'undefined' && 'serviceWorker' in navigator;

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent) || isTouchMac();
    const isAndroid = userAgent.includes('android');
    const isDesktop = !isIOS && !isAndroid;
    const isSafari = /safari/.test(userAgent) && !/crios|fxios|edgios|opios|mercury/.test(userAgent);

    setIsLikelySafariIOS(isIOS && isSafari);

    if (isIOS) {
      setInstallPlatform('ios');
      return;
    }
    if (isAndroid) {
      setInstallPlatform('android');
      return;
    }
    if (isDesktop) {
      setInstallPlatform('desktop');
      return;
    }
    setInstallPlatform('unsupported');
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(display-mode: standalone)');
    const updateStandalone = () => {
      const standalone = media.matches || (window.navigator as any).standalone;
      setIsStandalone(!!standalone);
    };

    updateStandalone();
    media.addEventListener('change', updateStandalone);
    window.addEventListener('appinstalled', updateStandalone);

    return () => {
      media.removeEventListener('change', updateStandalone);
      window.removeEventListener('appinstalled', updateStandalone);
    };
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const installEvent = event as InstallPromptEvent;
      if (typeof installEvent.prompt !== 'function') return;
      setInstallPrompt(installEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    if (!serviceWorkerSupported) return;

    const listenForUpdate = (reg: ServiceWorkerRegistration) => {
      if (reg.waiting) {
        setWaitingWorker(reg.waiting);
        setUpdateAvailable(true);
      }

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setWaitingWorker(newWorker);
            setUpdateAvailable(true);
          }
        });
      });
    };

    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        registrationRef.current = reg;
        listenForUpdate(reg);
      })
      .catch(() => {});

    const onControllerChange = () => {
      if (!shouldReloadOnControllerChange.current) return;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, [serviceWorkerSupported]);

  const install = async () => {
    if (!installPrompt) return;
    try {
      await installPrompt.prompt();
      await installPrompt.userChoice;
    } finally {
      setInstallPrompt(null);
    }
  };

  const applyUpdate = () => {
    if (!waitingWorker) return;
    shouldReloadOnControllerChange.current = true;
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    setUpdateAvailable(false);
  };

  const dismissUpdate = () => {
    setUpdateAvailable(false);
  };

  const checkForUpdate = async () => {
    if (!registrationRef.current) return false;
    setIsCheckingForUpdate(true);
    setLastUpdateCheckAt(new Date().toISOString());
    try {
      await registrationRef.current.update();
      const reg = await navigator.serviceWorker.getRegistration('/sw.js');
      if (reg?.waiting) {
        setWaitingWorker(reg.waiting);
        setUpdateAvailable(true);
        return true;
      }
      return false;
    } finally {
      setIsCheckingForUpdate(false);
    }
  };

  const value = useMemo(() => {
    const canInstall = !!installPrompt && !isStandalone;
    const showManualInstallHelp = !canInstall && !isStandalone && installPlatform === 'ios';
    const installHelpTone = canInstall
      ? 'native'
      : showManualInstallHelp
        ? 'manual'
        : 'limited';
    const manualInstallTitle = showManualInstallHelp
      ? (isLikelySafariIOS ? 'نصب دستی روی آیفون/آیپد' : 'برای نصب در iOS بهتر است Safari را باز کنید')
      : 'راهنمای نصب برنامه';

    return {
      canInstall,
      install,
      updateAvailable,
      applyUpdate,
      dismissUpdate,
      checkForUpdate,
      isCheckingForUpdate,
      lastUpdateCheckAt,
      isStandalone,
      installPlatform,
      installInstructions: (
        installPlatform === 'ios'
          ? isLikelySafariIOS
            ? [
                'این نسخه روی iPhone و iPad از Safari نصب می‌شود و دکمه نصب خودکار ندارد.',
                'در Safari دکمه اشتراک‌گذاری را بزنید.',
                'گزینه «Add to Home Screen» را انتخاب کنید.',
                'اگر گزینه نصب را نمی‌بینید، صفحه را یک بار رفرش کنید و دوباره منوی اشتراک‌گذاری را باز کنید.'
              ]
            : [
                'برای نصب روی iPhone و iPad، این صفحه را در Safari باز کنید.',
                'سپس دکمه اشتراک‌گذاری را بزنید و «Add to Home Screen» را انتخاب کنید.',
                'بعضی مرورگرهای iOS امکان نصب مستقیم PWA را نشان نمی‌دهند.'
              ]
          : installPlatform === 'android'
            ? [
                'در Chrome یا Edge دکمه Install یا «افزودن به صفحه اصلی» را بزنید.',
                'اگر بنر نصب مرورگر ظاهر شد، نصب را تایید کنید.',
                'در برخی دستگاه‌ها مرورگر به‌جای نصب کامل، میانبر صفحه اصلی می‌سازد.'
              ]
            : installPlatform === 'desktop'
              ? [
                  'در نوار آدرس مرورگر، آیکن نصب برنامه را بزنید.',
                  'در Chrome یا Edge از منوی سه‌نقطه گزینه Install را انتخاب کنید.',
                  'اگر نصب کامل پشتیبانی نشد، از نسخه وب و بوکمارک استفاده کنید.'
                ]
              : [
                  'مرورگر یا دستگاه فعلی نصب کامل PWA را پشتیبانی نمی‌کند.',
                  'برای بهترین نتیجه از Safari، Chrome یا Edge جدید استفاده کنید.',
                  'در دستگاه‌های قدیمی، میانبر صفحه اصلی بهترین جایگزین است.'
                ]
      ),
      serviceWorkerSupported,
      isLikelySafariIOS,
      showManualInstallHelp,
      manualInstallTitle,
      installHelpTone
    };
  }, [
    installPrompt,
    isStandalone,
    updateAvailable,
    isCheckingForUpdate,
    lastUpdateCheckAt,
    installPlatform,
    serviceWorkerSupported,
    isLikelySafariIOS
  ]);

  return <PwaContext.Provider value={value}>{children}</PwaContext.Provider>;
};

export const usePwa = () => {
  const context = useContext(PwaContext);
  if (!context) {
    throw new Error('usePwa must be used within a PwaProvider');
  }
  return context;
};
