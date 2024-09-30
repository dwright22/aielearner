const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        hashedPassword,
        role: 'ADMIN',
      },
    });

    const subscribedUser = await prisma.user.upsert({
      where: { email: 'subscriber@example.com' },
      update: {},
      create: {
        email: 'subscriber@example.com',
        name: 'Subscribed User',
        hashedPassword,
        role: 'SUBSCRIBED_USER',
      },
    });

    const regularUser = await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        name: 'Regular User',
        hashedPassword,
        role: 'USER',
      },
    });

    // Create courses
    const courses = await Promise.all([
      prisma.course.create({
        data: {
          title: 'Introduction to JavaScript',
          description: 'Learn the basics of JavaScript programming.',
        },
      }),
      prisma.course.create({
        data: {
          title: 'Advanced React Techniques',
          description: 'Master advanced concepts in React development.',
        },
      }),
      prisma.course.create({
        data: {
          title: 'Python for Data Science',
          description: 'Explore data analysis and machine learning with Python.',
        },
      }),
      prisma.course.create({
        data: {
          title: 'Full Stack Development with Node.js',
          description: 'Build complete web applications with Node.js and Express.',
        },
      }),
      prisma.course.create({
        data: {
          title: 'iOS App Development with Swift',
          description: 'Create powerful iOS applications using Swift and Xcode.',
        },
      }),
    ]);

    // Create enrollments for the subscribed user
    await Promise.all(
      courses.slice(0, 3).map((course) =>
        prisma.enrollment.create({
          data: {
            userId: subscribedUser.id,
            courseId: course.id,
            progress: Math.floor(Math.random() * 101), // Random progress between 0 and 100
          },
        })
      )
    );

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