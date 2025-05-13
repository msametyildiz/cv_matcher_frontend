import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  Building, 
  Edit, 
  Trash2,
  Users,
  Eye,
  XCircle,
  AlertTriangle,
  Share2,
  ChevronDown,
  BarChart2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useApi } from '../../hooks/useApi';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCloseJobModal, setShowCloseJobModal] = useState(false);
  const [applicationsData, setApplicationsData] = useState([]);
  const [showApplicantsPreview, setShowApplicantsPreview] = useState(true);
  
  // Fetch job details
  const { 
    data: job, 
    loading, 
    error, 
    execute: fetchJob 
  } = useApi({
    url: `/api/jobs/${jobId}`,
    method: 'GET',
    autoFetch: true
  });

  // Fetch job applications
  const {
    data: applications,
    loading: loadingApplications,
    error: applicationsError,
    execute: fetchApplications
  } = useApi({
    url: `/api/jobs/${jobId}/applications`,
    method: 'GET',
    autoFetch: true
  });

  // Set up mock data for development
  useEffect(() => {
    if (!job && !loading && !error) {
      // eslint-disable-next-line no-unused-vars
      const mockJob = {
        id: parseInt(jobId),
        title: 'Senior Full Stack Developer',
        company: 'Tech Innovations Inc.',
        location: 'San Francisco, CA',
        remote: true,
        description: `<p>Join our dynamic team as a Senior Full Stack Developer where you'll work on cutting-edge projects that impact millions of users worldwide. We're looking for a passionate developer who can lead by example and help us push the boundaries of what's possible.</p>
          <p>As a senior member of our engineering team, you'll be responsible for designing, developing, and maintaining both frontend and backend systems. You'll collaborate closely with product managers, designers, and other developers to create seamless user experiences.</p>`,
        responsibilities: [
          'Design, develop, and maintain scalable applications using React and Node.js',
          'Lead technical architecture discussions and make critical technology decisions',
          'Mentor junior developers and perform code reviews',
          'Work with product and design teams to define feature specifications',
          'Optimize application performance and ensure code quality',
          'Troubleshoot and fix bugs in existing applications'
        ],
        requirements: [
          '5+ years of experience in full stack development',
          'Expert knowledge of JavaScript/TypeScript, React, and Node.js',
          'Experience with database design and ORM frameworks',
          'Familiarity with cloud services (AWS, GCP, or Azure)',
          'Understanding of CI/CD pipelines and DevOps practices',
          'Excellent problem-solving skills and attention to detail'
        ],
        benefits: [
          'Competitive salary and equity package',
          'Comprehensive health, dental, and vision insurance',
          'Flexible remote work policy',
          '401(k) matching',
          'Unlimited PTO',
          'Professional development budget',
          'Weekly team lunches and quarterly offsites'
        ],
        salaryRange: '$120,000 - $160,000',
        employmentType: 'Full-time',
        experienceLevel: 'Senior',
        postedDate: '2023-05-01T10:00:00Z',
        applicationDeadline: '2023-06-30T23:59:59Z',
        status: 'active',
        applicantsCount: 42,
        viewsCount: 256,
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'GraphQL']
      };

      // Mock applications data for development
      const mockApplications = [
        {
          id: 1,
          candidateName: 'John Smith',
          candidateEmail: 'john.smith@example.com',
          appliedDate: '2023-05-05T14:30:00Z',
          status: 'new',
          matchScore: 92,
          experience: '5 years',
          currentTitle: 'Frontend Developer',
          location: 'San Francisco, CA',
          resumeUrl: '#'
        },
        {
          id: 2,
          candidateName: 'Emily Johnson',
          candidateEmail: 'emily.johnson@example.com',
          appliedDate: '2023-05-06T09:45:00Z',
          status: 'reviewed',
          matchScore: 88,
          experience: '7 years',
          currentTitle: 'Full Stack Developer',
          location: 'New York, NY',
          resumeUrl: '#'
        },
        {
          id: 3,
          candidateName: 'Michael Chen',
          candidateEmail: 'michael.chen@example.com',
          appliedDate: '2023-05-07T16:20:00Z',
          status: 'interview',
          matchScore: 85,
          experience: '6 years',
          currentTitle: 'Software Engineer',
          location: 'Remote',
          resumeUrl: '#'
        },
        {
          id: 4,
          candidateName: 'Sarah Wilson',
          candidateEmail: 'sarah.wilson@example.com',
          appliedDate: '2023-05-08T11:15:00Z',
          status: 'rejected',
          matchScore: 70,
          experience: '3 years',
          currentTitle: 'Junior Developer',
          location: 'Chicago, IL',
          resumeUrl: '#'
        },
        {
          id: 5,
          candidateName: 'David Lee',
          candidateEmail: 'david.lee@example.com',
          appliedDate: '2023-05-09T08:30:00Z',
          status: 'new',
          matchScore: 82,
          experience: '4 years',
          currentTitle: 'Backend Developer',
          location: 'Seattle, WA',
          resumeUrl: '#'
        }
      ];

      setApplicationsData(mockApplications);
    } else if (applications) {
      setApplicationsData(applications);
    }
  }, [job, loading, error, jobId, applications]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days remaining until deadline
  const getDaysRemaining = (dateString) => {
    const deadline = new Date(dateString);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'Expired';
    }
    
    if (diffDays === 0) {
      return 'Today';
    }
    
    if (diffDays === 1) {
      return 'Tomorrow';
    }
    
    return `${diffDays} days`;
  };

  // Handle job deletion
  const handleDeleteJob = async () => {
    try {
      // In a real app, this would call the API
      // await api.job.deleteJob(jobId);
      
      toast.success('Job deleted successfully');
      navigate('/employer/jobs');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  // Handle closing job
  const handleCloseJob = async () => {
    try {
      // In a real app, this would call the API
      // await api.job.updateJob(jobId, { status: 'closed' });
      
      toast.success('Job closed successfully');
      // Refresh job data
      fetchJob();
      setShowCloseJobModal(false);
    } catch (error) {
      console.error('Error closing job:', error);
      toast.error('Failed to close job');
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get application status badge color
  const getApplicationStatusBadgeColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'reviewed':
        return 'bg-purple-100 text-purple-800';
      case 'interview':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'hired':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle sharing job
  const handleShareJob = () => {
    const jobUrl = window.location.href;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(jobUrl)
        .then(() => toast.success('Job URL copied to clipboard'))
        .catch(() => toast.error('Failed to copy URL'));
    } else {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = jobUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      toast.success('Job URL copied to clipboard');
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load job details" onRetry={fetchJob} />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
          <div className="mt-1 flex items-center">
            <Building className="h-5 w-5 text-gray-400 mr-1.5" />
            <span className="text-lg text-gray-700">{job.company}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleShareJob}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </button>
          <Link
            to={`/employer/jobs/${jobId}/edit`}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
          {job.status === 'active' && (
            <button
              onClick={() => setShowCloseJobModal(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Close Job
            </button>
          )}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Overview */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Job Overview</h2>
                <span 
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(job.status)}`}
                >
                  {job.status === 'active' ? 'Active' : 
                   job.status === 'draft' ? 'Draft' : 
                   'Closed'}
                </span>
              </div>
            </div>
            
            <div className="px-6 py-5">
              <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
                <div className="sm:col-span-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <span>
                      {job.location}
                      {job.remote && <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Remote</span>}
                    </span>
                  </div>
                </div>
                
                <div className="sm:col-span-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Briefcase className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <span>{job.employmentType}</span>
                  </div>
                </div>
                
                <div className="sm:col-span-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <span>{job.salaryRange}</span>
                  </div>
                </div>
                
                <div className="sm:col-span-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <span>{job.experienceLevel}</span>
                  </div>
                </div>
                
                <div className="sm:col-span-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <span>Posted {formatDate(job.postedDate)}</span>
                  </div>
                </div>
                
                <div className="sm:col-span-1">
                  {job.applicationDeadline && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <span>
                        Deadline {formatDate(job.applicationDeadline)}
                        <span className="ml-2 text-xs text-blue-600">
                          ({getDaysRemaining(job.applicationDeadline)} remaining)
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <div className="flex items-center text-sm text-gray-500 mb-2 sm:mb-0">
                    <Eye className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <span>{job.viewsCount} views</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <span>{job.applicantsCount} applications</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Job Description */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Job Description</h2>
            </div>
            
            <div className="px-6 py-5">
              <div 
                className="prose max-w-none text-gray-500 mb-6"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
              
              {job.responsibilities?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Responsibilities:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-500">
                    {job.responsibilities.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {job.requirements?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Requirements:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-500">
                    {job.requirements.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {job.benefits?.length > 0 && (
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-2">Benefits:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-500">
                    {job.benefits.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Skills */}
          {job.skills?.length > 0 && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Required Skills</h2>
              </div>
              
              <div className="px-6 py-5">
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Stats */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Job Statistics</h2>
            </div>
            
            <div className="px-6 py-5">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Total Views</dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">{job.viewsCount}</dd>
                </div>
                
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Total Applications</dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">{job.applicantsCount}</dd>
                </div>
                
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Application Rate</dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">
                    {job.viewsCount > 0 ? Math.round((job.applicantsCount / job.viewsCount) * 100) : 0}%
                  </dd>
                </div>
              </dl>
              
              <div className="mt-6">
                <Link
                  to={`/employer/jobs/${jobId}/analytics`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <BarChart2 className="mr-2 h-4 w-4" />
                  View Detailed Analytics
                </Link>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            </div>
            
            <div className="px-6 py-5">
              <div className="space-y-3">
                <Link
                  to={`/employer/jobs/${jobId}/matching`}
                  className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View All Applicants
                </Link>
                
                <Link
                  to={`/employer/candidates?job=${jobId}`}
                  className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Find Candidates
                </Link>
                
                <button
                  onClick={handleShareJob}
                  className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Share Job Posting
                </button>
              </div>
            </div>
          </div>
          
          {/* Applicants Preview */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Recent Applicants</h2>
              <button
                onClick={() => setShowApplicantsPreview(!showApplicantsPreview)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                {showApplicantsPreview ? 'Hide' : 'Show'}
                <ChevronDown className={`inline-block ml-1 h-4 w-4 transition-transform ${showApplicantsPreview ? 'transform rotate-180' : ''}`} />
              </button>
            </div>
            
            {showApplicantsPreview && (
              <div className="px-6 py-5">
                {loadingApplications ? (
                  <Loader size="small" />
                ) : applicationsError ? (
                  <ErrorMessage message="Failed to load applications" onRetry={fetchApplications} />
                ) : applicationsData.length === 0 ? (
                  <div className="text-center py-4">
                    <Users className="mx-auto h-8 w-8 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Your job posting hasn't received any applications yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applicationsData.slice(0, 3).map((application) => (
                      <div key={application.id} className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{application.candidateName}</div>
                          <div className="text-xs text-gray-500">{application.currentTitle}</div>
                          <div className="mt-1 flex items-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getApplicationStatusBadgeColor(application.status)}`}>
                              {application.status === 'new' ? 'New' :
                               application.status === 'reviewed' ? 'Reviewed' :
                               application.status === 'interview' ? 'Interview' :
                               application.status === 'rejected' ? 'Rejected' :
                               application.status === 'hired' ? 'Hired' : 'Unknown'}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">
                              Applied {formatDate(application.appliedDate)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-medium text-blue-600">{application.matchScore}% Match</span>
                          <Link
                            to={`/employer/jobs/${jobId}/applications/${application.id}`}
                            className="mt-1 text-xs text-blue-600 hover:text-blue-500"
                          >
                            View Profile
                          </Link>
                        </div>
                      </div>
                    ))}
                    
                    {applicationsData.length > 3 && (
                      <div className="pt-4 border-t border-gray-200 text-center">
                        <Link
                          to={`/employer/jobs/${jobId}/matching`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          View all {applicationsData.length} applicants
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Job Posting"
        size="sm"
      >
        <div className="p-6">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <AlertTriangle className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-center text-gray-900 mb-2">
            Are you sure you want to delete this job?
          </h3>
          <p className="text-sm text-center text-gray-500 mb-6">
            This action cannot be undone. This will permanently delete the job posting and all associated applications.
          </p>
          
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteJob}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Job
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Close Job Modal */}
      <Modal
        isOpen={showCloseJobModal}
        onClose={() => setShowCloseJobModal(false)}
        title="Close Job Posting"
        size="sm"
      >
        <div className="p-6">
          <div className="flex items-center justify-center text-yellow-500 mb-4">
            <AlertTriangle className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-center text-gray-900 mb-2">
            Are you sure you want to close this job?
          </h3>
          <p className="text-sm text-center text-gray-500 mb-6">
            This will mark the job as closed and it will no longer accept new applications.
            You can still view existing applications and reopen the job later.
          </p>
          
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => setShowCloseJobModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCloseJob}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Close Job
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobDetail;