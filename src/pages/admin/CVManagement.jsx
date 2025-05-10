import React, { useState, useEffect } from 'react';
import { 
  Download,
  Eye,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  FileText,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown
} from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useDebounce } from '../../hooks/useDebounce';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';
import { useNotification } from '../../contexts/NotificationContext';

const CVManagement = () => {
  // State for list of CVs
  const [cvs, setCvs] = useState([]);
  
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [filters, setFilters] = useState({
    status: 'all',
    parseStatus: 'all',
    dateRange: 'all',
  });
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0
  });
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: 'uploadedAt',
    direction: 'desc'
  });
  
  // Modal states
  const [selectedCV, setSelectedCV] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bulkActionCVs, setBulkActionCVs] = useState([]);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  
  // Selection states
  const [selectedCVs, setSelectedCVs] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Notifications
  const { success, error: showError } = useNotification();
  
  // Fetch CVs from API
  const { 
    data, 
    loading, 
    error, 
    execute: fetchCVs 
  } = useApi({
    url: '/api/admin/cvs',
    method: 'GET',
    params: {
      page: pagination.page,
      perPage: pagination.perPage,
      search: debouncedSearchQuery,
      ...filters,
      sortBy: sortConfig.key,
      sortDirection: sortConfig.direction
    },
    autoFetch: true,
    dependencies: [
      pagination.page, 
      pagination.perPage, 
      debouncedSearchQuery, 
      sortConfig.key, 
      sortConfig.direction
    ]
  });

  // Update filters
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

  // Handle sorting
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

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronsUpDown className="h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  // Selection handlers
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCVs([]);
    } else {
      // Select all CVs on the current page
      setSelectedCVs(cvs.map(cv => cv.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectCV = (cvId) => {
    setSelectedCVs(prev => {
      if (prev.includes(cvId)) {
        const newSelected = prev.filter(id => id !== cvId);
        setSelectAll(false);
        return newSelected;
      } else {
        const newSelected = [...prev, cvId];
        if (newSelected.length === cvs.length) {
          setSelectAll(true);
        }
        return newSelected;
      }
    });
  };

  // Bulk actions
  const handleBulkAction = (action) => {
    setBulkActionCVs(selectedCVs);
    setShowBulkActionModal(true);
  };

  const confirmBulkAction = async () => {
    try {
      // This would actually call the API in a real implementation
      // await api.post('/api/admin/cvs/bulk-action', {
      //   action: 'delete',
      //   cvIds: bulkActionCVs
      // });
      
      success(`Successfully deleted ${bulkActionCVs.length} CVs`);
      // Remove deleted CVs from the list
      setCvs(prevCVs => prevCVs.filter(cv => !bulkActionCVs.includes(cv.id)));
      // Clear selections
      setSelectedCVs([]);
      setSelectAll(false);
      setShowBulkActionModal(false);
    } catch (err) {
      showError('Failed to perform bulk action');
    }
  };

  // View CV details
  const handleViewCV = (cv) => {
    setSelectedCV(cv);
    setShowViewModal(true);
  };

  // Delete single CV
  const handleDeleteClick = (cv) => {
    setSelectedCV(cv);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      // This would actually call the API in a real implementation
      // await api.delete(`/api/admin/cvs/${selectedCV.id}`);
      
      success('CV deleted successfully');
      // Remove the deleted CV from the list
      setCvs(prevCVs => prevCVs.filter(cv => cv.id !== selectedCV.id));
      setShowDeleteModal(false);
    } catch (err) {
      showError('Failed to delete CV');
    }
  };

  // Download CV
  const handleDownload = (cv) => {
    // This would actually download the file in a real implementation
    success(`Downloading ${cv.filename}`);
  };

  // Effect to update local CVs when data changes
  useEffect(() => {
    if (data) {
      setCvs(data.cvs || []);
      setPagination(prev => ({
        ...prev,
        total: data.total || 0
      }));
    }
  }, [data]);

  // Mock data for demonstration
  useEffect(() => {
    // This simulates the API response
    const mockCVs = [
      {
        id: 1,
        filename: 'john_smith_resume.pdf',
        fileSize: '420 KB',
        fileType: 'application/pdf',
        uploadedAt: '2023-05-10T14:30:00Z',
        user: {
          id: 101,
          name: 'John Smith',
          email: 'john.smith@example.com',
          role: 'candidate'
        },
        parsed: true,
        parseStatus: 'success',
        skills: ['JavaScript', 'React', 'Node.js', 'CSS', 'HTML'],
        experience: [
          { role: 'Senior Frontend Developer', company: 'Tech Solutions Inc.', period: 'Jan 2020 - Present' },
          { role: 'Web Developer', company: 'Digital Agency', period: 'Mar 2018 - Dec 2019' }
        ],
        education: [
          { degree: 'Bachelor of Computer Science', institution: 'State University', year: '2018' }
        ]
      },
      {
        id: 2,
        filename: 'emily_johnson_cv.docx',
        fileSize: '380 KB',
        fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        uploadedAt: '2023-05-09T10:15:00Z',
        user: {
          id: 102,
          name: 'Emily Johnson',
          email: 'emily.johnson@example.com',
          role: 'candidate'
        },
        parsed: true,
        parseStatus: 'success',
        skills: ['Project Management', 'Marketing Strategy', 'Content Creation', 'Social Media'],
        experience: [
          { role: 'Marketing Manager', company: 'Brand Innovators', period: 'Jun 2019 - Present' },
          { role: 'Marketing Specialist', company: 'Creative Marketing', period: 'Jan 2017 - May 2019' }
        ],
        education: [
          { degree: 'MBA, Marketing', institution: 'Business School', year: '2016' },
          { degree: 'BA, Communications', institution: 'Liberal Arts College', year: '2014' }
        ]
      },
      {
        id: 3,
        filename: 'david_wong_resume.pdf',
        fileSize: '490 KB',
        fileType: 'application/pdf',
        uploadedAt: '2023-05-08T16:45:00Z',
        user: {
          id: 103,
          name: 'David Wong',
          email: 'david.wong@example.com',
          role: 'candidate'
        },
        parsed: false,
        parseStatus: 'failed',
        skills: [],
        experience: [],
        education: []
      },
      {
        id: 4,
        filename: 'sarah_miller_cv.pdf',
        fileSize: '405 KB',
        fileType: 'application/pdf',
        uploadedAt: '2023-05-07T09:20:00Z',
        user: {
          id: 104,
          name: 'Sarah Miller',
          email: 'sarah.miller@example.com',
          role: 'candidate'
        },
        parsed: true,
        parseStatus: 'success',
        skills: ['UX Design', 'UI Design', 'Adobe XD', 'Sketch', 'Figma'],
        experience: [
          { role: 'UX/UI Designer', company: 'Design Studio', period: 'Apr 2020 - Present' },
          { role: 'UI Designer', company: 'Web Agency', period: 'Sep 2017 - Mar 2020' }
        ],
        education: [
          { degree: 'BFA, Graphic Design', institution: 'Art Institute', year: '2017' }
        ]
      },
      {
        id: 5,
        filename: 'michael_brown_resume.docx',
        fileSize: '350 KB',
        fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        uploadedAt: '2023-05-06T14:10:00Z',
        user: {
          id: 105,
          name: 'Michael Brown',
          email: 'michael.brown@example.com',
          role: 'candidate'
        },
        parsed: true,
        parseStatus: 'partial',
        skills: ['Python', 'Data Analysis', 'SQL'],
        experience: [
          { role: 'Data Analyst', company: 'Analytics Corp', period: 'Jan 2019 - Present' }
        ],
        education: [
          { degree: 'MS, Data Science', institution: 'Tech University', year: '2018' }
        ]
      }
    ];

    const mockResponse = {
      cvs: mockCVs,
      total: 124, // Total count of CVs in the system
      page: 1,
      perPage: 10
    };

    // Use the mock data if no real data is loaded yet
    if (!data && !loading && !error) {
      setCvs(mockResponse.cvs);
      setPagination(prev => ({
        ...prev,
        total: mockResponse.total
      }));
    }
  }, [data, loading, error]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">CV Management</h1>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => fetchCVs()}
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
                  placeholder="Search by filename, user, or skills"
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
                  <option value="all">All CVs</option>
                  <option value="recent">Recently Uploaded</option>
                  <option value="matched">Matched</option>
                  <option value="unmatched">Unmatched</option>
                </select>
              </div>
              
              <div>
                <select
                  name="parseStatus"
                  value={filters.parseStatus}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Parse Statuses</option>
                  <option value="success">Successfully Parsed</option>
                  <option value="partial">Partially Parsed</option>
                  <option value="failed">Failed to Parse</option>
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
        </div>
      </div>

      {/* Results and actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {loading ? 'Loading CVs...' : `${pagination.total} CVs Found`}
          </h3>
          
          {selectedCVs.length > 0 && (
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">
                {selectedCVs.length} selected
              </span>
              <button
                onClick={() => handleBulkAction('delete')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </button>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="p-6">
            <Loader />
          </div>
        ) : error ? (
          <div className="p-6">
            <ErrorMessage message="Failed to load CVs. Please try again." onRetry={fetchCVs} />
          </div>
        ) : cvs.length === 0 ? (
          <div className="p-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No CVs Found</h3>
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
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="group inline-flex items-center"
                        onClick={() => handleSort('filename')}
                      >
                        Filename
                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          {getSortIcon('filename')}
                        </span>
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="group inline-flex items-center"
                        onClick={() => handleSort('user.name')}
                      >
                        User
                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          {getSortIcon('user.name')}
                        </span>
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="group inline-flex items-center"
                        onClick={() => handleSort('uploadedAt')}
                      >
                        Uploaded
                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          {getSortIcon('uploadedAt')}
                        </span>
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="group inline-flex items-center"
                        onClick={() => handleSort('parseStatus')}
                      >
                        Parse Status
                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          {getSortIcon('parseStatus')}
                        </span>
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skills
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cvs.map((cv) => (
                    <tr key={cv.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={selectedCVs.includes(cv.id)}
                          onChange={() => handleSelectCV(cv.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className={`flex-shrink-0 h-5 w-5 ${
                            cv.fileType.includes('pdf') ? 'text-red-500' : 'text-blue-500'
                          }`} />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{cv.filename}</div>
                            <div className="text-sm text-gray-500">{cv.fileSize}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{cv.user.name}</div>
                          <div className="ml-2 text-xs inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            {cv.user.role}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{cv.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(cv.uploadedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cv.parseStatus === 'success' && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            <CheckCircle className="h-4 w-4 mr-1" /> Successful
                          </span>
                        )}
                        {cv.parseStatus === 'partial' && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            <AlertCircle className="h-4 w-4 mr-1" /> Partial
                          </span>
                        )}
                        {cv.parseStatus === 'failed' && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            <XCircle className="h-4 w-4 mr-1" /> Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cv.skills && cv.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {cv.skills.slice(0, 3).map((skill, idx) => (
                              <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {skill}
                              </span>
                            ))}
                            {cv.skills.length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                +{cv.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No skills extracted</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewCV(cv)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDownload(cv)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Download className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(cv)}
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
                    {[...Array(Math.min(5, Math.ceil(pagination.total / pagination.perPage)))].map((_, idx) => {
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

      {/* View CV Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="CV Details"
        size="lg"
      >
        {selectedCV && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                <FileText className={`h-5 w-5 ${
                  selectedCV.fileType.includes('pdf') ? 'text-red-500' : 'text-blue-500'
                } mr-2`} />
                {selectedCV.filename}
              </h3>
              <div className="flex flex-wrap text-sm text-gray-500 gap-x-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {selectedCV.user.name}
                </div>
                <div>
                  {selectedCV.fileSize}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Uploaded {formatDate(selectedCV.uploadedAt)}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2">Skills</h4>
                {selectedCV.skills && selectedCV.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedCV.skills.map((skill, idx) => (
                      <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No skills extracted</p>
                )}
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2">Parse Status</h4>
                <div className="mb-4">
                  {selectedCV.parseStatus === 'success' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-4 w-4 mr-2" /> Successfully Parsed
                    </span>
                  )}
                  {selectedCV.parseStatus === 'partial' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <AlertCircle className="h-4 w-4 mr-2" /> Partially Parsed
                    </span>
                  )}
                  {selectedCV.parseStatus === 'failed' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      <XCircle className="h-4 w-4 mr-2" /> Failed to Parse
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-700 mb-2">Experience</h4>
              {selectedCV.experience && selectedCV.experience.length > 0 ? (
                <ul className="space-y-3">
                  {selectedCV.experience.map((exp, idx) => (
                    <li key={idx} className="bg-gray-50 p-3 rounded">
                      <div className="text-sm font-medium text-gray-900">{exp.role}</div>
                      <div className="text-sm text-gray-500">{exp.company} • {exp.period}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No experience data extracted</p>
              )}
            </div>
            
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-700 mb-2">Education</h4>
              {selectedCV.education && selectedCV.education.length > 0 ? (
                <ul className="space-y-3">
                  {selectedCV.education.map((edu, idx) => (
                    <li key={idx} className="bg-gray-50 p-3 rounded">
                      <div className="text-sm font-medium text-gray-900">{edu.degree}</div>
                      <div className="text-sm text-gray-500">{edu.institution}, {edu.year}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No education data extracted</p>
              )}
            </div>
            
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => {
                  handleDownload(selectedCV);
                  setShowViewModal(false);
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="mr-2 h-4 w-4" />
                Download CV
              </button>
              
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleDeleteClick(selectedCV);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete CV
              </button>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete CV"
        size="sm"
      >
        {selectedCV && (
          <div className="p-6">
            <div className="flex items-center justify-center text-red-500 mb-4">
              <Trash2 className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-center text-gray-900">Confirm Deletion</h3>
            <p className="mt-2 text-center text-gray-500">
              Are you sure you want to delete the CV "{selectedCV.filename}" uploaded by {selectedCV.user.name}? This action cannot be undone.
            </p>
            
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
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Bulk Action Modal */}
      <Modal
        isOpen={showBulkActionModal}
        onClose={() => setShowBulkActionModal(false)}
        title="Delete Multiple CVs"
        size="sm"
      >
        <div className="p-6">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <Trash2 className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-center text-gray-900">Confirm Bulk Deletion</h3>
          <p className="mt-2 text-center text-gray-500">
            Are you sure you want to delete {bulkActionCVs.length} selected CVs? This action cannot be undone.
          </p>
          
          <div className="mt-6 flex justify-center space-x-4">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setShowBulkActionModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={confirmBulkAction}
            >
              Delete {bulkActionCVs.length} CVs
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CVManagement;