import React from 'react'

const Button = ({ children, onClick, variant = 'primary', fullWidth = false, className = '', ...props }) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'border border-gray-300 hover:bg-gray-50',
    danger: 'bg-red-500 text-white hover:bg-red-600'
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
