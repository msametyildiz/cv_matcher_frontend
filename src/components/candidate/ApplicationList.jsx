// src/components/candidate/ApplicationList.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/job';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications');
        setApplications(res.data);
      } catch (err) {
        setError('Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">My Applications</h2>
      {applications.length === 0 ? (
        <p className="text-gray-500">You haven't applied to any jobs yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {applications.map(app => (
            <li key={app.id} className="py-4">
              <h3 className="text-lg font-medium text-gray-900">{app.jobTitle}</h3>
              <p className="text-sm text-gray-500">Company: {app.companyName}</p>
              <p className="text-sm text-gray-500">Status: <span className="font-medium text-blue-600">{app.status}</span></p>
              <p className="text-sm text-gray-500">Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApplicationList;
