import React from 'react';
import { SparklesIcon } from './icons';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface AIAnalysisModalProps {
  isOpen: boolean;
  isLoading: boolean;
  content: string;
  title: string;
  onClose: () => void;
}

export const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({ isOpen, isLoading, content, title, onClose }) => {
  const focusTrapRef = useFocusTrap<HTMLDivElement>(isOpen);
  if (!isOpen) return null;

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
            <SparklesIcon className="w-12 h-12 text-teal-500 dark:text-teal-400 ms-3" />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
        </div>
        
        <div className="min-h-[200px] flex items-center justify-center bg-gray-500/10 dark:bg-gray-900/20 rounded-2xl p-6 my-6 text-start">
            {isLoading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            ) : (
                <blockquote className="text-base text-gray-700 dark:text-gray-200 border-r-4 border-teal-500 pr-4">{formattedContent}</blockquote>
            )}
        </div>

        <button
            onClick={onClose}
            className="btn-primary"
          >
            بستن
          </button>
      </div>
    </div>
  );
};
