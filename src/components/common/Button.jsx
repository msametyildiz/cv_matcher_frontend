// src/components/common/Button.jsx
import React from 'react';
import clsx from 'clsx';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex justify-center items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'text-white bg-blue-600 hover:bg-blue-700 border-transparent focus:ring-blue-500',
    secondary: 'text-gray-700 bg-white hover:bg-gray-100 border-gray-300 focus:ring-gray-500',
    danger: 'text-white bg-red-600 hover:bg-red-700 border-transparent focus:ring-red-500',
    success: 'text-white bg-green-600 hover:bg-green-700 border-transparent focus:ring-green-500'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(baseClasses, variants[variant], disabled && 'opacity-50 cursor-not-allowed', className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;