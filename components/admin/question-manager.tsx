"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Question {
  id: number
  text: string
  options: string
  correct_index: number
  difficulty: string
  explanation: string
  subject_name: string
  topic_name: string
  created_at: string
}

interface Subject {
  id: number
  name: string
}

interface Topic {
  id: number
  name: string
  subject_id: number
}

export default function QuestionManager() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [formData, setFormData] = useState({
    subjectId: "",
    topicId: "",
    text: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    difficulty: "medium",
    explanation: ""
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [questionsRes, subjectsRes] = await Promise.all([
        fetch('/api/admin/questions'),
        fetch('/api/admin/subjects')
      ])
      
      const questionsData = await questionsRes.json()
      const subjectsData = await subjectsRes.json()
      
      setQuestions(questionsData.questions)
      setSubjects(subjectsData.subjects)
    } catch (error) {
      toast.error("Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  const fetchTopics = async (subjectId: string) => {
    if (!subjectId) return
    try {
      const response = await fetch(`/api/admin/subjects/${subjectId}/topics`)
      const data = await response.json()
      setTopics(data.topics || [])
    } catch (error) {
      console.error("Failed to fetch topics:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingQuestion 
        ? `/api/admin/questions/${editingQuestion.id}`
        : '/api/admin/questions'
      
      const method = editingQuestion ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        toast.success(editingQuestion ? "Question updated" : "Question created")
        fetchData()
        resetForm()
        setIsDialogOpen(false)
      } else {
        toast.error("Failed to save question")
      }
    } catch (error) {
      toast.error("Failed to save question")
    }
  }

  const handleEdit = (question: Question) => {
    const options = JSON.parse(question.options)
    setFormData({
      subjectId: question.id.toString(),
      topicId: "",
      text: question.text,
      options: options,
      correctIndex: question.correct_index,
      difficulty: question.difficulty,
      explanation: question.explanation || ""
    })
    setEditingQuestion(question)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this question?")) return
    
    try {
      const response = await fetch(`/api/admin/questions/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast.success("Question deleted")
        fetchData()
      } else {
        toast.error("Failed to delete question")
      }
    } catch (error) {
      toast.error("Failed to delete question")
    }
  }

  const resetForm = () => {
    setFormData({
      subjectId: "",
      topicId: "",
      text: "",
      options: ["", "", "", ""],
      correctIndex: 0,
      difficulty: "medium",
      explanation: ""
    })
    setEditingQuestion(null)
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  if (loading) {
    return <div>Loading questions...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Manage Questions</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingQuestion ? "Edit Question" : "Add New Question"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select 
                    value={formData.subjectId} 
                    onValueChange={(value) => {
                      setFormData({ ...formData, subjectId: value })
                      fetchTopics(value)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="topic">Topic</Label>
                  <Select 
                    value={formData.topicId} 
                    onValueChange={(value) => setFormData({ ...formData, topicId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map(topic => (
                        <SelectItem key={topic.id} value={topic.id.toString()}>
                          {topic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="text">Question Text</Label>
                <Textarea
                  id="text"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Enter the question..."
                  required
                />
              </div>

              <div>
                <Label>Options</Label>
                <div className="space-y-2">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                      <input
                        type="radio"
                        name="correct"
                        checked={formData.correctIndex === index}
                        onChange={() => setFormData({ ...formData, correctIndex: index })}
                      />
                      <span className="text-sm text-muted-foreground">Correct</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select 
                    value={formData.difficulty} 
                    onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="explanation">Explanation (Optional)</Label>
                <Textarea
                  id="explanation"
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Explain why this is the correct answer..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingQuestion ? "Update" : "Create"} Question
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {questions.map(question => (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{question.text}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {question.subject_name} • {question.topic_name} • {question.difficulty}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(question)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(question.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {JSON.parse(question.options).map((option: string, index: number) => (
                  <div key={index} className={`p-2 rounded ${index === question.correct_index ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    {String.fromCharCode(65 + index)}. {option}
                    {index === question.correct_index && <span className="ml-2 text-green-600 dark:text-green-400">✓</span>}
                  </div>
                ))}
              </div>
              {question.explanation && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded">
                  <p className="text-sm"><strong>Explanation:</strong> {question.explanation}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
