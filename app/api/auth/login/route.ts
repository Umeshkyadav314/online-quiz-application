import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, createSession, setSessionCookie } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({}))
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 })
  }
  try {
    authenticateUser(email, password)
    const sid = createSession(email)
    const res = NextResponse.json({ ok: true })
    setSessionCookie(res, sid)
    return res
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 401 })
  }
}
