import React, { useState } from 'react';
import {
  Trophy,
  Star,
  Swords,
  Coins,
  Users,
  Eye,
  X,
  Crown,
  Shield,
  Zap,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import type { RankingType, RankingGuildDetail } from '../types';
import { GuildBadge } from '../components/GuildBadge';
import { classInfo } from '../data/mockData';

const rankingConfig: Record<RankingType, { label: string; icon: React.ReactNode; color: string; unit: string }> = {
  reputation: { label: '声望榜', icon: <Star size={20} />, color: 'text-amber-400', unit: '' },
  power: { label: '战力榜', icon: <Swords size={20} />, color: 'text-purple-400', unit: '' },
  wealth: { label: '财富榜', icon: <Coins size={20} />, color: 'text-yellow-400', unit: '' },
};

const buildingIcons: Record<string, string> = {
  training_field: '⚔️',
  workshop: '🔨',
  warehouse: '📦',
};

export const Leaderboard: React.FC = () => {
  const store = useGameStore();
  const { player, guild, rankings } = store;

  const [activeRanking, setActiveRanking] = useState<RankingType>('reputation');
  const [selectedGuildId, setSelectedGuildId] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<'lineup' | 'buildings'>('lineup');

  const currentRankings = (rankings[activeRanking] || []).slice(0, 5);
  const myGuildRank = currentRankings.find((r) => r.guildId === 'g2');

  const selectedGuild = currentRankings.find((r) => r.guildId === selectedGuildId);
  const guildDetail: RankingGuildDetail | null = selectedGuildId
    ? store.getRankingGuildDetail(selectedGuildId)
    : null;

  const expPercent = Math.min(100, (player.exp / player.expToNext) * 100);

  const renderStars = (level: number) => {
    const fullStars = Math.min(level, 10);
    return '★'.repeat(fullStars);
  };

  return (
    <div className="space-y-6">
      <div className="fantasy-card p-5 bg-gradient-to-r from-purple-900/40 to-indigo-900/40">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/30 border-2 border-amber-400/50">
              {player.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-sm font-bold border border-amber-500/40">
                  Lv.{player.level}
                </span>
                <h2 className="text-xl font-bold text-white">{player.name}</h2>
              </div>
              <div className="mt-2 w-56">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">经验值</span>
                  <span className="text-blue-400">
                    {player.exp.toLocaleString()} / {player.expToNext.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-purple-950/60 rounded-full overflow-hidden border border-purple-700/40">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${expPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-purple-950/50 px-4 py-2 rounded-lg border border-purple-700/40">
              <Zap size={20} className="text-purple-400" />
              <div>
                <p className="text-xs text-gray-400">战力</p>
                <p className="text-lg font-bold text-purple-400">{player.power.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-purple-950/50 px-4 py-2 rounded-lg border border-purple-700/40">
              <Coins size={20} className="text-yellow-400" />
              <div>
                <p className="text-xs text-gray-400">金币</p>
                <p className="text-lg font-bold text-yellow-400">{player.gold.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-purple-950/50 px-4 py-2 rounded-lg border border-purple-700/40">
              <Shield size={20} className="text-cyan-400" />
              <div>
                <p className="text-xs text-gray-400">佣兵团</p>
                <p className="text-lg font-bold text-cyan-400">{guild.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Trophy className="text-amber-400" /> 全服排行榜
        </h1>
        <p className="text-gray-400">跨服顶级佣兵团竞技排名</p>
      </div>

      {myGuildRank && (
        <div className="fantasy-card p-4 border-amber-500/50 bg-gradient-to-r from-amber-500/10 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Crown size={24} className="text-amber-400" />
              </div>
              <div>
                <p className="text-amber-400 text-sm">我的佣兵团排名</p>
                <p className="text-white text-lg font-bold">
                  第 {myGuildRank.rank} 名 · {guild.name}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">{rankingConfig[activeRanking].label}</p>
              <p className={`text-2xl font-bold ${rankingConfig[activeRanking].color}`}>
                {myGuildRank.value.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {(Object.keys(rankingConfig) as RankingType[]).map((type) => {
          const config = rankingConfig[type];
          return (
            <button
              key={type}
              onClick={() => setActiveRanking(type)}
              className={`px-5 py-3 rounded-lg flex items-center gap-2 transition-all ${
                activeRanking === type
                  ? `bg-gradient-to-r from-purple-600/50 to-purple-800/30 ${config.color} border-2 border-purple-500/50`
                  : 'text-gray-400 hover:text-white hover:bg-purple-800/20 border-2 border-transparent'
              }`}
            >
              {config.icon}
              <span className="font-semibold">{config.label}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentRankings.slice(0, 3).map((entry, idx) => {
            const medalStyles = [
              {
                bg: 'from-amber-400 via-yellow-500 to-amber-600',
                border: 'border-amber-400',
                glow: 'shadow-amber-500/50',
                icon: <Crown size={32} className="text-amber-300" />,
                rankColor: 'text-amber-400',
              },
              {
                bg: 'from-gray-300 via-gray-400 to-gray-500',
                border: 'border-gray-300',
                glow: 'shadow-gray-400/50',
                icon: <Trophy size={28} className="text-gray-200" />,
                rankColor: 'text-gray-300',
              },
              {
                bg: 'from-orange-500 via-amber-600 to-orange-700',
                border: 'border-orange-500',
                glow: 'shadow-orange-500/50',
                icon: <Trophy size={26} className="text-orange-300" />,
                rankColor: 'text-orange-400',
              },
            ];
            const style = medalStyles[idx];
            const isMyGuild = entry.guildId === 'g2';

            return (
              <div
                key={entry.guildId}
                className={`fantasy-card relative overflow-hidden p-5 transition-all hover:scale-[1.02] ${
                  isMyGuild
                    ? 'border-purple-500/70 bg-gradient-to-br from-purple-900/60 via-purple-800/40 to-indigo-900/50'
                    : 'border-purple-700/40'
                }`}
              >
                <div
                  className={`absolute inset-0 opacity-10 bg-gradient-to-br ${style.bg}`}
                />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${style.bg} flex items-center justify-center shadow-xl ${style.glow} border-2 ${style.border}`}
                    >
                      {style.icon}
                    </div>
                    <div className="text-right">
                      <p className={`text-4xl font-black ${style.rankColor} drop-shadow-lg`}>
                        #{entry.rank}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <GuildBadge badge={entry.badge} size="lg" />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-bold text-lg truncate ${
                          isMyGuild ? 'text-amber-400' : 'text-white'
                        }`}
                      >
                        {entry.guildName}
                        {isMyGuild && <span className="ml-2 text-xs text-amber-300">(我的)</span>}
                      </p>
                      <p className="text-sm text-gray-400">{entry.serverId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center bg-purple-950/50 rounded p-2">
                      <p className="text-xs text-gray-400">{rankingConfig[activeRanking].label}</p>
                      <p className={`font-bold ${rankingConfig[activeRanking].color}`}>
                        {entry.value.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center bg-purple-950/50 rounded p-2">
                      <p className="text-xs text-gray-400">成员</p>
                      <p className="font-bold text-blue-400">{entry.memberCount}</p>
                    </div>
                    <div className="text-center bg-purple-950/50 rounded p-2">
                      <p className="text-xs text-gray-400">总战力</p>
                      <p className="font-bold text-purple-400">
                        {entry.totalPower.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedGuildId(entry.guildId);
                      setModalTab('lineup');
                    }}
                    className="fantasy-btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <Eye size={16} /> 查看详情
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {currentRankings.slice(3).length > 0 && (
          <div className="fantasy-card overflow-hidden">
            <table className="w-full">
              <thead className="bg-purple-900/40">
                <tr>
                  <th className="px-6 py-3 text-left text-amber-400 font-semibold">排名</th>
                  <th className="px-6 py-3 text-left text-amber-400 font-semibold">佣兵团</th>
                  <th className="px-6 py-3 text-left text-amber-400 font-semibold">服务器</th>
                  <th className="px-6 py-3 text-left text-amber-400 font-semibold">
                    {rankingConfig[activeRanking].label}
                  </th>
                  <th className="px-6 py-3 text-left text-amber-400 font-semibold">成员数</th>
                  <th className="px-6 py-3 text-left text-amber-400 font-semibold">总战力</th>
                  <th className="px-6 py-3 text-left text-amber-400 font-semibold">操作</th>
                </tr>
              </thead>
              <tbody>
                {currentRankings.slice(3).map((entry, idx) => {
                  const isMyGuild = entry.guildId === 'g2';
                  return (
                    <tr
                      key={entry.guildId}
                      className={`hover:bg-purple-800/20 transition-colors ${
                        isMyGuild
                          ? 'bg-gradient-to-r from-purple-600/30 via-purple-500/20 to-indigo-600/30'
                          : idx % 2 === 0
                          ? 'bg-purple-950/20'
                          : ''
                      }`}
                    >
                      <td className="px-6 py-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold bg-purple-800/50 text-purple-300 border border-purple-600/40">
                          {entry.rank}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <GuildBadge badge={entry.badge} size="sm" />
                          <div>
                            <p
                              className={`font-semibold ${
                                isMyGuild ? 'text-amber-400' : 'text-white'
                              }`}
                            >
                              {entry.guildName}
                              {isMyGuild && (
                                <span className="ml-2 text-xs text-amber-300">(我的)</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-gray-400">{entry.serverId}</td>
                      <td className="px-6 py-3">
                        <span className={`text-lg font-bold ${rankingConfig[activeRanking].color}`}>
                          {entry.value.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-blue-400 flex items-center gap-1">
                          <Users size={14} /> {entry.memberCount}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-purple-400 font-semibold">
                        {entry.totalPower.toLocaleString()}
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => {
                            setSelectedGuildId(entry.guildId);
                            setModalTab('lineup');
                          }}
                          className="fantasy-btn-primary flex items-center gap-1 text-sm py-1.5 px-3"
                        >
                          <Eye size={14} /> 查看详情
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedGuild && guildDetail && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="fantasy-card p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <GuildBadge badge={selectedGuild.badge} size="xl" />
                <div>
                  <h2 className="text-2xl font-bold text-amber-400">
                    {selectedGuild.guildName}
                  </h2>
                  <p className="text-gray-400">{selectedGuild.serverId}</p>
                  <div className="flex gap-4 mt-2 flex-wrap">
                    <span className="text-amber-400 flex items-center gap-1">
                      <Trophy size={14} /> 排名 #{selectedGuild.rank}
                    </span>
                    <span className="text-purple-400 flex items-center gap-1">
                      <Swords size={14} /> 总战力 {selectedGuild.totalPower.toLocaleString()}
                    </span>
                    <span className="text-blue-400 flex items-center gap-1">
                      <Users size={14} /> {selectedGuild.memberCount}人
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedGuildId(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex gap-2 mb-6 border-b border-purple-700/50 pb-4">
              <button
                onClick={() => setModalTab('lineup')}
                className={`px-5 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  modalTab === 'lineup'
                    ? 'bg-gradient-to-r from-purple-600/60 to-purple-800/40 text-white border-2 border-purple-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-purple-800/20 border-2 border-transparent'
                }`}
              >
                <Users size={18} /> 阵容预览
              </button>
              <button
                onClick={() => setModalTab('buildings')}
                className={`px-5 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  modalTab === 'buildings'
                    ? 'bg-gradient-to-r from-purple-600/60 to-purple-800/40 text-white border-2 border-purple-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-purple-800/20 border-2 border-transparent'
                }`}
              >
                <Shield size={18} /> 驻地布局
              </button>
            </div>

            {modalTab === 'lineup' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {guildDetail.lineup.map((member, idx) => {
                  const cls = classInfo[member.characterClass];
                  const powerPercent = Math.min(100, (member.power / 12000) * 100);
                  return (
                    <div
                      key={idx}
                      className="fantasy-card p-4 hover:border-purple-500/60 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-700 to-indigo-800 flex items-center justify-center text-2xl border-2 border-purple-500/40 shadow-lg">
                          {member.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white truncate">{member.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-lg" title={cls.name}>
                              {cls.emoji}
                            </span>
                            <span className={`text-xs ${cls.color}`}>{cls.name}</span>
                            <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30">
                              Lv.{member.level}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">战力</span>
                          <span className="text-purple-400 font-bold">
                            {member.power.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-2 bg-purple-950/60 rounded-full overflow-hidden border border-purple-700/40">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                            style={{ width: `${powerPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {modalTab === 'buildings' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {guildDetail.buildings.map((building, idx) => (
                  <div
                    key={idx}
                    className="fantasy-card p-5 text-center hover:border-amber-500/50 transition-all"
                  >
                    <div className="text-5xl mb-3">{buildingIcons[building.type] || '🏰'}</div>
                    <p className="font-bold text-white mb-1">{building.name}</p>
                    <p className="text-xs text-gray-400 mb-2">
                      {building.type === 'training_field'
                        ? '训练场'
                        : building.type === 'workshop'
                        ? '工坊'
                        : building.type === 'warehouse'
                        ? '仓库'
                        : building.type}
                    </p>
                    <div className="text-amber-400 text-xl tracking-wider">
                      {renderStars(building.level)}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">等级 {building.level}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setSelectedGuildId(null)}
                className="fantasy-btn-primary px-8"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
