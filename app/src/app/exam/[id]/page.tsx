import { Suspense } from "react";
import ExamClient from "./ExamClient";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string; topicId?: string; type?: string; upgrade?: string }>;
}

/* ── Exam config lookup by type/upgrade ── */
interface ExamSpec {
  questions: number;
  time: number;   // seconds
  pass: number;
  label: string;
}

const EXAM_SPECS: Record<string, ExamSpec> = {
  // Thi mới
  "B": { questions: 35, time: 22 * 60, pass: 32, label: "Sát Hạch Hạng B" },
  "C1": { questions: 40, time: 24 * 60, pass: 36, label: "Sát Hạch Hạng C1" },
  // Nâng hạng 40 câu
  "B-C1": { questions: 40, time: 24 * 60, pass: 36, label: "Nâng Hạng B → C1" },
  "B-C": { questions: 40, time: 24 * 60, pass: 36, label: "Nâng Hạng B → C" },
  "B-D1": { questions: 40, time: 24 * 60, pass: 36, label: "Nâng Hạng B → D1" },
  "B-D2": { questions: 40, time: 24 * 60, pass: 36, label: "Nâng Hạng B → D2" },
  "C1-C": { questions: 40, time: 24 * 60, pass: 36, label: "Nâng Hạng C1 → C" },
  // Nâng hạng 45 câu
  "B-BE": { questions: 45, time: 26 * 60, pass: 42, label: "Nâng Hạng B → BE" },
  "C1-C1E": { questions: 45, time: 26 * 60, pass: 42, label: "Nâng Hạng C1 → C1E" },
  "C-D1": { questions: 45, time: 26 * 60, pass: 42, label: "Nâng Hạng C → D1" },
  "C-D2": { questions: 45, time: 26 * 60, pass: 42, label: "Nâng Hạng C → D2" },
  "C-D": { questions: 45, time: 26 * 60, pass: 42, label: "Nâng Hạng C → D" },
  "C-CE": { questions: 45, time: 26 * 60, pass: 42, label: "Nâng Hạng C → CE" },
  "D1-D2": { questions: 45, time: 26 * 60, pass: 42, label: "Nâng Hạng D1 → D2" },
  "D1-D": { questions: 45, time: 26 * 60, pass: 42, label: "Nâng Hạng D1 → D" },
  "D1-D1E": { questions: 45, time: 26 * 60, pass: 42, label: "Nâng Hạng D1 → D1E" },
  "D2-D": { questions: 45, time: 26 * 60, pass: 42, label: "Nâng Hạng D2 → D" },
  "D2-D2E": { questions: 45, time: 26 * 60, pass: 42, label: "Nâng Hạng D2 → D2E" },
};

async function getQuestions(topicId?: string, pageSize?: number, mode?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const params = new URLSearchParams();
  params.set("pageSize", String(pageSize || 600));
  if (topicId) params.set("topicId", topicId);
  if (mode) params.set("mode", mode);

  const res = await fetch(`${baseUrl}/api/questions?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) {
    return { questions: [], pagination: { total: 0, page: 1, pageSize: 600, totalPages: 0 } };
  }
  return res.json();
}

export default async function ExamPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { mode, topicId, type, upgrade } = await searchParams;

  const isPractice = mode === "practice";

  // Determine exam spec from type or upgrade key
  const specKey = upgrade || type || null;
  const spec = specKey ? EXAM_SPECS[specKey] : null;

  const questionCount = spec ? spec.questions : (parseInt(id, 10) || 35);
  const timeLimit = isPractice ? 0 : (spec ? spec.time : questionCount <= 35 ? 22 * 60 : questionCount <= 40 ? 24 * 60 : 26 * 60);
  const passThreshold = spec ? spec.pass : (questionCount <= 35 ? 32 : questionCount <= 40 ? 36 : 42);
  const examLabel = spec ? spec.label : (isPractice ? "Luyện Tập" : `Sát Hạch — ${questionCount} Câu`);

  const data = await getQuestions(topicId, questionCount, isPractice ? "practice" : undefined);
  const questions = data.questions || [];

  const examConfig = {
    id,
    questionCount,
    isPractice,
    topicId: topicId || null,
    timeLimit,
    passThreshold,
    examLabel,
  };

  return (
    <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", color: "#64748b" }}>Đang tải...</div>}>
      <ExamClient
        initialQuestions={questions}
        config={examConfig}
      />
    </Suspense>
  );
}
