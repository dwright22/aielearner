// DashboardLayout.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

export default function DashboardLayout({ children, session }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className="md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-gray-800">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
              <img className="h-8 w-auto" src="/logo.svg" alt="Your Company" />
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                <Link href="/dashboard" className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  Dashboard
                </Link>
                {session?.user.role === 'SUBSCRIBED_USER' && (
                  <>
                    <Link href="/dashboard/progress" className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                      My Progress
                    </Link>
                    <Link href="/dashboard/ai-tutor" className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                      AI Tutor
                    </Link>
                  </>
                )}
                {session?.user.role === 'ADMIN' && (
                  <>
                    <Link href="/admin/users" className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                      Manage Users
                    </Link>
                    <Link href="/admin/courses" className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                      Manage Courses
                    </Link>
                  </>
                )}
              </nav>
            </div>
            <div className="flex-shrink-0 flex bg-gray-700 p-4">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}