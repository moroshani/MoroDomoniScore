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

function App() {
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

  const renderContent = () => {
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

  return (
    <div className="min-h-screen w-full flex items-center justify-center font-sans antialiased p-4 sm:p-6 lg:p-8">
      <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
      {renderContent()}
      
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
    </div>
  );
}

export default App;