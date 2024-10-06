import { NextResponse } from 'next/server';
import prisma from '@/app/utils/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, description, type, content } = await req.json();

  try {
    const course = await prisma.course.create({
      data: { title, description, type, content },
    });
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating course' }, { status: 500 });
  }
}

export async function GET(req) {
  const courses = await prisma.course.findMany();
  return NextResponse.json(courses);
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, title, description, type, content } = await req.json();

  try {
    const course = await prisma.course.update({
      where: { id },
      data: { title, description, type, content },
    });
    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating course' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await req.json();

  try {
    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting course' }, { status: 500 });
  }
}