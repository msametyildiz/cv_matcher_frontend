import React from 'react';

const ContactInfo = ({ candidate, onContactClick }) => {
  if (!candidate) return null;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 sm:px-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
        <div className="space-y-3">
          {candidate.email && (
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div className="ml-3 text-sm">
                <p className="text-gray-900">{candidate.email}</p>
                <p className="text-gray-500">Email</p>
              </div>
            </div>
          )}
          
          {candidate.phone && (
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div className="ml-3 text-sm">
                <p className="text-gray-900">{candidate.phone}</p>
                <p className="text-gray-500">Phone</p>
              </div>
            </div>
          )}
          
          {candidate.location && (
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 text-sm">
                <p className="text-gray-900">{candidate.location}</p>
                <p className="text-gray-500">Location</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <button
            onClick={onContactClick}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Contact Candidate
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
