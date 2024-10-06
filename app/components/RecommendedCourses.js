'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LoadingSpinner from './LoadingSpinner';

export default function RecommendedCourses() {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const response = await fetch('/api/recommendations');
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        const data = await response.json();
        setRecommendations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mt-8 mb-4">Recommended Courses</h2>
      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((course) => (
            <div key={course.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{course.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{course.description}</p>
                <p className="mt-2 text-sm text-gray-500">Type: {course.type}</p>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <Link href={`/courses/${course.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  View details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No recommendations available at the moment.</p>
      )}
    </div>
  );
}