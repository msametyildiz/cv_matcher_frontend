import React, { useState } from 'react';
import { Calendar, Download } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useDebounce } from '../../hooks/useDebounce';
import AdminPageLayout from '../../components/layouts/AdminPageLayout';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import StatsCard from '../../components/analytics/StatsCard';
import AnalyticsChart from '../../components/analytics/AnalyticsChart';
import PerformersSection from '../../components/analytics/PerformersSection';
import FilterBar from '../../components/analytics/FilterBar';
import { mockAnalyticsData } from '../../data/mockData';

const AdminAnalytics = () => {
  // Core filter states
  const [dateRange, setDateRange] = useState('month');
  const [filters, setFilters] = useState({
    userType: 'all',
    jobCategory: 'all',
    location: '',
  });
  
  // Advanced filters - could be moved to custom hook
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    matchThreshold: 70,
    cvCount: 0,
    activeOnly: true,
  });
  
  // Search with debounce
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  // API fetch
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
    dependencies: [dateRange, debouncedSearchQuery, filters, advancedFilters]
  });

  // Use mock data or real data
  const displayData = analyticsData || mockAnalyticsData;

  // Filter handlers
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAdvancedFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAdvancedFilters({
      ...advancedFilters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const resetFilters = () => {
    setFilters({ userType: 'all', jobCategory: 'all', location: '' });
    setAdvancedFilters({ matchThreshold: 70, cvCount: 0, activeOnly: true });
    setSearchQuery('');
  };

  // Export function
  const exportReport = (format) => alert(`Report would be exported in ${format} format`);

  return (
    <AdminPageLayout 
      title="Analytics Dashboard"
      actionButton={
        <div className="relative">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
            <option value="year">Last 12 Months</option>
            <option value="all">All Time</option>
          </select>
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      }
      secondaryButton={
        <button
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          onClick={() => exportReport('csv')}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </button>
      }
    >
      {/* Filters Section */}
      <FilterBar
        filters={filters}
        advancedFilters={advancedFilters}
        showAdvancedFilters={showAdvancedFilters}
        onFilterChange={handleFilterChange}
        onAdvancedFilterChange={handleAdvancedFilterChange}
        onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
        onReset={resetFilters}
      />

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message="Failed to load analytics data. Please try again." onRetry={fetchAnalytics} />
      ) : (
        <div className="space-y-6">
          {/* KPI Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard 
              title="New Users"
              value={displayData.summary.newUsers.count}
              trend={displayData.summary.newUsers.trend}
              icon="users"
              iconColor="blue"
            />
            <StatsCard 
              title="New Jobs"
              value={displayData.summary.newJobs.count}
              trend={displayData.summary.newJobs.trend}
              icon="briefcase"
              iconColor="green"
            />
            <StatsCard 
              title="Match Rate"
              value={`${displayData.summary.matchRate.value}%`}
              trend={displayData.summary.matchRate.trend}
              icon="activity"
              iconColor="purple"
            />
            <StatsCard 
              title="User Retention"
              value={displayData.summary.userRetention}
              icon="fileText"
              iconColor="orange"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <AnalyticsChart type="line" data={displayData.charts.userGrowth} title="User Growth Over Time" />
            <AnalyticsChart type="bar" data={displayData.charts.userActivity} title="User Activity" />
            <AnalyticsChart type="pie" data={displayData.charts.jobsByCategory} title="Jobs by Category" />
            <AnalyticsChart type="area" data={displayData.charts.matchingSuccess} title="Matching Success Distribution" />
          </div>

          {/* Top Performers */}
          <PerformersSection data={displayData.topPerformers} />
        </div>
      )}
    </AdminPageLayout>
  );
};

export default AdminAnalytics;