'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the email to your server for newsletter signup
    console.log('Newsletter signup:', email);
    // Reset form after submission
    setEmail('');
  };

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/courses' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Mission Statement */}
          <div className="col-span-1 md:col-span-2">
            <Image src="/placeholder.co/300/200" alt="AI Learning SaaS Logo" width={120} height={40} />
            <p className="mt-4 text-sm">
              Our mission is to democratize AI education, making it accessible and engaging for learners worldwide. We strive to empower individuals with cutting-edge knowledge and skills in artificial intelligence.
            </p>
          </div>

          {/* Menu Items */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-blue-400 transition duration-300">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-4 py-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <motion.button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p>&copy; {new Date().getFullYear()} AI Learning SaaS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;