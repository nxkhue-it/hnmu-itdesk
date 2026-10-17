import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Award,
  Clock,
  Printer,
  FileSpreadsheet,
  AlertOctagon,
  Building2,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  Users,
  Lightbulb,
} from 'lucide-react';

export const ManagerDashboard: React.FC = () => {
  const { currentUser, tickets } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const totalTickets = tickets.length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;
  const criticalCount = tickets.filter((t) => t.urgency === 'critical').length;

  return (
    <div className="space-y-6 pb-16 print:p-0 print:space-y-4">
      {/* Leadership Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:bg-white print:text-slate-900 print:border print:border-slate-300">
        <div className="flex items-center space-x-4">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-400/40 shadow-md print:hidden"
          />
          <div className="space-y-1">
            <span className="text-xs bg-rose-500/20 text-rose-300 border border-rose-400/30 px-2.5 py-0.5 rounded-full font-medium print:text-rose-700">
              Báo Cáo Điều Hành Dành Cho Lãnh Đạo Nhà Trường (Executive Overview)
            </span>
            <h1 className="text-xl sm:text-2xl font-bold">{currentUser?.name}</h1>
            <p className="text-xs text-slate-300 print:text-slate-600">
              {currentUser?.roleTitle} • Ban Giám hiệu Trường Đại học
            </p>
          </div>
        </div>

        {/* Export / Print Actions */}
        <div className="flex items-center space-x-2 text-xs print:hidden">
          <button
            onClick={handlePrint}
            className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center space-x-2"
          >
            <Printer className="w-4 h-4 text-rose-700" />
            <span>In Báo Cáo Tổng Hợp</span>
          </button>
        </div>
      </div>

      {/* High-Level Executive Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: SLA Compliance */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Tỷ lệ hoàn thành đúng SLA</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">96.5%</div>
          <p className="text-xs text-slate-500">
            Cam kết 15p cho giảng đường & 60p cho sự cố mạng. Vượt 1.5% so với kỳ trước.
          </p>
        </div>

        {/* Metric 2: Average MTTR */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Thời gian xử lý trung bình</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-blue-700">22 phút</div>
          <p className="text-xs text-slate-500">
            Tính từ lúc CBGV gửi phiếu tới khi KTV hoàn thành tại phòng.
          </p>
        </div>

        {/* Metric 3: User CSAT Score */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Chỉ số hài lòng (CSAT)</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600">4.88 / 5.0 ★</div>
          <p className="text-xs text-slate-500">
            Dựa trên 142 phiếu đánh giá thực tế của giảng viên sau nghiệm thu.
          </p>
        </div>

        {/* Metric 4: Direct Classrooms Serviced */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Giảng đường đã hỗ trợ</span>
            <Building2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-purple-700">38 phòng</div>
          <p className="text-xs text-slate-500">
            Bảo đảm 100% tiết giảng không bị gián đoạn quá 15 phút.
          </p>
        </div>
      </div>

      {/* Two-Column Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Distribution by Category */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-rose-600" />
              <span>Cơ Cấu Sự Cố CNTT Trong Toàn Trường</span>
            </h3>
            <span className="text-xs text-slate-400">Tháng hiện tại</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Máy chiếu, Cáp tín hiệu & Âm thanh Giảng đường', percent: 42, count: 58, color: 'bg-rose-500' },
              { label: 'Hạ tầng Mạng Wi-Fi & Switch phòng thực hành', percent: 28, count: 39, color: 'bg-blue-500' },
              { label: 'Phần mềm thi (SEB), LMS & Bản quyền Office 365', percent: 18, count: 25, color: 'bg-indigo-500' },
              { label: 'Cấp mới mật khẩu & Phân quyền tài nguyên', percent: 12, count: 16, color: 'bg-emerald-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="font-bold text-slate-900">
                    {item.count} vụ ({item.percent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className={`h-2.5 rounded-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <strong>Đánh giá của Ban CNTT:</strong> Tỷ lệ sự cố tập trung chủ yếu ở thiết bị máy chiếu và dây nối cáp HDMI âm tường tại khu Giảng đường B do tần suất cắm/rút của laptop giảng viên cao.
          </p>
        </div>

        {/* Hotspots: Top Classrooms Requiring Maintenance */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <AlertOctagon className="w-4 h-4 text-amber-600" />
              <span>Điểm Nóng Giảng Đường & Thiết Bị Cần Bảo Trì</span>
            </h3>
            <span className="text-xs text-slate-400">Tần suất &gt; 3 lần/tháng</span>
          </div>

          <div className="space-y-3">
            {[
              {
                room: 'Phòng B2-304 (Giảng đường B)',
                issue: 'Bóng đèn máy chiếu mờ, cáp HDMI lỏng chập chờn',
                status: 'Đề xuất thay cụm bóng chiếu & bộ phát không dây',
                level: 'Cao',
              },
              {
                room: 'Phòng C2-Lab 03 (Nhà C Thực hành)',
                issue: 'Switch mạng 24 cổng bị nghẽn DHCP giờ thực hành',
                status: 'Đề xuất nâng cấp switch Cisco Gigabit PoE',
                level: 'Cao',
              },
              {
                room: 'Hội trường B1-101',
                issue: 'Micro trợ giảng hết pin nhanh, loa phải rè',
                status: 'Đã thay bộ pin sạc Panasonic Eneloop',
                level: 'Đã xử lý',
              },
              {
                room: 'Khu tự học tầng 2 Thư viện',
                issue: 'Sóng Wi-Fi suy hao khi đông sinh viên',
                status: 'Đề xuất bổ sung 02 Access Point Wi-Fi 6',
                level: 'Trung bình',
              },
            ].map((hotspot, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{hotspot.room}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      hotspot.level === 'Cao'
                        ? 'bg-red-100 text-red-800'
                        : hotspot.level === 'Đã xử lý'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {hotspot.level}
                  </span>
                </div>
                <div className="text-slate-600">Hiện tượng: {hotspot.issue}</div>
                <div className="text-blue-700 font-medium">Giải pháp: {hotspot.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership Investment Proposals & Recommendations */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2 text-indigo-900 font-bold text-base">
          <Lightbulb className="w-5 h-5 text-indigo-600" />
          <span>Kiến Nghị Đầu Tư & Hiện Đại Hóa Hạ Tầng CNTT Trình Ban Giám Hiệu</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Căn cứ vào dữ liệu sự cố tiếp nhận qua Cổng Hỗ Trợ Kỹ Thuật trong 3 tháng qua, Trung tâm CNTT đề xuất Ban Giám hiệu phê duyệt kế hoạch nâng cấp cơ sở vật chất năm học mới:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-xs space-y-1">
            <div className="text-[11px] font-bold text-indigo-600 uppercase">Hạng mục 1</div>
            <div className="text-sm font-bold text-slate-900">Thiết bị trình chiếu không dây</div>
            <p className="text-xs text-slate-600">
              Trang bị bộ chuyển đổi không dây (Wireless Display) tại 25 phòng học Nhà B, loại bỏ hoàn toàn tình trạng đứt ngầm dây cáp HDMI.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-xs space-y-1">
            <div className="text-[11px] font-bold text-indigo-600 uppercase">Hạng mục 2</div>
            <div className="text-sm font-bold text-slate-900">Nâng cấp Switch mạng Gigabit</div>
            <p className="text-xs text-slate-600">
              Thay thế 06 switch cũ tại các phòng Lab C1, C2 đảm bảo tốc độ truyền tải bài thi trắc nghiệm SEB không bị nghẽn mạng.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-xs space-y-1">
            <div className="text-[11px] font-bold text-indigo-600 uppercase">Hạng mục 3</div>
            <div className="text-sm font-bold text-slate-900">Gia hạn Microsoft 365 A3</div>
            <p className="text-xs text-slate-600">
              Duy trì bản quyền Office chính hãng và dung lượng OneDrive 1TB cho 1.200 cán bộ giảng viên và 15.000 sinh viên toàn trường.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
