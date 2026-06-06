import type {
  Guild,
  Member,
  Task,
  MarketItem,
  RankingEntry,
  PendingApplication,
  PromotionRequest,
  WeeklyReport,
  CharacterClass,
  MemberRole,
  TaskType,
  WarRecord,
  PlayerCharacter,
  EnemyGuild,
  MarketTrade,
  CompletedTaskHistory,
  RankingGuildDetail,
  Equipment,
} from '../types';

const avatarEmojis = ['⚔️', '🛡️', '🏹', '🔮', '💚', '🗡️', '👑', '🐉', '⚡', '🔥'];
const classEmojis: Record<CharacterClass, string> = {
  warrior: '⚔️',
  mage: '🔮',
  archer: '🏹',
  healer: '💚',
  assassin: '🗡️',
  knight: '🛡️',
};

const randomName = () => {
  const first = ['暗影', '烈焰', '寒霜', '圣光', '暴风', '星辰', '雷霆', '翡翠', '钢铁', '黄金'];
  const second = ['骑士', '游侠', '法师', '猎人', '战士', '守卫', '刺客', '祭司', '勇者', '英雄'];
  return first[Math.floor(Math.random() * first.length)] + second[Math.floor(Math.random() * second.length)];
};

const generateMember = (id: string, role: MemberRole, charClass?: CharacterClass): Member => {
  const classes: CharacterClass[] = ['warrior', 'mage', 'archer', 'healer', 'assassin', 'knight'];
  const selectedClass = charClass || classes[Math.floor(Math.random() * classes.length)];
  const level = Math.floor(Math.random() * 60) + 20;
  return {
    id,
    name: randomName(),
    avatar: avatarEmojis[Math.floor(Math.random() * avatarEmojis.length)],
    role,
    characterClass: selectedClass,
    level,
    power: Math.floor(level * 100 + Math.random() * 3000),
    contribution: Math.floor(Math.random() * 5000),
    status: {
      hp: 100,
      maxHp: 100,
      mp: 80,
      maxMp: 80,
      skillCooldowns: {},
      buffs: [],
      debuffs: [],
    },
    lastActive: new Date(Date.now() - Math.random() * 86400000),
    joinDate: new Date(Date.now() - Math.random() * 30 * 86400000),
  };
};

export const mockMembers: Member[] = [
  generateMember('1', 'leader', 'knight'),
  generateMember('2', 'vice_leader', 'mage'),
  generateMember('3', 'captain', 'warrior'),
  generateMember('4', 'captain', 'archer'),
  generateMember('5', 'member', 'healer'),
  generateMember('6', 'member', 'assassin'),
  generateMember('7', 'member', 'warrior'),
  generateMember('8', 'member', 'mage'),
  generateMember('9', 'member', 'archer'),
  generateMember('10', 'member', 'knight'),
];
mockMembers[0].name = '龙骑士·阿尔萨斯';
mockMembers[0].power = 8500;
mockMembers[1].name = '大法师·梅林';
mockMembers[1].power = 7800;

export const mockGuild: Guild = {
  id: 'guild-001',
  name: '龙之守望',
  badge: {
    icon: '🐉',
    color1: '#7c3aed',
    color2: '#fbbf24',
  },
  description: '守护大陆和平的传奇佣兵团，接受各种高难度委托！',
  serverId: '跨服-中央世界',
  members: mockMembers,
  reputation: 12580,
  totalPower: mockMembers.reduce((sum, m) => sum + m.power, 0),
  gold: 258600,
  materials: 15420,
  buildings: [
    {
      type: 'training_field',
      name: '神圣训练场',
      level: 5,
      maxLevel: 10,
      description: '提升团员训练效率，增加经验获取',
      upgradeCost: { gold: 50000, materials: 2000 },
      effect: '经验获取 +25%',
    },
    {
      type: 'workshop',
      name: '矮人工坊',
      level: 4,
      maxLevel: 10,
      description: '打造精良装备，提升图纸掉落率',
      upgradeCost: { gold: 80000, materials: 3500 },
      effect: '装备图纸掉落率 +20%',
    },
    {
      type: 'warehouse',
      name: '巨龙宝库',
      level: 6,
      maxLevel: 10,
      description: '扩大资源存储上限',
      upgradeCost: { gold: 30000, materials: 1500 },
      effect: '资源存储上限 +60%',
    },
  ],
  completedTasks: 156,
  failedTasks: 12,
  wars: [],
  weeklyActivity: [45, 52, 48, 61, 58, 72, 65],
  createdAt: new Date('2025-08-15'),
};

const taskNames: Record<TaskType, string[]> = {
  escort: ['护送商队穿越暗影森林', '护送皇室贡品至王都', '护送学者探索远古遗迹', '护送难民撤离战区'],
  assassinate: ['刺杀黑暗议会会长', '清除兽人部落酋长', '暗杀叛军首领', '消灭巫妖'],
  explore: ['探索失落的矮人王国', '勘察龙巢周边区域', '调查地下城异变', '搜寻远古神器碎片'],
};

const generateTask = (id: string, type: TaskType): Task => {
  const names = taskNames[type];
  const difficulty = Math.floor(Math.random() * 5) + 1;
  return {
    id,
    type,
    name: names[Math.floor(Math.random() * names.length)],
    description: type === 'escort' 
      ? '保护目标安全抵达目的地，途中可能遭遇山贼或魔物袭击'
      : type === 'assassinate'
      ? '潜入目标区域，精准击杀指定目标，避免打草惊蛇'
      : '深入未知区域探索，收集情报和资源，可能遭遇危险',
    difficulty,
    recommendedPower: difficulty * 2000 + Math.floor(Math.random() * 1000),
    rewards: {
      exp: difficulty * 500,
      gold: difficulty * 2000 + Math.floor(Math.random() * 3000),
      reputation: difficulty * 50,
      blueprints: Math.random() > 0.6 ? ['稀有装备图纸'] : [],
      contribution: difficulty * 100,
    },
    members: [],
    status: 'pending',
    progress: 0,
    createdAt: new Date(Date.now() - Math.random() * 86400000),
  };
};

export const mockTasks: Task[] = [
  generateTask('task-001', 'escort'),
  generateTask('task-002', 'assassinate'),
  generateTask('task-003', 'explore'),
  generateTask('task-004', 'escort'),
  generateTask('task-005', 'explore'),
];

export const mockMarketItems: MarketItem[] = [
  {
    id: 'item-001',
    sellerId: 'guild-002',
    sellerName: '烈焰战团',
    type: 'blueprint',
    name: '史诗·龙鳞战甲图纸',
    description: '可锻造史诗品质龙鳞战甲，防御力+500',
    rarity: 'epic',
    price: 85000,
    suggestedPriceRange: {
      min: 70000,
      max: 100000,
      avg: 85000,
    },
    createdAt: new Date(Date.now() - 3600000),
    expiresAt: new Date(Date.now() + 86400000 * 7),
  },
  {
    id: 'item-002',
    sellerId: 'guild-003',
    sellerName: '暗影兄弟会',
    type: 'intel',
    name: '龙巢位置情报',
    description: '详细记载了远古红龙巢穴的位置和周边布防',
    rarity: 'legendary',
    price: 150000,
    suggestedPriceRange: {
      min: 120000,
      max: 180000,
      avg: 150000,
    },
    createdAt: new Date(Date.now() - 7200000),
    expiresAt: new Date(Date.now() + 86400000 * 5),
  },
  {
    id: 'item-003',
    sellerId: 'guild-004',
    sellerName: '圣光骑士团',
    type: 'blueprint',
    name: '稀有·祝福之剑图纸',
    description: '锻造附带圣光祝福的长剑',
    rarity: 'rare',
    price: 28000,
    suggestedPriceRange: {
      min: 22000,
      max: 35000,
      avg: 28500,
    },
    createdAt: new Date(Date.now() - 1800000),
    expiresAt: new Date(Date.now() + 86400000 * 10),
  },
  {
    id: 'item-004',
    sellerId: 'guild-005',
    sellerName: '星辰远征',
    type: 'material',
    name: '凤凰羽毛 x10',
    description: '传说中凤凰的羽毛，制作史诗装备的必备材料',
    rarity: 'epic',
    price: 45000,
    suggestedPriceRange: {
      min: 38000,
      max: 55000,
      avg: 46500,
    },
    createdAt: new Date(Date.now() - 900000),
    expiresAt: new Date(Date.now() + 86400000 * 3),
  },
];

export const mockRankings: Record<string, RankingEntry[]> = {
  reputation: [
    { rank: 1, guildId: 'g1', guildName: '圣殿骑士团', badge: { icon: '⚔️', color1: '#fbbf24', color2: '#fff' }, serverId: '跨服-中央世界', value: 28900, memberCount: 48, totalPower: 285000 },
    { rank: 2, guildId: 'g2', guildName: '龙之守望', badge: { icon: '🐉', color1: '#7c3aed', color2: '#fbbf24' }, serverId: '跨服-中央世界', value: 12580, memberCount: 10, totalPower: 58500 },
    { rank: 3, guildId: 'g3', guildName: '烈焰战团', badge: { icon: '🔥', color1: '#dc2626', color2: '#f97316' }, serverId: '跨服-火焰之地', value: 11200, memberCount: 35, totalPower: 198000 },
    { rank: 4, guildId: 'g4', guildName: '暗影兄弟会', badge: { icon: '🗡️', color1: '#1f2937', color2: '#7c3aed' }, serverId: '跨服-暗影谷', value: 9800, memberCount: 28, totalPower: 165000 },
    { rank: 5, guildId: 'g5', guildName: '星辰远征', badge: { icon: '⭐', color1: '#3b82f6', color2: '#fff' }, serverId: '跨服-星界', value: 8750, memberCount: 42, totalPower: 235000 },
  ],
  power: [
    { rank: 1, guildId: 'g1', guildName: '圣殿骑士团', badge: { icon: '⚔️', color1: '#fbbf24', color2: '#fff' }, serverId: '跨服-中央世界', value: 285000, memberCount: 48, totalPower: 285000 },
    { rank: 2, guildId: 'g5', guildName: '星辰远征', badge: { icon: '⭐', color1: '#3b82f6', color2: '#fff' }, serverId: '跨服-星界', value: 235000, memberCount: 42, totalPower: 235000 },
    { rank: 3, guildId: 'g3', guildName: '烈焰战团', badge: { icon: '🔥', color1: '#dc2626', color2: '#f97316' }, serverId: '跨服-火焰之地', value: 198000, memberCount: 35, totalPower: 198000 },
    { rank: 4, guildId: 'g4', guildName: '暗影兄弟会', badge: { icon: '🗡️', color1: '#1f2937', color2: '#7c3aed' }, serverId: '跨服-暗影谷', value: 165000, memberCount: 28, totalPower: 165000 },
    { rank: 5, guildId: 'g2', guildName: '龙之守望', badge: { icon: '🐉', color1: '#7c3aed', color2: '#fbbf24' }, serverId: '跨服-中央世界', value: 58500, memberCount: 10, totalPower: 58500 },
  ],
  wealth: [
    { rank: 1, guildId: 'g5', guildName: '星辰远征', badge: { icon: '⭐', color1: '#3b82f6', color2: '#fff' }, serverId: '跨服-星界', value: 1250000, memberCount: 42, totalPower: 235000 },
    { rank: 2, guildId: 'g1', guildName: '圣殿骑士团', badge: { icon: '⚔️', color1: '#fbbf24', color2: '#fff' }, serverId: '跨服-中央世界', value: 980000, memberCount: 48, totalPower: 285000 },
    { rank: 3, guildId: 'g3', guildName: '烈焰战团', badge: { icon: '🔥', color1: '#dc2626', color2: '#f97316' }, serverId: '跨服-火焰之地', value: 756000, memberCount: 35, totalPower: 198000 },
    { rank: 4, guildId: 'g2', guildName: '龙之守望', badge: { icon: '🐉', color1: '#7c3aed', color2: '#fbbf24' }, serverId: '跨服-中央世界', value: 258600, memberCount: 10, totalPower: 58500 },
    { rank: 5, guildId: 'g4', guildName: '暗影兄弟会', badge: { icon: '🗡️', color1: '#1f2937', color2: '#7c3aed' }, serverId: '跨服-暗影谷', value: 198000, memberCount: 28, totalPower: 165000 },
  ],
};

export const mockPendingApplications: PendingApplication[] = [
  {
    id: 'app-001',
    applicantId: 'u-101',
    applicantName: '流浪剑客',
    applicantClass: 'warrior',
    applicantLevel: 45,
    applicantPower: 4200,
    message: '听说贵团实力强大，希望能加入一起冒险！',
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: 'app-002',
    applicantId: 'u-102',
    applicantName: '森林精灵',
    applicantClass: 'archer',
    applicantLevel: 38,
    applicantPower: 3500,
    message: '精通远程射击，愿意为团效力！',
    createdAt: new Date(Date.now() - 7200000),
  },
];

export const mockPromotionRequests: PromotionRequest[] = [
  {
    id: 'promo-001',
    memberId: '5',
    memberName: mockMembers[4].name,
    currentRole: 'member',
    targetRole: 'captain',
    reason: '近期表现优异，多次带队完成高难度任务',
    createdAt: new Date(Date.now() - 86400000),
  },
];

export const mockWeeklyReport: WeeklyReport = {
  weekStart: new Date(Date.now() - 7 * 86400000),
  weekEnd: new Date(),
  memberActivity: [
    { date: '周一', activeMembers: 8 },
    { date: '周二', activeMembers: 6 },
    { date: '周三', activeMembers: 9 },
    { date: '周四', activeMembers: 7 },
    { date: '周五', activeMembers: 10 },
    { date: '周六', activeMembers: 10 },
    { date: '周日', activeMembers: 9 },
  ],
  taskCompletionRate: 0.85,
  tasksByType: [
    { type: 'escort', completed: 8, total: 10 },
    { type: 'assassinate', completed: 5, total: 6 },
    { type: 'explore', completed: 10, total: 11 },
  ],
  lootHeatmap: [
    { category: '金币', value: 95000 },
    { category: '装备图纸', value: 12 },
    { category: '材料', value: 3800 },
    { category: '声望', value: 2400 },
    { category: '经验', value: 45000 },
  ],
  totalGoldEarned: 95000,
  totalReputationGained: 2400,
  totalExpEarned: 45000,
  topMembers: [
    { name: mockMembers[0].name, contribution: 2400 },
    { name: mockMembers[1].name, contribution: 1850 },
    { name: mockMembers[2].name, contribution: 1620 },
  ],
};

export const mockActiveWar: WarRecord = {
  id: 'war-001',
  attacker: {
    id: 'guild-001',
    name: '龙之守望',
    badge: { icon: '🐉', color1: '#7c3aed', color2: '#fbbf24' },
    troops: 150,
    morale: 85,
    kills: 45,
  },
  defender: {
    id: 'guild-006',
    name: '血色十字军',
    badge: { icon: '🩸', color1: '#dc2626', color2: '#1f2937' },
    troops: 180,
    morale: 72,
    kills: 28,
  },
  status: 'active',
  startTime: new Date(Date.now() - 1800000),
  battleLogs: [
    {
      timestamp: new Date(Date.now() - 1800000),
      attackerLoss: 15,
      defenderLoss: 25,
      attackerMoraleChange: 5,
      defenderMoraleChange: -8,
      description: '首轮交锋！龙之守望突击队成功突破第一道防线',
    },
    {
      timestamp: new Date(Date.now() - 1200000),
      attackerLoss: 20,
      defenderLoss: 30,
      attackerMoraleChange: 3,
      defenderMoraleChange: -10,
      description: '法师军团施展火焰风暴，敌军伤亡惨重',
    },
    {
      timestamp: new Date(Date.now() - 600000),
      attackerLoss: 10,
      defenderLoss: 18,
      attackerMoraleChange: 2,
      defenderMoraleChange: -5,
      description: '骑士团冲锋！击溃敌军侧翼',
    },
  ],
  killRanking: [
    { memberId: '1', memberName: '龙骑士·阿尔萨斯', kills: 15, contribution: 3000 },
    { memberId: '3', memberName: mockMembers[2].name, kills: 10, contribution: 2000 },
    { memberId: '2', memberName: '大法师·梅林', kills: 8, contribution: 1600 },
    { memberId: '4', memberName: mockMembers[3].name, kills: 7, contribution: 1400 },
    { memberId: '6', memberName: mockMembers[5].name, kills: 5, contribution: 1000 },
  ],
};

export const classInfo: Record<CharacterClass, { name: string; emoji: string; color: string }> = {
  warrior: { name: '战士', emoji: '⚔️', color: 'text-red-400' },
  mage: { name: '法师', emoji: '🔮', color: 'text-purple-400' },
  archer: { name: '弓箭手', emoji: '🏹', color: 'text-green-400' },
  healer: { name: '治疗师', emoji: '💚', color: 'text-emerald-400' },
  assassin: { name: '刺客', emoji: '🗡️', color: 'text-gray-400' },
  knight: { name: '骑士', emoji: '🛡️', color: 'text-amber-400' },
};

export const roleInfo: Record<MemberRole, { name: string; color: string }> = {
  leader: { name: '团长', color: 'bg-amber-500/20 text-amber-400 border-amber-500/50' },
  vice_leader: { name: '副团长', color: 'bg-purple-500/20 text-purple-400 border-purple-500/50' },
  captain: { name: '分队长', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
  member: { name: '团员', color: 'bg-gray-500/20 text-gray-400 border-gray-500/50' },
};

export const rarityColors: Record<string, string> = {
  common: 'text-gray-400 border-gray-500/50 bg-gray-500/10',
  rare: 'text-blue-400 border-blue-500/50 bg-blue-500/10',
  epic: 'text-purple-400 border-purple-500/50 bg-purple-500/10',
  legendary: 'text-amber-400 border-amber-500/50 bg-amber-500/10',
};

export { classEmojis };

const epicWeapon: Equipment = {
  id: 'equip-001',
  name: '史诗·星辰法杖',
  slot: 'weapon',
  rarity: 'epic',
  stats: { attack: 320, mp: 150 },
};

const epicArmor: Equipment = {
  id: 'equip-002',
  name: '史诗·奥术长袍',
  slot: 'armor',
  rarity: 'epic',
  stats: { defense: 280, hp: 500 },
};

const epicAccessory: Equipment = {
  id: 'equip-003',
  name: '史诗·魔力指环',
  slot: 'accessory',
  rarity: 'epic',
  stats: { mp: 200, attack: 80 },
};

export const mockPlayer: PlayerCharacter = {
  id: 'player-001',
  name: '冒险者·你',
  avatar: '🧙',
  characterClass: 'mage',
  level: 42,
  exp: 35600,
  expToNext: 50000,
  power: 5800,
  gold: 68500,
  equipment: {
    weapon: epicWeapon,
    armor: epicArmor,
    accessory: epicAccessory,
  },
};

export const mockEnemyGuilds: EnemyGuild[] = [
  {
    id: 'enemy-001',
    name: '血色十字军',
    badge: { icon: '🩸', color1: '#dc2626', color2: '#1f2937' },
    serverId: '跨服-中央世界',
    totalPower: 185000,
    memberCount: 45,
    reputation: 18500,
    gold: 680000,
    troops: 200,
    morale: 78,
  },
  {
    id: 'enemy-002',
    name: '暗影教团',
    badge: { icon: '🌑', color1: '#1f2937', color2: '#7c3aed' },
    serverId: '跨服-暗影谷',
    totalPower: 156000,
    memberCount: 38,
    reputation: 15200,
    gold: 520000,
    troops: 170,
    morale: 82,
  },
  {
    id: 'enemy-003',
    name: '兽人部落',
    badge: { icon: '👹', color1: '#65a30d', color2: '#78350f' },
    serverId: '跨服-蛮荒之地',
    totalPower: 128000,
    memberCount: 52,
    reputation: 12800,
    gold: 380000,
    troops: 250,
    morale: 90,
  },
  {
    id: 'enemy-004',
    name: '亡灵大军',
    badge: { icon: '💀', color1: '#4b5563', color2: '#0f172a' },
    serverId: '跨服-北境冰原',
    totalPower: 200000,
    memberCount: 60,
    reputation: 22000,
    gold: 890000,
    troops: 300,
    morale: 95,
  },
  {
    id: 'enemy-005',
    name: '海盗联盟',
    badge: { icon: '🏴‍☠️', color1: '#1e3a8a', color2: '#065f46' },
    serverId: '跨服-无尽之海',
    totalPower: 95000,
    memberCount: 30,
    reputation: 9800,
    gold: 1250000,
    troops: 150,
    morale: 70,
  },
  {
    id: 'enemy-006',
    name: '烈焰军团',
    badge: { icon: '🔥', color1: '#f97316', color2: '#dc2626' },
    serverId: '跨服-火焰之地',
    totalPower: 168000,
    memberCount: 42,
    reputation: 16800,
    gold: 580000,
    troops: 185,
    morale: 85,
  },
];

const marketTradeNames: Record<string, { blueprint: string[]; intel: string[]; material: string[] }> = {
  common: {
    blueprint: ['普通·铁剑图纸', '普通·布甲图纸', '普通·皮靴图纸', '普通·木盾图纸'],
    intel: ['山贼据点位置', '低级矿脉情报', '普通怪物分布图'],
    material: ['铁矿石 x50', '粗布 x30', '木材 x100', '草药 x20'],
  },
  rare: {
    blueprint: ['稀有·精钢长剑图纸', '稀有·锁子甲图纸', '稀有·魔法弓图纸'],
    intel: ['隐藏洞穴坐标', '稀有怪物刷新点', '宝藏地图碎片'],
    material: ['精钢锭 x20', '魔法丝线 x15', '月光石 x10', '稀有草药 x15'],
  },
  epic: {
    blueprint: ['史诗·龙鳞战甲图纸', '史诗·烈焰法杖图纸', '史诗·暗影匕首图纸'],
    intel: ['龙巢周边布防图', '远古遗迹入口', '史诗装备锻造秘方'],
    material: ['龙鳞 x5', '凤凰羽毛 x8', '奥术水晶 x12', '远古符文石 x6'],
  },
  legendary: {
    blueprint: ['传说·神器降世图纸', '传说·神圣铠甲图纸', '传说·命运之剑图纸'],
    intel: ['神龙巢穴精确坐标', '失落神宫位置', '创世神器碎片情报'],
    material: ['龙之核心 x1', '永恒之火 x2', '世界树精华 x3', '星辰碎片 x5'],
  },
};

const guildNames = ['圣殿骑士团', '龙之守望', '烈焰战团', '暗影兄弟会', '星辰远征', '圣光骑士团', '血色十字军', '翡翠猎人', '雷霆战士', '黄金骑士'];
const rarityList: ('common' | 'rare' | 'epic' | 'legendary')[] = ['common', 'rare', 'epic', 'legendary'];
const typeList: ('blueprint' | 'intel' | 'material')[] = ['blueprint', 'intel', 'material'];

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const getPriceByRarity = (rarity: string) => {
  switch (rarity) {
    case 'common': return randomInt(500, 5000);
    case 'rare': return randomInt(5000, 30000);
    case 'epic': return randomInt(30000, 100000);
    case 'legendary': return randomInt(100000, 300000);
    default: return randomInt(500, 5000);
  }
};

const generateMarketTrades = (): MarketTrade[] => {
  const trades: MarketTrade[] = [];
  for (let i = 0; i < 22; i++) {
    const rarity = rarityList[randomInt(0, 3)];
    const type = typeList[randomInt(0, 2)];
    const names = marketTradeNames[rarity][type];
    const name = names[randomInt(0, names.length - 1)];
    const buyer = guildNames[randomInt(0, guildNames.length - 1)];
    let seller = guildNames[randomInt(0, guildNames.length - 1)];
    while (seller === buyer) {
      seller = guildNames[randomInt(0, guildNames.length - 1)];
    }
    trades.push({
      id: `trade-${String(i + 1).padStart(3, '0')}`,
      itemName: name,
      itemType: type,
      rarity: rarity as 'common' | 'rare' | 'epic' | 'legendary',
      price: getPriceByRarity(rarity),
      buyerName: buyer,
      sellerName: seller,
      timestamp: new Date(Date.now() - randomInt(1, 7) * 86400000 - randomInt(0, 86400000)),
    });
  }
  return trades.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const mockMarketTrades: MarketTrade[] = generateMarketTrades();

const completedTaskNames: Record<TaskType, string[]> = {
  escort: ['护送商队穿越暗影森林', '护送皇室贡品至王都', '护送学者探索远古遗迹', '护送难民撤离战区', '护送使者前往邻国'],
  assassinate: ['刺杀黑暗议会会长', '清除兽人部落酋长', '暗杀叛军首领', '消灭巫妖', '诛杀恶龙心腹'],
  explore: ['探索失落的矮人王国', '勘察龙巢周边区域', '调查地下城异变', '搜寻远古神器碎片', '探索精灵秘境'],
};

const generateCompletedTasks = (): CompletedTaskHistory[] => {
  const tasks: CompletedTaskHistory[] = [];
  const types: TaskType[] = ['escort', 'assassinate', 'explore'];
  for (let i = 0; i < 24; i++) {
    const type = types[i % 3];
    const names = completedTaskNames[type];
    const difficulty = randomInt(1, 5);
    const success = Math.random() < 0.85;
    const memberCount = randomInt(2, 5);
    const memberIds: string[] = [];
    for (let j = 0; j < memberCount; j++) {
      memberIds.push(String(randomInt(1, 10)));
    }
    tasks.push({
      id: `hist-${String(i + 1).padStart(3, '0')}`,
      type,
      name: names[randomInt(0, names.length - 1)],
      difficulty,
      success,
      completedAt: new Date(Date.now() - randomInt(1, 30) * 86400000 - randomInt(0, 86400000)),
      participatingMemberIds: [...new Set(memberIds)],
    });
  }
  return tasks.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
};

export const mockCompletedTasks: CompletedTaskHistory[] = generateCompletedTasks();

const classes: CharacterClass[] = ['warrior', 'mage', 'archer', 'healer', 'assassin', 'knight'];

const generateLineup = (count: number) => {
  const lineup = [];
  for (let i = 0; i < count; i++) {
    const charClass = classes[i % classes.length];
    const level = randomInt(45, 70);
    lineup.push({
      name: randomName(),
      characterClass: charClass,
      level,
      power: level * 100 + randomInt(1000, 4000),
      avatar: classEmojis[charClass],
    });
  }
  return lineup;
};

export const mockRankingGuildDetails: Record<string, RankingGuildDetail> = {
  g1: {
    lineup: generateLineup(7),
    buildings: [
      { name: '圣殿训练场', type: 'training_field', level: 10 },
      { name: '神圣工坊', type: 'workshop', level: 9 },
      { name: '教皇宝库', type: 'warehouse', level: 10 },
    ],
  },
  g2: {
    lineup: generateLineup(6),
    buildings: [
      { name: '神圣训练场', type: 'training_field', level: 5 },
      { name: '矮人工坊', type: 'workshop', level: 4 },
      { name: '巨龙宝库', type: 'warehouse', level: 6 },
    ],
  },
  g3: {
    lineup: generateLineup(8),
    buildings: [
      { name: '烈焰训练场', type: 'training_field', level: 8 },
      { name: '熔岩工坊', type: 'workshop', level: 7 },
      { name: '火焰宝库', type: 'warehouse', level: 7 },
    ],
  },
  g4: {
    lineup: generateLineup(7),
    buildings: [
      { name: '暗影训练场', type: 'training_field', level: 7 },
      { name: '隐秘工坊', type: 'workshop', level: 8 },
      { name: '秘密宝库', type: 'warehouse', level: 6 },
    ],
  },
  g5: {
    lineup: generateLineup(8),
    buildings: [
      { name: '星辰训练场', type: 'training_field', level: 9 },
      { name: '星界工坊', type: 'workshop', level: 8 },
      { name: '星海宝库', type: 'warehouse', level: 9 },
    ],
  },
};

export const guildClassSkills: Record<CharacterClass, { name: string; damage: number; mpCost: number; cooldown: number }[]> = {
  warrior: [
    { name: '猛力斩击', damage: 180, mpCost: 20, cooldown: 3 },
    { name: '旋风斩', damage: 250, mpCost: 35, cooldown: 5 },
    { name: '战吼', damage: 100, mpCost: 15, cooldown: 8 },
  ],
  mage: [
    { name: '火球术', damage: 220, mpCost: 25, cooldown: 2 },
    { name: '冰霜新星', damage: 280, mpCost: 40, cooldown: 4 },
    { name: '奥术爆发', damage: 400, mpCost: 60, cooldown: 8 },
  ],
  archer: [
    { name: '精准射击', damage: 200, mpCost: 15, cooldown: 2 },
    { name: '箭雨', damage: 260, mpCost: 30, cooldown: 5 },
    { name: '穿透箭', damage: 350, mpCost: 45, cooldown: 7 },
  ],
  healer: [
    { name: '圣光打击', damage: 150, mpCost: 20, cooldown: 2 },
    { name: '神圣惩击', damage: 240, mpCost: 35, cooldown: 5 },
  ],
  assassin: [
    { name: '背刺', damage: 280, mpCost: 25, cooldown: 3 },
    { name: '毒刃', damage: 200, mpCost: 20, cooldown: 2 },
    { name: '影袭', damage: 380, mpCost: 50, cooldown: 8 },
  ],
  knight: [
    { name: '盾击', damage: 160, mpCost: 15, cooldown: 2 },
    { name: '冲锋', damage: 230, mpCost: 30, cooldown: 4 },
    { name: '制裁之锤', damage: 320, mpCost: 45, cooldown: 7 },
  ],
};
