ALTER TABLE "AllianceInvite"
ADD COLUMN "householdId" TEXT;

CREATE INDEX "AllianceInvite_householdId_status_expiresAt_idx"
ON "AllianceInvite"("householdId", "status", "expiresAt");

ALTER TABLE "AllianceInvite"
ADD CONSTRAINT "AllianceInvite_householdId_fkey"
FOREIGN KEY ("householdId") REFERENCES "AllianceHousehold"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
