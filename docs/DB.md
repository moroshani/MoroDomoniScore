# Database
Last run start review: 2026-02-25 01:15 UTC
Last run end review: 2026-02-25 11:46 UTC

PostgreSQL via Prisma. The `GameNight.data` field stores the serialized night record.

## Tables

### User
- `id` (uuid, PK)
- `name`
- `username` (unique)
- `email` (unique)
- `passwordHash`
- `role` (default `user`, e.g., `superadmin`)
- `createdAt`

### Player
- `id` (uuid, PK)
- `name`
- `avatar` (nullable)
- `userId` (FK -> User)
- `createdAt`

### GameNight
- `id` (uuid, PK)
- `userId` (FK -> User)
- `data` (JSON)
- `createdAt`

### Session
- `id` (uuid, PK)
- `userId` (FK -> User)
- `tokenId` (unique)
- `ipAddress` (nullable)
- `userAgent` (nullable)
- `deviceLabel` (nullable)
- `isTrusted` (boolean, default `false`)
- `createdAt`, `lastSeenAt`, `expiresAt`
- `revokedAt` (nullable)

### SecurityEvent
- `id` (uuid, PK)
- `userId` (FK -> User)
- `sessionId` (nullable FK -> Session)
- `type`, `severity`
- `ipAddress`, `userAgent` (nullable)
- `details` (JSONB, nullable)
- `createdAt`

### RecoveryRequest
- `id` (uuid, PK)
- `userId` (nullable FK -> User)
- `identifier`
- `reasonCode`
- `description` (nullable)
- `contactEmail` (nullable)
- `ipAddress`, `userAgent` (nullable)
- `status` (default `pending`)
- `createdAt`, `resolvedAt` (nullable), `resolutionNote` (nullable)

### Alliance
- `id` (uuid, PK)
- `name`
- `slug` (unique)
- `description` (nullable)
- `visibility` (`private` | `internal` | `public`)
- `createdByUserId` (nullable FK -> User, `SET NULL`)
- `createdAt`, `updatedAt`

### AllianceMembership
- `id` (uuid, PK)
- `allianceId` (FK -> Alliance)
- `userId` (FK -> User)
- `role` (`owner` | `admin` | `member` | `viewer`)
- `status` (`active` | `pending` | `suspended` | `removed`)
- `joinedAt`, `createdAt`, `updatedAt`
- unique (`allianceId`, `userId`)

### AlliancePlayer
- `id` (uuid, PK)
- `allianceId` (FK -> Alliance)
- `displayName`
- `avatar` (nullable)
- `claimState` (`unclaimed` | `pending` | `claimed`)
- `sourcePlayerId` (nullable FK -> Player, `SET NULL`)
- `createdAt`, `updatedAt`

### AlliancePlayerLink
- `id` (uuid, PK)
- `alliancePlayerId` (FK -> AlliancePlayer)
- `userId` (FK -> User)
- `createdAt`, `updatedAt`
- unique (`alliancePlayerId`, `userId`)

### AllianceInvite
- `id` (uuid, PK)
- `allianceId` (FK -> Alliance)
- `inviteeUserId` (nullable FK -> User)
- `inviteeEmail` (nullable)
- `inviteeUsername` (nullable)
- `role` (`owner` | `admin` | `member` | `viewer`)
- `status` (`pending` | `accepted` | `revoked` | `expired`)
- `tokenHash`
- `expiresAt`, `acceptedAt` (nullable), `revokedAt` (nullable)
- `invitedByUserId` (nullable FK -> User, `SET NULL`)
- `createdAt`, `updatedAt`

### AllianceClaim
- `id` (uuid, PK)
- `allianceId` (FK -> Alliance)
- `alliancePlayerId` (FK -> AlliancePlayer)
- `requesterUserId` (FK -> User)
- `requestedByUserId` (nullable FK -> User, `SET NULL`)
- `status` (`pending` | `approved` | `rejected` | `cancelled`)
- `note` (nullable), `decisionNote` (nullable)
- `decidedAt` (nullable), `decidedByUserId` (nullable FK -> User)
- `createdAt`, `updatedAt`

### AllianceGameNight
- `id` (uuid, PK)
- `allianceId` (FK -> Alliance)
- `hostAllianceId` (nullable FK -> Alliance)
- `scope` (`alliance_internal` | `cross_alliance` | `world_open` | `local_standard` | `quick_night`)
- `visibility` (`private` | `internal` | `public`)
- `createdByUserId` (nullable FK -> User, `SET NULL`)
- `sourceGameNightId` (nullable FK -> GameNight, unique)
- `data` (JSON)
- `createdAt`, `updatedAt`

### AllianceGameParticipant
- `id` (uuid, PK)
- `allianceGameNightId` (FK -> AllianceGameNight)
- `alliancePlayerId` (FK -> AlliancePlayer)
- `teamSlot` (nullable)
- `roleSnapshot` (nullable)
- `playerNameSnapshot`
- `createdAt`, `updatedAt`
- unique (`allianceGameNightId`, `alliancePlayerId`)

### Wave 3 Realtime Collaboration
- `AllianceLobby`
  - lobby code, scope, status, host, visibility, `currentVersion`, metadata, lifecycle timestamps.
- `AllianceLobbyMember`
  - membership presence state (`joined|ready|left|removed`), readiness, seat index, role snapshot, presence timestamps.
- `AllianceLobbyEvent`
  - immutable event log with `(lobbyId,eventId)` idempotency key, expected/resulting version, payload.
- `AllianceChatRoom`
  - room type (`direct|alliance|match`), optional alliance/lobby binding, optional `directKey`, archived timestamp.
- `AllianceChatRoomMember`
  - per-room user controls (`isMuted`, `mutedUntil`, `isBlocked`) plus role snapshot.
- `AllianceChatMessage`
  - message payload with `clientMessageId` idempotency key per room and moderation status.
- `AllianceChatReport`
  - abuse reports with review status and action metadata.
- `AllianceChatModerationAction`
  - immutable moderation action trail (actor, target user/message, reason, details).

## JSON Shape (GameNight.data)
Matches `types.ts` `NightRecord`.

## Notes
- Audit log and round history are kept in JSON for simplicity.
- Quick Night sessions are not persisted to `GameNight`.
- Migrations are managed via Prisma (`prisma/schema.prisma`).
- The protected immortal superadmin account cannot be deleted via `/api/users/me`.
- Wave 1 migration: `prisma/migrations/20260224204231_wave1_security_baseline/migration.sql`.
- Wave 2 migrations:
  - `prisma/migrations/20260224233718_wave2_alliance_identity_scope/migration.sql`
  - `prisma/migrations/20260225002953_wave2_alliance_fk_hardening/migration.sql`
- Wave 3 migration:
  - `prisma/migrations/20260225021854_wave3_realtime_chat_sync_backbone/migration.sql`
