"use client"

import type React from "react"
import { useEffect, useState } from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Get stored theme or default to light
    const stored = localStorage.getItem("theme") || "light"
    const shouldDark = stored === "dark"

    // Apply theme immediately
    document.documentElement.classList.toggle("dark", shouldDark)
    setMounted(true)
  }, [])

  // Show loading state to prevent flash
  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    )
  }

  return <>{children}</>
}
