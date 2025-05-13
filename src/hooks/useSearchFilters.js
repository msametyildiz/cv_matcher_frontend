import { useState, useCallback, useEffect } from 'react';

const useSearchFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [activeFilters, setActiveFilters] = useState({});
  const [isFiltersChanged, setIsFiltersChanged] = useState(false);
  
  // Update filter value
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setIsFiltersChanged(true);
  }, []);
  
  // Remove a filter
  const removeFilter = useCallback((key) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      // Handle boolean filters differently
      if (typeof prev[key] === 'boolean') {
        newFilters[key] = false;
      } else {
        newFilters[key] = '';
      }
      return newFilters;
    });
    
    setActiveFilters(prev => {
      const newActiveFilters = { ...prev };
      delete newActiveFilters[key];
      return newActiveFilters;
    });
    
    setIsFiltersChanged(true);
  }, []);
  
  // Clear all filters
  const clearAllFilters = useCallback(() => {
    const clearedFilters = Object.keys(filters).reduce((acc, key) => {
      if (typeof filters[key] === 'boolean') {
        acc[key] = false;
      } else {
        acc[key] = '';
      }
      return acc;
    }, {});
    
    setFilters(clearedFilters);
    setActiveFilters({});
    setIsFiltersChanged(true);
  }, [filters]);
  
  // Apply filters - this function would typically be used to trigger a search
  const applyFilters = useCallback(() => {
    // Filter out empty or false values
    const filteredValues = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value === '' || value === false || value === null || value === undefined) {
        return acc;
      }
      acc[key] = value;
      return acc;
    }, {});
    
    setActiveFilters(filteredValues);
    setIsFiltersChanged(false);
    
    // Return the active filters for external use
    return filteredValues;
  }, [filters]);
  
  // Reset to initial filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setActiveFilters({});
    setIsFiltersChanged(false);
  }, [initialFilters]);
  
  return {
    filters,
    activeFilters,
    isFiltersChanged,
    updateFilter,
    removeFilter,
    clearAllFilters,
    applyFilters,
    resetFilters
  };
};

export default useSearchFilters;
