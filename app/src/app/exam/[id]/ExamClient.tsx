"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface Answer {
  id: string;
  content: string;
}

interface Question {
  id: string;
  content: string;
  explanation?: string;
  imageUrl?: string | null;
  topicId: string;
  isCritical?: boolean;
  answers: Answer[];
}

interface ExamConfig {
  id: string;
  questionCount: number;
  isPractice: boolean;
  topicId: string | null;
  timeLimit: number; // seconds, 0 = unlimited
  passThreshold: number; // number of correct answers needed to pass
  examLabel: string; // e.g. "Sát Hạch Hạng B" or "Nâng Hạng B → C1"
}

interface ExamResult {
  correctCount: number;
  total: number;
  scorePercent: number;
  details: {
    questionId: string;
    correctAnswerId: string;
    selectedAnswerId: string | null;
    isCorrect: boolean;
  }[];
}

interface ExamClientProps {
  initialQuestions: Question[];
  config: ExamConfig;
}

export default function ExamClient({ initialQuestions, config }: ExamClientProps) {
  const [questions] = useState<Question[]>(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  // Timer
  useEffect(() => {
    if (config.timeLimit === 0 || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.timeLimit, isSubmitted]);

  const handleSelectAnswer = (questionId: string, answerId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
    // In practice mode, show explanation immediately
    if (config.isPractice) {
      setShowExplanation((prev) => ({ ...prev, [questionId]: true }));
    }
  };

  const handleSubmit = useCallback(async () => {
    const responses = questions.map((q) => ({
      questionId: q.id,
      answerId: selectedAnswers[q.id] || null,
    }));

    try {
      const res = await fetch(`/api/exam/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionIds: questions.map((q) => q.id),
          responses,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
    setIsSubmitted(true);
  }, [questions, selectedAnswers]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getAnswerClass = (questionId: string, answerId: string) => {
    const isSelected = selectedAnswers[questionId] === answerId;

    if (isSubmitted && result) {
      const detail = result.details?.find((d) => d.questionId === questionId);
      if (detail) {
        if (answerId === detail.correctAnswerId) return styles.answerCorrect;
        if (isSelected && answerId !== detail.correctAnswerId) return styles.answerWrong;
      }
    }

    if (isSelected) return styles.answerSelected;
    return styles.answerOption;
  };

  // ── Results Screen ──
  if (isSubmitted && result) {
    const passed = result.correctCount >= config.passThreshold;
    return (
      <div className={styles.page}>
        <header className={styles.siteHeader}>
          <div className={styles.headerInner}>
            <Link href="/" className={styles.logo}>🚗 Luyện Thi GPLX</Link>
          </div>
        </header>
        <div className={styles.resultContainer}>
          <div className={styles.resultCard}>
            <h1 className={styles.resultTitle}>Kết Quả: {config.examLabel}</h1>
            <div className={`${styles.scoreCircle} ${passed ? styles.scorePassed : styles.scoreFailed}`}>
              <span className={styles.scorePercent}>{result.scorePercent}%</span>
              <span className={styles.scoreLabel}>{passed ? "ĐẠT" : "KHÔNG ĐẠT"}</span>
            </div>
            <div className={styles.scoreStats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{result.correctCount}</span>
                <span className={styles.statLabel}>Câu đúng</span>
              </div>
              <div className={styles.statDivider}>/</div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{result.total}</span>
                <span className={styles.statLabel}>Tổng câu</span>
              </div>
            </div>
            <p className={styles.scoreNote}>Điểm đạt: ≥ {config.passThreshold}/{result.total} câu đúng + Không sai câu điểm liệt</p>
            <div className={styles.resultActions}>
              <button className={styles.retryButton} onClick={() => window.location.reload()}>
                Làm Lại
              </button>
              <Link href="/" className={styles.homeButton}>
                Về Trang Chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Đang tải câu hỏi...</p>
      </div>
    );
  }

  // ── Main Exam UI ──
  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.siteHeader}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logo}>🚗 Luyện Thi GPLX</Link>
          <span className={styles.headerExamInfo}>
            {config.examLabel} — {config.questionCount} Câu
          </span>
        </div>
      </header>

      {/* Timer Bar */}
      {config.timeLimit > 0 && (
        <div className={`${styles.timerBar} ${timeLeft < 300 ? styles.timerBarWarning : ""}`}>
          <span>Thời gian còn lại: <strong>{formatTime(timeLeft)}</strong></span>
        </div>
      )}

      {/* Two-Column Layout */}
      <div className={styles.examLayout}>
        {/* Left Column: Question Grid */}
        <aside className={styles.sidebar}>
          <div className={styles.questionGrid}>
            {questions.map((q, idx) => {
              let cls = styles.gridBtn;
              if (idx === currentIndex) cls += ` ${styles.gridBtnActive}`;
              else if (selectedAnswers[q.id]) cls += ` ${styles.gridBtnAnswered}`;
              return (
                <button key={q.id} className={cls} onClick={() => setCurrentIndex(idx)}>
                  {idx + 1}{q.isCritical ? "*" : ""}
                </button>
              );
            })}
          </div>
          <button className={styles.endExamBtn} onClick={handleSubmit}>
            Kết thúc thi
          </button>
          <div className={styles.sidebarStats}>
            Đã trả lời: {Object.keys(selectedAnswers).length}/{totalQuestions}
          </div>
        </aside>

        {/* Right Column: Question Content */}
        <section className={styles.questionArea}>
          {/* Top Navigation */}
          <div className={styles.navRow}>
            <button
              className={styles.navBtn}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              Câu Trước
            </button>
            <button
              className={styles.navBtnPrimary}
              onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              disabled={currentIndex === totalQuestions - 1}
            >
              Câu Sau
            </button>
          </div>

          {/* Question Card */}
          <div className={styles.questionCard}>
            <h2 className={styles.questionTitle}>
              <span className={styles.questionArrow}>↪</span>
              Câu {currentIndex + 1}: {currentQuestion.content}
              {currentQuestion.isCritical && (
                <span className={styles.criticalTag}>⚠️ Điểm liệt</span>
              )}
            </h2>

            {currentQuestion.imageUrl && (
              <img
                src={currentQuestion.imageUrl}
                alt={`Hình câu hỏi ${currentIndex + 1}`}
                className={styles.questionImage}
                loading="lazy"
              />
            )}

            {/* Answers */}
            <div className={styles.answersList}>
              {currentQuestion.answers.map((answer, idx) => (
                <button
                  key={answer.id}
                  className={getAnswerClass(currentQuestion.id, answer.id)}
                  onClick={() => handleSelectAnswer(currentQuestion.id, answer.id)}
                  disabled={isSubmitted}
                >
                  <span className={styles.answerNum}>{idx + 1}.</span>
                  <span className={styles.answerText}>{answer.content}</span>
                </button>
              ))}
            </div>

            {/* Explanation (Practice mode) */}
            {config.isPractice && showExplanation[currentQuestion.id] && currentQuestion.explanation && (
              <div className={styles.explanation}>
                <h4>📝 Giải thích:</h4>
                <p>{currentQuestion.explanation}</p>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className={styles.navRow}>
            <button
              className={styles.navBtn}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              Câu Trước
            </button>
            <button
              className={styles.navBtnPrimary}
              onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              disabled={currentIndex === totalQuestions - 1}
            >
              Câu Sau
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
