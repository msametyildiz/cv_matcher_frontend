import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      <p>{message}</p>
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