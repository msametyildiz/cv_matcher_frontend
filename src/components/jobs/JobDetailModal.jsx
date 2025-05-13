import React from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';

const JobDetailModal = ({ isOpen, onClose, job }) => {
  if (!job) {
    return null;
  }

  const renderSection = (title, content) => (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700">{content}</div>
    </div>
  );

  const footer = (
    <>
      <button
        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={() => window.open(`/employer/jobs/${job.id}/edit`, '_blank')}
      >
        Edit Job
      </button>
      <button
        className="ml-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={onClose}
      >
        Close
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Job Details - ${job.title}`}
      footer={footer}
      size="lg"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
            <p className="text-gray-600">{job.company}</p>
            <p className="text-gray-600">{job.location}</p>
          </div>
          <StatusBadge status={job.status} size="lg" />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {renderSection("Job Description", job.description || "No description provided")}
            
            {job.requirements && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Requirements</h3>
                <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {job.skills && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Job Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Employment Type:</span>
                  <span className="font-medium">{job.employmentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Salary:</span>
                  <span className="font-medium">{job.salary || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Experience Level:</span>
                  <span className="font-medium">{job.experienceLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Posted On:</span>
                  <span className="font-medium">{job.postedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Applications:</span>
                  <span className="font-medium">{job.applicationCount || 0}</span>
                </div>
              </div>
            </div>

            {job.benefits && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Benefits</h3>
                <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {job.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* System notes and metadata */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Created: {job.createdAt}</span>
            <span>Last updated: {job.updatedAt}</span>
            <span>ID: {job.id}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default JobDetailModal;
