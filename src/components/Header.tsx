import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Monitor,
  PhoneCall,
  UserCheck,
  ChevronDown,
  LogOut,
  PlusCircle,
  RotateCcw,
  BookOpen,
  Newspaper,
  LayoutDashboard,
  Bot,
  Layers,
  Sparkles,
  LogIn,
  Users,
  Building2,
  Laptop,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    setIsCreateModalOpen,
    setIsLoginModalOpen,
    logout,
    setAdminSubTab,
    resetToDefaults,
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'lecturer':
        return { label: 'Cán bộ / Giảng viên', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'student':
        return { label: 'Sinh viên', color: 'bg-sky-100 text-sky-800 border-sky-300' };
      case 'technician':
        return { label: 'Kỹ thuật viên CNTT', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'admin':
        return { label: 'Quản trị viên Hệ thống', color: 'bg-purple-100 text-purple-800 border-purple-300' };
      case 'manager':
        return { label: 'Lãnh đạo Quản lý chung', color: 'bg-rose-100 text-rose-800 border-rose-300' };
      default:
        return { label: 'Khách vãng lai (Chưa đăng nhập)', color: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
  };

  const currentBadge = getRoleBadge(currentUser?.role);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner: Emergency hotline & quick announcement */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="flex items-center text-amber-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5 inline-block" />
            TRỰC KỸ THUẬT CNTT 24/7
          </span>
          <span className="hidden md:inline text-blue-200">|</span>
          <span className="flex items-center space-x-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-200">Hotline Giảng đường:</span>
            <span className="font-bold text-amber-300">024.3756.9999</span>
            <span className="text-blue-300 text-[11px]">(Máy lẻ: 101 - P. Kỹ thuật)</span>
          </span>
        </div>

        <div className="flex items-center space-x-3 mt-1 sm:mt-0">
          <span className="hidden lg:inline text-blue-200">
            Khu vực hỗ trợ: Giảng đường A, B, C, Nhà Hiệu bộ, Ký túc xá & Thư viện
          </span>
          <button
            onClick={resetToDefaults}
            title="Khôi phục toàn bộ cơ sở dữ liệu mẫu ban đầu của trường"
            className="flex items-center space-x-1 text-slate-300 hover:text-white text-[11px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Dữ Liệu</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & University Title */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 cursor-pointer select-none group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition transform">
              <Monitor className="w-7 h-7" />
            </div>
            <div>
              <div className="text-[11px] tracking-wider uppercase font-semibold text-blue-800 flex items-center space-x-1">
                <span>Trường Đại Học Thủ Đô Hà Nội</span>
                <span className="bg-blue-100 text-blue-800 px-1.5 py-0.2 text-[9px] rounded font-bold">IT-DESK</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
                Cổng Thông Tin & Dịch Vụ CNTT
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Hệ thống tiếp nhận, điều phối & xử lý sự cố thiết bị trường học
              </p>
            </div>
          </div>

          {/* Quick Actions & Role Switcher */}
          <div className="flex items-center space-x-3">
            {/* Create Ticket Fast Button */}
            <button
              onClick={() => {
                if (!currentUser) {
                  setIsLoginModalOpen(true);
                } else {
                  setIsCreateModalOpen(true);
                }
              }}
              className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg shadow-sm shadow-red-500/30 transition transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Báo hỏng / Đề nghị hỗ trợ</span>
            </button>

            {/* If NOT logged in: Direct Login Button */}
            {!currentUser ? (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-sm transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập</span>
              </button>
            ) : null}

            {/* User Account / Login Button */}
            <div className="relative">
              <button
                onClick={() => {
                  if (!currentUser) {
                    setIsLoginModalOpen(true);
                  } else {
                    setIsRoleDropdownOpen(!isRoleDropdownOpen);
                  }
                }}
                className="flex items-center space-x-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl transition text-left"
              >
                {currentUser ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-300"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    <LogIn className="w-4 h-4" />
                  </div>
                )}
                <div className="hidden md:block max-w-[160px]">
                  <div className="text-xs font-semibold text-slate-800 truncate">
                    {currentUser ? currentUser.name : 'Khách vãng lai'}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {currentUser ? currentUser.roleTitle : 'Bấm để đăng nhập'}
                  </div>
                </div>
                {currentUser && <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {/* Dropdown Menu (Only for logged-in user or session management) */}
              {isRoleDropdownOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-sm text-slate-800 truncate">{currentUser.name}</div>
                        <div className="text-xs text-slate-500 truncate">{currentUser.email}</div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getRoleBadge(currentUser.role).color}`}>
                            {getRoleBadge(currentUser.role).label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">Đơn vị:</span> {currentUser.department}
                    </div>
                  </div>

                  {/* If Admin: Quick jump to Admin Sub-modules */}
                  {currentUser?.role === 'admin' && (
                    <div className="px-4 py-2.5 bg-purple-50/70 border-b border-purple-100 space-y-1.5">
                      <div className="text-[10px] font-bold uppercase text-purple-800 tracking-wider">
                        Tác vụ quản trị nhanh:
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                        <button
                          onClick={() => {
                            setActiveTab('dashboard');
                            setAdminSubTab('users');
                            setIsRoleDropdownOpen(false);
                          }}
                          className="p-1.5 bg-white border border-purple-200 hover:bg-purple-100 rounded-lg text-center font-medium text-purple-900 transition"
                        >
                          Người dùng
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('dashboard');
                            setAdminSubTab('rooms');
                            setIsRoleDropdownOpen(false);
                          }}
                          className="p-1.5 bg-white border border-purple-200 hover:bg-purple-100 rounded-lg text-center font-medium text-purple-900 transition"
                        >
                          Phòng học
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('dashboard');
                            setAdminSubTab('devices');
                            setIsRoleDropdownOpen(false);
                          }}
                          className="p-1.5 bg-white border border-purple-200 hover:bg-purple-100 rounded-lg text-center font-medium text-purple-900 transition"
                        >
                          Thiết bị
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Logout option */}
                  <div className="pt-2 px-2">
                    <button
                      onClick={() => {
                        logout();
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 flex items-center space-x-3 text-red-600 hover:bg-red-50 rounded-xl transition"
                    >
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">Đăng xuất tài khoản</div>
                        <p className="text-[11px] text-red-400">Kết thúc phiên làm việc an toàn</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto py-2.5 border-t border-slate-100 text-sm">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
              activeTab === 'home'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Trang chủ & Tin tức</span>
          </button>

          <button
            onClick={() => setActiveTab('knowledge')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
              activeTab === 'knowledge'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Sổ tay Hướng dẫn CNTT</span>
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium transition shrink-0 relative ${
              activeTab === 'tickets'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Quầy hỗ trợ (Service Desk)</span>
          </button>

          {/* Tab Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>
              {!currentUser
                ? 'Bảng điều hành'
                : currentUser.role === 'technician'
                ? 'Giao việc Kỹ thuật viên'
                : currentUser.role === 'manager'
                ? 'Báo cáo Lãnh đạo'
                : currentUser.role === 'admin'
                ? 'Bảng Quản trị Trung tâm'
                : 'Phiếu của tôi'}
            </span>
            {currentUser && (
              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-full font-bold">
                {currentUser.role.toUpperCase()}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('assistant')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
              activeTab === 'assistant'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-indigo-700 hover:bg-indigo-50'
            }`}
          >
            <Bot className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600" />
            <span className="flex items-center space-x-1">
              <span>Trợ lý Chẩn đoán Lỗi</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </span>
          </button>

          {/* Current Role display badge */}
          <div className="ml-auto hidden xl:flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Trạng thái:</span>
            <span className={`px-2.5 py-1 rounded-full font-medium border text-xs ${currentBadge.color}`}>
              {currentBadge.label}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
