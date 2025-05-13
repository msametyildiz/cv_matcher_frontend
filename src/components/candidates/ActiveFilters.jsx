import React from 'react';

const ActiveFilters = ({ filters, onRemoveFilter, onClearAll }) => {
  // Get active filters only (non-empty values)
  const activeFilters = Object.entries(filters).filter(([_, value]) => 
    value !== '' && value !== false && value !== null && value !== undefined
  );
  
  if (activeFilters.length === 0) {
    return null;
  }

  // Format filter keys for display
  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1') // Add spaces before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
  };

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex flex-1 flex-wrap gap-2">
        {activeFilters.map(([key, value]) => (
          <span
            key={key}
            className="inline-flex rounded-full items-center py-1 pl-3 pr-1 text-sm font-medium bg-blue-100 text-blue-700"
          >
            <span>{formatKey(key)}: {typeof value === 'boolean' ? 'Yes' : value}</span>
            <button
              type="button"
              onClick={() => onRemoveFilter(key)}
              className="flex-shrink-0 ml-1 h-5 w-5 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-200 focus:text-blue-500"
            >
              <span className="sr-only">Remove filter for {key}</span>
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </span>
        ))}
      </div>
      <div className="flex-shrink-0">
        <button
          type="button"
          onClick={onClearAll}
          className="text-sm text-gray-700 hover:text-gray-900"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
};

export default ActiveFilters;
