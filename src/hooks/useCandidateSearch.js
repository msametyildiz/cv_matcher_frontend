import { useState, useEffect, useCallback } from 'react';

const useCandidateSearch = (initialFilters = {}, initialPage = 1, initialItemsPerPage = 10) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  
  const [searchParams, setSearchParams] = useState({
    filters: initialFilters,
    page: initialPage,
    itemsPerPage: initialItemsPerPage,
    sortBy: 'relevance',
    sortOrder: 'desc'
  });
  
  // Search candidates based on current parameters
  const searchCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // const response = await api.get('/api/candidates/search', {
      //   params: {
      //     ...searchParams.filters,
      //     page: searchParams.page,
      //     limit: searchParams.itemsPerPage,
      //     sortBy: searchParams.sortBy,
      //     sortOrder: searchParams.sortOrder
      //   }
      // });
      // setCandidates(response.data.candidates);
      // setTotalItems(response.data.total);
      
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockCandidates = [
        {
          id: 'candidate-001',
          firstName: 'John',
          lastName: 'Smith',
          title: 'Senior Software Engineer',
          location: 'San Francisco, CA',
          skills: ['JavaScript', 'React', 'Node.js', 'AWS'],
          experience: '8 years',
          lastActive: '2 days ago',
          matchPercentage: 95
        },
        {
          id: 'candidate-002',
          firstName: 'Emily',
          lastName: 'Johnson',
          title: 'UX/UI Designer',
          location: 'New York, NY',
          skills: ['UI Design', 'UX Research', 'Figma', 'Adobe XD'],
          experience: '5 years',
          lastActive: '1 week ago',
          matchPercentage: 87
        },
        {
          id: 'candidate-003',
          firstName: 'Michael',
          lastName: 'Chen',
          title: 'Data Scientist',
          location: 'Remote',
          skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
          experience: '6 years',
          lastActive: 'Today',
          matchPercentage: 82
        }
      ];
      
      setCandidates(mockCandidates);
      setTotalItems(42); // Mock total count
    } catch (err) {
      setError(err.message || 'Error searching candidates');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);
  
  // Run search when parameters change
  useEffect(() => {
    searchCandidates();
  }, [searchCandidates]);
  
  // Update search parameters
  const updateSearchParams = useCallback((newParams) => {
    setSearchParams(prev => ({
      ...prev,
      ...newParams,
      // Reset to first page when filters change
      page: newParams.filters ? 1 : newParams.page || prev.page
    }));
  }, []);
  
  // Update only filters
  const updateFilters = useCallback((newFilters) => {
    updateSearchParams({
      filters: {
        ...searchParams.filters,
        ...newFilters
      }
    });
  }, [updateSearchParams, searchParams.filters]); // Add searchParams.filters to dependency array
  
  // Update page
  const goToPage = useCallback((page) => {
    updateSearchParams({ page });
  }, [updateSearchParams]);
  
  // Clear all filters
  const clearFilters = useCallback(() => {
    updateSearchParams({
      filters: {},
      page: 1
    });
  }, [updateSearchParams]);
  
  const handleLoadMore = useCallback(() => {
    // Calculate if there are more items to load
    const hasMore = searchParams.page * searchParams.itemsPerPage < totalItems;
    
    if (!loading && hasMore) {
      updateSearchParams({
        page: searchParams.page + 1
      });
    }
  }, [loading, searchParams, totalItems, updateSearchParams]);
  
  const resetFilters = useCallback(() => {
    setSearchParams({
      ...searchParams,
      filters: initialFilters,
      page: 1
    });
  }, [initialFilters]); 
  
  return {
    candidates,
    loading,
    error,
    totalItems,
    searchParams,
    updateSearchParams,
    updateFilters,
    goToPage,
    clearFilters,
    handleLoadMore, // Add handleLoadMore to returned methods
    resetFilters,   // Add resetFilters to returned methods
    refresh: searchCandidates
  };
};

export default useCandidateSearch;
