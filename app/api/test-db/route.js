import { NextResponse } from 'next/server';
import prisma from '@/app/utils/prisma';

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    return NextResponse.json({ message: 'Database connection successful', userCount });
  } catch (error) {
    console.error('Database connection failed', error);
    return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
  }
}