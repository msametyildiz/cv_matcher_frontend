import React from 'react';

const ProfileHeader = ({ candidate }) => {
  if (!candidate) return null;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start">
          <div className="flex-shrink-0 h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-2xl font-bold">
            {candidate.firstName?.charAt(0)}{candidate.lastName?.charAt(0)}
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900">
              {candidate.firstName} {candidate.lastName}
            </h1>
            <p className="text-lg text-gray-600 mt-1">{candidate.title || 'Candidate'}</p>
            <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
              {candidate.skills?.slice(0, 4).map((skill, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                </span>
              ))}
              {candidate.skills?.length > 4 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  +{candidate.skills.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
