"use client"

import useSWR from "swr"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { QuestionCard } from "./question-card"
import type { QuestionPublic, ScoreResult } from "@/lib/types"

type QuestionsResponse = { quizId: string; questions: QuestionPublic[] }

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const QUIZ_DURATION_SECONDS = 60

export function QuizContainer() {
  const router = useRouter()
  const { data, error, isLoading } = useSWR<QuestionsResponse>("/api/questions", fetcher)
  const total = data?.questions.length ?? 0
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Array<number | null>>([])
  const [secondsLeft, setSecondsLeft] = useState(QUIZ_DURATION_SECONDS)
  const [submitting, setSubmitting] = useState(false)

  // Initialize answers array when questions load
  useEffect(() => {
    if (data?.questions) {
      setAnswers(Array(data.questions.length).fill(null))
    }
  }, [data?.questions])

  // Timer: auto-submit when 0
  useEffect(() => {
    if (!total) return
    if (secondsLeft <= 0) {
      void submit()
      return
    }
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [secondsLeft, total]) // eslint-disable-line react-hooks/exhaustive-deps

  const canPrev = current > 0
  const canNext = data?.questions && current < data.questions.length - 1
  const canSubmit = data?.questions && current === data.questions.length - 1

  const onSelect = useCallback(
    (idx: number) => {
      setAnswers((prev) => {
        const copy = [...prev]
        copy[current] = idx
        return copy
      })
    },
    [current],
  )

  const next = useCallback(() => {
    if (canNext) setCurrent((c) => c + 1)
  }, [canNext])

  const prev = useCallback(() => {
    if (canPrev) setCurrent((c) => c - 1)
  }, [canPrev])

  const formattedTime = useMemo(() => {
    const m = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, "0")
    const s = (secondsLeft % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }, [secondsLeft])

  const submit = useCallback(async () => {
    if (!data?.questions || submitting) return
    try {
      setSubmitting(true)
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      })
      if (!res.ok) throw new Error("Failed to submit")
      const result: ScoreResult = await res.json()
      // Persist for results page (bonus: right/wrong details)
      localStorage.setItem("quizResult", JSON.stringify(result))
      router.push("/results")
    } catch (e) {
      console.error("[v0] submit error:", (e as Error).message)
      alert("Submission failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }, [answers, data?.questions, router, submitting])

  if (isLoading) {
    return <div className="text-center py-10">Loading quiz…</div>
  }
  if (error || !data?.questions?.length) {
    return <div className="text-center py-10">Failed to load questions.</div>
  }

  const q = data.questions[current]
  const selected = answers[current]

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{`Question ${current + 1} of ${total}`}</CardTitle>
          <div className="text-sm px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
            Time left: {formattedTime}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <QuestionCard question={q} selectedIndex={selected} onSelect={onSelect} />
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2">
        <Button variant="outline" onClick={prev} disabled={!canPrev}>
          Previous
        </Button>
        {canNext && (
          <Button onClick={next} disabled={selected === null}>
            Next
          </Button>
        )}
        {canSubmit && (
          <Button onClick={submit} disabled={selected === null || submitting}>
            {submitting ? "Submitting…" : "Submit"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
