import { NextResponse } from 'next/server';
import prisma from '@/app/utils/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    const courses = await prisma.course.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error searching courses:', error);
    return NextResponse.json({ error: 'Error searching courses' }, { status: 500 });
  }
}