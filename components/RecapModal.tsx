import React, { useState } from 'react';
import { SparklesIcon, ClipboardIcon } from './icons';
import { useFocusTrap } from '../hooks/useFocusTrap';
import type { NightRecord, Team } from '../types';

interface RecapModalProps {
  isOpen: boolean;
  isLoading: boolean;
  content: string;
  onNewNight: () => void;
  nightRecord: NightRecord | null;
  teams: Team[];
}

export const RecapModal: React.FC<RecapModalProps> = ({ isOpen, isLoading, content, onNewNight, nightRecord, teams }) => {
  const [copied, setCopied] = useState(false);
  const focusTrapRef = useFocusTrap<HTMLDivElement>(isOpen);

  if (!isOpen) return null;

  const nightWinner = teams.find(t => t.id === nightRecord?.nightWinnerTeamId);

  const generateTextSummary = () => {
    if (!nightRecord || !nightWinner) return "خلاصه‌ای برای اشتراک‌گذاری موجود نیست.";
    
    let summary = `خلاصه شب بازی دومینو - ${new Date(nightRecord.date).toLocaleDateString('fa-IR')}\n`;
    summary += `-----------------------------------\n`;
    summary += `🏆 برنده بزرگ امشب: ${nightWinner.name} 🏆\n\n`;
    summary += `امتیاز نهایی ست‌ها:\n`;
    teams.forEach(t => {
      summary += `- ${t.name}: ${t.setsWon} ست\n`;
    });
    summary += `\nخلاصه شب:\n"${content}"`;
    return summary;
  };

  const handleCopy = () => {
    const summaryText = generateTextSummary();
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const formattedContent = content.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true">
      <div ref={focusTrapRef} className="glass-card rounded-3xl p-8 max-w-lg w-full text-center transform transition-all scale-100 opacity-100">
        <div className="flex items-center justify-center mb-6">
            <SparklesIcon className="w-12 h-12 text-[var(--color-accent-primary)] ms-3" />
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">خلاصه شبانه</h2>
        </div>
        
        <div className="min-h-[200px] bg-gray-500/10 dark:bg-black/20 rounded-2xl p-6 my-6 text-start">
            {nightWinner && (
                <div className="text-center mb-4 border-b-2 border-[var(--color-border)] pb-4">
                    <p className="text-md text-[var(--color-text-secondary)]">برنده امشب</p>
                    <p className="text-3xl font-black text-[var(--color-accent-warning)]">{nightWinner.name}</p>
                </div>
            )}
            <h3 className="font-bold text-[var(--color-text-primary)] mb-2">خلاصه شب:</h3>
            {isLoading ? (
                <div className="flex justify-center items-center h-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent-primary)]"></div>
                </div>
            ) : (
                <blockquote className="text-base text-[var(--color-text-secondary)] italic border-r-4 border-[var(--color-accent-primary)] pr-4">"{formattedContent}"</blockquote>
            )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={onNewNight}
            className="col-span-1 sm:col-span-2 btn-primary"
          >
            شروع یک شب جدید
          </button>
          <button
            onClick={handleCopy}
            disabled={!content || isLoading}
            className="w-full bg-white/60 dark:bg-black/20 text-[var(--color-text-primary)] font-bold py-3 px-4 rounded-xl hover:bg-white/80 dark:hover:bg-black/30 focus:outline-none focus:ring-4 focus:ring-gray-400/50 flex items-center justify-center disabled:opacity-50 transition"
          >
            <ClipboardIcon className="w-5 h-5 ms-2" />
            {copied ? 'کپی شد!' : 'کپی'}
          </button>
        </div>
      </div>
    </div>
  );
};
