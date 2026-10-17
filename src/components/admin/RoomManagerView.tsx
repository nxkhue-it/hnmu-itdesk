import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CampusRoom } from '../../types';
import { CAMPUS_LOCATIONS } from '../../data/mockData';
import {
  Building2,
  Search,
  PlusCircle,
  MapPin,
  Users,
  Wrench,
  CheckCircle,
  AlertTriangle,
  X,
  Laptop,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { ExcelImportModal } from './ExcelImportModal';
import { downloadTemplate } from '../../utils/excelUtils';

export const RoomManagerView: React.FC = () => {
  const { rooms, addRoom, updateRoom, deleteRoom, devices, users } = useApp();

  const [search, setSearch] = useState('');
  const [campusFilter, setCampusFilter] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

  // New room state
  const [name, setName] = useState('');
  const [campus, setCampus] = useState(CAMPUS_LOCATIONS[0].campus);
  const [building, setBuilding] = useState(CAMPUS_LOCATIONS[0].buildings[0].name);
  const [type, setType] = useState<CampusRoom['type']>('lecture_hall');
  const [capacity, setCapacity] = useState(75);
  const [techId, setTechId] = useState('u-tech-1');
  const [notes, setNotes] = useState('');

  const technicians = users.filter((u) => u.role === 'technician');

  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      !search.trim() ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.building.toLowerCase().includes(search.toLowerCase()) ||
      r.typeLabel.toLowerCase().includes(search.toLowerCase());

    const matchesCampus = campusFilter === 'all' || r.campus === campusFilter;
    return matchesSearch && matchesCampus;
  });

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const techObj = users.find((u) => u.id === techId);
    const typeLabelMap: Record<CampusRoom['type'], string> = {
      lecture_hall: 'Giảng đường lý thuyết',
      computer_lab: 'Phòng máy thực hành',
      auditorium: 'Hội trường lớn',
      office: 'Văn phòng Khoa/Phòng',
      studio: 'Studio trực tuyến',
    };

    addRoom({
      name,
      campus,
      building,
      type,
      typeLabel: typeLabelMap[type],
      capacity: Number(capacity) || 50,
      status: 'available',
      inChargeTechnicianId: techId,
      inChargeTechnicianName: techObj?.name || 'Trần Quang Huy',
      notes,
    });

    setIsAddOpen(false);
    setName('');
    setNotes('');
  };

  const getStatusBadge = (status: CampusRoom['status']) => {
    switch (status) {
      case 'available':
        return { label: 'Sẵn sàng sử dụng', bg: 'bg-emerald-100 text-emerald-800' };
      case 'in_session':
        return { label: 'Đang có lớp học', bg: 'bg-blue-100 text-blue-800' };
      case 'maintenance':
        return { label: 'Đang bảo trì kỹ thuật', bg: 'bg-amber-100 text-amber-800' };
      default:
        return { label: status, bg: 'bg-slate-100 text-slate-800' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>Quản Lý Danh Mục Cơ Sở, Giảng Đường & Phòng Học ({rooms.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Cấu hình vị trí, sức chứa chỗ ngồi và gán kỹ thuật viên chịu trách nhiệm khu vực
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => downloadTemplate('rooms')}
            title="Tải tệp Excel mẫu chuẩn (.xlsx) để chuẩn bị danh sách phòng học, phòng làm việc"
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
            <span>Nhập phòng từ Excel</span>
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm phòng học</span>
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
              placeholder="Tìm theo tên phòng (B2-304, Lab 03...), khu nhà, loại phòng..."
              className="w-full text-xs sm:text-sm pl-10 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto text-xs">
            <select
              value={campusFilter}
              onChange={(e) => setCampusFilter(e.target.value)}
              className="border border-slate-300 rounded-xl p-2 bg-white text-xs text-slate-700 font-medium"
            >
              <option value="all">Tất cả cơ sở đào tạo</option>
              <option value="Cơ sở chính (Dương Quảng Hàm, Cầu Giấy)">Cơ sở chính (Cầu Giấy)</option>
              <option value="Cơ sở 2 (Vĩnh Phúc, Ba Đình)">Cơ sở 2 (Ba Đình)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((r) => {
          const roomDevices = devices.filter((d) => d.room === r.name);
          const statusBadge = getStatusBadge(r.status);

          return (
            <div
              key={r.id}
              className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 shadow-xs space-y-3 transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                    {r.name}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge.bg}`}>
                    {statusBadge.label}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800">{r.building}</h4>
                  <div className="text-xs text-slate-500">{r.campus}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Loại phòng:</span>
                    <strong className="text-slate-800">{r.typeLabel}</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Sức chứa:</span>
                    <strong className="text-slate-800">{r.capacity} chỗ ngồi</strong>
                  </div>
                </div>

                {r.notes && (
                  <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {r.notes}
                  </p>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center space-x-1">
                    <Wrench className="w-3.5 h-3.5 text-amber-600" />
                    <span>KTV phụ trách:</span>
                  </span>
                  <span className="font-semibold text-slate-800">{r.inChargeTechnicianName || 'Trần Quang Huy'}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center space-x-1">
                    <Laptop className="w-3.5 h-3.5 text-blue-600" />
                    <span>Thiết bị đã gắn mã:</span>
                  </span>
                  <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.2 rounded">
                    {roomDevices.length} thiết bị
                  </span>
                </div>

                {/* Status Toggle Action */}
                <div className="pt-2 flex items-center justify-between">
                  <select
                    value={r.status}
                    onChange={(e) => updateRoom(r.id, { status: e.target.value as any })}
                    className="text-[11px] border border-slate-200 rounded-lg p-1 bg-white font-medium"
                  >
                    <option value="available">Sẵn sàng</option>
                    <option value="in_session">Đang có lớp</option>
                    <option value="maintenance">Bảo trì</option>
                  </select>

                  <button
                    onClick={() => deleteRoom(r.id)}
                    className="text-[11px] text-red-600 hover:text-red-800 font-medium hover:underline"
                  >
                    Xóa phòng
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Room Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="bg-blue-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Thêm Phòng Học / Giảng Đường Mới</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên phòng / Ký hiệu:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: B2-401 hoặc Lab Mạng 04"
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cơ sở đào tạo:</label>
                  <select
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                  >
                    {CAMPUS_LOCATIONS.map((c) => (
                      <option key={c.campus} value={c.campus}>
                        {c.campus}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tòa nhà / Khu vực:</label>
                  <input
                    type="text"
                    required
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    placeholder="Giảng đường B"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loại phòng:</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                  >
                    <option value="lecture_hall">Giảng đường lý thuyết</option>
                    <option value="computer_lab">Phòng máy thực hành</option>
                    <option value="auditorium">Hội trường lớn</option>
                    <option value="office">Văn phòng Khoa/Phòng</option>
                    <option value="studio">Studio trực tuyến</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sức chứa (người):</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kỹ thuật viên phụ trách:</label>
                <select
                  value={techId}
                  onChange={(e) => setTechId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                >
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú thiết bị có sẵn:</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="VD: Máy chiếu Panasonic, màn chiếu điện, micro trợ giảng..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
                >
                  Lưu phòng học
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
        type="rooms"
      />
    </div>
  );
};
