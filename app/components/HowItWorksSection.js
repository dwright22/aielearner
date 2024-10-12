'use client'

import { motion } from 'framer-motion';
import { CircleIcon } from 'lucide-react';

const steps = [
  {
    title: 'Sign Up',
    description: 'Create your account and set your learning goals.',
  },
  {
    title: 'Explore Courses',
    description: 'Browse our extensive library of AI and machine learning courses.',
  },
  {
    title: 'Learn and Practice',
    description: 'Follow your personalized learning path and complete interactive exercises.',
  },
  {
    title: 'Track Progress',
    description: 'Monitor your progress and earn certificates as you advance.',
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-between items-start">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center mb-8 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative">
                <CircleIcon className="w-16 h-16 text-blue-500" />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xl">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-xl font-semibold mt-4 mb-2">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center max-w-xs">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;