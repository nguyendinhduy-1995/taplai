import { NextRequest, NextResponse } from "next/server";
import { getQuestions, scoreSubmission } from "../../_lib/data";
import type { Question } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionIds, responses } = body;

    // Load questions based on IDs provided in request
    const allQuestions = getQuestions();
    const questions: Question[] = allQuestions.filter((q: Question) => questionIds.includes(q.id));

    if (questions.length === 0) {
      return NextResponse.json({ error: "No questions found" }, { status: 400 });
    }

    // Score the submission
    const result = scoreSubmission(questions, responses);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error scoring submission:", error);
    return NextResponse.json({ error: "Failed to score submission" }, { status: 500 });
  }
}

