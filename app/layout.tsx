import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import Footer from "@/components/footer"
import Header from "@/components/header"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Online Quiz Platform",
  description: "Created with OQP",
  generator: "OQP",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning={true}>
        <ThemeProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <div className="min-h-dvh flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
