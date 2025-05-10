import React from 'react';

const Loader = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
  };
  
  return (
    <div className="flex justify-center items-center p-4">
      <div className={`${sizeClasses[size]} border-t-4 border-blue-500 border-solid rounded-full animate-spin`}></div>
    </div>
  );
};

export default Loader;