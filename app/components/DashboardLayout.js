'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-semibold">AI Learning SaaS</h2>
        </div>
        <nav className="mt-6">
          <Link href="/dashboard" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
            Dashboard
          </Link>
          {session?.user.role === 'SUBSCRIBED_USER' && (
            <>
              <Link href="/dashboard/progress" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
                My Progress
              </Link>
              <Link href="/dashboard/ai-tutor" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
                AI Tutor
              </Link>
            </>
          )}
          {session?.user.role === 'ADMIN' && (
            <>
              <Link href="/dashboard/users" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
                Manage Users
              </Link>
              <Link href="/dashboard/courses" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
                Manage Courses
              </Link>
              <Link href="/dashboard/analytics" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
                Analytics
              </Link>
            </>
          )}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}