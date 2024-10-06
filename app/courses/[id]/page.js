import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from '@/app/utils/prisma';
import VideoPlayer from '@/app/components/VideoPlayer';
import TextViewer from '@/app/components/TextViewer';
import { notFound } from 'next/navigation';

export default async function CourseViewer({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <div>Access Denied</div>;
  }

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      enrollments: {
        where: { userId: session.user.id }
      },
      progress: {
        where: { userId: session.user.id }
      }
    }
  });

  if (!course) {
    notFound();
  }

  const isEnrolled = course.enrollments.length > 0;

  if (!isEnrolled && session.user.role !== 'ADMIN') {
    return <div>You are not enrolled in this course. Please enroll to view the content.</div>;
  }

  const userProgress = course.progress[0]?.progress || 0;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="text-gray-600 mb-4">{course.description}</p>
      
      {course.type === 'VIDEO' ? (
        <VideoPlayer url={course.content} courseId={course.id} initialProgress={userProgress} />
      ) : (
        <TextViewer content={course.content} courseId={course.id} initialProgress={userProgress} />
      )}
    </div>
  );
}