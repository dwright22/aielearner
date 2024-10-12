'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="py-20 bg-blue-600 dark:bg-blue-800">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Ready to Start Your AI Learning Journey?
        </motion.h2>
        <motion.p
          className="text-xl text-white mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Join thousands of learners and advance your career in AI and machine learning.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/register"
            className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-100 transition duration-300"
          >
            Get Started For Free
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;