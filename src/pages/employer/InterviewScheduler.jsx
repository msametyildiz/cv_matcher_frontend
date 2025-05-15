import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Search, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Video,
  Phone,
  MapPin,
  X,
  Check,
  Clock,
  Users,
  User,
  Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AdminPageLayout from '../../components/layouts/AdminPageLayout';
import InterviewForm from '../../components/interviews/InterviewForm';
import InterviewCard from '../../components/interviews/InterviewCard';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

// Calendar component for the interview scheduler
const CalendarView = ({ 
  currentDate, 
  view, 
  interviews, 
  onDateClick, 
  onInterviewClick,
  navigateDate 
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get days for month view
  const getDaysInMonth = (year, month) => {
    // Get all days in the month
    const date = new Date(year, month, 1);
    const days = [];
    
    // Get the first day of the month and pad with days from previous month
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDayOfMonth.getDay();
    const startPadding = dayOfWeek;
    
    // Add padding days from previous month
    const prevMonth = new Date(date.getFullYear(), date.getMonth(), 0);
    const prevMonthDays = prevMonth.getDate();
    
    for (let i = prevMonthDays - startPadding + 1; i <= prevMonthDays; i++) {
      days.push({
        date: new Date(date.getFullYear(), date.getMonth() - 1, i),
        isCurrentMonth: false
      });
    }
    
    // Add days of current month
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(date.getFullYear(), date.getMonth(), i),
        isCurrentMonth: true
      });
    }
    
    // Add padding days for next month to complete the grid
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const remainingDays = 6 - lastDayOfMonth.getDay();
    
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(date.getFullYear(), date.getMonth() + 1, i),
        isCurrentMonth: false
      });
    }
    
    return days;
  };
  
  // Get days for week view
  const getDaysInWeek = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day;
    const firstDayOfWeek = new Date(date);
    firstDayOfWeek.setDate(diff);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + i);
      days.push({ date: day, isCurrentMonth: day.getMonth() === date.getMonth() });
    }
    
    return days;
  };
  
  // Get interviews for a specific day
  const getInterviewsForDay = (day) => {
    return interviews.filter(interview => {
      const interviewDate = new Date(interview.date);
      return (
        interviewDate.getDate() === day.getDate() &&
        interviewDate.getMonth() === day.getMonth() &&
        interviewDate.getFullYear() === day.getFullYear()
      );
    });
  };
  
  // Format date to string
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  // Get days based on current view
  let days = [];
  if (view === 'month') {
    days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  } else if (view === 'week') {
    days = getDaysInWeek(currentDate);
  } else {
    days = [{ date: currentDate, isCurrentMonth: true }];
  }
  
  // Day view rendering
  if (view === 'day') {
    const dayInterviews = getInterviewsForDay({ date: currentDate });
    
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 bg-blue-50">
          <h2 className="text-lg font-medium text-gray-900">
            {formatDate(currentDate)}
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {dayInterviews.length > 0 ? (
            dayInterviews.map(interview => (
              <div 
                key={interview.id} 
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => onInterviewClick(interview)}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {interview.type === 'video' ? (
                      <Video className="h-5 w-5 text-purple-500" />
                    ) : interview.type === 'phone' ? (
                      <Phone className="h-5 w-5 text-blue-500" />
                    ) : (
                      <MapPin className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{interview.startTime} - {interview.endTime}</p>
                    <p className="text-sm text-gray-600">{interview.candidateName}</p>
                    <p className="text-sm text-gray-500">{interview.jobTitle}</p>
                  </div>
                  <div className="ml-auto">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      interview.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      interview.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      interview.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No interviews scheduled</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any interviews scheduled for this day.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Week or Month view
  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar header */}
      <div className="grid grid-cols-7 gap-px border-b border-gray-200 bg-gray-100 text-sm font-medium text-gray-700">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, i) => (
          <div key={i} className="text-center py-2">
            {dayName}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map((day, i) => {
          const dayInterviews = getInterviewsForDay(day);
          const isToday = 
            day.date.getDate() === today.getDate() &&
            day.date.getMonth() === today.getMonth() &&
            day.date.getFullYear() === today.getFullYear();
          
          return (
            <div 
              key={i}
              className={`bg-white min-h-[120px] p-2 ${
                !day.isCurrentMonth ? 'text-gray-400 bg-gray-50' : ''
              } ${isToday ? 'bg-blue-50' : ''}`}
              onClick={() => onDateClick(day.date)}
            >
              <div className="flex justify-between">
                <span className={`text-sm ${isToday ? 'font-bold text-blue-600' : ''}`}>
                  {day.date.getDate()}
                </span>
                {dayInterviews.length > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-100 bg-blue-600 rounded-full">
                    {dayInterviews.length}
                  </span>
                )}
              </div>
              
              <div className="mt-2 space-y-1 max-h-[80px] overflow-y-auto">
                {dayInterviews.slice(0, 3).map(interview => (
                  <div 
                    key={interview.id}
                    className={`px-2 py-1 text-xs rounded truncate cursor-pointer ${
                      interview.type === 'video' ? 'bg-purple-100 text-purple-800' :
                      interview.type === 'phone' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onInterviewClick(interview);
                    }}
                  >
                    {interview.startTime} {interview.candidateName}
                  </div>
                ))}
                {dayInterviews.length > 3 && (
                  <div className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded text-center">
                    +{dayInterviews.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const InterviewScheduler = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // 'day', 'week', 'month'
  const [showModal, setShowModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filters, setFilters] = useState({
    jobId: '',
    candidateId: '',
    status: 'all',
    type: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);

  // Fetch interviews data
  useEffect(() => {
    const fetchData = async () => {
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
            notes: 'Focus on React experience and team collaboration',
            location: 'Zoom Meeting'
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
            notes: 'Initial screening call',
            location: 'Phone Call'
          },
          {
            id: 4,
            jobTitle: 'Product Manager',
            candidateName: 'Sarah Miller',
            candidateId: 104,
            jobId: 204,
            date: '2025-05-16',
            startTime: '09:00',
            endTime: '10:00',
            type: 'video',
            status: 'scheduled',
            notes: 'Discuss product vision and leadership experience',
            location: 'Google Meet'
          },
          {
            id: 5,
            jobTitle: 'DevOps Engineer',
            candidateName: 'David Chen',
            candidateId: 105,
            jobId: 205,
            date: '2025-05-16',
            startTime: '13:00',
            endTime: '14:00',
            type: 'phone',
            status: 'scheduled',
            notes: 'Technical screening',
            location: 'Phone Call'
          },
          {
            id: 6,
            jobTitle: 'Content Writer',
            candidateName: 'Lisa Johnson',
            candidateId: 106,
            jobId: 206,
            date: '2025-05-17',
            startTime: '11:30',
            endTime: '12:30',
            type: 'onsite',
            status: 'confirmed',
            notes: 'Writing sample review',
            location: 'Meeting Room B'
          }
        ];
        
        // Mock jobs and candidates for the filters
        const mockJobs = [
          { id: 201, title: 'Senior Frontend Developer' },
          { id: 202, title: 'UX Designer' },
          { id: 203, title: 'Full Stack Developer' },
          { id: 204, title: 'Product Manager' },
          { id: 205, title: 'DevOps Engineer' },
          { id: 206, title: 'Content Writer' }
        ];
        
        const mockCandidates = [
          { id: 101, name: 'John Smith' },
          { id: 102, name: 'Emily Johnson' },
          { id: 103, name: 'Michael Wong' },
          { id: 104, name: 'Sarah Miller' },
          { id: 105, name: 'David Chen' },
          { id: 106, name: 'Lisa Johnson' }
        ];
        
        setInterviews(mockInterviews);
        setJobs(mockJobs);
        setCandidates(mockCandidates);
      } catch (err) {
        setError('Failed to load interview data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
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
      // Build complete interview data
      const completeData = {
        ...interviewData,
        id: selectedInterview ? selectedInterview.id : Date.now(),
        status: selectedInterview ? selectedInterview.status : 'scheduled'
      };
      
      if (selectedInterview) {
        // Update existing interview
        setInterviews(prev => 
          prev.map(i => i.id === selectedInterview.id ? completeData : i)
        );
        toast.success('Interview updated successfully');
      } else {
        // Create new interview
        setInterviews(prev => [completeData, ...prev]);
        toast.success('Interview scheduled successfully');
      }
      setShowModal(false);
    } catch (err) {
      toast.error('Failed to save interview');
    }
  };

  // Handle canceling an interview
  const handleCancelInterview = (id) => {
    setInterviews(prev => prev.map(i => 
      i.id === id ? { ...i, status: 'cancelled' } : i
    ));
    toast.success('Interview cancelled');
  };

  // Handle confirming an interview
  const handleConfirmInterview = (id) => {
    setInterviews(prev => prev.map(i => 
      i.id === id ? { ...i, status: 'confirmed' } : i
    ));
    toast.success('Interview confirmed');
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

  // Handle date click in calendar view
  const handleDateClick = (date) => {
    if (view === 'month') {
      setCurrentDate(date);
      setView('day');
    } else if (view === 'week') {
      setCurrentDate(date);
      setView('day');
    } else {
      // Already in day view, use the date for scheduling
      setSelectedDate(date);
      setSelectedInterview(null);
      setShowModal(true);
    }
  };

  // Handle interview click in calendar view
  const handleInterviewClick = (interview) => {
    setSelectedInterview(interview);
    setShowModal(true);
  };

  // Setup confirmation dialog
  const handleConfirmation = (action, message, callback) => {
    setConfirmAction(() => callback);
    setShowConfirmDialog(true);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      jobId: '',
      candidateId: '',
      status: 'all',
      type: 'all'
    });
    setSearchQuery('');
  };

  // Format date for display
  const formatDateRange = () => {
    const options = { month: 'long', year: 'numeric' };
    if (view === 'day') {
      return currentDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } else if (view === 'week') {
      const startOfWeek = new Date(currentDate);
      const day = currentDate.getDay();
      startOfWeek.setDate(currentDate.getDate() - day);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(startOfWeek)}`;
      } else {
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      }
    } else {
      return currentDate.toLocaleDateString('en-US', options);
    }
  };

  return (
    <AdminPageLayout
      title="Interview Scheduler"
      actionButton={
        <button
          onClick={() => {
            setSelectedInterview(null);
            setSelectedDate(null);
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
              {formatDateRange()}
            </h2>
            
            <button onClick={() => navigateDate(1)} className="p-1 rounded hover:bg-gray-100">
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </button>
            
            <button 
              onClick={() => setCurrentDate(new Date())} 
              className="ml-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
            >
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
            
            <button
              type="button"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="mr-2 h-4 w-4" />
              {showFilterPanel ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Filters and Search */}
      {showFilterPanel && (
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by candidate or job"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="video">Video</option>
                <option value="phone">Phone</option>
                <option value="onsite">On-site</option>
              </select>
              
              <select
                name="jobId"
                value={filters.jobId}
                onChange={handleFilterChange}
                className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Jobs</option>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
              
              <select
                name="candidateId"
                value={filters.candidateId}
                onChange={handleFilterChange}
                className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Candidates</option>
                {candidates.map(candidate => (
                  <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Active Filters */}
          {(searchQuery || filters.jobId || filters.candidateId || filters.status !== 'all' || filters.type !== 'all') && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              
              {searchQuery && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Search: {searchQuery}
                  <button 
                    type="button" 
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 text-blue-600 hover:bg-blue-300"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {filters.status !== 'all' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Status: {filters.status.charAt(0).toUpperCase() + filters.status.slice(1)}
                  <button 
                    type="button" 
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-purple-200 text-purple-600 hover:bg-purple-300"
                    onClick={() => setFilters(prev => ({ ...prev, status: 'all' }))}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {filters.type !== 'all' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Type: {filters.type.charAt(0).toUpperCase() + filters.type.slice(1)}
                  <button 
                    type="button" 
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-green-200 text-green-600 hover:bg-green-300"
                    onClick={() => setFilters(prev => ({ ...prev, type: 'all' }))}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {filters.jobId && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Job: {jobs.find(j => j.id === parseInt(filters.jobId))?.title || filters.jobId}
                  <button 
                    type="button" 
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-yellow-200 text-yellow-600 hover:bg-yellow-300"
                    onClick={() => setFilters(prev => ({ ...prev, jobId: '' }))}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {filters.candidateId && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Candidate: {candidates.find(c => c.id === parseInt(filters.candidateId))?.name || filters.candidateId}
                  <button 
                    type="button" 
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-200 text-red-600 hover:bg-red-300"
                    onClick={() => setFilters(prev => ({ ...prev, candidateId: '' }))}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              <button
                type="button"
                onClick={handleClearFilters}
                className="ml-2 text-sm text-blue-600 hover:text-blue-500"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Upcoming Interviews Quick View */}
      {!showFilterPanel && view !== 'day' && (
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Upcoming Interviews</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredInterviews
              .filter(i => i.status === 'scheduled' || i.status === 'confirmed')
              .sort((a, b) => {
                const dateA = new Date(`${a.date} ${a.startTime}`);
                const dateB = new Date(`${b.date} ${b.startTime}`);
                return dateA - dateB;
              })
              .slice(0, 3)
              .map(interview => (
                <div 
                  key={interview.id} 
                  className="border border-gray-200 rounded-lg p-3 hover:shadow-md cursor-pointer"
                  onClick={() => handleInterviewClick(interview)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {interview.type === 'video' ? (
                        <Video className="h-4 w-4 text-purple-500 mr-1" />
                      ) : interview.type === 'phone' ? (
                        <Phone className="h-4 w-4 text-blue-500 mr-1" />
                      ) : (
                        <MapPin className="h-4 w-4 text-green-500 mr-1" />
                      )}
                      <span className="text-sm font-medium">{interview.type.charAt(0).toUpperCase() + interview.type.slice(1)}</span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      interview.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                    </span>
                  </div>
                  <div className="mb-1 flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm font-medium text-gray-900">{interview.candidateName}</span>
                  </div>
                  <div className="mb-1 flex items-center">
                    <Briefcase className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-700">{interview.jobTitle}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span>{new Date(interview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <Clock className="h-4 w-4 text-gray-400 ml-2 mr-1" />
                    <span>{interview.startTime} - {interview.endTime}</span>
                  </div>
                </div>
              ))
            }
            {filteredInterviews.filter(i => i.status === 'scheduled' || i.status === 'confirmed').length === 0 && (
              <div className="col-span-3 text-center py-4">
                <Clock className="h-8 w-8 text-gray-400 mx-auto" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming interviews</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have any upcoming interviews scheduled.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Calendar/List View */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="space-y-6">
          {/* Calendar View */}
          <CalendarView
            currentDate={currentDate}
            view={view}
            interviews={filteredInterviews}
            onDateClick={handleDateClick}
            onInterviewClick={handleInterviewClick}
            navigateDate={navigateDate}
          />
          
          {/* List View (additional to calendar) */}
          {view === 'day' && filteredInterviews.length > 0 && (
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">All Interviews</h3>
              <div className="space-y-4">
                {filteredInterviews
                  .sort((a, b) => {
                    const dateA = new Date(`${a.date} ${a.startTime}`);
                    const dateB = new Date(`${b.date} ${b.startTime}`);
                    return dateA - dateB;
                  })
                  .map(interview => (
                    <InterviewCard
                      key={interview.id}
                      interview={interview}
                      onEdit={() => handleInterviewClick(interview)}
                      onCancel={() => handleConfirmation(
                        'cancel', 
                        'Are you sure you want to cancel this interview?',
                        () => handleCancelInterview(interview.id)
                      )}
                      onConfirm={() => handleConfirmInterview(interview.id)}
                      onViewCandidate={() => navigate(`/employer/candidates/${interview.candidateId}`)}
                    />
                  ))
                }
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Interview Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedInterview ? "Edit Interview" : "Schedule Interview"}
        size="lg"
      >
        <div className="p-6">
          <InterviewForm
            interview={selectedInterview}
            initialDate={selectedDate}
            jobs={jobs}
            candidates={candidates}
            onSubmit={handleSaveInterview}
            onCancel={() => setShowModal(false)}
          />
        </div>
      </Modal>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Action</h3>
            <p className="mb-6">Are you sure you want to proceed with this action?</p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                onClick={() => {
                  if (confirmAction) confirmAction();
                  setShowConfirmDialog(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
};

export default InterviewScheduler;