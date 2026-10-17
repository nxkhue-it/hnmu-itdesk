import React from 'react';
import { useApp } from '../../context/AppContext';
import { PlusCircle, Clock, CheckCircle2, AlertTriangle, FileText, ChevronRight, Star } from 'lucide-react';

export const RequesterDashboard: React.FC = () => {
  const { currentUser, tickets, setSelectedTicket, setIsCreateModalOpen } = useApp();

  if (!currentUser) return null;

  const myTickets = tickets.filter((t) => t.requesterId === currentUser.id);
  const activeTickets = myTickets.filter((t) => t.status !== 'closed');
  const closedTickets = myTickets.filter((t) => t.status === 'closed');

  return (
    <div className="space-y-6 pb-12">
      {/* User Welcome Card */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30 shadow-md"
          />
          <div className="space-y-1">
            <span className="text-xs bg-white/20 text-blue-100 px-2.5 py-0.5 rounded-full font-medium">
              Cổng dịch vụ Cán bộ - Giảng viên & Sinh viên
            </span>
            <h1 className="text-xl sm:text-2xl font-bold">{currentUser.name}</h1>
            <p className="text-xs text-blue-100">
              {currentUser.roleTitle} • {currentUser.department}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-white text-blue-800 hover:bg-blue-50 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg transition flex items-center space-x-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-blue-600" />
          <span>Gửi yêu cầu hỗ trợ mới</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase">Tổng số yêu cầu đã gửi</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{myTickets.length}</div>
          <div className="text-xs text-slate-500 mt-1">Lịch sử từ đầu năm học</div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-bold text-amber-800 uppercase">Đang được xử lý</div>
          <div className="text-3xl font-extrabold text-amber-900 mt-2">{activeTickets.length}</div>
          <div className="text-xs text-amber-700 mt-1">Kỹ thuật viên đang phụ trách</div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-bold text-emerald-800 uppercase">Đã hoàn thành & Nghiệm thu</div>
          <div className="text-3xl font-extrabold text-emerald-900 mt-2">{closedTickets.length}</div>
          <div className="text-xs text-emerald-700 mt-1">Sự cố đã khắc phục thành công</div>
        </div>
      </div>

      {/* Active Tickets List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Yêu cầu đang tiến hành ({activeTickets.length})
          </h2>
          <span className="text-xs text-slate-500">Nhấp vào để xem chi tiết & trao đổi với kỹ thuật viên</span>
        </div>

        {activeTickets.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Hiện không có yêu cầu nào đang chờ xử lý.</p>
            <p className="text-xs text-slate-400 mt-1">
              Khi gặp sự cố máy chiếu, mạng Wi-Fi hoặc phần mềm, hãy gửi yêu cầu để được hỗ trợ kịp thời.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className="group cursor-pointer bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {t.code}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      {t.status === 'in_progress' ? 'Đang xử lý' : t.status === 'resolved' ? 'Đã sửa xong (Chờ nghiệm thu)' : 'Chờ tiếp nhận'}
                    </span>
                    <span className="text-xs text-slate-400">{t.createdAt}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition">
                    {t.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Địa điểm: <strong className="text-slate-700">{t.building} - {t.room}</strong>
                    {t.assignedTechnicianName && ` • Kỹ thuật viên: ${t.assignedTechnicianName}`}
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition self-end sm:self-auto">
                  <span>Theo dõi tiến độ</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed History List */}
      {closedTickets.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Lịch sử yêu cầu đã giải quyết</h2>
          <div className="space-y-3">
            {closedTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className="cursor-pointer bg-slate-50 hover:bg-white border border-slate-200 rounded-2xl p-4 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-mono text-slate-500">{t.code}</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                      Đã nghiệm thu
                    </span>
                    <span className="text-slate-400">{t.createdAt}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-800">{t.title}</div>
                  <div className="text-xs text-slate-500">
                    Phòng: {t.room} • KTV: {t.assignedTechnicianName || 'Trung tâm CNTT'}
                  </div>
                </div>

                {t.rating && (
                  <div className="flex items-center space-x-1 text-xs text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold">{t.rating.score}/5 sao</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
