import React from 'react';
import { FileX } from 'lucide-react';

export const EmptyState = ({ 
  icon: Icon = FileX, 
  title = 'No data available', 
  message = 'There are no items to display at this time.', 
  children 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Icon size={40} className="text-gray-400 mb-3" />
      <h3 className="text-lg font-medium text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-500 mb-4 max-w-sm">{message}</p>
      {children}
    </div>
  );
};

export default EmptyState;
