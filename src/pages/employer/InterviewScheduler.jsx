import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Filter, Search, Plus, Edit, X,
  ChevronLeft, ChevronRight, User, Briefcase, MapPin, Video
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AdminPageLayout from '../../components/layouts/AdminPageLayout';
import InterviewForm from '../../components/interviews/InterviewForm';
import InterviewCard from '../../components/interviews/InterviewCard';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatDate, formatTime } from '../../utils/dateUtils';

const InterviewScheduler = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // 'day', 'week', 'month'
  const [showModal, setShowModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [filters, setFilters] = useState({
    jobId: '',
    candidateId: '',
    status: 'all',
    type: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch interviews data
  useEffect(() => {
    const fetchInterviews = async () => {
      setIsLoading(true);
      try {
        // Mock data for demonstration
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockInterviews = [
          {
            id: 1,
            jobTitle: 'Senior Frontend Developer',
            candidateName: 'John Smith',
            candidateId: 101,
            jobId: 201,
            date: '2025-05-14',
            startTime: '10:00',
            endTime: '11:00',
            type: 'video',
            status: 'scheduled',
            notes: 'Focus on React experience and team collaboration'
          },
          {
            id: 2,
            jobTitle: 'UX Designer',
            candidateName: 'Emily Johnson',
            candidateId: 102,
            jobId: 202,
            date: '2025-05-15',
            startTime: '14:30',
            endTime: '15:30',
            type: 'onsite',
            location: 'Conference Room A',
            status: 'confirmed',
            notes: 'Portfolio review meeting'
          },
          {
            id: 3,
            jobTitle: 'Full Stack Developer',
            candidateName: 'Michael Wong',
            candidateId: 103,
            jobId: 203,
            date: '2025-05-13',
            startTime: '11:00',
            endTime: '12:00',
            type: 'phone',
            status: 'completed',
            notes: 'Initial screening call'
          }
        ];
        
        setInterviews(mockInterviews);
      } catch (err) {
        setError('Failed to load interview data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInterviews();
  }, []);

  // Filter interviews based on current filters and search
  const filteredInterviews = interviews.filter(interview => {
    // Apply filters
    if (filters.jobId && interview.jobId !== parseInt(filters.jobId)) return false;
    if (filters.candidateId && interview.candidateId !== parseInt(filters.candidateId)) return false;
    if (filters.status !== 'all' && interview.status !== filters.status) return false;
    if (filters.type !== 'all' && interview.type !== filters.type) return false;
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        interview.candidateName.toLowerCase().includes(query) ||
        interview.jobTitle.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Handle creating or updating an interview
  const handleSaveInterview = async (interviewData) => {
    try {
      // In a real app, call API to save interview
      if (selectedInterview) {
        // Update existing interview
        setInterviews(prev => 
          prev.map(i => i.id === selectedInterview.id ? { ...i, ...interviewData } : i)
        );
        toast.success('Interview updated successfully');
      } else {
        // Create new interview
        const newInterview = {
          id: Date.now(), // Mock ID generation
          ...interviewData,
          status: 'scheduled'
        };
        setInterviews(prev => [newInterview, ...prev]);
        toast.success('Interview scheduled successfully');
      }
      setShowModal(false);
    } catch (err) {
      toast.error('Failed to save interview');
    }
  };

  // Handle canceling an interview
  const handleCancelInterview = (id) => {
    if (confirm('Are you sure you want to cancel this interview?')) {
      setInterviews(prev => prev.map(i => 
        i.id === id ? { ...i, status: 'cancelled' } : i
      ));
      toast.success('Interview cancelled');
    }
  };

  // Navigation between date ranges
  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + direction);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + (7 * direction));
    } else {
      newDate.setMonth(newDate.getMonth() + direction);
    }
    setCurrentDate(newDate);
  };

  return (
    <AdminPageLayout
      title="Interview Scheduler"
      actionButton={
        <button
          onClick={() => {
            setSelectedInterview(null);
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Schedule Interview
        </button>
      }
    >
      {/* Date and View Controls */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <button onClick={() => navigateDate(-1)} className="p-1 rounded hover:bg-gray-100">
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </button>
            
            <h2 className="mx-4 text-lg font-medium">
              {view === 'day' && formatDate(currentDate)}
              {view === 'week' && `Week of ${formatDate(currentDate)}`}
              {view === 'month' && new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate)}
            </h2>
            
            <button onClick={() => navigateDate(1)} className="p-1 rounded hover:bg-gray-100">
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </button>
            
            <button onClick={() => setCurrentDate(new Date())} className="ml-2 text-sm text-blue-600">
              Today
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="bg-gray-100 rounded-md p-1 flex">
              <button 
                onClick={() => setView('day')}
                className={`px-3 py-1 text-sm rounded-md ${view === 'day' ? 'bg-white shadow' : ''}`}
              >
                Day
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-3 py-1 text-sm rounded-md ${view === 'week' ? 'bg-white shadow' : ''}`}
              >
                Week
              </button>
              <button
                onClick={() => setView('month')}
                className={`px-3 py-1 text-sm rounded-md ${view === 'month' ? 'bg-white shadow' : ''}`}
              >
                Month
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by candidate or job"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full border-gray-300 rounded-md"
            />
          </div>
          
          <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="border-gray-300 rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="border-gray-300 rounded-md"
            >
              <option value="all">All Types</option>
              <option value="video">Video</option>
              <option value="phone">Phone</option>
              <option value="onsite">On-site</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Interviews List */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : filteredInterviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No interviews found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || Object.values(filters).some(v => v !== 'all' && v !== '') 
              ? 'Try changing your filters or search criteria'
              : 'Click "Schedule Interview" to create your first interview'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInterviews.map(interview => (
            <InterviewCard
              key={interview.id}
              interview={interview}
              onEdit={() => {
                setSelectedInterview(interview);
                setShowModal(true);
              }}
              onCancel={() => handleCancelInterview(interview.id)}
              onViewCandidate={() => navigate(`/employer/candidates/${interview.candidateId}`)}
            />
          ))}
        </div>
      )}
      
      {/* Interview Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedInterview ? "Edit Interview" : "Schedule Interview"}
        size="lg"
      >
        <InterviewForm
          interview={selectedInterview}
          onSubmit={handleSaveInterview}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </AdminPageLayout>
  );
};

export default InterviewScheduler;