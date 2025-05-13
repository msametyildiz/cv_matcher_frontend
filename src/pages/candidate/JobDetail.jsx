import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Briefcase, MapPin, Calendar, DollarSign, Clock, Building, 
  Globe, Share2, FileText, Bookmark, Flag, ArrowLeft
} from 'lucide-react';
// Remove ChevronLeft
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../contexts/NotificationContext';
// Import toast only if you're actually using it
import { User, AlertCircle } from 'lucide-react';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();
  const { success, error: showError } = useNotification();
  
  // State
  const [selectedCV, setSelectedCV] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationNote, setApplicationNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [userCVs, setUserCVs] = useState([]);
  
  // Mock API hooks
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

  // Set up mock data for development
  useEffect(() => {
    if (!job && !loading && !error) {
      // eslint-disable-next-line no-unused-vars
      const mockJobData = {
        id: parseInt(jobId),
        title: 'Senior Full Stack Developer',
        company: 'Tech Innovations Inc.',
        location: 'San Francisco, CA',
        remote: true,
        description: `<p>Join our dynamic team as a Senior Full Stack Developer where you'll work on cutting-edge projects that impact millions of users worldwide. We're looking for a passionate developer who can lead by example and help us push the boundaries of what's possible.</p>
          <p>As a senior member of our engineering team, you'll be responsible for designing, developing, and maintaining both frontend and backend systems.</p>`,
        responsibilities: [
          'Design, develop, and maintain scalable applications using React and Node.js',
          'Lead technical architecture discussions and make critical technology decisions',
          'Mentor junior developers and perform code reviews'
        ],
        requirements: [
          '5+ years of experience in full stack development',
          'Expert knowledge of JavaScript/TypeScript, React, and Node.js',
          'Experience with database design and ORM frameworks'
        ],
        benefits: [
          'Competitive salary and equity package',
          'Comprehensive health, dental, and vision insurance',
          'Flexible remote work policy'
        ],
        salaryRange: '$120,000 - $160,000',
        employmentType: 'Full-time',
        experienceLevel: 'Senior',
        postedDate: '2023-05-01T10:00:00Z',
        applicationDeadline: '2023-06-30T23:59:59Z',
        status: 'active',
        matchScore: 87,
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'GraphQL'],
        applicantsCount: 42,
        viewsCount: 256,
        companyWebsite: 'https://tech-innovations.example.com',
        companySize: '50-200 employees',
        industry: 'Information Technology'
      };

      // Mock similar jobs
      const mockSimilarJobs = [
        {
          id: 101,
          title: 'Full Stack Developer',
          company: 'WebSolutions Co.',
          location: 'Remote',
          employmentType: 'Full-time',
          matchScore: 82,
          postedDate: '2023-05-05T14:30:00Z'
        },
        {
          id: 102,
          title: 'Senior Frontend Developer',
          company: 'UX Masters',
          location: 'New York, NY',
          employmentType: 'Full-time',
          matchScore: 78,
          postedDate: '2023-05-03T09:15:00Z'
        }
      ];

      // Mock user CVs
      const mockCVs = [
        {
          id: 1,
          filename: 'John_Smith_Resume_2023.pdf',
          fileType: 'application/pdf',
          uploadedAt: '2023-04-15T10:30:00Z',
          isPrimary: true
        },
        {
          id: 2,
          filename: 'JS_Tech_Resume.docx',
          fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          uploadedAt: '2023-03-10T14:20:00Z',
          isPrimary: false
        }
      ];

      // Set mock data
      setTimeout(() => {
        setSimilarJobs(mockSimilarJobs);
        setUserCVs(mockCVs);
        setSelectedCV(mockCVs.find(cv => cv.isPrimary) || mockCVs[0]);
      }, 300);
    }
  }, [job, loading, error, jobId]);
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate days ago for posting date
  const getDaysAgo = (dateString) => {
    const posted = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  // Calculate days until deadline
  const getDaysUntilDeadline = (dateString) => {
    const deadline = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(deadline - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    }
    if (diffDays === 1) {
      return 'Tomorrow';
    }
    return `${diffDays} days`;
  };

  // Handle job application
  const handleApply = async () => {
    if (!selectedCV) {
      showError('Please select a CV to apply with');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In real app: await api.job.applyToJob(jobId, selectedCV, applicationNote);
      await new Promise(resolve => setTimeout(resolve, 1000));
      success('Application submitted successfully!');
      setShowApplyModal(false);
    } catch (err) {
      showError('Failed to submit application. Please try again.');
      console.error('Application error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle bookmark toggle
  const toggleBookmark = async () => {
    try {
      setIsBookmarked(!isBookmarked);
      // In real app: await api.job.toggleBookmark(jobId);
      success(isBookmarked ? 'Job removed from bookmarks' : 'Job added to bookmarks');
    } catch (err) {
      setIsBookmarked(!isBookmarked); // Revert on failure
      showError('Failed to update bookmark status');
    }
  };

  // Handle sharing job
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Check out this job: ${job?.title} at ${job?.company}`,
        url: window.location.href
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      success('Link copied to clipboard');
    }
  };

  // Handle report job
  const handleReport = () => {
    // Implementation for reporting inappropriate job listings
    success('Thank you for your report. We will review this listing.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to jobs
        </button>
      </div>
      
      {loading ? (
        <div className="bg-white shadow rounded-lg p-6">
          <Loader />
        </div>
      ) : error ? (
        <div className="bg-white shadow rounded-lg p-6">
          <ErrorMessage message="Failed to load job details. Please try again." onRetry={fetchJob} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job header */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{job?.title}</h1>
                  <div className="mt-1 flex items-center">
                    <Building className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <span className="text-lg text-gray-700">{job?.company}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-y-2">
                    <div className="flex items-center text-sm text-gray-500 mr-4">
                      <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>{job?.location}</span>
                      {job?.remote && <span className="ml-1.5 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Remote</span>}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mr-4">
                      <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>{job?.employmentType}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mr-4">
                      <DollarSign className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>{job?.salaryRange}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>Posted {getDaysAgo(job?.postedDate)}</span>
                    </div>
                  </div>
                </div>
                
                {job?.matchScore && (
                  <div className="flex flex-col items-end">
                    <div className="text-sm text-gray-500">Match Score</div>
                    <div className={`text-lg font-bold ${
                      job.matchScore >= 90 ? 'text-green-600' :
                      job.matchScore >= 70 ? 'text-blue-600' :
                      'text-yellow-600'
                    }`}>
                      {job.matchScore}%
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-3">
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Apply Now
                </button>
                
                <div className="flex space-x-2">
                  <button
                    onClick={toggleBookmark}
                    className={`inline-flex items-center px-3 py-2 border ${isBookmarked ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-700'} rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    <Bookmark className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-blue-600 text-blue-600' : ''}`} />
                    {isBookmarked ? 'Saved' : 'Save Job'}
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </button>
                  
                  <button
                    onClick={handleReport}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Flag className="mr-2 h-4 w-4" />
                    Report
                  </button>
                </div>
              </div>
            </div>
            
            {/* Job description */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Job Description</h2>
              <div 
                className="prose max-w-none text-gray-500 mb-6"
                dangerouslySetInnerHTML={{ __html: job?.description }}
              />
              
              {job?.responsibilities?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Responsibilities:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-500">
                    {job.responsibilities.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {job?.requirements?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Requirements:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-500">
                    {job.requirements.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {job?.benefits?.length > 0 && (
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
            
            {/* Skills */}
            {job?.skills?.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Required Skills</h2>
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
            )}
            
            {/* Similar jobs */}
            {similarJobs.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Similar Jobs</h2>
                <div className="space-y-4">
                  {similarJobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <Link 
                        to={`/candidate/jobs/${job.id}`}
                        className="block"
                      >
                        <h3 className="text-md font-medium text-gray-900 hover:text-blue-600">{job.title}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Building className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {job.company}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-y-2">
                          <div className="flex items-center text-xs text-gray-500 mr-3">
                            <MapPin className="flex-shrink-0 mr-1 h-3 w-3 text-gray-400" />
                            {job.location}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mr-3">
                            <Briefcase className="flex-shrink-0 mr-1 h-3 w-3 text-gray-400" />
                            {job.employmentType}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mr-3">
                            <Clock className="flex-shrink-0 mr-1 h-3 w-3 text-gray-400" />
                            Posted {getDaysAgo(job.postedDate)}
                          </div>
                        </div>
                        {job.matchScore && (
                          <div className="mt-2 flex items-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              job.matchScore >= 90 ? 'bg-green-100 text-green-800' :
                              job.matchScore >= 70 ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {job.matchScore}% Match
                            </span>
                          </div>
                        )}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">About the Company</h2>
              
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                  {job?.company.charAt(0)}
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-900">{job?.company}</h3>
                  {job?.companySize && <p className="text-sm text-gray-500">{job.companySize}</p>}
                </div>
              </div>
              
              <ul className="space-y-2 text-sm">
                {job?.companyWebsite && (
                  <li className="flex items-center">
                    <Globe className="h-4 w-4 text-gray-400 mr-2" />
                    <a 
                      href={job.companyWebsite} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-500"
                    >
                      Company Website
                    </a>
                  </li>
                )}
                {job?.industry && (
                  <li className="flex items-center">
                    <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-500">{job.industry}</span>
                  </li>
                )}
              </ul>
            </div>
            
            {/* Job details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Job Details</h2>
              
              <ul className="space-y-3 text-sm">
                {[
                  { icon: <Briefcase className="h-5 w-5 text-gray-400 mr-2" />, 
                    label: 'Job Type', 
                    value: job?.employmentType },
                  { icon: <DollarSign className="h-5 w-5 text-gray-400 mr-2" />, 
                    label: 'Salary Range', 
                    value: job?.salaryRange || 'Not specified' },
                  { icon: <MapPin className="h-5 w-5 text-gray-400 mr-2" />, 
                    label: 'Location', 
                    value: <>
                      {job?.location}
                      {job?.remote && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Remote</span>}
                    </> },
                  { icon: <Calendar className="h-5 w-5 text-gray-400 mr-2" />, 
                    label: 'Posted On', 
                    value: job?.postedDate ? `${formatDate(job.postedDate)} (${getDaysAgo(job.postedDate)})` : '' },
                  job?.applicationDeadline ? 
                    { icon: <Clock className="h-5 w-5 text-gray-400 mr-2" />, 
                      label: 'Application Deadline', 
                      value: <>
                        {formatDate(job.applicationDeadline)}
                        <span className="ml-2 text-xs text-blue-600">
                          ({getDaysUntilDeadline(job.applicationDeadline)} remaining)
                        </span>
                      </> } : null,
                  job?.experienceLevel ? 
                    { icon: <User className="h-5 w-5 text-gray-400 mr-2" />, 
                      label: 'Experience Level', 
                      value: job.experienceLevel } : null
                ].filter(Boolean).map((item, index) => (
                  <li key={index} className="flex items-start">
                    {item.icon}
                    <div>
                      <span className="block text-gray-500">{item.label}</span>
                      <span className="block text-gray-900 font-medium">{item.value}</span>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                {job?.applicantsCount !== undefined && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Applicants</span>
                    <span className="font-medium">{job.applicantsCount}</span>
                  </div>
                )}
                
                {job?.viewsCount !== undefined && (
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-500">Job Views</span>
                    <span className="font-medium">{job.viewsCount}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Apply button (only visible on mobile in sidebar) */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowApplyModal(true)}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Apply Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Apply for this Job"
        size="md"
      >
        <div className="p-6">
          {/* Job Title */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900">{job?.title}</h3>
            <p className="text-sm text-gray-500">{job?.company}</p>
          </div>
          
          {/* CV Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select CV
            </label>
            
            {userCVs.length === 0 ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      You don't have any CVs uploaded yet.{' '}
                      <Link to="/candidate/cv" className="font-medium text-yellow-700 underline hover:text-yellow-600">
                        Upload a CV
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {userCVs.map((cv) => (
                  <div
                    key={cv.id}
                    onClick={() => setSelectedCV(cv)}
                    className={`flex items-center p-3 border rounded-md cursor-pointer ${
                      selectedCV?.id === cv.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex-1 flex items-center">
                      <FileText className={`h-5 w-5 ${
                        cv.fileType?.includes('pdf') ? 'text-red-500' : 'text-blue-500'
                      } mr-3`} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{cv.filename}</div>
                        <div className="text-xs text-gray-500">
                          Uploaded on {formatDate(cv.uploadedAt)}
                          {cv.isPrimary && (
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                              Primary
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Additional Note */}
          <div className="mb-6">
            <label htmlFor="applicationNote" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Note (Optional)
            </label>
            <textarea
              id="applicationNote"
              rows={4}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Add a brief note to the employer..."
              value={applicationNote}
              onChange={(e) => setApplicationNote(e.target.value)}
            />
          </div>
          
          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowApplyModal(false)}
              className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={isSubmitting || userCVs.length === 0}
              className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobDetail;