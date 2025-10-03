import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { userQueries } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest()
    
    if (!user) {
      return NextResponse.json({ user: null })
    }

    // Get user details from database
    const userDetails = userQueries.findByEmail.get(user.email) as any
    
    if (!userDetails) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        email: userDetails.email,
        name: userDetails.name,
        role: userDetails.role,
        profileImage: userDetails.profile_image
      }
    })
  } catch (error) {
    console.error("Error getting user:", error)
    return NextResponse.json({ user: null })
  }
}
