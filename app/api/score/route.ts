import { type NextRequest, NextResponse } from "next/server"
import { questions } from "@/lib/quiz-data"
import { scoreQuiz } from "@/lib/scoring"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const answers = (body.answers ?? []) as Array<number | null>
  if (!Array.isArray(answers) || answers.length !== questions.length) {
    return NextResponse.json({ error: "Invalid answers payload" }, { status: 400 })
  }
  const result = scoreQuiz(questions, answers)
  return NextResponse.json(result)
}
