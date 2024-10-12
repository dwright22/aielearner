'use client'

import { motion } from 'framer-motion';
import { BookOpen, Brain, Zap } from 'lucide-react';

const features = [
  {
    icon: <BookOpen className="w-12 h-12 text-blue-500" />,
    title: 'Extensive Course Library',
    description: 'Access a wide range of AI and machine learning courses.',
  },
  {
    icon: <Brain className="w-12 h-12 text-purple-500" />,
    title: 'AI-Powered Learning',
    description: 'Personalized learning paths tailored to your goals and progress.',
  },
  {
    icon: <Zap className="w-12 h-12 text-yellow-500" />,
    title: 'Interactive Exercises',
    description: 'Hands-on coding exercises and real-world projects to reinforce your skills.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-center mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;