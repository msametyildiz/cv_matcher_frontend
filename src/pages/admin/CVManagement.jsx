import React, { useState, useEffect } from 'react';
import { Download, Filter, RefreshCw, FileText } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useDebounce } from '../../hooks/useDebounce';
import AdminPageLayout from '../../components/layouts/AdminPageLayout';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmModal from '../../components/common/ConfirmModal';
import CVDetailModal from '../../components/cv/CVDetailModal';
import FilterBar from '../../components/cv/FilterBar';
import useSelection from '../../hooks/useSelection';
import useTableControls from '../../hooks/useTableControls';
import { mockCVData } from '../../data/mockData';

const CVManagement = () => {
  // CV data and selection state
  const [cvs, setCvs] = useState([]);
  const [selectedCV, setSelectedCV] = useState(null);
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  
  // Selection handling with custom hook
  const {
    selectedItems: selectedCVs,
    selectAll,
    handleSelectAll,
    handleSelectItem: handleSelectCV,
    resetSelection
  } = useSelection(cvs);
  
  // Table controls via custom hook (search, filters, pagination, sorting)
  const {
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    filters,
    setFilters,
    pagination,
    setPagination,
    sortConfig,
    handleSort
  } = useTableControls({
    initialFilters: {
      status: 'all',
      parseStatus: 'all',
      dateRange: 'all',
    },
    initialSort: {
      key: 'uploadedAt',
      direction: 'desc'
    }
  });
  
  // API fetch
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
      filters,
      sortConfig.key, 
      sortConfig.direction
    ]
  });

  // Handlers
  const handleViewCV = (cv) => {
    setSelectedCV(cv);
    setShowViewModal(true);
  };

  const handleDeleteClick = (cv) => {
    setSelectedCV(cv);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    // Simulate API call
    setCvs(prevCVs => prevCVs.filter(cv => cv.id !== selectedCV.id));
    setShowDeleteModal(false);
  };

  const handleBulkAction = () => {
    setShowBulkActionModal(true);
  };

  const confirmBulkAction = async () => {
    // Simulate API call
    setCvs(prevCVs => prevCVs.filter(cv => !selectedCVs.includes(cv.id)));
    resetSelection();
    setShowBulkActionModal(false);
  };

  const handleDownload = (cv) => {
    // Download implementation
    console.log(`Downloading ${cv.filename}`);
  };

  // Update CVs when data changes
  useEffect(() => {
    if (data) {
      setCvs(data.cvs || []);
      setPagination(prev => ({
        ...prev,
        total: data.total || 0
      }));
    } else if (!loading && !error) {
      // Use mock data if no real data is available
      setCvs(mockCVData.cvs);
      setPagination(prev => ({
        ...prev,
        total: mockCVData.total
      }));
    }
  }, [data, loading, error, setPagination]);

  // Define table columns
  const columns = [
    {
      id: 'selection',
      header: () => (
        <input
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAll}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      ),
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedCVs.includes(row.id)}
          onChange={() => handleSelectCV(row.id)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      )
    },
    {
      id: 'filename',
      header: 'Filename',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center">
          <FileText className={`flex-shrink-0 h-5 w-5 ${
            row.fileType.includes('pdf') ? 'text-red-500' : 'text-blue-500'
          }`} />
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{row.filename}</div>
            <div className="text-sm text-gray-500">{row.fileSize}</div>
          </div>
        </div>
      )
    },
    {
      id: 'user',
      header: 'User',
      sortable: true,
      cell: (row) => (
        <div>
          <div className="flex items-center">
            <div className="text-sm font-medium text-gray-900">{row.user.name}</div>
            <div className="ml-2 text-xs inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {row.user.role}
            </div>
          </div>
          <div className="text-sm text-gray-500">{row.user.email}</div>
        </div>
      )
    },
    {
      id: 'uploadedAt',
      header: 'Uploaded',
      sortable: true,
      cell: (row) => new Date(row.uploadedAt).toLocaleString()
    },
    {
      id: 'parseStatus',
      header: 'Parse Status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.parseStatus} />
    },
    {
      id: 'skills',
      header: 'Skills',
      cell: (row) => (
        row.skills && row.skills.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {row.skills.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {skill}
              </span>
            ))}
            {row.skills.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                +{row.skills.length - 3} more
              </span>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-500">No skills extracted</span>
        )
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex justify-end space-x-2">
          <button onClick={() => handleViewCV(row)} className="text-blue-600 hover:text-blue-900">
            <Eye className="h-5 w-5" />
          </button>
          <button onClick={() => handleDownload(row)} className="text-gray-600 hover:text-gray-900">
            <Download className="h-5 w-5" />
          </button>
          <button onClick={() => handleDeleteClick(row)} className="text-red-600 hover:text-red-900">
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminPageLayout 
      title="CV Management"
      actionButton={
        selectedCVs.length > 0 && (
          <button
            onClick={handleBulkAction}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected ({selectedCVs.length})
          </button>
        )
      }
      secondaryButton={
        <button
          onClick={fetchCVs}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </button>
      }
    >
      {/* Filters */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={(e) => {
          const { name, value } = e.target;
          setFilters(prev => ({ ...prev, [name]: value }));
          setPagination(prev => ({ ...prev, page: 1 }));
        }}
      />

      {/* Table */}
      <DataTable
        columns={columns}
        data={cvs}
        loading={loading}
        error={error}
        onRetry={fetchCVs}
        sortConfig={sortConfig}
        onSort={handleSort}
        pagination={pagination}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        emptyState={{
          icon: <FileText className="h-12 w-12 text-gray-400" />,
          title: "No CVs Found",
          description: "Try adjusting your search or filter criteria."
        }}
      />

      {/* Modals */}
      <CVDetailModal
        isOpen={showViewModal}
        cv={selectedCV}
        onClose={() => setShowViewModal(false)}
        onDelete={handleDeleteClick}
        onDownload={handleDownload}
      />
      
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete CV"
        icon={<Trash2 className="h-12 w-12 text-red-500" />}
        message={selectedCV && `Are you sure you want to delete the CV "${selectedCV.filename}" uploaded by ${selectedCV.user.name}? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onClose={() => setShowDeleteModal(false)}
      />
      
      <ConfirmModal
        isOpen={showBulkActionModal}
        title="Delete Multiple CVs"
        icon={<Trash2 className="h-12 w-12 text-red-500" />}
        message={`Are you sure you want to delete ${selectedCVs.length} selected CVs? This action cannot be undone.`}
        confirmText={`Delete ${selectedCVs.length} CVs`}
        confirmVariant="danger"
        onConfirm={confirmBulkAction}
        onClose={() => setShowBulkActionModal(false)}
      />
    </AdminPageLayout>
  );
};

export default CVManagement;