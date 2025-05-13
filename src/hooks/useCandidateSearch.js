import { useState, useEffect, useCallback } from 'react';
import useApi from './useApi';

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
  
  const api = useApi();
  
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
  }, [searchParams.filters, updateSearchParams]);
  
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
    refresh: searchCandidates
  };
};

export default useCandidateSearch;
