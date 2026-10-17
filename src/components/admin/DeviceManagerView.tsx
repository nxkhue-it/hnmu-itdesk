import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DeviceAsset, DeviceCategory, DeviceStatus } from '../../types';
import {
  Laptop,
  Search,
  PlusCircle,
  Wrench,
  CheckCircle,
  AlertTriangle,
  X,
  MapPin,
  Calendar,
  Layers,
  FileText,
  Clock,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { ExcelImportModal } from './ExcelImportModal';
import { downloadTemplate } from '../../utils/excelUtils';

export const DeviceManagerView: React.FC = () => {
  const { devices, addDevice, updateDevice, deleteDevice, rooms, tickets, setSelectedTicket } = useApp();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DeviceAsset | null>(null);

  // New device form
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<DeviceCategory>('projector');
  const [brandModel, setBrandModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [roomName, setRoomName] = useState(rooms[0]?.name || 'B2-304');
  const [status, setStatus] = useState<DeviceStatus>('operational');
  const [specifications, setSpecifications] = useState('');
  const [techInCharge, setTechInCharge] = useState('Trần Quang Huy');

  const categories: { id: DeviceCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Tất cả thiết bị' },
    { id: 'projector', label: 'Máy chiếu & Màn chiếu' },
    { id: 'network_switch', label: 'Switch & Hạ tầng mạng' },
    { id: 'wifi_ap', label: 'Bộ phát Wi-Fi' },
    { id: 'computer', label: 'Máy tính PC & Server' },
    { id: 'audio_mic', label: 'Âm thanh & Micro' },
    { id: 'printer', label: 'Máy in & Máy quét' },
  ];

  const filteredDevices = devices.filter((d) => {
    const matchesSearch =
      !search.trim() ||
      d.code.toLowerCase().includes(search.toLowerCase()) ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.room.toLowerCase().includes(search.toLowerCase()) ||
      d.brandModel.toLowerCase().includes(search.toLowerCase()) ||
      d.serialNumber.toLowerCase().includes(search.toLowerCase());

    const matchesCat = categoryFilter === 'all' || d.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleCreateDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    const selectedRoom = rooms.find((r) => r.name === roomName);
    const catLabel = categories.find((c) => c.id === category)?.label || 'Thiết bị';

    addDevice({
      code: code.trim().toUpperCase(),
      name,
      category,
      categoryLabel: catLabel,
      brandModel: brandModel || name,
      serialNumber: serialNumber || `SN-${Date.now()}`,
      campus: selectedRoom?.campus || 'Cơ sở chính (Dương Quảng Hàm, Cầu Giấy)',
      building: selectedRoom?.building || 'Giảng đường B',
      room: roomName,
      status,
      installDate: new Date().toISOString().split('T')[0],
      warrantyExpiry: '2028-12-31',
      specifications,
      technicianInCharge: techInCharge,
      maintenanceNotes: 'Thiết bị mới bổ sung vào danh mục tài sản.',
    });

    setIsAddOpen(false);
    setCode('');
    setName('');
    setBrandModel('');
    setSerialNumber('');
    setSpecifications('');
  };

  const getStatusBadge = (s: DeviceStatus) => {
    switch (s) {
      case 'operational':
        return { label: 'Hoạt động tốt', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'degraded':
        return { label: 'Hiệu năng giảm', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'broken':
        return { label: 'Đang bị hỏng', bg: 'bg-red-100 text-red-800 border-red-300' };
      case 'in_repair':
        return { label: 'Đang sửa chữa', bg: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
      case 'retired':
        return { label: 'Thanh lý / Hết hạn', bg: 'bg-slate-100 text-slate-700 border-slate-300' };
      default:
        return { label: s, bg: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Laptop className="w-5 h-5 text-indigo-600" />
            <span>Quản Lý Danh Mục Thiết Bị & Tài Sản CNTT Trường Học ({devices.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Theo dõi mã tài sản, cấu hình kỹ thuật, vị trí lắp đặt và lịch sử sự cố gắn liền với từng thiết bị
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => downloadTemplate('devices')}
            title="Tải tệp Excel mẫu chuẩn (.xlsx) để chuẩn bị danh mục máy chiếu, switch, PC, wifi, micro..."
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
            <span>Nhập thiết bị từ Excel</span>
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm thiết bị mới</span>
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
              placeholder="Tìm theo mã tài sản (MC-B2-304, SW...), tên model, số serial, phòng..."
              className="w-full text-xs sm:text-sm pl-10 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto text-xs">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-slate-300 rounded-xl p-2 bg-white text-xs text-slate-700 font-medium"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded-xl p-2 bg-white text-xs text-slate-700 font-medium"
            >
              <option value="all">Tất cả tình trạng</option>
              <option value="operational">Hoạt động tốt</option>
              <option value="in_repair">Đang sửa chữa</option>
              <option value="degraded">Hiệu năng giảm</option>
              <option value="broken">Đang bị hỏng</option>
            </select>
          </div>
        </div>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((d) => {
          const badge = getStatusBadge(d.status);
          const relatedTickets = tickets.filter(
            (t) => t.deviceCode === d.code || t.room === d.room
          );

          return (
            <div
              key={d.id}
              className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 shadow-xs space-y-3 transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
                    {d.code}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                    {badge.label}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{d.name}</h4>
                  <div className="text-xs text-slate-500">{d.brandModel}</div>
                  <div className="text-[10px] font-mono text-slate-400">SN: {d.serialNumber}</div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-slate-700 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>
                      Vị trí: <strong>{d.building} • {d.room}</strong>
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Kỹ thuật viên phụ trách: <strong>{d.technicianInCharge || 'Trần Quang Huy'}</strong>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Bảo hành đến: <strong>{d.warrantyExpiry}</strong>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 line-clamp-2">
                  <span className="font-semibold text-slate-700">Thông số:</span> {d.specifications}
                </div>

                {d.maintenanceNotes && (
                  <div className="text-[11px] text-amber-900 bg-amber-50/70 p-2 rounded-lg border border-amber-200/60">
                    <span className="font-semibold">Nhật ký bảo dưỡng:</span> {d.maintenanceNotes}
                  </div>
                )}
              </div>

              {/* Status and Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                {relatedTickets.length > 0 && (
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Phiếu sự cố liên quan:</span>
                    <button
                      onClick={() => setSelectedTicket(relatedTickets[0])}
                      className="font-bold text-blue-600 hover:underline flex items-center space-x-1"
                    >
                      <FileText className="w-3 h-3" />
                      <span>{relatedTickets.length} phiếu</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <select
                    value={d.status}
                    onChange={(e) => updateDevice(d.id, { status: e.target.value as any })}
                    className="text-[11px] border border-slate-200 rounded-lg p-1 bg-white font-medium"
                  >
                    <option value="operational">Hoạt động tốt</option>
                    <option value="in_repair">Đang sửa chữa</option>
                    <option value="degraded">Hiệu năng giảm</option>
                    <option value="broken">Đang bị hỏng</option>
                    <option value="retired">Thanh lý</option>
                  </select>

                  <button
                    onClick={() => deleteDevice(d.id)}
                    className="text-[11px] text-red-600 hover:text-red-800 font-medium hover:underline"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Device Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="bg-indigo-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Thêm Thiết Bị CNTT Mới Vào Cơ Sở Dữ Liệu</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDevice} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mã tài sản (Device Tag):</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="VD: MC-B2-304"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phân loại thiết bị:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white font-medium"
                  >
                    <option value="projector">Máy chiếu & Màn chiếu</option>
                    <option value="network_switch">Switch & Hạ tầng mạng</option>
                    <option value="wifi_ap">Bộ phát Wi-Fi</option>
                    <option value="computer">Máy tính PC & Server</option>
                    <option value="audio_mic">Âm thanh & Micro</option>
                    <option value="printer">Máy in & Máy quét</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên thiết bị:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Máy chiếu Panasonic PT-VX430"
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hãng sản xuất / Model:</label>
                  <input
                    type="text"
                    value={brandModel}
                    onChange={(e) => setBrandModel(e.target.value)}
                    placeholder="Panasonic PT-VX430"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số Serial (S/N):</label>
                  <input
                    type="text"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="PNS-89104..."
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lắp đặt tại phòng:</label>
                  <select
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white font-bold text-blue-900"
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name} ({r.building})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tình trạng ban đầu:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white font-medium"
                  >
                    <option value="operational">Hoạt động tốt</option>
                    <option value="degraded">Hiệu năng giảm</option>
                    <option value="in_repair">Đang sửa chữa</option>
                    <option value="broken">Đang bị hỏng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Thông số kỹ thuật chính:</label>
                <textarea
                  rows={2}
                  value={specifications}
                  onChange={(e) => setSpecifications(e.target.value)}
                  placeholder="Độ sáng 4500 ANSI, cổng HDMI, VGA..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kỹ thuật viên phụ trách:</label>
                <input
                  type="text"
                  value={techInCharge}
                  onChange={(e) => setTechInCharge(e.target.value)}
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
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700"
                >
                  Lưu thiết bị
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
        type="devices"
      />
    </div>
  );
};
