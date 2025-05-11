import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Briefcase, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronDown, 
  Check, 
  X, 
  AlertCircle,
  Calendar,
  Clock,
  Users,
  Building,
  MapPin,
  ChevronsUpDown,
  ChevronUp
} from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useDebounce } from '../../hooks/useDebounce';
import { useNotification } from '../../contexts/NotificationContext';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';

const JobManagement = () => {
  // State
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    experience: 'all',
    dateRange: 'all'
  });
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Sort
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0
  });

  // Notifications
  const { success, error: showError } = useNotification();
  
  // Fetch jobs
  const { 
    data, 
    loading, 
    error, 
    execute: fetchJobs 
  } = useApi({
    url: '/api/admin/jobs',
    method: 'GET',
    params: {
      search: debouncedSearchQuery,
      ...filters,
      page: pagination.page,
      perPage: pagination.perPage,
      sortBy: sortConfig.key,
      sortDirection: sortConfig.direction
    },
    autoFetch: true,
    dependencies: [
      debouncedSearchQuery, 
      filters.status, 
      filters.type, 
      filters.experience,
      filters.dateRange,
      pagination.page,
      sortConfig.key,
      sortConfig.direction
    ]
  });

  // Update jobs when data changes
  useEffect(() => {
    if (data) {
      setJobs(data.jobs || []);
      setPagination(prev => ({
        ...prev,
        total: data.total || 0
      }));
    }
  }, [data]);

  // Mock data for development
  useEffect(() => {
    // Simulate API data
    const mockJobs = [
      {
        id: 1,
        title: 'Senior Frontend Developer',
        company: 'Tech Solutions Inc.',
        location: 'San Francisco, CA',
        type: 'Full-time',
        experienceLevel: 'Senior',
        status: 'active',
        createdAt: '2023-05-01T14:30:00Z',
        updatedAt: '2023-05-01T14:30:00Z',
        applicationDeadline: '2023-06-15T23:59:59Z',
        applicantsCount: 28,
        postedBy: {
          id: 2,
          name: 'Emily Johnson',
          email: 'emily.johnson@example.com'
        },
        isRemote: true,
        salaryRange: '$120,000 - $150,000'
      },
      {
        id: 2,
        title: 'UX Designer',
        company: 'Creative Design Studio',
        location: 'New York, NY',
        type: 'Full-time',
        experienceLevel: 'Mid Level',
        status: 'active',
        createdAt: '2023-04-28T09:45:00Z',
        updatedAt: '2023-04-28T09:45:00Z',
        applicationDeadline: '2023-05-28T23:59:59Z',
        applicantsCount: 15,
        postedBy: {
          id: 5,
          name: 'Sarah Miller',
          email: 'sarah.miller@example.com'
        },
        isRemote: false,
        salaryRange: '$85,000 - $105,000'
      },
      {
        id: 3,
        title: 'Backend Developer',
        company: 'Data Systems Inc.',
        location: 'Remote',
        type: 'Contract',
        experienceLevel: 'Mid Level',
        status: 'closed',
        createdAt: '2023-04-15T11:20:00Z',
        updatedAt: '2023-05-10T09:30:00Z',
        applicationDeadline: '2023-05-10T23:59:59Z',
        applicantsCount: 42,
        postedBy: {
          id: 2,
          name: 'Emily Johnson',
          email: 'emily.johnson@example.com'
        },
        isRemote: true,
        salaryRange: '$90,000 - $120,000'
      },
      {
        id: 4,
        title: 'Marketing Manager',
        company: 'Global Brands Ltd.',
        location: 'Chicago, IL',
        type: 'Full-time',
        experienceLevel: 'Senior',
        status: 'draft',
        createdAt: '2023-05-05T16:45:00Z',
        updatedAt: '2023-05-05T16:45:00Z',
        applicationDeadline: null,
        applicantsCount: 0,
        postedBy: {
          id: 7,
          name: 'Michael Brown',
          email: 'michael.brown@example.com'
        },
        isRemote: false,
        salaryRange: '$90,000 - $110,000'
      },
      {
        id: 5,
        title: 'DevOps Engineer',
        company: 'Cloud Solutions',
        location: 'Austin, TX',
        type: 'Full-time',
        experienceLevel: 'Senior',
        status: 'paused',
        createdAt: '2023-04-20T13:15:00Z',
        updatedAt: '2023-05-07T10:20:00Z',
        applicationDeadline: '2023-06-01T23:59:59Z',
        applicantsCount: 18,
        postedBy: {
          id: 3,
          name: 'David Wong',
          email: 'david.wong@example.com'
        },
        isRemote: true,
        salaryRange: '$110,000 - $140,000'
      }
    ];

    const mockResponse = {
      jobs: mockJobs,
      total: 158,
      page: 1,
      perPage: 10
    };

    // Use mock data if no real data is available
    if (!data && !loading && !error) {
      setJobs(mockResponse.jobs);
      setPagination(prev => ({
        ...prev,
        total: mockResponse.total
      }));
    }
  }, [data, loading, error]);

  // Filter change handler
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    // Reset to first page when filters change
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };

  // Sort handler
  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return {
        key,
        direction: 'asc'
      };
    });
  };

  // Get sort icon based on current sort config
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronsUpDown className="h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  // Handle job deletion
  const handleDeleteClick = (job) => {
    setSelectedJob(job);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      // In a real app, this would call the API
      // await api.delete(`/api/admin/jobs/${selectedJob.id}`);
      
      // Remove job from local state
      setJobs(prevJobs => prevJobs.filter(job => job.id !== selectedJob.id));
      
      success('Job deleted successfully');
      setShowDeleteModal(false);
    } catch (err) {
      showError('Failed to delete job');
    }
  };

  // Handle view job details
  const handleViewJob = (job) => {
    setSelectedJob(job);
    setShowViewModal(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get time ago from date
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return diffMinutes === 0 ? 'Just now' : `${diffMinutes}m ago`;
      }
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)}w ago`;
    } else {
      return formatDate(dateString);
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setFilters({
      status: 'all',
      type: 'all',
      experience: 'all',
      dateRange: 'all'
    });
    setSortConfig({
      key: 'createdAt',
      direction: 'desc'
    });
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
        
        <div className="flex items-center space-x-2">
          <Link
            to="/admin/jobs/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Add Job
          </Link>
          
          <button
            onClick={() => fetchJobs()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="w-full md:w-1/3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search jobs by title, company, or location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-2/3">
              <div>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              
              <div>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Job Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              
              <div>
                <select
                  name="dateRange"
                  value={filters.dateRange}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
            </button>
            
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={resetFilters}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Filters
            </button>
          </div>
          
          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              
              <div className="flex items-center mt-5">
                <input
                  id="remote"
                  name="remote"
                  type="checkbox"
                  checked={filters.remote}
                  onChange={(e) => setFilters(prev => ({ ...prev, remote: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remote" className="ml-2 block text-sm text-gray-700">
                  Remote Jobs Only
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results and actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {loading ? 'Loading Jobs...' : `${pagination.total} Jobs Found`}
          </h3>
          
          <div>
            <select
              value={sortConfig.key + '-' + sortConfig.direction}
              onChange={(e) => {
                const [key, direction] = e.target.value.split('-');
                setSortConfig({ key, direction });
              }}
              className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="company-asc">Company (A-Z)</option>
              <option value="company-desc">Company (Z-A)</option>
              <option value="applicantsCount-desc">Most Applications</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="p-6">
            <Loader />
          </div>
        ) : error ? (
          <div className="p-6">
            <ErrorMessage message="Failed to load jobs. Please try again." onRetry={fetchJobs} />
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-6 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Jobs Found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="group inline-flex items-center"
                        onClick={() => handleSort('title')}
                      >
                        Job Title
                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          {getSortIcon('title')}
                        </span>
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="group inline-flex items-center"
                        onClick={() => handleSort('company')}
                      >
                        Company
                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          {getSortIcon('company')}
                        </span>
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="group inline-flex items-center"
                        onClick={() => handleSort('status')}
                      >
                        Status
                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          {getSortIcon('status')}
                        </span>
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="group inline-flex items-center"
                        onClick={() => handleSort('applicantsCount')}
                      >
                        Applications
                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          {getSortIcon('applicantsCount')}
                        </span>
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="group inline-flex items-center"
                        onClick={() => handleSort('createdAt')}
                      >
                        Posted
                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          {getSortIcon('createdAt')}
                        </span>
                      </button>
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{job.title}</div>
                        <div className="text-sm text-gray-500">{job.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{job.company}</div>
                        <div className="text-sm text-gray-500">{job.postedBy?.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>{job.location}</span>
                          {job.isRemote && (
                            <span className="ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Remote
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(job.status)}`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.applicantsCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{getTimeAgo(job.createdAt)}</div>
                        {job.applicationDeadline && (
                          <div className="text-xs flex items-center mt-1 text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            Deadline: {formatDate(job.applicationDeadline)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-3 justify-end">
                          <button
                            onClick={() => handleViewJob(job)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <Link
                            to={`/admin/jobs/${job.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(job)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page * pagination.perPage >= pagination.total}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(pagination.page - 1) * pagination.perPage + 1}</span> to <span className="font-medium">
                      {Math.min(pagination.page * pagination.perPage, pagination.total)}
                    </span> of <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronDown className="h-5 w-5 rotate-90" />
                    </button>
                    
                    {/* Generate page buttons */}
                    {Array.from({ length: Math.min(5, Math.ceil(pagination.total / pagination.perPage)) }).map((_, idx) => {
                      const pageNumber = idx + 1;
                      return (
                        <button
                          key={idx}
                          onClick={() => setPagination(prev => ({ ...prev, page: pageNumber }))}
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
                      disabled={pagination.page * pagination.perPage >= pagination.total}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronDown className="h-5 w-5 -rotate-90" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* View Job Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Job Details"
        size="lg"
      >
        {selectedJob && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-900">{selectedJob.title}</h3>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500">
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-gray-400 mr-1" />
                  {selectedJob.company}
                </div>
                <span className="hidden sm:inline mx-2">•</span>
                <div className="flex items-center mt-1 sm:mt-0">
                  <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                  {selectedJob.location}
                  {selectedJob.isRemote && (
                    <span className="ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Remote
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Posted By</h4>
                <p className="text-sm text-gray-900">{selectedJob.postedBy?.name}</p>
                <p className="text-sm text-gray-500">{selectedJob.postedBy?.email}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Job Type</h4>
                <p className="text-sm text-gray-900">{selectedJob.type}</p>
                <p className="text-sm text-gray-900 mt-1">{selectedJob.experienceLevel} Level</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Salary Range</h4>
                <p className="text-sm text-gray-900">{selectedJob.salaryRange || 'Not specified'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(selectedJob.status)}`}>
                  {selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1)}
                </span>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Posted On</h4>
                <p className="text-sm text-gray-900">{formatDate(selectedJob.createdAt)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Application Deadline</h4>
                <p className="text-sm text-gray-900">{formatDate(selectedJob.applicationDeadline)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h4>
                <p className="text-sm text-gray-900">{formatDate(selectedJob.updatedAt)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Applications</h4>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900">{selectedJob.applicantsCount}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Close
              </button>
              
              <Link
                to={`/admin/jobs/${selectedJob.id}/applications`}
                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Users className="inline-block h-4 w-4 mr-1 align-text-bottom" />
                View Applicants
              </Link>
              
              <Link
                to={`/admin/jobs/${selectedJob.id}/edit`}
                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Edit className="inline-block h-4 w-4 mr-1 align-text-bottom" />
                Edit Job
              </Link>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Job Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Job"
        size="sm"
      >
        {selectedJob && (
          <div className="p-6">
            <div className="flex items-center justify-center text-red-500 mb-4">
              <AlertCircle className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-center text-gray-900">Are you sure?</h3>
            <p className="mt-2 text-center text-gray-500">
              You're about to delete <span className="font-medium">{selectedJob.title}</span> at <span className="font-medium">{selectedJob.company}</span>. This action cannot be undone.
            </p>
            {selectedJob.applicantsCount > 0 && (
              <p className="mt-2 text-center text-red-500">
                Warning: This job has {selectedJob.applicantsCount} applications that will also be deleted.
              </p>
            )}
            
            <div className="mt-6 flex justify-center space-x-4">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={confirmDelete}
              >
                Delete Job
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default JobManagement;