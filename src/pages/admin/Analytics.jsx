import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  Download,
  Users,
  Briefcase,
  FileText,
  Activity,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useDebounce } from '../../hooks/useDebounce';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

// This would be a real import in a complete app
// import { LineChart, BarChart, PieChart, AreaChart } from 'path-to-chart-components';

// Mock chart components for demonstration
const LineChart = ({ data, title }) => (
  <div className="h-80 p-4 bg-white rounded-lg shadow">
    <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded border border-gray-200">
      <p className="text-gray-500">Line Chart Visualization</p>
      {/* In a real app, this would be an actual chart component */}
    </div>
  </div>
);

const BarChart = ({ data, title }) => (
  <div className="h-80 p-4 bg-white rounded-lg shadow">
    <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded border border-gray-200">
      <p className="text-gray-500">Bar Chart Visualization</p>
      {/* In a real app, this would be an actual chart component */}
    </div>
  </div>
);

const PieChart = ({ data, title }) => (
  <div className="h-80 p-4 bg-white rounded-lg shadow">
    <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded border border-gray-200">
      <p className="text-gray-500">Pie Chart Visualization</p>
      {/* In a real app, this would be an actual chart component */}
    </div>
  </div>
);

const AreaChart = ({ data, title }) => (
  <div className="h-80 p-4 bg-white rounded-lg shadow">
    <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded border border-gray-200">
      <p className="text-gray-500">Area Chart Visualization</p>
      {/* In a real app, this would be an actual chart component */}
    </div>
  </div>
);

const AdminAnalytics = () => {
  // Filter states
  const [dateRange, setDateRange] = useState('month');
  const [filters, setFilters] = useState({
    userType: 'all',
    jobCategory: 'all',
    location: '',
  });
  
  // Advanced filter state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    matchThreshold: 70,
    cvCount: 0,
    activeOnly: true,
  });
  
  // Search state with debounce
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  // Fetch analytics data
  const {
    data: analyticsData,
    loading,
    error,
    execute: fetchAnalytics
  } = useApi({
    url: '/api/admin/analytics',
    method: 'GET',
    params: { 
      dateRange,
      ...filters,
      ...advancedFilters,
      query: debouncedSearchQuery
    },
    autoFetch: true,
    dependencies: [dateRange, debouncedSearchQuery]
  });

  // Update query when filters change
  useEffect(() => {
    fetchAnalytics();
  }, [filters, advancedFilters, fetchAnalytics]);

  // Mock data for demonstration
  const mockAnalyticsData = {
    summary: {
      totalUsers: 5248,
      newUsers: {
        count: 127,
        trend: '+12%'
      },
      activeJobs: 432,
      newJobs: {
        count: 48,
        trend: '+8%'
      },
      totalMatches: 2324,
      matchRate: {
        value: 78.6,
        trend: '+3.2%'
      },
      avgMatchScore: 82.4,
      userRetention: '68%'
    },
    charts: {
      userGrowth: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Candidates',
            data: [150, 230, 380, 450, 580, 670]
          },
          {
            label: 'Employers',
            data: [50, 75, 90, 120, 150, 180]
          }
        ]
      },
      jobsByCategory: {
        labels: ['IT', 'Engineering', 'Marketing', 'Design', 'Management', 'Other'],
        data: [35, 25, 15, 10, 10, 5]
      },
      matchingSuccess: {
        labels: ['< 50%', '50-70%', '70-80%', '80-90%', '90-100%'],
        data: [5, 15, 30, 35, 15]
      },
      userActivity: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Active Users',
            data: [1200, 1300, 1100, 1400]
          },
          {
            label: 'CV Uploads',
            data: [350, 450, 320, 480]
          },
          {
            label: 'Job Postings',
            data: [120, 140, 95, 160]
          }
        ]
      }
    },
    topPerformers: {
      industries: [
        { name: 'Information Technology', matchRate: 92, growth: '+15%' },
        { name: 'Healthcare', matchRate: 87, growth: '+10%' },
        { name: 'Financial Services', matchRate: 83, growth: '+7%' }
      ],
      locations: [
        { name: 'New York', matchRate: 90, jobCount: 245 },
        { name: 'San Francisco', matchRate: 88, jobCount: 187 },
        { name: 'London', matchRate: 85, jobCount: 164 }
      ],
      jobTypes: [
        { name: 'Full-time', percentage: 68 },
        { name: 'Contract', percentage: 18 },
        { name: 'Part-time', percentage: 9 },
        { name: 'Internship', percentage: 5 }
      ]
    }
  };

  // Use mock data if no real data is available
  const displayData = analyticsData || mockAnalyticsData;

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle advanced filter changes
  const handleAdvancedFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAdvancedFilters({
      ...advancedFilters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Export report function
  const exportReport = (format) => {
    // In a real app, this would call an API endpoint to generate a report
    console.log(`Exporting report in ${format} format`);
    alert(`Report would be exported in ${format} format`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
              <option value="year">Last 12 Months</option>
              <option value="all">All Time</option>
            </select>
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="relative inline-block text-left">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
              onClick={() => exportReport('csv')}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700">User Type</label>
              <select
                id="userType"
                name="userType"
                value={filters.userType}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Users</option>
                <option value="candidate">Candidates</option>
                <option value="employer">Employers</option>
                <option value="admin">Admins</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="jobCategory" className="block text-sm font-medium text-gray-700">Job Category</label>
              <select
                id="jobCategory"
                name="jobCategory"
                value={filters.jobCategory}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Categories</option>
                <option value="it">Information Technology</option>
                <option value="engineering">Engineering</option>
                <option value="marketing">Marketing</option>
                <option value="design">Design</option>
                <option value="management">Management</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Enter location"
                className="mt-1 block w-full border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              />
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
              onClick={() => {
                setFilters({ userType: 'all', jobCategory: 'all', location: '' });
                setAdvancedFilters({ matchThreshold: 70, cvCount: 0, activeOnly: true });
                setSearchQuery('');
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Filters
            </button>
          </div>
          
          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="matchThreshold" className="block text-sm font-medium text-gray-700">
                  Minimum Match Score
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="range"
                    id="matchThreshold"
                    name="matchThreshold"
                    min="0"
                    max="100"
                    value={advancedFilters.matchThreshold}
                    onChange={handleAdvancedFilterChange}
                    className="flex-grow mr-2"
                  />
                  <span className="text-sm text-gray-500 w-10 text-right">{advancedFilters.matchThreshold}%</span>
                </div>
              </div>
              
              <div>
                <label htmlFor="cvCount" className="block text-sm font-medium text-gray-700">
                  Minimum CV Count
                </label>
                <input
                  type="number"
                  id="cvCount"
                  name="cvCount"
                  min="0"
                  value={advancedFilters.cvCount}
                  onChange={handleAdvancedFilterChange}
                  className="mt-1 block w-full border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                />
              </div>
              
              <div className="flex items-end">
                <div className="flex items-center h-10">
                  <input
                    id="activeOnly"
                    name="activeOnly"
                    type="checkbox"
                    checked={advancedFilters.activeOnly}
                    onChange={handleAdvancedFilterChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="activeOnly" className="ml-2 block text-sm text-gray-700">
                    Active users/jobs only
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message="Failed to load analytics data. Please try again." onRetry={fetchAnalytics} />
      ) : (
        <div className="space-y-6">
          {/* KPI Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-blue-500" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">New Users</dt>
                      <dd className="flex items-center">
                        <div className="text-lg font-medium text-gray-900">{displayData.summary.newUsers.count}</div>
                        <span className={`ml-2 text-sm font-medium ${displayData.summary.newUsers.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {displayData.summary.newUsers.trend}
                        </span>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Briefcase className="h-6 w-6 text-green-500" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">New Jobs</dt>
                      <dd className="flex items-center">
                        <div className="text-lg font-medium text-gray-900">{displayData.summary.newJobs.count}</div>
                        <span className={`ml-2 text-sm font-medium ${displayData.summary.newJobs.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {displayData.summary.newJobs.trend}
                        </span>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Activity className="h-6 w-6 text-purple-500" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Match Rate</dt>
                      <dd className="flex items-center">
                        <div className="text-lg font-medium text-gray-900">{displayData.summary.matchRate.value}%</div>
                        <span className={`ml-2 text-sm font-medium ${displayData.summary.matchRate.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {displayData.summary.matchRate.trend}
                        </span>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FileText className="h-6 w-6 text-orange-500" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">User Retention</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{displayData.summary.userRetention}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <LineChart data={displayData.charts.userGrowth} title="User Growth Over Time" />
            <BarChart data={displayData.charts.userActivity} title="User Activity" />
            <PieChart data={displayData.charts.jobsByCategory} title="Jobs by Category" />
            <AreaChart data={displayData.charts.matchingSuccess} title="Matching Success Distribution" />
          </div>

          {/* Top Performers */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Top Performers</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Top Industries */}
                <div>
                  <h4 className="text-base font-medium text-gray-700 mb-3">Industries by Match Rate</h4>
                  <ul className="space-y-4">
                    {displayData.topPerformers.industries.map((industry, idx) => (
                      <li key={idx} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{industry.name}</span>
                          <span className="text-sm text-gray-500">{industry.matchRate}%</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${industry.matchRate}%` }}
                            ></div>
                          </div>
                          <span className="ml-3 text-xs font-medium text-green-600">{industry.growth}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Top Locations */}
                <div>
                  <h4 className="text-base font-medium text-gray-700 mb-3">Top Locations</h4>
                  <ul className="space-y-4">
                    {displayData.topPerformers.locations.map((location, idx) => (
                      <li key={idx} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{location.name}</span>
                          <span className="text-sm text-gray-500">{location.matchRate}%</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <div className="flex-grow">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${location.matchRate}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="ml-3 text-xs font-medium text-gray-500">{location.jobCount} jobs</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Job Types */}
                <div>
                  <h4 className="text-base font-medium text-gray-700 mb-3">Distribution by Job Type</h4>
                  <ul className="space-y-4">
                    {displayData.topPerformers.jobTypes.map((jobType, idx) => (
                      <li key={idx} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{jobType.name}</span>
                          <span className="text-sm text-gray-500">{jobType.percentage}%</span>
                        </div>
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${jobType.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;