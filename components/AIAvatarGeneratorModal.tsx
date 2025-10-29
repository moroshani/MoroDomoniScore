import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SparklesIcon } from './icons';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface AIAvatarGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAvatarGenerated: (base64Image: string) => void;
  playerName: string;
}

export const AIAvatarGeneratorModal: React.FC<AIAvatarGeneratorModalProps> = ({ isOpen, onClose, onAvatarGenerated, playerName }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const focusTrapRef = useFocusTrap<HTMLDivElement>(isOpen);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt) {
      setError('لطفاً یک توصیف وارد کنید.');
      return;
    }
    setIsLoading(true);
    setGeneratedImage(null);
    setError(null);

    const fullPrompt = `یک آواتار هنری برای یک بازیکن دومینو به نام ${playerName}. سبک: دیجیتال آرت، فانتزی. سوژه: ${prompt}.`;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: fullPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
      });
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
      setGeneratedImage(imageUrl);
    } catch (e) {
      console.error(e);
      setError('خطا در ساخت آواتار. لطفاً دوباره امتحان کنید.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAccept = () => {
    if (generatedImage) {
      onAvatarGenerated(generatedImage);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[60] p-4" role="dialog" aria-modal="true">
      <div ref={focusTrapRef} className="glass-card rounded-3xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6 text-center">ساخت آواتار با هوش مصنوعی</h2>
        
        <div className="w-full aspect-square bg-gray-500/10 dark:bg-black/20 rounded-2xl mb-6 flex items-center justify-center">
          {isLoading && <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>}
          {error && <p className="text-red-500 text-center p-4">{error}</p>}
          {generatedImage && <img src={generatedImage} alt="Generated Avatar" className="w-full h-full object-cover rounded-2xl" />}
          {!isLoading && !generatedImage && !error && <SparklesIcon className="w-24 h-24 text-gray-400 dark:text-gray-600" />}
        </div>

        {!generatedImage && (
          <div className="space-y-4">
            <p className="text-center text-[var(--color-text-secondary)]">توصیف کوتاهی از آواتار مورد نظر خود ارائه دهید.</p>
            <input 
              type="text" 
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="مثال: یک شیر با تاج طلایی"
              className="form-input"
            />
            <button onClick={handleGenerate} disabled={isLoading} className="btn-primary">
              <SparklesIcon className="w-5 h-5 ms-2" />
              {isLoading ? 'در حال ساخت...' : 'ساخت آواتار'}
            </button>
          </div>
        )}

        {generatedImage && (
          <div className="grid grid-cols-2 gap-4">
            <button onClick={handleGenerate} disabled={isLoading} className="btn-secondary">
              {isLoading ? 'در حال ساخت...' : 'ساخت دوباره'}
            </button>
            <button onClick={handleAccept} className="btn-primary" style={{backgroundColor: 'var(--color-accent-success)'}}>
              تایید و ذخیره
            </button>
          </div>
        )}
        
        <button onClick={onClose} className="w-full mt-4 bg-transparent text-gray-600 dark:text-gray-400 font-bold py-2 rounded-lg hover:bg-gray-500/10">
          انصراف
        </button>
      </div>
    </div>
  );
};