"use client"

import { memo } from "react"
import type { QuestionPublic } from "@/lib/types"

interface Props {
  question: QuestionPublic
  selectedIndex: number | null
  onSelect: (index: number) => void
}

export const QuestionCard = memo(function QuestionCard({ question, selectedIndex, onSelect }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">{question.text}</p>
      <ul className="grid gap-3">
        {question.options.map((opt, idx) => (
          <li key={idx}>
            <label className="flex items-center gap-3 cursor-pointer rounded-md border p-3 hover:bg-accent">
              <input
                type="radio"
                name={`q-${question.id}`}
                className="accent-primary"
                checked={selectedIndex === idx}
                onChange={() => onSelect(idx)}
                aria-label={`Option ${idx + 1}`}
              />
              <span>{opt}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
})
