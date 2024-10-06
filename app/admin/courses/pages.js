'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('TEXT');
  const [content, setContent] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user.role !== 'ADMIN')) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingCourse ? 'PUT' : 'POST';
    const url = editingCourse ? `/api/courses/${editingCourse.id}` : '/api/courses';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, type, content }),
    });

    if (res.ok) {
      setTitle('');
      setDescription('');
      setType('TEXT');
      setContent('');
      setEditingCourse(null);
      fetchCourses();
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setDescription(course.description);
    setType(course.type);
    setContent(course.content);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/courses/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      fetchCourses();
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{editingCourse ? 'Edit Course' : 'Create New Course'}</h1>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Course Title"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Course Description"
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="TEXT">Text Course</option>
          <option value="VIDEO">Video Course</option>
        </select>
        {type === 'TEXT' ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Course Content (Text)"
            className="w-full p-2 border rounded h-64"
            required
          />
        ) : (
          <input
            type="url"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Video URL"
            className="w-full p-2 border rounded"
            required
          />
        )}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingCourse ? 'Update Course' : 'Add Course'}
        </button>
        {editingCourse && (
          <button
            type="button"
            onClick={() => setEditingCourse(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
          >
            Cancel Edit
          </button>
        )}
      </form>
      <h2 className="text-xl font-bold mb-4">Existing Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="border p-4 rounded">
            <h3 className="text-lg font-bold">{course.title}</h3>
            <p className="text-sm text-gray-600">{course.description}</p>
            <p className="text-sm">Type: {course.type}</p>
            <div className="mt-2">
              <button
                onClick={() => handleEdit(course)}
                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(course.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}