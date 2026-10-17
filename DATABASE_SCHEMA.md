# Cấu Trúc Cơ Sở Dữ Liệu Hệ Thống UniIT Desk

Tài liệu này mô tả chi tiết toàn bộ cấu trúc Cơ sở dữ liệu (Database Schema), các thực thể, kiểu dữ liệu, khóa chính, khóa ngoại, ràng buộc (constraints) và quan hệ liên kết (ERD) đang được sử dụng trong hệ thống Cổng Thông Tin & Dịch Vụ Hỗ Trợ Kỹ Thuật CNTT Trường Đại Học.

---

## I. SƠ ĐỒ MỐI QUAN HỆ THỰC THỂ (ERD - ENTITY RELATIONSHIP)

```
       ┌──────────────────────┐             ┌─────────────────────────┐
       │     campus_rooms     │ 1         N │      device_assets      │
       │──────────────────────│────────────<│─────────────────────────│
       │ PK  id               │             │ PK   id                 │
       │     name (B2-304)    │             │      code (MC-B2-304)   │
       │     campus           │             │ FK   room_name          │
       │     building         │             │      category           │
       │ FK  technician_id    │             │      status             │
       └──────────┬───────────┘             └────────────┬────────────┘
                  │ 1                                    │ 1
                  │                                      │
                  │ N                                    │ N
       ┌──────────▼──────────────────────────────────────▼────────────┐
       │                           tickets                            │
       │──────────────────────────────────────────────────────────────│
       │ PK  id                                                       │
       │     code (TK-2026-088)                                       │
       │     title, description                                       │
       │     category (classroom_av, network, software...)            │
       │     urgency (critical, high, normal, low)                    │
       │     status (pending, assigned, in_progress, resolved, closed)│
       │ FK  requester_id  ───────┐                                   │
       │ FK  technician_id ────┐  │                                   │
       │ FK  room              │  │                                   │
       │ FK  device_code       │  │                                   │
       │     sla_deadline      │  │                                   │
       │     rating_score      │  │                                   │
       └──────────┬────────────┘  │                                   │
                  │ 1             │                                   │
                  │               │                                   │
                  │ N             │                                   │
       ┌──────────▼────────────┐  │  ┌─────────────────────────────┐  │
       │   ticket_activities   │  │  │            users            │  │
       │───────────────────────│  │  │─────────────────────────────│  │
       │ PK  id                │  └──┼─> PK  id                    │<─┘
       │ FK  ticket_id         │     │       email (unique)        │
       │     author_id         │     │       name                  │
       │     content           │     │       role (lecturer...)    │
       │     type              │     │       department            │
       │     is_internal       │     │       phone, status         │
       │     created_at        │     └─────────────────────────────┘
       └───────────────────────┘

  ┌─────────────────────────────┐             ┌─────────────────────────┐
  │        news_articles        │             │   knowledge_articles    │
  │─────────────────────────────│             │─────────────────────────│
  │ PK  id                      │             │ PK   id                 │
  │     title, summary, content │             │      title, summary     │
  │     category, author        │             │      category, steps    │
  │     pinned, views           │             │      tips, tags         │
  │     published_at            │             │      helpful_count      │
  └─────────────────────────────┘             └─────────────────────────┘
```

---

## II. CHI TIẾT CÁC BẢNG DỮ LIỆU (TABLE SCHEMAS)

### 1. Bảng `users` (Quản lý Người dùng & Phân quyền)
Lưu trữ thông tin định danh toàn bộ Cán bộ, Giảng viên, Sinh viên, Kỹ thuật viên và Lãnh đạo Nhà trường.

| Tên trường (Column) | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(64) | PRIMARY KEY | Khóa chính duy nhất (vd: `u-lecturer-1`, `u-tech-1`) |
| `name` | VARCHAR(128) | NOT NULL | Họ và tên đầy đủ (vd: *TS. Nguyễn Văn Minh*) |
| `email` | VARCHAR(128) | UNIQUE, NOT NULL | Email trường cấp (vd: `minh.nv@hnmu.edu.vn`) |
| `password_hash` | VARCHAR(255) | NOT NULL | Mật khẩu đã băm (Bcrypt/Argon2) |
| `role` | VARCHAR(32) | NOT NULL | Vai trò: `lecturer`, `student`, `technician`, `admin`, `manager` |
| `role_title` | VARCHAR(128) | NOT NULL | Chức danh hiển thị (vd: *Giảng viên chính - Khoa CNTT*) |
| `department` | VARCHAR(128) | NOT NULL | Đơn vị / Khoa / Phòng ban công tác |
| `phone` | VARCHAR(20) | NULL | Số điện thoại liên lạc khi cần xử lý sự cố tại phòng |
| `avatar` | VARCHAR(512) | NULL | Đường dẫn ảnh đại diện |
| `status` | VARCHAR(20) | DEFAULT 'active' | Trạng thái: `active` (hoạt động), `locked` (tạm khóa) |
| `joined_date` | DATE | DEFAULT CURRENT_DATE | Ngày kích hoạt tài khoản |
| `last_login` | TIMESTAMP | NULL | Thời điểm đăng nhập gần nhất |

---

### 2. Bảng `campus_rooms` (Danh mục Cơ sở, Giảng đường & Phòng học)
Quản lý vị trí không gian địa lý của các phòng học, phòng làm việc và hội trường trong trường.

| Tên trường (Column) | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(64) | PRIMARY KEY | Khóa chính (vd: `room-1`, `room-2`) |
| `name` | VARCHAR(64) | NOT NULL | Ký hiệu / Tên phòng (vd: `B2-304`, `C2-Lab 03`) |
| `campus` | VARCHAR(128) | NOT NULL | Cơ sở (vd: *Cơ sở chính Cầu Giấy*, *Cơ sở 2 Ba Đình*) |
| `building` | VARCHAR(128) | NOT NULL | Khu nhà / Tòa nhà (vd: *Giảng đường B*, *Nhà Hiệu bộ*) |
| `type` | VARCHAR(32) | NOT NULL | Phân loại: `lecture_hall`, `computer_lab`, `auditorium`, `office`, `studio` |
| `type_label` | VARCHAR(64) | NOT NULL | Tên loại phòng hiển thị tiếng Việt |
| `capacity` | INT | DEFAULT 60 | Sức chứa chỗ ngồi (số lượng sinh viên/chỗ) |
| `status` | VARCHAR(32) | DEFAULT 'available' | Tình trạng: `available` (sẵn sàng), `in_session` (đang học), `maintenance` (bảo trì) |
| `in_charge_technician_id` | VARCHAR(64) | FK -> users(id) | Kỹ thuật viên thường trực phụ trách khu vực |
| `in_charge_technician_name`| VARCHAR(128) | NULL | Tên KTV thường trực hiển thị nhanh |
| `notes` | TEXT | NULL | Ghi chú thiết bị có sẵn (màn chiếu, máy chiếu...) |

---

### 3. Bảng `device_assets` (Quản lý Thiết bị & Tài sản CNTT)
Quản lý vòng đời và hiện trạng kỹ thuật của từng thiết bị phần cứng được trang bị tại các phòng học.

| Tên trường (Column) | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(64) | PRIMARY KEY | Khóa chính duy nhất (vd: `dev-1`, `dev-2`) |
| `code` | VARCHAR(64) | UNIQUE, NOT NULL | Mã tài sản / Device Tag dán trên thiết bị (vd: `MC-B2-304`, `SW-LAB03-01`) |
| `name` | VARCHAR(255) | NOT NULL | Tên thiết bị (vd: *Máy chiếu trần Panasonic PT-VX430*) |
| `category` | VARCHAR(32) | NOT NULL | Loại: `projector`, `network_switch`, `wifi_ap`, `computer`, `audio_mic`, `printer` |
| `category_label` | VARCHAR(64) | NOT NULL | Nhãn loại thiết bị tiếng Việt |
| `brand_model` | VARCHAR(128) | NOT NULL | Hãng sản xuất & model chi tiết |
| `serial_number` | VARCHAR(128) | NOT NULL | Số Serial phần cứng của nhà sản xuất (S/N) |
| `campus` | VARCHAR(128) | NOT NULL | Cơ sở lắp đặt |
| `building` | VARCHAR(128) | NOT NULL | Tòa nhà lắp đặt |
| `room` | VARCHAR(64) | NOT NULL | Phòng học lắp đặt (Liên kết với `campus_rooms.name`) |
| `status` | VARCHAR(32) | DEFAULT 'operational'| Tình trạng: `operational` (tốt), `degraded` (yếu), `broken` (hỏng), `in_repair` (đang sửa), `retired` (thanh lý) |
| `install_date` | DATE | NOT NULL | Ngày đưa vào khai thác sử dụng |
| `warranty_expiry` | DATE | NOT NULL | Ngày hết hạn bảo hành chính hãng |
| `specifications` | TEXT | NULL | Thông số kỹ thuật chi tiết (độ sáng, cổng kết nối, RAM, CPU...) |
| `technician_in_charge` | VARCHAR(128) | NULL | Kỹ thuật viên phụ trách bảo dưỡng |
| `maintenance_notes` | TEXT | NULL | Nhật ký bảo dưỡng, thay thế linh kiện |

---

### 4. Bảng `tickets` (Phiếu Yêu Cầu Hỗ Trợ & Xử Lý Sự Cố)
Trung tâm điều phối công việc của Service Desk, theo dõi toàn bộ vòng đời từ lúc gửi đến khi nghiệm thu.

| Tên trường (Column) | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(64) | PRIMARY KEY | ID định danh nội bộ (vd: `tk-1729123456`) |
| `code` | VARCHAR(32) | UNIQUE, NOT NULL | Mã phiếu hiển thị (vd: `TK-2026-088`) |
| `title` | VARCHAR(255) | NOT NULL | Tiêu đề tóm tắt sự cố |
| `description` | TEXT | NOT NULL | Mô tả chi tiết triệu chứng, hiện tượng lỗi |
| `category` | VARCHAR(32) | NOT NULL | Phân loại: `classroom_av`, `network`, `software`, `account_permission`, `hardware`, `equipment_loan` |
| `urgency` | VARCHAR(16) | NOT NULL | Mức độ ưu tiên: `critical` (khẩn cấp ≤15p), `high` (cao ≤60p), `normal` (bình thường ≤4h), `low` (thấp) |
| `status` | VARCHAR(32) | NOT NULL | Trạng thái: `pending`, `assigned`, `in_progress`, `waiting_parts`, `resolved`, `closed` |
| `campus` | VARCHAR(128) | NOT NULL | Cơ sở xảy ra sự cố |
| `building` | VARCHAR(128) | NOT NULL | Tòa nhà xảy ra sự cố |
| `room` | VARCHAR(64) | NOT NULL | Phòng học xảy ra sự cố |
| `device_code` | VARCHAR(64) | NULL | Mã tài sản thiết bị liên quan (FK -> `device_assets.code`) |
| `requester_id` | VARCHAR(64) | FK -> users(id) | ID của Cán bộ / Giảng viên / Sinh viên gửi yêu cầu |
| `requester_name` | VARCHAR(128) | NOT NULL | Tên người gửi yêu cầu |
| `requester_email`| VARCHAR(128) | NOT NULL | Email người gửi yêu cầu |
| `requester_phone`| VARCHAR(20) | NOT NULL | Số điện thoại liên hệ hiện trường |
| `requester_dept` | VARCHAR(128) | NOT NULL | Khoa / Phòng ban của người gửi |
| `assigned_tech_id`| VARCHAR(64) | FK -> users(id) | Kỹ thuật viên Trung tâm CNTT được phân công |
| `assigned_tech_name`| VARCHAR(128)| NULL | Họ tên kỹ thuật viên phụ trách |
| `assigned_tech_phone`| VARCHAR(20)| NULL | Số điện thoại hotline của KTV phụ trách |
| `sla_deadline_mins`| INT | NOT NULL | Cam kết thời gian hoàn thành (15, 60, 240, 720 phút) |
| `created_at` | TIMESTAMP | NOT NULL | Thời điểm khởi tạo phiếu |
| `updated_at` | TIMESTAMP | NOT NULL | Thời điểm cập nhật trạng thái gần nhất |
| `resolved_at` | TIMESTAMP | NULL | Thời điểm kỹ thuật viên báo sửa chữa xong |
| `rating_score` | INT | NULL | Điểm đánh giá chất lượng (1 đến 5 sao) |
| `rating_feedback`| TEXT | NULL | Nhận xét của người dùng khi nghiệm thu |
| `rating_at` | TIMESTAMP | NULL | Thời điểm người dùng chấm điểm nghiệm thu |
| `replacement_parts`| JSON / TEXT | NULL | Mảng linh kiện, vật tư kỹ thuật đã thay thế |

---

### 5. Bảng `ticket_activities` (Nhật Ký Tiến Trình & Trao Đổi Tin Nhắn)
Lưu lại toàn bộ lịch sử thay đổi trạng thái, ghi chú kỹ thuật nội bộ và trao đổi hai chiều giữa Giảng viên và Kỹ thuật viên.

| Tên trường (Column) | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(64) | PRIMARY KEY | Khóa chính của dòng nhật ký |
| `ticket_id` | VARCHAR(64) | FK -> tickets(id) | Thuộc phiếu hỗ trợ nào |
| `author_name` | VARCHAR(128) | NOT NULL | Tên người viết ghi chú / thay đổi |
| `author_role` | VARCHAR(32) | NOT NULL | Vai trò người viết (lecturer, technician, admin...) |
| `content` | TEXT | NOT NULL | Nội dung chi tiết nhật ký hoặc tin nhắn trao đổi |
| `type` | VARCHAR(32) | NOT NULL | Loại: `status_change`, `assignment`, `comment`, `resolution`, `rating` |
| `is_internal` | BOOLEAN | DEFAULT FALSE | `true` nếu là ghi chú nội bộ (chỉ KTV và Admin thấy) |
| `timestamp` | TIMESTAMP | NOT NULL | Thời điểm ghi nhận |

---

### 6. Bảng `news_articles` (Bản Tin & Lịch Bảo Trì CNTT)
Quản lý nội dung tin tức, lịch bảo trì hệ thống và cảnh báo an toàn thông tin phục vụ trang chủ công khai.

| Tên trường (Column) | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(64) | PRIMARY KEY | Khóa chính |
| `title` | VARCHAR(255) | NOT NULL | Tiêu đề thông báo |
| `summary` | TEXT | NOT NULL | Đoạn tóm tắt hiển thị ngoài trang chủ |
| `content` | LONGTEXT / TEXT | NOT NULL | Toàn văn nội dung thông báo |
| `category` | VARCHAR(32) | NOT NULL | `maintenance` (bảo trì), `announcement` (thông báo), `security` (bảo mật), `guide` |
| `category_label`| VARCHAR(64) | NOT NULL | Nhãn chuyên mục tiếng Việt |
| `author` | VARCHAR(128) | NOT NULL | Đơn vị phát hành thông báo |
| `published_at` | TIMESTAMP | NOT NULL | Thời gian đăng bài |
| `pinned` | BOOLEAN | DEFAULT FALSE | Ghim nổi bật đầu trang |
| `views` | INT | DEFAULT 0 | Lượt xem bài viết |
| `cover_image` | VARCHAR(512) | NULL | URL ảnh đại diện tin tức |

---

### 7. Bảng `knowledge_articles` (Sổ Tay Hướng Dẫn Kỹ Thuật CNTT)
Kho tri thức số hóa giúp cán bộ, giảng viên và sinh viên tự khắc phục sự cố mạng, phần mềm, máy chiếu.

| Tên trường (Column) | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(64) | PRIMARY KEY | Khóa chính |
| `title` | VARCHAR(255) | NOT NULL | Tiêu đề hướng dẫn (vd: *Kết nối Wi-Fi HNMU_Edu*) |
| `category` | VARCHAR(32) | NOT NULL | `wifi_network`, `office_email`, `lms_elearning`, `software`, `classroom_av`, `security` |
| `category_label`| VARCHAR(64) | NOT NULL | Tên chuyên mục tiếng Việt |
| `summary` | TEXT | NOT NULL | Giới thiệu ngắn về quy trình |
| `steps` | JSON / TEXT | NOT NULL | Mảng các bước thực hiện tuần tự theo chuẩn |
| `tips` | JSON / TEXT | NULL | Mảng các lưu ý, khuyến nghị kỹ thuật an toàn |
| `tags` | JSON / TEXT | NOT NULL | Mảng từ khóa tìm kiếm nhanh (`['Wifi', 'Eduroam']`) |
| `helpful_count`| INT | DEFAULT 0 | Số lượt người dùng bình chọn "Hữu ích" |
| `views` | INT | DEFAULT 0 | Số lượt xem bài viết |
| `updated_at` | DATE | NOT NULL | Ngày cập nhật nội dung gần nhất |

---

## III. MÃ SQL TẠO BẢNG CHUẨN (POSTGRESQL / MYSQL DDL)

Bạn có thể chạy trực tiếp đoạn mã DDL dưới đây nếu muốn kết nối hệ thống với máy chủ cơ sở dữ liệu quan hệ (PostgreSQL / MySQL / MariaDB):

```sql
-- 1. Bảng Người dùng & Phân quyền
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL,
    role_title VARCHAR(128) NOT NULL,
    department VARCHAR(128) NOT NULL,
    phone VARCHAR(20),
    avatar VARCHAR(512),
    status VARCHAR(20) DEFAULT 'active',
    joined_date DATE DEFAULT CURRENT_DATE,
    last_login TIMESTAMP
);

-- 2. Bảng Danh mục Phòng học & Cơ sở
CREATE TABLE campus_rooms (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    campus VARCHAR(128) NOT NULL,
    building VARCHAR(128) NOT NULL,
    type VARCHAR(32) NOT NULL,
    type_label VARCHAR(64) NOT NULL,
    capacity INT DEFAULT 60,
    status VARCHAR(32) DEFAULT 'available',
    in_charge_technician_id VARCHAR(64) REFERENCES users(id),
    in_charge_technician_name VARCHAR(128),
    notes TEXT
);

-- 3. Bảng Quản lý Thiết bị & Tài sản CNTT
CREATE TABLE device_assets (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(32) NOT NULL,
    category_label VARCHAR(64) NOT NULL,
    brand_model VARCHAR(128) NOT NULL,
    serial_number VARCHAR(128) NOT NULL,
    campus VARCHAR(128) NOT NULL,
    building VARCHAR(128) NOT NULL,
    room VARCHAR(64) NOT NULL,
    status VARCHAR(32) DEFAULT 'operational',
    install_date DATE NOT NULL,
    warranty_expiry DATE NOT NULL,
    specifications TEXT,
    technician_in_charge VARCHAR(128),
    maintenance_notes TEXT
);

-- 4. Bảng Phiếu Hỗ trợ & Sự cố Kỹ thuật (Tickets)
CREATE TABLE tickets (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(32) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(32) NOT NULL,
    urgency VARCHAR(16) NOT NULL,
    status VARCHAR(32) NOT NULL,
    campus VARCHAR(128) NOT NULL,
    building VARCHAR(128) NOT NULL,
    room VARCHAR(64) NOT NULL,
    device_code VARCHAR(64) REFERENCES device_assets(code),
    requester_id VARCHAR(64) REFERENCES users(id),
    requester_name VARCHAR(128) NOT NULL,
    requester_email VARCHAR(128) NOT NULL,
    requester_phone VARCHAR(20) NOT NULL,
    requester_dept VARCHAR(128) NOT NULL,
    assigned_tech_id VARCHAR(64) REFERENCES users(id),
    assigned_tech_name VARCHAR(128),
    assigned_tech_phone VARCHAR(20),
    sla_deadline_mins INT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP,
    rating_score INT,
    rating_feedback TEXT,
    rating_at TIMESTAMP,
    replacement_parts TEXT
);

-- 5. Bảng Nhật ký Tiến trình & Trao đổi Tin nhắn
CREATE TABLE ticket_activities (
    id VARCHAR(64) PRIMARY KEY,
    ticket_id VARCHAR(64) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    author_name VARCHAR(128) NOT NULL,
    author_role VARCHAR(32) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(32) NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP NOT NULL
);

-- 6. Bảng Bản tin & Lịch bảo trì
CREATE TABLE news_articles (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(32) NOT NULL,
    category_label VARCHAR(64) NOT NULL,
    author VARCHAR(128) NOT NULL,
    published_at TIMESTAMP NOT NULL,
    pinned BOOLEAN DEFAULT FALSE,
    views INT DEFAULT 0,
    cover_image VARCHAR(512)
);

-- 7. Bảng Sổ tay Hướng dẫn Kỹ thuật (Knowledge Base)
CREATE TABLE knowledge_articles (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(32) NOT NULL,
    category_label VARCHAR(64) NOT NULL,
    summary TEXT NOT NULL,
    steps TEXT NOT NULL,       -- Lưu JSON Array các bước
    tips TEXT,                 -- Lưu JSON Array lưu ý
    tags TEXT NOT NULL,        -- Lưu JSON Array thẻ tìm kiếm
    helpful_count INT DEFAULT 0,
    views INT DEFAULT 0,
    updated_at DATE NOT NULL
);

-- Chỉ mục tối ưu tốc độ truy vấn (Indexes)
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_requester ON tickets(requester_id);
CREATE INDEX idx_tickets_tech ON tickets(assigned_tech_id);
CREATE INDEX idx_devices_room ON device_assets(room);
CREATE INDEX idx_devices_code ON device_assets(code);
```
