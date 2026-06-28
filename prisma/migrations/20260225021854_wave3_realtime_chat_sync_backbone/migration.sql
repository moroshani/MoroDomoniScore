-- CreateEnum
CREATE TYPE "AllianceLobbyStatus" AS ENUM ('open', 'active', 'ended', 'archived');

-- CreateEnum
CREATE TYPE "AllianceLobbyMemberStatus" AS ENUM ('joined', 'ready', 'left', 'removed');

-- CreateEnum
CREATE TYPE "AllianceChatRoomType" AS ENUM ('direct', 'alliance', 'match');

-- CreateEnum
CREATE TYPE "AllianceChatMessageStatus" AS ENUM ('active', 'deleted', 'moderated');

-- CreateEnum
CREATE TYPE "AllianceChatReportStatus" AS ENUM ('open', 'actioned', 'dismissed');

-- CreateTable
CREATE TABLE "AllianceLobby" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT,
    "scope" "MatchScope" NOT NULL DEFAULT 'local_standard',
    "status" "AllianceLobbyStatus" NOT NULL DEFAULT 'open',
    "modeType" TEXT,
    "maxSeats" INTEGER NOT NULL DEFAULT 4,
    "allianceId" TEXT,
    "hostUserId" TEXT NOT NULL,
    "visibility" "AllianceVisibility" NOT NULL DEFAULT 'alliance',
    "currentVersion" INTEGER NOT NULL DEFAULT 1,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllianceLobby_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllianceLobbyMember" (
    "id" TEXT NOT NULL,
    "lobbyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "AllianceLobbyMemberStatus" NOT NULL DEFAULT 'joined',
    "isReady" BOOLEAN NOT NULL DEFAULT false,
    "seatIndex" INTEGER,
    "roleSnapshot" "AllianceMembershipRole",
    "displayName" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AllianceLobbyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllianceLobbyEvent" (
    "id" TEXT NOT NULL,
    "lobbyId" TEXT NOT NULL,
    "actorUserId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "expectedVersion" INTEGER,
    "resultingVersion" INTEGER,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllianceLobbyEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllianceChatRoom" (
    "id" TEXT NOT NULL,
    "type" "AllianceChatRoomType" NOT NULL,
    "allianceId" TEXT,
    "lobbyId" TEXT,
    "directKey" TEXT,
    "title" TEXT,
    "createdByUserId" TEXT,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AllianceChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllianceChatRoomMember" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "AllianceMembershipRole" NOT NULL DEFAULT 'member',
    "isMuted" BOOLEAN NOT NULL DEFAULT false,
    "mutedUntil" TIMESTAMP(3),
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AllianceChatRoomMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllianceChatMessage" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "senderUserId" TEXT NOT NULL,
    "clientMessageId" TEXT,
    "text" TEXT NOT NULL,
    "status" "AllianceChatMessageStatus" NOT NULL DEFAULT 'active',
    "moderatedByUserId" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AllianceChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllianceChatReport" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "reporterUserId" TEXT NOT NULL,
    "reasonCode" TEXT NOT NULL,
    "note" TEXT,
    "status" "AllianceChatReportStatus" NOT NULL DEFAULT 'open',
    "reviewedByUserId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "actionTaken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AllianceChatReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllianceChatModerationAction" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "actorUserId" TEXT NOT NULL,
    "targetUserId" TEXT,
    "targetMessageId" TEXT,
    "actionType" TEXT NOT NULL,
    "reason" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllianceChatModerationAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AllianceLobby_code_key" ON "AllianceLobby"("code");

-- CreateIndex
CREATE INDEX "AllianceLobby_allianceId_status_updatedAt_idx" ON "AllianceLobby"("allianceId", "status", "updatedAt");

-- CreateIndex
CREATE INDEX "AllianceLobby_hostUserId_status_updatedAt_idx" ON "AllianceLobby"("hostUserId", "status", "updatedAt");

-- CreateIndex
CREATE INDEX "AllianceLobby_scope_visibility_status_updatedAt_idx" ON "AllianceLobby"("scope", "visibility", "status", "updatedAt");

-- CreateIndex
CREATE INDEX "AllianceLobbyMember_lobbyId_status_isReady_idx" ON "AllianceLobbyMember"("lobbyId", "status", "isReady");

-- CreateIndex
CREATE INDEX "AllianceLobbyMember_userId_status_updatedAt_idx" ON "AllianceLobbyMember"("userId", "status", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AllianceLobbyMember_lobbyId_userId_key" ON "AllianceLobbyMember"("lobbyId", "userId");

-- CreateIndex
CREATE INDEX "AllianceLobbyEvent_lobbyId_createdAt_idx" ON "AllianceLobbyEvent"("lobbyId", "createdAt");

-- CreateIndex
CREATE INDEX "AllianceLobbyEvent_actorUserId_createdAt_idx" ON "AllianceLobbyEvent"("actorUserId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AllianceLobbyEvent_lobbyId_eventId_key" ON "AllianceLobbyEvent"("lobbyId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "AllianceChatRoom_directKey_key" ON "AllianceChatRoom"("directKey");

-- CreateIndex
CREATE INDEX "AllianceChatRoom_allianceId_type_updatedAt_idx" ON "AllianceChatRoom"("allianceId", "type", "updatedAt");

-- CreateIndex
CREATE INDEX "AllianceChatRoom_lobbyId_type_updatedAt_idx" ON "AllianceChatRoom"("lobbyId", "type", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AllianceChatRoom_type_allianceId_key" ON "AllianceChatRoom"("type", "allianceId");

-- CreateIndex
CREATE UNIQUE INDEX "AllianceChatRoom_type_lobbyId_key" ON "AllianceChatRoom"("type", "lobbyId");

-- CreateIndex
CREATE INDEX "AllianceChatRoomMember_roomId_role_isMuted_isBlocked_idx" ON "AllianceChatRoomMember"("roomId", "role", "isMuted", "isBlocked");

-- CreateIndex
CREATE INDEX "AllianceChatRoomMember_userId_updatedAt_idx" ON "AllianceChatRoomMember"("userId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AllianceChatRoomMember_roomId_userId_key" ON "AllianceChatRoomMember"("roomId", "userId");

-- CreateIndex
CREATE INDEX "AllianceChatMessage_roomId_createdAt_idx" ON "AllianceChatMessage"("roomId", "createdAt");

-- CreateIndex
CREATE INDEX "AllianceChatMessage_senderUserId_createdAt_idx" ON "AllianceChatMessage"("senderUserId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AllianceChatMessage_roomId_clientMessageId_key" ON "AllianceChatMessage"("roomId", "clientMessageId");

-- CreateIndex
CREATE INDEX "AllianceChatReport_roomId_status_createdAt_idx" ON "AllianceChatReport"("roomId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "AllianceChatReport_messageId_status_idx" ON "AllianceChatReport"("messageId", "status");

-- CreateIndex
CREATE INDEX "AllianceChatModerationAction_roomId_createdAt_idx" ON "AllianceChatModerationAction"("roomId", "createdAt");

-- CreateIndex
CREATE INDEX "AllianceChatModerationAction_actorUserId_createdAt_idx" ON "AllianceChatModerationAction"("actorUserId", "createdAt");

-- CreateIndex
CREATE INDEX "AllianceChatModerationAction_targetUserId_createdAt_idx" ON "AllianceChatModerationAction"("targetUserId", "createdAt");

-- AddForeignKey
ALTER TABLE "AllianceLobby" ADD CONSTRAINT "AllianceLobby_allianceId_fkey" FOREIGN KEY ("allianceId") REFERENCES "Alliance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceLobby" ADD CONSTRAINT "AllianceLobby_hostUserId_fkey" FOREIGN KEY ("hostUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceLobbyMember" ADD CONSTRAINT "AllianceLobbyMember_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "AllianceLobby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceLobbyMember" ADD CONSTRAINT "AllianceLobbyMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceLobbyEvent" ADD CONSTRAINT "AllianceLobbyEvent_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "AllianceLobby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceLobbyEvent" ADD CONSTRAINT "AllianceLobbyEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceChatRoom" ADD CONSTRAINT "AllianceChatRoom_allianceId_fkey" FOREIGN KEY ("allianceId") REFERENCES "Alliance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceChatRoom" ADD CONSTRAINT "AllianceChatRoom_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "AllianceLobby"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceChatRoom" ADD CONSTRAINT "AllianceChatRoom_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceChatRoomMember" ADD CONSTRAINT "AllianceChatRoomMember_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "AllianceChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceChatRoomMember" ADD CONSTRAINT "AllianceChatRoomMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceChatMessage" ADD CONSTRAINT "AllianceChatMessage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "AllianceChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceChatMessage" ADD CONSTRAINT "AllianceChatMessage_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceChatMessage" ADD CONSTRAINT "AllianceChatMessage_moderatedByUserId_fkey" FOREIGN KEY ("moderatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceChatReport" ADD CONSTRAINT "AllianceChatReport_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "AllianceChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceChatReport" ADD CONSTRAINT "AllianceChatReport_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "AllianceChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceChatReport" ADD CONSTRAINT "AllianceChatReport_reporterUserId_fkey" FOREIGN KEY ("reporterUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceChatReport" ADD CONSTRAINT "AllianceChatReport_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceChatModerationAction" ADD CONSTRAINT "AllianceChatModerationAction_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "AllianceChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceChatModerationAction" ADD CONSTRAINT "AllianceChatModerationAction_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceChatModerationAction" ADD CONSTRAINT "AllianceChatModerationAction_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceChatModerationAction" ADD CONSTRAINT "AllianceChatModerationAction_targetMessageId_fkey" FOREIGN KEY ("targetMessageId") REFERENCES "AllianceChatMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
