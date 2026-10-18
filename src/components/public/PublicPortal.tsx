import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NewsArticle, KnowledgeArticle } from '../../types';
import {
  Search,
  Wifi,
  Monitor,
  KeyRound,
  FileQuestion,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Headphones,
  Laptop,
  Flame,
  ThumbsUp,
  Eye,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const PublicPortal: React.FC<{
  onSelectArticle: (article: KnowledgeArticle) => void;
  onSelectNews: (news: NewsArticle) => void;
}> = ({ onSelectArticle, onSelectNews }) => {
  const { news, knowledgeBase, setActiveTab, setIsCreateModalOpen, setIsLoginModalOpen, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Quick categories
  const filteredKB = searchQuery.trim()
    ? knowledgeBase.filter(
        (k) =>
          k.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          k.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          k.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : knowledgeBase.slice(0, 4);

  const pinnedNews = news.find((n) => n.pinned) || news[0];
  const otherNews = news.filter((n) => n.id !== pinnedNews?.id).slice(0, 3);

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-10 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block mr-1" />
            <span>Hệ Thống Dịch Vụ Kỹ Thuật CNTT Trực Tuyến 24/7</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Bạn cần hỗ trợ kỹ thuật hoặc tìm hiểu dịch vụ CNTT trường học?
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Tra cứu sổ tay hướng dẫn Wi-Fi, Office 365, phần mềm thi hoặc gửi phiếu báo lỗi máy chiếu giảng đường, mạng LAN để kỹ thuật viên hỗ trợ tận nơi.
          </p>

          {/* Quick Search */}
          <div className="pt-2">
            <div className="relative flex items-center bg-white rounded-2xl shadow-lg p-1.5 max-w-2xl">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm nhanh: Cách kết nối Wi-Fi, Lỗi máy chiếu, Mật khẩu LMS, Cài SEB..."
                className="w-full text-sm text-slate-800 placeholder-slate-400 px-3 py-2 bg-transparent focus:outline-hidden"
              />
              <button
                onClick={() => setActiveTab('knowledge')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition shrink-0"
              >
                Tra cứu ngay
              </button>
            </div>
          </div>

          {/* Quick Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-300">
            <span className="text-slate-400">Từ khóa phổ biến:</span>
            {['Wi-Fi Eduroam', 'Báo hỏng máy chiếu', 'Microsoft Office 365', 'Quên mật khẩu portal', 'Cài đặt VPN'].map(
              (tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                    setActiveTab('knowledge');
                  }}
                  className="bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg text-slate-200 transition"
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      {/* 4 Quick Service Actions */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Emergency Classroom Report */}
        <div
          onClick={() => {
            if (!currentUser) {
              setIsLoginModalOpen(true);
            } else {
              setIsCreateModalOpen(true);
            }
          }}
          className="group cursor-pointer bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 hover:border-red-400 p-5 rounded-2xl transition shadow-xs hover:shadow-md transform hover:-translate-y-0.5"
        >
          <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center mb-3 shadow-md shadow-red-500/20 group-hover:scale-105 transition">
            <Flame className="w-6 h-6" />
          </div>
          <div className="text-[11px] font-bold text-red-700 uppercase tracking-wider">Ưu tiên số 1</div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-red-700 transition mt-1">
            Báo hỏng Giảng đường cấp tốc
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Máy chiếu, âm thanh, micro, mạng phòng học đang giảng dạy. Kỹ thuật viên có mặt trong 15 phút.
          </p>
          <div className="mt-3 flex items-center text-xs font-bold text-red-600">
            <span>Gửi báo lỗi ngay</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 2: Knowledge Base */}
        <div
          onClick={() => setActiveTab('knowledge')}
          className="group cursor-pointer bg-white border border-slate-200 hover:border-blue-400 p-5 rounded-2xl transition shadow-xs hover:shadow-md transform hover:-translate-y-0.5"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3 shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
            <Wifi className="w-6 h-6" />
          </div>
          <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Tự khắc phục</div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition mt-1">
            Sổ tay Hướng dẫn CNTT
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Xem hướng dẫn kết nối Wi-Fi, cài phần mềm thi SEB, cấu hình email và tài nguyên thư viện số.
          </p>
          <div className="mt-3 flex items-center text-xs font-bold text-blue-600">
            <span>Tra cứu hướng dẫn</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 3: Account & Portal */}
        <div
          onClick={() => {
            if (!currentUser) {
              setIsLoginModalOpen(true);
            } else {
              setIsCreateModalOpen(true);
            }
          }}
          className="group cursor-pointer bg-white border border-slate-200 hover:border-indigo-400 p-5 rounded-2xl transition shadow-xs hover:shadow-md transform hover:-translate-y-0.5"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-3 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
            <KeyRound className="w-6 h-6" />
          </div>
          <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Tài khoản & Bản quyền</div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition mt-1">
            Cấp tài khoản & Mật khẩu
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Khôi phục mật khẩu Cổng đào tạo, kích hoạt tài khoản Office 365, cấp quyền thư mục chia sẻ.
          </p>
          <div className="mt-3 flex items-center text-xs font-bold text-indigo-600">
            <span>Đề nghị cấp quyền</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 4: AI Diagnostic Assistant */}
        <div
          onClick={() => setActiveTab('assistant')}
          className="group cursor-pointer bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 hover:border-indigo-400 p-5 rounded-2xl transition shadow-xs hover:shadow-md transform hover:-translate-y-0.5"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-3 shadow-md shadow-purple-500/20 group-hover:scale-105 transition">
            <Headphones className="w-6 h-6" />
          </div>
          <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Trợ lý Thông minh</div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition mt-1">
            Chẩn đoán lỗi máy tính
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Mô tả triệu chứng để trợ lý hướng dẫn mẹo tự sửa nhanh trong 1 phút trước khi cần thợ đến.
          </p>
          <div className="mt-3 flex items-center text-xs font-bold text-purple-600">
            <span>Hỏi trợ lý ngay</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </section>

      {/* System Status Indicators (Real-time Uptime) */}
      <section className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-bold text-slate-800">Trạng thái dịch vụ CNTT thời gian thực:</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-slate-600">
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Mạng Wi-Fi Giảng đường: <strong>Bình thường</strong></span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Cổng Quản lý Đào tạo: <strong>Hoạt động</strong></span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>E-Learning LMS: <strong>Ổn định (99.9%)</strong></span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Hệ thống Email: <strong>Bình thường</strong></span>
          </span>
        </div>
      </section>

      {/* Standard ITIL 5-Step Process */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Quy trình chuẩn hóa
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            5 Bước Tiếp Nhận & Xử Lý Sự Cố Dịch Vụ CNTT
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Đảm bảo mọi đề nghị của Cán bộ, Giảng viên và Sinh viên đều được định danh, theo dõi minh bạch và cam kết thời hạn SLA
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
          {[
            {
              step: '01',
              title: 'Gửi yêu cầu',
              desc: 'Đăng nhập định danh, chọn phòng học, thiết bị và mức độ khẩn cấp.',
              icon: FileQuestion,
              color: 'text-blue-600 bg-blue-50 border-blue-200',
            },
            {
              step: '02',
              title: 'Tự động tiếp nhận',
              desc: 'Hệ thống sinh mã phiếu (TK-2026), phân loại và tính hạn xử lý SLA.',
              icon: Clock,
              color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
            },
            {
              step: '03',
              title: 'Phân công kỹ thuật',
              desc: 'KTV trực khu vực tiếp nhận, có mặt tại giảng đường hoặc hỗ trợ từ xa.',
              icon: Laptop,
              color: 'text-amber-600 bg-amber-50 border-amber-200',
            },
            {
              step: '04',
              title: 'Khắc phục & Thay thế',
              desc: 'Sửa chữa, thay linh kiện dự phòng, ghi nhận lịch sử vào sổ thiết bị.',
              icon: CheckCircle2,
              color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
            },
            {
              step: '05',
              title: 'Nghiệm thu & Đánh giá',
              desc: 'Người dùng xác nhận hoàn thành, chấm điểm sao (CSAT) chất lượng dịch vụ.',
              icon: ShieldCheck,
              color: 'text-purple-600 bg-purple-50 border-purple-200',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-4 text-center space-y-2 hover:bg-white hover:shadow-md transition"
              >
                <div className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center border ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-mono font-bold text-slate-400">Bước {item.step}</div>
                <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* News & Announcements Section */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Tin Tức & Thông Báo CNTT Nhà Trường</h2>
            <p className="text-xs text-slate-500">
              Lịch bảo trì hệ thống máy chủ, triển khai phần mềm bản quyền và cảnh báo an toàn thông tin
            </p>
          </div>
          <button
            onClick={() => setActiveTab('news')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>Xem tất cả tin tức</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pinned Big Card */}
          {pinnedNews && (
            <div
              onClick={() => onSelectNews(pinnedNews)}
              className="lg:col-span-2 group cursor-pointer bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col sm:flex-row"
            >
              {pinnedNews.coverImage && (
                <div className="sm:w-2/5 h-48 sm:h-auto overflow-hidden relative">
                  <img
                    src={pinnedNews.coverImage}
                    alt={pinnedNews.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow-xs">
                    {pinnedNews.categoryLabel}
                  </div>
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{pinnedNews.publishedAt}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{pinnedNews.views} lượt xem</span>
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">
                    {pinnedNews.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{pinnedNews.summary}</p>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">{pinnedNews.author}</span>
                  <span className="font-bold text-blue-600 flex items-center space-x-1">
                    <span>Đọc thông báo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Other News Column */}
          <div className="space-y-3 flex flex-col justify-between">
            {otherNews.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectNews(item)}
                className="group cursor-pointer bg-white border border-slate-200 hover:border-blue-300 p-4 rounded-2xl shadow-xs hover:shadow-md transition space-y-2"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                    {item.categoryLabel}
                  </span>
                  <span className="text-slate-400">{item.publishedAt.split(' ')[0]}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Knowledge Articles */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Sổ Tay Hướng Dẫn Kỹ Thuật Phổ Biến</h2>
            <p className="text-xs text-slate-500">
              Các quy trình tự kiểm tra, cấu hình thiết bị và tài nguyên công nghệ được tra cứu nhiều nhất
            </p>
          </div>
          <button
            onClick={() => setActiveTab('knowledge')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>Tất cả bài hướng dẫn ({knowledgeBase.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredKB.map((article) => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group cursor-pointer bg-white border border-slate-200 hover:border-blue-400 p-5 rounded-2xl shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    {article.categoryLabel}
                  </span>
                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <span className="flex items-center space-x-1 text-emerald-600 font-medium">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{article.helpfulCount} hữu ích</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{article.views}</span>
                    </span>
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2">{article.summary}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="font-semibold text-blue-600 group-hover:underline flex items-center space-x-1">
                  <span>Xem các bước</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* University Support Contacts & Working Hours */}
      <section className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Bộ phận Trực ban</div>
            <h3 className="text-lg font-bold">Trung Tâm KHCN & QLTB</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Trụ sở: Tầng 2, Nhà H2, Trường Đại học Thủ đô Hà Nội.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Thời gian làm việc</div>
            <div className="text-xs space-y-1 text-slate-300">
              <p>• Thứ 2 - Thứ 6: 07h00 - 21h30 (Theo các ca học)</p>
              <p>• Thứ 7: 07h30 - 17h30 (Lớp Vừa làm vừa học & Sau đại học)</p>
              <p className="text-amber-300 font-semibold">• Trực ban khẩn cấp giảng đường: 24/7</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Kênh liên hệ trực tiếp</div>
            <div className="text-xs space-y-1.5 text-slate-300">
              <p>
                📞 Hotline tiếp nhận: <strong className="text-white">090.357.9999</strong>
              </p>
              <p>
                ✉️ Email kỹ thuật: <strong className="text-white">hotro.it@hnmu.edu.vn</strong>
              </p>
              <p>
                💬 Zalo OA Kỹ thuật: <strong className="text-white">Trung tâm CNTT HNMU</strong>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
