// src/components/employer/MatchingResults.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/matching';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import { Link } from 'react-router-dom';

const MatchingResults = ({ jobId }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get(`/employer/matching/${jobId}`);
        setMatches(res.data);
      } catch (err) {
        setError('Failed to load matching results');
      } finally {
        setLoading(false);
      }
    };
    if (jobId) fetchMatches();
  }, [jobId]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Matching Candidates</h2>
      {matches.length === 0 ? (
        <p className="text-gray-500">No matching candidates found for this job.</p>
      ) : (
        <ul className="space-y-4">
          {matches.map((candidate) => (
            <li key={candidate.id} className="bg-white p-4 rounded shadow-sm border">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{candidate.name}</h3>
                  <p className="text-sm text-gray-600">{candidate.email}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {candidate.matchPercentage}% Match
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Skills: {candidate.skills?.join(', ') || 'N/A'}
              </div>
              <div className="mt-3">
                <Link
                  to={`/employer/candidates/${candidate.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View Profile
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MatchingResults;
