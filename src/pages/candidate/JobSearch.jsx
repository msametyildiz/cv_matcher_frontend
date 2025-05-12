import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Briefcase, Filter, X, 
  ChevronDown, Clock
} from 'lucide-react';
import JobList from '../../components/candidate/JobList';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useDebounce } from '../../hooks/useDebounce';
import api from '../../api';

const JobSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse URL search params for initial filters
  const searchParams = new URLSearchParams(location.search);
  
  // State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    jobType: searchParams.get('type') || 'all',
    experience: searchParams.get('experience') || 'all',
    salary: searchParams.get('salary') || 'all',
    remote: searchParams.get('remote') === 'true' || false,
    matchingOnly: searchParams.get('matching') === 'true' || false,
    postedDate: searchParams.get('posted') || 'all'
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get('page') || '1', 10),
    perPage: 10,
    totalPages: 1,
    totalJobs: 0
  });
  
  // Debounce search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('q', searchQuery);
    if (filters.location) params.set('location', filters.location);
    if (filters.jobType !== 'all') params.set('type', filters.jobType);
    if (filters.experience !== 'all') params.set('experience', filters.experience);
    if (filters.salary !== 'all') params.set('salary', filters.salary);
    if (filters.remote) params.set('remote', 'true');
    if (filters.matchingOnly) params.set('matching', 'true');
    if (filters.postedDate !== 'all') params.set('posted', filters.postedDate);
    if (sortBy !== 'relevance') params.set('sort', sortBy);
    if (pagination.page !== 1) params.set('page', pagination.page.toString());
    
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    
    // Fetch jobs with the updated filters
    fetchJobs();
    
  }, [debouncedSearchQuery, filters, sortBy, pagination.page]);
  
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockJobs = Array(12).fill().map((_, idx) => ({
        id: idx + 1,
        title: ['Frontend Developer', 'UX Designer', 'Full Stack Engineer', 'Product Manager', 'Data Scientist'][idx % 5],
        company: ['Tech Solutions Inc.', 'Design Studio', 'Global Systems', 'Innovate Labs', 'Data Insights'][idx % 5],
        location: ['San Francisco, CA', 'New York, NY', 'Remote', 'Austin, TX', 'Seattle, WA'][idx % 5],
        type: ['Full-time', 'Part-time', 'Contract', 'Full-time', 'Full-time'][idx % 5],
        salary: ['$80K - $120K', '$70K - $90K', '$100K - $140K', '$110K - $150K', '$90K - $130K'][idx % 5],
        postedDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam cursus sapien at justo facilisis facilisis.',
        matchPercentage: Math.floor(Math.random() * 20) + 80,
        isRemote: [true, false, true, false, false][idx % 5]
      }));
      
      setJobs(mockJobs);
      setPagination(prev => ({
        ...prev,
        totalPages: 5,
        totalJobs: 58
      }));
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      location: '',
      jobType: 'all',
      experience: 'all',
      salary: 'all',
      remote: false,
      matchingOnly: false,
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
      filters.matchingOnly || 
      filters.postedDate !== 'all'
    );
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Find Your Perfect Job</h1>
      
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Job title, keywords, or company"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="location"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Location"
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>
          
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {showAdvancedFilters ? 'Hide Filters' : 'More Filters'}
          </button>
        </div>
        
        {/* Advanced Filters */}
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
                  <option value="temporary">Temporary</option>
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
                  <option value="executive">Executive</option>
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
              
              <div className="flex items-center">
                <input
                  id="matchingOnly"
                  name="matchingOnly"
                  type="checkbox"
                  checked={filters.matchingOnly}
                  onChange={handleFilterChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="matchingOnly" className="ml-2 block text-sm text-gray-700">
                  Show Only Matching Jobs
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
              <div className="flex flex-wrap gap-2">
                {/* Display active filters as tags */}
                {searchQuery && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {searchQuery}
                    <button 
                      type="button"
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                      onClick={() => setSearchQuery('')}
                    >
                      <span className="sr-only">Remove filter</span>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {/* Other filter tags would go here (location, job type, etc.) */}
                
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Clear all filters
                </button>
              </div>
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
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Job List */}
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchJobs} />
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
            <Briefcase className="h-6 w-6 text-gray-400" aria-hidden="true" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs found</h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search criteria or filters to see more results.
          </p>
          {hasActiveFilters() && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                    <a href={`/candidate/jobs/${job.id}`} className="hover:text-blue-600">
                      {job.title}
                    </a>
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
                      <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>{job.location}</span>
                      {job.isRemote && <span className="ml-1.5 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Remote</span>}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mr-4">
                      <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>{job.type}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{job.salary}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                  {job.description}
                </p>
                
                <div className="mt-4 flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{new Date(job.postedDate).toLocaleDateString()}</span>
                  </div>
                  <a 
                    href={`/candidate/jobs/${job.id}`}
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View Job
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {jobs.length > 0 && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Generate page buttons */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, idx) => {
              const pageNumber = idx + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setPagination(prev => ({ ...prev, page: pageNumber }))}
                  aria-current={pageNumber === pagination.page ? 'page' : undefined}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    pageNumber === pagination.page
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      )}
      
      {/* Job Search Tips */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-medium text-blue-900">Job Search Tips</h2>
        <ul className="mt-4 space-y-2 text-sm text-blue-700">
          <li className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-3">Use specific keywords related to your skills and the job you want.</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-3">Complete your profile to receive more accurate job matches.</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-3">Check the "Show Only Matching Jobs" option to see positions that best match your skills.</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-3">Set up job alerts to receive notifications when new matching jobs are posted.</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default JobSearch;