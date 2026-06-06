import React from 'react';
import {
  Castle,
  Dumbbell,
  Hammer,
  Package,
  ArrowUp,
  Coins,
  Layers,
  Sparkles,
  Zap,
  Box,
  Sword,
  Star,
  TrendingUp,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import type { BuildingType } from '../types';

const buildingIcons: Record<BuildingType, React.ReactNode> = {
  training_field: <Dumbbell size={32} />,
  workshop: <Hammer size={32} />,
  warehouse: <Package size={32} />,
};

const buildingColors: Record<BuildingType, { gradient: string; border: string; text: string; progress: string }> = {
  training_field: {
    gradient: 'from-blue-600/30 to-blue-800/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    progress: 'from-blue-500 to-blue-400',
  },
  workshop: {
    gradient: 'from-orange-600/30 to-orange-800/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    progress: 'from-orange-500 to-orange-400',
  },
  warehouse: {
    gradient: 'from-green-600/30 to-green-800/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
    progress: 'from-green-500 to-green-400',
  },
};

export const Headquarters: React.FC = () => {
  const store = useGameStore();
  const { player, guild } = store;
  const effects = store.getGuildBuildingEffects();
  const expPercent = (player.exp / player.expToNext) * 100;

  const layoutBuildings = [
    { name: '主堡', icon: '🏰', level: 10 },
    { name: '训练场', icon: '💪', level: guild.buildings.find((b) => b.type === 'training_field')?.level || 1 },
    { name: '工坊', icon: '🔨', level: guild.buildings.find((b) => b.type === 'workshop')?.level || 1 },
    { name: '仓库', icon: '📦', level: guild.buildings.find((b) => b.type === 'warehouse')?.level || 1 },
    { name: '兵营', icon: '⚔️', level: 5 },
    { name: '酒馆', icon: '🍺', level: 3 },
    { name: '市场', icon: '🏪', level: 4 },
    { name: '魔法塔', icon: '🔮', level: 2 },
    { name: '马厩', icon: '🐴', level: 6 },
    { name: '城墙', icon: '🧱', level: 8 },
  ];

  const getLevelColor = (level: number) => {
    if (level >= 8) return 'border-amber-500/50 bg-gradient-to-br from-amber-500/20 to-amber-700/10';
    if (level >= 5) return 'border-purple-500/50 bg-gradient-to-br from-purple-500/20 to-purple-700/10';
    if (level >= 3) return 'border-blue-500/50 bg-gradient-to-br from-blue-500/20 to-blue-700/10';
    return 'border-gray-500/30 bg-gradient-to-br from-gray-500/20 to-gray-700/10';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Castle className="text-amber-400" /> 佣兵团驻地
        </h1>
        <p className="text-gray-400">升级建筑，增强佣兵团实力</p>
      </div>

      <div className="fantasy-card p-5">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Star size={20} className="text-amber-400" /> 玩家信息
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-700/10 border border-purple-500/30 flex items-center justify-center text-2xl">
              {player.avatar}
            </div>
            <div>
              <p className="text-sm text-gray-400">{player.name}</p>
              <p className="text-lg font-bold text-purple-400">Lv.{player.level}</p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">经验值</span>
              <span className="text-sm text-purple-400">
                {player.exp.toLocaleString()} / {player.expToNext.toLocaleString()}
              </span>
            </div>
            <div className="stat-bar">
              <div
                className="stat-bar-fill bg-gradient-to-r from-purple-500 to-purple-400"
                style={{ width: `${expPercent}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-red-700/10 border border-red-500/30 flex items-center justify-center">
              <Sword className="text-red-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">战力</p>
              <p className="text-lg font-bold text-red-400">{player.power.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-700/10 border border-yellow-500/30 flex items-center justify-center">
              <Coins className="text-yellow-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">个人金币</p>
              <p className="text-lg font-bold text-yellow-400">{player.gold.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fantasy-card p-5">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Castle size={20} className="text-amber-400" /> 佣兵团资源
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-700/10 border border-yellow-500/30 flex items-center justify-center">
              <Coins className="text-yellow-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">兵团金币</p>
              <p className="text-xl font-bold text-yellow-400">{guild.gold.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-700/10 border border-green-500/30 flex items-center justify-center">
              <Layers className="text-green-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">兵团材料</p>
              <p className="text-xl font-bold text-green-400">{guild.materials.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-700/10 border border-cyan-500/30 flex items-center justify-center">
              <Box className="text-cyan-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">存储上限</p>
              <p className="text-xl font-bold text-cyan-400">{effects.storageLimit.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fantasy-card p-5">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-purple-400" /> 建筑加成总览
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-800/10 border border-blue-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell className="text-blue-400" size={20} />
              <span className="text-white font-semibold">训练场加成</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">经验获取 +{Math.round((effects.expBonus - 1) * 100)}%</p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-orange-600/20 to-orange-800/10 border border-orange-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Hammer className="text-orange-400" size={20} />
              <span className="text-white font-semibold">工坊加成</span>
            </div>
            <p className="text-2xl font-bold text-orange-400">图纸掉落率 +{Math.round((effects.blueprintBonus - 1) * 100)}%</p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-green-600/20 to-green-800/10 border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Package className="text-green-400" size={20} />
              <span className="text-white font-semibold">仓库容量</span>
            </div>
            <p className="text-2xl font-bold text-green-400">存储上限 {effects.storageLimit.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {guild.buildings.map((building) => {
          const colors = buildingColors[building.type];
          const canAffordGold = guild.gold >= building.upgradeCost.gold;
          const canAffordMaterials = guild.materials >= building.upgradeCost.materials;
          const canAfford = canAffordGold && canAffordMaterials;
          const isMaxLevel = building.level >= building.maxLevel;

          return (
            <div
              key={building.type}
              className={`fantasy-card p-6 bg-gradient-to-br ${colors.gradient} border ${colors.border} hover:scale-[1.02] transition-transform duration-300`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-16 h-16 rounded-xl bg-black/30 flex items-center justify-center ${colors.text}`}>
                  {buildingIcons[building.type]}
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">等级</p>
                  <p className={`text-2xl font-bold ${colors.text}`}>
                    Lv.{building.level}
                    <span className="text-gray-500 text-sm">/{building.maxLevel}</span>
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{building.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{building.description}</p>

              <div className="mb-4">
                <div className="stat-bar mb-2">
                  <div
                    className={`stat-bar-fill bg-gradient-to-r ${colors.progress}`}
                    style={{ width: `${(building.level / building.maxLevel) * 100}%` }}
                  />
                </div>
              </div>

              <div className={`p-3 rounded-lg bg-black/30 mb-4 ${colors.text}`}>
                <div className="flex items-center gap-2">
                  <Zap size={16} />
                  <span className="text-sm font-semibold">当前效果: {building.effect}</span>
                </div>
              </div>

              {!isMaxLevel ? (
                <>
                  <div className="flex items-center justify-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Coins size={14} className="text-yellow-400" />
                      <span className={`font-bold ${canAffordGold ? 'text-amber-400' : 'text-red-400'}`}>
                        {building.upgradeCost.gold.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Box size={14} className="text-green-400" />
                      <span className={`font-bold ${canAffordMaterials ? 'text-amber-400' : 'text-red-400'}`}>
                        {building.upgradeCost.materials.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => store.upgradeBuilding(building.type)}
                    disabled={!canAfford}
                    className={`w-full fantasy-btn-primary flex items-center justify-center gap-2`}
                  >
                    <ArrowUp size={18} />
                    {canAfford ? '升级' : '资源不足'}
                  </button>
                </>
              ) : (
                <button disabled className="w-full fantasy-btn bg-gray-700 text-gray-400 cursor-not-allowed">
                  <Sparkles size={18} className="inline mr-2" />
                  已满级
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="fantasy-card p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Castle size={20} className="text-purple-400" /> 驻地布局预览
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {layoutBuildings.map((item, idx) => (
            <div
              key={idx}
              className={`fantasy-card p-4 text-center hover:border-purple-500/50 transition-all cursor-pointer group ${getLevelColor(item.level)}`}
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
              <p className="text-white text-sm font-medium">{item.name}</p>
              <p className="text-amber-400 text-xs mt-1 font-bold">Lv.{item.level}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
