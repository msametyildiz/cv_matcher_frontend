import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Filter, X } from 'lucide-react';
import JobCard from './JobCard';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import api from '../../api';
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
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Use debounce to avoid too many API calls when typing
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchJobs();
  }, [debouncedSearchQuery, filters, currentPage, matchingOnly]);

  const fetchJobs = async () => {
    // If we're already loading, don't trigger another load
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      // Construct query parameters
      const params = {
        page: currentPage,
        search: debouncedSearchQuery,
        ...filters,
        matching: matchingOnly
      };

      // In a real implementation, this would be an API call
      // const response = await api.job.searchJobs(params);
      // setJobs(response.data.jobs);
      // setTotalPages(response.data.totalPages);

      // For development, use cached mock data when possible
      // to avoid unnecessary re-renders
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
    // Use a memoized set of jobs to avoid recreation on every render
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
        isRemote: true
      },
      {
        id: 2,
        title: 'UI/UX Designer',
        company: 'Creative Designs',
        location: 'New York, NY',
        type: 'Full-time',
        salary: '$70,000 - $100,000',
        postedDate: '2023-05-08',
        description: 'Join our creative team to design beautiful and intuitive user interfaces for web and mobile applications.',
        matchPercentage: 85,
        isRemote: false
      },
      {
        id: 3,
        title: 'Backend Developer',
        company: 'Data Systems',
        location: 'Austin, TX',
        type: 'Contract',
        salary: '$60 - $80 per hour',
        postedDate: '2023-05-10',
        description: 'Seeking a backend developer with strong Python and database skills to build scalable services.',
        matchPercentage: 78,
        isRemote: true
      },
      {
        id: 4,
        title: 'Full Stack Developer',
        company: 'Startup Hub',
        location: 'Remote',
        type: 'Full-time',
        salary: '$90,000 - $130,000',
        postedDate: '2023-05-12',
        description: 'Be part of our growing team building the next generation of productivity tools.',
        matchPercentage: 88,
        isRemote: true
      },
      {
        id: 5,
        title: 'DevOps Engineer',
        company: 'Cloud Solutions',
        location: 'Chicago, IL',
        type: 'Full-time',
        salary: '$100,000 - $140,000',
        postedDate: '2023-05-11',
        description: 'Help us build and maintain our cloud infrastructure and CI/CD pipelines.',
        matchPercentage: 72,
        isRemote: false
      },
      {
        id: 6,
        title: 'Mobile Developer',
        company: 'App Innovations',
        location: 'Seattle, WA',
        type: 'Full-time',
        salary: '$85,000 - $125,000',
        postedDate: '2023-05-09',
        description: 'Develop cutting-edge mobile applications for iOS and Android platforms.',
        matchPercentage: 80,
        isRemote: false
      }
    ];

    // Apply filters
    let filteredJobs = [...mockJobs];
    
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply all other filters in one pass to improve performance
    if (params.location || params.jobType || params.remoteOnly) {
      filteredJobs = filteredJobs.filter(job => {
        const locationMatch = !params.location || 
          job.location.toLowerCase().includes(params.location.toLowerCase());
        
        const typeMatch = !params.jobType || 
          job.type.toLowerCase() === params.jobType.toLowerCase();
        
        const remoteMatch = !params.remoteOnly || job.isRemote;
        
        return locationMatch && typeMatch && remoteMatch;
      });
    }

    // Sort by match percentage if matching only
    if (params.matching) {
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
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate if we have active filters
  const hasActiveFilters = !!searchQuery || 
    !!filters.location || 
    !!filters.jobType || 
    !!filters.experienceLevel || 
    filters.remoteOnly;

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
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
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="executive">Executive</option>
              </select>
            </div>

            <div className="flex items-center">
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
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-500 mr-2">Active filters:</span>
            <div className="flex flex-wrap gap-2">
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
              {filters.location && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Location: {filters.location}
                  <button 
                    type="button" 
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 text-blue-500 hover:bg-blue-300"
                    onClick={() => setFilters(prev => ({ ...prev, location: '' }))}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.jobType && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Type: {filters.jobType}
                  <button 
                    type="button" 
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 text-blue-500 hover:bg-blue-300"
                    onClick={() => setFilters(prev => ({ ...prev, jobType: '' }))}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.experienceLevel && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Experience: {filters.experienceLevel}
                  <button 
                    type="button" 
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 text-blue-500 hover:bg-blue-300"
                    onClick={() => setFilters(prev => ({ ...prev, experienceLevel: '' }))}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.remoteOnly && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Remote Only
                  <button 
                    type="button" 
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 text-blue-500 hover:bg-blue-300"
                    onClick={() => setFilters(prev => ({ ...prev, remoteOnly: false }))}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
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

      {/* Jobs List */}
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchJobs} />
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <Clock className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria to find more jobs.
          </p>
          {hasActiveFilters && (
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
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {[...Array(totalPages).keys()].map(number => (
                  <button
                    key={number + 1}
                    onClick={() => handlePageChange(number + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === number + 1
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {number + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
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
        </>
      )}
    </div>
  );
};

export default JobList;