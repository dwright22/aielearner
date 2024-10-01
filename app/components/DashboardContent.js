'use client';

import Link from 'next/link';

export default function DashboardContent({ user, data }) {
  let content;

  if (user.role === 'USER') {
    content = (
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Courses</h2>
        {data.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((course) => (
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
    content = (
      <div>
        <h2 className="text-2xl font-bold mb-4">My Courses</h2>
        {data.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {data.map((enrollment) => (
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
      </div>
    );
  } else if (user.role === 'ADMIN') {
    content = (
      <div>
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="text-3xl font-semibold text-gray-900">{data.userCount}</dd>
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
                    <dd className="text-3xl font-semibold text-gray-900">{data.courseCount}</dd>
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
                    <dd className="text-3xl font-semibold text-gray-900">{data.subscribedUserCount}</dd>
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
    <>
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}</h1>
      {content}
    </>
  );
}