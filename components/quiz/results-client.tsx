"use client"

import { useEffect, useState } from "react"
import type { ScoreResult } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ResultsClient() {
  const [result, setResult] = useState<ScoreResult | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("quizResult")
      if (raw) {
        setResult(JSON.parse(raw))
      }
    } catch (e) {
      console.error("[v0] Failed to read results:", (e as Error).message)
    }
  }, [])

  if (!result) {
    return <div className="text-center py-10">No results found. Please take the quiz first.</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{`Your Score: ${result.score} / ${result.total}`}</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Answer Review</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {result.details.map((d, i) => (
              <li
                key={d.questionId}
                className={`rounded-md border p-3 ${d.isCorrect ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{`Question ${i + 1}`}</span>
                  <span
                    className={`text-sm ${d.isCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}
                  >
                    {d.isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>
                {!d.isCorrect && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {`Your answer: ${d.userIndex !== null ? d.userIndex + 1 : "No answer"} • Correct answer: ${d.correctIndex + 1}`}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
