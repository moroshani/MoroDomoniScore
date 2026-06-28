-- CreateTable
CREATE TABLE "AllianceHousehold" (
    "id" TEXT NOT NULL,
    "allianceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AllianceHousehold_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllianceHouseholdUser" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "AllianceMembershipRole" NOT NULL DEFAULT 'member',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AllianceHouseholdUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllianceHouseholdPlayer" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "alliancePlayerId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AllianceHouseholdPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AllianceHousehold_allianceId_slug_key" ON "AllianceHousehold"("allianceId", "slug");

-- CreateIndex
CREATE INDEX "AllianceHousehold_allianceId_isActive_createdAt_idx" ON "AllianceHousehold"("allianceId", "isActive", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AllianceHouseholdUser_householdId_userId_key" ON "AllianceHouseholdUser"("householdId", "userId");

-- CreateIndex
CREATE INDEX "AllianceHouseholdUser_userId_isPrimary_updatedAt_idx" ON "AllianceHouseholdUser"("userId", "isPrimary", "updatedAt");

-- CreateIndex
CREATE INDEX "AllianceHouseholdUser_householdId_role_updatedAt_idx" ON "AllianceHouseholdUser"("householdId", "role", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AllianceHouseholdPlayer_householdId_alliancePlayerId_key" ON "AllianceHouseholdPlayer"("householdId", "alliancePlayerId");

-- CreateIndex
CREATE INDEX "AllianceHouseholdPlayer_alliancePlayerId_isPrimary_updatedAt_idx" ON "AllianceHouseholdPlayer"("alliancePlayerId", "isPrimary", "updatedAt");

-- CreateIndex
CREATE INDEX "AllianceHouseholdPlayer_householdId_updatedAt_idx" ON "AllianceHouseholdPlayer"("householdId", "updatedAt");

-- AddForeignKey
ALTER TABLE "AllianceHousehold" ADD CONSTRAINT "AllianceHousehold_allianceId_fkey" FOREIGN KEY ("allianceId") REFERENCES "Alliance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceHousehold" ADD CONSTRAINT "AllianceHousehold_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceHouseholdUser" ADD CONSTRAINT "AllianceHouseholdUser_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "AllianceHousehold"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceHouseholdUser" ADD CONSTRAINT "AllianceHouseholdUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceHouseholdPlayer" ADD CONSTRAINT "AllianceHouseholdPlayer_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "AllianceHousehold"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceHouseholdPlayer" ADD CONSTRAINT "AllianceHouseholdPlayer_alliancePlayerId_fkey" FOREIGN KEY ("alliancePlayerId") REFERENCES "AlliancePlayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
