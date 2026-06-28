-- CreateEnum
CREATE TYPE "AllianceMembershipRole" AS ENUM ('owner', 'admin', 'member', 'viewer');

-- CreateEnum
CREATE TYPE "AllianceMembershipStatus" AS ENUM ('active', 'invited', 'suspended');

-- CreateEnum
CREATE TYPE "AllianceInviteStatus" AS ENUM ('active', 'accepted', 'revoked', 'expired');

-- CreateEnum
CREATE TYPE "AllianceClaimStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "AlliancePlayerClaimState" AS ENUM ('unclaimed', 'pending', 'claimed');

-- CreateEnum
CREATE TYPE "MatchScope" AS ENUM ('alliance_internal', 'cross_alliance', 'world_open', 'local_standard', 'quick_night');

-- CreateEnum
CREATE TYPE "AllianceVisibility" AS ENUM ('private', 'alliance', 'world');

-- CreateTable
CREATE TABLE "Alliance" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alliance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllianceMembership" (
    "id" TEXT NOT NULL,
    "allianceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "AllianceMembershipRole" NOT NULL DEFAULT 'member',
    "status" "AllianceMembershipStatus" NOT NULL DEFAULT 'active',
    "joinedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AllianceMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlliancePlayer" (
    "id" TEXT NOT NULL,
    "allianceId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "avatar" TEXT,
    "claimState" "AlliancePlayerClaimState" NOT NULL DEFAULT 'unclaimed',
    "createdByUserId" TEXT,
    "sourcePlayerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlliancePlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlliancePlayerLink" (
    "id" TEXT NOT NULL,
    "alliancePlayerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "linkedByUserId" TEXT,
    "linkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlliancePlayerLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllianceInvite" (
    "id" TEXT NOT NULL,
    "allianceId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "invitedByUserId" TEXT NOT NULL,
    "inviteeEmail" TEXT,
    "inviteeUsername" TEXT,
    "role" "AllianceMembershipRole" NOT NULL DEFAULT 'member',
    "status" "AllianceInviteStatus" NOT NULL DEFAULT 'active',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedByUserId" TEXT,
    "acceptedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllianceInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllianceClaim" (
    "id" TEXT NOT NULL,
    "allianceId" TEXT NOT NULL,
    "alliancePlayerId" TEXT NOT NULL,
    "requestedByUserId" TEXT NOT NULL,
    "reviewedByUserId" TEXT,
    "status" "AllianceClaimStatus" NOT NULL DEFAULT 'pending',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "AllianceClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllianceGameNight" (
    "id" TEXT NOT NULL,
    "allianceId" TEXT NOT NULL,
    "legacyGameNightId" TEXT,
    "createdByUserId" TEXT NOT NULL,
    "scope" "MatchScope" NOT NULL DEFAULT 'local_standard',
    "visibility" "AllianceVisibility" NOT NULL DEFAULT 'alliance',
    "eligibilityFlags" JSONB,
    "data" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AllianceGameNight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllianceGameParticipant" (
    "id" TEXT NOT NULL,
    "gameNightId" TEXT NOT NULL,
    "alliancePlayerId" TEXT NOT NULL,
    "teamSlot" INTEGER NOT NULL,
    "roleSnapshot" "AllianceMembershipRole",
    "displayNameSnapshot" TEXT NOT NULL,
    "avatarSnapshot" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllianceGameParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Alliance_slug_key" ON "Alliance"("slug");

-- CreateIndex
CREATE INDEX "Alliance_createdByUserId_createdAt_idx" ON "Alliance"("createdByUserId", "createdAt");

-- CreateIndex
CREATE INDEX "AllianceMembership_userId_status_idx" ON "AllianceMembership"("userId", "status");

-- CreateIndex
CREATE INDEX "AllianceMembership_allianceId_role_status_idx" ON "AllianceMembership"("allianceId", "role", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AllianceMembership_allianceId_userId_key" ON "AllianceMembership"("allianceId", "userId");

-- CreateIndex
CREATE INDEX "AlliancePlayer_allianceId_displayName_idx" ON "AlliancePlayer"("allianceId", "displayName");

-- CreateIndex
CREATE INDEX "AlliancePlayer_allianceId_claimState_idx" ON "AlliancePlayer"("allianceId", "claimState");

-- CreateIndex
CREATE UNIQUE INDEX "AlliancePlayer_allianceId_sourcePlayerId_key" ON "AlliancePlayer"("allianceId", "sourcePlayerId");

-- CreateIndex
CREATE INDEX "AlliancePlayerLink_userId_linkedAt_idx" ON "AlliancePlayerLink"("userId", "linkedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AlliancePlayerLink_alliancePlayerId_userId_key" ON "AlliancePlayerLink"("alliancePlayerId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "AllianceInvite_tokenHash_key" ON "AllianceInvite"("tokenHash");

-- CreateIndex
CREATE INDEX "AllianceInvite_allianceId_status_expiresAt_idx" ON "AllianceInvite"("allianceId", "status", "expiresAt");

-- CreateIndex
CREATE INDEX "AllianceInvite_inviteeEmail_idx" ON "AllianceInvite"("inviteeEmail");

-- CreateIndex
CREATE INDEX "AllianceInvite_inviteeUsername_idx" ON "AllianceInvite"("inviteeUsername");

-- CreateIndex
CREATE INDEX "AllianceClaim_allianceId_status_createdAt_idx" ON "AllianceClaim"("allianceId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "AllianceClaim_alliancePlayerId_status_idx" ON "AllianceClaim"("alliancePlayerId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AllianceGameNight_legacyGameNightId_key" ON "AllianceGameNight"("legacyGameNightId");

-- CreateIndex
CREATE INDEX "AllianceGameNight_allianceId_createdAt_idx" ON "AllianceGameNight"("allianceId", "createdAt");

-- CreateIndex
CREATE INDEX "AllianceGameNight_allianceId_scope_createdAt_idx" ON "AllianceGameNight"("allianceId", "scope", "createdAt");

-- CreateIndex
CREATE INDEX "AllianceGameParticipant_gameNightId_teamSlot_idx" ON "AllianceGameParticipant"("gameNightId", "teamSlot");

-- CreateIndex
CREATE INDEX "AllianceGameParticipant_alliancePlayerId_createdAt_idx" ON "AllianceGameParticipant"("alliancePlayerId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AllianceGameParticipant_gameNightId_alliancePlayerId_key" ON "AllianceGameParticipant"("gameNightId", "alliancePlayerId");

-- AddForeignKey
ALTER TABLE "Alliance" ADD CONSTRAINT "Alliance_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceMembership" ADD CONSTRAINT "AllianceMembership_allianceId_fkey" FOREIGN KEY ("allianceId") REFERENCES "Alliance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceMembership" ADD CONSTRAINT "AllianceMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlliancePlayer" ADD CONSTRAINT "AlliancePlayer_allianceId_fkey" FOREIGN KEY ("allianceId") REFERENCES "Alliance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlliancePlayer" ADD CONSTRAINT "AlliancePlayer_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlliancePlayer" ADD CONSTRAINT "AlliancePlayer_sourcePlayerId_fkey" FOREIGN KEY ("sourcePlayerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlliancePlayerLink" ADD CONSTRAINT "AlliancePlayerLink_alliancePlayerId_fkey" FOREIGN KEY ("alliancePlayerId") REFERENCES "AlliancePlayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlliancePlayerLink" ADD CONSTRAINT "AlliancePlayerLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlliancePlayerLink" ADD CONSTRAINT "AlliancePlayerLink_linkedByUserId_fkey" FOREIGN KEY ("linkedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceInvite" ADD CONSTRAINT "AllianceInvite_allianceId_fkey" FOREIGN KEY ("allianceId") REFERENCES "Alliance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceInvite" ADD CONSTRAINT "AllianceInvite_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceInvite" ADD CONSTRAINT "AllianceInvite_acceptedByUserId_fkey" FOREIGN KEY ("acceptedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceClaim" ADD CONSTRAINT "AllianceClaim_allianceId_fkey" FOREIGN KEY ("allianceId") REFERENCES "Alliance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceClaim" ADD CONSTRAINT "AllianceClaim_alliancePlayerId_fkey" FOREIGN KEY ("alliancePlayerId") REFERENCES "AlliancePlayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceClaim" ADD CONSTRAINT "AllianceClaim_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceClaim" ADD CONSTRAINT "AllianceClaim_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceGameNight" ADD CONSTRAINT "AllianceGameNight_allianceId_fkey" FOREIGN KEY ("allianceId") REFERENCES "Alliance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceGameNight" ADD CONSTRAINT "AllianceGameNight_legacyGameNightId_fkey" FOREIGN KEY ("legacyGameNightId") REFERENCES "GameNight"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceGameNight" ADD CONSTRAINT "AllianceGameNight_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceGameParticipant" ADD CONSTRAINT "AllianceGameParticipant_gameNightId_fkey" FOREIGN KEY ("gameNightId") REFERENCES "AllianceGameNight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceGameParticipant" ADD CONSTRAINT "AllianceGameParticipant_alliancePlayerId_fkey" FOREIGN KEY ("alliancePlayerId") REFERENCES "AlliancePlayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
