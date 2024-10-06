const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Clear existing data
    await prisma.highlight.deleteMany();
    await prisma.progress.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();

    console.log('Existing data cleared');

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin User',
        hashedPassword,
        role: 'ADMIN',
      },
    });

    const subscribedUser = await prisma.user.create({
      data: {
        email: 'subscriber@example.com',
        name: 'Subscribed User',
        hashedPassword,
        role: 'SUBSCRIBED_USER',
      },
    });

    const regularUser = await prisma.user.create({
      data: {
        email: 'user@example.com',
        name: 'Regular User',
        hashedPassword,
        role: 'USER',
      },
    });

    console.log('Users created');

    // Create courses
    const courses = await Promise.all([
      prisma.course.create({
        data: {
          title: 'Introduction to JavaScript',
          description: 'Learn the basics of JavaScript programming.',
          type: 'TEXT',
          content: 'This is the content of the Introduction to JavaScript course...',
        },
      }),
      prisma.course.create({
        data: {
          title: 'Advanced React Techniques',
          description: 'Master advanced concepts in React development.',
          type: 'VIDEO',
          content: 'https://example.com/advanced-react-video',
        },
      }),
      prisma.course.create({
        data: {
          title: 'Python for Data Science',
          description: 'Explore data analysis and machine learning with Python.',
          type: 'TEXT',
          content: 'This is the content of the Python for Data Science course...',
        },
      }),
      prisma.course.create({
        data: {
          title: 'Full Stack Development with Node.js',
          description: 'Build complete web applications with Node.js and Express.',
          type: 'VIDEO',
          content: 'https://example.com/full-stack-node-video',
        },
      }),
      prisma.course.create({
        data: {
          title: 'iOS App Development with Swift',
          description: 'Create powerful iOS applications using Swift and Xcode.',
          type: 'TEXT',
          content: 'This is the content of the iOS App Development course...',
        },
      }),
    ]);

    console.log('Courses created');

    // Create enrollments for the subscribed user
    const enrollments = await Promise.all(
      courses.slice(0, 3).map((course) =>
        prisma.enrollment.create({
          data: {
            userId: subscribedUser.id,
            courseId: course.id,
          },
        })
      )
    );

    console.log('Enrollments created');

    // Create progress for the enrollments
    await Promise.all(
      enrollments.map((enrollment) =>
        prisma.progress.create({
          data: {
            userId: subscribedUser.id,
            courseId: enrollment.courseId,
            progress: Math.floor(Math.random() * 101), // Random progress between 0 and 100
          },
        })
      )
    );

    console.log('Progress created');

    // Create highlights and notes for the subscribed user
    await Promise.all([
      prisma.highlight.create({
        data: {
          userId: subscribedUser.id,
          courseId: courses[0].id,
          content: 'This is an important concept in JavaScript.',
          type: 'HIGHLIGHT',
        },
      }),
      prisma.highlight.create({
        data: {
          userId: subscribedUser.id,
          courseId: courses[0].id,
          content: 'Remember to review this section on functions.',
          type: 'NOTE',
          note: 'Functions are fundamental to JavaScript programming.',
        },
      }),
      prisma.highlight.create({
        data: {
          userId: subscribedUser.id,
          courseId: courses[2].id,
          content: 'Key point about Python data structures.',
          type: 'HIGHLIGHT',
        },
      }),
    ]);

    console.log('Highlights and notes created');

    console.log('Seed data inserted successfully.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });