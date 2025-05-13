import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, User, Briefcase, Video, MapPin, MessageSquare } from 'lucide-react';

const InterviewForm = ({ 
  interview = null, 
  candidates = [], 
  jobs = [], 
  onSubmit, 
  onCancel,
  isSubmitting = false 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    candidateId: '',
    jobId: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'video',
    location: '',
    description: '',
    participants: [],
    notes: ''
  });

  const [errors, setErrors] = useState({});

  // Initialize form if editing an existing interview
  useEffect(() => {
    if (interview) {
      setFormData({
        title: interview.title || '',
        candidateId: interview.candidateId || '',
        jobId: interview.jobId || '',
        date: interview.date ? new Date(interview.date).toISOString().split('T')[0] : '',
        startTime: interview.startTime || '',
        endTime: interview.endTime || '',
        type: interview.type || 'video',
        location: interview.location || '',
        description: interview.description || '',
        participants: interview.participants || [],
        notes: interview.notes || ''
      });
    }
  }, [interview]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.candidateId) newErrors.candidateId = 'Please select a candidate';
    if (!formData.jobId) newErrors.jobId = 'Please select a job';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }
    if (formData.type === 'in-person' && !formData.location.trim()) {
      newErrors.location = 'Location is required for in-person interviews';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Interview Title <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.title ? 'border-red-300' : ''}`}
              placeholder="e.g. Technical Interview with John Doe"
            />
          </div>
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Candidate & Job Selection */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="candidateId" className="block text-sm font-medium text-gray-700">
              Candidate <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <select
                id="candidateId"
                name="candidateId"
                value={formData.candidateId}
                onChange={handleChange}
                className={`block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.candidateId ? 'border-red-300' : ''}`}
              >
                <option value="">Select Candidate</option>
                {candidates.map(candidate => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.candidateId && <p className="mt-1 text-sm text-red-600">{errors.candidateId}</p>}
          </div>

          <div>
            <label htmlFor="jobId" className="block text-sm font-medium text-gray-700">
              Job Position <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-4 w-4 text-gray-400" />
              </div>
              <select
                id="jobId"
                name="jobId"
                value={formData.jobId}
                onChange={handleChange}
                className={`block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.jobId ? 'border-red-300' : ''}`}
              >
                <option value="">Select Job</option>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
            {errors.jobId && <p className="mt-1 text-sm text-red-600">{errors.jobId}</p>}
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.date ? 'border-red-300' : ''}`}
              />
            </div>
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
          </div>

          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
              Start Time <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={`block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.startTime ? 'border-red-300' : ''}`}
              />
            </div>
            {errors.startTime && <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>}
          </div>

          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
              End Time <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={`block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.endTime ? 'border-red-300' : ''}`}
              />
            </div>
            {errors.endTime && <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>}
          </div>
        </div>

        {/* Interview Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Interview Type <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 space-y-2">
            <div className="flex items-center">
              <input
                id="video"
                name="type"
                type="radio"
                value="video"
                checked={formData.type === 'video'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="video" className="ml-3 block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <Video className="mr-2 h-4 w-4 text-gray-500" />
                  Video Call
                </div>
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="in-person"
                name="type"
                type="radio"
                value="in-person"
                checked={formData.type === 'in-person'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="in-person" className="ml-3 block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                  In Person
                </div>
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="phone"
                name="type"
                type="radio"
                value="phone"
                checked={formData.type === 'phone'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="phone" className="ml-3 block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Phone Call
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Location (for in-person) or Meeting Link (for video call) */}
        {formData.type !== 'phone' && (
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              {formData.type === 'in-person' ? 'Location' : 'Meeting Link'} 
              {formData.type === 'in-person' && <span className="text-red-500">*</span>}
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {formData.type === 'in-person' ? (
                  <MapPin className="h-4 w-4 text-gray-400" />
                ) : (
                  <Video className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.location ? 'border-red-300' : ''}`}
                placeholder={formData.type === 'in-person' ? 'Office address or meeting room' : 'Zoom, Google Meet, Microsoft Teams link'}
              />
            </div>
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>
        )}

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Provide a brief overview of the interview process"
            />
          </div>
        </div>

        {/* Additional participants */}
        <div>
          <label htmlFor="participants" className="block text-sm font-medium text-gray-700">
            Additional Participants (comma-separated emails)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              id="participants"
              name="participants"
              value={Array.isArray(formData.participants) ? formData.participants.join(', ') : formData.participants}
              onChange={(e) => {
                const value = e.target.value;
                const participantsArray = value
                  .split(',')
                  .map(email => email.trim())
                  .filter(email => email.length > 0);
                handleChange({ target: { name: 'participants', value: participantsArray } });
              }}
              className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g. manager@company.com, hr@company.com"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Internal Notes
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MessageSquare className="h-4 w-4 text-gray-400" />
            </div>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Notes only visible to internal team members"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Saving...' : (interview ? 'Update Interview' : 'Schedule Interview')}
        </button>
      </div>
    </form>
  );
};

export default InterviewForm;
