import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { downloadTemplate, parseUsersExcel, parseRoomsExcel, parseDevicesExcel } from '../../utils/excelUtils';
import { User, CampusRoom, DeviceAsset } from '../../types';
import {
  X,
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Users,
  Building2,
  Laptop,
  Check,
  RefreshCw,
} from 'lucide-react';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'users' | 'rooms' | 'devices';
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({ isOpen, onClose, type }) => {
  const { users, rooms, devices, addUser, addRoom, addDevice, showToast } = useApp();

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [overwrite, setOverwrite] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const getMeta = () => {
    switch (type) {
      case 'users':
        return {
          title: 'Nhập Danh Sách Người Dùng Từ File Excel',
          icon: Users,
          color: 'text-purple-600',
          bgHeader: 'from-purple-900 to-indigo-950',
          desc: 'Thêm nhanh hàng loạt tài khoản Cán bộ, Giảng viên, Sinh viên, Kỹ thuật viên từ file bảng tính Excel.',
          fields: ['Họ và tên', 'Email trường', 'Vai trò', 'Đơn vị / Khoa', 'Số điện thoại'],
          previewCols: (item: User) => [item.name, item.email, item.roleTitle, item.department, item.phone],
        };
      case 'rooms':
        return {
          title: 'Nhập Danh Mục Phòng Học & Phòng Làm Việc Từ Excel',
          icon: Building2,
          color: 'text-blue-600',
          bgHeader: 'from-blue-900 to-slate-900',
          desc: 'Thêm đồng loạt các giảng đường lý thuyết, phòng thực hành máy tính, hội trường và văn phòng khoa.',
          fields: ['Tên phòng', 'Cơ sở', 'Tòa nhà', 'Loại phòng', 'Sức chứa', 'KTV phụ trách'],
          previewCols: (item: CampusRoom) => [item.name, item.campus.split('(')[0], item.building, item.typeLabel, `${item.capacity} chỗ`, item.inChargeTechnicianName || ''],
        };
      case 'devices':
      default:
        return {
          title: 'Nhập Danh Sách Thiết Bị & Tài Sản CNTT Từ Excel',
          icon: Laptop,
          color: 'text-indigo-600',
          bgHeader: 'from-indigo-900 to-slate-950',
          desc: 'Quản lý tài sản máy chiếu, switch mạng, AP Wi-Fi 6, PC thực hành và micro trợ giảng theo từng phòng học.',
          fields: ['Mã tài sản', 'Tên thiết bị', 'Loại thiết bị', 'Phòng lắp đặt', 'Tình trạng', 'S/N'],
          previewCols: (item: DeviceAsset) => [item.code, item.name, item.categoryLabel, item.room, item.status, item.serialNumber],
        };
    }
  };

  const meta = getMeta();
  const Icon = meta.icon;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsProcessing(true);

    try {
      let data: any[] = [];
      if (type === 'users') {
        data = await parseUsersExcel(selectedFile);
      } else if (type === 'rooms') {
        data = await parseRoomsExcel(selectedFile);
      } else if (type === 'devices') {
        data = await parseDevicesExcel(selectedFile);
      }

      setParsedData(data);
      if (data.length === 0) {
        showToast('Không tìm thấy dữ liệu hợp lệ trong file Excel. Vui lòng tải file mẫu để kiểm tra.');
      } else {
        showToast(`Đã nhận diện thành công ${data.length} dòng dữ liệu từ file Excel.`);
      }
    } catch (error) {
      console.error(error);
      showToast('Lỗi khi đọc file Excel. Vui lòng kiểm tra lại định dạng tệp .xlsx / .xls');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = () => {
    if (parsedData.length === 0) return;

    let count = 0;

    if (type === 'users') {
      parsedData.forEach((u: User) => {
        addUser({
          name: u.name,
          email: u.email,
          password: u.password || 'password123',
          role: u.role,
          roleTitle: u.roleTitle,
          department: u.department,
          phone: u.phone,
          avatar: u.avatar,
        });
        count++;
      });
      showToast(`Đã import thành công ${count} tài khoản người dùng vào hệ thống!`);
    } else if (type === 'rooms') {
      parsedData.forEach((r: CampusRoom) => {
        addRoom({
          name: r.name,
          campus: r.campus,
          building: r.building,
          type: r.type,
          typeLabel: r.typeLabel,
          capacity: r.capacity,
          status: r.status,
          inChargeTechnicianId: 'u-tech-1',
          inChargeTechnicianName: r.inChargeTechnicianName || 'Trần Quang Huy',
          notes: r.notes || '',
        });
        count++;
      });
      showToast(`Đã import thành công ${count} phòng học / phòng làm việc vào hệ thống!`);
    } else if (type === 'devices') {
      parsedData.forEach((d: DeviceAsset) => {
        addDevice({
          code: d.code,
          name: d.name,
          category: d.category,
          categoryLabel: d.categoryLabel,
          brandModel: d.brandModel,
          serialNumber: d.serialNumber,
          campus: d.campus,
          building: d.building,
          room: d.room,
          status: d.status,
          installDate: d.installDate,
          warrantyExpiry: d.warrantyExpiry,
          specifications: d.specifications,
          technicianInCharge: d.technicianInCharge,
          maintenanceNotes: d.maintenanceNotes,
        });
        count++;
      });
      showToast(`Đã import thành công ${count} thiết bị CNTT vào danh mục tài sản!`);
    }

    onClose();
    setFile(null);
    setParsedData([]);
  };

  const resetSelection = () => {
    setFile(null);
    setParsedData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className={`bg-gradient-to-r ${meta.bgHeader} text-white p-5 flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-200 bg-white/10 px-2 py-0.5 rounded-full">
                Excel Batch Import
              </span>
              <h3 className="text-base sm:text-lg font-bold mt-0.5">{meta.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Step 1 & 2 Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                <span>Bước 1: Tải file Excel mẫu chuẩn (.xlsx)</span>
              </div>
              <p className="text-slate-500 text-[11px] max-w-md">
                Tệp mẫu đã bao gồm các cột chuẩn hóa và dữ liệu minh họa thực tế của trường. Hãy tải về, điền danh sách rồi tải lên lại.
              </p>
            </div>

            <button
              type="button"
              onClick={() => downloadTemplate(type)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition flex items-center space-x-2 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Tải File Mẫu Excel (.xlsx)</span>
            </button>
          </div>

          {/* Upload Area */}
          <div className="space-y-2">
            <div className="font-bold text-slate-800 text-sm">
              Bước 2: Chọn tệp Excel dữ liệu cần Import
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="hidden"
              id="excel-file-upload"
            />

            {!file ? (
              <label
                htmlFor="excel-file-upload"
                className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition group space-y-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 text-sm">
                    Nhấp vào đây để chọn tệp Excel hoặc kéo thả file vào đây
                  </span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Hỗ trợ định dạng .xlsx, .xls, .csv (Kích thước tối đa: 10MB)
                  </p>
                </div>
              </label>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">{file.name}</div>
                    <div className="text-[11px] text-slate-500">
                      Kích thước: {(file.size / 1024).toFixed(1)} KB • Nhận diện: {parsedData.length} bản ghi
                    </div>
                  </div>
                </div>

                <button
                  onClick={resetSelection}
                  className="text-xs text-slate-500 hover:text-red-600 font-medium px-3 py-1 bg-white border border-slate-200 rounded-lg hover:border-red-300"
                >
                  Chọn file khác
                </button>
              </div>
            )}
          </div>

          {/* Data Preview Table */}
          {parsedData.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    Xem trước dữ liệu ({parsedData.length} dòng được nhận diện hợp lệ)
                  </span>
                </div>

                <label className="flex items-center space-x-1.5 text-[11px] text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={overwrite}
                    onChange={(e) => setOverwrite(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Tự động cập nhật nếu mã/email đã tồn tại</span>
                </label>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[9px] sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="p-2.5 pl-3">#</th>
                      {meta.fields.map((f, i) => (
                        <th key={i} className="p-2.5">
                          {f}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedData.slice(0, 10).map((item, idx) => {
                      const cols = meta.previewCols(item);
                      return (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 pl-3 font-mono text-slate-400">{idx + 1}</td>
                          {cols.map((col, cIdx) => (
                            <td key={cIdx} className="p-2.5 font-medium text-slate-800 truncate max-w-[160px]">
                              {col}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {parsedData.length > 10 && (
                <div className="text-[11px] text-slate-400 text-center italic">
                  (Hiển thị 10 dòng đầu tiên trên tổng số {parsedData.length} dòng dữ liệu trong tệp)
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Dữ liệu sau khi nhập sẽ được lưu bền vững vào hệ thống máy chủ trường.
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleConfirmImport}
              disabled={parsedData.length === 0 || isProcessing}
              className={`px-5 py-2 text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5 ${
                parsedData.length > 0 && !isProcessing
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Xác nhận Import {parsedData.length > 0 ? `(${parsedData.length})` : ''}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
