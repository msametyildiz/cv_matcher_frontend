import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, Search, Filter, ChevronDown, ArrowRight,
  Clock, CheckCircle, XCircle, CalendarClock, Building
} from 'lucide-react';
import api from '../../api';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date-desc');

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        // Simulate API call with mock data
        setTimeout(() => {
          setApplications([
            { 
              id: 1, 
              jobTitle: 'Frontend Developer', 
              company: 'Tech Solutions Inc.', 
              location: 'San Francisco, CA', 
              status: 'applied', 
              appliedDate: '2023-05-10',
              jobType: 'Full-time',
              response: null
            },
            { 
              id: 2, 
              jobTitle: 'UX Designer', 
              company: 'Creative Design Studio', 
              location: 'Remote', 
              status: 'interview', 
              appliedDate: '2023-05-05',
              jobType: 'Full-time',
              response: {
                type: 'interview',
                date: '2023-05-22'
              } 
            },
            { 
              id: 3, 
              jobTitle: 'Web Developer', 
              company: 'Digital Agency', 
              location: 'New York, NY', 
              status: 'rejected', 
              appliedDate: '2023-04-28',
              jobType: 'Contract',
              response: {
                type: 'rejected',
                date: '2023-05-15',
                message: 'Thank you for your interest, but we ve decided to pursue other candidates at this time.'
              }
            },
            // Additional mock applications omitted for brevity
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to load your applications. Please try again.');
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-800',
      interview: 'bg-purple-100 text-purple-800',
      offered: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      applied: <Clock className="h-5 w-5 text-blue-500" />,
      interview: <CalendarClock className="h-5 w-5 text-purple-500" />,
      offered: <CheckCircle className="h-5 w-5 text-green-500" />,
      rejected: <XCircle className="h-5 w-5 text-red-500" />
    };
    return icons[status] || <Clock className="h-5 w-5 text-gray-500" />;
  };

  // Filter and sort applications
  const filteredApplications = applications.filter(app => {
    if (filterStatus !== 'all' && app.status !== filterStatus) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        app.jobTitle.toLowerCase().includes(searchLower) ||
        app.company.toLowerCase().includes(searchLower) ||
        app.location.toLowerCase().includes(searchLower)
      );
    }
    return true;
  }).sort((a, b) => {
    const dateA = new Date(a.appliedDate);
    const dateB = new Date(b.appliedDate);
    
    switch (sortBy) {
      case 'date-asc': return dateA - dateB;
      case 'date-desc': return dateB - dateA;
      case 'company-asc': return a.company.localeCompare(b.company);
      case 'company-desc': return b.company.localeCompare(a.company);
      default: return dateB - dateA;
    }
  });

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="relative">
                <select
                  id="filter-status"
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="offered">Offered</option>
                  <option value="rejected">Rejected</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <div className="relative">
                <select
                  id="sort-by"
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date-desc">Date (Newest first)</option>
                  <option value="date-asc">Date (Oldest first)</option>
                  <option value="company-asc">Company (A-Z)</option>
                  <option value="company-desc">Company (Z-A)</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No applications found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all' 
              ? 'No applications match your current filters.' 
              : 'You have not applied to any jobs yet.'}
          </p>
          {(searchTerm || filterStatus !== 'all') ? (
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear filters
            </button>
          ) : (
            <Link
              to="/candidate/jobs"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse Jobs
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div key={application.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(application.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{application.jobTitle}</h3>
                      <div className="flex items-center mt-1">
                        <Building className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{application.company}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span>{application.location}</span>
                        <span className="mx-2">•</span>
                        <span>{application.jobType}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Applied on {formatDate(application.appliedDate)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}
                    >
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                {application.response && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    application.response.type === 'offered' ? 'bg-green-50 border border-green-200' :
                    application.response.type === 'rejected' ? 'bg-red-50 border border-red-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">
                          {application.response.type === 'offered' ? 'Offer Received' :
                           application.response.type === 'rejected' ? 'Application Declined' :
                           'Interview Scheduled'}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          {formatDate(application.response.date)}
                        </span>
                      </div>
                      {application.response.message && (
                        <p className="mt-1 text-sm">{application.response.message}</p>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex justify-end">
                  <Link
                    to={`/candidate/applications/${application.id}`}
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View Details
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application Stats */}
      {applications.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Application Statistics</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500">Total Applications</div>
              <div className="text-2xl font-semibold text-gray-900">{applications.length}</div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-blue-700">Pending</div>
              <div className="text-2xl font-semibold text-blue-800">
                {applications.filter(app => app.status === 'applied').length}
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-purple-700">Interviews</div>
              <div className="text-2xl font-semibold text-purple-800">
                {applications.filter(app => app.status === 'interview').length}
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-green-700">Offers</div>
              <div className="text-2xl font-semibold text-green-800">
                {applications.filter(app => app.status === 'offered').length}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex justify-between">
        <Link
          to="/candidate/jobs"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Browse More Jobs
        </Link>
        
        {applications.length > 0 && (
          <Link
            to="/candidate/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
};

export default Applications;