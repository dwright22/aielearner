'use client'

import { useState, useEffect } from 'react';
import Lottie from 'react-lottie-player';
import { motion } from 'framer-motion';

// Import your Lottie JSON file
import lottieAnimation from '../assets/lottie.json';

const Hero = () => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    setAnimationData(lottieAnimation);
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between min-h-screen px-4 md:px-12 py-12">
      <motion.div 
        className="md:w-1/2 text-center md:text-left mb-8 md:mb-0"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
          Learn AI with Interactive Courses
        </h1>
        <p className="text-xl md:text-2xl mb-6 text-gray-700 dark:text-gray-300">
          Master the future of technology through our cutting-edge AI learning platform.
        </p>
        <motion.button 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </motion.div>
      <motion.div 
        className="md:w-1/2"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {animationData && (
          <Lottie
            loop
            animationData={animationData}
            play
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Hero;