# Hướng Dẫn Chi Tiết Triển Khai Hệ Thống Hỗ Trợ Kỹ Thuật CNTT Trên Mạng Nội Bộ (Intranet) Trường Đại Học

Tài liệu này cung cấp toàn bộ quy trình chuẩn bị phần cứng, hạ tầng mạng, cấu hình tên miền nội bộ và các bước cài đặt hệ thống Cổng Dịch Vụ CNTT (**UniIT Desk**) trên máy chủ vật lý hoặc máy chủ ảo (VMware / Proxmox / Hyper-V) đặt tại Trung tâm Dữ liệu của Nhà trường.

---

## I. CÁC THÀNH PHẦN CẦN CHUẨN BỊ

### 1. Hạ Tầng Máy Chủ (Server Hardware / VM)
* **Cấu hình đề xuất (cho ~15.000 sinh viên & 1.000 cán bộ giảng viên):**
  * **CPU:** 4 vCPU trở lên (Intel Xeon / AMD EPYC).
  * **RAM:** 8 GB trở lên (tối thiểu 4 GB nếu chạy độc lập).
  * **Ổ cứng (Disk):** 50 GB - 100 GB SSD/NVMe (lưu trữ mã nguồn, log và ảnh chụp thiết bị báo hỏng).
  * **Hệ điều hành:** Ubuntu Server 22.04 LTS / 24.04 LTS (Khuyên dùng) hoặc Rocky Linux 9 / Debian 12 / Windows Server 2022.

### 2. Cấu Hình Địa Chỉ Mạng (IP & VLAN)
* Gán **1 địa chỉ IP tĩnh nội bộ** cho máy chủ trong phân vùng mạng quản trị máy chủ (Server Farm VLAN).
  * *Ví dụ:* `10.10.20.50` (Subnet: `255.255.255.0`, Gateway: `10.10.20.1`, DNS: `10.10.20.10`).
* Cho phép các phân vùng mạng (VLAN Giảng đường, VLAN Phòng máy Lab, VLAN Ký túc xá, VLAN Nhà Hiệu bộ, VLAN Wi-Fi Eduroam) truy cập đến IP này trên cổng:
  * **Port 80 (HTTP)** và **Port 443 (HTTPS)**.
  * **Port 22 (SSH)** chỉ mở riêng cho máy tính quản trị viên mạng.

### 3. Cấu Hình Tên Miền Nội Bộ (Campus DNS Server)
* Trên máy chủ phân giải tên miền nội bộ của trường (Windows Server DNS / BIND9 / Pi-hole):
  * Tạo bản ghi **A Record**:
    ```
    itdesk.hnmu.edu.vn  --->  10.10.20.50
    ```
  * Hoặc bí danh CNAME: `hotro.hnmu.edu.vn` trỏ về `itdesk.hnmu.edu.vn`.
  * Nhờ vậy, giảng viên và sinh viên chỉ cần gõ `https://itdesk.hnmu.edu.vn` trên trình duyệt máy tính phòng học hoặc điện thoại khi kết nối Wi-Fi trường là vào được ngay mà không cần nhớ IP.

### 4. Chứng Chỉ Bảo Mật SSL/TLS (HTTPS)
* Sử dụng một trong các cách sau:
  * **Cách 1 (Khuyên dùng):** Sử dụng chứng chỉ Wildcard SSL chính thức của trường `*.hnmu.edu.vn` (đã mua từ Sectigo/DigiCert/GlobalSign).
  * **Cách 2:** Chứng chỉ miễn phí Let's Encrypt (nếu trường có mở cổng 80/443 ra ngoài Internet cho tên miền này).
  * **Cách 3:** Chứng chỉ nội bộ do CA nội bộ của trường phát hành (Internal Root CA).

---

## II. CÁC BƯỚC THỰC HIỆN TRIỂN KHAI CỤ THỂ

### PHƯƠNG ÁN 1: TRIỂN KHAI BẰNG DOCKER & DOCKER COMPOSE (NHANH & ỔN ĐỊNH NHẤT - KHUYÊN DÙNG)

#### Bước 1: Cài đặt Docker & Docker Compose trên máy chủ
Đăng nhập SSH vào máy chủ Ubuntu Server:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git apt-transport-https ca-certificates gnupg

# Cài đặt Docker engine
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Cài đặt Docker Compose plugin
sudo apt install -y docker-compose-plugin
sudo usermod -aG docker $USER
```

#### Bước 2: Tải mã nguồn ứng dụng về máy chủ
```bash
cd /opt
sudo git clone <URL_KHO_MA_NGUON_CUA_TRUONG> itdesk-portal
cd itdesk-portal
```

#### Bước 3: Đóng gói và khởi chạy hệ thống
Tại thư mục dự án (đã có sẵn `Dockerfile` và `docker-compose.yml`):
```bash
# Build image và khởi chạy ngầm (detached mode)
docker compose up -d --build

# Kiểm tra trạng thái container đang chạy
docker compose ps
docker compose logs -f
```
Hệ thống lúc này sẽ tự động lắng nghe tại cổng `3000` của máy chủ (`http://10.10.20.50:3000`).

---

### PHƯƠNG ÁN 2: TRIỂN KHAI THỦ CÔNG BẰNG NODE.JS & PM2

#### Bước 1: Cài đặt Node.js 22 LTS
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v # Kiểm tra phiên bản >= 22.x
```

#### Bước 2: Cài đặt PM2 (Process Manager để tự khởi động lại khi sập)
```bash
sudo npm install -g pm2 tsx
```

#### Bước 3: Cài đặt Dependencies và Build ứng dụng
```bash
cd /opt/itdesk-portal
npm install
npm run build
```

#### Bước 4: Khởi chạy dịch vụ với PM2
```bash
# Khởi chạy server.ts ở chế độ production
pm2 start "npm run start" --name "itdesk-hnmu"

# Cấu hình PM2 tự khởi động cùng hệ điều hành khi bật máy chủ
pm2 startup
pm2 save
```

---

## III. CẤU HÌNH NGINX REVERSE PROXY & HTTPS (PORT 80 / 443)

Để người dùng truy cập trực tiếp bằng tên miền `https://itdesk.hnmu.edu.vn` chuẩn không cần gõ kèm số cổng `:3000`:

#### Bước 1: Cài đặt Nginx Web Server
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

#### Bước 2: Đặt chứng chỉ SSL vào máy chủ
Tạo thư mục và lưu file chứng chỉ:
```bash
sudo mkdir -p /etc/ssl/certs /etc/ssl/private
# Copy file crt và private key vào:
# /etc/ssl/certs/hnmu.edu.vn.crt
# /etc/ssl/private/hnmu.edu.vn.key
sudo chmod 600 /etc/ssl/private/hnmu.edu.vn.key
```

#### Bước 3: Cấu hình Virtual Host Nginx
Tạo file cấu hình:
```bash
sudo cp /opt/itdesk-portal/nginx.conf /etc/nginx/sites-available/itdesk.hnmu.edu.vn
sudo ln -s /etc/nginx/sites-available/itdesk.hnmu.edu.vn /etc/nginx/sites-enabled/

# Kiểm tra cú pháp cấu hình Nginx
sudo nginx -t

# Tải lại cấu hình Nginx
sudo systemctl reload nginx
```

---

## IV. CẤU HÌNH TƯỜNG LỬA (FIREWALL) & AN TOÀN HỆ THỐNG

Trên máy chủ Ubuntu Server, bật tường lửa `ufw` và chỉ mở các cổng cho phép:
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Mở cổng SSH cho mạng quản trị
sudo ufw allow from 10.10.0.0/16 to any port 22 proto tcp

# Mở cổng 80 (HTTP) và 443 (HTTPS) cho toàn trường truy cập
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

sudo ufw enable
sudo ufw status
```

---

## V. CÁCH KIỂM TRA SAU KHI TRIỂN KHAI

1. **Kiểm tra từ máy tính giảng đường:**
   - Kết nối vào Wi-Fi `HNMU_Edu` hoặc mạng dây phòng học.
   - Mở trình duyệt web và truy cập: `https://itdesk.hnmu.edu.vn`.
   - Trang chủ Cổng thông tin & Dịch vụ kỹ thuật hiển thị ngay lập tức với biểu tượng ổ khóa xanh (HTTPS an toàn).
2. **Kiểm tra endpoint giám sát sức khỏe hệ thống (Health Check):**
   ```bash
   curl -I https://itdesk.hnmu.edu.vn/api/health
   # Kết quả trả về: HTTP/2 200 và JSON { "status": "ok", "system": "UniIT Desk..." }
   ```
3. **Thử nghiệm gửi phiếu khẩn cấp:**
   - Bấm **"Báo hỏng / Đề nghị hỗ trợ"**.
   - Chọn Giảng đường B - Phòng B2-304, gửi sự cố máy chiếu.
   - Kiểm tra xem phiếu có xuất hiện ngay tức thì trong danh sách của Kỹ thuật viên không.

---

## VI. BẢO TRÌ & SAO LƯU DỰ PHÒNG (BACKUP & UPDATE)

1. **Cập nhật mã nguồn phiên bản mới:**
   ```bash
   cd /opt/itdesk-portal
   git pull origin main
   docker compose down
   docker compose up -d --build
   ```
2. **Kịch bản sao lưu định kỳ (Crontab Backup):**
   - Tạo lệnh sao lưu tự động lúc 01h00 sáng hàng ngày để sao chép dữ liệu cấu hình sang máy chủ Backup Server hoặc NAS của trường.
