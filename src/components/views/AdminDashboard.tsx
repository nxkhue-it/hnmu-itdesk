import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserManagerView } from '../admin/UserManagerView';
import { RoomManagerView } from '../admin/RoomManagerView';
import { DeviceManagerView } from '../admin/DeviceManagerView';
import {
  Shield,
  Users,
  Settings,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Clock,
  PlusCircle,
  BookOpen,
  Newspaper,
  ChevronRight,
  UserCheck,
  Building2,
  Laptop,
  LayoutDashboard,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    tickets,
    assignTicket,
    setSelectedTicket,
    setActiveTab,
    users,
    rooms,
    devices,
    adminSubTab,
    setAdminSubTab,
  } = useApp();

  const technicians = users.filter((u) => u.role === 'technician');
  const pendingTickets = tickets.filter((t) => t.status === 'pending');
  const activeTickets = tickets.filter((t) => t.status === 'in_progress' || t.status === 'assigned');
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed');

  return (
    <div className="space-y-6 pb-12">
      {/* Admin Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-400/40 shadow-md"
          />
          <div className="space-y-1">
            <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-400/30 px-2.5 py-0.5 rounded-full font-medium">
              Bảng Điều Phối Quản Trị Hệ Thống (Admin Control Panel)
            </span>
            <h1 className="text-xl sm:text-2xl font-bold">{currentUser?.name}</h1>
            <p className="text-xs text-slate-300">
              {currentUser?.roleTitle} • Trung tâm CNTT & Thư viện
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('news')}
            className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-slate-200 transition flex items-center space-x-1.5"
          >
            <Newspaper className="w-4 h-4 text-amber-300" />
            <span>Đăng Tin tức</span>
          </button>
          <button
            onClick={() => setActiveTab('knowledge')}
            className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-slate-200 transition flex items-center space-x-1.5"
          >
            <BookOpen className="w-4 h-4 text-blue-300" />
            <span>Thêm Hướng dẫn</span>
          </button>
        </div>
      </div>

      {/* Admin Management Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs sm:text-sm">
        <button
          onClick={() => setAdminSubTab('overview')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center space-x-2 shrink-0 ${
            adminSubTab === 'overview'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Điều phối sự cố & Tải KTV</span>
        </button>

        <button
          onClick={() => setAdminSubTab('users')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center space-x-2 shrink-0 ${
            adminSubTab === 'users'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Quản lý Người dùng ({users.length})</span>
        </button>

        <button
          onClick={() => setAdminSubTab('rooms')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center space-x-2 shrink-0 ${
            adminSubTab === 'rooms'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Quản lý Phòng học ({rooms.length})</span>
        </button>

        <button
          onClick={() => setAdminSubTab('devices')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center space-x-2 shrink-0 ${
            adminSubTab === 'devices'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Laptop className="w-4 h-4" />
          <span>Quản lý Thiết bị CNTT ({devices.length})</span>
        </button>
      </div>

      {/* Sub-Tab 1: Overview & Incident Dispatch */}
      {adminSubTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="text-xs font-bold text-slate-400 uppercase">Tổng số sự cố phát sinh</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">{tickets.length}</div>
              <div className="text-xs text-slate-500 mt-1">Đã đồng bộ tự động</div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-xs">
              <div className="text-xs font-bold text-amber-800 uppercase">Chờ chỉ định KTV</div>
              <div className="text-3xl font-extrabold text-amber-900 mt-2">{pendingTickets.length}</div>
              <div className="text-xs text-amber-700 mt-1">Cần điều phối khẩn</div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 shadow-xs">
              <div className="text-xs font-bold text-blue-800 uppercase">Đang tiến hành xử lý</div>
              <div className="text-3xl font-extrabold text-blue-900 mt-2">{activeTickets.length}</div>
              <div className="text-xs text-blue-700 mt-1">KTV đang thao tác tại phòng</div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-xs">
              <div className="text-xs font-bold text-emerald-800 uppercase">Tỷ lệ SLA đạt chuẩn</div>
              <div className="text-3xl font-extrabold text-emerald-900 mt-2">96.8%</div>
              <div className="text-xs text-emerald-700 mt-1">Xử lý đúng thời hạn cam kết</div>
            </div>
          </div>

          {/* Technician Workload Matrix */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <h2 className="text-base font-bold text-slate-900">Giám Sát Tải Công Việc Đội Ngũ Kỹ Thuật Viên</h2>
              </div>
              <span className="text-xs text-slate-500">Trực ban kỹ thuật ngày hôm nay</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {technicians.map((tech) => {
                const activeCount = tickets.filter(
                  (t) => t.assignedTechnicianId === tech.id && t.status !== 'closed'
                ).length;
                const completedCount = tickets.filter(
                  (t) => t.assignedTechnicianId === tech.id && (t.status === 'resolved' || t.status === 'closed')
                ).length;

                return (
                  <div
                    key={tech.id}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between space-x-3"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={tech.avatar}
                        alt={tech.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-300"
                      />
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{tech.name}</div>
                        <div className="text-xs text-slate-500">{tech.roleTitle}</div>
                        <div className="text-xs text-blue-600 font-semibold">{tech.phone}</div>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="text-xs">
                        <span className="text-slate-500">Đang xử lý: </span>
                        <strong className="text-amber-700 font-bold text-sm">{activeCount} ca</strong>
                      </div>
                      <div className="text-xs">
                        <span className="text-slate-500">Đã xong: </span>
                        <strong className="text-emerald-700 font-bold">{completedCount} ca</strong>
                      </div>
                      <span className="inline-block text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full font-bold">
                        Sẵn sàng nhận thêm
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tickets Awaiting Assignment Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Phiếu Mới Cần Phân Công Kỹ Thuật Viên ({pendingTickets.length})
                </h2>
              </div>
              <span className="text-xs text-slate-500">Chọn KTV phụ trách trực tiếp</span>
            </div>

            {pendingTickets.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Không có phiếu nào đang chờ phân công. Tất cả các yêu cầu đã được giao người xử lý!
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTickets.map((t) => (
                  <div
                    key={t.id}
                    className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                          {t.code}
                        </span>
                        <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                          {t.urgency === 'critical' ? 'Khẩn cấp' : 'Bình thường'}
                        </span>
                        <span className="text-xs text-slate-500">{t.createdAt}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{t.title}</h4>
                      <div className="text-xs text-slate-600">
                        Địa điểm: <strong>{t.building} - {t.room}</strong> • Người yêu cầu: {t.requesterName} (
                        {t.requesterPhone})
                      </div>
                    </div>

                    {/* Assignment Dropdown */}
                    <div className="flex items-center space-x-2 w-full md:w-auto">
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) {
                            assignTicket(t.id, e.target.value);
                          }
                        }}
                        className="text-xs border border-purple-300 rounded-lg p-2 bg-white font-semibold text-purple-900 flex-1 md:flex-initial"
                      >
                        <option value="" disabled>
                          -- Chỉ định Kỹ thuật viên --
                        </option>
                        {technicians.map((tech) => (
                          <option key={tech.id} value={tech.id}>
                            {tech.name} ({tech.phone})
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => setSelectedTicket(t)}
                        className="px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-900"
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: User Management */}
      {adminSubTab === 'users' && <UserManagerView />}

      {/* Sub-Tab 3: Room Management */}
      {adminSubTab === 'rooms' && <RoomManagerView />}

      {/* Sub-Tab 4: Device Management */}
      {adminSubTab === 'devices' && <DeviceManagerView />}
    </div>
  );
};
