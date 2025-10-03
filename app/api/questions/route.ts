import { NextResponse } from "next/server"
import { quizId, questions } from "@/lib/quiz-data"
import type { QuestionPublic } from "@/lib/types"

export async function GET() {
  const publicQuestions: QuestionPublic[] = questions.map((q) => ({
    id: q.id,
    text: q.text,
    options: q.options,
  }))
  return NextResponse.json({ quizId, questions: publicQuestions })
}
