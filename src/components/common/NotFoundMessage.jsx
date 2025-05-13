import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const NotFoundMessage = ({ message = 'The requested resource was not found.' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertTriangle size={48} className="text-yellow-500 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Not Found</h2>
      <p className="text-gray-600 max-w-md">{message}</p>
    </div>
  );
};

export default NotFoundMessage;
