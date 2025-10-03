import { redirect } from "next/navigation"
import { getUserFromRequest } from "@/lib/auth"
import { QuizContainer } from "@/components/quiz/quiz-container"
import { ThemeToggle } from "@/components/theme/theme-toggle"

export default function QuizPage() {
  const user = getUserFromRequest()
  if (!user) {
    redirect("/login")
  }
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Quiz</h1>
        {/* <ThemeToggle /> */}
      </div>
      <QuizContainer />
    </div>
  )
}
