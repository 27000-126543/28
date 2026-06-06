import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollText,
  Play,
  Shield,
  Target,
  Compass,
  Swords,
  Heart,
  Droplets,
  Clock,
  Sparkles,
  Star,
  Coins,
  X,
  AlertTriangle,
  Skull,
  Gift,
  Users,
  Zap,
  Trophy,
  Crown,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import type { Task, TaskType, BattleEvent } from '../types';
import { classInfo, roleInfo } from '../data/mockData';

const taskTypeInfo: Record<TaskType, { name: string; icon: React.ReactNode; color: string; bg: string }> = {
  escort: { name: '护送', icon: <Shield size={18} />, color: 'text-blue-400', bg: 'from-blue-600/20 to-blue-800/10' },
  assassinate: { name: '刺杀', icon: <Target size={18} />, color: 'text-red-400', bg: 'from-red-600/20 to-red-800/10' },
  explore: { name: '探索', icon: <Compass size={18} />, color: 'text-green-400', bg: 'from-green-600/20 to-green-800/10' },
};

const eventTypeInfo: Record<BattleEvent['type'], { icon: React.ReactNode; color: string; bg: string; name: string }> = {
  monster_berserk: { icon: <Skull size={20} />, color: 'text-red-400', bg: 'bg-red-900/30 border-red-500/50', name: '魔物暴走' },
  ambush: { icon: <AlertTriangle size={20} />, color: 'text-orange-400', bg: 'bg-orange-900/30 border-orange-500/50', name: '遭遇埋伏' },
  treasure: { icon: <Gift size={20} />, color: 'text-yellow-400', bg: 'bg-yellow-900/30 border-yellow-500/50', name: '发现宝藏' },
  trap: { icon: <AlertTriangle size={20} />, color: 'text-purple-400', bg: 'bg-purple-900/30 border-purple-500/50', name: '触发陷阱' },
};

export const TaskHall: React.FC = () => {
  const store = useGameStore();
  const {
    guild,
    activeTask,
    taskResult,
    battleLog,
    battleEvents,
    player,
  } = store;

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const battleLogRef = useRef<HTMLDivElement>(null);

  const recommendedTasks = store.recommendTasks();

  useEffect(() => {
    if (activeTask && activeTask.status === 'in_progress') {
      const interval = setInterval(() => {
        store.updateTaskProgress();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [activeTask, store]);

  useEffect(() => {
    if (taskResult) {
      setShowResultModal(true);
    }
  }, [taskResult]);

  useEffect(() => {
    if (battleLogRef.current) {
      battleLogRef.current.scrollTop = battleLogRef.current.scrollHeight;
    }
  }, [battleLog]);

  const toggleMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  const handleStartTask = () => {
    if (!selectedTask || selectedMembers.length === 0) return;
    const success = store.startTask(selectedTask.id, selectedMembers);
    if (success) {
      setSelectedTask(null);
      setSelectedMembers([]);
    }
  };

  const handleClaimReward = () => {
    store.clearTaskResult();
    setShowResultModal(false);
  };

  const difficultyStars = (difficulty: number) =>
    Array.from({ length: difficulty }, (_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />);

  const getHpColor = (hp: number, maxHp: number) => {
    const pct = (hp / maxHp) * 100;
    if (pct > 50) return 'bg-gradient-to-r from-green-500 to-green-400';
    if (pct > 25) return 'bg-gradient-to-r from-yellow-500 to-yellow-400';
    return 'bg-gradient-to-r from-red-500 to-red-400';
  };

  const expPct = (player.exp / player.expToNext) * 100;

  return (
    <div className="space-y-6">
      <div className="fantasy-card p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{player.avatar}</div>
            <div>
              <div className="flex items-center gap-2">
                <Crown size={18} className="text-amber-400" />
                <h2 className="text-xl font-bold text-white">{player.name}</h2>
                <span className="fantasy-badge bg-amber-500/20 text-amber-400 border border-amber-500/50">
                  Lv.{player.level}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm">
                <span className="text-gray-400 flex items-center gap-1">
                  <Swords size={14} className="text-red-400" />
                  战力: <span className="text-amber-400 font-bold">{player.power}</span>
                </span>
                <span className="text-gray-400 flex items-center gap-1">
                  <Coins size={14} className="text-yellow-400" />
                  金币: <span className="text-yellow-400 font-bold">{player.gold.toLocaleString()}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 max-w-md min-w-[200px]">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400 flex items-center gap-1">
                <Trophy size={14} className="text-blue-400" /> 经验值
              </span>
              <span className="text-blue-400 font-bold">{player.exp} / {player.expToNext}</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 transition-all duration-500"
                style={{ width: `${expPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ScrollText className="text-amber-400" /> 任务大厅
          </h1>
          <p className="text-gray-400">智能推荐适合你的佣兵团的任务</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Sparkles size={16} className="text-amber-400" />
          根据职业构成和战力智能推荐
        </div>
      </div>

      {activeTask && activeTask.status === 'in_progress' && (
        <div className="space-y-4">
          <div className="fantasy-card p-6 border-amber-500/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                  <Swords className="animate-pulse" /> {activeTask.name}
                </h2>
                <span className={`fantasy-badge border ${taskTypeInfo[activeTask.type].color} ${taskTypeInfo[activeTask.type].color.replace('text', 'bg')}/20`}>
                  {taskTypeInfo[activeTask.type].icon} {taskTypeInfo[activeTask.type].name}任务
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">任务进度</span>
                <span className="text-amber-400 font-bold">{activeTask.progress.toFixed(0)}%</span>
              </div>
              <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 transition-all duration-1000 animate-pulse"
                  style={{ width: `${activeTask.progress}%` }}
                />
              </div>
            </div>

            {battleEvents.length > 0 && (
              <div className="mb-4 space-y-2">
                {battleEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`fantasy-card p-3 border ${eventTypeInfo[event.type].bg} flex items-start gap-3`}
                  >
                    <div className={eventTypeInfo[event.type].color}>
                      {eventTypeInfo[event.type].icon}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${eventTypeInfo[event.type].color}`}>
                        {eventTypeInfo[event.type].name}
                      </p>
                      <p className="text-gray-300 text-sm">{event.description}</p>
                      <div className="flex gap-3 mt-1 text-xs">
                        {event.result.damage && event.result.damage > 0 && (
                          <span className="text-red-400">受到伤害: -{event.result.damage}</span>
                        )}
                        {event.result.healing && event.result.healing > 0 && (
                          <span className="text-green-400">恢复生命: +{event.result.healing}</span>
                        )}
                        {event.result.loot && event.result.loot.length > 0 && (
                          <span className="text-yellow-400">战利品: {event.result.loot.join(', ')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Users size={18} className="text-blue-400" /> 参战成员实时状态
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {guild.members
                .filter((m) => activeTask.members.includes(m.id))
                .map((member) => (
                  <div key={member.id} className="fantasy-card p-3 border-purple-500/30">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{classInfo[member.characterClass].emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm truncate">{member.name}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <span>{classInfo[member.characterClass].name}</span>
                          <span>·</span>
                          <span>Lv.{member.level}</span>
                          <span>·</span>
                          <Swords size={10} className="text-amber-400" />
                          <span className="text-amber-400">{member.power}</span>
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Heart size={12} className="text-red-400 flex-shrink-0" />
                        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getHpColor(member.status.hp, member.status.maxHp)} transition-all`}
                            style={{ width: `${(member.status.hp / member.status.maxHp) * 100}%` }}
                          />
                        </div>
                        <span className="text-gray-400 w-16 text-right">{member.status.hp}/{member.status.maxHp}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Droplets size={12} className="text-blue-400 flex-shrink-0" />
                        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all"
                            style={{ width: `${(member.status.mp / member.status.maxMp) * 100}%` }}
                          />
                        </div>
                        <span className="text-gray-400 w-16 text-right">{member.status.mp}/{member.status.maxMp}</span>
                      </div>
                      {Object.keys(member.status.skillCooldowns).length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {Object.entries(member.status.skillCooldowns).map(([skillName, cd]) => (
                            <span
                              key={skillName}
                              className="fantasy-badge text-xs bg-purple-500/20 text-purple-300 border-purple-500/30 flex items-center gap-1"
                            >
                              <Zap size={10} />
                              {skillName} ({cd})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="fantasy-card p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <ScrollText size={18} className="text-amber-400" /> 战斗日志
            </h3>
            <div
              ref={battleLogRef}
              className="h-40 overflow-y-auto space-y-1 bg-gray-900/50 rounded-lg p-3 font-mono text-sm"
            >
              {battleLog.map((log, idx) => (
                <p key={idx} className="text-gray-300">
                  <span className="text-gray-500">[{String(idx).padStart(3, '0')}]</span> {log}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {!activeTask && (
        <div className="grid gap-4">
          {recommendedTasks.map((task, idx) => (
            <div
              key={task.id}
              className={`fantasy-card p-5 bg-gradient-to-r ${taskTypeInfo[task.type].bg} cursor-pointer transition-all hover:border-purple-500/50 ${
                selectedTask?.id === task.id ? 'border-2 border-amber-500/50 ring-2 ring-amber-500/30' : ''
              }`}
              onClick={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    {idx === 0 && (
                      <span className="fantasy-badge bg-amber-500/20 text-amber-400 border border-amber-500/50">
                        <Sparkles size={12} className="inline mr-1" /> 最佳推荐
                      </span>
                    )}
                    <span className={`fantasy-badge border ${taskTypeInfo[task.type].color} bg-black/20`}>
                      {taskTypeInfo[task.type].icon} {taskTypeInfo[task.type].name}
                    </span>
                    <span className="flex items-center gap-1">{difficultyStars(task.difficulty)}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{task.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm flex-wrap">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Swords size={14} /> 推荐战力: <span className="text-amber-400">{task.recommendedPower}</span>
                    </span>
                    <span className="text-gray-400 flex items-center gap-1">
                      <Clock size={14} /> 发布于 {task.createdAt.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-gray-400 text-xs mb-1">奖励</p>
                  <p className="text-yellow-400 font-bold flex items-center gap-1 justify-end">
                    <Coins size={16} /> {task.rewards.gold.toLocaleString()}
                  </p>
                  <p className="text-blue-400 text-sm">EXP +{task.rewards.exp}</p>
                  <p className="text-amber-400 text-sm">声望 +{task.rewards.reputation}</p>
                </div>
              </div>

              {selectedTask?.id === task.id && (
                <div className="mt-4 pt-4 border-t border-purple-700/30" onClick={(e) => e.stopPropagation()}>
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Users size={16} className="text-blue-400" /> 选择参战团员
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {guild.members.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => toggleMember(member.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${
                          selectedMembers.includes(member.id)
                            ? 'border-amber-500/70 bg-amber-500/10'
                            : 'border-transparent bg-purple-900/30 hover:border-purple-500/30'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{classInfo[member.characterClass].emoji}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-white text-sm font-semibold truncate">{member.name}</p>
                              <span className={`fantasy-badge text-xs ${roleInfo[member.role].color}`}>
                                {roleInfo[member.role].name}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <span>{classInfo[member.characterClass].name}</span>
                              <span>·</span>
                              <span>Lv.{member.level}</span>
                              <span>·</span>
                              <Swords size={10} className="text-amber-400" />
                              <span className="text-amber-400">{member.power}</span>
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs">
                            <Heart size={10} className="text-red-400 flex-shrink-0" />
                            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getHpColor(member.status.hp, member.status.maxHp)}`}
                                style={{ width: `${(member.status.hp / member.status.maxHp) * 100}%` }}
                              />
                            </div>
                            <span className="text-gray-400 w-12 text-right">{member.status.hp}%</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Droplets size={10} className="text-blue-400 flex-shrink-0" />
                            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                                style={{ width: `${(member.status.mp / member.status.maxMp) * 100}%` }}
                              />
                            </div>
                            <span className="text-gray-400 w-12 text-right">{member.status.mp}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-sm">
                      已选择 <span className="text-amber-400 font-bold">{selectedMembers.length}</span> 名成员
                    </p>
                    <button
                      onClick={handleStartTask}
                      disabled={selectedMembers.length === 0}
                      className="fantasy-btn-primary flex items-center gap-2"
                    >
                      <Play size={16} /> 开始任务
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showResultModal && taskResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className={`fantasy-card p-6 max-w-lg w-full border-2 ${taskResult.success ? 'border-green-500/50' : 'border-red-500/50'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-2xl font-bold flex items-center gap-2 ${taskResult.success ? 'text-green-400' : 'text-red-400'}`}>
                {taskResult.success ? <Gift /> : <Skull />}
                {taskResult.success ? '任务成功！' : '任务失败...'}
              </h2>
              <button
                onClick={handleClaimReward}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="fantasy-card p-3 text-center">
                <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
                  <Trophy size={14} className="text-blue-400" /> 经验
                </p>
                <p className="text-xl font-bold text-blue-400">+{taskResult.exp}</p>
              </div>
              <div className="fantasy-card p-3 text-center">
                <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
                  <Coins size={14} className="text-yellow-400" /> 金币
                </p>
                <p className="text-xl font-bold text-yellow-400">+{taskResult.gold}</p>
              </div>
              <div className="fantasy-card p-3 text-center">
                <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
                  <Star size={14} className="text-amber-400" /> 声望
                </p>
                <p className="text-xl font-bold text-amber-400">+{taskResult.reputation}</p>
              </div>
              <div className="fantasy-card p-3 text-center">
                <p className="text-gray-400 text-sm">贡献损失</p>
                <p className={`text-xl font-bold ${taskResult.contributionLoss > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {taskResult.contributionLoss > 0 ? `-${taskResult.contributionLoss}` : '无'}
                </p>
              </div>
            </div>

            {taskResult.blueprints.length > 0 && (
              <div className="mb-4">
                <p className="text-purple-400 font-semibold mb-2">获得装备图纸：</p>
                <div className="flex flex-wrap gap-2">
                  {taskResult.blueprints.map((bp, idx) => (
                    <span key={idx} className="fantasy-badge border border-purple-500/50 bg-purple-500/10 text-purple-400">
                      📜 {bp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1 mb-5 max-h-32 overflow-y-auto">
              {taskResult.battleLog.map((log, idx) => (
                <p key={idx} className="text-gray-300 text-sm">• {log}</p>
              ))}
            </div>

            <button
              onClick={handleClaimReward}
              className={taskResult.success ? 'fantasy-btn-primary w-full' : 'fantasy-btn-danger w-full'}
            >
              领取奖励
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
