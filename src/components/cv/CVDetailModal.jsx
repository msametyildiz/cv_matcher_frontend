import React from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';

const CVDetailModal = ({ isOpen, onClose, cv }) => {
  if (!cv) {
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
        onClick={() => window.open(cv.downloadUrl || '#', '_blank')}
      >
        Download CV
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
      title={`CV Details - ${cv.name}`}
      footer={footer}
      size="lg"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{cv.name}</h2>
            <p className="text-gray-600">{cv.email}</p>
            <p className="text-gray-600">{cv.phone}</p>
          </div>
          <StatusBadge status={cv.status} size="lg" />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {renderSection("Summary", cv.summary || "No summary provided")}
            
            {cv.skills && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {cv.skills.map((skill, index) => (
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
            {cv.experience && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Experience</h3>
                <div className="space-y-4">
                  {cv.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-gray-200 pl-4">
                      <h4 className="font-medium text-gray-900">{exp.title}</h4>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">{exp.period}</p>
                      <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cv.education && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Education</h3>
                <div className="space-y-4">
                  {cv.education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-gray-200 pl-4">
                      <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500">{edu.period}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* System notes and metadata */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Created: {cv.createdAt}</span>
            <span>Last updated: {cv.updatedAt}</span>
            <span>ID: {cv.id}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CVDetailModal;
