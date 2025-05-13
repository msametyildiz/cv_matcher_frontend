import React from 'react';

const SearchFilters = ({ filters, onFilterChange, expanded = true, onToggleExpand }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          {onToggleExpand && (
            <button 
              onClick={onToggleExpand} 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {expanded ? 'Collapse' : 'Expand'}
            </button>
          )}
        </div>
        
        {expanded && (
          <div className="mt-4 space-y-6">
            {/* Skills */}
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={filters.skills || ''}
                onChange={(e) => onFilterChange('skills', e.target.value)}
                placeholder="e.g. React, Python, Project Management"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={filters.location || ''}
                onChange={(e) => onFilterChange('location', e.target.value)}
                placeholder="e.g. New York, Remote"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Experience Level */}
            <div>
              <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={filters.experienceLevel || ''}
                onChange={(e) => onFilterChange('experienceLevel', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Any Experience</option>
                <option value="entry">Entry Level</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid-Level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
              </select>
            </div>
            
            {/* Availability */}
            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <select
                id="availability"
                name="availability"
                value={filters.availability || ''}
                onChange={(e) => onFilterChange('availability', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Any Availability</option>
                <option value="immediately">Immediately</option>
                <option value="1week">1 Week</option>
                <option value="2weeks">2 Weeks</option>
                <option value="1month">1 Month</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            
            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Type
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="fullTime"
                    name="jobType"
                    type="checkbox"
                    checked={filters.fullTime || false}
                    onChange={(e) => onFilterChange('fullTime', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="fullTime" className="ml-2 block text-sm text-gray-700">
                    Full-time
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="partTime"
                    name="jobType"
                    type="checkbox"
                    checked={filters.partTime || false}
                    onChange={(e) => onFilterChange('partTime', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="partTime" className="ml-2 block text-sm text-gray-700">
                    Part-time
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="contract"
                    name="jobType"
                    type="checkbox"
                    checked={filters.contract || false}
                    onChange={(e) => onFilterChange('contract', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="contract" className="ml-2 block text-sm text-gray-700">
                    Contract
                  </label>
                </div>
              </div>
            </div>
            
            {/* Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => {
                  // Reset all filters
                  Object.keys(filters).forEach(key => {
                    onFilterChange(key, '');
                  });
                }}
                className="text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => {
                  // Apply filters
                  console.log('Apply filters');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
