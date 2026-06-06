import { create } from 'zustand';
import type {
  Guild,
  Task,
  MarketItem,
  RankingEntry,
  PendingApplication,
  PromotionRequest,
  WeeklyReport,
  WarRecord,
  Member,
  TaskResult,
  MemberRole,
  TaskType,
  PlayerCharacter,
  EnemyGuild,
  MarketTrade,
  CompletedTaskHistory,
  RankingGuildDetail,
  BattleEvent,
  MemberStatus,
} from '../types';
import {
  mockGuild,
  mockTasks,
  mockMarketItems,
  mockRankings,
  mockPendingApplications,
  mockPromotionRequests,
  mockWeeklyReport,
  mockActiveWar,
  mockPlayer,
  mockEnemyGuilds,
  mockMarketTrades,
  mockCompletedTasks,
  mockRankingGuildDetails,
  guildClassSkills,
} from '../data/mockData';

interface GameState {
  player: PlayerCharacter;
  guild: Guild;
  tasks: Task[];
  activeTask: Task | null;
  taskResult: TaskResult | null;
  battleLog: string[];
  battleEvents: BattleEvent[];
  marketItems: MarketItem[];
  rankings: Record<string, RankingEntry[]>;
  pendingApplications: PendingApplication[];
  promotionRequests: PromotionRequest[];
  weeklyReport: WeeklyReport;
  activeWar: WarRecord | null;
  enemyGuilds: EnemyGuild[];
  marketTrades: MarketTrade[];
  completedTaskHistory: CompletedTaskHistory[];
  rankingGuildDetails: Record<string, RankingGuildDetail>;
  serverAnnouncements: string[];
  currentUserRole: MemberRole;
  notification: string | null;

  createGuild: (name: string, badge: { icon: string; color1: string; color2: string }, description: string) => void;
  applyToGuild: (guildId: string, message: string) => void;
  approveApplication: (applicationId: string) => void;
  rejectApplication: (applicationId: string) => void;
  approvePromotion: (requestId: string) => void;
  rejectPromotion: (requestId: string) => void;
  requestPromotion: (memberId: string, targetRole: MemberRole, reason: string) => void;
  upgradeBuilding: (buildingType: string) => boolean;
  getGuildBuildingEffects: () => { expBonus: number; blueprintBonus: number; storageLimit: number };

  recommendTasks: () => Task[];
  startTask: (taskId: string, memberIds: string[]) => boolean;
  updateTaskProgress: () => { ended: boolean; triggeredEvent: BattleEvent | null };
  completeTask: (success: boolean) => void;
  clearTaskResult: () => void;

  declareWar: (defenderId: string) => boolean;
  updateWarProgress: () => boolean;
  endWar: () => void;
  clearActiveWar: () => void;

  listMarketItem: (item: Omit<MarketItem, 'id' | 'createdAt' | 'expiresAt' | 'suggestedPriceRange'>) => boolean;
  buyMarketItem: (itemId: string) => boolean;
  getSuggestedPrice: (itemName: string, rarity: string, itemType?: string) => { min: number; max: number; avg: number };

  exportWeeklyReportPDF: () => void;
  refreshRankings: () => void;
  addAnnouncement: (msg: string) => void;
  setNotification: (msg: string | null) => void;
  getRankingGuildDetail: (guildId: string) => RankingGuildDetail | null;
}

export const useGameStore = create<GameState>((set, get) => ({
  player: mockPlayer,
  guild: mockGuild,
  tasks: mockTasks,
  activeTask: null,
  taskResult: null,
  battleLog: [],
  battleEvents: [],
  marketItems: mockMarketItems,
  rankings: mockRankings,
  pendingApplications: mockPendingApplications,
  promotionRequests: mockPromotionRequests,
  weeklyReport: mockWeeklyReport,
  activeWar: mockActiveWar,
  enemyGuilds: mockEnemyGuilds,
  marketTrades: mockMarketTrades,
  completedTaskHistory: mockCompletedTasks,
  rankingGuildDetails: mockRankingGuildDetails,
  serverAnnouncements: [
    '【全服公告】恭喜圣殿骑士团夺得本周声望榜第一！',
    '【全服公告】史诗·龙鳞战甲图纸已上架市场！',
    '【活动预告】跨服公会战即将开启，敬请期待！',
  ],
  currentUserRole: 'leader',
  notification: null,

  setNotification: (msg) => set({ notification: msg }),

  createGuild: (name, badge, description) => {
    set((state) => ({
      guild: { ...state.guild, name, badge, description },
    }));
  },

  applyToGuild: () => {
    set((state) => ({
      pendingApplications: [
        ...state.pendingApplications,
        {
          id: `app-${Date.now()}`,
          applicantId: `u-${Date.now()}`,
          applicantName: '冒险者',
          applicantClass: 'warrior',
          applicantLevel: 30,
          applicantPower: 2500,
          message: '请求加入佣兵团！',
          createdAt: new Date(),
        },
      ],
    }));
  },

  approveApplication: (applicationId) => {
    set((state) => {
      const app = state.pendingApplications.find((a) => a.id === applicationId);
      if (!app) return state;
      const newMember: Member = {
        id: app.applicantId,
        name: app.applicantName,
        avatar: '⚔️',
        role: 'member',
        characterClass: app.applicantClass,
        level: app.applicantLevel,
        power: app.applicantPower,
        contribution: 0,
        status: { hp: 100, maxHp: 100, mp: 80, maxMp: 80, skillCooldowns: {}, buffs: [], debuffs: [] },
        lastActive: new Date(),
        joinDate: new Date(),
      };
      return {
        guild: {
          ...state.guild,
          members: [...state.guild.members, newMember],
          totalPower: state.guild.totalPower + app.applicantPower,
        },
        pendingApplications: state.pendingApplications.filter((a) => a.id !== applicationId),
      };
    });
  },

  rejectApplication: (applicationId) => {
    set((state) => ({ pendingApplications: state.pendingApplications.filter((a) => a.id !== applicationId) }));
  },

  approvePromotion: (requestId) => {
    set((state) => {
      const req = state.promotionRequests.find((r) => r.id === requestId);
      if (!req) return state;
      return {
        guild: {
          ...state.guild,
          members: state.guild.members.map((m) => (m.id === req.memberId ? { ...m, role: req.targetRole } : m)),
        },
        promotionRequests: state.promotionRequests.filter((r) => r.id !== requestId),
      };
    });
  },

  rejectPromotion: (requestId) => {
    set((state) => ({ promotionRequests: state.promotionRequests.filter((r) => r.id !== requestId) }));
  },

  requestPromotion: (memberId, targetRole, reason) => {
    const member = get().guild.members.find((m) => m.id === memberId);
    if (!member) return;
    set((state) => ({
      promotionRequests: [
        ...state.promotionRequests,
        { id: `promo-${Date.now()}`, memberId, memberName: member.name, currentRole: member.role, targetRole, reason, createdAt: new Date() },
      ],
    }));
  },

  getGuildBuildingEffects: () => {
    const { buildings } = get().guild;
    const training = buildings.find((b) => b.type === 'training_field');
    const workshop = buildings.find((b) => b.type === 'workshop');
    const warehouse = buildings.find((b) => b.type === 'warehouse');
    return {
      expBonus: 1 + (training?.level || 0) * 0.05,
      blueprintBonus: 1 + (workshop?.level || 0) * 0.05,
      storageLimit: 10000 + (warehouse?.level || 0) * 5000,
    };
  },

  upgradeBuilding: (buildingType) => {
    const state = get();
    const building = state.guild.buildings.find((b) => b.type === buildingType);
    if (!building) {
      state.setNotification('建筑不存在！');
      return false;
    }
    if (building.level >= building.maxLevel) {
      state.setNotification('建筑已达到最高等级！');
      return false;
    }
    if (state.guild.gold < building.upgradeCost.gold) {
      state.setNotification(`金币不足！需要 ${building.upgradeCost.gold} 金币`);
      return false;
    }
    if (state.guild.materials < building.upgradeCost.materials) {
      state.setNotification(`材料不足！需要 ${building.upgradeCost.materials} 材料`);
      return false;
    }
    set((st) => ({
      guild: {
        ...st.guild,
        gold: st.guild.gold - building.upgradeCost.gold,
        materials: st.guild.materials - building.upgradeCost.materials,
        buildings: st.guild.buildings.map((b) =>
          b.type === buildingType
            ? {
                ...b,
                level: b.level + 1,
                effect:
                  b.type === 'training_field'
                    ? `经验获取 +${(b.level + 1) * 5}%`
                    : b.type === 'workshop'
                    ? `装备图纸掉落率 +${(b.level + 1) * 5}%`
                    : `资源存储上限 +${(b.level + 1) * 5000}`,
                upgradeCost: {
                  gold: Math.floor(b.upgradeCost.gold * 1.6),
                  materials: Math.floor(b.upgradeCost.materials * 1.6),
                },
              }
            : b
        ),
      },
      notification: `${building.name} 升级成功！当前等级 ${building.level + 1}`,
    }));
    return true;
  },

  recommendTasks: () => {
    const state = get();
    const { members } = state.guild;
    const history = state.completedTaskHistory;

    const classCounts: Record<string, number> = {};
    let totalPower = 0;
    members.forEach((m) => {
      classCounts[m.characterClass] = (classCounts[m.characterClass] || 0) + 1;
      totalPower += m.power;
    });
    const avgPower = totalPower / Math.max(1, members.length);

    const typeCount: Record<TaskType, { success: number; total: number }> = {
      escort: { success: 0, total: 0 },
      assassinate: { success: 0, total: 0 },
      explore: { success: 0, total: 0 },
    };
    history.forEach((h) => {
      typeCount[h.type].total++;
      if (h.success) typeCount[h.type].success++;
    });

    const typePreference: Record<TaskType, number> = {
      escort: typeCount.escort.total > 0 ? typeCount.escort.success / typeCount.escort.total : 0.5,
      assassinate: typeCount.assassinate.total > 0 ? typeCount.assassinate.success / typeCount.assassinate.total : 0.5,
      explore: typeCount.explore.total > 0 ? typeCount.explore.success / typeCount.explore.total : 0.5,
    };

    const tasks = [...state.tasks];
    return tasks
      .map((task) => {
        let score = 0;

        if (task.type === 'escort') {
          const tankCount = (classCounts['knight'] || 0) + (classCounts['warrior'] || 0);
          score += Math.min(tankCount * 15, 30);
        } else if (task.type === 'assassinate') {
          const dpsCount = (classCounts['assassin'] || 0) + (classCounts['archer'] || 0);
          score += Math.min(dpsCount * 15, 30);
        } else if (task.type === 'explore') {
          const supCount = (classCounts['mage'] || 0) + (classCounts['healer'] || 0);
          score += Math.min(supCount * 15, 30);
        }

        const powerDiff = Math.abs(task.recommendedPower - avgPower);
        const powerScore = Math.max(0, 30 - powerDiff / 200);
        score += powerScore;

        score += typePreference[task.type] * 20;

        score += Math.random() * 10;

        return { ...task, _score: score };
      })
      .sort((a, b) => (b as any)._score - (a as any)._score);
  },

  startTask: (taskId, memberIds) => {
    const state = get();
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) {
      state.setNotification('任务不存在！');
      return false;
    }
    if (memberIds.length === 0) {
      state.setNotification('请至少选择一名团员参战！');
      return false;
    }
    const selectedPower = state.guild.members
      .filter((m) => memberIds.includes(m.id))
      .reduce((sum, m) => sum + m.power, 0);
    if (selectedPower < task.recommendedPower * 0.5) {
      state.setNotification(`战力不足！推荐战力 ${task.recommendedPower}，当前 ${selectedPower}`);
      return false;
    }

    const resetMembers = state.guild.members.map((m) => {
      if (!memberIds.includes(m.id)) return m;
      const baseHp = 80 + m.level * 3;
      const baseMp = 40 + m.level * 2;
      return {
        ...m,
        status: {
          hp: baseHp,
          maxHp: baseHp,
          mp: baseMp,
          maxMp: baseMp,
          skillCooldowns: {},
          buffs: [],
          debuffs: [],
        } as MemberStatus,
      };
    });

    set({
      activeTask: { ...task, members: memberIds, status: 'in_progress', progress: 0, events: [] },
      battleLog: [`【任务开始】${task.name}`, `参战团员: ${memberIds.length}人, 总战力: ${selectedPower}`],
      battleEvents: [],
      taskResult: null,
      guild: { ...state.guild, members: resetMembers },
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, members: memberIds, status: 'in_progress' } : t)),
    });
    return true;
  },

  updateTaskProgress: () => {
    const state = get();
    if (!state.activeTask) return { ended: false, triggeredEvent: null };

    const taskMembers = state.guild.members.filter((m) => state.activeTask!.members.includes(m.id));
    const totalMemberPower = taskMembers.reduce((s, m) => s + m.power, 0);
    const progressGain = 5 + (totalMemberPower / state.activeTask.recommendedPower) * 10 + Math.random() * 5;
    const newProgress = Math.min(100, state.activeTask.progress + progressGain);

    const newBattleLog: string[] = [];
    let triggeredEvent: BattleEvent | null = null;

    const updatedMembers = state.guild.members.map((m) => {
      if (!state.activeTask!.members.includes(m.id)) return m;
      const skills = guildClassSkills[m.characterClass] || [];
      let newHp = m.status.hp;
      let newMp = m.status.mp;
      const newCooldowns: Record<string, number> = {};

      const enemyDamage = Math.floor(Math.random() * (15 + state.activeTask!.difficulty * 5)) + 5;
      newHp = Math.max(0, newHp - enemyDamage);

      if (skills.length > 0 && newMp > 10) {
        const skillIdx = Math.floor(Math.random() * skills.length);
        const skill = skills[skillIdx];
        if (newMp >= skill.mpCost) {
          newMp = Math.max(0, newMp - skill.mpCost);
          newCooldowns[skill.name] = skill.cooldown;
          if (m.characterClass === 'healer') {
            newHp = Math.min(m.status.maxHp, newHp + skill.damage);
            newBattleLog.push(`💚 ${m.name} 使用 ${skill.name}，恢复 ${skill.damage} 生命`);
          } else {
            newBattleLog.push(`⚔️ ${m.name} 使用 ${skill.name}，造成 ${skill.damage} 伤害`);
          }
        }
      }

      Object.entries(m.status.skillCooldowns).forEach(([k, v]) => {
        if (v > 1) newCooldowns[k] = v - 1;
      });

      return {
        ...m,
        status: {
          ...m.status,
          hp: newHp,
          mp: Math.min(m.status.maxMp, newMp + 3),
          skillCooldowns: newCooldowns,
        },
      };
    });

    const aliveCount = updatedMembers.filter(
      (m) => state.activeTask!.members.includes(m.id) && m.status.hp > 0
    ).length;

    if (newProgress >= 30 && Math.random() < 0.35 && state.battleEvents.length === 0) {
      const eventTypes: Array<{ type: 'monster_berserk' | 'ambush' | 'treasure' | 'trap'; name: string }> = [
        { type: 'monster_berserk', name: '魔物暴走！' },
        { type: 'ambush', name: '遭遇埋伏！' },
        { type: 'treasure', name: '发现宝藏！' },
        { type: 'trap', name: '触发陷阱！' },
      ];
      const chosen = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const eventDifficulty = state.activeTask.difficulty;
      const eventPowerThreshold = totalMemberPower * (0.5 + eventDifficulty * 0.1);

      let damage = 0;
      let healing = 0;
      let loot: string[] = [];
      let success = true;
      let description = '';

      if (chosen.type === 'monster_berserk' || chosen.type === 'ambush' || chosen.type === 'trap') {
        success = totalMemberPower >= eventPowerThreshold;
        damage = success
          ? Math.floor((20 + eventDifficulty * 10) * (success ? 0.3 : 1))
          : Math.floor((30 + eventDifficulty * 15));
        description = success
          ? `${chosen.name}团员成功应对，仅受到轻伤。`
          : `${chosen.name}应对失败，队伍受到重创！`;
        updatedMembers.forEach((m) => {
          if (state.activeTask!.members.includes(m.id)) {
            m.status.hp = Math.max(0, m.status.hp - damage);
          }
        });
      } else {
        const { blueprintBonus } = get().getGuildBuildingEffects();
        const dropRate = 0.3 + blueprintBonus * 0.1;
        loot = Math.random() < dropRate ? ['稀有装备图纸'] : [];
        description = `${chosen.name}获得了额外战利品！`;
        healing = 20;
        updatedMembers.forEach((m) => {
          if (state.activeTask!.members.includes(m.id)) {
            m.status.hp = Math.min(m.status.maxHp, m.status.hp + healing);
          }
        });
      }

      triggeredEvent = {
        id: `event-${Date.now()}`,
        type: chosen.type,
        name: chosen.name,
        description,
        timestamp: new Date(),
        result: { damage, healing, loot },
      };
      newBattleLog.push(`⚠️ ${chosen.name}${description}`);
    }

    const allDead = aliveCount === 0;
    const ended = newProgress >= 100 || allDead;

    set({
      activeTask: {
        ...state.activeTask!,
        progress: newProgress,
        events: triggeredEvent ? [...(state.activeTask!.events || []), triggeredEvent] : state.activeTask!.events,
      },
      battleLog: [...state.battleLog, ...newBattleLog, `进度: ${Math.floor(newProgress)}%`],
      battleEvents: triggeredEvent ? [...state.battleEvents, triggeredEvent] : state.battleEvents,
      guild: { ...state.guild, members: updatedMembers },
    });

    if (allDead) {
      setTimeout(() => get().completeTask(false), 500);
    } else if (newProgress >= 100) {
      setTimeout(() => get().completeTask(true), 500);
    }

    return { ended, triggeredEvent };
  },

  completeTask: (success) => {
    const state = get();
    if (!state.activeTask) return;
    const task = state.activeTask;
    const { expBonus } = state.getGuildBuildingEffects();

    const baseExp = success ? task.rewards.exp : Math.floor(task.rewards.exp * 0.15);
    const baseGold = success ? task.rewards.gold : Math.floor(task.rewards.gold * 0.1);
    const baseRep = success ? task.rewards.reputation : 0;
    const exp = Math.floor(baseExp * expBonus);
    const contributionLoss = success ? 0 : Math.floor(Math.random() * 150) + 80;

    let blueprints: string[] = [];
    if (success) {
      const { blueprintBonus } = state.getGuildBuildingEffects();
      if (Math.random() < (0.35 + blueprintBonus * 0.05) * (task.difficulty / 3)) {
        blueprints = task.rewards.blueprints?.length ? task.rewards.blueprints : ['装备图纸'];
      }
    }

    const history: CompletedTaskHistory = {
      id: `hist-${Date.now()}`,
      type: task.type,
      name: task.name,
      difficulty: task.difficulty,
      success,
      completedAt: new Date(),
      participatingMemberIds: task.members,
    };

    const updatedMembers = state.guild.members.map((m) => {
      if (!task.members.includes(m.id)) return m;
      const memberExp = Math.floor(exp / task.members.length);
      let newLevel = m.level;
      let newPower = m.power;
      if (success) {
        if (Math.random() < 0.3) newLevel = m.level + 1;
        newPower = m.power + Math.floor(Math.random() * 50);
      }
      return {
        ...m,
        level: newLevel,
        power: newPower,
        contribution: Math.max(0, m.contribution - contributionLoss + (success ? task.rewards.contribution || 0 : 0)),
        status: {
          ...m.status,
          hp: success ? Math.floor(m.status.maxHp * 0.8) : Math.max(10, m.status.hp),
          mp: success ? Math.floor(m.status.maxMp * 0.6) : m.status.mp,
          skillCooldowns: {},
          buffs: [],
          debuffs: [],
        },
      };
    });

    const result: TaskResult = {
      success,
      exp,
      gold: baseGold,
      reputation: baseRep,
      blueprints,
      contributionLoss,
      battleLog: [
        success ? '🎉 任务成功完成！' : '💀 任务失败...',
        `获得经验: +${exp}`,
        `获得金币: +${baseGold}`,
        success ? `获得声望: +${baseRep}` : '声望无变化',
        blueprints.length ? `获得图纸: ${blueprints.join(', ')}` : '',
        contributionLoss > 0 ? `扣除贡献: -${contributionLoss}` : '',
      ].filter(Boolean),
    };

    const totalNewPower = updatedMembers.reduce((s, m) => s + m.power, 0);

    const player = state.player;
    const playerExpGain = Math.floor(exp * 0.3);
    let newPlayerExp = player.exp + playerExpGain;
    let newPlayerLevel = player.level;
    let newPlayerExpToNext = player.expToNext;
    let newPlayerPower = player.power;
    while (newPlayerExp >= newPlayerExpToNext) {
      newPlayerExp -= newPlayerExpToNext;
      newPlayerLevel++;
      newPlayerExpToNext = Math.floor(newPlayerExpToNext * 1.3);
      newPlayerPower += 150;
    }

    set({
      taskResult: result,
      activeTask: null,
      tasks: state.tasks.map((t) => (t.id === task.id ? { ...t, status: success ? 'completed' : 'failed', progress: task.progress } : t)),
      guild: {
        ...state.guild,
        gold: state.guild.gold + baseGold,
        reputation: state.guild.reputation + baseRep,
        completedTasks: success ? state.guild.completedTasks + 1 : state.guild.completedTasks,
        failedTasks: success ? state.guild.failedTasks : state.guild.failedTasks + 1,
        members: updatedMembers,
        totalPower: totalNewPower,
      },
      player: {
        ...player,
        exp: newPlayerExp,
        level: newPlayerLevel,
        expToNext: newPlayerExpToNext,
        power: newPlayerPower,
        gold: player.gold + Math.floor(baseGold * 0.2),
      },
      completedTaskHistory: [...state.completedTaskHistory, history],
      notification: success ? `任务成功！获得 ${exp} 经验, ${baseGold} 金币` : `任务失败，损失 ${contributionLoss} 贡献值`,
    });
  },

  clearTaskResult: () => set({ taskResult: null, battleLog: [], battleEvents: [] }),

  declareWar: (defenderId) => {
    const state = get();
    if (state.activeWar && state.activeWar.status === 'active') {
      state.setNotification('已有正在进行的战争！');
      return false;
    }
    const defender = state.enemyGuilds.find((g) => g.id === defenderId);
    if (!defender) {
      state.setNotification('目标佣兵团不存在！');
      return false;
    }
    const warCost = 5000;
    if (state.guild.gold < warCost) {
      state.setNotification(`宣战需要 ${warCost} 金币！`);
      return false;
    }

    const war: WarRecord = {
      id: `war-${Date.now()}`,
      attacker: {
        id: state.guild.id,
        name: state.guild.name,
        badge: state.guild.badge,
        troops: Math.max(30, state.guild.members.length * 20),
        morale: 100,
        kills: 0,
      },
      defender: {
        id: defender.id,
        name: defender.name,
        badge: defender.badge,
        troops: defender.troops,
        morale: defender.morale,
        kills: 0,
      },
      status: 'active',
      startTime: new Date(),
      battleLogs: [],
      killRanking: state.guild.members.map((m) => ({ memberId: m.id, memberName: m.name, kills: 0, contribution: 0 })),
    };
    set({
      activeWar: war,
      guild: { ...state.guild, gold: state.guild.gold - warCost },
      notification: `已向 ${defender.name} 宣战！`,
    });
    state.addAnnouncement(`【战争公告】${state.guild.name} 向 ${defender.name} 宣战！`);
    return true;
  },

  updateWarProgress: () => {
    const state = get();
    if (!state.activeWar || state.activeWar.status !== 'active') return false;

    const war = state.activeWar;
    const attackerPower = state.guild.totalPower;
    const defenderGuild = state.enemyGuilds.find((g) => g.id === war.defender.id);
    const defenderPower = defenderGuild?.totalPower || war.defender.troops * 500;
    const powerRatio = attackerPower / Math.max(1, defenderPower);
    const moraleFactor = war.attacker.morale / Math.max(1, war.defender.morale);

    const baseAttackerDamage = 10 + Math.random() * 15;
    const baseDefenderDamage = 10 + Math.random() * 15;
    const attackerLoss = Math.floor(baseAttackerDamage / (powerRatio * moraleFactor));
    const defenderLoss = Math.floor(baseDefenderDamage * powerRatio * moraleFactor);

    const attackerWonRound = defenderLoss > attackerLoss;
    const attackerMoraleChange = attackerWonRound ? Math.floor(Math.random() * 5) + 2 : -(Math.floor(Math.random() * 5) + 2);
    const defenderMoraleChange = attackerWonRound ? -(Math.floor(Math.random() * 6) + 3) : Math.floor(Math.random() * 4) + 1;

    const descriptions = [
      '骑士团发起集团冲锋！',
      '法师军团释放范围魔法！',
      '刺客部队偷袭敌方后营！',
      '弓箭手齐射压制敌军！',
      '治疗师稳住了我方阵线！',
    ];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];

    const log = {
      timestamp: new Date(),
      attackerLoss,
      defenderLoss,
      attackerMoraleChange,
      defenderMoraleChange,
      description: `[${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}] ${description} 歼敌 ${defenderLoss}，损失 ${attackerLoss}`,
    };

    const newKillRanking = war.killRanking
      .map((k) => {
        const member = state.guild.members.find((m) => m.id === k.memberId);
        if (!member) return k;
        const powerWeight = member.power / Math.max(1, state.guild.totalPower);
        const killsGained = Math.floor(defenderLoss * powerWeight * (1 + Math.random() * 0.5));
        const contribGained = Math.floor(killsGained * 50 + Math.random() * 100);
        return { ...k, kills: k.kills + killsGained, contribution: k.contribution + contribGained };
      })
      .sort((a, b) => b.kills - a.kills);

    const newAttackerTroops = Math.max(0, war.attacker.troops - attackerLoss);
    const newDefenderTroops = Math.max(0, war.defender.troops - defenderLoss);
    const newAttackerMorale = Math.max(0, Math.min(100, war.attacker.morale + attackerMoraleChange));
    const newDefenderMorale = Math.max(0, Math.min(100, war.defender.morale + defenderMoraleChange));

    const ended = newAttackerTroops <= 0 || newDefenderTroops <= 0 || newAttackerMorale <= 0 || newDefenderMorale <= 0;

    set({
      activeWar: {
        ...war,
        attacker: { ...war.attacker, troops: newAttackerTroops, morale: newAttackerMorale, kills: war.attacker.kills + defenderLoss },
        defender: { ...war.defender, troops: newDefenderTroops, morale: newDefenderMorale, kills: war.defender.kills + attackerLoss },
        battleLogs: [...war.battleLogs, log],
        killRanking: newKillRanking,
      },
    });

    if (ended) {
      setTimeout(() => get().endWar(), 300);
    }
    return ended;
  },

  endWar: () => {
    const state = get();
    if (!state.activeWar) return;
    const war = state.activeWar;
    const attackerWin =
      war.defender.troops <= 0 ||
      war.defender.morale <= 0 ||
      (war.attacker.troops > war.defender.troops && war.attacker.morale > war.defender.morale);

    const reputationGain = attackerWin ? 500 : 100;
    const goldGain = attackerWin ? 30000 : 5000;

    set({
      activeWar: {
        ...war,
        status: 'ended',
        winner: attackerWin ? war.attacker.id : war.defender.id,
        endTime: new Date(),
      },
      guild: {
        ...state.guild,
        reputation: state.guild.reputation + reputationGain,
        gold: state.guild.gold + goldGain,
      },
      notification: attackerWin ? `🎉 战争胜利！获得 ${reputationGain} 声望, ${goldGain} 金币` : `战争失利，获得 ${reputationGain} 声望, ${goldGain} 金币`,
    });
    state.addAnnouncement(
      attackerWin
        ? `【战争结束】${war.attacker.name} 击败了 ${war.defender.name}！`
        : `【战争结束】${war.defender.name} 击败了 ${war.attacker.name}！`
    );
  },

  clearActiveWar: () => set({ activeWar: null }),

  listMarketItem: (item) => {
    const state = get();
    if (state.player.gold < 100) {
      state.setNotification('上架手续费100金币不足！');
      return false;
    }
    const priceRange = state.getSuggestedPrice(item.name, item.rarity, item.type);
    set((st) => ({
      player: { ...st.player, gold: st.player.gold - 100 },
      marketItems: [
        {
          ...item,
          id: `item-${Date.now()}`,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 86400000),
          suggestedPriceRange: priceRange,
        },
        ...st.marketItems,
      ],
      notification: `物品已上架！建议价格区间 ${priceRange.min} - ${priceRange.max}`,
    }));
    return true;
  },

  buyMarketItem: (itemId) => {
    const state = get();
    const item = state.marketItems.find((i) => i.id === itemId);
    if (!item) {
      state.setNotification('物品不存在！');
      return false;
    }
    if (state.player.gold < item.price) {
      state.setNotification(`金币不足！需要 ${item.price} 金币`);
      return false;
    }
    const trade: MarketTrade = {
      id: `trade-${Date.now()}`,
      itemName: item.name,
      itemType: item.type,
      rarity: item.rarity,
      price: item.price,
      buyerName: state.guild.name,
      sellerName: item.sellerName,
      timestamp: new Date(),
    };
    set((st) => ({
      player: { ...st.player, gold: st.player.gold - item.price },
      marketItems: st.marketItems.filter((i) => i.id !== itemId),
      marketTrades: [trade, ...st.marketTrades],
      notification: `成功购买 ${item.name}！`,
    }));
    state.addAnnouncement(`【全服公告】${state.guild.name} 以 ${item.price.toLocaleString()} 金币购买了 ${item.name}！`);
    return true;
  },

  getSuggestedPrice: (itemName, rarity, itemType) => {
    const state = get();
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    const relevantTrades = state.marketTrades.filter((t) => {
      if (t.rarity !== rarity) return false;
      if (itemType && t.itemType !== itemType) return false;
      return now - new Date(t.timestamp).getTime() <= sevenDays;
    });

    if (relevantTrades.length >= 3) {
      const prices = relevantTrades.map((t) => t.price).sort((a, b) => a - b);
      const avg = Math.floor(prices.reduce((s, p) => s + p, 0) / prices.length);
      const min = prices[Math.floor(prices.length * 0.1)] || prices[0];
      const max = prices[Math.ceil(prices.length * 0.9) - 1] || prices[prices.length - 1];
      return { min, max, avg };
    }

    const basePrices: Record<string, number> = {
      common: 3000,
      rare: 20000,
      epic: 70000,
      legendary: 180000,
    };
    const base = basePrices[rarity] || 10000;
    const typeMultiplier = itemType === 'blueprint' ? 1.3 : itemType === 'intel' ? 1.2 : 1;
    const adjusted = Math.floor(base * typeMultiplier + itemName.length * 200);
    return {
      min: Math.floor(adjusted * 0.75),
      max: Math.floor(adjusted * 1.25),
      avg: adjusted,
    };
  },

  exportWeeklyReportPDF: () => {
    console.log('PDF导出由组件内jsPDF直接调用实现');
  },

  refreshRankings: () => {
    const state = get();
    const updated: Record<string, RankingEntry[]> = {};
    Object.keys(state.rankings).forEach((key) => {
      updated[key] = state.rankings[key].map((entry) => {
        if (entry.guildId === 'g2') {
          if (key === 'reputation') return { ...entry, value: state.guild.reputation };
          if (key === 'power') return { ...entry, value: state.guild.totalPower, totalPower: state.guild.totalPower };
          if (key === 'wealth') return { ...entry, value: state.guild.gold };
        }
        return entry;
      });
    });
    set({ rankings: updated, notification: '排行榜已刷新！' });
  },

  addAnnouncement: (msg) => {
    set((state) => ({ serverAnnouncements: [msg, ...state.serverAnnouncements].slice(0, 30) }));
  },

  getRankingGuildDetail: (guildId) => {
    return get().rankingGuildDetails[guildId] || null;
  },
}));
