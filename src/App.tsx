import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { PublicPortal } from './components/public/PublicPortal';
import { KnowledgeBaseView } from './components/knowledge/KnowledgeBaseView';
import { NewsView } from './components/news/NewsView';
import { TicketsView } from './components/views/TicketsView';
import { DashboardDispatcher } from './components/views/DashboardDispatcher';
import { AIAssistantView } from './components/ai/AIAssistantView';
import { CreateTicketModal } from './components/tickets/CreateTicketModal';
import { TicketDetailModal } from './components/tickets/TicketDetailModal';
import { LoginModal } from './components/auth/LoginModal';
import { KnowledgeArticle, NewsArticle } from './types';
import { CheckCircle2, Phone, Mail, MapPin, Shield } from 'lucide-react';

const MainApp: React.FC = () => {
  const { activeTab, toastMessage } = useApp();

  const [selectedKBArticle, setSelectedKBArticle] = useState<KnowledgeArticle | null>(null);
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<NewsArticle | null>(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'tickets':
        return <TicketsView />;
      case 'knowledge':
        return (
          <KnowledgeBaseView
            selectedArticle={selectedKBArticle}
            onSelectArticle={setSelectedKBArticle}
          />
        );
      case 'news':
        return (
          <NewsView
            selectedNews={selectedNewsArticle}
            onSelectNews={setSelectedNewsArticle}
          />
        );
      case 'dashboard':
        return <DashboardDispatcher />;
      case 'assistant':
        return <AIAssistantView />;
      case 'home':
      default:
        return (
          <PublicPortal
            onSelectArticle={setSelectedKBArticle}
            onSelectNews={setSelectedNewsArticle}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-3 text-xs sm:text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Header & Role Switcher */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {renderContent()}
      </main>

      {/* Modals */}
      <LoginModal />
      <CreateTicketModal />
      <TicketDetailModal />

      {/* University Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="text-white font-bold text-sm tracking-wide uppercase">
                Trường Đại Học Thủ Đô Hà Nội
              </div>
              <p className="text-slate-400 leading-relaxed text-xs">
                Cổng thông tin và hệ thống dịch vụ hỗ trợ kỹ thuật công nghệ thông tin phục vụ Cán bộ, Giảng viên, Sinh viên, Học viên.
              </p>
              <div className="text-slate-500 text-[11px]">
                Phiên bản hệ thống: <strong>v3.4 Enterprise Service Desk</strong>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-white font-bold text-xs uppercase tracking-wider">
                Địa điểm thường trực KTV
              </div>
              <p className="text-xs flex items-start space-x-1.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Cơ sở 1: Số 98 phố Dương Quảng Hàm, P. Quan Hoa, Q. Cầu Giấy, Hà Nội.</span>
              </p>
              <p className="text-xs flex items-start space-x-1.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Cơ sở 2: Số 6 phố Vĩnh Phúc, Q. Ba Đình, Hà Nội.</span>
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-white font-bold text-xs uppercase tracking-wider">
                Đường dây nóng Kỹ thuật
              </div>
              <p className="text-xs flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Hotline Giảng đường: <strong>024.3756.9999</strong> (Máy lẻ 101)</span>
              </p>
              <p className="text-xs flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Email tiếp nhận: <strong>hotro.it@hnmu.edu.vn</strong></span>
              </p>
              <p className="text-xs text-slate-500">
                Thời gian trực: 07h00 - 21h30 (Thứ 2 đến Thứ 7)
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-white font-bold text-xs uppercase tracking-wider">
                Cam kết chất lượng (SLA)
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                • Xử lý sự cố máy chiếu, âm thanh đang giảng dạy: <strong>≤ 15 phút</strong>.<br />
                • Khắc phục mất mạng phòng máy tính, phòng họp: <strong>≤ 60 phút</strong>.<br />
                • Cấp lại tài khoản, khôi phục mật khẩu: <strong>≤ 4 giờ</strong>.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 text-center text-slate-500 text-[11px] flex flex-col sm:flex-row items-center justify-between">
            <span>© 2026 Trung tâm Công nghệ Thông tin & Thư viện. Bảo lưu mọi quyền.</span>
            <span className="mt-2 sm:mt-0 text-slate-600">
              Tiêu chuẩn quản lý dịch vụ ITIL v4 • An toàn thông tin ISO/IEC 27001
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
