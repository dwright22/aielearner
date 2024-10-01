import Link from 'next/link'
import prisma from '@/app/utils/prisma'
import { ThemeToggle } from '@/app/components/ThemeToggle'

export default async function Home() {
  const userCount = await prisma.user.count()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Welcome to AI Learning SaaS</h1>
      <p className="mb-4 text-gray-700 dark:text-gray-300">Total Users: {userCount}</p>
      <div className="flex space-x-4 mb-8">
        <Link href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Login
        </Link>
        <Link href="/register" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Register
        </Link>
      </div>
      <ThemeToggle />
    </main>
  )
}