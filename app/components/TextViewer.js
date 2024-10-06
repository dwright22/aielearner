'use client';

import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function TextViewer({ content, courseId, initialProgress = 0 }) {
  const [progress, setProgress] = useState(initialProgress);
  const [highlights, setHighlights] = useState([]);
  const [notes, setNotes] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {
    // Load highlights and notes from local storage
    const storedHighlights = JSON.parse(localStorage.getItem(`highlights-${courseId}`)) || [];
    const storedNotes = JSON.parse(localStorage.getItem(`notes-${courseId}`)) || [];
    setHighlights(storedHighlights);
    setNotes(storedNotes);
  }, [courseId]);

  useEffect(() => {
    const saveProgressInterval = setInterval(() => {
      saveProgress();
    }, 10000); // Save progress every 10 seconds

    return () => clearInterval(saveProgressInterval);
  }, [progress]);

  const saveProgress = async () => {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          progress,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save progress');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const newProgress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setProgress(newProgress);
    }
  };

  const handleHighlight = () => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const highlightId = uuidv4();

    const highlight = {
      id: highlightId,
      start: range.startOffset,
      end: range.endOffset,
      text: selection.toString(),
    };

    const newHighlights = [...highlights, highlight];
    setHighlights(newHighlights);
    localStorage.setItem(`highlights-${courseId}`, JSON.stringify(newHighlights));

    // Apply highlight style
    const span = document.createElement('span');
    span.className = 'bg-yellow-200';
    span.dataset.highlightId = highlightId;
    range.surroundContents(span);
  };

  const handleAddNote = () => {
    const selection = window.getSelection();
    if (selection.toString()) {
      const noteText = prompt('Enter your note:');
      if (noteText) {
        const note = {
          id: uuidv4(),
          text: noteText,
          associatedText: selection.toString(),
        };
        const newNotes = [...notes, note];
        setNotes(newNotes);
        localStorage.setItem(`notes-${courseId}`, JSON.stringify(newNotes));
      }
    }
  };

  return (
    <div className="relative">
      <div 
        ref={contentRef}
        className="prose max-w-none h-[70vh] overflow-y-auto p-4"
        onScroll={handleScroll}
      >
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-gray-200 h-1">
        <div 
          className="bg-blue-500 h-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={handleHighlight}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Highlight
        </button>
        <button
          onClick={handleAddNote}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Note
        </button>
      </div>
      {notes.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-bold">Notes:</h3>
          <ul className="list-disc pl-5">
            {notes.map((note) => (
              <li key={note.id}>
                <strong>{note.associatedText}:</strong> {note.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}