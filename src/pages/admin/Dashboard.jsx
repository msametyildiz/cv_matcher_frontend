import React, { useState, useEffect } from 'react';
import { 
  Users, Briefcase, FileText, Activity, Calendar, Download,
  RefreshCw, Cpu, Database, Shield, ChevronRight
} from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminDashboard = () => {
  const [timeframe, setTimeframe] = useState('week');
  
  // Fetch dashboard data
  const { 
    data, 
    loading, 
    error, 
    execute: fetchDashboard 
  } = useApi({
    url: '/api/admin/dashboard',
    method: 'GET',
    params: { timeframe },
    autoFetch: true,
    dependencies: [timeframe]
  });

  // Mock data for demonstration
  const mockData = {
    stats: {
      totalUsers: 5248,
      newUsers: { count: 127, trend: '+12%' },
      activeJobs: 432,
      newJobs: { count: 48, trend: '+8%' },
      cvUploaded: 756,
      matchRate: { value: 78.6, trend: '+3.2%' },
      userRetention: '68%'
    },
    charts: {
      userGrowth: [150, 230, 380, 450, 580, 670],
      jobsByCategory: { labels: ['IT', 'Engineering', 'Marketing', 'Design', 'Management', 'Other'], data: [35, 25, 15, 10, 10, 5] },
      matchSuccess: [5, 15, 30, 35, 15]
    },
    recentActivity: [
      { id: 1, type: 'user_registered', user: 'John Smith', role: 'candidate', time: '10 minutes ago' },
      { id: 2, type: 'job_posted', company: 'Tech Solutions', title: 'Senior Developer', time: '30 minutes ago' },
      { id: 3, type: 'cv_uploaded', user: 'Laura Chen', role: 'candidate', time: '1 hour ago' },
      { id: 4, type: 'match_created', candidate: 'David Johnson', job: 'UX Designer', score: 92, time: '2 hours ago' }
    ],
    systemStatus: {
      apiHealth: 'healthy',
      dbStatus: 'healthy',
      storageStatus: 'healthy',
      cpuUsage: 24,
      memoryUsage: 42,
      storageUsage: 38
    },
    topPerformers: {
      industries: [
        { name: 'Information Technology', matchRate: 92, growth: '+15%' },
        { name: 'Healthcare', matchRate: 87, growth: '+10%' },
      ],
      locations: [
        { name: 'New York', matchRate: 90, jobCount: 245 },
        { name: 'San Francisco', matchRate: 88, jobCount: 187 },
      ]
    }
  };

  // Use mock data if no real data is available
  const displayData = data || mockData;

  // Simulate notification on refresh
  useEffect(() => {
    if (!loading && !error) {
      // Notification could be triggered here
    }
  }, [timeframe, loading, error]);

  // Helper to get status color
  const getStatusColor = (status) => {
    return status === 'healthy' ? 'text-green-500' : 'text-red-500';
  };

  // Function to render simplified chart as placeholder
  const renderSimpleChart = (type, data, height = 'h-40') => {
    if (type === 'pie') {
      return (
        <div className={`${height} bg-gray-50 rounded-lg flex items-center justify-center`}>
          <div className="flex gap-2">
            {typeof data === 'object' && data.labels ? 
              data.labels.map((label, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full bg-blue-${(idx + 3) * 100}`}></div>
                  <span className="text-xs mt-1">{label}</span>
                </div>
              )) : 
              <span className="text-gray-500">Pie Chart</span>
            }
          </div>
        </div>
      );
    }
    
    return (
      <div className={`${height} bg-gray-50 rounded-lg flex items-center justify-center relative overflow-hidden`}>
        {Array.isArray(data) && data.map((val, idx) => (
          <div 
            key={idx}
            className="absolute bottom-0 bg-blue-500 opacity-70 w-6"
            style={{
              height: `${val / 7}%`,
              left: `${(idx + 1) * 40}px`,
            }}
          ></div>
        ))}
        <span className="text-gray-500 z-10">{type.charAt(0).toUpperCase() + type.slice(1)} Chart</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          
          <button
            onClick={fetchDashboard}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
          
          <button
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message="Failed to load dashboard data. Please try again." onRetry={fetchDashboard} />
      ) : (
        <div className="space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-blue-500" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Users</dt>
                      <dd className="flex items-center">
                        <div className="text-lg font-medium text-gray-900">{displayData.stats.totalUsers.toLocaleString()}</div>
                        <span className={`ml-2 text-sm font-medium ${displayData.stats.newUsers.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {displayData.stats.newUsers.trend}
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
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Jobs</dt>
                      <dd className="flex items-center">
                        <div className="text-lg font-medium text-gray-900">{displayData.stats.activeJobs}</div>
                        <span className={`ml-2 text-sm font-medium ${displayData.stats.newJobs.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {displayData.stats.newJobs.trend}
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
                        <div className="text-lg font-medium text-gray-900">{displayData.stats.matchRate.value}%</div>
                        <span className={`ml-2 text-sm font-medium ${displayData.stats.matchRate.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {displayData.stats.matchRate.trend}
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
                      <dt className="text-sm font-medium text-gray-500 truncate">CV Uploads</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{displayData.stats.cvUploaded}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* User Growth Chart */}
              <div className="bg-white shadow rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
                {renderSimpleChart('line', displayData.charts.userGrowth, 'h-64')}
              </div>
              
              {/* Job Categories & Matching Success */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Jobs by Category</h3>
                  {renderSimpleChart('pie', displayData.charts.jobsByCategory, 'h-48')}
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Matching Success</h3>
                  {renderSimpleChart('bar', displayData.charts.matchSuccess, 'h-48')}
                </div>
              </div>
              
              {/* System Status */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">System Status</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">API</span>
                      </div>
                      <span className={getStatusColor(displayData.systemStatus.apiHealth)}>
                        ● {displayData.systemStatus.apiHealth}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Database className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">Database</span>
                      </div>
                      <span className={getStatusColor(displayData.systemStatus.dbStatus)}>
                        ● {displayData.systemStatus.dbStatus}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">CPU</span>
                        <span className="text-xs font-medium">{displayData.systemStatus.cpuUsage}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${displayData.systemStatus.cpuUsage > 80 ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${displayData.systemStatus.cpuUsage}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Memory</span>
                        <span className="text-xs font-medium">{displayData.systemStatus.memoryUsage}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${displayData.systemStatus.memoryUsage > 80 ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${displayData.systemStatus.memoryUsage}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Storage</span>
                        <span className="text-xs font-medium">{displayData.systemStatus.storageUsage}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${displayData.systemStatus.storageUsage > 80 ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${displayData.systemStatus.storageUsage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column - activity & actions */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
                </div>
                <div className="p-4">
                  <ul className="divide-y divide-gray-200">
                    {displayData.recentActivity.map((activity) => (
                      <li key={activity.id} className="py-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {activity.type === 'user_registered' && <Users className="h-5 w-5 text-blue-500" />}
                            {activity.type === 'job_posted' && <Briefcase className="h-5 w-5 text-green-500" />}
                            {activity.type === 'cv_uploaded' && <FileText className="h-5 w-5 text-purple-500" />}
                            {activity.type === 'match_created' && <Activity className="h-5 w-5 text-orange-500" />}
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.type === 'user_registered' && `${activity.user} registered as ${activity.role}`}
                              {activity.type === 'job_posted' && `${activity.company} posted "${activity.title}"`}
                              {activity.type === 'cv_uploaded' && `${activity.user} uploaded a new CV`}
                              {activity.type === 'match_created' && `${activity.candidate} matched with ${activity.job} (${activity.score}%)`}
                            </p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3">
                    <a href="/admin/activity" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      View all activity
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Top Performers */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Top Performers</h3>
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Top Industries</h4>
                  <ul className="space-y-2 mb-4">
                    {displayData.topPerformers.industries.map((industry, idx) => (
                      <li key={idx}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{industry.name}</span>
                          <span className="text-xs text-green-600">{industry.growth}</span>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ width: `${industry.matchRate}%` }}
                          ></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Top Locations</h4>
                  <ul className="space-y-2">
                    {displayData.topPerformers.locations.map((location, idx) => (
                      <li key={idx}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{location.name}</span>
                          <span className="text-xs text-gray-500">{location.jobCount} jobs</span>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-green-600 h-1.5 rounded-full" 
                            style={{ width: `${location.matchRate}%` }}
                          ></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <a href="/admin/users/create" className="block p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Add User</span>
                      </div>
                    </a>
                    <a href="/admin/jobs/create" className="block p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center">
                        <Briefcase className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Post Job</span>
                      </div>
                    </a>
                    <a href="/admin/analytics" className="block p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center">
                        <Activity className="h-5 w-5 text-purple-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Analytics</span>
                      </div>
                    </a>
                    <a href="/admin/settings" className="block p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center">
                        <ChevronRight className="h-5 w-5 text-orange-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Settings</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;