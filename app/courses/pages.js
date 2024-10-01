'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchCourses();
    }
  }, [status, session]);

  const fetchCourses = async () => {
    const res = await fetch('/api/courses');
    const data = await res.json();
    setCourses(data);
  };

  const handleEnroll = async (courseId) => {
    const res = await fetch('/api/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    });
    if (res.ok) {
      alert('Enrolled successfully!');
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="border p-4 rounded">
            <h2 className="text-xl font-bold">{course.title}</h2>
            <p>{course.description}</p>
            <button
              onClick={() => handleEnroll(course.id)}
              className="mt-2 bg-green-500 text-white px-2 py-1 rounded"
            >
              Enroll
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}