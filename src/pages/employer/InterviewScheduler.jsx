import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar,
  Clock,
  User,
  Users,
  Briefcase,
  ChevronDown,
  Filter,
  Plus,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  Mail,
  Video,
  Phone,
  MapPin,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';

const InterviewScheduler = () => {
  // State
  const [interviews, setInterviews] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('upcoming');
  const [calendarView, setCalendarView] = useState(false); // Toggle between list and calendar views
  
  // Interview form state
  const [interviewForm, setInterviewForm] = useState({
    candidateId: '',
    jobId: '',
    date: '',
    startTime: '',
    endTime: '',
    timezone: 'UTC',
    type: 'video',
    location: '',
    interviewers: [''],
    notes: '',
    sendEmail: true
  });
  
  // Form errors
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    fetchAllData();
  }, []);
  
  const fetchAllData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real app, these would be API calls
      // const interviewsResponse = await api.employer.getInterviews();
      // const candidatesResponse = await api.employer.getCandidates();
      // const jobsResponse = await api.employer.getJobs();
      
      // Mock data for development
      // Simulate API responses
      setTimeout(() => {
        const mockInterviews = [
          {
            id: 1,
            candidateId: 1,
            jobId: 1,
            candidateName: 'John Smith',
            jobTitle: 'Frontend Developer',
            date: '2023-05-25',
            startTime: '10:00',
            endTime: '10:45',
            timezone: 'EST',
            type: 'video',
            location: 'Zoom Meeting',
            interviewers: ['Sarah Johnson', 'Michael Chen'],
            status: 'scheduled',
            createdAt: '2023-05-15'
          },
          {
            id: 2,
            candidateId: 2,
            jobId: 1,
            candidateName: 'Emily Johnson',
            jobTitle: 'Frontend Developer',
            date: '2023-05-27',
            startTime: '14:30',
            endTime: '15:15',
            timezone: 'EST',
            type: 'phone',
            location: 'Phone Call',
            interviewers: ['Michael Chen'],
            status: 'scheduled',
            createdAt: '2023-05-16'
          },
          {
            id: 3,
            candidateId: 3,
            jobId: 2,
            candidateName: 'David Lee',
            jobTitle: 'UX Designer',
            date: '2023-05-15',
            startTime: '11:00',
            endTime: '12:00',
            timezone: 'PST',
            type: 'onsite',
            location: '123 Main St, San Francisco',
            interviewers: ['Anna Martinez', 'Robert Johnson'],
            status: 'completed',
            feedback: 'Strong portfolio, good communication skills. Recommend for second round.',
            createdAt: '2023-05-10'
          },
          {
            id: 4,
            candidateId: 4,
            jobId: 3,
            candidateName: 'Sarah Miller',
            jobTitle: 'Product Manager',
            date: '2023-05-18',
            startTime: '09:00',
            endTime: '10:30',
            timezone: 'EST',
            type: 'video',
            location: 'Google Meet',
            interviewers: ['James Wilson', 'Sophia Garcia'],
            status: 'cancelled',
            cancellationReason: 'Candidate withdrew application',
            createdAt: '2023-05-12'
          }
        ];
        
        const mockCandidates = [
          { id: 1, name: 'John Smith', email: 'john.smith@example.com', applied: '2023-05-01' },
          { id: 2, name: 'Emily Johnson', email: 'emily.johnson@example.com', applied: '2023-05-02' },
          { id: 3, name: 'David Lee', email: 'david.lee@example.com', applied: '2023-04-29' },
          { id: 4, name: 'Sarah Miller', email: 'sarah.miller@example.com', applied: '2023-05-05' },
          { id: 5, name: 'Michael Brown', email: 'michael.brown@example.com', applied: '2023-05-10' }
        ];
        
        const mockJobs = [
          { id: 1, title: 'Frontend Developer', location: 'Remote', applications: 15 },
          { id: 2, title: 'UX Designer', location: 'San Francisco, CA', applications: 8 },
          { id: 3, title: 'Product Manager', location: 'New York, NY', applications: 12 },
          { id: 4, title: 'Full Stack Engineer', location: 'Remote', applications: 20 }
        ];
        
        setInterviews(mockInterviews);
        setCandidates(mockCandidates);
        setJobs(mockJobs);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load interview data. Please try again.');
      setIsLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time for display
  const formatTime = (timeString, timezone) => {
    return `${timeString} ${timezone}`;
  };
  
  // Handle modal for scheduling interview
  const handleScheduleInterview = (candidate = null, job = null) => {
    // Reset form
    setInterviewForm({
      candidateId: candidate ? candidate.id : '',
      jobId: job ? job.id : '',
      date: '',
      startTime: '',
      endTime: '',
      timezone: 'UTC',
      type: 'video',
      location: '',
      interviewers: [''],
      notes: '',
      sendEmail: true
    });
    setFormErrors({});
    setSelectedInterview(null);
    setShowScheduleModal(true);
  };
  
  // Handle editing an interview
  const handleEditInterview = (interview) => {
    setSelectedInterview(interview);
    setInterviewForm({
      candidateId: interview.candidateId,
      jobId: interview.jobId,
      date: interview.date,
      startTime: interview.startTime,
      endTime: interview.endTime,
      timezone: interview.timezone,
      type: interview.type,
      location: interview.location,
      interviewers: Array.isArray(interview.interviewers) ? interview.interviewers : [interview.interviewers],
      notes: interview.notes || '',
      sendEmail: true
    });
    setFormErrors({});
    setShowScheduleModal(true);
  };
  
  // Handle cancelling an interview
  const handleCancelInterview = (interview) => {
    setSelectedInterview(interview);
    setShowCancelModal(true);
  };
  
  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInterviewForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle change in interview type
  const handleTypeChange = (type) => {
    let location = '';
    
    // Set default location based on type
    if (type === 'video') {
      location = 'Zoom Meeting';
    } else if (type === 'phone') {
      location = 'Phone Call';
    }
    
    setInterviewForm(prev => ({
      ...prev,
      type,
      location
    }));
  };
  
  // Handle interviewer changes
  const handleInterviewerChange = (index, value) => {
    const newInterviewers = [...interviewForm.interviewers];
    newInterviewers[index] = value;
    
    setInterviewForm(prev => ({
      ...prev,
      interviewers: newInterviewers
    }));
  };
  
  // Add another interviewer field
  const addInterviewer = () => {
    setInterviewForm(prev => ({
      ...prev,
      interviewers: [...prev.interviewers, '']
    }));
  };
  
  // Remove an interviewer field
  const removeInterviewer = (index) => {
    if (interviewForm.interviewers.length <= 1) return;
    
    const newInterviewers = [...interviewForm.interviewers];
    newInterviewers.splice(index, 1);
    
    setInterviewForm(prev => ({
      ...prev,
      interviewers: newInterviewers
    }));
  };
  
  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    if (!interviewForm.candidateId) {
      errors.candidateId = 'Please select a candidate';
    }
    
    if (!interviewForm.jobId) {
      errors.jobId = 'Please select a job';
    }
    
    if (!interviewForm.date) {
      errors.date = 'Please select a date';
    } else {
      const selectedDate = new Date(interviewForm.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.date = 'Interview date cannot be in the past';
      }
    }
    
    if (!interviewForm.startTime) {
      errors.startTime = 'Please select a start time';
    }
    
    if (!interviewForm.endTime) {
      errors.endTime = 'Please select an end time';
    } else if (interviewForm.startTime && interviewForm.endTime <= interviewForm.startTime) {
      errors.endTime = 'End time must be after start time';
    }
    
    if (!interviewForm.location) {
      errors.location = 'Please enter a location';
    }
    
    // Check if at least one interviewer is provided
    if (!interviewForm.interviewers.some(interviewer => interviewer.trim())) {
      errors.interviewers = 'Please add at least one interviewer';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Submit the interview form
  const handleSubmitInterview = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (selectedInterview) {
        // Update existing interview
        // await api.employer.updateInterview(selectedInterview.id, interviewForm);
        
        // Update local state
        const updatedInterviews = interviews.map(interview => {
          if (interview.id === selectedInterview.id) {
            const candidateData = candidates.find(c => c.id === parseInt(interviewForm.candidateId));
            const jobData = jobs.find(j => j.id === parseInt(interviewForm.jobId));
            
            return {
              ...interview,
              ...interviewForm,
              candidateName: candidateData.name,
              jobTitle: jobData.title
            };
          }
          return interview;
        });
        
        setInterviews(updatedInterviews);
        toast.success('Interview updated successfully');
      } else {
        // Create new interview
        // const response = await api.employer.createInterview(interviewForm);
        
        // For development - mock response
        const candidateData = candidates.find(c => c.id === parseInt(interviewForm.candidateId));
        const jobData = jobs.find(j => j.id === parseInt(interviewForm.jobId));
        
        const newInterview = {
          id: Math.max(...interviews.map(i => i.id)) + 1,
          ...interviewForm,
          candidateName: candidateData.name,
          jobTitle: jobData.title,
          status: 'scheduled',
          createdAt: new Date().toISOString().split('T')[0]
        };
        
        setInterviews([newInterview, ...interviews]);
        toast.success('Interview scheduled successfully');
      }
      
      setShowScheduleModal(false);
    } catch (error) {
      console.error('Error saving interview:', error);
      toast.error(selectedInterview ? 'Failed to update interview' : 'Failed to schedule interview');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle interview cancellation
  const confirmCancelInterview = async () => {
    try {
      // await api.employer.cancelInterview(selectedInterview.id);
      
      // Update local state
      const updatedInterviews = interviews.map(interview => {
        if (interview.id === selectedInterview.id) {
          return {
            ...interview,
            status: 'cancelled',
            cancellationReason: 'Cancelled by employer'
          };
        }
        return interview;
      });
      
      setInterviews(updatedInterviews);
      toast.success('Interview cancelled successfully');
      setShowCancelModal(false);
    } catch (error) {
      console.error('Error cancelling interview:', error);
      toast.error('Failed to cancel interview');
    }
  };
  
  // Filter interviews based on search and filters
  const filteredInterviews = interviews.filter(interview => {
    // Filter by status
    if (filterStatus !== 'all' && interview.status !== filterStatus) {
      return false;
    }
    
    // Filter by date
    const interviewDate = new Date(interview.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dateFilter === 'today' && !(interviewDate.toDateString() === today.toDateString())) {
      return false;
    } else if (dateFilter === 'upcoming' && interviewDate < today) {
      return false;
    } else if (dateFilter === 'past' && interviewDate >= today) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        interview.candidateName.toLowerCase().includes(query) ||
        interview.jobTitle.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Sort interviews by date (newest first)
  filteredInterviews.sort((a, b) => {
    const dateComparison = new Date(b.date) - new Date(a.date);
    if (dateComparison === 0) {
      return new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`);
    }
    return dateComparison;
  });
  
  // Get interview status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get interview type icon
  const getInterviewTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5 text-purple-500" />;
      case 'phone':
        return <Phone className="h-5 w-5 text-blue-500" />;
      case 'onsite':
        return <MapPin className="h-5 w-5 text-green-500" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // If still loading data
  if (isLoading) {
    return <Loader />;
  }
  
  // If error occurred
  if (error) {
    return <ErrorMessage message={error} onRetry={fetchAllData} />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Interview Scheduler</h1>
        <button
          onClick={() => handleScheduleInterview()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Schedule Interview
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search candidates or job titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-4">
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => fetchAllData()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>
      
      {/* Interviews List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {filteredInterviews.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-2 text-lg font-medium text-gray-900">No interviews found</h2>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || filterStatus !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Start by scheduling your first interview.'}
            </p>
            {(searchQuery || filterStatus !== 'all' || dateFilter !== 'all') ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                  setDateFilter('all');
                }}
                className="mt-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Filter className="mr-2 h-4 w-4" />
                Clear filters
              </button>
            ) : (
              <button
                onClick={() => handleScheduleInterview()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                Schedule Interview
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredInterviews.map((interview) => (
              <div 
                key={interview.id} 
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  interview.status === 'cancelled' ? 'bg-red-50' : 
                  interview.status === 'completed' ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getInterviewTypeIcon(interview.type)}
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{interview.candidateName}</h3>
                        <span 
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(interview.status)}`}
                        >
                          {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                        </span>
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-600">
                        Applying for <span className="font-medium">{interview.jobTitle}</span>
                      </p>
                      
                      <div className="mt-2 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                          {formatDate(interview.date)}
                        </div>
                        
                        <span className="hidden sm:inline mx-2">•</span>
                        
                        <div className="flex items-center mt-1 sm:mt-0">
                          <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                          {formatTime(interview.startTime, interview.timezone)} - {formatTime(interview.endTime, interview.timezone)}
                        </div>
                        
                        <span className="hidden sm:inline mx-2">•</span>
                        
                        <div className="flex items-center mt-1 sm:mt-0">
                          <div className="capitalize">{interview.type}</div>
                          {interview.type === 'onsite' && (
                            <div className="ml-1">({interview.location})</div>
                          )}
                        </div>
                      </div>
                      
                      {interview.interviewers && interview.interviewers.length > 0 && (
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <Users className="mr-1.5 h-4 w-4 text-gray-400" />
                          <span>
                            Interviewers: {Array.isArray(interview.interviewers) 
                              ? interview.interviewers.join(', ') 
                              : interview.interviewers
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {interview.status === 'scheduled' && (
                      <>
                        <button
                          onClick={() => handleEditInterview(interview)}
                          className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleCancelInterview(interview)}
                          className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => {
                            // In a real app, this would trigger email sending
                            toast.success(`Reminder sent to ${interview.candidateName}`);
                          }}
                          className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {interview.status === 'cancelled' && interview.cancellationReason && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                      <span>Cancellation Reason: {interview.cancellationReason}</span>
                    </div>
                  </div>
                )}
                
                {interview.status === 'completed' && interview.feedback && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-700">
                    <p><span className="font-medium">Feedback:</span> {interview.feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Schedule Interview Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title={selectedInterview ? 'Edit Interview' : 'Schedule Interview'}
        size="lg"
      >
        <form onSubmit={handleSubmitInterview} className="p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Candidate Selection */}
            <div className="sm:col-span-3">
              <label htmlFor="candidateId" className="block text-sm font-medium text-gray-700">
                Candidate *
              </label>
              <div className="mt-1">
                <select
                  id="candidateId"
                  name="candidateId"
                  value={interviewForm.candidateId}
                  onChange={handleInputChange}
                  disabled={selectedInterview}
                  className={`block w-full rounded-md shadow-sm sm:text-sm ${
                    formErrors.candidateId ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  } ${selectedInterview ? 'bg-gray-100' : ''}`}
                >
                  <option value="">Select a candidate</option>
                  {candidates.map(candidate => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.name} ({candidate.email})
                    </option>
                  ))}
                </select>
                {formErrors.candidateId && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.candidateId}</p>
                )}
              </div>
            </div>
            
            {/* Job Selection */}
            <div className="sm:col-span-3">
              <label htmlFor="jobId" className="block text-sm font-medium text-gray-700">
                Job Position *
              </label>
              <div className="mt-1">
                <select
                  id="jobId"
                  name="jobId"
                  value={interviewForm.jobId}
                  onChange={handleInputChange}
                  disabled={selectedInterview}
                  className={`block w-full rounded-md shadow-sm sm:text-sm ${
                    formErrors.jobId ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  } ${selectedInterview ? 'bg-gray-100' : ''}`}
                >
                  <option value="">Select a job</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.title} ({job.location})
                    </option>
                  ))}
                </select>
                {formErrors.jobId && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.jobId}</p>
                )}
              </div>
            </div>
            
            {/* Interview Date */}
            <div className="sm:col-span-3">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date *
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={interviewForm.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`block w-full rounded-md shadow-sm sm:text-sm ${
                    formErrors.date ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {formErrors.date && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>
                )}
              </div>
            </div>
            
            {/* Interview Type */}
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Interview Type *
              </label>
              <div className="mt-1 flex space-x-2">
                <button
                  type="button"
                  onClick={() => handleTypeChange('video')}
                  className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                    interviewForm.type === 'video'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Video
                </button>
                
                <button
                  type="button"
                  onClick={() => handleTypeChange('phone')}
                  className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                    interviewForm.type === 'phone'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Phone
                </button>
                
                <button
                  type="button"
                  onClick={() => handleTypeChange('onsite')}
                  className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                    interviewForm.type === 'onsite'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Onsite
                </button>
              </div>
            </div>
            
            {/* Start Time */}
            <div className="sm:col-span-2">
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                Start Time *
              </label>
              <div className="mt-1">
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={interviewForm.startTime}
                  onChange={handleInputChange}
                  className={`block w-full rounded-md shadow-sm sm:text-sm ${
                    formErrors.startTime ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {formErrors.startTime && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.startTime}</p>
                )}
              </div>
            </div>
            
            {/* End Time */}
            <div className="sm:col-span-2">
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                End Time *
              </label>
              <div className="mt-1">
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={interviewForm.endTime}
                  onChange={handleInputChange}
                  className={`block w-full rounded-md shadow-sm sm:text-sm ${
                    formErrors.endTime ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {formErrors.endTime && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.endTime}</p>
                )}
              </div>
            </div>
            
            {/* Timezone */}
            <div className="sm:col-span-2">
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                Timezone *
              </label>
              <div className="mt-1">
                <select
                  id="timezone"
                  name="timezone"
                  value={interviewForm.timezone}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">EST</option>
                  <option value="CST">CST</option>
                  <option value="MST">MST</option>
                  <option value="PST">PST</option>
                </select>
              </div>
            </div>
            
            {/* Location */}
            <div className="sm:col-span-6">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={interviewForm.location}
                  onChange={handleInputChange}
                  placeholder={interviewForm.type === 'video' ? 'e.g. Zoom Meeting URL' : 
                                interviewForm.type === 'phone' ? 'e.g. Phone Call' : 
                                'e.g. Office address'}
                  className={`block w-full rounded-md shadow-sm sm:text-sm ${
                    formErrors.location ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {formErrors.location && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>
                )}
              </div>
            </div>
            
            {/* Interviewers */}
            <div className="sm:col-span-6">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Interviewers *
                </label>
                <button
                  type="button"
                  onClick={addInterviewer}
                  className="inline-flex items-center px-2 py-1 text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Interviewer
                </button>
              </div>
              
              {interviewForm.interviewers.map((interviewer, index) => (
                <div key={index} className="mt-2 flex">
                  <input
                    type="text"
                    value={interviewer}
                    onChange={(e) => handleInterviewerChange(index, e.target.value)}
                    placeholder={`Interviewer ${index + 1} name`}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {interviewForm.interviewers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInterviewer(index)}
                      className="ml-2 inline-flex items-center text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              {formErrors.interviewers && (
                <p className="mt-1 text-sm text-red-600">{formErrors.interviewers}</p>
              )}
            </div>
            
            {/* Additional Notes */}
            <div className="sm:col-span-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes (Optional)
              </label>
              <div className="mt-1">
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={interviewForm.notes}
                  onChange={handleInputChange}
                  placeholder="Additional information for the candidate"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            
            {/* Send Notification Email */}
            <div className="sm:col-span-6">
              <div className="flex items-center">
                <input
                  id="sendEmail"
                  name="sendEmail"
                  type="checkbox"
                  checked={interviewForm.sendEmail}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="sendEmail" className="ml-2 block text-sm text-gray-700">
                  Send notification email to candidate
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowScheduleModal(false)}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : selectedInterview ? 'Update Interview' : 'Schedule Interview'}
            </button>
          </div>
        </form>
      </Modal>
      
      {/* Cancel Interview Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Interview"
        size="sm"
      >
        {selectedInterview && (
          <div className="p-6">
            <div className="flex items-center justify-center text-red-500 mb-4">
              <AlertCircle className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-center text-gray-900">Confirm Cancellation</h3>
            <p className="mt-2 text-center text-gray-500">
              Are you sure you want to cancel the interview with <strong>{selectedInterview.candidateName}</strong> scheduled for <strong>{formatDate(selectedInterview.date)}</strong>?
            </p>
            <p className="mt-4 text-sm text-center text-gray-500">
              This action cannot be undone. A notification will be sent to the candidate.
            </p>
            
            <div className="mt-6 flex justify-center space-x-4">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowCancelModal(false)}
              >
                No, Keep It
              </button>
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={confirmCancelInterview}
              >
                Yes, Cancel Interview
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InterviewScheduler;