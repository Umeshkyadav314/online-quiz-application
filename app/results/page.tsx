import { redirect } from "next/navigation"
import { getUserFromRequest } from "@/lib/auth"
import { ResultsClient } from "@/components/quiz/results-client"

export default function ResultsPage() {
  const user = getUserFromRequest()
  if (!user) {
    redirect("/login")
  }
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Results</h1>
      </div>
      <ResultsClient />
    </div>
  )
}
