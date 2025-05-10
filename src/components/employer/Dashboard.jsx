// src/components/employer/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/job';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Clock } from 'lucide-react';

const EmployerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/employer/dashboard');
        setStats(res.data);
      } catch (err) {
        setError('Failed to load dashboard');
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
      <h1 className="text-2xl font-bold text-gray-800">Employer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Briefcase className="h-6 w-6 text-blue-600" />} label="Posted Jobs" value={stats.jobsPosted} />
        <StatCard icon={<Users className="h-6 w-6 text-green-600" />} label="Applicants" value={stats.totalApplicants} />
        <StatCard icon={<Clock className="h-6 w-6 text-yellow-600" />} label="Interviews Scheduled" value={stats.scheduledInterviews} />
      </div>

      <div className="bg-white p-6 rounded shadow mt-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/employer/jobs/create" className="text-blue-600 hover:underline text-sm">Create New Job</Link>
          <Link to="/employer/candidates" className="text-blue-600 hover:underline text-sm">View Candidates</Link>
          <Link to="/employer/interviews" className="text-blue-600 hover:underline text-sm">Manage Interviews</Link>
        </div>
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

export default EmployerDashboard;
