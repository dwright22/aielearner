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
          <ul className="space-y-2">
            {courses.map((course) => (
              <li key={course.id} className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">{course.title}</h3>
                <p className="text-gray-600">{course.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No courses available at the moment. Check back later!</p>
        )}
        <div className="mt-8 bg-blue-100 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Upgrade to Premium</h3>
          <p className="text-blue-600 mb-2">Get access to all courses and personalized learning plans!</p>
          <Link href="/subscribe" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Upgrade Now
          </Link>
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
          <ul className="space-y-2">
            {enrollments.map((enrollment) => (
              <li key={enrollment.id} className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">{enrollment.course.title}</h3>
                <p className="text-gray-600">Progress: {enrollment.progress}%</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't enrolled in any courses yet. Start learning today!</p>
        )}
        <div className="mt-8 bg-green-100 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">AI Recommendations</h3>
          <p className="text-green-600 mb-2">Based on your progress, we recommend:</p>
          <ul className="list-disc list-inside text-green-700">
            <li>Complete "Advanced JavaScript" course</li>
            <li>Start "React Fundamentals" next week</li>
          </ul>
        </div>
        <div className="mt-4 bg-purple-100 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800">Upcoming Reminders</h3>
          <ul className="list-disc list-inside text-purple-700">
            <li>Quiz for "Python Basics" tomorrow at 3 PM</li>
            <li>Live session on "Data Structures" on Friday at 6 PM</li>
          </ul>
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
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Total Users</h3>
            <p className="text-2xl">{userCount}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Total Courses</h3>
            <p className="text-2xl">{courseCount}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Subscribed Users</h3>
            <p className="text-2xl">{subscribedUserCount}</p>
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