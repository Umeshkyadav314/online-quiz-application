export interface Question {
  id: number
  subject_id: number
  topic_id?: number
  text: string
  options: string[]
  correct_index: number
  difficulty: 'easy' | 'medium' | 'hard'
  explanation?: string
  created_by?: string
  created_at: string
  updated_at: string
  subject_name?: string
  topic_name?: string
}

export type QuestionPublic = Omit<Question, "correct_index">

export interface ScoreDetail {
  questionId: number
  correctIndex: number
  userIndex: number | null
  isCorrect: boolean
  timeSpent?: number
  questionText?: string
}

export interface ScoreResult {
  score: number
  total: number
  percentage: number
  correctAnswers: number
  wrongAnswers: number
  skippedAnswers: number
  timeTaken: number
  subjectId?: number
  subjectName?: string
  details: ScoreDetail[]
}

export interface User {
  id: number
  email: string
  password: string
  name?: string
  profile_image?: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export interface Subject {
  id: number
  name: string
  description?: string
  created_at: string
}

export interface Topic {
  id: number
  subject_id: number
  name: string
  description?: string
  created_at: string
}

export interface QuizResult {
  id: number
  user_email: string
  subject_id?: number
  score: number
  total_questions: number
  percentage: number
  correct_answers: number
  wrong_answers: number
  skipped_answers: number
  time_taken?: number
  completed_at: string
  subject_name?: string
}

export interface QuizResultDetail {
  id: number
  result_id: number
  question_id: number
  user_answer?: number
  is_correct: boolean
  time_spent?: number
  question_text?: string
  options?: string
  explanation?: string
}
