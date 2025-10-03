import { cookies } from "next/headers"
import type { NextResponse } from "next/server"
import { userQueries, sessionQueries } from "./database"

const SESSION_COOKIE = "sid"

export function registerUser(email: string, password: string, name?: string, role: string = 'user') {
  try {
    // Check if user already exists
    const existingUser = userQueries.findByEmail.get(email)
    if (existingUser) {
      throw new Error("User already exists")
    }

    // Create new user
    userQueries.create.run(email, password, name, role)
    return { email }
  } catch (error: any) {
    if (error.message === "User already exists") {
      throw error
    }
    throw new Error("Registration failed")
  }
}

export function authenticateUser(email: string, password: string) {
  const user = userQueries.findByEmail.get(email) as { email: string; password: string } | undefined
  if (!user || user.password !== password) {
    throw new Error("Invalid credentials")
  }
  return { email: user.email }
}

function randomHex(bytes = 16) {
  const arr = new Uint8Array(bytes)
  crypto.getRandomValues(arr)
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("")
}

export function createSession(email: string) {
  const sid = randomHex(16)
  sessionQueries.create.run(sid, email)
  return sid
}

export function destroySession(sid: string) {
  sessionQueries.delete.run(sid)
}

export function getUserEmailFromSid(sid: string | undefined | null) {
  if (!sid) return null
  const result = sessionQueries.findBySessionId.get(sid) as { user_email: string } | undefined
  return result?.user_email ?? null
}

export function setSessionCookie(res: NextResponse, sid: string) {
  res.cookies.set(SESSION_COOKIE, sid, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  })
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 })
}

export async function getUserFromRequest() {
  const cookieStore = await cookies()
  const sid = cookieStore.get(SESSION_COOKIE)?.value
  const email = getUserEmailFromSid(sid)
  return email ? { email } : null
}
