import path from "node:path";
import fs from "node:fs";
import type { Answer, Question, Topic } from "@/lib/types";

export type SampleShape = {
  topics: Topic[];
  questions: Question[];
};

let cache: SampleShape | null = null;

function loadJSON(): SampleShape {
  if (cache) return cache;
  const file = path.join(process.cwd(), "src", "data", "sample.json");
  const raw = fs.readFileSync(file, "utf-8");
  const parsed = JSON.parse(raw) as SampleShape;
  cache = parsed;
  return parsed;
}

export function getTopics(): Topic[] {
  return loadJSON().topics;
}

export function getQuestions(opts?: { topicId?: string | null }): Question[] {
  const all = loadJSON().questions;
  if (!opts?.topicId) return all;
  return all.filter((q) => q.topicId === opts.topicId);
}

export function paginate<T>(items: T[], page = 1, pageSize = 20) {
  const p = Math.max(1, page);
  const size = Math.max(1, Math.min(1000, pageSize));
  const start = (p - 1) * size;
  const end = start + size;
  const slice = items.slice(start, end);
  return {
    items: slice,
    total: items.length,
    page: p,
    pageSize: size,
  };
}

/**
 * Utility to randomly pick N questions, optionally within a topic.
 */
export function pickRandomQuestions(count: number, topicId?: string | null): Question[] {
  const pool = getQuestions({ topicId: topicId ?? undefined });
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.max(0, Math.min(count, pool.length)));
}

/**
 * Score submission against provided questions.
 */
export function scoreSubmission(questions: Question[], responses: { questionId: string; answerId: string | null }[]) {
  const qMap = new Map(questions.map((q) => [q.id, q]));
  const details = responses.map((r) => {
    const q = qMap.get(r.questionId);
    const correctAns = q?.answers.find((a: Answer) => a.isCorrect) || null;
    const correct = !!(correctAns && r.answerId && r.answerId === correctAns.id);
    return {
      questionId: r.questionId,
      correctAnswerId: correctAns?.id ?? "",
      selectedAnswerId: r.answerId ?? null,
      isCorrect: correct,
    };
  });
  const correctCount = details.filter((d) => d.isCorrect).length;
  const total = questions.length;
  const scorePercent = total === 0 ? 0 : Math.round((correctCount / total) * 100);
  return { details, correctCount, total, scorePercent };
}
