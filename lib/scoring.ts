import type { Question, ScoreResult, ScoreDetail } from "./types"

export function scoreQuiz(questions: Question[], answers: Array<number | null>): ScoreResult {
  const details: ScoreDetail[] = questions.map((q, i) => {
    const userIndex = answers[i] ?? null
    const isCorrect = userIndex !== null && userIndex === q.correctIndex
    return {
      questionId: q.id,
      correctIndex: q.correctIndex,
      userIndex,
      isCorrect,
    }
  })
  const score = details.filter((d) => d.isCorrect).length
  return { score, total: questions.length, details }
}
