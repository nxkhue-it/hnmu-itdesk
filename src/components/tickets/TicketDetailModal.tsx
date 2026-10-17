import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Ticket, TicketStatus, UserRole } from '../../types';
import {
  X,
  MapPin,
  Laptop,
  Phone,
  Mail,
  User,
  Clock,
  Shield,
  Send,
  Star,
  CheckCircle,
  Wrench,
  AlertCircle,
  CheckCheck,
  UserPlus,
  Package,
} from 'lucide-react';

export const TicketDetailModal: React.FC = () => {
  const {
    selectedTicket,
    setSelectedTicket,
    currentUser,
    users,
    updateTicketStatus,
    assignTicket,
    addTicketComment,
    rateTicket,
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingComment, setRatingComment] = useState('Đội ngũ kỹ thuật hỗ trợ rất nhanh và nhiệt tình!');
  const [newPartName, setNewPartName] = useState('');
  const [technicianNote, setTechnicianNote] = useState('');

  if (!selectedTicket) return null;

  const ticket = selectedTicket;
  const isTechnician = currentUser?.role === 'technician';
  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';
  const isRequester = currentUser?.id === ticket.requesterId;

  // Technicians available in the system
  const techniciansList = users.filter((u) => u.role === 'technician');

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
        return { label: 'Đã nghiệm thu & đóng', bg: 'bg-slate-100 text-slate-800 border-slate-300' };
      default:
        return { label: status, bg: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return { label: '🚨 Khẩn cấp (Giảng đường)', color: 'text-red-700 bg-red-50 border-red-200' };
      case 'high':
        return { label: '⚠️ Ưu tiên cao', color: 'text-orange-700 bg-orange-50 border-orange-200' };
      case 'normal':
        return { label: '⏱️ Bình thường', color: 'text-blue-700 bg-blue-50 border-blue-200' };
      default:
        return { label: 'Thấp', color: 'text-slate-700 bg-slate-50 border-slate-200' };
    }
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addTicketComment(ticket.id, commentText, isInternalComment);
    setCommentText('');
  };

  const handleAddPart = () => {
    if (!newPartName.trim()) return;
    const parts = [...(ticket.replacementParts || []), newPartName.trim()];
    updateTicketStatus(ticket.id, ticket.status, `Đã bổ sung vật tư/linh kiện thay thế: ${newPartName}`, parts);
    setNewPartName('');
  };

  const handleRateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rateTicket(ticket.id, ratingScore, ratingComment);
  };

  const statusBadge = getStatusBadge(ticket.status);
  const urgencyBadge = getUrgencyBadge(ticket.urgency);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs px-2.5 py-1 bg-blue-600 text-white font-bold rounded-md">
              {ticket.code}
            </span>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${statusBadge.bg}`}>
                {statusBadge.label}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${urgencyBadge.color}`}>
                {urgencyBadge.label}
              </span>
            </div>
          </div>
          <button
            onClick={() => setSelectedTicket(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title & Core Location */}
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900 mb-2">{ticket.title}</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
              <span className="flex items-center space-x-1.5 font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {ticket.building} • {ticket.room}
                </span>
              </span>
              <span>Cơ sở: {ticket.campus}</span>
              {ticket.deviceCode && (
                <span className="flex items-center space-x-1 font-mono bg-slate-100 px-2 py-1 rounded">
                  <Laptop className="w-3.5 h-3.5 text-slate-500" />
                  <span>Mã thiết bị: {ticket.deviceCode}</span>
                </span>
              )}
              <span className="flex items-center space-x-1 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Tạo lúc: {ticket.createdAt}</span>
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="text-xs font-bold uppercase text-slate-400 mb-1.5">Mô tả hiện tượng sự cố:</div>
            <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">{ticket.description}</p>
          </div>

          {/* Two-Column Requester & Assigned Tech Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Requester Box */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Người đề nghị hỗ trợ</span>
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                  {ticket.requesterRoleTitle.split('-')[0]}
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                  {ticket.requesterName.substring(0, 2)}
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-slate-900 text-sm">{ticket.requesterName}</div>
                  <div className="text-slate-500">{ticket.requesterDepartment}</div>
                  <div className="flex items-center space-x-3 pt-1">
                    <a
                      href={`tel:${ticket.requesterPhone}`}
                      className="text-blue-600 hover:underline flex items-center space-x-1 font-semibold"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{ticket.requesterPhone}</span>
                    </a>
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Mail className="w-3 h-3" />
                      <span>{ticket.requesterEmail}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Technician Box */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 flex items-center space-x-1.5">
                  <Wrench className="w-3.5 h-3.5 text-amber-600" />
                  <span>Kỹ thuật viên phụ trách</span>
                </span>
                {ticket.assignedTechnicianName && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                    Đã chỉ định
                  </span>
                )}
              </div>

              {ticket.assignedTechnicianName ? (
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">
                    {ticket.assignedTechnicianName.substring(0, 2)}
                  </div>
                  <div className="text-xs space-y-1 flex-1">
                    <div className="font-bold text-slate-900 text-sm">{ticket.assignedTechnicianName}</div>
                    <div className="text-slate-500">Trung tâm CNTT & Thư viện</div>
                    <div className="pt-1">
                      <a
                        href={`tel:${ticket.assignedTechnicianPhone}`}
                        className="text-amber-700 hover:underline flex items-center space-x-1 font-semibold"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Hotline/SĐT KTV: {ticket.assignedTechnicianPhone || '0904.567.890'}</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2 text-xs text-slate-500 space-y-2">
                  <p className="text-amber-700 font-medium">Chưa có kỹ thuật viên nhận phiếu này.</p>
                  {(isAdmin || isTechnician) && (
                    <div className="flex items-center justify-center space-x-2">
                      {isTechnician && (
                        <button
                          onClick={() => {
                            if (currentUser) {
                              assignTicket(ticket.id, currentUser.id);
                            }
                          }}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                        >
                          Tôi nhận xử lý ca này
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Admin can reassign / assign technician */}
              {isAdmin && (
                <div className="mt-3 pt-2 border-t border-slate-100">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Chỉ định / Đổi kỹ thuật viên:
                  </label>
                  <div className="flex space-x-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          assignTicket(ticket.id, e.target.value);
                        }
                      }}
                      value={ticket.assignedTechnicianId || ''}
                      className="text-xs border border-slate-300 rounded-md p-1.5 bg-white flex-1"
                    >
                      <option value="">-- Chọn kỹ thuật viên --</option>
                      {techniciansList.map((tech) => (
                        <option key={tech.id} value={tech.id}>
                          {tech.name} ({tech.phone})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Replacement Parts Used (if any) */}
          {ticket.replacementParts && ticket.replacementParts.length > 0 && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
              <div className="text-xs font-bold text-emerald-800 mb-2 flex items-center space-x-1.5">
                <Package className="w-4 h-4 text-emerald-700" />
                <span>Vật tư / Linh kiện đã thay thế, bổ sung:</span>
              </div>
              <ul className="list-disc list-inside text-xs text-slate-800 space-y-1">
                {ticket.replacementParts.map((part, idx) => (
                  <li key={idx} className="font-medium">
                    {part}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technician Action Panel (Only if user is Technician or Admin) */}
          {(isTechnician || isAdmin) && ticket.status !== 'closed' && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center space-x-1.5">
                  <Wrench className="w-4 h-4 text-amber-700" />
                  <span>Bảng điều khiển tác vụ Kỹ thuật viên</span>
                </span>
                <span className="text-[11px] text-amber-700">Quyền: {currentUser?.roleTitle}</span>
              </div>

              {/* Status transition buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {ticket.status === 'pending' && (
                  <button
                    onClick={() => {
                      if (currentUser) {
                        assignTicket(ticket.id, currentUser.id);
                        updateTicketStatus(ticket.id, 'in_progress', 'Kỹ thuật viên đã tiếp nhận và đang tiến hành xử lý.');
                      }
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs"
                  >
                    Tiếp nhận & Bắt đầu xử lý
                  </button>
                )}

                {ticket.status !== 'in_progress' && ticket.status !== 'resolved' && (
                  <button
                    onClick={() => updateTicketStatus(ticket.id, 'in_progress', 'Đang thực hiện kiểm tra và khắc phục.')}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg"
                  >
                    Chuyển sang Đang xử lý
                  </button>
                )}

                {ticket.status !== 'waiting_parts' && ticket.status !== 'resolved' && (
                  <button
                    onClick={() =>
                      updateTicketStatus(
                        ticket.id,
                        'waiting_parts',
                        'Tạm dừng chờ xuất kho linh kiện thay thế hoặc chờ phản hồi từ người dùng.'
                      )
                    }
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded-lg"
                  >
                    Chờ linh kiện / Chờ phản hồi
                  </button>
                )}

                {ticket.status !== 'resolved' && (
                  <button
                    onClick={() =>
                      updateTicketStatus(
                        ticket.id,
                        'resolved',
                        'Sự cố đã được khắc phục hoàn tất và nghiệm thu chạy thử bình thường.'
                      )
                    }
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Xác nhận: Đã xử lý xong (Hoàn tất)</span>
                  </button>
                )}
              </div>

              {/* Add replacement part */}
              <div className="pt-2 border-t border-amber-200/60 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Ghi nhận linh kiện đã thay (VD: Dây cáp HDMI 5m, Bóng đèn máy chiếu...)"
                  value={newPartName}
                  onChange={(e) => setNewPartName(e.target.value)}
                  className="text-xs border border-amber-300 rounded-md p-1.5 bg-white flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddPart}
                  className="px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md hover:bg-slate-900"
                >
                  Thêm vật tư
                </button>
              </div>
            </div>
          )}

          {/* Requester Rating Panel (If resolved or user is requester) */}
          {ticket.status === 'resolved' && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
                <CheckCheck className="w-5 h-5 text-emerald-600" />
                <span>Nghiệm thu & Đánh giá dịch vụ hỗ trợ kỹ thuật</span>
              </div>
              <p className="text-xs text-emerald-800">
                Kỹ thuật viên đã báo hoàn tất xử lý. Thầy cô/Anh chị vui lòng đánh giá mức độ hài lòng để hoàn tất đóng phiếu:
              </p>

              <form onSubmit={handleRateSubmit} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-slate-700">Điểm đánh giá:</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingScore(star)}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= ratingScore ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-600">({ratingScore} sao)</span>
                </div>

                <textarea
                  rows={2}
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Nhận xét chất lượng hỗ trợ, thái độ kỹ thuật viên..."
                  className="w-full text-xs border border-emerald-300 rounded-lg p-2 bg-white focus:outline-hidden"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm"
                  >
                    Nghiệm thu đóng phiếu & Gửi đánh giá
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Show rating if already closed */}
          {ticket.rating && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start space-x-3">
              <div className="flex text-amber-400 pt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < ticket.rating!.score ? 'fill-amber-400' : 'text-slate-200'}`}
                  />
                ))}
              </div>
              <div className="text-xs space-y-0.5">
                <div className="font-bold text-slate-800">
                  Người dùng đánh giá {ticket.rating.score}/5 sao ({ticket.rating.ratedAt})
                </div>
                <div className="text-slate-600 italic">"{ticket.rating.feedback}"</div>
              </div>
            </div>
          )}

          {/* Activity Timeline & Conversation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Nhật ký xử lý & Trao đổi ({ticket.activities.length})
            </h4>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
              {ticket.activities.map((act) => {
                const isTechOrAdmin = act.authorRole === 'technician' || act.authorRole === 'admin';
                return (
                  <div
                    key={act.id}
                    className={`p-3 rounded-xl text-xs space-y-1 ${
                      act.isInternal
                        ? 'bg-amber-50 border border-amber-200 text-amber-900'
                        : isTechOrAdmin
                        ? 'bg-blue-50/60 border border-blue-100 text-slate-800'
                        : 'bg-slate-100 border border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{act.authorName}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] ${
                            isTechOrAdmin ? 'bg-blue-200 text-blue-900' : 'bg-slate-200 text-slate-800'
                          }`}
                        >
                          {act.authorRole}
                        </span>
                        {act.isInternal && (
                          <span className="bg-amber-200 text-amber-900 text-[10px] px-1 rounded font-semibold">
                            Ghi chú nội bộ KTV
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400">{act.timestamp}</span>
                    </div>
                    <div className="whitespace-pre-line text-slate-700 leading-relaxed pl-1">{act.content}</div>
                  </div>
                );
              })}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleSendComment} className="pt-2 flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Gửi phản hồi, ghi chú hoặc trao đổi trực tiếp với kỹ thuật viên..."
                  className="flex-1 text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi</span>
                </button>
              </div>

              {(isTechnician || isAdmin) && (
                <label className="flex items-center space-x-2 text-[11px] text-amber-800 cursor-pointer self-start">
                  <input
                    type="checkbox"
                    checked={isInternalComment}
                    onChange={(e) => setIsInternalComment(e.target.checked)}
                    className="rounded text-amber-600"
                  />
                  <span>Chỉ lưu dưới dạng ghi chú nội bộ (Sinh viên & Giảng viên không thấy)</span>
                </label>
              )}
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <span>Hệ thống quản lý dịch vụ ITIL & SLA Trường Đại học</span>
          <button
            onClick={() => setSelectedTicket(null)}
            className="px-4 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
