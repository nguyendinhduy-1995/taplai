# TậpLái — Luyện Thi Giấy Phép Lái Xe

Ứng dụng PWA luyện thi lý thuyết lái xe ô tô 600 câu — theo Thông tư 12/2025/TT-BCA & Luật TTATGT 2024.

## Tech Stack

- **Framework**: Next.js 16 + React 19
- **Database**: Prisma
- **Styling**: Tailwind CSS v4
- **PWA**: Service Worker + Web App Manifest

## Getting Started

```bash
cd app
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## PWA

Ứng dụng hỗ trợ cài đặt như app native:

1. Mở trên Chrome/Edge
2. Nhấn biểu tượng "Cài đặt" trên thanh địa chỉ
3. Hoặc vào **Settings → Add to Home Screen** trên điện thoại

### Tính năng offline
- Cache trang chủ và static assets
- Fallback offline khi mất mạng
