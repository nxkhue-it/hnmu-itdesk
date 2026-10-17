# UniIT Desk - Cổng Thông Tin & Dịch Vụ Hỗ Trợ Kỹ Thuật CNTT Trường Đại Học

Hệ thống tiếp nhận, điều phối, xử lý sự cố thiết bị trường học và kho tri thức số hóa dành cho Cán bộ, Giảng viên, Sinh viên, Kỹ thuật viên trực ban và Ban Giám hiệu Nhà trường.

---

## 🌟 TÍNH NĂNG CHÍNH

1. **Cổng Thông Tin Công Khai (Không cần đăng nhập):**
   - Xem thông báo nâng cấp hạ tầng, lịch bảo trì máy chủ & mạng.
   - Sổ tay hướng dẫn kỹ thuật: Cấu hình Wi-Fi trường (WPA2-Enterprise), thi trắc nghiệm Safe Exam Browser (SEB), kích hoạt Office 365 A3, cấu hình VPN Thư viện số.
   - Trợ lý AI Chẩn đoán sự cố tự phục vụ 24/7.
   - Đường dây nóng khẩn cấp cho giảng đường.

2. **Quầy Hỗ Trợ Dịch Vụ & Tiếp Nhận Sự Cố (Yêu cầu đăng nhập xác định danh tính):**
   - Báo hỏng máy chiếu, âm thanh micro giảng đường (Cam kết SLA ≤ 15 phút).
   - Sự cố mạng LAN, Wi-Fi phòng máy tính thực hành.
   - Đề nghị cấp tài khoản, phân quyền máy chủ nghiên cứu khoa học.
   - Đăng ký mượn thiết bị giảng dạy, hội thảo.

3. **Giao Diện Chuyên Biệt Cho 4 Nhóm Đối Tượng:**
   - 🎓 **Cán bộ / Giảng viên / Sinh viên:** Tạo phiếu, theo dõi tiến độ, gọi điện cho KTV, nghiệm thu & chấm điểm 1-5 sao.
   - 🛠️ **Kỹ thuật viên CNTT:** Nhận việc 1-chạm, cập nhật tiến độ, ghi chú nội bộ, ghi nhận linh kiện thay thế.
   - ⚙️ **Quản trị viên (Admin):** Điều phối phân công KTV, giám sát tải công việc, quản lý người dùng, quản lý danh mục phòng học, quản lý kho thiết bị tài sản.
   - 👔 **Lãnh đạo Ban Giám hiệu:** Executive Dashboard phân tích chỉ số SLA, CSAT, điểm nóng giảng đường hỏng hóc, kiến nghị đầu tư thiết bị mới, In báo cáo tổng hợp.

---

## 🚀 CÁCH VẬN HÀNH TRÊN GITHUB

### Cách 1: Chạy Thử Trực Tiếp Trên Trình Duyệt Qua GitHub Codespaces (Không cần cài đặt gì trên máy tính)
1. Trên trang kho mã nguồn GitHub của bạn, nhấn vào nút **Code** màu xanh.
2. Chọn tab **Codespaces** ➔ Nhấn **"Create codespace on main"**.
3. Một máy ảo VS Code trên trình duyệt sẽ được khởi tạo trong 30 giây.
4. Mở cửa sổ Terminal trong Codespaces và gõ:
   ```bash
   npm install
   npm run dev
   ```
5. Codespaces sẽ hiển thị thông báo cổng `3000` đang mở kèm nút **"Open in Browser"**. Nhấp vào để trải nghiệm toàn bộ hệ thống trực tiếp!

---

### Cách 2: Triển Khai Miễn Phí Lên GitHub Pages (Live Demo Web)
1. Đưa mã nguồn lên GitHub.
2. Vào mục **Settings** của repository trên GitHub ➔ Chọn mục **Pages** (cột bên trái).
3. Tại phần **Build and deployment** ➔ Mục **Source** ➔ Chọn **GitHub Actions**.
4. GitHub Actions (file `.github/workflows/deploy-pages.yml` đã được cấu hình sẵn) sẽ tự động build và xuất bản trang web.
5. Sau 1-2 phút, bạn sẽ có liên kết chạy trực tiếp:
   `https://<username_cua_ban>.github.io/<ten_repository>/`

---

### Cách 3: Chạy Cục Bộ (Localhost) Trên Máy Tính
```bash
# 1. Clone mã nguồn về máy
git clone <URL_REPOSITORY_GITHUB>
cd itdesk-portal

# 2. Cài đặt các thư viện
npm install

# 3. Chạy ở môi trường phát triển (Dev)
npm run dev
# Truy cập: http://localhost:3000

# 4. Chạy ở chế độ Production Server
npm run build
npm start
```

---

### Cách 4: Chạy Bằng Docker & Docker Compose
```bash
docker compose up -d --build
# Truy cập: http://localhost:3000
```

---

## 🔑 TÀI KHOẢN THỬ NGHIỆM THEO TỪNG VAI TRÒ

*(Mật khẩu mặc định cho tất cả các tài khoản là: `password123`)*

| Họ và Tên | Email Định Danh | Vai Trò Hệ Thống | Chức Danh / Đơn Vị |
| :--- | :--- | :--- | :--- |
| **TS. Nguyễn Văn Minh** | `minh.nv@hnmu.edu.vn` | **Giảng viên** | Giảng viên chính - Khoa CNTT |
| **Lê Hải Đăng** | `haidang.k48@hnmu.edu.vn` | **Sinh viên** | Sinh viên K48 - Khoa CNTT |
| **Trần Quang Huy** | `huy.tq@hnmu.edu.vn` | **Kỹ thuật viên** | KTV Hạ tầng & Giảng đường |
| **Phạm Quốc Đạt** | `dat.pq@hnmu.edu.vn` | **Kỹ thuật viên** | KTV Phần mềm & Hệ thống |
| **ThS. Vũ Hoàng Nam** | `nam.vh@hnmu.edu.vn` | **Quản trị viên** | Quản trị viên Trung tâm CNTT |
| **PGS.TS. Phạm Trung Kiên**| `kien.pt@hnmu.edu.vn` | **Lãnh đạo Quản lý**| Phó Hiệu trưởng (BGH) |

> **Mẹo nhanh:** Bạn có thể bấm vào góc trên bên phải thanh Header để chuyển nhanh bất kỳ vai trò nào chỉ với 1-chạm mà không cần nhập lại mật khẩu!

---

## 🧪 KỊCH BẢN KIỂM THỬ ĐẦY ĐỦ CÁC CHỨC NĂNG (TEST PLAN)

### Kịch bản 1: Kiểm thử Người dùng Vãng lai (Khách chưa đăng nhập)
1. Tại góc trên bên phải, chọn **"Chế độ Khách (Đăng xuất)"**.
2. Kiểm tra xem có thể đọc được tin tức, lịch bảo trì và xem toàn bộ Sổ tay hướng dẫn Wi-Fi, Office 365, Safe Exam Browser không.
3. Thử hỏi Trợ lý Chẩn đoán Lỗi: gõ *"Máy chiếu bị mất hình"*.
4. Bấm **"Báo hỏng / Đề nghị hỗ trợ"** ➔ Kiểm tra xem hệ thống có yêu cầu đăng nhập để xác định danh tính hay không.

### Kịch bản 2: Kiểm thử Cán bộ Giảng viên (Người gửi yêu cầu)
1. Đăng nhập tài khoản: `minh.nv@hnmu.edu.vn` (hoặc bấm chọn TS. Nguyễn Văn Minh).
2. Bấm nút màu đỏ: **"Báo hỏng / Đề nghị hỗ trợ"**.
3. Điền thông tin sự cố:
   - Loại: *Máy chiếu, Âm thanh & Micro giảng đường*.
   - Mức độ: *🚨 Khẩn cấp - Giảng đường đang học (Xử lý trong 15p)*.
   - Vị trí: Cơ sở chính ➔ Giảng đường B ➔ Phòng B2-304.
   - Nhập tiêu đề và mô tả sự cố ➔ Bấm **"Xác nhận & Gửi yêu cầu"**.
4. Vào mục **"Phiếu của tôi"** để theo dõi phiếu vừa tạo kèm đồng hồ đếm SLA.

### Kịch bản 3: Kiểm thử Kỹ thuật viên CNTT (Xử lý sự cố)
1. Đổi sang vai trò: `Trần Quang Huy` (Kỹ thuật viên).
2. Vào mục **"Giao việc Kỹ thuật viên"**.
3. Xem tab **"Ca của tôi đang xử lý"** hoặc **"Hàng chờ chưa có ai nhận"**.
4. Bấm nút:
   - **"Đang sửa"** (chuyển trạng thái).
   - Thêm linh kiện thay thế: gõ *"Cáp HDMI 5m Ugreen"* ➔ Bấm **Thêm vật tư**.
   - Bấm **"Báo hoàn thành (Đã sửa xong)"**.

### Kịch bản 4: Nghiệm thu & Chấm điểm CSAT
1. Đổi lại vai trò: `TS. Nguyễn Văn Minh` (Giảng viên).
2. Mở phiếu vừa được kỹ thuật viên báo hoàn thành.
3. Đánh giá chất lượng: Chọn **5 sao**, viết nhận xét *"KTV hỗ trợ rất nhanh trước giờ lên lớp"* ➔ Bấm **"Nghiệm thu đóng phiếu & Gửi đánh giá"**.

### Kịch bản 5: Kiểm thử Quản trị viên (Admin Control Panel)
1. Đổi sang vai trò: `ThS. Vũ Hoàng Nam` (Admin).
2. Vào **"Bảng Quản trị Trung tâm"**:
   - Tab **"Điều phối & Tải KTV"**: Xem biểu đồ tải công việc của các KTV, phân công phiếu cho KTV khác.
   - Tab **"Quản lý Người dùng"**: Thêm tài khoản mới, thử đổi vai trò hoặc bấm nút khóa/mở khóa tài khoản.
   - Tab **"Quản lý Phòng học"**: Xem danh sách phòng học, trạng thái phòng (Sẵn sàng/Bảo trì), KTV phụ trách.
   - Tab **"Quản lý Thiết bị CNTT"**: Xem danh mục mã tài sản (`MC-B2-304`, `SW-LAB03-01`), xem lịch sử sự cố gắn liền với thiết bị.

### Kịch bản 6: Kiểm thử Lãnh đạo Nhà trường (Ban Giám hiệu)
1. Đổi sang vai trò: `PGS.TS. Phạm Trung Kiên` (Phó Hiệu trưởng).
2. Vào **"Báo cáo Lãnh đạo"**:
   - Kiểm tra các chỉ số chiến lược: Tỷ lệ SLA (96.5%), thời gian MTTR (22 phút), điểm CSAT (4.88 sao).
   - Xem cơ cấu phân loại sự cố toàn trường và biểu đồ các điểm nóng phòng học hay hỏng hóc.
   - Bấm nút **"In Báo Cáo Tổng Hợp"** để kiểm tra giao diện in ấn / xuất PDF trình Ban Giám hiệu.
