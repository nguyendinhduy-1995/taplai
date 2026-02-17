import { NextResponse } from "next/server";
import { getTopics } from "../_lib/data";

export async function GET() {
  const topics = getTopics();
  return NextResponse.json(topics);
}

