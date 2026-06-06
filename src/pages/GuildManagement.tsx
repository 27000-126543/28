import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Crown,
  Shield,
  ChevronUp,
  CheckCircle,
  XCircle,
  Heart,
  Droplets,
  Zap,
  Edit3,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { classInfo, roleInfo } from '../data/mockData';
import type { MemberRole, CharacterClass } from '../types';

type TabType = 'members' | 'applications' | 'promotions' | 'settings';

export const GuildManagement: React.FC = () => {
  const {
    guild,
    pendingApplications,
    promotionRequests,
    approveApplication,
    rejectApplication,
    approvePromotion,
    rejectPromotion,
    createGuild,
    currentUserRole,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<TabType>('members');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(guild.name);
  const [editDesc, setEditDesc] = useState(guild.description);
  const [editIcon, setEditIcon] = useState(guild.badge.icon);
  const [editColor1, setEditColor1] = useState(guild.badge.color1);
  const [editColor2, setEditColor2] = useState(guild.badge.color2);

  const canManage = currentUserRole === 'leader' || currentUserRole === 'vice_leader';
  const canApproveApplications = currentUserRole === 'leader' || currentUserRole === 'vice_leader' || currentUserRole === 'captain';
  const canApprovePromotions = currentUserRole === 'leader';

  const tabs = [
    { key: 'members' as TabType, label: '成员列表', icon: <Users size={18} /> },
    { key: 'applications' as TabType, label: `入团申请 (${pendingApplications.length})`, icon: <UserCheck size={18} /> },
    { key: 'promotions' as TabType, label: `晋升审批 (${promotionRequests.length})`, icon: <ChevronUp size={18} /> },
    { key: 'settings' as TabType, label: '佣兵团设置', icon: <Shield size={18} /> },
  ];

  const handleSaveSettings = () => {
    createGuild(editName, { icon: editIcon, color1: editColor1, color2: editColor2 }, editDesc);
    setShowEditModal(false);
  };

  const iconOptions = ['🐉', '⚔️', '🛡️', '🏹', '🔮', '🔥', '⭐', '🗡️', '👑', '💎', '🦅', '🐺'];
  const colorOptions = ['#7c3aed', '#fbbf24', '#dc2626', '#22c55e', '#3b82f6', '#f97316', '#ec4899', '#06b6d4'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">佣兵团管理</h1>
          <p className="text-gray-400">管理你的佣兵团成员与设置</p>
        </div>
        {canManage && (
          <button onClick={() => setShowEditModal(true)} className="fantasy-btn-primary flex items-center gap-2">
            <Edit3 size={18} /> 编辑信息
          </button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap border-b border-purple-700/30 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.key
                ? 'bg-purple-700/40 text-white'
                : 'text-gray-400 hover:text-white hover:bg-purple-800/20'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'members' && (
        <div className="fantasy-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-900/40">
                <tr>
                  <th className="px-4 py-3 text-left text-amber-400 font-semibold">成员</th>
                  <th className="px-4 py-3 text-left text-amber-400 font-semibold">职位</th>
                  <th className="px-4 py-3 text-left text-amber-400 font-semibold">职业</th>
                  <th className="px-4 py-3 text-left text-amber-400 font-semibold">等级</th>
                  <th className="px-4 py-3 text-left text-amber-400 font-semibold">战力</th>
                  <th className="px-4 py-3 text-left text-amber-400 font-semibold">贡献</th>
                  <th className="px-4 py-3 text-left text-amber-400 font-semibold">状态</th>
                </tr>
              </thead>
              <tbody>
                {guild.members.map((member, idx) => (
                  <tr key={member.id} className={idx % 2 === 0 ? 'bg-purple-950/20' : ''}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{member.avatar}</span>
                        <div>
                          <p className="font-semibold text-white">{member.name}</p>
                          <p className="text-xs text-gray-400">加入于 {member.joinDate.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`fantasy-badge border ${roleInfo[member.role].color}`}>
                        {member.role === 'leader' && <Crown size={12} className="inline mr-1" />}
                        {roleInfo[member.role].name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={classInfo[member.characterClass].color}>
                        {classInfo[member.characterClass].emoji} {classInfo[member.characterClass].name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white font-semibold">Lv.{member.level}</td>
                    <td className="px-4 py-3 text-amber-400 font-bold">{member.power.toLocaleString()}</td>
                    <td className="px-4 py-3 text-blue-400">{member.contribution.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <Heart size={12} className="text-red-400" />
                          <div className="w-16 stat-bar">
                            <div className="stat-bar-fill bg-gradient-to-r from-red-500 to-red-400" style={{ width: `${member.status.hp}%` }} />
                          </div>
                          <span className="text-gray-400">{member.status.hp}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Droplets size={12} className="text-blue-400" />
                          <div className="w-16 stat-bar">
                            <div className="stat-bar-fill bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: `${member.status.mp}%` }} />
                          </div>
                          <span className="text-gray-400">{member.status.mp}%</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="space-y-4">
          {pendingApplications.length === 0 ? (
            <div className="fantasy-card p-12 text-center">
              <UserX size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">暂无待审批的入团申请</p>
            </div>
          ) : (
            pendingApplications.map((app) => (
              <div key={app.id} className="fantasy-card p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-purple-800/50 flex items-center justify-center text-2xl">
                      {classInfo[app.applicantClass as CharacterClass]?.emoji || '⚔️'}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">{app.applicantName}</p>
                      <p className="text-sm text-gray-400 flex gap-4">
                        <span className={classInfo[app.applicantClass as CharacterClass]?.color}>
                          {classInfo[app.applicantClass as CharacterClass]?.name}
                        </span>
                        <span>Lv.{app.applicantLevel}</span>
                        <span className="text-amber-400">战力 {app.applicantPower}</span>
                      </p>
                      <p className="text-sm text-gray-300 mt-2 italic">"{app.message}"</p>
                      <p className="text-xs text-gray-500 mt-1">申请于 {app.createdAt.toLocaleString()}</p>
                    </div>
                  </div>
                  {canApproveApplications && (
                    <div className="flex gap-2">
                      <button onClick={() => approveApplication(app.id)} className="fantasy-btn flex items-center gap-1 bg-green-600/80 hover:bg-green-500 text-white">
                        <CheckCircle size={16} /> 通过
                      </button>
                      <button onClick={() => rejectApplication(app.id)} className="fantasy-btn flex items-center gap-1 bg-red-600/80 hover:bg-red-500 text-white">
                        <XCircle size={16} /> 拒绝
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'promotions' && (
        <div className="space-y-4">
          {promotionRequests.length === 0 ? (
            <div className="fantasy-card p-12 text-center">
              <ChevronUp size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">暂无待审批的晋升请求</p>
            </div>
          ) : (
            promotionRequests.map((req) => (
              <div key={req.id} className="fantasy-card p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-bold text-white">{req.memberName}</p>
                      <span className={`fantasy-badge border ${roleInfo[req.currentRole as MemberRole].color}`}>
                        {roleInfo[req.currentRole as MemberRole].name}
                      </span>
                      <Zap size={16} className="text-amber-400" />
                      <span className={`fantasy-badge border ${roleInfo[req.targetRole as MemberRole].color}`}>
                        {roleInfo[req.targetRole as MemberRole].name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mt-3 italic">理由: "{req.reason}"</p>
                    <p className="text-xs text-gray-500 mt-1">申请于 {req.createdAt.toLocaleString()}</p>
                  </div>
                  {canApprovePromotions && (
                    <div className="flex gap-2">
                      <button onClick={() => approvePromotion(req.id)} className="fantasy-btn flex items-center gap-1 bg-green-600/80 hover:bg-green-500 text-white">
                        <CheckCircle size={16} /> 批准
                      </button>
                      <button onClick={() => rejectPromotion(req.id)} className="fantasy-btn flex items-center gap-1 bg-red-600/80 hover:bg-red-500 text-white">
                        <XCircle size={16} /> 驳回
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="fantasy-card p-6">
          <h3 className="text-xl font-bold text-white mb-6">佣兵团信息</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-6">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-5xl border-4 shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${guild.badge.color1}, ${guild.badge.color2})`,
                  borderColor: guild.badge.color1,
                }}
              >
                {guild.badge.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-amber-400">{guild.name}</h2>
                <p className="text-gray-400 mt-2">{guild.description}</p>
                <p className="text-sm text-purple-400 mt-2">服务器: {guild.serverId}</p>
                <p className="text-sm text-gray-500">创建于 {guild.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">总声望</p>
                <p className="text-2xl text-amber-400 font-bold">{guild.reputation.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">任务完成率</p>
                <p className="text-2xl text-green-400 font-bold">
                  {((guild.completedTasks / (guild.completedTasks + guild.failedTasks)) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="fantasy-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">编辑佣兵团信息</h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm block mb-1">佣兵团名称</label>
                <input className="fantasy-input" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div>
                <label className="text-gray-300 text-sm block mb-1">简介</label>
                <textarea className="fantasy-input h-24 resize-none" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
              </div>
              <div>
                <label className="text-gray-300 text-sm block mb-2">徽章图标</label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setEditIcon(icon)}
                      className={`w-12 h-12 rounded-lg text-2xl flex items-center justify-center transition-all ${
                        editIcon === icon ? 'bg-purple-600 ring-2 ring-amber-400' : 'bg-purple-900/40 hover:bg-purple-700/40'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm block mb-2">主色调</label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setEditColor1(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${editColor1 === color ? 'border-white scale-110' : 'border-transparent'}`}
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-gray-300 text-sm block mb-2">副色调</label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setEditColor2(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${editColor2 === color ? 'border-white scale-110' : 'border-transparent'}`}
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-3xl border-4 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${editColor1}, ${editColor2})`, borderColor: editColor1 }}
                >
                  {editIcon}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowEditModal(false)} className="fantasy-btn flex-1 bg-gray-700 hover:bg-gray-600 text-white">
                取消
              </button>
              <button onClick={handleSaveSettings} className="fantasy-btn-primary flex-1">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
