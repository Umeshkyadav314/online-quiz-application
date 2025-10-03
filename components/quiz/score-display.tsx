"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Trophy, Target, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface ScoreData {
  score: number
  total: number
  percentage: number
  correctAnswers: number
  wrongAnswers: number
  skippedAnswers: number
  timeTaken: number
  subjectName: string
  completedAt: string
  details: {
    questionId: number
    questionText: string
    userAnswer: number | null
    correctIndex: number
    isCorrect: boolean
    timeSpent: number
  }[]
}

interface ScoreDisplayProps {
  scoreData: ScoreData
}

const COLORS = {
  correct: '#10b981',
  wrong: '#ef4444',
  skipped: '#f59e0b'
}

export default function ScoreDisplay({ scoreData }: ScoreDisplayProps) {
  const accuracyData = [
    { name: 'Correct', value: scoreData.correctAnswers, color: COLORS.correct },
    { name: 'Wrong', value: scoreData.wrongAnswers, color: COLORS.wrong },
    { name: 'Skipped', value: scoreData.skippedAnswers, color: COLORS.skipped }
  ]

  const difficultyData = [
    { name: 'Easy', correct: 8, wrong: 2 },
    { name: 'Medium', correct: 6, wrong: 4 },
    { name: 'Hard', correct: 4, wrong: 6 }
  ]

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return { message: "Excellent!", color: "text-green-600", icon: Trophy }
    if (percentage >= 80) return { message: "Great job!", color: "text-blue-600", icon: Target }
    if (percentage >= 70) return { message: "Good work!", color: "text-yellow-600", icon: CheckCircle }
    if (percentage >= 60) return { message: "Not bad!", color: "text-orange-600", icon: AlertCircle }
    return { message: "Keep practicing!", color: "text-red-600", icon: XCircle }
  }

  const performance = getPerformanceMessage(scoreData.percentage)
  const PerformanceIcon = performance.icon

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PerformanceIcon className={`h-6 w-6 ${performance.color}`} />
              Quiz Results
            </CardTitle>
            <Badge variant="outline" className="text-sm">
              {scoreData.subjectName}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {scoreData.score}/{scoreData.total}
              </div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${performance.color}`}>
                {scoreData.percentage.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {formatTime(scoreData.timeTaken)}
              </div>
              <div className="text-sm text-muted-foreground">Time Taken</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {performance.message}
              </div>
              <div className="text-sm text-muted-foreground">Performance</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>{scoreData.percentage.toFixed(1)}%</span>
            </div>
            <Progress value={scoreData.percentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Answer Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Answer Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={accuracyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {accuracyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance by Difficulty */}
        <Card>
          <CardHeader>
            <CardTitle>Performance by Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={difficultyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="correct" fill={COLORS.correct} name="Correct" />
                <Bar dataKey="wrong" fill={COLORS.wrong} name="Wrong" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results */}
      <Card>
        <CardHeader>
          <CardTitle>Question Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scoreData.details.map((detail, index) => (
              <div key={detail.questionId} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Q{index + 1}:</span>
                    <span>{detail.questionText}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {detail.isCorrect ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Correct
                      </Badge>
                    ) : detail.userAnswer === null ? (
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Skipped
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        <XCircle className="h-3 w-3 mr-1" />
                        Wrong
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {detail.timeSpent}s
                    </Badge>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {detail.userAnswer !== null ? (
                    <>
                      Your answer: {String.fromCharCode(65 + detail.userAnswer)}
                      {!detail.isCorrect && (
                        <span className="ml-2 text-red-600">
                          (Correct answer: {String.fromCharCode(65 + detail.correctIndex)})
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-yellow-600">
                      No answer provided (Correct answer: {String.fromCharCode(65 + detail.correctIndex)})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
