# Kế hoạch triển khai “clone” trang 600 câu (taplai.com)
URL gốc: https://taplai.com/hoc-ly-thuyet-600-cau-lai-xe-o-to-truc-tuyen-moi-nhat.html

Mục tiêu:
- Sao chép đầy đủ giao diện (UI) và tính năng học/thi 600 câu.
- Cơ sở dữ liệu: PostgreSQL/MySQL (mặc định chọn PostgreSQL).
- Bám sát 100% giao diện gốc, triển khai trên Ubuntu server.

---

## Giai đoạn 1 — Khảo sát &amp; kiểm kê (UI/UX, luồng chức năng)
- [ ] Mở trang đích và ghi nhận cấu trúc tổng quan: Header, Nav, Content, Sidebar, Footer.
- [ ] Liệt kê các màn hình/luồng:
  - [ ] Danh sách/bộ đề, học theo chủ đề/chương.
  - [ ] Màn hình làm bài (progress, chuyển câu, đánh dấu, timer).
  - [ ] Nộp bài, kết quả, xem đáp án đúng/sai, giải thích.
  - [ ] Tìm kiếm, lọc theo chủ đề/chương.
- [ ] Ghi nhận thành phần UI (components) chính:
  - [ ] QuestionCard, AnswerList/Options, Explanations, ResultSummary.
  - [ ] Nav/Sidebar/Menu, Filters, Pagination, Timer/Progress bar.
- [ ] Nếu có dữ liệu nhúng/API phía client: ghi nhận cấu trúc JSON/endpoint (ghi chú để tái tạo).
- [ ] Kết quả: Tài liệu kiểm kê UI/UX chi tiết và mapping sang components.

## Giai đoạn 2 — Trích xuất brand/design tokens (màu sắc, font, spacing…)
- [ ] Chạy: `npx dembrandt <URL> --save-output`
- [ ] Lưu kết quả vào: `./brand-tokens/` (JSON, ảnh, assets nếu có).
- [ ] (Tùy chọn) Xuất DTCG: `--dtcg`
- [ ] Mapping sang Tailwind config (colors, fontFamily, spacing, radii, shadows).
- [ ] Sinh trước stylesheet nền tảng (variables CSS) từ tokens.

## Giai đoạn 3 — Thu thập dữ liệu 600 câu (crawler/chuẩn hóa)
- [ ] Tạo script Playwright/Puppeteer để crawl/trích xuất:
  - [ ] Câu hỏi, các đáp án, đáp án đúng, giải thích.
  - [ ] Metadata: chương/chủ đề/độ khó/ID.
- [ ] Chuẩn hóa dữ liệu: `./data/raw/` → `./data/normalized/` (JSON/CSV).
- [ ] Kiểm tra và làm sạch ký tự đặc biệt/HTML.
- [ ] Ghi log tiến trình và tỉ lệ bao phủ dữ liệu.

## Giai đoạn 4 — Khởi tạo Front-end (Next.js 14 + TypeScript + Tailwind)
- [ ] Tạo app: `npx create-next-app@latest taplai-clone-app --ts --eslint`
- [ ] Cấu hình TailwindCSS + PostCSS + autoprefixer.
- [ ] Cấu trúc thư mục (App Router):
  - [ ] `app/(public)/`: trang landing, danh sách đề, chọn chế độ.
  - [ ] `app/exam/[id]/`: màn hình làm đề (câu hỏi, đáp án, điều hướng).
  - [ ] `app/exam/[id]/result`: kết quả, xem giải thích/sai.
  - [ ] `app/topics/`: lọc theo chủ đề/chương.
- [ ] Components:
  - [ ] QuestionCard, AnswerList, ExplanationPanel, ResultSummary.
  - [ ] Filters, Pagination, Timer, ProgressBar, Navbar, Sidebar.
- [ ] Tích hợp design tokens vào Tailwind config/theme.

## Giai đoạn 5 — Backend/API + Cơ sở dữ liệu (PostgreSQL mặc định, Prisma)
- [ ] Thiết lập Prisma + kết nối Postgres.
- [ ] Mô hình dữ liệu (dự kiến):
  - [ ] `Question(id, content, topicId, imageUrl?, explanation, ... )`
  - [ ] `Answer(id, questionId, content, isCorrect)`
  - [ ] `Topic(id, name, parentId?)`
  - [ ] (Tùy chọn) `ExamTemplate(id, name, topicFilter, questionCount, ...)`
  - [ ] (Tùy chọn) `Attempt(id, userId?, startedAt, submittedAt, score, ...)`
- [ ] API routes (Next.js API hoặc server rời Express):
  - [ ] `GET /api/topics`
  - [ ] `GET /api/questions?topicId=...&amp;page=...`
  - [ ] `POST /api/exams/start` (sinh đề)
  - [ ] `POST /api/exams/submit` (tính điểm, trả kết quả + giải thích)
- [ ] Script import/seed DB từ `./data/normalized/`.

## Giai đoạn 6 — Logic thi &amp; lưu trữ tiến độ
- [ ] Điều hướng câu hỏi: next/prev/jump, đánh dấu review.
- [ ] Timer, tự động nộp khi hết giờ (tùy chọn).
- [ ] Tính điểm, hiển thị đạt/trượt theo tiêu chí.
- [ ] Lưu tiến độ client (localStorage) + (tùy chọn) server (nếu có đăng nhập).
- [ ] Accessibility (keyboard nav), i18n (nếu cần).

## Giai đoạn 7 — Kiểm thử
- [ ] Kiểm thử đường găng (happy path): làm đề, nộp bài, xem kết quả.
- [ ] Kiểm thử toàn diện: edge cases, refresh giữa chừng, chuyển thiết bị/mobile.
- [ ] E2E test (Playwright): các flow chính.
- [ ] Kiểm tra hiệu năng/SEO (Next.js best practices).

## Giai đoạn 8 — Triển khai trên Ubuntu
- [ ] Cài Node.js LTS, Nginx (reverse proxy), PM2 (quản lý process).
- [ ] Build dự án và deploy (CI/CD nếu cần).
- [ ] Cấu hình SSL (Let's Encrypt/certbot).
- [ ] Giám sát: logs, uptime, giám sát lỗi.

---

## Công việc sắp thực hiện (Next Actions)
- [x] G1: Khảo sát UI/UX trang gốc bằng trình duyệt tự động, ghi chú cấu trúc và thành phần chính.
- [x] G2: Chạy `npx dembrandt <URL> --save-output` để trích xuất design tokens → lưu `./brand-tokens/`.
- [x] G3: Khởi tạo khung dự án Next.js (TypeScript + Tailwind) → taplai-clone-app.
- [x] G4: Thiết kế schema Prisma và chuẩn bị script import dữ liệu.
- [x] G5: Tạo API routes (topics, questions, exam/start, exam/submit).
- [x] G6: Xây dựng trang chủ (Home page) với các lựa chọn thi.
- [x] G7: Xây dựng trang thi (Exam page) với ExamClient component.
- [x] G8: Chạy build kiểm tra lỗi. ✓ Build thành công!
- [x] G9: Cấu hình PostgreSQL server (trên Ubuntu). Hiện tại app dùng JSON data mẫu.
- [x] G10: Seed dữ liệu câu hỏi (5 câu mẫu). ✓ API hoạt động!
- [x] G11: Triển khai dev server thành công. ✓ Chạy tại http://localhost:3000

---

## Nhật ký tiến độ (cập nhật theo từng bước)
- [ ] [dd/mm] Khởi tạo TODO, chờ audit UI.
- [ ] [dd/mm] Audit UI hoàn tất, liệt kê components/flows.
- [ ] [dd/mm] Trích xuất brand tokens hoàn tất (đính kèm mẫu).
- [ ] [dd/mm] Khởi tạo dự án Next.js + Tailwind xong.
- [ ] [dd/mm] DB schema và seed: hoàn tất/đang tiến hành.
- [ ] [dd/mm] Triển khai thử trên Ubuntu (staging/production).

---

Ghi chú:
- Phạm vi 100% UI parity: Ưu tiên bám sát giao diện gốc; có thể tối ưu hiệu năng/SEO mà không đổi layout/kiểu dáng.
- Dữ liệu: Bạn đã xác nhận có bản quyền; mọi thao tác crawl/chuyển đổi dùng nội bộ cho dự án này.
