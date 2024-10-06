'use client'

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from 'next-themes'
import NavBar from './components/NavBar'
import ParticleBackground from './components/ParticleBackground'
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <body className="min-h-screen transition-colors duration-300 ease-in-out
                         bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300
                         dark:from-gray-900 dark:via-gray-800 dark:to-gray-700
                         text-gray-900 dark:text-white">
          <SessionProvider>
            <ParticleBackground />
            <NavBar />
            <main className="pt-16 relative z-10">
              {children}
            </main>
          </SessionProvider>
        </body>
      </ThemeProvider>
    </html>
  )
}