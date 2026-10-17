import * as XLSX from 'xlsx';
import { User, CampusRoom, DeviceAsset, UserRole, DeviceCategory, DeviceStatus } from '../types';

// ==========================================
// 1. TẠO VÀ TẢI TỆP EXCEL MẪU CHUẨN
// ==========================================

export const downloadTemplate = (type: 'users' | 'rooms' | 'devices') => {
  let headers: string[] = [];
  let sampleData: any[] = [];
  let filename = '';

  if (type === 'users') {
    filename = 'Mau_Import_Nguoi_Dung_HNMU.xlsx';
    headers = [
      'Họ và tên',
      'Email trường',
      'Mật khẩu',
      'Vai trò',
      'Chức danh hiển thị',
      'Đơn vị / Khoa / Phòng',
      'Số điện thoại',
    ];
    sampleData = [
      [
        'TS. Hoàng Đức Thắng',
        'thang.hd@hnmu.edu.vn',
        'password123',
        'Giảng viên',
        'Giảng viên chính',
        'Khoa Công nghệ Thông tin',
        '0912.888.777',
      ],
      [
        'ThS. Lê Thu Hà',
        'ha.lt@hnmu.edu.vn',
        'password123',
        'Giảng viên',
        'Phó Trưởng bộ môn',
        'Khoa Ngoại ngữ',
        '0988.666.555',
      ],
      [
        'Nguyễn Thành Nam',
        'nam.nt@hnmu.edu.vn',
        'password123',
        'Kỹ thuật viên',
        'Kỹ thuật viên Mạng & Giảng đường',
        'Trung tâm CNTT & Thư viện',
        '0904.333.222',
      ],
      [
        'Đặng Phương Linh',
        'linh.k49@hnmu.edu.vn',
        'password123',
        'Sinh viên',
        'Sinh viên K49 - CNTT',
        'Khoa Công nghệ Thông tin',
        '0972.111.444',
      ],
    ];
  } else if (type === 'rooms') {
    filename = 'Mau_Import_Phong_Hoc_HNMU.xlsx';
    headers = [
      'Tên phòng / Ký hiệu',
      'Cơ sở',
      'Tòa nhà / Khu vực',
      'Loại phòng',
      'Sức chứa chỗ ngồi',
      'Kỹ thuật viên phụ trách',
      'Ghi chú thiết bị',
    ];
    sampleData = [
      [
        'B2-401',
        'Cơ sở chính (Dương Quảng Hàm, Cầu Giấy)',
        'Giảng đường B (Khu A-B)',
        'Giảng đường lý thuyết',
        80,
        'Trần Quang Huy',
        'Máy chiếu trần, màn chiếu điện, micro cài áo',
      ],
      [
        'C1-Lab 04',
        'Cơ sở chính (Dương Quảng Hàm, Cầu Giấy)',
        'Giảng đường C (Khu Thực hành)',
        'Phòng máy thực hành',
        40,
        'Phạm Quốc Đạt',
        '40 PC Intel Core i7, Switch Cisco Gigabit',
      ],
      [
        'P.402 Nhà A',
        'Cơ sở chính (Dương Quảng Hàm, Cầu Giấy)',
        'Nhà Hiệu bộ & Văn phòng',
        'Văn phòng Khoa/Phòng',
        20,
        'Trần Quang Huy',
        'Máy in laser đa chức năng, Wi-Fi 6',
      ],
      [
        'D-202',
        'Cơ sở 2 (Vĩnh Phúc, Ba Đình)',
        'Nhà Giảng đường Đa năng D',
        'Giảng đường đa năng',
        60,
        'Phạm Quốc Đạt',
        'Màn hình cảm ứng tương tác 75 inch',
      ],
    ];
  } else if (type === 'devices') {
    filename = 'Mau_Import_Thiet_Bi_CNTT_HNMU.xlsx';
    headers = [
      'Mã tài sản (Device Tag)',
      'Tên thiết bị',
      'Loại thiết bị',
      'Hãng sản xuất / Model',
      'Số Serial (S/N)',
      'Phòng lắp đặt',
      'Tình trạng kỹ thuật',
      'Kỹ thuật viên phụ trách',
      'Thông số kỹ thuật chính',
    ];
    sampleData = [
      [
        'MC-B2-401',
        'Máy chiếu trần Sony VPL-EX570',
        'Máy chiếu & Màn chiếu',
        'Sony VPL-EX570 (4200 ANSI Lumens)',
        'SNY-570-98112',
        'B2-401',
        'Hoạt động tốt',
        'Trần Quang Huy',
        'Độ sáng 4200 ANSI, cổng HDMI x 2, VGA x 1',
      ],
      [
        'SW-LAB04-01',
        'Switch mạng TP-Link JetStream 48 Ports Gigabit',
        'Switch & Thiết bị mạng',
        'TP-Link TL-SG3452P',
        'TPL-3452-11029',
        'C1-Lab 04',
        'Hoạt động tốt',
        'Phạm Quốc Đạt',
        '48 Cổng PoE+ Gigabit, 4 cổng SFP+ 10GE',
      ],
      [
        'MIC-B2-401',
        'Bộ Micro trợ giảng không dây Shure SVX',
        'Âm thanh & Micro',
        'Shure SVX288',
        'SHR-288-77123',
        'B2-401',
        'Hoạt động tốt',
        'Trần Quang Huy',
        'Băng tần UHF, 2 tay micro, pin sạc',
      ],
      [
        'PC-LAB04-01',
        'Máy tính thực hành HP ProDesk 400 G7',
        'Máy tính PC & Server',
        'HP ProDesk 400 G7 MT',
        'HP-400-88319',
        'C1-Lab 04',
        'Hoạt động tốt',
        'Phạm Quốc Đạt',
        'Intel Core i5-10500, RAM 16GB, SSD 512GB',
      ],
    ];
  }

  // Tạo workbook và worksheet
  const wsData = [headers, ...sampleData];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Thiết lập độ rộng cột cho đẹp
  ws['!cols'] = headers.map(() => ({ wch: 26 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template');

  // Tải file về máy người dùng
  XLSX.writeFile(wb, filename);
};

// ==========================================
// 2. PARSE EXCEL FILE NGUOI DUNG
// ==========================================

export const parseUsersExcel = async (file: File): Promise<User[]> => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  if (jsonData.length <= 1) return [];

  const headers: string[] = jsonData[0].map((h) => String(h || '').trim().toLowerCase());
  const rows = jsonData.slice(1);

  const getColIdx = (aliases: string[]) => {
    return headers.findIndex((h) => aliases.some((a) => h.includes(a)));
  };

  const nameIdx = getColIdx(['họ và tên', 'họ tên', 'tên', 'fullname', 'name']);
  const emailIdx = getColIdx(['email', 'hòm thư', 'thư']);
  const passIdx = getColIdx(['mật khẩu', 'password', 'pass']);
  const roleIdx = getColIdx(['vai trò', 'quyền', 'role']);
  const titleIdx = getColIdx(['chức danh', 'vị trí', 'title']);
  const deptIdx = getColIdx(['đơn vị', 'khoa', 'phòng', 'department']);
  const phoneIdx = getColIdx(['số điện thoại', 'điện thoại', 'sđt', 'phone']);

  const parsedUsers: User[] = [];

  rows.forEach((row, index) => {
    if (!row || row.length === 0) return;

    const rawName = nameIdx >= 0 ? String(row[nameIdx] || '').trim() : '';
    const rawEmail = emailIdx >= 0 ? String(row[emailIdx] || '').trim() : '';

    if (!rawName && !rawEmail) return;

    const rawRole = roleIdx >= 0 ? String(row[roleIdx] || '').trim().toLowerCase() : '';
    let role: UserRole = 'lecturer';
    if (rawRole.includes('kỹ thuật') || rawRole.includes('tech')) role = 'technician';
    else if (rawRole.includes('sinh viên') || rawRole.includes('student')) role = 'student';
    else if (rawRole.includes('quản trị') || rawRole.includes('admin')) role = 'admin';
    else if (rawRole.includes('lãnh đạo') || rawRole.includes('giám hiệu') || rawRole.includes('manager')) role = 'manager';

    const rawTitle = titleIdx >= 0 && row[titleIdx] ? String(row[titleIdx]).trim() : role === 'student' ? 'Sinh viên' : 'Cán bộ Giảng viên';
    const rawDept = deptIdx >= 0 && row[deptIdx] ? String(row[deptIdx]).trim() : 'Khoa Công nghệ Thông tin';
    const rawPhone = phoneIdx >= 0 && row[phoneIdx] ? String(row[phoneIdx]).trim() : '0912.000.000';
    const rawPass = passIdx >= 0 && row[passIdx] ? String(row[passIdx]).trim() : 'password123';

    parsedUsers.push({
      id: `u-imp-${Date.now()}-${index}`,
      name: rawName || 'Cán bộ HNMU',
      email: rawEmail || `user.${Date.now()}.${index}@hnmu.edu.vn`,
      password: rawPass,
      role,
      roleTitle: rawTitle,
      department: rawDept,
      phone: rawPhone,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      lastLogin: 'Chưa đăng nhập',
    });
  });

  return parsedUsers;
};

// ==========================================
// 3. PARSE EXCEL FILE PHONG HOC
// ==========================================

export const parseRoomsExcel = async (file: File): Promise<CampusRoom[]> => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  if (jsonData.length <= 1) return [];

  const headers: string[] = jsonData[0].map((h) => String(h || '').trim().toLowerCase());
  const rows = jsonData.slice(1);

  const getColIdx = (aliases: string[]) => {
    return headers.findIndex((h) => aliases.some((a) => h.includes(a)));
  };

  const nameIdx = getColIdx(['tên phòng', 'ký hiệu', 'phòng', 'room', 'name']);
  const campusIdx = getColIdx(['cơ sở', 'campus']);
  const buildingIdx = getColIdx(['tòa nhà', 'khu vực', 'giảng đường', 'building']);
  const typeIdx = getColIdx(['loại phòng', 'loại', 'type']);
  const capIdx = getColIdx(['sức chứa', 'chỗ ngồi', 'capacity']);
  const techIdx = getColIdx(['kỹ thuật viên', 'ktv', 'phụ trách']);
  const notesIdx = getColIdx(['ghi chú', 'thiết bị', 'note']);

  const parsedRooms: CampusRoom[] = [];

  rows.forEach((row, index) => {
    if (!row || row.length === 0) return;

    const rawName = nameIdx >= 0 ? String(row[nameIdx] || '').trim() : '';
    if (!rawName) return;

    const rawCampus = campusIdx >= 0 && row[campusIdx] ? String(row[campusIdx]).trim() : 'Cơ sở chính (Dương Quảng Hàm, Cầu Giấy)';
    const rawBuilding = buildingIdx >= 0 && row[buildingIdx] ? String(row[buildingIdx]).trim() : 'Giảng đường B';
    const rawType = typeIdx >= 0 ? String(row[typeIdx] || '').trim().toLowerCase() : '';

    let type: CampusRoom['type'] = 'lecture_hall';
    let typeLabel = 'Giảng đường lý thuyết';

    if (rawType.includes('thực hành') || rawType.includes('lab') || rawType.includes('máy tính')) {
      type = 'computer_lab';
      typeLabel = 'Phòng máy thực hành';
    } else if (rawType.includes('hội trường') || rawType.includes('lớn')) {
      type = 'auditorium';
      typeLabel = 'Hội trường lớn';
    } else if (rawType.includes('văn phòng') || rawType.includes('khoa') || rawType.includes('phòng làm việc')) {
      type = 'office';
      typeLabel = 'Văn phòng Khoa/Phòng';
    } else if (rawType.includes('studio') || rawType.includes('trực tuyến')) {
      type = 'studio';
      typeLabel = 'Studio trực tuyến';
    }

    const rawCap = capIdx >= 0 && row[capIdx] ? Number(row[capIdx]) || 60 : 60;
    const rawTech = techIdx >= 0 && row[techIdx] ? String(row[techIdx]).trim() : 'Trần Quang Huy';
    const rawNotes = notesIdx >= 0 && row[notesIdx] ? String(row[notesIdx]).trim() : '';

    parsedRooms.push({
      id: `room-imp-${Date.now()}-${index}`,
      name: rawName,
      campus: rawCampus,
      building: rawBuilding,
      type,
      typeLabel,
      capacity: rawCap,
      status: 'available',
      inChargeTechnicianName: rawTech,
      notes: rawNotes,
    });
  });

  return parsedRooms;
};

// ==========================================
// 4. PARSE EXCEL FILE THIET BI CNTT
// ==========================================

export const parseDevicesExcel = async (file: File): Promise<DeviceAsset[]> => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  if (jsonData.length <= 1) return [];

  const headers: string[] = jsonData[0].map((h) => String(h || '').trim().toLowerCase());
  const rows = jsonData.slice(1);

  const getColIdx = (aliases: string[]) => {
    return headers.findIndex((h) => aliases.some((a) => h.includes(a)));
  };

  const codeIdx = getColIdx(['mã tài sản', 'mã thiết bị', 'code', 'tag']);
  const nameIdx = getColIdx(['tên thiết bị', 'tên', 'name']);
  const catIdx = getColIdx(['loại thiết bị', 'loại', 'phân loại', 'category']);
  const modelIdx = getColIdx(['hãng', 'model', 'hiệu']);
  const snIdx = getColIdx(['serial', 's/n', 'sn', 'số serial']);
  const roomIdx = getColIdx(['phòng', 'vị trí', 'room']);
  const statusIdx = getColIdx(['tình trạng', 'trạng thái', 'status']);
  const techIdx = getColIdx(['kỹ thuật viên', 'ktv', 'phụ trách']);
  const specIdx = getColIdx(['thông số', 'cấu hình', 'spec']);

  const parsedDevices: DeviceAsset[] = [];

  rows.forEach((row, index) => {
    if (!row || row.length === 0) return;

    const rawCode = codeIdx >= 0 ? String(row[codeIdx] || '').trim().toUpperCase() : '';
    const rawName = nameIdx >= 0 ? String(row[nameIdx] || '').trim() : '';

    if (!rawCode && !rawName) return;

    const finalCode = rawCode || `DEV-${Date.now().toString().slice(-4)}-${index}`;
    const rawCat = catIdx >= 0 ? String(row[catIdx] || '').trim().toLowerCase() : '';

    let category: DeviceCategory = 'projector';
    let categoryLabel = 'Máy chiếu & Màn chiếu';

    if (rawCat.includes('máy chiếu') || rawCat.includes('projector')) {
      category = 'projector';
      categoryLabel = 'Máy chiếu & Màn chiếu';
    } else if (rawCat.includes('switch') || rawCat.includes('mạng') || rawCat.includes('router')) {
      category = 'network_switch';
      categoryLabel = 'Switch & Thiết bị mạng';
    } else if (rawCat.includes('wifi') || rawCat.includes('wi-fi') || rawCat.includes('ap')) {
      category = 'wifi_ap';
      categoryLabel = 'Bộ phát Wi-Fi';
    } else if (rawCat.includes('máy tính') || rawCat.includes('pc') || rawCat.includes('server') || rawCat.includes('máy trạm')) {
      category = 'computer';
      categoryLabel = 'Máy tính PC & Server';
    } else if (rawCat.includes('âm thanh') || rawCat.includes('micro') || rawCat.includes('loa')) {
      category = 'audio_mic';
      categoryLabel = 'Âm thanh & Micro';
    } else if (rawCat.includes('máy in') || rawCat.includes('scan') || rawCat.includes('printer')) {
      category = 'printer';
      categoryLabel = 'Máy in & Máy quét';
    }

    const rawModel = modelIdx >= 0 && row[modelIdx] ? String(row[modelIdx]).trim() : rawName;
    const rawSN = snIdx >= 0 && row[snIdx] ? String(row[snIdx]).trim() : `SN-${Date.now()}-${index}`;
    const rawRoom = roomIdx >= 0 && row[roomIdx] ? String(row[roomIdx]).trim() : 'B2-304';
    const rawStatus = statusIdx >= 0 ? String(row[statusIdx] || '').trim().toLowerCase() : '';

    let status: DeviceStatus = 'operational';
    if (rawStatus.includes('hỏng') || rawStatus.includes('broken')) status = 'broken';
    else if (rawStatus.includes('sửa') || rawStatus.includes('repair')) status = 'in_repair';
    else if (rawStatus.includes('giảm') || rawStatus.includes('yếu') || rawStatus.includes('degraded')) status = 'degraded';
    else if (rawStatus.includes('thanh lý') || rawStatus.includes('retired')) status = 'retired';

    const rawTech = techIdx >= 0 && row[techIdx] ? String(row[techIdx]).trim() : 'Trần Quang Huy';
    const rawSpec = specIdx >= 0 && row[specIdx] ? String(row[specIdx]).trim() : 'Thiết bị CNTT chuẩn trường học';

    parsedDevices.push({
      id: `dev-imp-${Date.now()}-${index}`,
      code: finalCode,
      name: rawName || 'Thiết bị CNTT',
      category,
      categoryLabel,
      brandModel: rawModel,
      serialNumber: rawSN,
      campus: 'Cơ sở chính (Dương Quảng Hàm, Cầu Giấy)',
      building: 'Giảng đường B',
      room: rawRoom,
      status,
      installDate: new Date().toISOString().split('T')[0],
      warrantyExpiry: '2028-12-31',
      specifications: rawSpec,
      technicianInCharge: rawTech,
      maintenanceNotes: 'Nhập tự động từ file Excel.',
    });
  });

  return parsedDevices;
};
