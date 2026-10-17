import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Ticket, TicketStatus, TicketCategory } from '../../types';
import {
  Search,
  Filter,
  PlusCircle,
  Clock,
  MapPin,
  Laptop,
  CheckCircle,
  AlertCircle,
  User,
  Wrench,
  ChevronRight,
  Flame,
  Star,
} from 'lucide-react';

export const TicketsView: React.FC = () => {
  const { tickets, setSelectedTicket, setIsCreateModalOpen, setIsLoginModalOpen, currentUser } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      !search.trim() ||
      t.code.toLowerCase().includes(search.toLowerCase()) ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.room.toLowerCase().includes(search.toLowerCase()) ||
      t.requesterName.toLowerCase().includes(search.toLowerCase()) ||
      (t.deviceCode && t.deviceCode.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    const matchesUrgency = urgencyFilter === 'all' || t.urgency === urgencyFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesUrgency;
  });

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'pending':
        return { label: 'Chờ tiếp nhận', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'assigned':
        return { label: 'Đã phân công', bg: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'in_progress':
        return { label: 'Đang xử lý', bg: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
      case 'waiting_parts':
        return { label: 'Chờ linh kiện/phản hồi', bg: 'bg-orange-100 text-orange-800 border-orange-300' };
      case 'resolved':
        return { label: 'Đã hoàn thành', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'closed':
        return { label: 'Đã đóng (Xong)', bg: 'bg-slate-100 text-slate-800 border-slate-300' };
      default:
        return { label: status, bg: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return { label: '🚨 Khẩn cấp', color: 'bg-red-100 text-red-800 border-red-300' };
      case 'high':
        return { label: '⚠️ Ưu tiên cao', color: 'bg-orange-100 text-orange-800 border-orange-300' };
      case 'normal':
        return { label: 'Bình thường', color: 'bg-slate-100 text-slate-700 border-slate-300' };
      default:
        return { label: 'Thấp', color: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* View Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="text-xs text-blue-200 uppercase font-semibold tracking-wider">
            Trung tâm Điều phối Sự cố CNTT
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Quầy Dịch Vụ & Tiếp Nhận Hỗ Trợ (Service Desk)</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Theo dõi toàn bộ các yêu cầu báo hỏng máy chiếu giảng đường, mạng LAN, tài khoản và đề nghị mượn thiết bị.
          </p>
        </div>

        <button
          onClick={() => {
            if (!currentUser) {
              setIsLoginModalOpen(true);
            } else {
              setIsCreateModalOpen(true);
            }
          }}
          className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg shadow-red-600/30 transition flex items-center space-x-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tạo phiếu báo hỏng mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo mã phiếu (TK-2026...), phòng học (B2-304), người yêu cầu, mã thiết bị..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
            {/* Status select */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded-lg p-2 bg-white text-xs text-slate-700 font-medium"
            >
              <option value="all">Tất cả trạng thái ({tickets.length})</option>
              <option value="pending">Chờ tiếp nhận</option>
              <option value="assigned">Đã phân công</option>
              <option value="in_progress">Đang xử lý</option>
              <option value="waiting_parts">Chờ linh kiện</option>
              <option value="resolved">Đã hoàn thành</option>
              <option value="closed">Đã đóng nghiệm thu</option>
            </select>

            {/* Category select */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-slate-300 rounded-lg p-2 bg-white text-xs text-slate-700"
            >
              <option value="all">Tất cả phân loại</option>
              <option value="classroom_av">Máy chiếu & Âm thanh</option>
              <option value="network">Mạng LAN & Wi-Fi</option>
              <option value="hardware">Phần cứng & Máy in</option>
              <option value="software">Phần mềm & LMS</option>
              <option value="account_permission">Tài khoản & Phân quyền</option>
              <option value="equipment_loan">Mượn thiết bị</option>
            </select>

            {/* Urgency select */}
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="border border-slate-300 rounded-lg p-2 bg-white text-xs text-slate-700"
            >
              <option value="all">Tất cả mức ưu tiên</option>
              <option value="critical">🚨 Khẩn cấp</option>
              <option value="high">⚠️ Ưu tiên cao</option>
              <option value="normal">Bình thường</option>
              <option value="low">Thấp</option>
            </select>
          </div>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto text-xs pt-1 border-t border-slate-100">
          <span className="text-slate-400 font-medium">Lọc nhanh:</span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg ${
              statusFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Tất cả ({tickets.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-2.5 py-1 rounded-lg ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            Chờ tiếp nhận ({tickets.filter((t) => t.status === 'pending').length})
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-2.5 py-1 rounded-lg ${
              statusFilter === 'in_progress'
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
            }`}
          >
            Đang xử lý ({tickets.filter((t) => t.status === 'in_progress').length})
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className={`px-2.5 py-1 rounded-lg ${
              statusFilter === 'resolved'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            Đã hoàn thành ({tickets.filter((t) => t.status === 'resolved').length})
          </button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
            <Clock className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-sm">Không tìm thấy phiếu hỗ trợ nào phù hợp với bộ lọc.</p>
            <p className="text-xs text-slate-400 mt-1">Hãy thử xóa bộ lọc hoặc tìm kiếm với từ khóa khác.</p>
          </div>
        ) : (
          filteredTickets.map((t) => {
            const statusBadge = getStatusBadge(t.status);
            const urgencyBadge = getUrgencyBadge(t.urgency);

            return (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className="group cursor-pointer bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Left block: Code, Title, Location, Desc preview */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                      {t.code}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusBadge.bg}`}>
                      {statusBadge.label}
                    </span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${urgencyBadge.color}`}>
                      {urgencyBadge.label}
                    </span>
                    <span className="text-[11px] text-slate-400">{t.createdAt}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
                    {t.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span className="flex items-center space-x-1 font-semibold text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>
                        {t.building} • {t.room}
                      </span>
                    </span>

                    {t.deviceCode && (
                      <span className="flex items-center space-x-1 font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                        <Laptop className="w-3 h-3" />
                        <span>{t.deviceCode}</span>
                      </span>
                    )}

                    <span className="flex items-center space-x-1 text-slate-500">
                      <User className="w-3.5 h-3.5" />
                      <span>
                        {t.requesterName} ({t.requesterDepartment})
                      </span>
                    </span>
                  </div>
                </div>

                {/* Right block: Assigned Tech, Rating, Action button */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto shrink-0 gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                  <div className="text-right">
                    {t.assignedTechnicianName ? (
                      <div className="flex items-center space-x-1.5 text-xs text-slate-700">
                        <Wrench className="w-3.5 h-3.5 text-amber-600" />
                        <span className="font-semibold">{t.assignedTechnicianName}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Chưa phân công KTV
                      </span>
                    )}
                  </div>

                  {t.rating && (
                    <div className="flex items-center space-x-1 text-amber-500 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="font-bold">{t.rating.score}/5 sao</span>
                    </div>
                  )}

                  <div className="flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition">
                    <span>Xem tiến độ & xử lý</span>
                    <ChevronRight className="w-4 h-4 ml-0.5" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
