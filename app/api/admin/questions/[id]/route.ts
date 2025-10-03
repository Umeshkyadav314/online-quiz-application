import { NextRequest, NextResponse } from "next/server"
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { getUserFromRequest } from "@/lib/auth"
import { questionQueries, userQueries } from "@/lib/database"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    questionQueries.update.run(subjectId, topicId, text, optionsJson, correctIndex, difficulty || 'medium', explanation, parseInt(params.id))

    return NextResponse.json({ message: "Question updated successfully" })
  } catch (error) {
    console.error("Error updating question:", error)
    return NextResponse.json({ error: "Failed to update question" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    questionQueries.delete.run(parseInt(params.id))

    return NextResponse.json({ message: "Question deleted successfully" })
  } catch (error) {
    console.error("Error deleting question:", error)
    return NextResponse.json({ error: "Failed to delete question" }, { status: 500 })
  }
}
