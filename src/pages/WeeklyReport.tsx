import React from 'react';
import {
  FileBarChart,
  Download,
  Users,
  Target,
  Coins,
  Star,
  TrendingUp,
  Calendar,
  Trophy,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

export const WeeklyReport: React.FC = () => {
  const { player, weeklyReport } = useGameStore((s) => ({
    player: s.player,
    weeklyReport: s.weeklyReport,
  }));

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

  const activityData = {
    labels: weeklyReport.memberActivity.map((d) => d.date),
    datasets: [
      {
        label: '活跃成员数',
        data: weeklyReport.memberActivity.map((d) => d.activeMembers),
        fill: true,
        backgroundColor: 'rgba(124, 58, 237, 0.3)',
        borderColor: 'rgba(124, 58, 237, 1)',
        tension: 0.4,
        pointBackgroundColor: '#fbbf24',
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
        label: '失败',
        data: weeklyReport.tasksByType.map((t) => t.total - t.completed),
        backgroundColor: 'rgba(220, 38, 38, 0.7)',
      },
    ],
  };

  const maxLoot = Math.max(...weeklyReport.lootHeatmap.map((l) => l.value));
  const lootData = {
    labels: weeklyReport.lootHeatmap.map((l) => l.category),
    datasets: [
      {
        label: '收益量',
        data: weeklyReport.lootHeatmap.map((l) => l.value),
        backgroundColor: [
          'rgba(251, 191, 36, 0.7)',
          'rgba(167, 139, 250, 0.7)',
          'rgba(52, 211, 153, 0.7)',
          'rgba(251, 146, 60, 0.7)',
          'rgba(96, 165, 250, 0.7)',
        ],
      },
    ],
  };

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const formatDateForFileName = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}${m}${d}`;
  };

  const getTaskTypeName = (type: string) => {
    if (type === 'escort') return '护送';
    if (type === 'assassinate') return '刺杀';
    return '探索';
  };

  const getTop10Members = () => {
    const top3 = weeklyReport.topMembers;
    const extra = [
      { name: '精灵射手·艾琳', contribution: 1480 },
      { name: '圣光牧师·莉亚', contribution: 1320 },
      { name: '暗影刺客·影刃', contribution: 1150 },
      { name: '雷霆战士·索尔', contribution: 980 },
      { name: '奥术法师·维克托', contribution: 870 },
      { name: '守护骑士·布莱恩', contribution: 760 },
      { name: '狂暴战士·格罗特', contribution: 650 },
    ];
    return [...top3, ...extra].slice(0, 10);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(22);
    doc.setTextColor(124, 58, 237);
    const title = '龙之守望佣兵团 - 每周运营报告';
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 22);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    const subTitle = `报告周期: ${formatDate(weeklyReport.weekStart)} ~ ${formatDate(weeklyReport.weekEnd)}`;
    const subTitleWidth = doc.getTextWidth(subTitle);
    doc.text(subTitle, (pageWidth - subTitleWidth) / 2, 32);

    autoTable(doc, {
      startY: 42,
      head: [['核心数据总览']],
      body: [],
      theme: 'plain',
      headStyles: {
        fillColor: [124, 58, 237],
        textColor: 255,
        fontSize: 13,
        fontStyle: 'bold',
        halign: 'center',
      },
      styles: { cellPadding: 2 },
    });

    autoTable(doc, {
      head: [['指标', '数值']],
      body: [
        ['金币收益', weeklyReport.totalGoldEarned.toLocaleString()],
        ['声望获得', weeklyReport.totalReputationGained.toLocaleString()],
        ['经验获得', weeklyReport.totalExpEarned.toLocaleString()],
        ['任务完成率', `${(weeklyReport.taskCompletionRate * 100).toFixed(1)}%`],
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [251, 191, 36],
        textColor: 0,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [250, 245, 255],
      },
      styles: {
        fontSize: 11,
      },
    });

    autoTable(doc, {
      head: [['任务完成情况']],
      body: [],
      theme: 'plain',
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        fontSize: 13,
        fontStyle: 'bold',
        halign: 'center',
      },
      styles: { cellPadding: 2 },
    });

    autoTable(doc, {
      head: [['任务类型', '完成数', '总数', '完成率']],
      body: weeklyReport.tasksByType.map((t) => [
        getTaskTypeName(t.type),
        t.completed,
        t.total,
        `${((t.completed / t.total) * 100).toFixed(1)}%`,
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 253, 244],
      },
      styles: {
        fontSize: 11,
      },
    });

    autoTable(doc, {
      head: [['成员活跃度']],
      body: [],
      theme: 'plain',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontSize: 13,
        fontStyle: 'bold',
        halign: 'center',
      },
      styles: { cellPadding: 2 },
    });

    autoTable(doc, {
      head: [['日期', '周一', '周二', '周三', '周四', '周五', '周六', '周日']],
      body: [
        [
          '活跃人数',
          ...weeklyReport.memberActivity.map((d) => d.activeMembers),
        ],
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [239, 246, 255],
      },
      styles: {
        fontSize: 11,
        halign: 'center',
      },
    });

    autoTable(doc, {
      head: [['贡献榜 Top 10']],
      body: [],
      theme: 'plain',
      headStyles: {
        fillColor: [251, 146, 60],
        textColor: 255,
        fontSize: 13,
        fontStyle: 'bold',
        halign: 'center',
      },
      styles: { cellPadding: 2 },
    });

    const top10 = getTop10Members();
    autoTable(doc, {
      head: [['排名', '成员名称', '贡献值']],
      body: top10.map((m, idx) => {
        const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`;
        return [medal, m.name, m.contribution.toLocaleString()];
      }),
      theme: 'grid',
      headStyles: {
        fillColor: [251, 146, 60],
        textColor: 255,
        fontStyle: 'bold',
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 0) {
          if (data.row.index === 0) {
            data.cell.styles.fillColor = [255, 215, 0];
            data.cell.styles.textColor = 0;
          } else if (data.row.index === 1) {
            data.cell.styles.fillColor = [192, 192, 192];
            data.cell.styles.textColor = 0;
          } else if (data.row.index === 2) {
            data.cell.styles.fillColor = [205, 127, 50];
            data.cell.styles.textColor = 255;
          }
        }
      },
      alternateRowStyles: {
        fillColor: [255, 247, 237],
      },
      styles: {
        fontSize: 11,
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    const now = new Date();
    const generatedAt = `生成时间: ${formatDate(now)} ${now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    doc.text(generatedAt, 20, finalY);

    doc.setFontSize(10);
    doc.setTextColor(200, 180, 220);
    const watermark = '龙之守望佣兵团管理系统';
    const watermarkWidth = doc.getTextWidth(watermark);
    doc.text(watermark, pageWidth - watermarkWidth - 20, finalY);

    const fileName = `佣兵团周报_${formatDateForFileName(new Date())}.pdf`;
    doc.save(fileName);
  };

  const expPercent = Math.min(100, (player.exp / player.expToNext) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileBarChart className="text-amber-400" /> 每周运营报告
          </h1>
          <p className="text-gray-400 flex items-center gap-2 mt-1">
            <Calendar size={14} />
            {formatDate(weeklyReport.weekStart)} ~ {formatDate(weeklyReport.weekEnd)}
          </p>
        </div>
        <button onClick={exportPDF} className="fantasy-btn-gold flex items-center gap-2">
          <Download size={18} /> 导出 PDF
        </button>
      </div>

      <div className="fantasy-card p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center text-3xl border-2 border-amber-400/50 shadow-lg shadow-purple-900/50">
              {player.avatar}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="text-amber-400 font-bold text-lg">Lv.{player.level}</span>
                <span className="text-white font-bold text-xl">{player.name}</span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Zap size={14} className="text-yellow-400" />
                  战力: <span className="text-yellow-400 font-semibold">{player.power.toLocaleString()}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Coins size={14} className="text-amber-400" />
                  金币: <span className="text-amber-400 font-semibold">{player.gold.toLocaleString()}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 md:max-w-xs">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-400 flex items-center gap-1">
                <Shield size={14} className="text-blue-400" /> 经验值
              </span>
              <span className="text-blue-400 font-semibold">
                {player.exp.toLocaleString()} / {player.expToNext.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${expPercent}%`,
                  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="fantasy-card p-5 bg-gradient-to-br from-yellow-500/20 to-yellow-700/10">
          <Coins size={28} className="text-yellow-400 mb-2" />
          <p className="text-gray-400 text-sm">金币收益</p>
          <p className="text-2xl font-bold text-yellow-400">{weeklyReport.totalGoldEarned.toLocaleString()}</p>
        </div>
        <div className="fantasy-card p-5 bg-gradient-to-br from-amber-500/20 to-amber-700/10">
          <Star size={28} className="text-amber-400 mb-2" />
          <p className="text-gray-400 text-sm">声望获得</p>
          <p className="text-2xl font-bold text-amber-400">{weeklyReport.totalReputationGained.toLocaleString()}</p>
        </div>
        <div className="fantasy-card p-5 bg-gradient-to-br from-blue-500/20 to-blue-700/10">
          <Sparkles size={28} className="text-blue-400 mb-2" />
          <p className="text-gray-400 text-sm">经验获得</p>
          <p className="text-2xl font-bold text-blue-400">{weeklyReport.totalExpEarned.toLocaleString()}</p>
        </div>
        <div className="fantasy-card p-5 bg-gradient-to-br from-green-500/20 to-green-700/10">
          <Target size={28} className="text-green-400 mb-2" />
          <p className="text-gray-400 text-sm">任务完成率</p>
          <p className="text-2xl font-bold text-green-400">{(weeklyReport.taskCompletionRate * 100).toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="fantasy-card p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Users size={20} className="text-blue-400" /> 成员活跃度曲线
          </h3>
          <div className="h-64">
            <Line data={activityData} options={chartOptions} />
          </div>
        </div>

        <div className="fantasy-card p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target size={20} className="text-green-400" /> 任务完成情况
          </h3>
          <div className="h-64">
            <Bar
              data={taskData}
              options={{
                ...chartOptions,
                scales: {
                  ...chartOptions.scales,
                  x: { ...chartOptions.scales.x, stacked: true },
                  y: { ...chartOptions.scales.y, stacked: true },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="fantasy-card p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-amber-400" /> 战利品收益热力图
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 lg:col-span-2">
            <Bar data={lootData} options={chartOptions} />
          </div>
          <div className="space-y-3">
            {weeklyReport.lootHeatmap.map((loot, idx) => {
              const intensity = (loot.value / maxLoot) * 100;
              return (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-24 text-gray-300">{loot.category}</span>
                  <div className="flex-1 h-8 bg-gray-800 rounded-lg overflow-hidden relative">
                    <div
                      className="h-full rounded-lg transition-all duration-1000"
                      style={{
                        width: `${intensity}%`,
                        background: `linear-gradient(90deg, rgba(124,58,237,${intensity / 100}), rgba(251,191,36,${intensity / 100}))`,
                      }}
                    />
                    <span className="absolute inset-0 flex items-center px-3 text-sm text-white font-semibold">
                      {loot.value.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fantasy-card p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Trophy size={20} className="text-amber-400" /> 本周贡献榜 Top 3
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weeklyReport.topMembers.map((member, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-xl border-2 ${
                idx === 0
                  ? 'bg-gradient-to-br from-amber-500/20 to-transparent border-amber-500/50'
                  : idx === 1
                  ? 'bg-gradient-to-br from-gray-400/20 to-transparent border-gray-400/50'
                  : 'bg-gradient-to-br from-orange-700/20 to-transparent border-orange-700/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                    idx === 0
                      ? 'bg-amber-500/30 text-amber-400'
                      : idx === 1
                      ? 'bg-gray-400/30 text-gray-300'
                      : 'bg-orange-700/30 text-orange-400'
                  }`}
                >
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                </div>
                <div>
                  <p className="font-bold text-white text-lg">{member.name}</p>
                  <p className="text-sm text-gray-400">第 {idx + 1} 名</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">贡献值</span>
                <span className="text-2xl font-bold text-amber-400">{member.contribution.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
