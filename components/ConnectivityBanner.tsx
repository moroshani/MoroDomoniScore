import React, { useEffect, useState } from 'react';

export const ConnectivityBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-[56px] left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg">
      <div className="bg-amber-500 text-white text-sm px-4 py-2 rounded-2xl shadow-lg text-center">
        اتصال اینترنت قطع است. تغییرات پس از اتصال دوباره همگام می‌شود.
      </div>
    </div>
  );
};
