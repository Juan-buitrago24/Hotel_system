import React from 'react'

const Button = ({ children, onClick, variant = 'primary', fullWidth = false, className = '', ...props }) => {
  const variants = {
    primary: 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600',
    secondary: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
    danger: 'bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700'
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-semibold transition ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button
