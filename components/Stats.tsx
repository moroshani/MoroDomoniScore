import React, { useState, useEffect } from 'react';
import { getHistory } from '../lib/storage';
import { calculatePlayerStats, calculateHeadToHeadStats } from '../lib/stats';
import type { PlayerStats, HeadToHeadStats } from '../types';
import { CrownIcon, SparklesIcon, TrophyIcon } from './icons';
import { AIAnalysisModal } from './AIAnalysisModal';
import { BarChart } from './charts/BarChart';
import { GoogleGenAI } from '@google/genai';

interface StatsProps {
  onBack: () => void;
}

const PlayerAvatar: React.FC<{ avatar?: string; className?: string }> = ({ avatar, className = "w-24 h-24" }) => {
    if (!avatar) return <span className={`${className} flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-5xl`}>👤</span>;
    if (avatar.startsWith('data:image')) {
        return <img src={avatar} alt="player avatar" className={`${className} rounded-full object-cover mx-auto shadow-lg border-4 border-white dark:border-gray-800`} />;
    }
    return <span className={`${className} flex items-center justify-center mx-auto text-5xl`}>{avatar}</span>;
};


export const Stats: React.FC<StatsProps> = ({ onBack }) => {
  const [stats, setStats] = useState<PlayerStats[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerStats | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysisContent, setAnalysisContent] = useState('');

  const [h2hPlayer1, setH2hPlayer1] = useState<string>('');
  const [h2hPlayer2, setH2hPlayer2] = useState<string>('');
  const [h2hStats, setH2hStats] = useState<HeadToHeadStats | null>(null);

  useEffect(() => {
    const history = getHistory();
    const calculatedStats = calculatePlayerStats(history);
    setStats(calculatedStats);
    if (calculatedStats.length >= 2) {
        setH2hPlayer1(calculatedStats[0].name);
        setH2hPlayer2(calculatedStats[1].name);
    }
  }, []);

  useEffect(() => {
    if (h2hPlayer1 && h2hPlayer2 && h2hPlayer1 !== h2hPlayer2) {
      const history = getHistory();
      setH2hStats(calculateHeadToHeadStats(h2hPlayer1, h2hPlayer2, history));
    } else {
      setH2hStats(null);
    }
  }, [h2hPlayer1, h2hPlayer2]);

  const handleAnalyze = async (player: PlayerStats) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
    setIsLoadingAnalysis(true);
    setAnalysisContent('');

    const prompt = `
شما 'دومینو دان' هستید، یک مفسر ورزشی شوخ و مشتاق برای بازی‌های دومینو. لحن شما باید سرگرم‌کننده، کمی دراماتیک و شاد باشد. کل پاسخ شما باید به زبان فارسی باشد.

در اینجا آمار بازیکن ${player.name} آمده است:
- کل بازی‌های انجام شده: ${player.gamesPlayed}
- کل بازی‌های برده: ${player.gamesWon}
- نرخ برد: ${player.winRate}
- کل ست‌های برده: ${player.setWins}
- کل شب‌های برده شده: ${player.nightWins}
- میانگین امتیاز در هر بازی: ${player.avgPointsPerGame}

بر اساس این آمار، لطفاً یک تحلیل کوتاه و سرگرم‌کننده از سبک بازی این بازیکن ارائه دهید.
تحلیل شما باید شامل موارد زیر باشد:
1.  یک عنوان جذاب برای بازیکن.
2.  خلاصه‌ای روایی کوتاه از سبک بازی او. به نقاط قوت او اشاره کنید.
3.  یک زمینه برای بهبود به صورت شوخی و دوستانه پیشنهاد دهید.

کل پاسخ را زیر ۱۰۰ کلمه نگه دارید. خروجی را به صورت یک رشته ساده با استفاده از کاراکترهای خط جدید برای پاراگراف‌ها قالب‌بندی کنید.
`;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      setAnalysisContent(response.text);
    } catch (error) {
      console.error("Error generating analysis:", error);
      setAnalysisContent("متاسفانه، دومینو دان برای تحلیل در دسترس نیست. لطفاً بعداً دوباره امتحان کنید.");
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100">آمار بازیکنان</h1>
        <button onClick={onBack} className="btn-secondary !w-auto !py-2 !px-4 !text-sm">بازگشت به منو</button>
      </header>

      {stats.length === 0 ? (
        <div className="text-center glass-card p-12 rounded-3xl">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">آماری برای نمایش وجود ندارد</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">چند بازی انجام دهید تا آمار بازیکنان را اینجا ببینید!</p>
        </div>
      ) : (
        <div className="space-y-10">
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-card rounded-3xl p-6">
                <BarChart 
                    data={stats.map(s => ({label: s.name, value: parseFloat(s.winRate), avatar: s.avatar}))}
                    title="نرخ برد بازیکن"
                />
            </div>
            <div className="glass-card rounded-3xl p-6 flex flex-col">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 text-center">آمار رو در رو</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <select value={h2hPlayer1} onChange={e => setH2hPlayer1(e.target.value)} className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition">
                        <option value="" disabled>بازیکن ۱</option>
                        {stats.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                    </select>
                    <select value={h2hPlayer2} onChange={e => setH2hPlayer2(e.target.value)} className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition">
                        <option value="" disabled>بازیکن ۲</option>
                        {stats.filter(s => s.name !== h2hPlayer1).map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                    </select>
                </div>
                {h2hStats && (
                    <div className="text-center my-auto space-y-2">
                        <p className="text-lg font-bold">{h2hStats.player1Name} <span className="text-teal-500 dark:text-teal-400 font-black text-2xl font-numeric">{h2hStats.player1Wins}</span></p>
                        <p className="text-gray-500 dark:text-gray-400">در مقابل</p>
                         <p className="text-lg font-bold">{h2hStats.player2Name} <span className="text-teal-500 dark:text-teal-400 font-black text-2xl font-numeric">{h2hStats.player2Wins}</span></p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 pt-4">در {h2hStats.gamesPlayedTogether} بازی مشترک. ({h2hStats.ties} تساوی/هم‌تیمی)</p>
                    </div>
                )}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stats.map(player => (
              <div key={player.name} className="glass-card rounded-3xl p-6 flex flex-col text-center">
                <PlayerAvatar avatar={player.avatar} />
                <h2 className="text-3xl font-bold text-teal-700 dark:text-teal-400 mt-4 mb-4">{player.name}</h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-200 flex-grow text-lg text-right">
                  <div className="flex justify-between"><span className="font-semibold">بازی‌ها:</span><span className="font-numeric font-bold">{player.gamesPlayed}</span></div>
                  <div className="flex justify-between"><span className="font-semibold">بردهای بازی:</span><span className="font-numeric font-bold">{player.gamesWon}</span></div>
                   <div className="flex justify-between"><span className="font-semibold">بردهای ست:</span><span className="font-numeric font-bold">{player.setWins}</span></div>
                  <div className="flex justify-between"><span className="font-semibold">نرخ برد:</span><span className="font-bold text-green-600 dark:text-green-400 font-numeric">{player.winRate}</span></div>
                  <div className="flex justify-between"><span className="font-semibold">میانگین امتیاز:</span><span className="font-numeric font-bold">{player.avgPointsPerGame}</span></div>
                  <div className="flex justify-between items-center"><span className="font-semibold">شب‌های برده:</span><span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 font-numeric">{player.nightWins} <CrownIcon className="w-5 h-5"/></span></div>
                </div>
                <button onClick={() => handleAnalyze(player)} className="mt-6 w-full inline-flex items-center justify-center bg-teal-600/20 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300 font-bold py-3 px-4 rounded-lg hover:bg-teal-600/30 dark:hover:bg-teal-500/30 transition">
                    <SparklesIcon className="w-5 h-5 ms-2" />
                    تحلیل با هوش مصنوعی
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <AIAnalysisModal 
        isOpen={isModalOpen}
        isLoading={isLoadingAnalysis}
        content={analysisContent}
        title={`تحلیل عملکرد ${selectedPlayer?.name}`}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};