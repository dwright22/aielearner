import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from '@/app/utils/prisma';
import Link from 'next/link';

export default async function HighlightsAndNotes() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Access Denied</div>;
  }

  const highlightsAndNotes = await prisma.highlight.findMany({
    where: { userId: session.user.id },
    include: { course: true },
  });

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">My Highlights and Notes</h1>
      {highlightsAndNotes.length > 0 ? (
        <div className="space-y-6">
          {highlightsAndNotes.map((item) => (
            <div key={item.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {item.course.title}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {item.type === 'HIGHLIGHT' ? 'Highlight' : 'Note'}
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Content
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {item.content}
                    </dd>
                  </div>
                  {item.note && (
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Note
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {item.note}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">You haven't made any highlights or notes yet.</p>
      )}
      <Link href="/dashboard" className="mt-8 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Back to Dashboard
      </Link>
    </div>
  );
}