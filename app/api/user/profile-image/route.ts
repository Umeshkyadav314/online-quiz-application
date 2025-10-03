import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { userQueries } from "@/lib/database"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("profileImage") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "profiles")
    await mkdir(uploadsDir, { recursive: true })

    // Generate unique filename
    const fileExtension = path.extname(file.name)
    const fileName = `${user.email.replace("@", "_").replace(".", "_")}_${Date.now()}${fileExtension}`
    const filePath = path.join(uploadsDir, fileName)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Update user profile image in database
    const profileImageUrl = `/uploads/profiles/${fileName}`
    userQueries.updateProfileImage.run(profileImageUrl, user.email)

    return NextResponse.json({ profileImage: profileImageUrl })
  } catch (error) {
    console.error("Error uploading profile image:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
