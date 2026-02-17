import Link from "next/link";
import styles from "./page.module.css";

const TOPIC_DATA = [
  { id: "t-khai-niem", name: "Khái niệm & Quy tắc", icon: "📖", count: 180 },
  { id: "t-van-hoa", name: "Văn hóa & Đạo đức", icon: "🌐", count: 35 },
  { id: "t-ky-thuat", name: "Kỹ thuật lái xe", icon: "🔧", count: 50 },
  { id: "t-cau-tao", name: "Cấu tạo & Sửa chữa", icon: "⚙️", count: 40 },
  { id: "t-bien-bao", name: "Hệ thống biển báo", icon: "🚧", count: 120 },
  { id: "t-tinh-huong", name: "Sa hình & Tình huống", icon: "⚠️", count: 115 },
];

/* ── Cấu hình thi sát hạch theo Thông tư 12/2025/TT-BCA ── */
const EXAM_TYPES = [
  {
    id: "b",
    href: "/exam/35?type=B",
    icon: "🚗",
    color: "linear-gradient(135deg, #2478c1, #1a5fa0)",
    badge: "Phổ biến",
    name: "Hạng B",
    desc: "Ô tô ≤ 9 chỗ, xe tải < 3.500 kg",
    questions: 35,
    time: 22,
    pass: 32,
  },
  {
    id: "c1",
    href: "/exam/40?type=C1",
    icon: "🚛",
    color: "linear-gradient(135deg, #059669, #047857)",
    name: "Hạng C1",
    desc: "Xe tải 3.500 – 7.500 kg",
    questions: 40,
    time: 24,
    pass: 36,
  },
];

/* ── Lộ trình nâng hạng (Luật TTATGT 2024 + TT 12/2025) ── */
const UPGRADE_PATHS = [
  // 40 câu / đạt 36
  { from: "B", to: "C1", questions: 40, time: 24, pass: 36, age: 18, exp: 2, color: "#2478c1" },
  { from: "B", to: "C", questions: 40, time: 24, pass: 36, age: 21, exp: 2, color: "#059669" },
  { from: "B", to: "D1", questions: 40, time: 24, pass: 36, age: 24, exp: 2, color: "#7c3aed" },
  { from: "B", to: "D2", questions: 40, time: 24, pass: 36, age: 24, exp: 3, color: "#9333ea" },
  { from: "C1", to: "C", questions: 40, time: 24, pass: 36, age: 21, exp: 2, color: "#059669" },
  // 45 câu / đạt 42
  { from: "B", to: "BE", questions: 45, time: 26, pass: 42, age: 21, exp: 2, color: "#0369a1" },
  { from: "C1", to: "C1E", questions: 45, time: 26, pass: 42, age: 24, exp: 2, color: "#0e7490" },
  { from: "C", to: "D1", questions: 45, time: 26, pass: 42, age: 24, exp: 2, color: "#7c3aed" },
  { from: "C", to: "D2", questions: 45, time: 26, pass: 42, age: 24, exp: 2, color: "#9333ea" },
  { from: "C", to: "D", questions: 45, time: 26, pass: 42, age: 27, exp: 3, color: "#dc2626" },
  { from: "C", to: "CE", questions: 45, time: 26, pass: 42, age: 24, exp: 3, color: "#b45309" },
  { from: "D1", to: "D2", questions: 45, time: 26, pass: 42, age: 24, exp: 2, color: "#9333ea" },
  { from: "D1", to: "D", questions: 45, time: 26, pass: 42, age: 27, exp: 2, color: "#dc2626" },
  { from: "D1", to: "D1E", questions: 45, time: 26, pass: 42, age: 27, exp: 2, color: "#b45309" },
  { from: "D2", to: "D", questions: 45, time: 26, pass: 42, age: 27, exp: 2, color: "#dc2626" },
  { from: "D2", to: "D2E", questions: 45, time: 26, pass: 42, age: 27, exp: 2, color: "#b45309" },
];

export default function Home() {

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.siteHeader}>
        <div className={styles.headerInner}>
          <span className={styles.logo}>🚗 Luyện Thi GPLX</span>
          <nav className={styles.headerNav}>
            <Link href="/">Trang chủ</Link>
            <Link href="/exam/600?mode=practice">Học 600 câu</Link>
            <Link href="/exam/35?type=B">Thi thử B</Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Luyện Thi Giấy Phép Lái Xe Ô Tô 2025
          </h1>
          <p className={styles.heroSubtitle}>
            Bộ 600 câu hỏi mới nhất — Theo Thông tư 12/2025/TT-BCA &amp; Luật TTATGT 2024
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>600</span>
              <span>câu hỏi</span>
            </div>
            <div className={styles.heroStatDivider}></div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>60</span>
              <span>câu điểm liệt</span>
            </div>
            <div className={styles.heroStatDivider}></div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>6</span>
              <span>chủ đề</span>
            </div>
          </div>
        </section>

        {/* ── Thi sát hạch lý thuyết ── */}
        <section className={styles.examSection}>
          <h2 className={styles.sectionTitle}>Thi Sát Hạch Lý Thuyết</h2>
          <div className={styles.examGrid}>
            {EXAM_TYPES.map((exam) => (
              <Link key={exam.id} href={exam.href} className={styles.examCard}>
                <div className={styles.examCardHeader} style={{ background: exam.color }}>
                  <span className={styles.examCardIcon}>{exam.icon}</span>
                  {exam.badge && <span className={styles.examCardBadge}>{exam.badge}</span>}
                </div>
                <div className={styles.examCardBody}>
                  <h3>{exam.name}</h3>
                  <p className={styles.examDesc}>{exam.desc}</p>
                  <div className={styles.examMeta}>
                    <span>📝 {exam.questions} câu</span>
                    <span>⏱️ {exam.time} phút</span>
                    <span>✅ Đạt {exam.pass}/{exam.questions}</span>
                  </div>
                </div>
              </Link>
            ))}

            {/* Học 600 câu */}
            <Link href="/exam/600?mode=practice" className={styles.examCard}>
              <div className={styles.examCardHeader} style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                <span className={styles.examCardIcon}>📚</span>
              </div>
              <div className={styles.examCardBody}>
                <h3>Học 600 Câu</h3>
                <p className={styles.examDesc}>Toàn bộ ngân hàng câu hỏi</p>
                <div className={styles.examMeta}>
                  <span>📝 600 câu</span>
                  <span>⏱️ Không giới hạn</span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* ── Nâng hạng bằng lái ── */}
        <section className={styles.upgradeSection}>
          <h2 className={styles.sectionTitle}>Thi Nâng Hạng Bằng Lái</h2>
          <p className={styles.sectionSubtitle}>
            Theo lộ trình Luật TTATGT 2024 — GPLX phải còn hiệu lực, không vi phạm nghiêm trọng
          </p>
          <div className={styles.upgradeGrid}>
            {UPGRADE_PATHS.map((u) => (
              <Link
                key={`${u.from}-${u.to}`}
                href={`/exam/${u.questions}?type=${u.to}&upgrade=${u.from}-${u.to}`}
                className={styles.upgradeCard}
              >
                <div className={styles.upgradeBadge} style={{ background: u.color }}>
                  {u.from} → {u.to}
                </div>
                <div className={styles.upgradeInfo}>
                  <span className={styles.upgradeDesc}>{u.from} lên {u.to}</span>
                  <span className={styles.upgradeMeta}>
                    {u.questions} câu • {u.time} phút • Đạt {u.pass}/{u.questions} • ≥{u.exp} năm KN • ≥{u.age} tuổi
                  </span>
                </div>
                <span className={styles.upgradeArrow}>→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Tiến độ theo chủ đề ── */}
        <section className={styles.progressSection}>
          <h2 className={styles.sectionTitle}>Tiến Độ Học Theo Chủ Đề</h2>
          <div className={styles.progressTable}>
            <div className={styles.tableHeader}>
              <span className={styles.colCategory}>Hạng mục</span>
              <span className={styles.colProgress}>Tiến độ</span>
              <span className={styles.colCount}>Số câu</span>
            </div>
            {TOPIC_DATA.map((topic) => (
              <Link
                key={topic.id}
                href={`/exam/600?mode=practice&topicId=${topic.id}`}
                className={styles.tableRow}
              >
                <span className={styles.colCategory}>
                  <span className={styles.topicIcon}>{topic.icon}</span>
                  {topic.name}
                </span>
                <span className={styles.colProgress}>
                  <span className={styles.progressBarOuter}>
                    <span className={styles.progressBarInner} style={{ width: "0%" }}></span>
                    <span className={styles.progressLabel}>0%</span>
                  </span>
                </span>
                <span className={styles.colCount}>0/{topic.count}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Lưu ý quan trọng ── */}
        <section className={styles.noticeSection}>
          <div className={styles.noticeCard}>
            <h3>⚠️ Quy định câu điểm liệt</h3>
            <p>Bộ 600 câu hỏi có <strong>60 câu điểm liệt</strong> về tình huống mất an toàn giao thông nghiêm trọng. Nếu trả lời sai <strong>bất kỳ câu điểm liệt nào</strong>, bài thi sẽ bị đánh <strong>TRƯỢT</strong> ngay lập tức, bất kể tổng số câu đúng.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2025 Luyện Thi GPLX — Theo Thông tư 12/2025/TT-BCA &amp; Luật TTATGT đường bộ 2024</p>
      </footer>
    </div>
  );
}
