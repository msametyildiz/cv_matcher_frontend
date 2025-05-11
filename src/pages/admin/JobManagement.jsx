import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, RefreshCw, Briefcase, Eye, Edit, Trash2,
  ChevronDown, MapPin, ChevronsUpDown, ChevronUp
} from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useDebounce } from '../../hooks/useDebounce';
import { useNotification } from '../../contexts/NotificationContext';
import AdminPageLayout from '../../components/layouts/AdminPageLayout';
import DataTable from '../../components/common/DataTable';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import ConfirmModal from '../../components/common/ConfirmModal';
import JobDetailModal from '../../components/jobs/JobDetailModal';
import FilterBar from '../../components/jobs/FilterBar';
import { useTableControls } from '../../hooks/useTableControls';
import { mockJobsData } from '../../data/mockData';

const JobManagement = () => {
  // Table data state
  const [jobs, setJobs] = useState([]);
  
  // Modal states
  const [selectedJob, setSelectedJob] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Table controls with custom hook
  const {
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    filters,
    setFilters,
    showAdvancedFilters,
    setShowAdvancedFilters,
    sortConfig,
    handleSort,
    pagination,
    setPagination,
    resetFilters
  } = useTableControls({
    initialFilters: {
      status: 'all',
      type: 'all',
      experience: 'all',
      dateRange: 'all'
    },
    initialSort: {
      key: 'createdAt',
      direction: 'desc'
    }
  });
  
  // Notifications
  const { success, error: showError } = useNotification();
  
  // Fetch jobs from API
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
    dependencies: [debouncedSearchQuery, filters, pagination.page, sortConfig]
  });

  // Update jobs when data changes
  useEffect(() => {
    if (data) {
      setJobs(data.jobs || []);
      setPagination(prev => ({
        ...prev,
        total: data.total || 0
      }));
    } else if (!loading && !error) {
      // Use mock data for development
      setJobs(mockJobsData.jobs);
      setPagination(prev => ({
        ...prev,
        total: mockJobsData.total
      }));
    }
  }, [data, loading, error, setPagination]);

  // Action handlers
  const handleViewJob = (job) => {
    setSelectedJob(job);
    setShowViewModal(true);
  };

  const handleDeleteClick = (job) => {
    setSelectedJob(job);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      // In a real app, call API: await api.delete(`/api/admin/jobs/${selectedJob.id}`);
      setJobs(prevJobs => prevJobs.filter(job => job.id !== selectedJob.id));
      success('Job deleted successfully');
      setShowDeleteModal(false);
    } catch (err) {
      showError('Failed to delete job');
    }
  };

  // Helper functions
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Table column definitions
  const columns = [
    {
      id: 'title',
      header: 'Job Title',
      sortable: true,
      cell: (job) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{job.title}</div>
          <div className="text-sm text-gray-500">{job.type}</div>
        </div>
      )
    },
    {
      id: 'company',
      header: 'Company',
      sortable: true,
      cell: (job) => (
        <div>
          <div className="text-sm text-gray-900">{job.company}</div>
          <div className="text-sm text-gray-500">{job.postedBy?.name}</div>
        </div>
      )
    },
    {
      id: 'location',
      header: 'Location',
      cell: (job) => (
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
          <span>{job.location}</span>
          {job.isRemote && (
            <span className="ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Remote
            </span>
          )}
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      cell: (job) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(job.status)}`}>
          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </span>
      )
    },
    {
      id: 'applicantsCount',
      header: 'Applications',
      sortable: true,
      cell: (job) => job.applicantsCount
    },
    {
      id: 'createdAt',
      header: 'Posted',
      sortable: true,
      cell: (job) => {
        const getTimeAgo = (dateString) => {
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
          <div>
            <div className="text-sm text-gray-500">{getTimeAgo(job.createdAt)}</div>
            {job.applicationDeadline && (
              <div className="text-xs text-gray-500 mt-1">
                Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
              </div>
            )}
          </div>
        );
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (job) => (
        <div className="flex items-center space-x-3 justify-end">
          <button onClick={() => handleViewJob(job)} className="text-blue-600 hover:text-blue-900">
            <Eye className="h-5 w-5" />
          </button>
          <Link to={`/admin/jobs/${job.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
            <Edit className="h-5 w-5" />
          </Link>
          <button onClick={() => handleDeleteClick(job)} className="text-red-600 hover:text-red-900">
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminPageLayout
      title="Job Management"
      actionButton={
        <Link
          to="/admin/jobs/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Briefcase className="mr-2 h-4 w-4" />
          Add Job
        </Link>
      }
      secondaryButton={
        <button
          onClick={fetchJobs}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </button>
      }
    >
      {/* Search and Filters */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={(e) => {
          const { name, value } = e.target;
          setFilters(prev => ({ ...prev, [name]: value }));
          setPagination(prev => ({ ...prev, page: 1 }));
        }}
        showAdvancedFilters={showAdvancedFilters}
        onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
        onReset={resetFilters}
      />

      {/* Jobs Table */}
      <DataTable
        columns={columns}
        data={jobs}
        loading={loading}
        error={error}
        onRetry={fetchJobs}
        sortConfig={sortConfig}
        onSort={handleSort}
        pagination={pagination}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        emptyState={{
          icon: <Briefcase className="h-12 w-12 text-gray-400" />,
          title: "No Jobs Found",
          description: "Try adjusting your search or filter criteria."
        }}
      />

      {/* View Job Modal */}
      <JobDetailModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        job={selectedJob}
      />

      {/* Delete Job Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Job"
        message={selectedJob && 
          `You're about to delete "${selectedJob.title}" at "${selectedJob.company}". This action cannot be undone.
          ${selectedJob?.applicantsCount > 0 ? `Warning: This job has ${selectedJob.applicantsCount} applications that will also be deleted.` : ''}`
        }
        confirmText="Delete Job"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onClose={() => setShowDeleteModal(false)}
      />
    </AdminPageLayout>
  );
};

export default JobManagement;