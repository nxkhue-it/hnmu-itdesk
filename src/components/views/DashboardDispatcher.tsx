import React from 'react';
import { useApp } from '../../context/AppContext';
import { RequesterDashboard } from './RequesterDashboard';
import { TechnicianDashboard } from './TechnicianDashboard';
import { AdminDashboard } from './AdminDashboard';
import { ManagerDashboard } from './ManagerDashboard';
import { UserCheck, ShieldAlert, ArrowRight } from 'lucide-react';

export const DashboardDispatcher: React.FC = () => {
  const { currentUser, setIsLoginModalOpen } = useApp();

  if (!currentUser) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto my-12 space-y-5 shadow-sm">
        <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Yêu cầu đăng nhập hệ thống</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Khu vực Bảng điều hành được phân quyền riêng biệt dành cho Cán bộ / Giảng viên, Sinh viên, Kỹ thuật viên CNTT, Quản trị viên và Lãnh đạo Nhà trường.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl text-sm font-bold transition shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2"
          >
            <span>Đăng Nhập Bằng Email Trường (@hnmu.edu.vn)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          Chính sách an toàn thông tin: Chỉ tài khoản hợp lệ của trường mới có quyền truy cập dữ liệu điều hành.
        </div>
      </div>
    );
  }

  switch (currentUser.role) {
    case 'technician':
      return <TechnicianDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'lecturer':
    case 'student':
    default:
      return <RequesterDashboard />;
  }
};
