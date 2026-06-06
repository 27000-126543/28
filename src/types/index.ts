export type MemberRole = 'leader' | 'vice_leader' | 'captain' | 'member';

export type CharacterClass = 'warrior' | 'mage' | 'archer' | 'healer' | 'assassin' | 'knight';

export type TaskType = 'escort' | 'assassinate' | 'explore';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export type BuildingType = 'training_field' | 'workshop' | 'warehouse';

export type BattleStatus = 'idle' | 'attacking' | 'defending' | 'ended';

export type MarketItemType = 'blueprint' | 'intel' | 'material';

export interface Equipment {
  id: string;
  name: string;
  slot: 'weapon' | 'armor' | 'accessory';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  stats: { attack?: number; defense?: number; hp?: number; mp?: number };
}

export interface PlayerCharacter {
  id: string;
  name: string;
  avatar: string;
  characterClass: CharacterClass;
  level: number;
  exp: number;
  expToNext: number;
  power: number;
  gold: number;
  equipment: { weapon?: Equipment; armor?: Equipment; accessory?: Equipment };
}

export interface MemberStatus {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  skillCooldowns: Record<string, number>;
  buffs: string[];
  debuffs: string[];
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: MemberRole;
  characterClass: CharacterClass;
  level: number;
  power: number;
  contribution: number;
  status: MemberStatus;
  lastActive: Date;
  joinDate: Date;
}

export interface GuildBadge {
  icon: string;
  color1: string;
  color2: string;
}

export interface GuildBuilding {
  type: BuildingType;
  name: string;
  level: number;
  maxLevel: number;
  description: string;
  upgradeCost: {
    gold: number;
    materials: number;
  };
  effect: string;
}

export interface Guild {
  id: string;
  name: string;
  badge: GuildBadge;
  description: string;
  serverId: string;
  members: Member[];
  reputation: number;
  totalPower: number;
  gold: number;
  materials: number;
  buildings: GuildBuilding[];
  completedTasks: number;
  failedTasks: number;
  wars: WarRecord[];
  weeklyActivity: number[];
  createdAt: Date;
}

export interface Task {
  id: string;
  type: TaskType;
  name: string;
  description: string;
  difficulty: number;
  recommendedPower: number;
  rewards: {
    exp: number;
    gold: number;
    reputation: number;
    blueprints?: string[];
    contribution?: number;
  };
  members: string[];
  status: TaskStatus;
  progress: number;
  events?: BattleEvent[];
  createdAt: Date;
}

export interface BattleEvent {
  id: string;
  type: 'monster_berserk' | 'ambush' | 'treasure' | 'trap';
  name: string;
  description: string;
  timestamp: Date;
  result: {
    damage?: number;
    healing?: number;
    loot?: string[];
    casualties?: string[];
  };
}

export interface TaskResult {
  success: boolean;
  exp: number;
  gold: number;
  reputation: number;
  blueprints: string[];
  contributionLoss: number;
  battleLog: string[];
}

export interface WarGuild {
  id: string;
  name: string;
  badge: GuildBadge;
  troops: number;
  morale: number;
  kills: number;
}

export interface WarBattleLog {
  timestamp: Date;
  attackerLoss: number;
  defenderLoss: number;
  attackerMoraleChange: number;
  defenderMoraleChange: number;
  description: string;
}

export interface WarRecord {
  id: string;
  attacker: WarGuild;
  defender: WarGuild;
  status: 'active' | 'ended';
  winner?: string;
  startTime: Date;
  endTime?: Date;
  battleLogs: WarBattleLog[];
  killRanking: { memberId: string; memberName: string; kills: number; contribution: number }[];
}

export interface MarketItem {
  id: string;
  sellerId: string;
  sellerName: string;
  type: MarketItemType;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  price: number;
  suggestedPriceRange: {
    min: number;
    max: number;
    avg: number;
  };
  createdAt: Date;
  expiresAt: Date;
}

export interface PriceHistory {
  itemName: string;
  prices: { date: Date; price: number }[];
  avg7Days: number;
  min7Days: number;
  max7Days: number;
}

export interface WeeklyReport {
  weekStart: Date;
  weekEnd: Date;
  memberActivity: { date: string; activeMembers: number }[];
  taskCompletionRate: number;
  tasksByType: { type: TaskType; completed: number; total: number }[];
  lootHeatmap: { category: string; value: number }[];
  totalGoldEarned: number;
  totalReputationGained: number;
  totalExpEarned: number;
  topMembers: { name: string; contribution: number }[];
}

export interface RankingEntry {
  rank: number;
  guildId: string;
  guildName: string;
  badge: GuildBadge;
  serverId: string;
  value: number;
  memberCount: number;
  totalPower: number;
}

export type RankingType = 'reputation' | 'power' | 'wealth';

export interface PendingApplication {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantClass: CharacterClass;
  applicantLevel: number;
  applicantPower: number;
  message: string;
  createdAt: Date;
}

export interface PromotionRequest {
  id: string;
  memberId: string;
  memberName: string;
  currentRole: MemberRole;
  targetRole: MemberRole;
  reason: string;
  createdAt: Date;
}

export interface MarketTrade {
  id: string;
  itemName: string;
  itemType: MarketItemType;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  price: number;
  buyerName: string;
  sellerName: string;
  timestamp: Date;
}

export interface CompletedTaskHistory {
  id: string;
  type: TaskType;
  name: string;
  difficulty: number;
  success: boolean;
  completedAt: Date;
  participatingMemberIds: string[];
}

export interface EnemyGuild {
  id: string;
  name: string;
  badge: GuildBadge;
  serverId: string;
  totalPower: number;
  memberCount: number;
  reputation: number;
  gold: number;
  troops: number;
  morale: number;
}

export interface RankingGuildDetail {
  lineup: { name: string; characterClass: CharacterClass; level: number; power: number; avatar: string }[];
  buildings: { name: string; type: BuildingType; level: number }[];
}

