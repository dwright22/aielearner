const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updateCourseTypes() {
  try {
    // First, let's get all courses
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        type: true
      }
    })

    // Filter courses that don't have a valid type
    const coursesToUpdate = courses.filter(course => !['VIDEO', 'TEXT'].includes(course.type))

    // Update each course individually
    for (const course of coursesToUpdate) {
      await prisma.course.update({
        where: { id: course.id },
        data: { type: 'TEXT' } // Or 'VIDEO', depending on your default preference
      })
    }

    console.log(`Updated ${coursesToUpdate.length} courses`)
  } catch (error) {
    console.error('Error updating courses:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateCourseTypes()