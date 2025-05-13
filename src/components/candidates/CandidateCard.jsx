import React from 'react';

const CandidateCard = ({ candidate, onView, matchPercentage }) => {
  if (!candidate) return null;

  return (
    <div 
      onClick={() => onView(candidate.id)}
      className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-bold">
            {candidate.firstName?.charAt(0)}{candidate.lastName?.charAt(0)}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">
              {candidate.firstName} {candidate.lastName}
            </h3>
            <p className="text-sm text-gray-600">{candidate.title}</p>
          </div>
          {matchPercentage && (
            <div className="ml-auto bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {matchPercentage}% Match
            </div>
          )}
        </div>
        
        <div className="mt-4">
          {candidate.location && (
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <svg className="h-4 w-4 text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {candidate.location}
            </div>
          )}
          
          {candidate.experience && (
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <svg className="h-4 w-4 text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
              {candidate.experience}
            </div>
          )}
        </div>
        
        {candidate.skills && candidate.skills.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {candidate.skills.slice(0, 3).map((skill, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                </span>
              ))}
              {candidate.skills.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  +{candidate.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Last active: {candidate.lastActive || 'N/A'}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(candidate.id);
            }}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
