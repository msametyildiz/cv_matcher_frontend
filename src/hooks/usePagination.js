import { useState, useCallback } from 'react';

const usePagination = (initialPage = 1, initialItemsPerPage = 10, totalItems = 0) => {
  const [page, setPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [total, setTotal] = useState(totalItems);
  
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
  
  // Go to specific page
  const goToPage = useCallback((pageNumber) => {
    const newPage = Math.max(1, Math.min(pageNumber, totalPages));
    setPage(newPage);
  }, [totalPages]);
  
  // Go to next page
  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  }, [page, totalPages]);
  
  // Go to previous page
  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  }, [page]);
  
  // Go to first page
  const firstPage = useCallback(() => {
    setPage(1);
  }, []);
  
  // Go to last page
  const lastPage = useCallback(() => {
    setPage(totalPages);
  }, [totalPages]);
  
  // Change number of items per page
  const changeItemsPerPage = useCallback((newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    // Reset to first page when changing items per page
    setPage(1);
  }, []);
  
  // Update total items
  const updateTotalItems = useCallback((newTotal) => {
    setTotal(newTotal);
    // Adjust current page if it becomes out of bounds
    const newTotalPages = Math.max(1, Math.ceil(newTotal / itemsPerPage));
    if (page > newTotalPages) {
      setPage(newTotalPages);
    }
  }, [page, itemsPerPage]);
  
  // Get current page data indices
  const getCurrentPageIndices = useCallback(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, total - 1);
    return { startIndex, endIndex };
  }, [page, itemsPerPage, total]);
  
  return {
    // State
    page,
    itemsPerPage,
    totalItems: total,
    totalPages,
    
    // Actions
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    changeItemsPerPage,
    updateTotalItems,
    
    // Helpers
    getCurrentPageIndices,
    
    // Advanced info
    isFirstPage: page === 1,
    isLastPage: page === totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
    paginationInfo: {
      currentPage: page,
      itemsPerPage,
      totalItems: total,
      totalPages,
      startItem: Math.min(total, (page - 1) * itemsPerPage + 1),
      endItem: Math.min(page * itemsPerPage, total)
    }
  };
};

export default usePagination;
