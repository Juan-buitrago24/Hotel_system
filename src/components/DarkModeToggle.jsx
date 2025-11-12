import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const DarkModeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
        isDark ? 'bg-blue-600' : 'bg-gray-300'
      } ${className}`}
      aria-label="Toggle dark mode"
    >
      <motion.div
        className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
        animate={{
          x: isDark ? 28 : 0
        }}
        transition={{
          type: 'spring',
          stiffness: 700,
          damping: 30
        }}
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-blue-600" />
        ) : (
          <Sun className="w-4 h-4 text-yellow-500" />
        )}
      </motion.div>
    </button>
  );
};

export default DarkModeToggle;
