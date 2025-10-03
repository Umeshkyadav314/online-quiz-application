import { type NextRequest, NextResponse } from "next/server"
import { clearSessionCookie, destroySession } from "@/lib/auth"

const SESSION_COOKIE = "sid"

export async function POST(req: NextRequest) {
  const sid = req.cookies.get(SESSION_COOKIE)?.value
  const res = NextResponse.json({ ok: true })
  if (sid) {
    destroySession(sid)
  }
  clearSessionCookie(res)
  return res
}
