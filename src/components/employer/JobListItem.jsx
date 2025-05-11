// src/components/employer/JobListItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';

const JobListItem = ({ job, onDelete, onConfirmDelete }) => {
  return (
    <div className="border rounded-lg bg-white shadow-sm p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
        <p className="text-sm text-gray-500">{job.location} • {job.type}</p>
        <p className="text-sm text-gray-500 mt-1">Salary: {job.salaryRange || 'N/A'}</p>
      </div>
      <div className="flex gap-3">
        <Link
          to={`/employer/jobs/${job.id}/edit`}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm rounded-md text-gray-700 hover:bg-gray-100"
        >
          <Pencil className="h-4 w-4 mr-1" /> Edit
        </Link>
        <button
          onClick={() => onDelete(job.id)}
          className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm rounded-md text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </button>
      </div>
    </div>
  );
};

export default JobListItem;
