import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ClientDashboardWrapper from '@/app/components/ClientDashboardWrapper';
import prisma from '@/app/utils/prisma';
import Link from 'next/link';
import { ContinueButton } from '@/app/components/ContinueButton';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import SearchBar from '@/app/components/SearchBar';
import RecommendedCourses from '@/app/components/RecommendedCourses';
import { Suspense } from 'react';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Access Denied</div>;
  }

  const user = session.user;
  let content;

  if (user.role === 'USER') {
    const courses = await prisma.course.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
      }
    });
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
                  <p className="mt-2 text-sm text-gray-500">Type: {course.type}</p>
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
        <div className="mt-8 bg-blue-100 p-4 rounded-lg">
          <div className="flex">
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
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
          }
        },
      },
    });

    const progressData = await prisma.progress.findMany({
      where: { userId: user.id },
    });

    const enrollmentsWithProgress = enrollments.map(enrollment => {
      const progress = progressData.find(p => p.courseId === enrollment.courseId);
      return {
        ...enrollment,
        progress: progress ? progress.progress : 0
      };
    });

    content = (
      <div>
        <h2 className="text-2xl font-bold mb-4">My Courses</h2>
        {enrollmentsWithProgress.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrollmentsWithProgress.map(({ course, progress }) => (
              <div key={course.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{course.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{course.description}</p>
                  <p className="mt-2 text-sm text-gray-500">Type: {course.type}</p>
                  <div className="mt-4">
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                        <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Progress: {Math.round(progress)}%</p>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
                  <Link href={`/courses/${course.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    View course
                  </Link>
                  <ContinueButton courseId={course.id} progress={progress} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You haven't enrolled in any courses yet. Start learning today!</p>
        )}

        <RecommendedCourses />

        <Link href="/highlights-and-notes" className="mt-8 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          View My Highlights and Notes
        </Link>
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
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
      <SearchBar />
      <Suspense fallback={<LoadingSpinner />}>
        {content}
      </Suspense>
    </ClientDashboardWrapper>
  );
}