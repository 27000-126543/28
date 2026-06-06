import React, { useEffect, useRef, useState } from 'react';
import {
  Swords,
  Shield,
  Users,
  Heart,
  Trophy,
  Flag,
  Clock,
  TrendingUp,
  Skull,
  Zap,
  Award,
  Coins,
  Star,
  X,
  Crown,
  Medal,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { GuildBadge } from '../components/GuildBadge';

export const CrossServerWar: React.FC = () => {
  const store = useGameStore();
  const { player, guild, activeWar, enemyGuilds } = store;

  const [showDeclareModal, setShowDeclareModal] = useState(false);
  const logsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeWar && activeWar.status === 'active') {
      const interval = setInterval(() => {
        const ended = store.updateWarProgress();
        if (ended) {
          clearInterval(interval);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [activeWar, store]);

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [activeWar?.battleLogs]);

  const expPercent = Math.min(100, (player.exp / player.expToNext) * 100);

  const getMedalIcon = (idx: number) => {
    if (idx === 0) return <Crown size={18} className="text-amber-400" />;
    if (idx === 1) return <Medal size={18} className="text-gray-300" />;
    if (idx === 2) return <Medal size={18} className="text-orange-500" />;
    return <span className="w-[18px] text-center text-gray-400 font-bold text-sm">{idx + 1}</span>;
  };

  const getRankBg = (idx: number) => {
    if (idx === 0) return 'bg-gradient-to-r from-amber-500/20 to-transparent border border-amber-500/30';
    if (idx === 1) return 'bg-gradient-to-r from-gray-400/20 to-transparent border border-gray-400/30';
    if (idx === 2) return 'bg-gradient-to-r from-orange-700/20 to-transparent border border-orange-700/30';
    return 'bg-purple-900/20';
  };

  const getRankTextColor = (idx: number) => {
    if (idx === 0) return 'bg-amber-500/30 text-amber-400';
    if (idx === 1) return 'bg-gray-400/30 text-gray-300';
    if (idx === 2) return 'bg-orange-700/30 text-orange-400';
    return 'bg-purple-800/50 text-purple-300';
  };

  const renderPlayerBar = () => (
    <div className="fantasy-card p-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl bg-gradient-to-br from-purple-600 to-amber-500 shadow-lg">
          {player.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Star size={16} className="text-amber-400" />
              <span className="text-amber-400 font-bold">Lv.{player.level}</span>
            </div>
            <h2 className="text-xl font-bold text-white truncate">{player.name}</h2>
            <div className="flex items-center gap-1">
              <Swords size={16} className="text-purple-400" />
              <span className="text-purple-400 font-semibold">{player.power.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Coins size={16} className="text-yellow-400" />
              <span className="text-yellow-400 font-semibold">{player.gold.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">经验值</span>
              <span className="text-gray-300">{player.exp.toLocaleString()} / {player.expToNext.toLocaleString()}</span>
            </div>
            <div className="stat-bar h-2">
              <div
                className="stat-bar-fill bg-gradient-to-r from-blue-500 to-cyan-400"
                style={{ width: `${expPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWarCard = (side: 'attacker' | 'defender', maxTroops: number) => {
    const data = activeWar![side];
    const isAttacker = side === 'attacker';
    const troopsPercent = Math.min(100, (data.troops / maxTroops) * 100);
    const moraleColor =
      data.morale > 50
        ? 'bg-gradient-to-r from-green-500 to-green-400'
        : data.morale > 25
        ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
        : 'bg-gradient-to-r from-red-500 to-red-400';

    return (
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <GuildBadge badge={data.badge} size="xl" />
        </div>
        <h3 className={`text-xl font-bold mb-2 ${isAttacker ? 'text-amber-400' : 'text-red-400'}`}>
          {data.name}
        </h3>
        <span
          className={`fantasy-badge border ${
            isAttacker
              ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
              : 'border-red-500/50 bg-red-500/10 text-red-400'
          }`}
        >
          {isAttacker ? '进攻方' : '防守方'}
        </span>
        <div className="mt-4 space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400 flex items-center gap-1">
                <Users size={12} /> 兵力
              </span>
              <span className="text-white font-bold">{data.troops}</span>
            </div>
            <div className="stat-bar h-3">
              <div
                className={`stat-bar-fill ${
                  isAttacker ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-red-500 to-red-400'
                }`}
                style={{ width: `${troopsPercent}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400 flex items-center gap-1">
                <Heart size={12} /> 士气
              </span>
              <span className="text-white font-bold">{data.morale}%</span>
            </div>
            <div className="stat-bar h-3">
              <div className={`stat-bar-fill ${moraleColor}`} style={{ width: `${data.morale}%` }} />
            </div>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-purple-700/30">
            <span className="text-gray-400">击杀数</span>
            <span className="text-red-400 font-bold flex items-center gap-1">
              <Skull size={14} /> {data.kills}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderPlayerBar()}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Swords className="text-red-400" /> 跨服战
          </h1>
          <p className="text-gray-400">佣兵团间的荣耀之战</p>
        </div>
        {(!activeWar || activeWar.status !== 'active') && (
          <button
            onClick={() => setShowDeclareModal(true)}
            className="fantasy-btn-danger flex items-center gap-2"
          >
            <Flag size={18} /> 宣战
          </button>
        )}
      </div>

      {(!activeWar || activeWar.status !== 'active') && (
        <div className="fantasy-card p-12 text-center">
          <Shield size={64} className="text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">暂无进行中的战争</h2>
          <p className="text-gray-400 mb-6">点击宣战按钮向敌对佣兵团发起跨服战争！</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            <div className="fantasy-card p-4">
              <h3 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                <Swords size={16} /> 战争规则
              </h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• 双方实时攻防</li>
                <li>• 兵力和士气实时变化</li>
                <li>• 自动结算战斗结果</li>
              </ul>
            </div>
            <div className="fantasy-card p-4">
              <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                <Trophy size={16} /> 战争奖励
              </h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• 声望加成</li>
                <li>• 战利品分配</li>
                <li>• 个人杀敌排名</li>
              </ul>
            </div>
            <div className="fantasy-card p-4">
              <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                <Skull size={16} /> 失败惩罚
              </h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• 声望损失</li>
                <li>• 部分资源被掠夺</li>
                <li>• 士气下降</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeWar && (
        <>
          <div
            className={`fantasy-card p-6 ${
              activeWar.status === 'active' ? 'border-red-500/50' : 'border-amber-500/50'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {activeWar.status === 'active' ? (
                  <span className="flex items-center gap-2 text-red-400">
                    <Swords className="animate-pulse" /> 战争进行中
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-amber-400">
                    <Trophy /> 战争已结束
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock size={14} />
                开始于 {activeWar.startTime.toLocaleTimeString()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {renderWarCard('attacker', Math.max(activeWar.attacker.troops + activeWar.attacker.kills, 1))}

              <div className="text-center">
                <div className="text-6xl mb-4 animate-bounce">⚔️</div>
                {activeWar.status === 'ended' && (
                  <div className="fantasy-card p-4 border-amber-500/50">
                    <Trophy className="text-amber-400 mx-auto mb-2" size={32} />
                    <p className="text-lg font-bold text-amber-400">
                      {activeWar.winner === guild.id ? '胜利！' : '失败...'}
                    </p>
                  </div>
                )}
              </div>

              {renderWarCard('defender', Math.max(activeWar.defender.troops + activeWar.defender.kills, 1))}
            </div>

            {activeWar.status === 'ended' && (
              <div className="mt-6 flex justify-center">
                <button onClick={store.clearActiveWar} className="fantasy-btn-primary flex items-center gap-2">
                  <Flag size={18} /> 结束战争
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="fantasy-card p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-400" /> 战斗日志
              </h3>
              <div
                ref={logsRef}
                className="space-y-2 max-h-80 overflow-y-auto pr-2"
              >
                {activeWar.battleLogs.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">等待战斗开始...</p>
                ) : (
                  activeWar.battleLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-purple-900/20 rounded-lg border-l-2 border-purple-500/50"
                    >
                      <p className="text-sm text-gray-300">{log.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="fantasy-card p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Award size={18} className="text-amber-400" /> 个人杀敌与贡献排名
              </h3>
              <div className="space-y-2">
                {[...activeWar.killRanking]
                  .sort((a, b) => b.kills - a.kills)
                  .slice(0, 10)
                  .map((entry, idx) => (
                    <div
                      key={entry.memberId}
                      className={`flex items-center gap-3 p-3 rounded-lg ${getRankBg(idx)}`}
                    >
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${getRankTextColor(idx)}`}
                      >
                        {idx < 3 ? getMedalIcon(idx) : idx + 1}
                      </span>
                      <span className="flex-1 text-white font-medium">{entry.memberName}</span>
                      <span className="text-red-400 flex items-center gap-1 text-sm">
                        <Skull size={14} /> {entry.kills}
                      </span>
                      <span className="text-amber-400 flex items-center gap-1 text-sm">
                        <Zap size={14} /> {entry.contribution}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}

      {showDeclareModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowDeclareModal(false)}
        >
          <div
            className="fantasy-card p-6 w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Flag size={22} className="text-red-400" /> 选择敌对佣兵团
              </h2>
              <button
                onClick={() => setShowDeclareModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-400 text-sm mb-4">宣战费用：5,000 金币</p>
            <div className="space-y-3 overflow-y-auto pr-2 flex-1">
              {enemyGuilds.map((enemy) => (
                <div
                  key={enemy.id}
                  className="fantasy-card p-4 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    <GuildBadge badge={enemy.badge} size="lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white">{enemy.name}</h3>
                      <p className="text-sm text-gray-400">{enemy.serverId}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Swords size={14} className="text-purple-400" />
                          <span className="text-gray-400">战力:</span>
                          <span className="text-purple-400 font-semibold">
                            {enemy.totalPower.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} className="text-blue-400" />
                          <span className="text-gray-400">成员:</span>
                          <span className="text-blue-400 font-semibold">{enemy.memberCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield size={14} className="text-amber-400" />
                          <span className="text-gray-400">兵力:</span>
                          <span className="text-amber-400 font-semibold">{enemy.troops}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart size={14} className="text-green-400" />
                          <span className="text-gray-400">士气:</span>
                          <span className="text-green-400 font-semibold">{enemy.morale}%</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        store.declareWar(enemy.id);
                        setShowDeclareModal(false);
                      }}
                      className="fantasy-btn-danger flex items-center gap-2 shrink-0"
                    >
                      <Swords size={16} /> 宣战
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
