'use client'

import { motion } from 'framer-motion';

const AiIllustration = () => {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.circle
        cx="100"
        cy="100"
        r="80"
        stroke="#4F46E5"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <motion.path
        d="M60 100 L140 100"
        stroke="#4F46E5"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
      />
      <motion.path
        d="M100 60 L100 140"
        stroke="#4F46E5"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
      />
      <motion.circle
        cx="100"
        cy="100"
        r="10"
        fill="#4F46E5"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1.2 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      />
    </svg>
  );
};

export default AiIllustration;