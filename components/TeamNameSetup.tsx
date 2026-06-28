import React, { useMemo, useState } from 'react';
import type { GameModeDetails, Player } from '../types';

interface TeamNameSetupProps {
  mode: GameModeDetails;
  onSubmit: (playersByTeam: Player[][], teamNames: string[], pointCap: number, gamesPerSet: number, setsPerNight: number) => void;
  onBack: () => void;
}

export const TeamNameSetup: React.FC<TeamNameSetupProps> = ({ mode, onSubmit, onBack }) => {
  const [teamNames, setTeamNames] = useState<string[]>(() => Array.from({ length: mode.teams }, (_, index) => mode.playersPerTeam > 1 ? `تیم ${index + 1}` : ''));
  const [pointCap, setPointCap] = useState(mode.pointCap);
  const [gamesPerSet, setGamesPerSet] = useState(3);
  const [setsPerNight, setSetsPerNight] = useState(1);
  const [step, setStep] = useState<'names' | 'rules'>('names');

  const labels = useMemo(() => (
    Array.from({ length: mode.teams }, (_, index) => (mode.playersPerTeam > 1 ? `تیم ${index + 1}` : `بازیکن ${index + 1}`))
  ), [mode.playersPerTeam, mode.teams]);

  const trimmedTeamNames = teamNames.map((name, index) => name.trim() || labels[index]);
  const areNamesValid = trimmedTeamNames.every(Boolean);

  const handleTeamNameChange = (index: number, value: string) => {
    setTeamNames((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!areNamesValid || pointCap <= 0 || gamesPerSet <= 0 || setsPerNight <= 0) return;

    const playersByTeam: Player[][] = trimmedTeamNames.map((name, index) => (
      mode.playersPerTeam > 1 ? [] : [{ id: `quick-${index}-${Date.now()}`, name }]
    ));

    onSubmit(playersByTeam, trimmedTeamNames, pointCap, gamesPerSet, setsPerNight);
  };

  const namesScreen = (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-4">
        {labels.map((label, index) => (
          <div key={label} className="space-y-2">
            <label htmlFor={`team-name-${index}`} className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
              {mode.playersPerTeam > 1 ? `${label} را وارد کنید` : `نام ${label} را وارد کنید`}
            </label>
            <input
              id={`team-name-${index}`}
              type="text"
              value={teamNames[index]}
              onChange={(event) => handleTeamNameChange(index, event.target.value)}
              className="form-input"
              placeholder={label}
              maxLength={40}
              required
            />
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-slate-500/10 p-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
        {mode.playersPerTeam > 1
          ? 'برای بازی سریع ۲ در برابر ۲ فقط نام دو تیم را وارد کنید. هیچ بازیکنی ذخیره یا ساخته نمی شود.'
          : 'برای بازی سریع فقط نام بازیکن ها را وارد کنید. چیزی ذخیره یا ساخته نمی شود.'}
      </div>

      <div className="flex flex-col gap-4 pt-4">
        <button type="button" onClick={() => setStep('rules')} disabled={!areNamesValid} className="btn-primary text-base">
          ادامه
        </button>
        <button type="button" onClick={onBack} className="btn-secondary text-base">
          بازگشت
        </button>
      </div>
    </div>
  );

  const rulesScreen = (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark border-b-2 border-slate-300 dark:border-slate-600 pb-2 mb-4">
          طرف های انتخاب شده
        </h3>
        <div className="space-y-3">
          {trimmedTeamNames.map((name, index) => (
            <div key={`${name}-${index}`} className="flex items-center gap-4 bg-slate-500/10 p-3 rounded-lg">
              <span className="font-bold text-text-secondary-light dark:text-text-secondary-dark w-20">
                {labels[index]}:
              </span>
              <span className="font-semibold bg-white/50 dark:bg-black/20 px-3 py-1 rounded-full">{name}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark border-b-2 border-slate-300 dark:border-slate-600 pb-2 mb-4">قوانین بازی</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="point-cap" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">امتیاز برد</label>
            <input type="number" id="point-cap" value={pointCap} onChange={(event) => setPointCap(parseInt(event.target.value, 10) || 0)} className="form-input" min="1" />
          </div>
          <div>
            <label htmlFor="games-per-set" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">تعداد بازی در هر ست</label>
            <input type="number" id="games-per-set" value={gamesPerSet} onChange={(event) => setGamesPerSet(parseInt(event.target.value, 10) || 0)} className="form-input" min="1" />
          </div>
          <div>
            <label htmlFor="sets-per-night" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">تعداد ست در هر شب</label>
            <input type="number" id="sets-per-night" value={setsPerNight} onChange={(event) => setSetsPerNight(parseInt(event.target.value, 10) || 0)} className="form-input" min="1" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-4">
        <button type="submit" className="btn-primary text-base">شروع بازی</button>
        <button type="button" onClick={() => setStep('names')} className="btn-secondary text-base">
          بازگشت به نام ها
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">تنظیمات بازی</h1>
        <p className="text-sm sm:text-lg text-text-secondary-light dark:text-text-secondary-dark mt-2">
          {mode.title} - {step === 'names' ? 'مرحله ۱: ورود نام ها' : 'مرحله ۲: تنظیم قوانین'}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="glass-card p-5 sm:p-8">
        {step === 'names' ? namesScreen : rulesScreen}
      </form>
    </div>
  );
};
