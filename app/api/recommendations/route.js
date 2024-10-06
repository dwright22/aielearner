import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from '@/app/utils/prisma';
import { getABTestVersion } from '@/app/utils/abTest';

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const abTestVersion = getABTestVersion(session.user.id);

    // Get user's enrolled courses and progress
    const userEnrollments = await prisma.enrollment.findMany({
      where: { userId: session.user.id },
      include: { 
        course: true, 
        progress: true 
      },
    });

    // Get user's completed courses
    const completedCourseIds = userEnrollments
      .filter(enrollment => enrollment.progress?.progress === 100)
      .map(enrollment => enrollment.courseId);

    // Get all courses
    const allCourses = await prisma.course.findMany({
      include: {
        enrollments: {
          include: { progress: true }
        }
      }
    });

    let recommendations;

    if (abTestVersion === 'A') {
      // Version A: Original algorithm
      recommendations = allCourses
        .filter(course => !userEnrollments.some(enrollment => enrollment.courseId === course.id))
        .map(course => {
          let score = 0;
          // Factor 1: Course type similarity
          score += userEnrollments.reduce((acc, enrollment) => {
            if (enrollment.course.type === course.type) {
              return acc + 1;
            }
            return acc;
          }, 0);
          // Factor 2: Course popularity
          score += course.enrollments.length / 10;
          return { course, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    } else {
      // Version B: New algorithm
      recommendations = allCourses
        .filter(course => !userEnrollments.some(enrollment => enrollment.courseId === course.id))
        .map(course => {
          let score = 0;
          // Factor 1: Course type similarity
          score += userEnrollments.reduce((acc, enrollment) => {
            if (enrollment.course.type === course.type) {
              return acc + 1;
            }
            return acc;
          }, 0);
          // Factor 2: Course popularity
          score += course.enrollments.length / 10;
          // Factor 3: Average course rating (assuming we have a rating system)
          const avgRating = course.enrollments.reduce((acc, enrollment) => acc + (enrollment.rating || 0), 0) / course.enrollments.length;
          score += avgRating * 2;
          // Factor 4: Prerequisite courses completed
          const prerequisites = ['Introduction to JavaScript', 'Python for Data Science']; // Example prerequisites
          if (prerequisites.every(prereq => completedCourseIds.includes(prereq))) {
            score += 5;
          }
          return { course, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    }

    // Log the recommendation event for analysis
    await prisma.recommendationEvent.create({
      data: {
        userId: session.user.id,
        abTestVersion,
        recommendedCourseIds: recommendations.map(r => r.course.id),
      }
    });

    return NextResponse.json({
      recommendations: recommendations.map(r => r.course),
      abTestVersion,
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return NextResponse.json({ error: 'Error getting recommendations' }, { status: 500 });
  }
}