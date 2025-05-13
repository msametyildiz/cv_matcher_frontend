import React from 'react';

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  searchTerm = '', 
  onSearchChange, 
  onClearFilters
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <select
            className="rounded-lg border border-gray-300 py-2 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
            <option value="filled">Filled</option>
          </select>

          {/* Employment Type Filter */}
          <select
            className="rounded-lg border border-gray-300 py-2 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filters.employmentType || ''}
            onChange={(e) => onFilterChange('employmentType', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="temporary">Temporary</option>
          </select>

          {/* Experience Level Filter */}
          <select
            className="rounded-lg border border-gray-300 py-2 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filters.experienceLevel || ''}
            onChange={(e) => onFilterChange('experienceLevel', e.target.value)}
          >
            <option value="">All Experience Levels</option>
            <option value="entry">Entry Level</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid-Level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
            <option value="executive">Executive</option>
          </select>

          {/* Date Filter */}
          <select
            className="rounded-lg border border-gray-300 py-2 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filters.timeframe || ''}
            onChange={(e) => onFilterChange('timeframe', e.target.value)}
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="last_3_months">Last 3 Months</option>
            <option value="custom">Custom Range</option>
          </select>

          {/* Clear Filters Button */}
          <button
            className="rounded-lg border border-gray-300 py-2 px-4 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onClick={onClearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
