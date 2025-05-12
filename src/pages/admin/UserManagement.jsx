import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, RefreshCw, Trash2, Edit, User, UserPlus, 
  ChevronsUpDown, ChevronUp, ChevronDown, ShieldCheck, 
  CheckCircle, AlertCircle, Clock, Check, X
} from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useDebounce } from '../../hooks/useDebounce';
import { useNotification } from '../../contexts/NotificationContext';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';

const UserManagement = () => {
  // State
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'candidate',
    password: '',
    status: 'active'
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Filters and sorting
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    dateRange: 'all'
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0
  });

  // Notifications
  const { success, error: showError } = useNotification();
  
  // Fetch users API hook
  const { 
    data, 
    loading, 
    error, 
    execute: fetchUsers 
  } = useApi({
    url: '/api/admin/users',
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
      debouncedSearchQuery, filters.role, filters.status, filters.dateRange,
      pagination.page, sortConfig.key, sortConfig.direction
    ]
  });

  // Update users when data changes
  useEffect(() => {
    if (data) {
      setUsers(data.users || []);
      setPagination(prev => ({ ...prev, total: data.total || 0 }));
    }
  }, [data]);

  // Mock data for development
  useEffect(() => {
    if (!data && !loading && !error) {
      const mockUsers = [
        {
          id: 1,
          name: 'John Smith',
          email: 'john.smith@example.com',
          role: 'candidate',
          status: 'active',
          createdAt: '2023-04-15T10:30:00Z',
          lastLogin: '2023-05-10T08:45:00Z',
          emailVerified: true,
          cvCount: 2,
          applicationCount: 5,
          avatar: null
        },
        {
          id: 2,
          name: 'Emily Johnson',
          email: 'emily.johnson@example.com',
          role: 'employer',
          status: 'active',
          createdAt: '2023-04-10T14:20:00Z',
          lastLogin: '2023-05-09T16:30:00Z',
          emailVerified: true,
          companyName: 'Tech Solutions Inc.',
          jobsPosted: 3,
          avatar: null
        },
        {
          id: 3,
          name: 'Admin User',
          email: 'admin@cvmatcher.com',
          role: 'admin',
          status: 'active',
          createdAt: '2023-01-01T00:00:00Z',
          lastLogin: '2023-05-10T07:30:00Z',
          emailVerified: true,
          avatar: null
        }
      ];

      setUsers(mockUsers);
      setPagination(prev => ({ ...prev, total: 125 }));
    }
  }, [data, loading, error]);

  // Helper functions
  const formatDate = (dateString) => new Date(dateString).toLocaleString();
  
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) return `${Math.floor(diffMs / (1000 * 60))} minutes ago`;
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    }
    return formatDate(dateString);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ChevronsUpDown className="h-4 w-4" />;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  const renderUserAvatar = (user) => {
    if (user.avatar) {
      return <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />;
    }
    return (
      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
        {user.name.charAt(0).toUpperCase()}
      </div>
    );
  };

  const renderUserStatus = (user) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle className="mr-1 h-3 w-3" /> },
      inactive: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock className="mr-1 h-3 w-3" /> },
      suspended: { bg: 'bg-red-100', text: 'text-red-800', icon: <AlertCircle className="mr-1 h-3 w-3" /> }
    };
    const config = statusConfig[user.status];
    
    return (
      <>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
          {config.icon}
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </span>
        <div className="text-xs text-gray-500 mt-1 flex items-center">
          {user.emailVerified ? (
            <>
              <Check className="h-3 w-3 text-green-500 mr-1" />
              Verified
            </>
          ) : (
            <>
              <X className="h-3 w-3 text-red-500 mr-1" />
              Unverified
            </>
          )}
        </div>
      </>
    );
  };

  const renderRoleBadge = (user) => {
    const roleConfig = {
      admin: { bg: 'bg-purple-100', text: 'text-purple-800', icon: <ShieldCheck className="mr-1 h-3 w-3" /> },
      employer: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <Briefcase className="mr-1 h-3 w-3" /> },
      candidate: { bg: 'bg-green-100', text: 'text-green-800', icon: <User className="mr-1 h-3 w-3" /> }
    };
    const config = roleConfig[user.role];
    
    return (
      <>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
          {config.icon}
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
        {user.role === 'employer' && user.companyName && (
          <div className="text-xs text-gray-500 mt-1">{user.companyName}</div>
        )}
      </>
    );
  };

  // Event handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key ? (prev.direction === 'asc' ? 'desc' : 'asc') : 'asc'
    }));
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      password: ''
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setUserForm({
      name: '',
      email: '',
      role: 'candidate',
      password: '',
      status: 'active'
    });
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!userForm.name.trim()) errors.name = 'Name is required';
    
    if (!userForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userForm.email)) {
      errors.email = 'Email is invalid';
    }
    
    if ((!selectedUser || userForm.password) && userForm.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      if (selectedUser) {
        // Update existing user
        setUsers(prevUsers => 
          prevUsers.map(user => user.id === selectedUser.id ? { ...user, ...userForm } : user)
        );
        success('User updated successfully');
        setShowEditModal(false);
      } else {
        // Add new user with mock ID
        const newUser = {
          id: Math.max(...users.map(u => u.id)) + 1,
          ...userForm,
          createdAt: new Date().toISOString(),
          lastLogin: null,
          emailVerified: false,
          avatar: null
        };
        setUsers(prevUsers => [newUser, ...prevUsers]);
        success('User added successfully');
        setShowAddModal(false);
      }
    } catch (err) {
      showError(selectedUser ? 'Failed to update user' : 'Failed to add user');
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors);
      }
    }
  };

  const confirmDelete = async () => {
    try {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser.id));
      success('User deleted successfully');
      setShowDeleteModal(false);
    } catch (err) {
      showError('Failed to delete user');
    }
  };

  // UI Components
  const renderUserDetails = () => {
    if (!selectedUser) return null;
    
    return (
      <div className="mb-4 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {renderUserAvatar(selectedUser)}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{selectedUser.name}</h3>
            <p className="text-sm text-gray-500">{selectedUser.email}</p>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
          <div><span className="font-medium">Role:</span> {selectedUser.role}</div>
          <div><span className="font-medium">Status:</span> {selectedUser.status}</div>
          <div><span className="font-medium">Created:</span> {formatDate(selectedUser.createdAt)}</div>
          {selectedUser.lastLogin && (
            <div><span className="font-medium">Last Login:</span> {getRelativeTime(selectedUser.lastLogin)}</div>
          )}
        </div>
      </div>
    );
  };

  const renderUserForm = () => (
    <form onSubmit={handleSubmitUser}>
      <div className="space-y-4">
        {/* Name field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={userForm.name}
            onChange={handleFormChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              formErrors.name ? 'border-red-300' : ''
            }`}
          />
          {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
        </div>
        
        {/* Email field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userForm.email}
            onChange={handleFormChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              formErrors.email ? 'border-red-300' : ''
            }`}
          />
          {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
        </div>
        
        {/* Role selector */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <select
            id="role"
            name="role"
            value={userForm.role}
            onChange={handleFormChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="candidate">Candidate</option>
            <option value="employer">Employer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        {/* Status selector */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            name="status"
            value={userForm.status}
            onChange={handleFormChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        
        {/* Password field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            {selectedUser ? 'Password (leave blank to keep current)' : 'Password'}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={userForm.password}
            onChange={handleFormChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              formErrors.password ? 'border-red-300' : ''
            }`}
          />
          {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
        </div>
      </div>
      
      {/* Form buttons */}
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => selectedUser ? setShowEditModal(false) : setShowAddModal(false)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {selectedUser ? 'Save Changes' : 'Add User'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAddUser}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </button>
          
          <button
            onClick={() => fetchUsers()}
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
                  placeholder="Search users by name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-2/3">
              {/* Role filter */}
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Roles</option>
                <option value="candidate">Candidates</option>
                <option value="employer">Employers</option>
                <option value="admin">Admins</option>
              </select>
              
              {/* Status filter */}
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
              
              {/* Date filter */}
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

      {/* User List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {loading ? 'Loading Users...' : `${pagination.total} Users Found`}
          </h3>
        </div>
        
        {/* Content section */}
        {loading ? (
          <div className="p-6"><Loader /></div>
        ) : error ? (
          <div className="p-6">
            <ErrorMessage message="Failed to load users. Please try again." onRetry={fetchUsers} />
          </div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Users Found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <>
            {/* User table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {/* Column headers with sorting */}
                    {[
                      { key: 'name', label: 'User' },
                      { key: 'role', label: 'Role' },
                      { key: 'status', label: 'Status' },
                      { key: 'createdAt', label: 'Created' },
                      { key: 'lastLogin', label: 'Last Login' }
                    ].map(column => (
                      <th 
                        key={column.key} 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <button
                          className="group inline-flex items-center"
                          onClick={() => handleSort(column.key)}
                        >
                          {column.label}
                          <span className="ml-2 flex-none text-gray-400 group-hover:visible group-focus:visible">
                            {getSortIcon(column.key)}
                          </span>
                        </button>
                      </th>
                    ))}
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      {/* User info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {renderUserAvatar(user)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Role */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderRoleBadge(user)}
                      </td>
                      
                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderUserStatus(user)}
                      </td>
                      
                      {/* Created date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      
                      {/* Last login */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin ? getRelativeTime(user.lastLogin) : 'Never'}
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="text-red-600 hover:text-red-900"
                            disabled={user.role === 'admin'} // Prevent deleting admin users
                          >
                            <Trash2 className={`h-5 w-5 ${user.role === 'admin' ? 'opacity-30 cursor-not-allowed' : ''}`} />
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
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(pagination.page - 1) * pagination.perPage + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(pagination.page * pagination.perPage, pagination.total)}</span> of{' '}
                    <span className="font-medium">{pagination.total}</span> users
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    {/* Previous button */}
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronDown className="h-5 w-5 rotate-90" />
                    </button>
                    
                    {/* Page numbers */}
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
                    
                    {/* Next button */}
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

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit User"
        size="md"
      >
        <div className="p-6">
          {renderUserDetails()}
          {renderUserForm()}
        </div>
      </Modal>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New User"
        size="md"
      >
        <div className="p-6">
          {renderUserForm()}
        </div>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete User"
        size="sm"
      >
        {selectedUser && (
          <div className="p-6">
            <div className="flex items-center justify-center text-red-500 mb-4">
              <Trash2 className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-center text-gray-900">Confirm Deletion</h3>
            <p className="mt-2 text-center text-gray-500">
              Are you sure you want to delete {selectedUser.name}? This action cannot be undone.
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
    </div>
  );
};

export default UserManagement;