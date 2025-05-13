import React from 'react';
import { Calendar, Clock, Video, MapPin, User, Briefcase, Edit, Trash2, Check, X } from 'lucide-react';

const InterviewCard = ({ 
  interview, 
  onEdit, 
  onCancel, 
  onComplete,
  onViewCandidate,
  className = '',
  showActions = true 
}) => {
  if (!interview) return null;

  // Format date and time
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString) => {
    try {
      // Handle different time formats
      let time;
      if (timeString.includes('T')) {
        // ISO format
        time = new Date(timeString);
      } else if (timeString.includes(':')) {
        // HH:MM format
        const [hours, minutes] = timeString.split(':');
        const now = new Date();
        time = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hours), parseInt(minutes));
      } else {
        return timeString; // Return as is if format not recognized
      }
      
      return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timeString; // Return original string if parsing fails
    }
  };

  const getStatusBadge = () => {
    const statusClasses = {
      scheduled: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      missed: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[interview.status] || 'bg-gray-100 text-gray-800'}`}>
        {interview.status?.charAt(0).toUpperCase() + interview.status?.slice(1) || 'Unknown'}
      </span>
    );
  };

  const getInterviewTypeIcon = () => {
    switch (interview.type) {
      case 'video':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'onsite':
      case 'in-person':
        return <MapPin className="h-4 w-4 text-red-500" />;
      case 'phone':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const isPast = () => {
    const interviewDate = new Date(`${interview.date}T${interview.endTime || '23:59'}`);
    return interviewDate < new Date();
  };

  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center">
              {getInterviewTypeIcon()}
              <h3 className="ml-2 text-lg font-medium text-gray-900">
                {interview.jobTitle || 'Interview'}
              </h3>
              <div className="ml-3">
                {getStatusBadge()}
              </div>
            </div>
            
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start">
                <User className="mt-0.5 h-4 w-4 text-gray-500 flex-shrink-0" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-900">Candidate</p>
                  <p className="text-sm text-gray-500 cursor-pointer hover:text-blue-600" onClick={onViewCandidate}>
                    {interview.candidateName || 'Not specified'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Briefcase className="mt-0.5 h-4 w-4 text-gray-500 flex-shrink-0" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-900">Position</p>
                  <p className="text-sm text-gray-500">
                    {interview.jobTitle || 'Not specified'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="mt-0.5 h-4 w-4 text-gray-500 flex-shrink-0" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-900">Date</p>
                  <p className="text-sm text-gray-500">
                    {interview.date ? formatDate(interview.date) : 'Not specified'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="mt-0.5 h-4 w-4 text-gray-500 flex-shrink-0" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-900">Time</p>
                  <p className="text-sm text-gray-500">
                    {interview.startTime && interview.endTime ? 
                      `${formatTime(interview.startTime)} - ${formatTime(interview.endTime)}` : 
                      'Not specified'}
                  </p>
                </div>
              </div>
            </div>
            
            {interview.notes && (
              <div className="mt-3 border-t pt-3">
                <p className="text-sm font-medium text-gray-900">Notes</p>
                <p className="text-sm text-gray-500">
                  {interview.notes}
                </p>
              </div>
            )}
          </div>
          
          {showActions && (
            <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col sm:items-end space-y-2">
              <div className="flex space-x-2">
                {!isPast() && interview.status !== 'cancelled' && (
                  <>
                    <button
                      onClick={() => onEdit(interview)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Edit className="mr-1 h-3.5 w-3.5" />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => onCancel(interview.id)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <X className="mr-1 h-3.5 w-3.5" />
                      Cancel
                    </button>
                  </>
                )}
                
                {interview.status === 'scheduled' && isPast() && onComplete && (
                  <button
                    onClick={() => onComplete(interview.id)}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Check className="mr-1 h-3.5 w-3.5" />
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
