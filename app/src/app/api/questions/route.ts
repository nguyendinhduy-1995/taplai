import { NextRequest, NextResponse } from "next/server";
import { getQuestions } from "../_lib/data";
import type { Question } from "@/lib/types";

interface SafeAnswer {
  id: string;
  content: string;
}

interface SafeQuestion {
  id: string;
  content: string;
  explanation?: string;
  imageUrl?: string | null;
  topicId: string;
  isCritical?: boolean;
  answers: SafeAnswer[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get("topicId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);

    // Get questions, optionally filtered by topic
    const allQuestions = getQuestions({ topicId: topicId ?? undefined });

    // Paginate
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedQuestions = allQuestions.slice(start, end);

    // Strip correct answer info from response (hide from client during exam)
    const safeQuestions: SafeQuestion[] = paginatedQuestions.map((q: Question) => ({
      id: q.id,
      content: q.content,
      explanation: q.explanation,
      imageUrl: q.imageUrl,
      topicId: q.topicId,
      isCritical: q.isCritical,
      answers: q.answers.map((a) => ({
        id: a.id,
        content: a.content,
        // isCorrect intentionally omitted
      })),
    }));

    const totalPages = Math.ceil(allQuestions.length / pageSize);

    return NextResponse.json({
      questions: safeQuestions,
      pagination: {
        total: allQuestions.length,
        page,
        pageSize,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}

