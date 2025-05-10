// src/components/employer/CandidateCard.jsx
import React from 'react';
import { FileText, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const CandidateCard = ({ candidate }) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
          <p className="text-sm text-gray-500 flex items-center mt-1">
            <User className="h-4 w-4 mr-1" /> {candidate.email}
          </p>
          <p className="text-sm text-gray-500 mt-1">Location: {candidate.location || 'N/A'}</p>
          <p className="text-sm text-gray-500 mt-1">Matched Skills: {candidate.skills?.join(', ') || 'Not available'}</p>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
          {candidate.matchPercentage || 0}% Match
        </span>
      </div>

      <div className="mt-4 flex justify-between">
        <Link
          to={`/employer/candidates/${candidate.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          View Profile
        </Link>
        {candidate.cvUrl && (
          <a
            href={candidate.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 inline-flex items-center"
          >
            <FileText className="h-4 w-4 mr-1" /> Download CV
          </a>
        )}
      </div>
    </div>
  );
};

export default CandidateCard;
