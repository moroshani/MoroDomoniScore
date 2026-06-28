-- CreateTable
CREATE TABLE "AllianceTeamupSnapshot" (
    "id" TEXT NOT NULL,
    "allianceId" TEXT NOT NULL,
    "projectionKey" TEXT NOT NULL DEFAULT 'all',
    "teamupId" TEXT NOT NULL,
    "playersJson" JSONB NOT NULL,
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "gamesWon" INTEGER NOT NULL DEFAULT 0,
    "pointsFor" INTEGER NOT NULL DEFAULT 0,
    "pointsAgainst" INTEGER NOT NULL DEFAULT 0,
    "pointDiff" INTEGER NOT NULL DEFAULT 0,
    "avgPointDiff" TEXT NOT NULL DEFAULT '0',
    "setWins" INTEGER NOT NULL DEFAULT 0,
    "nightWins" INTEGER NOT NULL DEFAULT 0,
    "winRate" TEXT NOT NULL DEFAULT '0%',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AllianceTeamupSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllianceTeamupMatchupSnapshot" (
    "id" TEXT NOT NULL,
    "allianceId" TEXT NOT NULL,
    "projectionKey" TEXT NOT NULL DEFAULT 'all',
    "matchupId" TEXT NOT NULL,
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "membersJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AllianceTeamupMatchupSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AllianceTeamupSnapshot_allianceId_projectionKey_teamupId_key" ON "AllianceTeamupSnapshot"("allianceId", "projectionKey", "teamupId");

-- CreateIndex
CREATE INDEX "AllianceTeamupSnapshot_allianceId_projectionKey_gamesPlayed_games_idx" ON "AllianceTeamupSnapshot"("allianceId", "projectionKey", "gamesPlayed", "gamesWon");

-- CreateIndex
CREATE UNIQUE INDEX "AllianceTeamupMatchupSnapshot_allianceId_projectionKey_matchupId_key" ON "AllianceTeamupMatchupSnapshot"("allianceId", "projectionKey", "matchupId");

-- CreateIndex
CREATE INDEX "AllianceTeamupMatchupSnapshot_allianceId_projectionKey_gamesP_idx" ON "AllianceTeamupMatchupSnapshot"("allianceId", "projectionKey", "gamesPlayed");

-- AddForeignKey
ALTER TABLE "AllianceTeamupSnapshot" ADD CONSTRAINT "AllianceTeamupSnapshot_allianceId_fkey" FOREIGN KEY ("allianceId") REFERENCES "Alliance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceTeamupMatchupSnapshot" ADD CONSTRAINT "AllianceTeamupMatchupSnapshot_allianceId_fkey" FOREIGN KEY ("allianceId") REFERENCES "Alliance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
