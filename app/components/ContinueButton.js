
'use client';

import { useRouter } from 'next/navigation';

export function ContinueButton({ courseId, progress }) {
  const router = useRouter();

  const handleContinue = () => {
    router.push(`/courses/${courseId}?progress=${progress}`);
  };

  return (
    <button
      onClick={handleContinue}
      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
    >
      Continue
    </button>
  );
}