import React from 'react';

export const Card = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 mb-6 ${className}`}>
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
