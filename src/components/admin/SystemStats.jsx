// src/components/admin/SystemStats.jsx
import React, { useEffect, useState } from 'react';
import { BarChart } from 'lucide-react';
import api from '../../api';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SystemStats = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        const data = res.data;

        setChartData({
          labels: data.months,
          datasets: [
            {
              label: 'New Users',
              data: data.newUsers,
              backgroundColor: '#3b82f6'
            },
            {
              label: 'Jobs Posted',
              data: data.jobsPosted,
              backgroundColor: '#10b981'
            },
            {
              label: 'Matches Made',
              data: data.matchesMade,
              backgroundColor: '#f59e0b'
            }
          ]
        });
      } catch (err) {
        console.error(err);
        setError('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex items-center mb-4">
        <BarChart className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-700">Monthly System Statistics</h2>
      </div>

      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            },
            title: {
              display: false,
              text: 'System Metrics'
            }
          }
        }}
      />
    </div>
  );
};

export default SystemStats;