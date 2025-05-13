import { useState, useCallback, useMemo } from 'react';

const useTableControls = (initialData = [], initialFilters = {}, initialSorting = { field: null, direction: 'asc' }) => {
  const [filters, setFilters] = useState(initialFilters);
  const [sorting, setSorting] = useState(initialSorting);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter the data based on filters and search term
  const filteredData = useMemo(() => {
    let result = [...initialData];

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item => {
          if (Array.isArray(item[key])) {
            return item[key].includes(value);
          }
          return item[key] === value;
        });
      }
    });

    // Apply search term
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(item => {
        return Object.values(item).some(value => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(lowercasedTerm);
          }
          return false;
        });
      });
    }

    return result;
  }, [initialData, filters, searchTerm]);

  // Sort the filtered data
  const sortedData = useMemo(() => {
    if (!sorting.field) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (a[sorting.field] === b[sorting.field]) return 0;
      
      const valueA = a[sorting.field];
      const valueB = b[sorting.field];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sorting.direction === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      return sorting.direction === 'asc' 
        ? valueA > valueB ? 1 : -1 
        : valueA < valueB ? 1 : -1;
    });
  }, [filteredData, sorting]);

  // Calculate pagination
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  // Helper functions
  const setFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPage(1); // Reset to first page when filters change
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearchTerm('');
    setPage(1);
  }, [initialFilters]);

  const handleSort = useCallback((field) => {
    setSorting(prev => {
      if (prev.field === field) {
        return {
          field,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return {
        field,
        direction: 'asc'
      };
    });
  }, []);

  return {
    // Data
    filteredData,
    sortedData,
    paginatedData,
    totalItems: filteredData.length,
    
    // Filters
    filters,
    setFilter,
    clearFilters,
    
    // Search
    searchTerm,
    setSearchTerm,
    
    // Sorting
    sorting,
    handleSort,
    
    // Pagination
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages: Math.ceil(filteredData.length / rowsPerPage)
  };
};

export default useTableControls;
