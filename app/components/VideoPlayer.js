'use client';

import { useState, useEffect, useRef } from 'react';

export default function VideoPlayer({ url, courseId, initialProgress = 0 }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(initialProgress);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(currentProgress);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setProgress(100);
    saveProgress(100);
  };

  const saveProgress = async (progressValue) => {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          progress: progressValue,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save progress');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleVideoEnd);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        togglePlay();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isPlaying]);

  useEffect(() => {
    const saveProgressInterval = setInterval(() => {
      if (isPlaying) {
        saveProgress(progress);
      }
    }, 10000); // Save progress every 10 seconds

    return () => clearInterval(saveProgressInterval);
  }, [isPlaying, progress]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={url}
        className="w-full"
        onClick={togglePlay}
      />
      <div className="absolute bottom-0 left-0 w-full bg-gray-200 h-1">
        <div 
          className="bg-blue-500 h-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <button
        className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded"
        onClick={togglePlay}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}