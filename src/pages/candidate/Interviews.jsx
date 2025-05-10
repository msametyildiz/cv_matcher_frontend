import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  Phone, 
  CheckCircle,
  XCircle,
  MessageCircle,
  User,
  ChevronDown,
  Building,
  AlertCircle
} from 'lucide-react';
import api from '../../api';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('upcoming');
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInterviews = async () => {
      setIsLoading(true);
      try {
        // In a real app, we would call the API
        // const response = await api.get('/candidate/interviews');
        // setInterviews(response.data);

        // Mock data for development
        setTimeout(() => {
          setInterviews([
            {
              id: 1,
              jobTitle: 'UX Designer',
              company: 'Creative Design Studio',
              companyLogo: null,
              date: '2023-05-22',
              time: '10:00 AM',
              endTime: '10:45 AM',
              timezone: 'EST',
              type: 'video',
              location: 'Zoom Meeting',
              interviewers: [
                { name: 'Sarah Johnson', title: 'Design Lead' },
                { name: 'Michael Chen', title: 'Product Manager' }
              ],
              instructions: 'Please join the Zoom call 5 minutes before the scheduled time. Be prepared to share your portfolio during the interview.',
              status: 'scheduled',
              meetingUrl: 'https://zoom.us/j/1234567890',
              notes: 'Review company website and prepare questions about their design process.',
              round: 'First Round'
            },
            {
              id: 2,
              jobTitle: 'Frontend Developer',
              company: 'Tech Solutions Inc.',
              companyLogo: null,
              date: '2023-05-25',
              time: '02:30 PM',
              endTime: '03:30 PM',
              timezone: 'PST',
              type: 'phone',
              location: 'Phone Call',
              interviewers: [
                { name: 'Alex Rodriguez', title: 'Senior Frontend Developer' }
              ],
              instructions: 'Our recruiter will call you at the number you provided in your application.',
              status: 'scheduled',
              notes: 'Prepare to discuss experience with React and modern JS frameworks.',
              round: 'Initial Screening'
            },
            {
              id: 3,
              jobTitle: 'Product Designer',
              company: 'UX Masters',
              companyLogo: null,
              date: '2023-05-10',
              time: '11:00 AM',
              endTime: '12:00 PM',
              timezone: 'EST',
              type: 'onsite',
              location: '123 Main St, New York, NY',
              interviewers: [
                { name: 'Jennifer Lewis', title: 'Head of Design' },
                { name: 'Robert Taylor', title: 'Senior Product Designer' },
                { name: 'Emily Watson', title: 'HR Manager' }
              ],
              instructions: 'Please arrive 15 minutes early and bring your ID for check-in at the reception.',
              status: 'completed',
              feedback: 'Thank you for taking the time to come in. We were impressed with your portfolio and design thinking process.',
              notes: 'Bring printed copies of portfolio work.',
              round: 'Final Round'
            },
            {
              id: 4,
              jobTitle: 'Web Developer',
              company: 'Digital Agency',
              companyLogo: null,
              date: '2023-04-28',
              time: '09:30 AM',
              endTime: '10:30 AM',
              timezone: 'CST',
              type: 'video',
              location: 'Google Meet',
              interviewers: [
                { name: 'David Brown', title: 'Tech Lead' }
              ],
              instructions: 'You will receive a Google Meet link via email 1 hour before the interview.',
              status: 'cancelled',
              cancellationReason: 'Position has been filled',
              notes: 'Prepare to discuss experience with JavaScript and responsive design.',
              round: 'Technical Interview'
            }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching interviews:', error);
        setError('Failed to load your interviews. Please try again.');
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getRelativeDate = (dateString) => {
    const interviewDate = new Date(dateString);
    const today = new Date();
    const diffTime = interviewDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays > 1 && diffDays < 7) {
      return `In ${diffDays} days`;
    } else if (diffDays >= 7 && diffDays < 14) {
      return 'Next week';
    } else {
      return formatDate(dateString);
    }
  };

  const handleViewDetails = (interview) => {
    setSelectedInterview(interview);
    setShowDetailsModal(true);
  };

  const handleFeedback = (interview) => {
    setSelectedInterview(interview);
    setFeedbackText('');
    setShowFeedbackModal(true);
  };

  const submitFeedback = async () => {
    if (!feedbackText.trim()) return;
    
    setIsSubmitting(true);
    try {
      // In a real app, we would call the API
      // await api.post(`/candidate/interviews/${selectedInterview.id}/feedback`, { feedback: feedbackText });
      
      // Mock success for development
      setTimeout(() => {
        // Update the interview in the local state
        setInterviews(interviews.map(interview => 
          interview.id === selectedInterview.id 
            ? { ...interview, userFeedback: feedbackText } 
            : interview
        ));
        
        setShowFeedbackModal(false);
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setIsSubmitting(false);
    }
  };

  // Filter interviews based on selected filter
  const filteredInterviews = interviews.filter(interview => {
    const interviewDate = new Date(interview.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (filter) {
      case 'upcoming':
        return interviewDate >= today && interview.status === 'scheduled';
      case 'past':
        return interviewDate < today || interview.status === 'completed';
      case 'cancelled':
        return interview.status === 'cancelled';
      default:
        return true;
    }
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getInterviewTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5 text-purple-500" />;
      case 'phone':
        return <Phone className="h-5 w-5 text-blue-500" />;
      case 'onsite':
        return <MapPin className="h-5 w-5 text-green-500" />;
      default:
        return <MessageCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Interviews</h1>
      
      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 border-b-2 text-sm font-medium ${
                filter === 'upcoming'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`py-4 px-6 border-b-2 text-sm font-medium ${
                filter === 'past'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setFilter('past')}
            >
              Past
            </button>
            <button
              className={`py-4 px-6 border-b-2 text-sm font-medium ${
                filter === 'cancelled'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setFilter('cancelled')}
            >
              Cancelled
            </button>
          </nav>
        </div>
      </div>
      
      {/* Interview List */}
      {filteredInterviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {filter === 'upcoming' ? 'No upcoming interviews' : 
             filter === 'past' ? 'No past interviews' : 
             'No cancelled interviews'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'upcoming' ? 'You don\'t have any scheduled interviews.' : 
             filter === 'past' ? 'You don\'t have any completed interviews.' : 
             'You don\'t have any cancelled interviews.'}
          </p>
          {filter !== 'upcoming' && (
            <button
              onClick={() => setFilter('upcoming')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Upcoming Interviews
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInterviews.map((interview) => (
            <div 
              key={interview.id} 
              className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border ${
                interview.status === 'cancelled' ? 'border-red-200' : 
                interview.status === 'completed' ? 'border-blue-200' : 
                'border-gray-200'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getInterviewTypeIcon(interview.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{interview.jobTitle}</h3>
                      <div className="flex items-center mt-1">
                        <Building className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{interview.company}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span className="capitalize">{interview.type} Interview</span>
                        <span className="mx-2">•</span>
                        <span>{interview.round}</span>
                      </div>
                      <div className="flex flex-col text-sm sm:flex-row mt-2">
                        <div className="flex items-center text-gray-500">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{formatDate(interview.date)}</span>
                        </div>
                        <div className="flex items-center text-gray-500 mt-1 sm:mt-0 sm:ml-4">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{interview.time} - {interview.endTime} {interview.timezone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        interview.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                        interview.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {interview.status === 'scheduled' ? 'Scheduled' :
                        interview.status === 'completed' ? 'Completed' :
                        'Cancelled'}
                    </span>
                    
                    {interview.status === 'scheduled' && (
                      <span className="mt-1 text-xs text-green-600 font-medium">
                        {getRelativeDate(interview.date)}
                      </span>
                    )}
                  </div>
                </div>
                
                {interview.status === 'cancelled' && interview.cancellationReason && (
                  <div className="mt-4 p-3 bg-red-50 rounded-md border border-red-200 text-sm text-red-700">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                      <div>
                        <span className="font-medium">Cancelled:</span> {interview.cancellationReason}
                      </div>
                    </div>
                  </div>
                )}
                
                {interview.status === 'completed' && interview.feedback && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200 text-sm text-blue-700">
                    <div className="flex items-start">
                      <MessageCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                      <div>
                        <span className="font-medium">Feedback:</span> {interview.feedback}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex gap-2 justify-end">
                  {interview.status === 'completed' && !interview.userFeedback && (
                    <button
                      onClick={() => handleFeedback(interview)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Add Feedback
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleViewDetails(interview)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Details
                  </button>
                  
                  {interview.status === 'scheduled' && interview.meetingUrl && (
                    
                      href={interview.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Join Meeting
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Quick Tips Card */}
      {filter === 'upcoming' && filteredInterviews.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Interview Prep Tips</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span>Research the company and role thoroughly before your interview</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span>Prepare examples of your work and achievements relevant to the position</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span>Test your equipment and internet connection ahead of time for virtual interviews</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span>Prepare thoughtful questions to ask your interviewers</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span>Follow up with a thank you email within 24 hours after your interview</span>
            </li>
          </ul>
        </div>
      )}

      {/* Interview Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Interview Details"
        size="lg"
      >
        {selectedInterview && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-medium text-gray-900">{selectedInterview.jobTitle}</h3>
              <span 
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedInterview.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                  selectedInterview.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}
              >
                {selectedInterview.status === 'scheduled' ? 'Scheduled' :
                 selectedInterview.status === 'completed' ? 'Completed' :
                 'Cancelled'}
              </span>
            </div>
            
            <p className="text-md text-gray-700 mb-4">
              <Building className="inline-block h-5 w-5 text-gray-500 mr-1 align-text-bottom" />
              {selectedInterview.company}
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="font-medium">Date:</span>
                    <span className="ml-2">{formatDate(selectedInterview.date)}</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="font-medium">Time:</span>
                    <span className="ml-2">
                      {selectedInterview.time} - {selectedInterview.endTime} {selectedInterview.timezone}
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center text-gray-700">
                    {getInterviewTypeIcon(selectedInterview.type)}
                    <span className="ml-2 font-medium">Interview Type:</span>
                    <span className="ml-2 capitalize">{selectedInterview.type}</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="font-medium">Location:</span>
                    <span className="ml-2">{selectedInterview.location}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 mb-2">Interviewers</h4>
              <div className="space-y-2">
                {selectedInterview.interviewers.map((interviewer, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{interviewer.name}</div>
                      <div className="text-xs text-gray-500">{interviewer.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {selectedInterview.instructions && (
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-2">Instructions</h4>
                <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 text-sm text-yellow-800">
                  {selectedInterview.instructions}
                </div>
              </div>
            )}
            
            {selectedInterview.notes && (
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-2">Your Notes</h4>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-sm text-gray-700">
                  {selectedInterview.notes}
                </div>
              </div>
            )}
            
            {selectedInterview.status === 'cancelled' && selectedInterview.cancellationReason && (
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-2">Cancellation Reason</h4>
                <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700">
                  {selectedInterview.cancellationReason}
                </div>
              </div>
            )}
            
            {selectedInterview.status === 'completed' && selectedInterview.feedback && (
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-2">Feedback Received</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-700">
                  {selectedInterview.feedback}
                </div>
              </div>
            )}
            
            {selectedInterview.userFeedback && (
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-2">Your Feedback</h4>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-sm text-gray-700">
                  {selectedInterview.userFeedback}
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Close
              </button>
              
              {selectedInterview.status === 'scheduled' && selectedInterview.meetingUrl && (
                
                  href={selectedInterview.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Video className="inline-block h-4 w-4 mr-1 align-text-bottom" />
                  Join Meeting
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Feedback Modal */}
      <Modal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        title="Add Your Feedback"
        size="md"
      >
        {selectedInterview && (
          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Share your thoughts about the interview for {selectedInterview.jobTitle} at {selectedInterview.company}.
                This feedback is for your records only and will not be shared with the employer.
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                Your Feedback
              </label>
              <textarea
                id="feedback"
                rows={5}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="What went well? What could have gone better? Any important points discussed?"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={submitFeedback}
                disabled={!feedbackText.trim() || isSubmitting}
                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Feedback'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Interviews;