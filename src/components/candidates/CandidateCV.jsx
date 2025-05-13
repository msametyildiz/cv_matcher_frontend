import React from 'react';

const CandidateCV = ({ cv, onViewClick, onDownloadClick }) => {
  if (!cv) return null;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 sm:px-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Curriculum Vitae</h2>
        
        <div className="border rounded-md p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{cv.name || 'resume.pdf'}</p>
              <p className="text-xs text-gray-500 mt-1">Uploaded on {cv.uploadDate || 'N/A'}</p>
            </div>
            <div className="flex">
              <button
                onClick={onViewClick}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
              >
                View
              </button>
              <button
                onClick={onDownloadClick}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Download
              </button>
            </div>
          </div>
        </div>
        
        {cv.summary && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Summary</h3>
            <p className="text-sm text-gray-600">{cv.summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateCV;
