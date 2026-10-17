export type UserRole = 'guest' | 'lecturer' | 'student' | 'technician' | 'admin' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  roleTitle: string; // e.g. "Giảng viên Khoa CNTT", "Kỹ thuật viên Mạng", "Phó Hiệu trưởng"
  department: string; // "Khoa Công nghệ thông tin", "Phòng Đào tạo", "Trung tâm CNTT", "Ban Giám hiệu"
  phone: string;
  avatar: string;
  status?: 'active' | 'locked';
  joinedDate?: string;
  lastLogin?: string;
}

export type DeviceCategory =
  | 'projector' // Máy chiếu & Màn chiếu
  | 'network_switch' // Switch mạng & Router
  | 'wifi_ap' // Bộ phát Wi-Fi
  | 'computer' // PC phòng thực hành / Giảng viên
  | 'audio_mic' // Âm thanh, Micro, Loa
  | 'printer' // Máy in, Máy scan
  | 'other';

export type DeviceStatus = 'operational' | 'degraded' | 'broken' | 'in_repair' | 'retired';

export interface DeviceAsset {
  id: string;
  code: string; // e.g. "MC-B2-304"
  name: string; // "Máy chiếu Panasonic PT-VX430"
  category: DeviceCategory;
  categoryLabel: string;
  brandModel: string;
  serialNumber: string;
  campus: string;
  building: string;
  room: string;
  status: DeviceStatus;
  installDate: string;
  warrantyExpiry: string;
  specifications: string;
  technicianInCharge?: string;
  maintenanceNotes?: string;
}

export interface CampusRoom {
  id: string;
  campus: string;
  building: string;
  name: string;
  type: 'lecture_hall' | 'computer_lab' | 'office' | 'auditorium' | 'studio';
  typeLabel: string;
  capacity: number; // Số lượng chỗ ngồi
  status: 'available' | 'in_session' | 'maintenance';
  inChargeTechnicianId?: string;
  inChargeTechnicianName?: string;
  notes?: string;
}

export type TicketCategory =
  | 'hardware' // Báo hỏng phần cứng (Máy chiếu, PC, Máy in)
  | 'network' // Sự cố Mạng LAN / Wi-Fi trường
  | 'software' // Hỗ trợ phần mềm (LMS, QLĐT, Office365, Phần mềm thi)
  | 'account_permission' // Cấp mới / Đổi mật khẩu tài khoản
  | 'classroom_av' // Thiết bị âm thanh, micro, máy chiếu giảng đường
  | 'equipment_loan'; // Đăng ký mượn thiết bị phục vụ giảng dạy/hội thảo

export type TicketUrgency = 'low' | 'normal' | 'high' | 'critical';

export type TicketStatus =
  | 'pending' // Chờ tiếp nhận
  | 'assigned' // Đã phân công kỹ thuật viên
  | 'in_progress' // Đang xử lý
  | 'waiting_parts' // Chờ linh kiện / Chờ phản hồi
  | 'resolved' // Đã xử lý (chờ nghiệm thu)
  | 'closed'; // Đã nghiệm thu & đóng

export interface TicketActivity {
  id: string;
  timestamp: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  type: 'status_change' | 'comment' | 'assignment' | 'resolution' | 'rating';
  isInternal?: boolean; // Chỉ kỹ thuật viên & admin thấy
}

export interface TicketRating {
  score: number; // 1 to 5
  feedback: string;
  ratedAt: string;
}

export interface Ticket {
  id: string;
  code: string; // e.g. "TK-2026-081"
  title: string;
  description: string;
  category: TicketCategory;
  urgency: TicketUrgency;
  status: TicketStatus;
  
  // Vị trí xảy ra sự cố
  campus: string; // "Cơ sở 1 (Cầu Giấy)" | "Cơ sở 2 (Tây Hồ)"
  building: string; // "Giảng đường A", "Giảng đường B", "Nhà Hiệu Bộ"
  room: string; // "Phòng 302", "Lab Máy tính 2", "Hội trường 1"
  deviceCode?: string; // Mã tài sản, vd: "MC-GD-031"
  
  requesterId: string;
  requesterName: string;
  requesterRoleTitle: string;
  requesterEmail: string;
  requesterPhone: string;
  requesterDepartment: string;

  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  assignedTechnicianPhone?: string;

  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  slaDeadlineMinutes: number; // Thời hạn cam kết xử lý (phút)
  
  activities: TicketActivity[];
  rating?: TicketRating;
  attachments?: string[];
  replacementParts?: string[]; // Linh kiện thay thế (nếu có)
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'announcement' | 'maintenance' | 'security' | 'guide';
  categoryLabel: string;
  author: string;
  publishedAt: string;
  pinned?: boolean;
  views: number;
  coverImage?: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: 'wifi_network' | 'office_email' | 'lms_elearning' | 'software' | 'classroom_av' | 'security';
  categoryLabel: string;
  summary: string;
  steps: string[];
  tips?: string[];
  helpfulCount: number;
  views: number;
  updatedAt: string;
  tags: string[];
}

export interface SystemMetrics {
  totalTickets: number;
  pendingTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  slaComplianceRate: number; // e.g. 96.5%
  avgResolutionTimeMinutes: number; // e.g. 32
  averageCsatScore: number; // e.g. 4.8
  totalLecturersAssisted: number;
}
