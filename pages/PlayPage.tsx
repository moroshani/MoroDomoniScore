import React from 'react';
import { GameScreen } from '../types';
import { ModeSelector } from '../components/ModeSelector';
import { TeamNameSetup } from '../components/TeamNameSetup';
import { Scoreboard } from '../components/Scoreboard';
import { WinnerModal } from '../components/WinnerModal';
import { RecapModal } from '../components/RecapModal';
import { useGame } from '../context/GameContext';

export const PlayPage: React.FC = () => {
  const {
    gameScreen,
    teams,
    currentGameNumber,
    currentSetNumber,
    pointCap,
    winState,
    canUndo,
    tieBreakerMessage,
    handleModeSelect,
    handleNameSubmit,
    handleAddRound,
    handleEndSet,
    handleUndoRound,
    startEditLastRound,
    handleAdvanceToNextStage,
    resetToModeSelection,
    isNightRecapVisible,
    nightRecapContent,
    isNightRecapLoading,
    closeRecapAndReset,
    currentNight,
    roundHistory,
    auditLog,
    editingRoundNumber,
    gameMode
  } = useGame();

  const renderGameContent = () => {
    switch (gameScreen) {
      case GameScreen.ModeSelection:
        return <ModeSelector onSelect={handleModeSelect} />;
      case GameScreen.NameSetup:
        if (!gameMode) return null;
        return <TeamNameSetup mode={gameMode} onSubmit={handleNameSubmit} onBack={resetToModeSelection} />;
      case GameScreen.Scoring: {
        const canEndSet = !!currentNight && (currentNight.sets.find((s) => s.setNumber === currentSetNumber)?.games.length ?? 0) > 0;
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
            onEditLastRound={startEditLastRound}
            editingRoundNumber={editingRoundNumber}
            onEndSet={handleEndSet}
            canEndSet={canEndSet}
            tieBreakerMessage={tieBreakerMessage}
            roundHistory={roundHistory}
            auditLog={auditLog}
          />
        );
      }
      default:
        return <ModeSelector onSelect={handleModeSelect} />;
    }
  };

  return (
    <>
      {renderGameContent()}

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
        content={nightRecapContent}
        onNewNight={closeRecapAndReset}
        nightRecord={currentNight}
        teams={teams}
      />
    </>
  );
};
