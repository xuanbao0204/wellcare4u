# 💙 Wellcare4u — Frontend
 
> Giao diện người dùng của hệ thống chăm sóc sức khỏe & đặt lịch khám bệnh trực tuyến, tích hợp AI.
 
---
 
## 📖 Giới thiệu
 
**Wellcare4u** là nền tảng y tế số giúp kết nối bệnh nhân với bác sĩ một cách nhanh chóng, tiện lợi và bảo mật. Hệ thống hợp nhất toàn bộ hành trình y tế — từ đặt lịch khám, nhận đơn thuốc, đến theo dõi sức khỏe lâu dài — trên một giao diện duy nhất, trực quan và dễ sử dụng.
 
Điểm khác biệt của Wellcare4u nằm ở **AI chạy hoàn toàn nội bộ** (Ollama + Qwen3), đảm bảo dữ liệu y tế nhạy cảm không rời khỏi máy chủ, đồng thời cung cấp trợ lý thông minh hỗ trợ cả bệnh nhân lẫn đội ngũ y tế.
 
### ✨ Tính năng chính
 
| Tính năng | Mô tả |
|---|---|
| 📅 Đặt lịch khám bệnh | Đặt lịch trực tuyến với bác sĩ chuyên khoa, chọn ca khám linh hoạt |
| 💊 Quản lý đơn thuốc | Theo dõi đơn thuốc, lịch uống thuốc và lịch sử điều trị |
| 🤖 Tích hợp AI | Trợ lý AI gợi ý triệu chứng, hỗ trợ soạn đơn thuốc qua Ollama (Qwen3) |
| 🔔 Thông báo real-time | Cập nhật tức thì qua WebSocket/STOMP khi có thay đổi lịch hẹn |
| 🏥 Quản lý phòng khám | Công cụ toàn diện cho Clinic Owner quản lý bác sĩ, thuốc, ca trực |
| 👥 Phân quyền vai trò | 5 vai trò riêng biệt: Patient, Doctor, Staff, Clinic Owner, Admin |
 
### 🛠 Công nghệ sử dụng
 
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State & Data:** React Query / Zustand
- **Real-time:** WebSocket + STOMP (SockJS)
- **Auth:** JWT (lưu trữ httpOnly cookie)
### 👨‍💻 Nhóm thực hiện
 
| Họ và tên | MSSV | Vai trò |
|---|---|---|
| Trần Xuân Bảo | 22110113 | Full-stack Developer |
| Bùi Bảo Châu | 22110114 | Backend & Database |
| Nguyễn Ngô Ngọc Vân | 22110265 | Frontend & UI/UX |
 
> Đồ án tốt nghiệp · Khoa Công nghệ Thông tin · 2025
 
---
 
## 🚀 Hướng dẫn cài đặt
 
### Yêu cầu
 
- **Node.js** 18.x trở lên
- **npm** 9+ hoặc **yarn** 1.22+
- Backend Wellcare4u đang chạy tại `http://localhost:8600` (xem repo [wellcare4u-be](https://github.com/xuanbao0204/wellcare4u-be))
### Bước 1: Clone repository
 
```bash
git clone https://github.com/xuanbao0204/wellcare4u.git
cd wellcare4u
```
 
### Bước 2: Cài đặt dependencies
 
```bash
npm install
# hoặc
yarn install
```
 
### Bước 3: Cấu hình biến môi trường
 
Tạo file `.env` tại thư mục gốc của project:
 
```env
NEXT_PUBLIC_API_URL=http://localhost:8600/api
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
```
 
> **Lưu ý:** File `.env` đã được thêm vào `.gitignore` và không được commit lên repository.
 
### Bước 4: Chạy ứng dụng
 
```bash
# Chế độ development
npm run dev
 
# Build production
npm run build
npm run start
```
 
Ứng dụng chạy tại **http://localhost:3000**
 
---
 
## 📁 Cấu trúc thư mục
 
```
WELLCARE4U/
├── node_modules/
├── public/
└── src/
    ├── app/
    │   ├── (protected)/
    │   │   ├── admin/
    │   │   │   ├── audit-logs/
    │   │   │   ├── dashboard/
    │   │   │   ├── manage-doctors/
    │   │   │   ├── manage-notifications/
    │   │   │   ├── manage-posts/
    │   │   │   └── manage-users/
    │   │   │   └── layout.tsx
    │   │   ├── doctor/
    │   │   │   ├── (no-side-bar)/
    │   │   │   ├── (side-bar)/
    │   │   │   └── layout.tsx
    │   │   ├── medical-records/
    │   │   │   ├── [recordId]/
    │   │   │   └── layout.tsx
    │   │   └── patient/
    │   │       ├── (no-side-bar)/
    │   │       │   ├── profile/
    │   │       │   └── layout.tsx
    │   │       ├── (side-bar)/
    │   │       └── layout.tsx
    │   │   └── layout.tsx
    │   ├── (public)/
    │   │   ├── about-us/
    │   │   ├── active-account/
    │   │   ├── doctors/
    │   │   ├── forgot-password/
    │   │   ├── forum/
    │   │   ├── login/
    │   │   ├── register/
    │   │   ├── reset-password/
    │   │   ├── verify-otp/
    │   │   └── layout.tsx
    │   ├── 403/
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── features/
    │   ├── account/
    │   ├── admin/
    │   ├── aiTools/
    │   ├── appointment/
    │   ├── auth/
    │   ├── chatbot/
    │   ├── common/
    │   ├── doctor/
    │   ├── drug/
    │   ├── forum/
    │   ├── medical-records/
    │   ├── notification/
    │   ├── otp/
    │   ├── patient/
    │   └── prescription/
    ├── lib/
    ├── providers/
    └── shared/
        ├── components/
        ├── layouts/
        ├── sections/
        ├── services/
        └── ui/
        ├── AuthContext.tsx
        ├── ConfirmDialogContext.tsx
        ├── CustomToast.tsx
        ├── ToastProvider.tsx
        └── type.ts
├── .env.local
└── .gitignore
```
 
---
 
## 🔗 Liên kết
 
- 🖥 Backend Repository: [wellcare4u-be](https://github.com/xuanbao0204/wellcare4u-be)
- 📄 Báo cáo đồ án: *(liên kết sau khi hoàn thiện)*
 

