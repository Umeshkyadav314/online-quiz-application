import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { subjectQueries, userQueries } from "@/lib/database"

export async function GET() {
  try {
    const subjects = subjectQueries.getAll.all()
    return NextResponse.json({ subjects })
  } catch (error) {
    console.error("Error fetching subjects:", error)
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 })
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

    const { name, description } = await request.json()
    
    if (!name) {
      return NextResponse.json({ error: "Subject name is required" }, { status: 400 })
    }

    subjectQueries.create.run(name, description)
    
    return NextResponse.json({ message: "Subject created successfully" })
  } catch (error) {
    console.error("Error creating subject:", error)
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 })
  }
}
