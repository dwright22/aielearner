'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
    {
        name: 'Sarah Johnson',
        role: 'Data Scientist',
        image: '/testimonials/sarah.jpg',
        quote: 'This platform has been instrumental in advancing my AI skills. The courses are comprehensive and the hands-on projects are invaluable.'
      },
      {
        name: 'Daniel Smith',
        role: 'Data Scientist',
        image: '/testimonials/daniel.jpg',
        quote: 'This platform has been instrumental in advancing my AI skills. The courses are comprehensive and the hands-on projects are invaluable.'
      },
      {
        name: 'Bob George',
        role: 'Data Scientist',
        image: '/testimonials/bob.jpg',
        quote: 'This platform has been instrumental in advancing my AI skills. The courses are comprehensive and the hands-on projects are invaluable.'
      },
 
     
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">What Our Learners Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={60}
                  height={60}
                  className="rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.quote}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;