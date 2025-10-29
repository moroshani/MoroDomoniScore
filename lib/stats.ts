import type { NightRecord, PlayerStats, HeadToHeadStats } from '../types';

export const calculatePlayerStats = (history: NightRecord[]): PlayerStats[] => {
  const stats: { [playerName: string]: Omit<PlayerStats, 'name' | 'winRate' | 'avgPointsPerGame'> & { name: string, avatar?: string } } = {};

  const getPlayer = (player: { name: string; avatar?: string; }) => {
    if (!stats[player.name]) {
      stats[player.name] = {
        name: player.name,
        avatar: player.avatar,
        gamesPlayed: 0,
        gamesWon: 0,
        totalPoints: 0,
        setWins: 0,
        nightWins: 0,
      };
    }
    // Update avatar if it was added later
    if (player.avatar && !stats[player.name].avatar) {
        stats[player.name].avatar = player.avatar;
    }
    return stats[player.name];
  };

  history.forEach(night => {
    const nightWinnerTeam = night.sets[0]?.games[0]?.teams.find(t => t.id === night.nightWinnerTeamId);
    if (nightWinnerTeam) {
        nightWinnerTeam.players.forEach(p => {
            getPlayer(p).nightWins += 1;
        });
    }

    night.sets.forEach(set => {
        const setWinnerTeam = set.games[0]?.teams.find(t => t.id === set.winnerTeamId);
        if (setWinnerTeam) {
            setWinnerTeam.players.forEach(p => {
                getPlayer(p).setWins += 1;
            });
        }

        set.games.forEach(game => {
            const gameWinnerTeam = game.teams.find(t => t.id === game.winnerTeamId);
            
            game.teams.forEach(team => {
                team.players.forEach(player => {
                const pStats = getPlayer(player);
                pStats.gamesPlayed += 1;
                pStats.totalPoints += team.score;
                if (gameWinnerTeam && gameWinnerTeam.id === team.id) {
                    pStats.gamesWon += 1;
                }
                });
            });
        });
    });
  });

  return Object.values(stats).map(s => ({
    ...s,
    winRate: s.gamesPlayed > 0 ? ((s.gamesWon / s.gamesPlayed) * 100).toFixed(1) + '%' : '0%',
    avgPointsPerGame: s.gamesPlayed > 0 ? (s.totalPoints / s.gamesPlayed).toFixed(1) : '0',
  })).sort((a, b) => b.nightWins - a.nightWins || b.setWins - a.setWins || b.gamesWon - a.gamesWon);
};

export const calculateHeadToHeadStats = (player1Name: string, player2Name: string, history: NightRecord[]): HeadToHeadStats => {
    const stats: HeadToHeadStats = {
        player1Name,
        player2Name,
        gamesPlayedTogether: 0,
        player1Wins: 0,
        player2Wins: 0,
        ties: 0, // In case they are on the same winning team
    };

    history.forEach(night => {
        night.sets.forEach(set => {
            set.games.forEach(game => {
                const player1Team = game.teams.find(t => t.players.some(p => p.name === player1Name));
                const player2Team = game.teams.find(t => t.players.some(p => p.name === player2Name));

                // Only count games where both players participated
                if (player1Team && player2Team) {
                    stats.gamesPlayedTogether++;
                    const winnerId = game.winnerTeamId;

                    if (player1Team.id === winnerId && player2Team.id !== winnerId) {
                        stats.player1Wins++;
                    } else if (player2Team.id === winnerId && player1Team.id !== winnerId) {
                        stats.player2Wins++;
                    } else if (player1Team.id === winnerId && player2Team.id === winnerId) {
                        // They were on the same winning team
                        stats.ties++;
                    }
                }
            });
        });
    });

    return stats;
};