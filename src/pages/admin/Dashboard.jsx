import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  FileText, 
  Activity, 
  AlertCircle, 
  Check, 
  Clock, 
  Calendar,
  ChevronRight,
  Cpu,
  Database,
  Server
} from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useNotification } from '../../contexts/NotificationContext';

const AdminDashboard = () => {
  const { info } = useNotification();
  const [timeframe, setTimeframe] = useState('week');

  // Fetch dashboard data
  const { data: dashboardData, loading, error, execute: fetchDashboard } = useApi({
    url: '/api/admin/dashboard',
    method: 'GET',
    params: { timeframe },
    autoFetch: true,
    dependencies: [timeframe],
    // In a real app, we would use the actual API
  });

  // For demo purposes, we'll use mock data
  const mockDashboardData = {
    stats: {
      totalUsers: 5248,
      newUsers: 127,
      activeJobs: 432,
      newJobs: 48,
      cvUploaded: 756,
      totalMatches: 2324,
      matchRate: 78.6
    },
    recentActivity: [
      { id: 1, type: 'user_registered', user: 'John Smith', email: 'john@example.com', role: 'candidate', time: '10 minutes ago' },
      { id: 2, type: 'job_posted', company: 'Tech Solutions', title: 'Senior Developer', time: '30 minutes ago' },
      { id: 3, type: 'cv_uploaded', user: 'Laura Chen', role: 'candidate', time: '1 hour ago' },
      { id: 4, type: 'match_created', candidate: 'David Johnson', job: 'UX Designer at Creative Studios', score: 92, time: '2 hours ago' },
      { id: 5, type: 'user_registered', user: 'Emma Wilson', email: 'emma@example.com', role: 'employer', time: '3 hours ago' }
    ],
    systemStatus: {
      apiHealth: 'healthy',
      dbStatus: 'healthy',
      storageStatus: 'healthy',
      matchingServiceStatus: 'healthy',
      lastBackup: '2023-05-10 02:00 AM',
      cpuUsage: 24,
      memoryUsage: 42,
      storageUsage: 38,
      avgResponseTime: 120
    }
  };

  // If we have dashboard data from the API, use it, otherwise use mock data
  const displayData = dashboardData || mockDashboardData;

  useEffect(() => {
    // Simulate API fetch since we're using mock data
    setTimeout(() => {
      info('Dashboard data refreshed');
    }, 1000);
  }, [timeframe, info]);

  // Generate consistent color for activity icons
  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registered':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'job_posted':
        return <Briefcase className="h-5 w-5 text-green-500" />;
      case 'cv_uploaded':
        return <FileText className="h-5 w-5 text-purple-500" />;
      case 'match_created':
        return <Activity className="h-5 w-5 text-orange-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  // Generate appropriate system status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <Check className={`h-5 w-5 ${getStatusColor(status)}`} />;
      case 'warning':
        return <AlertCircle className={`h-5 w-5 ${getStatusColor(status)}`} />;
      case 'critical':
        return <AlertCircle className={`h-5 w-5 ${getStatusColor(status)}`} />;
      default:
        return <AlertCircle className={`h-5 w-5 ${getStatusColor(status)}`} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        
        <div className="flex items-center space-x-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          
          <button
            onClick={() => fetchDashboard()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Refresh
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
                    <Users className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{displayData.stats.totalUsers.toLocaleString()}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="font-medium text-green-600 mr-2">+{displayData.stats.newUsers}</span>
                  <span className="text-gray-500">new users this {timeframe}</span>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Briefcase className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Jobs</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{displayData.stats.activeJobs.toLocaleString()}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="font-medium text-green-600 mr-2">+{displayData.stats.newJobs}</span>
                  <span className="text-gray-500">new jobs this {timeframe}</span>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FileText className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">CVs Uploaded</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{displayData.stats.cvUploaded.toLocaleString()}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <a href="/admin/cvs" className="font-medium text-blue-600 hover:text-blue-500">
                    View all<span className="sr-only"> CVs</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Activity className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Match Rate</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{displayData.stats.matchRate}%</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <a href="/admin/analytics" className="font-medium text-blue-600 hover:text-blue-500">
                    View analytics<span className="sr-only"> for match rate</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <ul className="divide-y divide-gray-200">
                  {displayData.recentActivity.map((activity) => (
                    <li key={activity.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.type === 'user_registered' && `${activity.user} registered as ${activity.role}`}
                            {activity.type === 'job_posted' && `${activity.company} posted "${activity.title}"`}
                            {activity.type === 'cv_uploaded' && `${activity.user} uploaded a new CV`}
                            {activity.type === 'match_created' && `${activity.candidate} matched with ${activity.job} (${activity.score}%)`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.time}
                          </p>
                        </div>
                        <div>
                          <a
                            href="#"
                            className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                          >
                            View
                          </a>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <a href="/admin/activity" className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    View all activity
                  </a>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">System Status</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">API Status</dt>
                    <dd className="mt-1 flex items-center text-sm text-gray-900">
                      {getStatusIcon(displayData.systemStatus.apiHealth)}
                      <span className="ml-2">
                        {displayData.systemStatus.apiHealth.charAt(0).toUpperCase() + displayData.systemStatus.apiHealth.slice(1)}
                      </span>
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Database Status</dt>
                    <dd className="mt-1 flex items-center text-sm text-gray-900">
                      {getStatusIcon(displayData.systemStatus.dbStatus)}
                      <span className="ml-2">
                        {displayData.systemStatus.dbStatus.charAt(0).toUpperCase() + displayData.systemStatus.dbStatus.slice(1)}
                      </span>
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Storage Status</dt>
                    <dd className="mt-1 flex items-center text-sm text-gray-900">
                      {getStatusIcon(displayData.systemStatus.storageStatus)}
                      <span className="ml-2">
                        {displayData.systemStatus.storageStatus.charAt(0).toUpperCase() + displayData.systemStatus.storageStatus.slice(1)}
                      </span>
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Matching Service</dt>
                    <dd className="mt-1 flex items-center text-sm text-gray-900">
                      {getStatusIcon(displayData.systemStatus.matchingServiceStatus)}
                      <span className="ml-2">
                        {displayData.systemStatus.matchingServiceStatus.charAt(0).toUpperCase() + displayData.systemStatus.matchingServiceStatus.slice(1)}
                      </span>
                    </dd>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">System Resources</dt>
                    <dd className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center">
                          <Cpu className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">CPU Usage:</span>
                          <span className="ml-2 text-sm font-medium">{displayData.systemStatus.cpuUsage}%</span>
                        </div>
                        <div className="h-2 mt-1 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${displayData.systemStatus.cpuUsage > 80 ? 'bg-red-500' : displayData.systemStatus.cpuUsage > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${displayData.systemStatus.cpuUsage}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <Server className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">Memory Usage:</span>
                          <span className="ml-2 text-sm font-medium">{displayData.systemStatus.memoryUsage}%</span>
                        </div>
                        <div className="h-2 mt-1 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${displayData.systemStatus.memoryUsage > 80 ? 'bg-red-500' : displayData.systemStatus.memoryUsage > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${displayData.systemStatus.memoryUsage}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <Database className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">Storage Usage:</span>
                          <span className="ml-2 text-sm font-medium">{displayData.systemStatus.storageUsage}%</span>
                        </div>
                        <div className="h-2 mt-1 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${displayData.systemStatus.storageUsage > 80 ? 'bg-red-500' : displayData.systemStatus.storageUsage > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${displayData.systemStatus.storageUsage}%` }}
                          />
                        </div>
                      </div>
                    </dd>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Last Backup: {displayData.systemStatus.lastBackup}</span>
                      <span className="text-sm text-gray-500">Avg Response Time: {displayData.systemStatus.avgResponseTime}ms</span>
                    </div>
                  </div>
                </dl>
                
                <div className="mt-6">
                  <a href="/admin/system" className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    View detailed system status
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <a href="/admin/users/create" className="block p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-500 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Add New User</span>
                  </div>
                </a>
                <a href="/admin/jobs/create" className="block p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Create Job Posting</span>
                  </div>
                </a>
                <a href="/admin/settings" className="block p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-purple-500 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Schedule Maintenance</span>
                  </div>
                </a>
                <a href="/admin/analytics" className="block p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 text-orange-500 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Generate Reports</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;