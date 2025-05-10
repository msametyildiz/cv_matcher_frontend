// src/components/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { BarChart2, Users, Briefcase, Cpu } from 'lucide-react';
import api from '../../api';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users className="h-6 w-6 text-blue-600" />} label="Total Users" value={stats.totalUsers} />
        <StatCard icon={<Briefcase className="h-6 w-6 text-green-600" />} label="Total Jobs" value={stats.totalJobs} />
        <StatCard icon={<Cpu className="h-6 w-6 text-purple-600" />} label="CV Parsed" value={stats.totalCVsParsed} />
        <StatCard icon={<BarChart2 className="h-6 w-6 text-orange-600" />} label="Matches Made" value={stats.totalMatches} />
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">System Overview</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>Registration Enabled: {stats.enableRegistration ? 'Yes' : 'No'}</li>
          <li>AI Matching Active: {stats.enableMatching ? 'Yes' : 'No'}</li>
          <li>Maintenance Mode: {stats.maintenanceMode ? 'On' : 'Off'}</li>
          <li>Contact Email: {stats.contactEmail}</li>
        </ul>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white shadow rounded-lg p-4 flex items-center space-x-4">
    <div className="p-2 bg-gray-100 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;