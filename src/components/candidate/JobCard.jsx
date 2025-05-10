import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, DollarSign, ArrowRight } from 'lucide-react';

const JobCard = ({ job }) => {
  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days ago
  const calculateDaysAgo = (dateString) => {
    const posted = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        {/* Header with match percentage */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">
            <Link to={`/candidate/jobs/${job.id}`}>{job.title}</Link>
          </h3>
          {job.matchPercentage && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              job.matchPercentage >= 90 ? 'bg-green-100 text-green-800' :
              job.matchPercentage >= 70 ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {job.matchPercentage}% Match
            </span>
          )}
        </div>
        
        {/* Company and job metadata */}
        <div className="mb-4">
          <p className="text-base font-medium text-gray-700">{job.company}</p>
          <div className="mt-2 flex flex-wrap gap-y-2">
            <div className="flex items-center text-sm text-gray-500 mr-4">
              <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span>{job.location}</span>
              {job.isRemote && <span className="ml-1.5 text-xs bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">Remote</span>}
            </div>
            <div className="flex items-center text-sm text-gray-500 mr-4">
              <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span>{job.type}</span>
            </div>
            {job.salary && (
              <div className="flex items-center text-sm text-gray-500">
                <DollarSign className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                <span>{job.salary}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Job description snippet */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {job.description}
        </p>
        
        {/* Footer with posted date and view details link */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="mr-1 h-3 w-3" />
            <span>Posted {calculateDaysAgo(job.postedDate)} | {formatDate(job.postedDate)}</span>
          </div>
          <Link 
            to={`/candidate/jobs/${job.id}`}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View Details
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;