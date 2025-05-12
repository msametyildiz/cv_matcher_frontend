import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Filter, Clock, Briefcase } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const JobSearch = () => {
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    jobType: 'all',
    experience: 'all',
    remote: false,
    salary: 'all',
    postedDate: 'all'
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    totalPages: 5,
    totalJobs: 58
  });
  
  // Results
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  // Fetch jobs when search params change
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Mock data - in a real app, this would be an API call
        setTimeout(() => {
          const mockJobs = Array(12).fill().map((_, idx) => ({
            id: idx + 1,
            title: ['Frontend Developer', 'UX Designer', 'Full Stack Engineer', 'Product Manager', 'Data Scientist'][idx % 5],
            company: ['Tech Solutions Inc.', 'Design Studio', 'Global Systems', 'Innovate Labs', 'Data Insights'][idx % 5],
            location: ['San Francisco, CA', 'New York, NY', 'Remote', 'Austin, TX', 'Seattle, WA'][idx % 5],
            type: ['Full-time', 'Part-time', 'Contract', 'Full-time', 'Full-time'][idx % 5],
            salary: ['$80K - $120K', '$70K - $90K', '$100K - $140K', '$110K - $150K', '$90K - $130K'][idx % 5],
            postedDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            matchPercentage: Math.floor(Math.random() * 20) + 80,
            isRemote: [true, false, true, false, false][idx % 5]
          }));
          
          setJobs(mockJobs);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again.');
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [debouncedSearchQuery, filters, sortBy, pagination.page]);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      location: '',
      jobType: 'all',
      experience: 'all',
      remote: false,
      salary: 'all',
      postedDate: 'all'
    });
    setSortBy('relevance');
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  const hasActiveFilters = () => {
    return (
      searchQuery || 
      filters.location || 
      filters.jobType !== 'all' || 
      filters.experience !== 'all' || 
      filters.salary !== 'all' || 
      filters.remote || 
      filters.postedDate !== 'all'
    );
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(Math.abs(now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Find Your Perfect Job</h1>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className="pl-10 w-full border border-gray-300 rounded-md"
              placeholder="Job title, keywords, or company"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Location Filter */}
          <div className="relative md:w-64">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="location"
              className="pl-10 w-full border border-gray-300 rounded-md"
              placeholder="Location"
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>
          
          {/* Advanced Filters Toggle */}
          <button
            type="button"
            className="btn-outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {showAdvancedFilters ? 'Hide Filters' : 'More Filters'}
          </button>
        </div>
        
        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Job Type */}
              <div>
                <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type
                </label>
                <select
                  id="jobType"
                  name="jobType"
                  value={filters.jobType}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              
              {/* Experience Level */}
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level
                </label>
                <select
                  id="experience"
                  name="experience"
                  value={filters.experience}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                </select>
              </div>
              
              {/* Salary Range */}
              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                  Salary Range
                </label>
                <select
                  id="salary"
                  name="salary"
                  value={filters.salary}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">Any Salary</option>
                  <option value="0-50000">$0 - $50,000</option>
                  <option value="50000-80000">$50,000 - $80,000</option>
                  <option value="80000-100000">$80,000 - $100,000</option>
                  <option value="100000-150000">$100,000 - $150,000</option>
                  <option value="150000+">$150,000+</option>
                </select>
              </div>
              
              {/* Date Posted */}
              <div>
                <label htmlFor="postedDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date Posted
                </label>
                <select
                  id="postedDate"
                  name="postedDate"
                  value={filters.postedDate}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">Any Time</option>
                  <option value="today">Today</option>
                  <option value="3days">Last 3 Days</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                <input
                  id="remote"
                  name="remote"
                  type="checkbox"
                  checked={filters.remote}
                  onChange={handleFilterChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remote" className="ml-2 block text-sm text-gray-700">
                  Remote Only
                </label>
              </div>
            </div>
          </div>
        )}
        
        {/* Active Filters */}
        {hasActiveFilters() && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Active filters:</span>
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            {loading ? 'Searching jobs...' : `${pagination.totalJobs} jobs found`}
          </h2>
          <p className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * pagination.perPage) + 1} to {Math.min(pagination.page * pagination.perPage, pagination.totalJobs)} of {pagination.totalJobs} results
          </p>
        </div>
        
        <div className="mt-2 sm:mt-0 relative">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="relevance">Relevance</option>
              <option value="date">Most Recent</option>
              <option value="salary-high">Salary (High to Low)</option>
              <option value="salary-low">Salary (Low to High)</option>
              <option value="match">Match Score</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Job List */}
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs found</h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search criteria or filters to see more results.
          </p>
          {hasActiveFilters() && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 btn-outline"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div 
              key={job.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">
                    <Link to={`/candidate/jobs/${job.id}`} className="hover:text-blue-600">
                      {job.title}
                    </Link>
                  </h3>
                  {job.matchPercentage && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.matchPercentage >= 90 ? 'bg-green-100 text-green-800' :
                      job.matchPercentage >= 70 ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {job.matchPercentage}% Match
                    </span>
                  )}
                </div>
                
                <div className="mt-2">
                  <p className="text-base font-medium text-gray-700">{job.company}</p>
                  <div className="mt-2 flex flex-wrap gap-y-2">
                    <div className="flex items-center text-sm text-gray-500 mr-4">
                      <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
                      <span>{job.location}</span>
                      {job.isRemote && <span className="ml-1.5 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Remote</span>}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mr-4">
                      <Briefcase className="mr-1.5 h-4 w-4 text-gray-400" />
                      <span>{job.type}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{job.salary}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{formatDate(job.postedDate)}</span>
                  </div>
                  <Link 
                    to={`/candidate/jobs/${job.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View Job
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {jobs.length > 0 && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="pagination-btn rounded-l-md"
            >
              <span className="sr-only">Previous</span>
              &#8592;
            </button>
            
            {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, idx) => {
              const pageNumber = idx + 1;
              return (
                <button
                  key={idx}
                  onClick={() => setPagination(prev => ({ ...prev, page: pageNumber }))}
                  className={`pagination-btn ${
                    pageNumber === pagination.page ? 'bg-blue-50 border-blue-500 text-blue-600' : ''
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="pagination-btn rounded-r-md"
            >
              <span className="sr-only">Next</span>
              &#8594;
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default JobSearch;