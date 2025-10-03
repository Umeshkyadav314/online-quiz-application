import { type NextRequest, NextResponse } from "next/server"
import { registerUser, createSession, setSessionCookie } from "@/lib/auth"
import { userQueries } from "@/lib/database"

export async function POST(req: NextRequest) {
  const { email, password, name, role } = await req.json().catch(() => ({}))
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 })
  }
  try {
    // Check if this is the first user (make them admin)
    const userCount = userQueries.getAll.all().length
    const userRole = userCount === 0 ? 'admin' : (role || 'user')
    
    registerUser(email, password, name, userRole)
    
    // Create session and set cookie
    const sid = createSession(email)
    const res = NextResponse.json({ ok: true })
    setSessionCookie(res, sid)
    
    return res
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}
