-- DropForeignKey
ALTER TABLE "Alliance" DROP CONSTRAINT "Alliance_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "AllianceClaim" DROP CONSTRAINT "AllianceClaim_requestedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "AllianceGameNight" DROP CONSTRAINT "AllianceGameNight_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "AllianceInvite" DROP CONSTRAINT "AllianceInvite_invitedByUserId_fkey";

-- AlterTable
ALTER TABLE "Alliance" ALTER COLUMN "createdByUserId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "AllianceClaim" ALTER COLUMN "requestedByUserId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "AllianceGameNight" ALTER COLUMN "createdByUserId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "AllianceInvite" ALTER COLUMN "invitedByUserId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Alliance" ADD CONSTRAINT "Alliance_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceInvite" ADD CONSTRAINT "AllianceInvite_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceClaim" ADD CONSTRAINT "AllianceClaim_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceGameNight" ADD CONSTRAINT "AllianceGameNight_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
