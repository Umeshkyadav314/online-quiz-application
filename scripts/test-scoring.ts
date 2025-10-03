// Run inside v0 scripts runner. Outputs logs via console.log
import { scoreQuiz } from "@/lib/scoring"
import { questions } from "@/lib/quiz-data"

function run() {
  // Case 1: all correct
  const allCorrect = scoreQuiz(
    questions,
    questions.map((q) => q.correctIndex),
  )
  console.log("[v0] All Correct:", allCorrect)

  // Case 2: alternating wrong/null
  const mixed = scoreQuiz(
    questions,
    questions.map((q, i) => (i % 2 === 0 ? (q.correctIndex + 1) % q.options.length : null)),
  )
  console.log("[v0] Mixed:", mixed)

  // Case 3: none answered
  const none = scoreQuiz(questions, Array(questions.length).fill(null))
  console.log("[v0] None:", none)
}

run()
