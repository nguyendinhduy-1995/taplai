import { NextRequest, NextResponse } from "next/server";
import { pickRandomQuestions } from "../../_lib/data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { count = 25, topicId } = body;

    // Randomly pick questions
    const questions = pickRandomQuestions(count, topicId ?? undefined);

    if (questions.length === 0) {
      return NextResponse.json({ error: "No questions available" }, { status: 400 });
    }

    // Return question IDs only (hide correct answers from client)
    const questionIds = questions.map((q) => q.id);

    return NextResponse.json({ questionIds });
  } catch (error) {
    console.error("Error starting exam:", error);
    return NextResponse.json({ error: "Failed to start exam" }, { status: 500 });
  }
}

