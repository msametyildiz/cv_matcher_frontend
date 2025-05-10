// src/components/employer/CandidateList.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/matching';
import CandidateCard from './CandidateCard';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await api.get('/employer/candidates');
        setCandidates(res.data);
      } catch (err) {
        setError('Failed to load candidates');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Matched Candidates</h2>
      {candidates.length === 0 ? (
        <p className="text-gray-500">No candidates matched your jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateList;
