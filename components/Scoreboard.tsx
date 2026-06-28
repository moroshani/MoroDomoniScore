import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Team, RoundHistoryItem, AuditLogEntry } from '../types';
import { TrophyIcon } from './icons';
import { useWakeLock } from '../hooks/useWakeLock';
import { playClack, triggerHaptic } from '../lib/feedback';
import { useUIActions } from '../context/UIActionsContext';
import { getHapticsEnabled, getSoundEnabled, setHapticsEnabled as saveHapticsEnabled, setSoundEnabled as saveSoundEnabled } from '../lib/preferences';

interface ScoreboardProps {
  teams: Team[];
  gameNumber: number;
  setNumber: number;
  pointCap: number;
  onAddRound: (scores: number[]) => void;
  onNewNight: () => void;
  onUndo: () => void;
  onEditLastRound: () => number[] | null;
  canUndo: boolean;
  editingRoundNumber: number | null;
  onEndSet: () => void;
  canEndSet: boolean;
  tieBreakerMessage: string;
  roundHistory: RoundHistoryItem[];
  auditLog: AuditLogEntry[];
}

const teamColors = [
  'text-cyan-500',
  'text-amber-500',
  'text-emerald-500'
];

const teamBorderColors = [
  'border-cyan-500',
  'border-amber-500',
  'border-emerald-500'
];

const PlayerAvatar: React.FC<{ avatar?: string; className?: string }> = ({ avatar, className = 'w-12 h-12' }) => {
  if (!avatar) return <span className={`${className} flex items-center justify-center text-3xl`}>👤</span>;
  if (avatar.startsWith('data:image')) {
    return <img src={avatar} alt="player avatar" className={`${className} rounded-full object-cover shadow-md border-2 border-white dark:border-slate-600`} />;
  }
  return <span className={`${className} flex items-center justify-center text-3xl`}>{avatar}</span>;
};

export const Scoreboard: React.FC<ScoreboardProps> = ({
  teams,
  gameNumber,
  setNumber,
  pointCap,
  onAddRound,
  onNewNight,
  onUndo,
  onEditLastRound,
  canUndo,
  editingRoundNumber,
  onEndSet,
  canEndSet,
  tieBreakerMessage,
  roundHistory,
  auditLog
}) => {
  const [roundScores, setRoundScores] = useState<string[]>(Array(teams.length).fill(''));
  const [activeTeamIndex, setActiveTeamIndex] = useState<number | null>(null);
  const [lastUpdatedTeamId, setLastUpdatedTeamId] = useState<number | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(getSoundEnabled);
  const [hapticsEnabled, setHapticsEnabled] = useState(getHapticsEnabled);
  const prevTeamsRef = useRef<Team[]>(teams);
  const historyListRef = useRef<HTMLUListElement>(null);
  const { setActions } = useUIActions();
  useWakeLock(true);

  useEffect(() => {
    if (teams.every((team) => team.currentGameScore === 0) || teams.length !== roundScores.length) {
      setRoundScores(Array(teams.length).fill(''));
      setActiveTeamIndex(null);
    }
    const updatedTeam = teams.find((team, index) => team.currentGameScore !== prevTeamsRef.current[index]?.currentGameScore);
    prevTeamsRef.current = JSON.parse(JSON.stringify(teams));
    if (updatedTeam) {
      setLastUpdatedTeamId(updatedTeam.id);
      const timer = setTimeout(() => setLastUpdatedTeamId(null), 600);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [teams, gameNumber, setNumber, roundScores.length]);

  useEffect(() => {
    if (historyListRef.current) {
      historyListRef.current.scrollTop = 0;
    }
  }, [roundHistory]);

  useEffect(() => {
    saveSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    saveHapticsEnabled(hapticsEnabled);
  }, [hapticsEnabled]);

  const updateScoreAtIndex = (index: number, value: string) => {
    setRoundScores((prev) => prev.map((score, scoreIndex) => (scoreIndex === index ? value : score)));
  };

  const handleScoreChange = (index: number, value: string) => {
    triggerHaptic(hapticsEnabled);
    const sanitized = value.replace(/[^\d]/g, '');
    updateScoreAtIndex(index, sanitized);
  };

  const handleAddScores = () => {
    const scores = roundScores.map((score) => parseInt(score || '0', 10));
    onAddRound(scores);
    setRoundScores(Array(teams.length).fill(''));
    setActiveTeamIndex(null);
    playClack(soundEnabled);
    triggerHaptic(hapticsEnabled, 15);
  };

  const handleEditLastRound = () => {
    const lastScores = onEditLastRound();
    if (!lastScores) return;
    setRoundScores(lastScores.map((score) => (score > 0 ? String(score) : '')));
    setActiveTeamIndex(null);
  };

  const isRoundInputValid = roundScores.some((score) => parseInt(score || '0', 10) > 0);
  const submitLabel = editingRoundNumber ? 'ذخیره ویرایش' : 'ثبت امتیاز';

  useEffect(() => {
    setActions({
      toggleSound: () => setSoundEnabled((prev) => !prev),
      soundEnabled,
      toggleHaptics: () => setHapticsEnabled((prev) => !prev),
      hapticsEnabled
    });
    return () => setActions({});
  }, [setActions, soundEnabled, hapticsEnabled]);

  const teamNameWithAvatar = (team: Team) => (
    <div className="flex flex-col items-center justify-center gap-2">
      {team.players.length > 0 ? (
        <div className="flex -space-x-4 hover:space-x-0 transition-all duration-300">
          {team.players.map((player) => <PlayerAvatar key={player.id} avatar={player.avatar} className="w-9 h-9" />)}
        </div>
      ) : (
        <span className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-200/70 dark:bg-slate-700/70 text-lg">👥</span>
      )}
      <span className="text-sm sm:text-base font-bold text-center">{team.name}</span>
    </div>
  );

  const reversedRoundHistory = useMemo(() => [...roundHistory].reverse(), [roundHistory]);

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in pb-24 md:pb-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 flex flex-col gap-3">
          <section className="glass-card p-3 sm:p-4 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-xs sm:text-sm text-text-secondary-light dark:text-text-secondary-dark">
                ست {setNumber} • بازی {gameNumber}
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button onClick={onEndSet} disabled={!canEndSet} className="btn bg-blue-500 text-white text-xs !px-3 !py-2">پایان ست</button>
                <button onClick={onNewNight} className="btn bg-danger text-white text-xs !px-3 !py-2">بازنشانی</button>
              </div>
            </div>
            {tieBreakerMessage && (
              <div className="bg-amber-500/20 text-amber-700 dark:text-amber-300 p-2 rounded-xl text-xs sm:text-sm" role="alert">
                {tieBreakerMessage}
              </div>
            )}
            {editingRoundNumber && (
              <div className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 p-2 rounded-xl text-xs sm:text-sm">
                در حال ویرایش دور {editingRoundNumber}
              </div>
            )}
            {auditLog.length > 0 && (
              <p className="text-[11px] sm:text-xs text-text-secondary-light dark:text-text-secondary-dark">
                آخرین تغییرات این بازی در گزارش دورها ذخیره شده است.
              </p>
            )}
          </section>

          <section className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 gap-3">
            {teams.map((team, index) => {
              const isActive = index === activeTeamIndex;
              const inlineSubmitVisible = isRoundInputValid
                && (isActive || (activeTeamIndex === null && parseInt(roundScores[index] || '0', 10) > 0));
              return (
                <div
                  key={team.id}
                  className={`glass-card text-center h-full border-2 ${isActive ? 'border-primary bg-primary/5' : 'border-transparent'} border-t-4 ${teamBorderColors[team.id % teamBorderColors.length]}`}
                >
                  <div className="p-3 sm:p-4 flex flex-col items-center h-full gap-2">
                    <div className="min-h-[60px]">{teamNameWithAvatar(team)}</div>
                    <div className={`text-4xl sm:text-5xl lg:text-6xl font-black font-numeric ${teamColors[team.id % teamColors.length]} ${lastUpdatedTeamId === team.id ? 'animate-bounce' : ''}`}>{team.currentGameScore}</div>
                    <div className="text-[11px] sm:text-xs text-text-secondary-light dark:text-text-secondary-dark">
                      نیاز به {Math.max(0, pointCap - team.currentGameScore)} امتیاز
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      min={0}
                      step={1}
                      autoComplete="off"
                      placeholder="0"
                      value={roundScores[index] || ''}
                      onFocus={() => setActiveTeamIndex(index)}
                      onChange={(event) => handleScoreChange(index, event.target.value)}
                      className={`form-input text-center text-2xl sm:text-3xl font-black font-numeric ${teamColors[team.id % teamColors.length]}`}
                    />
                    {inlineSubmitVisible && (
                      <button
                        type="button"
                        onClick={handleAddScores}
                        disabled={!isRoundInputValid}
                        className="md:hidden btn-primary w-full !py-2 !text-sm disabled:opacity-50"
                      >
                        {submitLabel}
                      </button>
                    )}
                    <span className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark">امتیاز این دور</span>
                    <div className="flex gap-2 text-[11px] sm:text-xs">
                      <span className="bg-slate-200 dark:bg-slate-700 rounded-full px-2 py-1 font-semibold flex items-center gap-1"><TrophyIcon className="w-3 h-3" /> ست {team.setsWon}</span>
                      <span className="bg-slate-200 dark:bg-slate-700 rounded-full px-2 py-1 font-semibold flex items-center gap-1"><TrophyIcon className="w-3 h-3" /> برد {team.gamesWon}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          <section className="space-y-2 hidden md:block">
            <button onClick={handleAddScores} disabled={!isRoundInputValid} className="btn-primary w-full !bg-success !text-base">
              {submitLabel}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleEditLastRound} disabled={!canUndo} className="btn-secondary !text-xs">
                ویرایش دور قبل
              </button>
              <button onClick={onUndo} disabled={!canUndo} className="btn-secondary !bg-accent !text-white !text-xs">
                واگرد
              </button>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-1 glass-card p-3 sm:p-4 h-auto lg:h-[calc(100vh-6rem)] lg:sticky lg:top-20">
          <div className="flex items-center justify-between mb-2 border-b border-slate-300 dark:border-slate-600 pb-2">
            <h3 className="text-base sm:text-lg font-bold">گزارش دورها</h3>
            <button
              type="button"
              onClick={() => setIsHistoryOpen((prev) => !prev)}
              className="lg:hidden text-xs text-primary font-semibold"
            >
              {isHistoryOpen ? 'بستن' : 'نمایش'}
            </button>
          </div>
          <div className={`${isHistoryOpen ? 'block' : 'hidden'} lg:block`}>
            {roundHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary-light dark:text-text-secondary-dark text-sm">
                <p className="text-base">گزارش خالی است</p>
                <p className="mt-1">امتیاز دور اول را اضافه کنید.</p>
              </div>
            ) : (
              <ul ref={historyListRef} className="space-y-2 max-h-[48vh] lg:max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
                {reversedRoundHistory.map((round) => (
                  <li key={round.id} className="p-3 rounded-lg bg-slate-500/10 animate-fade-in space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">دور {round.roundNumber}</span>
                      </div>
                      <span className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark">
                        {new Date(round.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {round.scores.length === 0 ? (
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">این دور امتیازی نداشت.</p>
                    ) : (
                      <ul className="space-y-1">
                        {round.scores.map((score) => (
                          <li key={`${round.id}-${score.teamId}`} className="flex justify-between items-center text-sm">
                            <span className="font-semibold">{score.teamName}</span>
                            <span className="font-bold text-success font-numeric">+{score.score}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
      <div className="md:hidden fixed bottom-2 inset-x-3 z-30">
        <div className="glass-card p-2 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button onClick={handleEditLastRound} disabled={!canUndo} className="btn-secondary !text-xs">
              ویرایش دور قبل
            </button>
            <button onClick={onUndo} disabled={!canUndo} className="btn-secondary !bg-accent !text-white !text-xs">
              واگرد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
