import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from '@/app/utils/prisma';

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { courseId, progress } = await req.json();

  try {
    const updatedProgress = await prisma.progress.upsert({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId,
        },
      },
      update: {
        progress: progress,
      },
      create: {
        userId: session.user.id,
        courseId: courseId,
        progress: progress,
      },
    });

    return NextResponse.json(updatedProgress);
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Error updating progress' }, { status: 500 });
  }
}