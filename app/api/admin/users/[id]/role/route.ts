import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { userQueries } from "@/lib/database"

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

        const { role } = await request.json()

        if (!role || !['user', 'admin'].includes(role)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 })
        }

        // Update user role
        const db = require('@/lib/database').default
        const updateQuery = db.prepare(`
      UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `)

        updateQuery.run(role, parseInt(params.id))

        return NextResponse.json({ message: "User role updated successfully" })
    } catch (error) {
        console.error("Error updating user role:", error)
        return NextResponse.json({ error: "Failed to update user role" }, { status: 500 })
    }
}
