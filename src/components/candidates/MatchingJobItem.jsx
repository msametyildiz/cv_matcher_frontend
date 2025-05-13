import React from 'react';

const MatchingJobItem = ({ job, matchPercentage, onViewJob }) => {
  if (!job) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow transition-shadow p-4 mb-3 cursor-pointer" onClick={() => onViewJob(job.id)}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-md font-medium text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{job.company}</p>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <svg className="h-4 w-4 text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {job.location}
            {job.isRemote && <span className="ml-1 text-blue-600">· Remote</span>}
          </div>
        </div>
        <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {matchPercentage}% Match
        </div>
      </div>
      
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div>
            <span className="inline-block px-2 py-0.5 bg-gray-100 rounded mr-1">{job.employmentType}</span>
            <span>{job.experience}</span>
          </div>
          <div>Posted {job.postedDateText}</div>
        </div>
      </div>
      
      {job.matchingSkills && job.matchingSkills.length > 0 && (
        <div className="mt-2">
          <div className="text-xs text-gray-500 mb-1">Matching Skills:</div>
          <div className="flex flex-wrap gap-1">
            {job.matchingSkills.map((skill, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchingJobItem;
