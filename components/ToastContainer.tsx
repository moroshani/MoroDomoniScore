import React from 'react';
import { useToast } from '../context/ToastContext';

const toastStyles: Record<string, string> = {
  info: 'bg-slate-900/90 text-white',
  success: 'bg-emerald-600 text-white',
  warning: 'bg-amber-500 text-white',
  error: 'bg-red-600 text-white'
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 space-y-2 w-[90%] max-w-md">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between gap-3 ${toastStyles[toast.type] || toastStyles.info}`}
        >
          <span className="text-sm">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="text-xs opacity-80 hover:opacity-100">بستن</button>
        </div>
      ))}
    </div>
  );
};
