import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { questionQueries, userQueries } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get("subjectId")
    const topicId = searchParams.get("topicId")
    
    let questions
    if (subjectId) {
      questions = questionQueries.getBySubject.all(parseInt(subjectId))
    } else if (topicId) {
      questions = questionQueries.getByTopic.all(parseInt(topicId))
    } else {
      questions = questionQueries.getAll.all()
    }
    
    return NextResponse.json({ questions })
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const userDetails = userQueries.findByEmail.get(user.email) as any
    if (!userDetails || userDetails.role !== 'admin') {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { subjectId, topicId, text, options, correctIndex, difficulty, explanation } = await request.json()
    
    if (!subjectId || !text || !options || correctIndex === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const optionsJson = JSON.stringify(options)
    questionQueries.create.run(subjectId, topicId, text, optionsJson, correctIndex, difficulty || 'medium', explanation, user.email)
    
    return NextResponse.json({ message: "Question created successfully" })
  } catch (error) {
    console.error("Error creating question:", error)
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 })
  }
}
