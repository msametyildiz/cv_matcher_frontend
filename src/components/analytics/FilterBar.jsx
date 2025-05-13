import React from 'react';

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  dateRange, 
  onDateRangeChange,
  periods = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Year to date', 'Custom'],
  currentPeriod = 'Last 30 days',
  onPeriodChange
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap items-center justify-between">
      <div className="flex space-x-4 mb-2 sm:mb-0">
        {/* Date range selector */}
        <select 
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={currentPeriod}
          onChange={(e) => onPeriodChange && onPeriodChange(e.target.value)}
        >
          {periods.map((period) => (
            <option key={period} value={period}>{period}</option>
          ))}
        </select>
        
        {/* Custom date range inputs - show only if custom period is selected */}
        {currentPeriod === 'Custom' && (
          <div className="flex space-x-2">
            <input
              type="date"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={dateRange?.from || ''}
              onChange={(e) => onDateRangeChange && onDateRangeChange({ ...dateRange, from: e.target.value })}
            />
            <span className="self-center">to</span>
            <input
              type="date"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={dateRange?.to || ''}
              onChange={(e) => onDateRangeChange && onDateRangeChange({ ...dateRange, to: e.target.value })}
            />
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {/* Filter buttons/dropdowns */}
        {filters && Object.entries(filters).map(([key, value]) => (
          <select
            key={key}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={value}
            onChange={(e) => onFilterChange && onFilterChange(key, e.target.value)}
          >
            <option value="">{key.charAt(0).toUpperCase() + key.slice(1)}: All</option>
            {/* Example options - in a real app these would be dynamic */}
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
