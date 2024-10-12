
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, User, LogOut, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';

const NavBar = () => {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const menuItems = status === 'authenticated' 
    ? [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/courses', label: 'Courses' },
        { href: '/progress', label: 'My Progress' },
      ]
    : [
        { href: '/', label: 'Home' },
        { href: '/resources', label: 'Resources' },
        { href: '/blog', label: 'Blog' },
        { href: '/login', label: 'Login' },
        { href: '/register', label: 'Sign Up' },
      ];

  if (!mounted) return null;

  return (
    <motion.nav 
      className="fixed w-full top-0 left-0 z-50 bg-white bg-opacity-70 dark:bg-gray-900 dark:bg-opacity-70 backdrop-filter backdrop-blur-lg transition-colors duration-300"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <motion.img 
                className="h-8 w-8" 
                src="/logo.svg" 
                alt="Logo"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              />
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {menuItems.map((item) => (
                <motion.div key={item.href} whileHover={{ scale: 1.05 }}>
                  <Link
                    href={item.href}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex items-center">
          <motion.button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </motion.button>
            {status === 'authenticated' && (
              <motion.button
                onClick={() => signOut()}
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                whileHover={{ scale: 1.05 }}
              >
                Sign out
              </motion.button>
            )}
            <div className="md:hidden ml-2">
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="h-6 w-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default NavBar;