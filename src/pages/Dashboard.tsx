import React from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useGameStore } from '../store/gameStore';
import { classInfo, roleInfo } from '../data/mockData';
import { Users, Star, Coins, Sword, TrendingUp, Target } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const Dashboard: React.FC = () => {
  const { guild, weeklyReport, activeTask, activeWar } = useGameStore();

  const activityData = {
    labels: weeklyReport.memberActivity.map((d) => d.date),
    datasets: [
      {
        label: '活跃成员数',
        data: weeklyReport.memberActivity.map((d) => d.activeMembers),
        fill: true,
        backgroundColor: 'rgba(124, 58, 237, 0.2)',
        borderColor: 'rgba(124, 58, 237, 1)',
        tension: 0.4,
        pointBackgroundColor: '#fbbf24',
      },
    ],
  };

  const classCounts: Record<string, number> = {};
  guild.members.forEach((m) => {
    classCounts[m.characterClass] = (classCounts[m.characterClass] || 0) + 1;
  });

  const classData = {
    labels: Object.keys(classCounts).map((c) => classInfo[c as keyof typeof classInfo].name),
    datasets: [
      {
        data: Object.values(classCounts),
        backgroundColor: [
          'rgba(248, 113, 113, 0.8)',
          'rgba(167, 139, 250, 0.8)',
          'rgba(74, 222, 128, 0.8)',
          'rgba(52, 211, 153, 0.8)',
          'rgba(156, 163, 175, 0.8)',
          'rgba(251, 191, 36, 0.8)',
        ],
        borderColor: 'rgba(0, 0, 0, 0.3)',
      },
    ],
  };

  const taskData = {
    labels: weeklyReport.tasksByType.map((t) =>
      t.type === 'escort' ? '护送' : t.type === 'assassinate' ? '刺杀' : '探索'
    ),
    datasets: [
      {
        label: '已完成',
        data: weeklyReport.tasksByType.map((t) => t.completed),
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
      },
      {
        label: '总数',
        data: weeklyReport.tasksByType.map((t) => t.total),
        backgroundColor: 'rgba(124, 58, 237, 0.7)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#e5e7eb' },
      },
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(124, 58, 237, 0.1)' },
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(124, 58, 237, 0.1)' },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: '#e5e7eb' },
      },
    },
  };

  const statCards = [
    { icon: <Star size={24} />, label: '总声望', value: guild.reputation.toLocaleString(), color: 'text-amber-400', bg: 'from-amber-500/20 to-amber-700/10' },
    { icon: <Sword size={24} />, label: '总战力', value: guild.totalPower.toLocaleString(), color: 'text-purple-400', bg: 'from-purple-500/20 to-purple-700/10' },
    { icon: <Coins size={24} />, label: '金币', value: guild.gold.toLocaleString(), color: 'text-yellow-400', bg: 'from-yellow-500/20 to-yellow-700/10' },
    { icon: <Users size={24} />, label: '成员数', value: guild.members.length.toString(), color: 'text-blue-400', bg: 'from-blue-500/20 to-blue-700/10' },
    { icon: <Target size={24} />, label: '完成任务', value: guild.completedTasks.toString(), color: 'text-green-400', bg: 'from-green-500/20 to-green-700/10' },
    { icon: <TrendingUp size={24} />, label: '完成率', value: `${((guild.completedTasks / (guild.completedTasks + guild.failedTasks)) * 100).toFixed(1)}%`, color: 'text-emerald-400', bg: 'from-emerald-500/20 to-emerald-700/10' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">欢迎回来，冒险者！</h1>
        <p className="text-gray-400">{guild.name} · 佣兵团总览</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, idx) => (
          <div key={idx} className={`fantasy-card p-4 bg-gradient-to-br ${card.bg}`}>
            <div className={`${card.color} mb-2`}>{card.icon}</div>
            <p className="text-gray-400 text-sm">{card.label}</p>
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {activeTask && activeTask.status === 'in_progress' && (
        <div className="fantasy-card p-5 border-amber-500/50 animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                <Sword size={20} /> 任务进行中
              </h3>
              <p className="text-white mt-1">{activeTask.name}</p>
              <p className="text-sm text-gray-400 mt-1">进度: {activeTask.progress.toFixed(0)}%</p>
            </div>
            <div className="w-48 h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all"
                style={{ width: `${activeTask.progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {activeWar && activeWar.status === 'active' && (
        <div className="fantasy-card p-5 border-red-500/50">
          <h3 className="text-lg font-bold text-red-400 flex items-center gap-2 mb-3">
            <Sword size={20} /> 跨服战进行中
          </h3>
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-amber-400 font-bold">{activeWar.attacker.name}</p>
              <p className="text-sm text-gray-400">兵力: {activeWar.attacker.troops}</p>
              <p className="text-sm text-green-400">士气: {activeWar.attacker.morale}%</p>
            </div>
            <div className="text-4xl text-red-500">⚔️</div>
            <div className="text-center">
              <p className="text-red-400 font-bold">{activeWar.defender.name}</p>
              <p className="text-sm text-gray-400">兵力: {activeWar.defender.troops}</p>
              <p className="text-sm text-green-400">士气: {activeWar.defender.morale}%</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="fantasy-card p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Users size={20} className="text-blue-400" />
            本周成员活跃度
          </h3>
          <div className="h-64">
            <Line data={activityData} options={chartOptions} />
          </div>
        </div>

        <div className="fantasy-card p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-purple-400" />
            职业构成
          </h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={classData} options={doughnutOptions} />
          </div>
        </div>

        <div className="fantasy-card p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target size={20} className="text-green-400" />
            本周任务完成情况
          </h3>
          <div className="h-64">
            <Bar data={taskData} options={{ ...chartOptions, scales: { ...chartOptions.scales, x: { ...chartOptions.scales.x, stacked: true }, y: { ...chartOptions.scales.y, stacked: true } } }} />
          </div>
        </div>
      </div>

      <div className="fantasy-card p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Star size={20} className="text-amber-400" />
          核心成员
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {guild.members.slice(0, 5).map((member) => (
            <div key={member.id} className="fantasy-card p-4 text-center hover:border-purple-500/50 transition-all">
              <div className="text-4xl mb-2">{member.avatar}</div>
              <p className="font-semibold text-white text-sm truncate">{member.name}</p>
              <span className={`fantasy-badge border ${roleInfo[member.role].color}`}>
                {roleInfo[member.role].name}
              </span>
              <p className="text-amber-400 text-sm mt-2">战力: {member.power}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
