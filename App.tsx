import React from 'react';
import { GameScreen } from './types';
import { ModeSelector } from './components/ModeSelector';
import { TeamNameSetup } from './components/TeamNameSetup';
import { Scoreboard } from './components/Scoreboard';
import { WinnerModal } from './components/WinnerModal';
import { RecapModal } from './components/RecapModal';
import { History } from './components/History';
import { Stats } from './components/Stats';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { useGame } from './context/GameContext';
import { useAuth } from './context/AuthContext';
import { Auth } from './components/Auth';
import { LogoutIcon } from './components/icons';

function App() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const {
    gameScreen,
    setGameScreen,
    gameMode,
    teams,
    currentGameNumber,
    currentSetNumber,
    pointCap,
    winState,
    canUndo,
    tieBreakerMessage,
    theme,
    toggleTheme,
    handleModeSelect,
    handleNameSubmit,
    handleAddRound,
    handleEndSet,
    handleUndoRound,
    handleAdvanceToNextStage,
    resetToModeSelection,
    isNightRecapVisible,
    nightRecapAIContent,
    isNightRecapLoading,
    closeRecapAndReset,
    currentNight,
    roundHistory
  } = useGame();

  const renderGameContent = () => {
    switch (gameScreen) {
      case GameScreen.ModeSelection:
        return <ModeSelector onSelect={handleModeSelect} onViewHistory={() => setGameScreen(GameScreen.History)} onViewStats={() => setGameScreen(GameScreen.Stats)} />;
      case GameScreen.NameSetup:
        return gameMode && <TeamNameSetup mode={gameMode} onSubmit={handleNameSubmit} onBack={resetToModeSelection} />;
      case GameScreen.Scoring:
        const canEndSet = !!currentNight && (currentNight.sets.find(s => s.setNumber === currentSetNumber)?.games.length ?? 0) > 0;
        return (
          <Scoreboard
            teams={teams}
            gameNumber={currentGameNumber}
            setNumber={currentSetNumber}
            pointCap={pointCap}
            onAddRound={handleAddRound}
            onNewNight={resetToModeSelection}
            onUndo={handleUndoRound}
            canUndo={canUndo}
            onEndSet={handleEndSet}
            canEndSet={canEndSet}
            tieBreakerMessage={tieBreakerMessage}
            roundHistory={roundHistory}
          />
        );
      case GameScreen.History:
          return <History onBack={resetToModeSelection} />;
      case GameScreen.Stats:
          return <Stats onBack={resetToModeSelection} />;
      default:
        return <ModeSelector onSelect={handleModeSelect} onViewHistory={() => setGameScreen(GameScreen.History)} onViewStats={() => setGameScreen(GameScreen.Stats)} />;
    }
  };
  
  const renderApp = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
            <p className="mt-4 text-lg text-text-secondary-light dark:text-text-secondary-dark">بارگذاری جلسه...</p>
        </div>
      );
    }
    if (!isAuthenticated) {
      return <Auth />;
    }
    return renderGameContent();
  }

  return (
    <div className="min-h-screen w-full font-sans antialiased relative">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-4">
        {isAuthenticated && (
            <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-full">
                <span className="font-semibold text-text-secondary-light dark:text-text-secondary-dark">{user?.name}</span>
                <button 
                    onClick={logout} 
                    className="p-1.5 rounded-full hover:bg-slate-500/10 transition-colors"
                    title="خروج"
                >
                    <LogoutIcon className="w-5 h-5 text-danger" />
                </button>
            </div>
        )}
        <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
      </div>
      
      <main className="min-h-screen flex flex-col items-center justify-center p-4 lg:p-8">
         {renderApp()}
      </main>
      
      {isAuthenticated && (
        <>
          <WinnerModal
            isOpen={!!winState && !isNightRecapVisible}
            winner={winState?.winner!}
            level={winState?.level!}
            finalScore={winState?.finalScore}
            gameNumber={currentGameNumber}
            setNumber={currentSetNumber}
            onNextGame={handleAdvanceToNextStage}
            onNextSet={handleAdvanceToNextStage}
            onNewNight={handleAdvanceToNextStage}
          />

          <RecapModal
            isOpen={isNightRecapVisible}
            isLoading={isNightRecapLoading}
            content={nightRecapAIContent}
            onNewNight={closeRecapAndReset}
            nightRecord={currentNight}
            teams={teams}
          />
        </>
      )}
    </div>
  );
}

export default App;
