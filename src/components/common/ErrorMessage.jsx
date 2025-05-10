// src/components/common/ErrorMessage.jsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 mt-0.5 text-red-500" />
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onRetry && (
        <button 
          className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
          onClick={onRetry}
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
