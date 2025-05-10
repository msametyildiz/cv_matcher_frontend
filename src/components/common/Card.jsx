// src/components/common/Card.jsx
import React from 'react';
import clsx from 'clsx';

const Card = ({
  title,
  children,
  footer,
  className = '',
  ...props
}) => {
  return (
    <div
      className={clsx(
        'bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden',
        className
      )}
      {...props}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
      )}
      <div className="p-6 space-y-4">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;