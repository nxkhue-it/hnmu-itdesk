import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CAMPUS_LOCATIONS } from '../../data/mockData';
import { TicketCategory, TicketUrgency } from '../../types';
import {
  X,
  AlertTriangle,
  Clock,
  MapPin,
  Laptop,
  CheckCircle2,
  FileText,
  User,
  ShieldAlert,
  LogIn,
} from 'lucide-react';

export const CreateTicketModal: React.FC = () => {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    currentUser,
    createTicket,
    setActiveTab,
    setIsLoginModalOpen,
  } = useApp();

  const [category, setCategory] = useState<TicketCategory>('classroom_av');
  const [urgency, setUrgency] = useState<TicketUrgency>('critical');
  const [campus, setCampus] = useState(CAMPUS_LOCATIONS[0].campus);
  const [building, setBuilding] = useState(CAMPUS_LOCATIONS[0].buildings[0].name);
  const [room, setRoom] = useState(CAMPUS_LOCATIONS[0].buildings[0].rooms[4] || 'B2-304');
  const [deviceCode, setDeviceCode] = useState('MC-B2-304');
  const [title, setTitle] = useState('Máy chiếu không nhận tín hiệu từ laptop');
  const [description, setDescription] = useState(
    'Cắm dây HDMI vào laptop nhưng máy chiếu báo "No Signal". Đèn nguồn máy chiếu nhấp nháy cam. Đang có lớp học ca 2 cần chiếu bài giảng gấp.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCreateModalOpen) return null;

  const currentCampusObj = CAMPUS_LOCATIONS.find((c) => c.campus === campus) || CAMPUS_LOCATIONS[0];
  const currentBuildingObj =
    currentCampusObj.buildings.find((b) => b.name === building) || currentCampusObj.buildings[0];

  const handleCampusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCampus = e.target.value;
    setCampus(newCampus);
    const cObj = CAMPUS_LOCATIONS.find((c) => c.campus === newCampus);
    if (cObj && cObj.buildings[0]) {
      setBuilding(cObj.buildings[0].name);
      setRoom(cObj.buildings[0].rooms[0] || '');
    }
  };

  const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBuilding = e.target.value;
    setBuilding(newBuilding);
    const bObj = currentCampusObj.buildings.find((b) => b.name === newBuilding);
    if (bObj && bObj.rooms[0]) {
      setRoom(bObj.rooms[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      createTicket({
        title,
        description,
        category,
        urgency,
        campus,
        building,
        room,
        deviceCode,
      });
      setIsSubmitting(false);
      setIsCreateModalOpen(false);
      setActiveTab('tickets');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Gửi Phiếu Yêu Cầu Hỗ Trợ Kỹ Thuật CNTT</h3>
              <p className="text-xs text-blue-100">
                Bộ phận Kỹ thuật Trung tâm CNTT tiếp nhận và điều phối xử lý theo SLA
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Check if user logged in */}
        {!currentUser ? (
          <div className="p-8 text-center space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-800">Yêu cầu đăng nhập xác định danh tính</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Để đảm bảo tính xác thực thông tin sự cố, toàn bộ yêu cầu hỗ trợ và báo hỏng thiết bị CNTT cần được gửi từ tài khoản định danh của cán bộ, giảng viên hoặc sinh viên Nhà trường.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsLoginModalOpen(true);
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20 transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập Tài Khoản Trường Để Gửi Phiếu</span>
              </button>
            </div>
            <div className="text-[11px] text-slate-400">
              Cần hỗ trợ khẩn cấp tại phòng học? Vui lòng liên hệ Hotline: <strong>090.357.8888</strong>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Requester Identity Banner */}
            <div className="bg-blue-50/70 border border-blue-200/60 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-blue-200"
                />
                <div>
                  <div className="text-xs text-blue-600 font-semibold flex items-center space-x-1">
                    <User className="w-3.5 h-3.5" />
                    <span>Người gửi yêu cầu:</span>
                  </div>
                  <div className="text-sm font-bold text-slate-800">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {currentUser.roleTitle} • SĐT: <strong className="text-slate-700">{currentUser.phone}</strong>
                  </div>
                </div>
              </div>
              <span className="text-[11px] bg-white border border-blue-200 text-blue-700 px-2 py-1 rounded-md font-medium">
                Xác thực định danh
              </span>
            </div>

            {/* Category & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Phân loại sự cố / Yêu cầu <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TicketCategory)}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="classroom_av">Máy chiếu, Âm thanh & Micro giảng đường</option>
                  <option value="hardware">Báo hỏng máy tính PC, Máy in, Phần cứng</option>
                  <option value="network">Sự cố Mạng LAN / Wi-Fi trường</option>
                  <option value="software">Hỗ trợ phần mềm (LMS, QLĐT, Office 365, SEB)</option>
                  <option value="account_permission">Cấp mới / Đổi mật khẩu tài khoản trường</option>
                  <option value="equipment_loan">Đăng ký mượn thiết bị giảng dạy / hội thảo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mức độ khẩn cấp (SLA tiếp nhận) <span className="text-red-500">*</span>
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as TicketUrgency)}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                >
                  <option value="critical">🚨 Khẩn cấp - Giảng đường đang học (Xử lý trong 15p)</option>
                  <option value="high">⚠️ Ưu tiên cao - Ảnh hưởng phòng làm việc (Xử lý trong 60p)</option>
                  <option value="normal">⏱️ Bình thường (Xử lý trong 4 giờ làm việc)</option>
                  <option value="low">📝 Thấp - Đề xuất / Mượn thiết bị trước (Trong 24h)</option>
                </select>
              </div>
            </div>

            {/* Location selector */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Vị trí cụ thể cần hỗ trợ kỹ thuật:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Cơ sở:</label>
                  <select
                    value={campus}
                    onChange={handleCampusChange}
                    className="w-full text-xs border border-slate-300 rounded-md p-2 bg-white"
                  >
                    {CAMPUS_LOCATIONS.map((c) => (
                      <option key={c.campus} value={c.campus}>
                        {c.campus}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Khu nhà / Giảng đường:</label>
                  <select
                    value={building}
                    onChange={handleBuildingChange}
                    className="w-full text-xs border border-slate-300 rounded-md p-2 bg-white"
                  >
                    {currentCampusObj.buildings.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Phòng học / Văn phòng:</label>
                  <select
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-md p-2 bg-white font-semibold text-blue-800"
                  >
                    {currentBuildingObj.rooms.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1 flex items-center justify-between">
                  <span>Mã tài sản / Số hiệu thiết bị (dán trên máy chiếu, case PC - nếu có):</span>
                  <span className="text-slate-400 font-normal">Không bắt buộc</span>
                </label>
                <div className="relative">
                  <Laptop className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={deviceCode}
                    onChange={(e) => setDeviceCode(e.target.value)}
                    placeholder="VD: MC-B2-304 hoặc PC-LAB03-12"
                    className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-md bg-white uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu đề tóm tắt sự cố <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Máy chiếu phòng B2-304 không lên nguồn..."
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mô tả chi tiết hiện tượng / Mã lỗi / Đề xuất hỗ trợ <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả cụ thể biểu hiện: đèn tín hiệu màu gì, đã thử cắm lại cáp hay chưa, số lượng người bị ảnh hưởng..."
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* SLA Commitment notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start space-x-3 text-xs text-amber-900">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Cam kết thời gian phản hồi kỹ thuật:</span> Với sự cố mức{' '}
                <strong className="underline uppercase">{urgency}</strong>, kỹ thuật viên trực ban sẽ liên hệ hoặc có mặt tại phòng trong vòng{' '}
                <strong className="text-red-700">
                  {urgency === 'critical' ? '15 phút' : urgency === 'high' ? '60 phút' : '4 giờ làm việc'}
                </strong>.
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 font-medium rounded-lg hover:bg-slate-100 transition"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm rounded-lg shadow-md shadow-blue-500/20 transition flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <span>Đang gửi phiếu...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Xác nhận & Gửi yêu cầu</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
