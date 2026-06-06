import React, { useState, useMemo } from 'react';
import {
  Store,
  Scroll,
  Eye,
  Package,
  Coins,
  TrendingUp,
  Plus,
  ShoppingCart,
  Sparkles,
  Tag,
  User,
  Info,
  Zap,
  Star,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import type { MarketItemType } from '../types';
import { rarityColors } from '../data/mockData';

const typeIcons: Record<MarketItemType, React.ReactNode> = {
  blueprint: <Scroll size={18} />,
  intel: <Eye size={18} />,
  material: <Package size={18} />,
};

const typeNames: Record<MarketItemType, string> = {
  blueprint: '装备图纸',
  intel: '情报',
  material: '材料',
};

const rarityNames: Record<string, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};

type RarityFilter = 'all' | 'common' | 'rare' | 'epic' | 'legendary';

export const Market: React.FC = () => {
  const store = useGameStore();
  const { player, guild, marketItems } = store;

  const [typeFilter, setTypeFilter] = useState<MarketItemType | 'all'>('all');
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all');
  const [showListModal, setShowListModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState<MarketItemType>('blueprint');
  const [newItemRarity, setNewItemRarity] = useState<'common' | 'rare' | 'epic' | 'legendary'>('rare');
  const [newItemPrice, setNewItemPrice] = useState(0);
  const [newItemDesc, setNewItemDesc] = useState('');

  const expPercent = useMemo(() => {
    return Math.min(100, Math.floor((player.exp / player.expToNext) * 100));
  }, [player.exp, player.expToNext]);

  const filteredItems = useMemo(() => {
    return marketItems.filter((item) => {
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      if (rarityFilter !== 'all' && item.rarity !== rarityFilter) return false;
      return true;
    });
  }, [marketItems, typeFilter, rarityFilter]);

  const suggestedPrice = useMemo(() => {
    return store.getSuggestedPrice(newItemName, newItemRarity, newItemType);
  }, [newItemName, newItemRarity, newItemType, store]);

  const handleBuy = (itemId: string) => {
    store.buyMarketItem(itemId);
  };

  const handleList = () => {
    if (!newItemName || newItemPrice <= 0) return;
    const success = store.listMarketItem({
      sellerId: guild.id,
      sellerName: guild.name,
      type: newItemType,
      name: newItemName,
      description: newItemDesc,
      rarity: newItemRarity,
      price: newItemPrice,
    });
    if (success) {
      setShowListModal(false);
      setNewItemName('');
      setNewItemPrice(0);
      setNewItemDesc('');
      setNewItemType('blueprint');
      setNewItemRarity('rare');
    }
  };

  return (
    <div className="space-y-6">
      <div className="fantasy-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2 border-purple-500 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #1e1b4b)',
                boxShadow: '0 0 20px #7c3aed60',
              }}
            >
              {player.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-bold text-white">{player.name}</span>
                <span className="fantasy-badge border border-amber-500/50 bg-amber-500/10 text-amber-400">
                  Lv.{player.level}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-orange-400">
                  <Zap size={14} />
                  <span>战力 {player.power.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Coins size={14} />
                  <span>金币 {player.gold.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-2 w-64">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-400">经验值</span>
                  <span className="text-purple-400">
                    {player.exp.toLocaleString()} / {player.expToNext.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-purple-900/50">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500"
                    style={{ width: `${expPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Store className="text-amber-400" /> 跨服交易市场
              </h1>
              <p className="text-gray-400">交易稀有图纸、情报和材料</p>
            </div>
            <button
              onClick={() => setShowListModal(true)}
              className="fantasy-btn-gold flex items-center gap-2"
            >
              <Plus size={18} /> 我要上架
            </button>
          </div>
        </div>
      </div>

      <div className="fantasy-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-2">物品类型</p>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setTypeFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    typeFilter === 'all'
                      ? 'bg-purple-600/50 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-purple-800/20'
                  }`}
                >
                  全部
                </button>
                {(['blueprint', 'intel', 'material'] as MarketItemType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                      typeFilter === t
                        ? 'bg-purple-600/50 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-purple-800/20'
                    }`}
                  >
                    {typeIcons[t]} {typeNames[t]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2">稀有度</p>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setRarityFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    rarityFilter === 'all'
                      ? 'bg-purple-600/50 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-purple-800/20'
                  }`}
                >
                  全部
                </button>
                {(['common', 'rare', 'epic', 'legendary'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRarityFilter(r)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-1 transition-all ${
                      rarityFilter === r
                        ? 'bg-purple-600/50 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-purple-800/20'
                    }`}
                  >
                    <Star size={14} className={rarityColors[r].split(' ')[0]} />
                    {rarityNames[r]}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Coins size={16} className="text-yellow-400" />
            <span className="text-gray-400">我的金币:</span>
            <span className="text-yellow-400 font-bold">{player.gold.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isOwnItem = item.sellerId === guild.id;
          const canAfford = player.gold >= item.price;
          const cannotBuy = !canAfford || isOwnItem;

          return (
            <div
              key={item.id}
              className={`fantasy-card p-5 hover:border-purple-500/50 transition-all ${
                item.rarity === 'legendary' ? 'border-amber-500/50 animate-pulse-slow' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-lg ${rarityColors[item.rarity]}`}>
                  {typeIcons[item.type]}
                </div>
                <span className={`fantasy-badge border ${rarityColors[item.rarity]}`}>
                  {rarityNames[item.rarity]}
                </span>
              </div>

              <h3
                className={`text-lg font-bold mb-1 ${
                  item.rarity === 'legendary'
                    ? 'text-amber-400'
                    : item.rarity === 'epic'
                    ? 'text-purple-400'
                    : item.rarity === 'rare'
                    ? 'text-blue-400'
                    : 'text-white'
                }`}
              >
                {item.name}
              </h3>
              <p className="text-sm text-gray-400 mb-4">{item.description}</p>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Tag size={14} /> 类型:{' '}
                  <span className="text-white">{typeNames[item.type]}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <User size={14} /> 卖家:
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-700/60 border border-gray-600/50 flex items-center justify-center text-sm">
                      <User size={12} className="text-amber-400" />
                    </div>
                    <span className="text-amber-400">{item.sellerName}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-purple-900/30 border border-purple-500/20 mb-4">
                <div className="flex items-center gap-2 mb-1 text-xs text-gray-400">
                  <TrendingUp size={12} /> 7日均价
                </div>
                <div className="text-amber-400 font-bold">
                  {item.suggestedPriceRange.avg.toLocaleString()} 金币
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">售价</p>
                  <p className="text-2xl font-bold text-yellow-400 flex items-center gap-1">
                    <Coins size={20} /> {item.price.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleBuy(item.id)}
                  disabled={cannotBuy}
                  className={`fantasy-btn flex items-center gap-2 ${
                    !cannotBuy
                      ? 'bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-black'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart size={16} />
                  {isOwnItem ? '我的物品' : !canAfford ? '金币不足' : '购买'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showListModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="fantasy-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Plus size={24} className="text-amber-400" /> 上架物品
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm block mb-1">物品名称</label>
                <input
                  className="fantasy-input"
                  value={newItemName}
                  onChange={(e) => {
                    setNewItemName(e.target.value);
                    const price = store.getSuggestedPrice(e.target.value, newItemRarity, newItemType);
                    setNewItemPrice(price.avg);
                  }}
                  placeholder="输入物品名称"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm block mb-1">类型</label>
                  <select
                    className="fantasy-input"
                    value={newItemType}
                    onChange={(e) => {
                      const newType = e.target.value as MarketItemType;
                      setNewItemType(newType);
                      if (newItemName) {
                        const price = store.getSuggestedPrice(newItemName, newItemRarity, newType);
                        setNewItemPrice(price.avg);
                      }
                    }}
                  >
                    <option value="blueprint">装备图纸</option>
                    <option value="intel">情报</option>
                    <option value="material">材料</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-300 text-sm block mb-1">稀有度</label>
                  <select
                    className="fantasy-input"
                    value={newItemRarity}
                    onChange={(e) => {
                      const newRarity = e.target.value as 'common' | 'rare' | 'epic' | 'legendary';
                      setNewItemRarity(newRarity);
                      if (newItemName) {
                        const price = store.getSuggestedPrice(newItemName, newRarity, newItemType);
                        setNewItemPrice(price.avg);
                      }
                    }}
                  >
                    <option value="common">普通</option>
                    <option value="rare">稀有</option>
                    <option value="epic">史诗</option>
                    <option value="legendary">传说</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-300 text-sm block mb-1">物品描述</label>
                <textarea
                  className="fantasy-input h-20 resize-none"
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="描述物品的详细信息..."
                />
              </div>

              {newItemName && (
                <div className="p-4 rounded-lg bg-purple-900/30 border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-300">
                    <Info size={16} className="text-amber-400" />
                    系统自动定价建议（基于近7天成交数据）
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center text-sm">
                    <div>
                      <p className="text-gray-400">最低价</p>
                      <p className="text-green-400 font-bold">{suggestedPrice.min.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">建议价</p>
                      <p className="text-green-400 font-bold">{suggestedPrice.avg.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">最高价</p>
                      <p className="text-green-400 font-bold">{suggestedPrice.max.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-gray-300 text-sm block mb-1">
                  售价 (金币) <span className="text-amber-400">*建议设置在参考区间内</span>
                </label>
                <div className="relative">
                  <Coins
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400"
                  />
                  <input
                    type="number"
                    className="fantasy-input pl-10"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    min={1}
                  />
                </div>
                {newItemPrice > 0 && newItemName && (
                  <p
                    className={`text-xs mt-1 ${
                      newItemPrice >= suggestedPrice.min &&
                      newItemPrice <= suggestedPrice.max
                        ? 'text-green-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {newItemPrice >= suggestedPrice.min &&
                    newItemPrice <= suggestedPrice.max
                      ? '✓ 价格在合理区间内，更容易成交'
                      : '⚠ 价格偏离建议区间，可能较难成交'}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  上架将扣除 <span className="text-amber-400">100 金币</span> 手续费
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowListModal(false)}
                className="fantasy-btn flex-1 bg-gray-700 hover:bg-gray-600 text-white"
              >
                取消
              </button>
              <button
                onClick={handleList}
                disabled={!newItemName || newItemPrice <= 0 || player.gold < 100}
                className="fantasy-btn-gold flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles size={16} /> 确认上架
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
