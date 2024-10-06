import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from '@/app/utils/prisma';
import Link from 'next/link';

export default async function SearchResults({ searchParams }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Access Denied</div>;
  }

  const query = searchParams.q;

  if (!query) {
    return <div>No search query provided</div>;
  }

  const courses = await prisma.course.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    },
  });

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>
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
        <p className="text-gray-500">No courses found matching your search.</p>
      )}
      <Link href="/dashboard" className="mt-8 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Back to Dashboard
      </Link>
    </div>
  );
}