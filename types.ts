export enum GameScreen {
  ModeSelection,
  NameSetup,
  Scoring,
  History,
  Stats,
}

export enum GameModeType {
  TwoPlayers = '2P',
  ThreePlayers = '3P',
  FourPlayers = '4P',
}

export interface GameModeDetails {
  type: GameModeType;
  title: string;
  description: string;
  teams: number;
  playersPerTeam: number;
  pointCap: number;
}

export interface Player {
  id: string; 
  name: string;
  avatar?: string;
}

export interface Team {
  id: number;
  name: string;
  players: Player[];
  currentGameScore: number;
  gamesWon: number;
  setsWon: number;
}

export interface RoundScore {
  teamId: number;
  teamName: string;
  score: number;
}

export type RoundType = 'standard';

export interface RoundHistoryItem {
  id: string;
  roundNumber: number;
  type: RoundType;
  scores: RoundScore[];
  createdAt: string;
}

export type AuditAction = 'round_added' | 'round_edited' | 'round_undone';

export interface AuditLogEntry {
  id: string;
  action: AuditAction;
  roundNumber?: number;
  actor: string;
  createdAt: string;
  details?: string;
}

export interface SpectatorState {
  teams: Team[];
  gameNumber: number;
  setNumber: number;
  pointCap: number;
  roundHistory: RoundHistoryItem[];
  tieBreakerMessage: string;
  updatedAt: string;
}

export interface GameRecord {
  gameNumber: number;
  teams: { id: number, name: string, score: number, players: Player[] }[];
  winnerTeamId: number;
}

export interface SetRecord {
    setNumber: number;
    games: GameRecord[];
    winnerTeamId?: number;
}

export interface NightRecord {
  id: string;
  date: string;
  mode: GameModeDetails;
  sets: SetRecord[];
  nightWinnerTeamId?: number;
  rounds?: RoundHistoryItem[];
  auditLog?: AuditLogEntry[];
}

export interface PlayerStats {
  name: string;
  avatar?: string;
  gamesPlayed: number;
  gamesWon: number;
  winRate: string;
  totalPoints: number;
  avgPointsPerGame: string;
  setWins: number;
  nightWins: number;
}

export interface HeadToHeadStats {
    player1Name: string;
    player2Name:string;
    gamesPlayedTogether: number;
    player1Wins: number;
    player2Wins: number;
    ties: number;
}

export interface TeamupStats {
  teamupId: string;
  players: Array<{
    playerId: string;
    displayName: string;
    avatar?: string | null;
  }>;
  gamesPlayed: number;
  gamesWon: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDiff: number;
  avgPointDiff: string;
  setWins: number;
  nightWins: number;
  winRate: string;
}

export interface TeamupMatchupMember {
  teamupId: string;
  players: Array<{
    playerId: string;
    displayName: string;
    avatar?: string | null;
  }>;
  gamesWon: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDiff: number;
  winRate: string;
}

export interface TeamupMatchup {
  matchupId: string;
  gamesPlayed: number;
  members: [TeamupMatchupMember, TeamupMatchupMember];
}

export interface AllianceHouseholdMatchupMember {
  householdId: string;
  name: string;
  slug: string;
  gamesWon: number;
  setWins: number;
  nightWins: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDiff: number;
  winRate: string;
}

export interface AllianceHouseholdMatchup {
  matchupId: string;
  households: Array<{
    householdId: string;
    name: string;
    slug: string;
  }>;
  gamesPlayed: number;
  gamesDecided: number;
  members: AllianceHouseholdMatchupMember[];
}

export interface WinState {
    winner: Team;
    level: 'game' | 'set' | 'night';
    finalScore?: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string | null;
  role?: string;
  createdAt?: string;
  isImmortal?: boolean;
}

export interface UserSession {
  id: string;
  createdAt: string;
  lastSeenAt: string;
  expiresAt: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  deviceLabel?: string | null;
  isTrusted?: boolean;
  isCurrent: boolean;
}

export interface SecurityEvent {
  id: string;
  type: string;
  severity: 'info' | 'low' | 'medium' | 'high' | string;
  ipAddress?: string | null;
  userAgent?: string | null;
  details?: Record<string, unknown> | null;
  createdAt: string;
}

export interface RecoveryRequestSummary {
  id: string;
  reasonCode: string;
  status: string;
  createdAt: string;
  resolvedAt?: string | null;
}

export type MatchScope =
  | 'alliance_internal'
  | 'cross_alliance'
  | 'world_open'
  | 'local_standard'
  | 'quick_night';

export type AllianceVisibility = 'private' | 'alliance' | 'world';

export type AllianceRole = 'owner' | 'admin' | 'member' | 'viewer';
export type AllianceMembershipStatus = 'active' | 'invited' | 'suspended';
export type AllianceClaimStatus = 'pending' | 'approved' | 'rejected';
export type AlliancePlayerClaimState = 'unclaimed' | 'pending' | 'claimed';

export interface AllianceSummary {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  createdByUserId?: string | null;
  myRole: AllianceRole;
  myStatus: AllianceMembershipStatus;
  myJoinedAt?: string | null;
  membersCount: number;
  playersCount: number;
}

export interface AllianceMembership {
  id: string;
  allianceId: string;
  userId: string;
  role: AllianceRole;
  status: AllianceMembershipStatus;
  joinedAt?: string | null;
  createdAt: string;
  user?: User;
}

export interface AllianceInvite {
  id: string;
  allianceId: string;
  householdId?: string | null;
  householdName?: string | null;
  householdSlug?: string | null;
  role: AllianceRole;
  status: 'active' | 'accepted' | 'revoked' | 'expired';
  inviteeEmail?: string | null;
  inviteeUsername?: string | null;
  invitedByUserId?: string | null;
  acceptedByUserId?: string | null;
  expiresAt: string;
  acceptedAt?: string | null;
  revokedAt?: string | null;
  createdAt: string;
}

export interface AlliancePlayer {
  id: string;
  allianceId: string;
  displayName: string;
  avatar?: string | null;
  claimState: AlliancePlayerClaimState;
  sourcePlayerId?: string | null;
  createdByUserId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AllianceHouseholdUserMembership {
  id: string;
  householdId: string;
  userId: string;
  role: AllianceRole;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User | null;
}

export interface AllianceHouseholdPlayerMembership {
  id: string;
  householdId: string;
  alliancePlayerId: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  alliancePlayer?: AlliancePlayer | null;
}

export interface AllianceHousehold {
  id: string;
  allianceId: string;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
  createdByUserId?: string | null;
  createdAt: string;
  updatedAt: string;
  users: AllianceHouseholdUserMembership[];
  players: AllianceHouseholdPlayerMembership[];
  counts: {
    users: number;
    players: number;
  };
}

export interface AllianceClaim {
  id: string;
  allianceId: string;
  alliancePlayerId: string;
  requestedByUserId?: string | null;
  reviewedByUserId?: string | null;
  status: AllianceClaimStatus;
  note?: string | null;
  createdAt: string;
  reviewedAt?: string | null;
}

export interface AllianceHistoryRecord {
  id: string;
  allianceId: string;
  legacyGameNightId?: string | null;
  scope: MatchScope;
  visibility: AllianceVisibility;
  eligibilityFlags?: Record<string, boolean> | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  data: NightRecord;
}

export interface RealtimeLobbyMember {
  id: string;
  userId: string;
  status: string;
  isReady: boolean;
  seatIndex?: number | null;
  roleSnapshot?: string | null;
  displayName?: string | null;
  joinedAt?: string | null;
  leftAt?: string | null;
  lastSeenAt?: string | null;
  user?: User | null;
}

export interface RealtimeLobby {
  id: string;
  code: string;
  title: string;
  scope: MatchScope;
  status: string;
  modeType: string;
  maxSeats: number;
  allianceId?: string | null;
  hostUserId: string;
  visibility: AllianceVisibility;
  currentVersion: number;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  startedAt?: string | null;
  endedAt?: string | null;
  lastActivityAt?: string | null;
  host?: User | null;
  members: RealtimeLobbyMember[];
}

export interface RealtimeChatRoomMember {
  id: string;
  userId: string;
  role: string;
  isMuted: boolean;
  mutedUntil?: string | null;
  isBlocked: boolean;
  joinedAt?: string | null;
  user?: User | null;
}

export interface RealtimeChatRoom {
  id: string;
  type: 'direct' | 'alliance' | 'match';
  allianceId?: string | null;
  lobbyId?: string | null;
  title?: string | null;
  archivedAt?: string | null;
  createdByUserId?: string | null;
  createdAt: string;
  updatedAt: string;
  members: RealtimeChatRoomMember[];
}

export interface RealtimeChatMessage {
  id: string;
  roomId: string;
  senderUserId?: string | null;
  clientMessageId?: string | null;
  text: string;
  status: string;
  moderatedByUserId?: string | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  sender?: User | null;
}
