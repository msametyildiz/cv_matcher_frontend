import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Filter, X, ChevronDown, Briefcase, DollarSign } from 'lucide-react';
import JobCard from './JobCard';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import { useDebounce } from '../../hooks/useDebounce';

const JobList = ({ matchingOnly = false }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    experienceLevel: '',
    remoteOnly: false,
    salaryRange: '',
    postedWithin: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  // Use debounce to avoid too many API calls when typing
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchJobs();
  }, [debouncedSearchQuery, filters, currentPage, matchingOnly, sortBy]);

  const fetchJobs = async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      // Construct query parameters
      const params = {
        page: currentPage,
        search: debouncedSearchQuery,
        sort: sortBy,
        ...filters,
        matching: matchingOnly
      };

      // Mock data for development
      const mockJobs = getMockJobs(params);
      setJobs(mockJobs);
      setTotalPages(Math.ceil(mockJobs.length / 6));
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get and filter mock data
  const getMockJobs = (params) => {
    // Use a memoized set of jobs
    const mockJobs = [
      {
        id: 1,
        title: 'Frontend Developer',
        company: 'Tech Solutions Inc.',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$80,000 - $120,000',
        postedDate: '2023-05-05',
        description: 'We are looking for an experienced Frontend Developer proficient in React and modern JavaScript.',
        matchPercentage: 92,
        isRemote: true,
        experienceLevel: 'Mid-Level'
      },
      // Additional mock jobs...
    ];

    // Apply filters in one pass for better performance
    let filteredJobs = mockJobs.filter(job => {
      // Search term
      if (params.search && !job.title.toLowerCase().includes(params.search.toLowerCase()) && 
          !job.company.toLowerCase().includes(params.search.toLowerCase()) &&
          !job.description.toLowerCase().includes(params.search.toLowerCase())) {
        return false;
      }
      
      // Location
      if (params.location && !job.location.toLowerCase().includes(params.location.toLowerCase())) {
        return false;
      }
      
      // Job type
      if (params.jobType && params.jobType !== 'all' && job.type !== params.jobType) {
        return false;
      }
      
      // Experience level
      if (params.experienceLevel && params.experienceLevel !== 'all' && 
          job.experienceLevel !== params.experienceLevel) {
        return false;
      }
      
      // Remote only
      if (params.remoteOnly && !job.isRemote) {
        return false;
      }
      
      // Salary range (would need additional logic)
      
      // Posted within (would need additional logic)
      
      return true;
    });

    // Apply sorting
    if (params.sort === 'recent') {
      filteredJobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    } else if (params.sort === 'match' && params.matching) {
      filteredJobs.sort((a, b) => b.matchPercentage - a.matchPercentage);
    } 

    return filteredJobs;
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      jobType: '',
      experienceLevel: '',
      remoteOnly: false,
      salaryRange: '',
      postedWithin: ''
    });
    setSearchQuery('');
    setSortBy('relevance');
    setCurrentPage(1);
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value) || !!searchQuery;
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search for jobs by title, company, or keywords"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          {/* Location Filter - Always shown */}
          <div className="relative md:w-60">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative md:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="relevance">Most Relevant</option>
              <option value="recent">Most Recent</option>
              {matchingOnly && <option value="match">Best Match</option>}
              <option value="salary">Highest Salary</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Additional Filters - Conditionally shown */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                Job Type
              </label>
              <select
                id="jobType"
                name="jobType"
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filters.jobType}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            <div>
              <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filters.experienceLevel}
                onChange={handleFilterChange}
              >
                <option value="">All Levels</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid-Level">Mid Level</option>
                <option value="Senior">Senior Level</option>
                <option value="Executive">Executive</option>
              </select>
            </div>

            <div>
              <label htmlFor="salaryRange" className="block text-sm font-medium text-gray-700 mb-1">
                Salary Range
              </label>
              <select
                id="salaryRange"
                name="salaryRange"
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filters.salaryRange}
                onChange={handleFilterChange}
              >
                <option value="">Any Salary</option>
                <option value="0-50000">Under $50K</option>
                <option value="50000-80000">$50K - $80K</option>
                <option value="80000-100000">$80K - $100K</option>
                <option value="100000-150000">$100K - $150K</option>
                <option value="150000-">$150K+</option>
              </select>
            </div>

            <div>
              <label htmlFor="postedWithin" className="block text-sm font-medium text-gray-700 mb-1">
                Posted Within
              </label>
              <select
                id="postedWithin"
                name="postedWithin"
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filters.postedWithin}
                onChange={handleFilterChange}
              >
                <option value="">Any Time</option>
                <option value="1d">24 Hours</option>
                <option value="7d">7 Days</option>
                <option value="14d">14 Days</option>
                <option value="30d">30 Days</option>
              </select>
            </div>

            <div className="flex items-center h-full pt-6">
              <input
                id="remoteOnly"
                name="remoteOnly"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={filters.remoteOnly}
                onChange={handleFilterChange}
              />
              <label htmlFor="remoteOnly" className="ml-2 block text-sm text-gray-700">
                Remote Only
              </label>
            </div>

            {/* Clear filters button */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters() && !showFilters && (
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-500 mr-2">Active filters:</span>
            <div className="flex flex-wrap gap-2">
              {/* Display active filters as pills */}
              {searchQuery && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Search: {searchQuery}
                  <button 
                    type="button" 
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 text-blue-500 hover:bg-blue-300"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {/* Add more active filter pills here */}
              <button 
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Status */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div>
          Showing {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
          {hasActiveFilters() && ' with current filters'}
        </div>
        <div>
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Jobs List with Loading/Error States */}
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchJobs} />
      ) : jobs.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria to find more jobs.
          </p>
          {hasActiveFilters() && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              ←
            </button>
            
            {/* Dynamic page numbers with ellipsis for many pages */}
            {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = idx + 1;
              } else if (currentPage <= 3) {
                pageNum = idx + 1;
                if (idx === 4) pageNum = totalPages;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + idx;
              } else {
                pageNum = currentPage - 2 + idx;
              }
              
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === pageNum
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              →
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default JobList;