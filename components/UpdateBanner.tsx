import React from 'react';
import { usePwa } from '../context/PwaContext';

export const UpdateBanner: React.FC = () => {
  const { updateAvailable, applyUpdate, dismissUpdate } = usePwa();
  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-28 md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md">
      <div className="bg-slate-900/90 text-white px-4 py-3 rounded-2xl shadow-lg space-y-2">
        <p className="text-sm">نسخه جدید آماده است. فقط با تایید شما اعمال می‌شود.</p>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={dismissUpdate}
            className="text-xs bg-white/10 text-white px-3 py-1.5 rounded-full"
          >
            بعداً
          </button>
          <button
            onClick={applyUpdate}
            className="text-xs bg-primary text-white px-3 py-1.5 rounded-full"
          >
            بروزرسانی
          </button>
        </div>
      </div>
    </div>
  );
};
