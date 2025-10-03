import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <section className="max-w-2xl mx-auto text-center space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-balance">Take the Web Basics Quiz</h1>
        <p className="text-muted-foreground text-pretty">
          Test your knowledge with a short quiz. Login or register to begin. You’ll have 60 seconds to complete it.
        </p>
        <div className="flex items-center  justify-center gap-3">
          {/* <Link href="/login">
            <Button variant="secondary">Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Register</Button>
          </Link> */}
          <Link href="/quiz">
            <Button className="cursor-pointer">Start Quiz</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
