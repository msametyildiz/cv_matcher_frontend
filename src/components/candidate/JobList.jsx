// src/components/candidate/JobCard.jsx
import React from 'react';
import { Briefcase, Building2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-500 flex items-center">
            <Building2 className="h-4 w-4 mr-1" /> {job.company}
          </p>
          <p className="text-sm text-gray-500 mt-1">Location: {job.location}</p>
        </div>
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
          {job.matchPercentage}% Match
        </span>
      </div>

      <p className="mt-3 text-sm text-gray-700 line-clamp-3">
        {job.description}
      </p>

      <div className="mt-4 flex justify-between">
        <Link
          to={`/candidate/jobs/${job.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          View Details
        </Link>
        <Link
          to={`/candidate/jobs/${job.id}/apply`}
          className="text-sm font-medium text-green-600 hover:text-green-500"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
