import React from 'react';
import {
  Users,
  ScrollText,
  Swords,
  Castle,
  Store,
  FileBarChart,
  Trophy,
  Home,
  ShieldCheck,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { GuildBadge } from './GuildBadge';

export type PageType =
  | 'dashboard'
  | 'guild'
  | 'tasks'
  | 'war'
  | 'headquarters'
  | 'market'
  | 'report'
  | 'ranking';

interface Props {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

const navItems: { key: PageType; label: string; icon: React.ReactNode }[] = [
  { key: 'dashboard', label: '总览', icon: <Home size={20} /> },
  { key: 'guild', label: '佣兵团管理', icon: <Users size={20} /> },
  { key: 'tasks', label: '任务大厅', icon: <ScrollText size={20} /> },
  { key: 'war', label: '跨服战', icon: <Swords size={20} /> },
  { key: 'headquarters', label: '团驻地', icon: <Castle size={20} /> },
  { key: 'market', label: '交易市场', icon: <Store size={20} /> },
  { key: 'report', label: '运营报告', icon: <FileBarChart size={20} /> },
  { key: 'ranking', label: '全服排行榜', icon: <Trophy size={20} /> },
];

export const Sidebar: React.FC<Props> = ({ currentPage, onNavigate }) => {
  const { guild, pendingApplications, promotionRequests, activeWar } = useGameStore();

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-purple-950/80 to-slate-950/90 border-r border-purple-700/30 flex flex-col">
      <div className="p-6 border-b border-purple-700/30">
        <div className="flex items-center gap-4">
          <GuildBadge badge={guild.badge} size="lg" />
          <div>
            <h2 className="text-xl font-bold text-amber-400 drop-shadow">{guild.name}</h2>
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <ShieldCheck size={14} className="text-purple-400" />
              {guild.serverId}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = currentPage === item.key;
          const hasNotification =
            (item.key === 'guild' && (pendingApplications.length > 0 || promotionRequests.length > 0)) ||
            (item.key === 'war' && activeWar?.status === 'active');
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600/50 to-purple-800/30 text-white border-l-4 border-amber-400 shadow-lg shadow-purple-900/30'
                  : 'text-gray-400 hover:text-white hover:bg-purple-800/20'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
              {hasNotification && (
                <span className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-purple-700/30">
        <div className="fantasy-card p-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-400">声望</p>
              <p className="text-amber-400 font-bold">{guild.reputation.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400">战力</p>
              <p className="text-purple-400 font-bold">{guild.totalPower.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400">金币</p>
              <p className="text-yellow-400 font-bold">{guild.gold.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400">团员</p>
              <p className="text-blue-400 font-bold">{guild.members.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
