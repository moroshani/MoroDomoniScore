import React, { useState } from 'react';
import { FireIcon, ClipboardIcon } from './icons';

interface TrashTalkModalProps {
  isOpen: boolean;
  isLoading: boolean;
  text: string;
  onClose: () => void;
  onGenerate: () => void;
}

export const TrashTalkModal: React.FC<TrashTalkModalProps> = ({ isOpen, isLoading, text, onClose, onGenerate }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all scale-100 opacity-100">
        <div className="flex items-center justify-center mb-4">
            <FireIcon className="w-10 h-10 text-orange-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Gemini's Hot Take</h2>
        </div>
        
        <div className="min-h-[120px] flex items-center justify-center bg-gray-100 rounded-lg p-6 my-6">
            {isLoading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            ) : (
                <p className="text-xl italic text-gray-700">"{text}"</p>
            )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={onGenerate}
            disabled={isLoading}
            className="col-span-1 sm:col-span-2 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition disabled:bg-gray-400"
          >
            {isLoading ? 'Thinking...' : 'Generate Another'}
          </button>
          <button
            onClick={handleCopy}
            disabled={!text || isLoading}
            className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 flex items-center justify-center disabled:opacity-50"
          >
            <ClipboardIcon className="w-5 h-5 mr-2" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <button
            onClick={onClose}
            className="mt-4 text-gray-500 hover:text-gray-700 font-medium"
        >
            Close
        </button>
      </div>
    </div>
  );
};