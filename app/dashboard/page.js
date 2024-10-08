import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ClientDashboardWrapper from '@/app/components/ClientDashboardWrapper';
import prisma from '@/app/utils/prisma';
import Link from 'next/link';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Access Denied</div>;
  }

  const user = session.user;
  let content;

  if (user.role === 'USER') {
    const courses = await prisma.course.findMany({ take: 5 });
    content = (
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Courses</h2>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div key={course.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{course.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{course.description}</p>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <Link href={`/courses/${course.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    View details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No courses available at the moment. Check back later!</p>
        )}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Upgrade to Premium</h3>
              <p className="mt-2 text-sm text-blue-700">Get access to all courses and personalized learning plans!</p>
              <Link href="/subscribe" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (user.role === 'SUBSCRIBED_USER') {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: user.id },
      include: { course: true },
    });
    content = (
      <div>
        <h2 className="text-2xl font-bold mb-4">My Courses</h2>
        {enrollments.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {enrollments.map((enrollment) => (
                <li key={enrollment.id}>
                  <Link href={`/courses/${enrollment.course.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">{enrollment.course.title}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {enrollment.progress}% complete
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {enrollment.course.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500">You haven't enrolled in any courses yet. Start learning today!</p>
        )}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">AI Recommendations</h3>
              <ul className="mt-3 list-disc list-inside text-sm text-gray-600">
                <li>Complete "Advanced JavaScript" course</li>
                <li>Start "React Fundamentals" next week</li>
              </ul>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Reminders</h3>
              <ul className="mt-3 list-disc list-inside text-sm text-gray-600">
                <li>Quiz for "Python Basics" tomorrow at 3 PM</li>
                <li>Live session on "Data Structures" on Friday at 6 PM</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (user.role === 'ADMIN') {
    const [userCount, courseCount, subscribedUserCount] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.user.count({ where: { role: 'SUBSCRIBED_USER' } }),
    ]);
    content = (
      <div>
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="text-3xl font-semibold text-gray-900">{userCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Courses</dt>
                    <dd className="text-3xl font-semibold text-gray-900">{courseCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Subscribed Users</dt>
                    <dd className="text-3xl font-semibold text-gray-900">{subscribedUserCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <Link href="/admin/courses" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2">
            Manage Courses
          </Link>
          <Link href="/admin/users" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Manage Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ClientDashboardWrapper>
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}</h1>
      {content}
    </ClientDashboardWrapper>
  );
}