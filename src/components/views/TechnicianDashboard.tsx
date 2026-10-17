import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Ticket } from '../../types';
import {
  Wrench,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  MapPin,
  ChevronRight,
  Flame,
  Phone,
  Package,
  Layers,
} from 'lucide-react';

export const TechnicianDashboard: React.FC = () => {
  const { currentUser, tickets, setSelectedTicket, updateTicketStatus, assignTicket } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'my_tasks' | 'unassigned' | 'completed'>('my_tasks');

  if (!currentUser) return null;

  const myAssignedTickets = tickets.filter(
    (t) => t.assignedTechnicianId === currentUser.id && t.status !== 'closed'
  );

  const unassignedTickets = tickets.filter((t) => !t.assignedTechnicianId && t.status !== 'closed');

  const myCompletedTickets = tickets.filter(
    (t) => t.assignedTechnicianId === currentUser.id && (t.status === 'resolved' || t.status === 'closed')
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Technician Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/40 shadow-md"
          />
          <div className="space-y-1">
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full font-medium">
              Bàn làm việc Kỹ thuật viên CNTT
            </span>
            <h1 className="text-xl sm:text-2xl font-bold">{currentUser.name}</h1>
            <p className="text-xs text-slate-300">
              {currentUser.roleTitle} • Trực ban kỹ thuật khu vực Giảng đường
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-white/10 px-4 py-2.5 rounded-xl text-center">
            <div className="text-amber-300 font-bold text-lg">{myAssignedTickets.length}</div>
            <div className="text-slate-300 text-[11px]">Đang phụ trách</div>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-xl text-center">
            <div className="text-emerald-300 font-bold text-lg">100%</div>
            <div className="text-slate-300 text-[11px]">Đạt chuẩn SLA</div>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-xl text-center">
            <div className="text-blue-300 font-bold text-lg">4.9★</div>
            <div className="text-slate-300 text-[11px]">Đánh giá CSAT</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTabSub('my_tasks')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 ${
            activeTabSub === 'my_tasks'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Ca của tôi đang xử lý ({myAssignedTickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTabSub('unassigned')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 ${
            activeTabSub === 'unassigned'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Hàng chờ chưa có ai nhận ({unassignedTickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTabSub('completed')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 ${
            activeTabSub === 'completed'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>Ca đã hoàn thành ({myCompletedTickets.length})</span>
        </button>
      </div>

      {/* Content based on sub-tab */}
      {activeTabSub === 'my_tasks' && (
        <div className="space-y-4">
          {myAssignedTickets.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-slate-700">Tuyệt vời! Bạn không còn ca nào tồn đọng cần xử lý.</p>
              <p className="text-xs text-slate-400 mt-1">
                Hãy kiểm tra mục "Hàng chờ chưa có ai nhận" để tiếp nhận thêm các ca hỗ trợ mới.
              </p>
            </div>
          ) : (
            myAssignedTickets.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-amber-200 rounded-2xl p-5 shadow-xs space-y-4 hover:border-amber-400 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded">
                      {t.code}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        t.urgency === 'critical' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {t.urgency === 'critical' ? '🚨 Khẩn cấp giảng đường' : 'Ưu tiên bình thường'}
                    </span>
                    <span className="text-xs text-slate-400">{t.createdAt}</span>
                  </div>

                  <div className="text-xs text-slate-600 font-semibold flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Cam kết SLA: Xử lý trong {t.slaDeadlineMinutes} phút</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 space-y-2">
                    <h3 className="text-base font-bold text-slate-900">{t.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{t.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700 pt-1">
                      <span className="flex items-center space-x-1 font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>
                          {t.building} • {t.room}
                        </span>
                      </span>
                      {t.deviceCode && <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">Mã: {t.deviceCode}</span>}
                      <span className="flex items-center space-x-1 text-slate-600">
                        <User className="w-3.5 h-3.5" />
                        <span>{t.requesterName}</span>
                      </span>
                      <a
                        href={`tel:${t.requesterPhone}`}
                        className="text-blue-600 hover:underline flex items-center space-x-1 font-bold"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{t.requesterPhone}</span>
                      </a>
                    </div>
                  </div>

                  {/* Quick Action Buttons for Technician */}
                  <div className="flex flex-col justify-center space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="text-[11px] font-bold uppercase text-slate-500">Thao tác nhanh KTV:</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() =>
                          updateTicketStatus(t.id, 'in_progress', 'KTV đang có mặt tại phòng kiểm tra thiết bị.')
                        }
                        className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold"
                      >
                        Đang sửa
                      </button>
                      <button
                        onClick={() =>
                          updateTicketStatus(
                            t.id,
                            'waiting_parts',
                            'Chờ lấy dây HDMI hoặc bóng đèn từ kho kỹ thuật.'
                          )
                        }
                        className="px-2.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs font-semibold"
                      >
                        Chờ linh kiện
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        updateTicketStatus(
                          t.id,
                          'resolved',
                          'Đã sửa chữa và kiểm tra vận hành thử ổn định. Bàn giao cho giáo viên.'
                        )
                      }
                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center justify-center space-x-1 shadow-xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Báo hoàn thành (Đã sửa xong)</span>
                    </button>

                    <button
                      onClick={() => setSelectedTicket(t)}
                      className="w-full py-1 text-xs text-slate-600 hover:text-slate-800 text-center underline"
                    >
                      Mở chi tiết đầy đủ & Chat
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Unassigned Tickets */}
      {activeTabSub === 'unassigned' && (
        <div className="space-y-4">
          {unassignedTickets.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">Tất cả các phiếu đều đã được phân công kỹ thuật viên.</p>
            </div>
          ) : (
            unassignedTickets.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-red-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                      {t.code}
                    </span>
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                      Chưa có KTV nhận
                    </span>
                    <span className="text-xs text-slate-400">{t.createdAt}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{t.title}</h3>
                  <div className="text-xs text-slate-600">
                    Phòng: <strong className="text-slate-800">{t.building} - {t.room}</strong> • Người yêu cầu: {t.requesterName} ({t.requesterPhone})
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  <button
                    onClick={() => setSelectedTicket(t)}
                    className="px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Xem trước
                  </button>
                  <button
                    onClick={() => {
                      assignTicket(t.id, currentUser.id);
                      updateTicketStatus(t.id, 'in_progress', `${currentUser.name} đã chủ động nhận xử lý ca này.`);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs rounded-lg shadow-sm"
                  >
                    Tôi nhận ca này ngay
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Completed Tickets */}
      {activeTabSub === 'completed' && (
        <div className="space-y-3">
          {myCompletedTickets.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTicket(t)}
              className="cursor-pointer bg-slate-50 hover:bg-white border border-slate-200 rounded-2xl p-4 transition flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-mono text-slate-500 font-bold">{t.code}</span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    {t.status === 'closed' ? 'Đã nghiệm thu' : 'Đã sửa xong'}
                  </span>
                  <span className="text-slate-400">{t.resolvedAt || t.updatedAt}</span>
                </div>
                <div className="text-sm font-semibold text-slate-800">{t.title}</div>
                <div className="text-xs text-slate-500">Phòng: {t.room} • Người gửi: {t.requesterName}</div>
              </div>

              <div className="text-right">
                {t.rating ? (
                  <div className="text-xs font-bold text-amber-500">
                    ★ {t.rating.score}/5 sao: "{t.rating.feedback}"
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">Chờ người dùng chấm sao</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
