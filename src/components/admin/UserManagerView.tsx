import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import {
  Users,
  Search,
  PlusCircle,
  ShieldCheck,
  Lock,
  Unlock,
  Edit2,
  Mail,
  Phone,
  Building,
  CheckCircle,
  X,
  UserPlus,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { ExcelImportModal } from './ExcelImportModal';
import { downloadTemplate } from '../../utils/excelUtils';

export const UserManagerView: React.FC = () => {
  const { users, addUser, updateUserRole, toggleUserStatus, currentUser } = useApp();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

  // New User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('lecturer');
  const [newRoleTitle, setNewRoleTitle] = useState('Giảng viên bộ môn');
  const [newDepartment, setNewDepartment] = useState('Khoa Công nghệ Thông tin');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !search.trim() ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search);

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    addUser({
      name: newName,
      email: newEmail,
      phone: newPhone || '0901.234.567',
      role: newRole,
      roleTitle: newRoleTitle,
      department: newDepartment,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      password: 'password123',
    });

    setIsAddUserOpen(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'lecturer':
        return { label: 'Giảng viên', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'student':
        return { label: 'Sinh viên', bg: 'bg-sky-100 text-sky-800 border-sky-300' };
      case 'technician':
        return { label: 'Kỹ thuật viên', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'admin':
        return { label: 'Quản trị viên', bg: 'bg-purple-100 text-purple-800 border-purple-300' };
      case 'manager':
        return { label: 'Lãnh đạo BGH', bg: 'bg-rose-100 text-rose-800 border-rose-300' };
      default:
        return { label: role, bg: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span>Quản Lý Người Dùng & Phân Quyền Hệ Thống ({users.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Quản lý tài khoản Cán bộ giảng viên, Sinh viên, Kỹ thuật viên trực ban và Lãnh đạo quản lý
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => downloadTemplate('users')}
            title="Tải tệp Excel mẫu chuẩn (.xlsx) để chuẩn bị danh sách cán bộ, giảng viên, sinh viên"
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center space-x-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tải file mẫu Excel</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExcelModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Nhập từ Excel (.xlsx)</span>
          </button>

          <button
            onClick={() => setIsAddUserOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm tài khoản</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, email, khoa/phòng ban, số điện thoại..."
              className="w-full text-xs sm:text-sm pl-10 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto text-xs">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-slate-300 rounded-xl p-2 bg-white text-xs text-slate-700 font-medium"
            >
              <option value="all">Tất cả vai trò ({users.length})</option>
              <option value="lecturer">Giảng viên / Cán bộ</option>
              <option value="student">Sinh viên</option>
              <option value="technician">Kỹ thuật viên CNTT</option>
              <option value="admin">Quản trị viên (Admin)</option>
              <option value="manager">Lãnh đạo Ban Giám hiệu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3.5 pl-5">Người Dùng & Email</th>
                <th className="p-3.5">Vai Trò & Chức Danh</th>
                <th className="p-3.5">Đơn Vị / Khoa / Viện</th>
                <th className="p-3.5">Số Điện Thoại</th>
                <th className="p-3.5">Trạng Thái</th>
                <th className="p-3.5 pr-5 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const badge = getRoleBadge(u.role);
                const isLocked = u.status === 'locked';
                const isMe = currentUser?.id === u.id;

                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 pl-5">
                      <div className="flex items-center space-x-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                            <span>{u.name}</span>
                            {isMe && (
                              <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                                Tôi
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                            <Mail className="w-3 h-3" />
                            <span>{u.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-0.5">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        <div className="text-[11px] text-slate-500">{u.roleTitle}</div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-medium text-slate-800">{u.department}</div>
                      <div className="text-[10px] text-slate-400">Tham gia: {u.joinedDate || '2023-09-01'}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-mono text-slate-700">{u.phone}</div>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isLocked ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isLocked ? 'Đã khóa' : 'Hoạt động'}
                      </span>
                    </td>

                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Role selector */}
                        <select
                          value={u.role}
                          onChange={(e) => {
                            const newRoleVal = e.target.value as UserRole;
                            let titleVal = u.roleTitle;
                            if (newRoleVal === 'technician') titleVal = 'Kỹ thuật viên Trung tâm CNTT';
                            if (newRoleVal === 'admin') titleVal = 'Quản trị viên hệ thống';
                            if (newRoleVal === 'manager') titleVal = 'Lãnh đạo Ban Giám hiệu';
                            if (newRoleVal === 'lecturer') titleVal = 'Giảng viên bộ môn';
                            if (newRoleVal === 'student') titleVal = 'Sinh viên';
                            updateUserRole(u.id, newRoleVal, titleVal);
                          }}
                          className="text-[11px] border border-slate-200 rounded-lg p-1 bg-white font-medium"
                        >
                          <option value="lecturer">Giảng viên</option>
                          <option value="student">Sinh viên</option>
                          <option value="technician">Kỹ thuật viên</option>
                          <option value="admin">Quản trị viên</option>
                          <option value="manager">Lãnh đạo BGH</option>
                        </select>

                        {/* Lock / Unlock */}
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          title={isLocked ? 'Mở khóa tài khoản' : 'Tạm khóa tài khoản'}
                          className={`p-1.5 rounded-lg border transition ${
                            isLocked
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                          }`}
                        >
                          {isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="bg-purple-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Thêm Tài Khoản Người Dùng Mới</h3>
              <button onClick={() => setIsAddUserOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên:</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="VD: ThS. Hoàng Đức Thắng"
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email trường (@hnmu.edu.vn):</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="thang.hd@hnmu.edu.vn"
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vai trò hệ thống:</label>
                  <select
                    value={newRole}
                    onChange={(e) => {
                      const r = e.target.value as UserRole;
                      setNewRole(r);
                      if (r === 'technician') setNewRoleTitle('Kỹ thuật viên Hạ tầng & Phần mềm');
                      else if (r === 'admin') setNewRoleTitle('Quản trị viên Trung tâm CNTT');
                      else if (r === 'manager') setNewRoleTitle('Lãnh đạo Ban Giám hiệu');
                      else if (r === 'student') setNewRoleTitle('Sinh viên');
                      else setNewRoleTitle('Giảng viên bộ môn');
                    }}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                  >
                    <option value="lecturer">Cán bộ / Giảng viên</option>
                    <option value="student">Sinh viên</option>
                    <option value="technician">Kỹ thuật viên CNTT</option>
                    <option value="admin">Quản trị viên (Admin)</option>
                    <option value="manager">Lãnh đạo Quản lý</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số điện thoại liên hệ:</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="0912.xxx.xxx"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chức danh hiển thị:</label>
                <input
                  type="text"
                  value={newRoleTitle}
                  onChange={(e) => setNewRoleTitle(e.target.value)}
                  placeholder="VD: Giảng viên chính - Bộ môn Hệ thống thông tin"
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đơn vị / Khoa / Phòng ban:</label>
                <input
                  type="text"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  placeholder="Khoa Công nghệ Thông tin"
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-600 text-white rounded font-bold hover:bg-purple-700"
                >
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Excel Import Modal */}
      <ExcelImportModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        type="users"
      />
    </div>
  );
};
