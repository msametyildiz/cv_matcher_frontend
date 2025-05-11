import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  FileText, 
  Download,
  Calendar,
  Check,
  Star,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  MessageCircle,
  Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';

const CandidateDetail = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  
  // State for candidate data
  const [candidate, setCandidate] = useState(null);
  const [candidateCVs, setCandidateCVs] = useState([]);
  const [matchingJobs, setMatchingJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showContactModal, setShowContactModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [messageForm, setMessageForm] = useState({ subject: '', message: '' });
  const [interviewForm, setInterviewForm] = useState({
    jobId: '',
    date: '',
    time: '',
    duration: 60,
    type: 'video',
    location: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get candidate data
  useEffect(() => {
    const fetchCandidateData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be API calls
        // const candidateResponse = await api.get(`/employers/candidates/${candidateId}`);
        // const cvsResponse = await api.get(`/employers/candidates/${candidateId}/cvs`);
        // const matchingResponse = await api.get(`/employers/candidates/${candidateId}/matching-jobs`);
        
        // Mock data for development
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockCandidate = {
          id: candidateId,
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          website: 'https://johnsmith.dev',
          about: 'Experienced frontend developer with a passion for creating intuitive and performant user interfaces. Proficient in React, JavaScript, and modern CSS frameworks.',
          skills: ['JavaScript', 'React', 'TypeScript', 'HTML', 'CSS', 'Node.js', 'GraphQL', 'Redux', 'Tailwind CSS', 'Git'],
          experience: [
            {
              id: 1,
              title: 'Senior Frontend Developer',
              company: 'Tech Solutions Inc.',
              location: 'San Francisco, CA',
              startDate: '2021-01',
              endDate: null,
              current: true,
              description: 'Leading frontend development for multiple client projects. Implementing modern React applications with TypeScript and GraphQL.'
            },
            {
              id: 2,
              title: 'Frontend Developer',
              company: 'Digital Agency',
              location: 'Portland, OR',
              startDate: '2018-06',
              endDate: '2020-12',
              current: false,
              description: 'Developed responsive web applications for various clients. Collaborated closely with designers and backend developers.'
            }
          ],
          education: [
            {
              id: 1,
              degree: 'Bachelor of Science in Computer Science',
              institution: 'University of California, Berkeley',
              location: 'Berkeley, CA',
              startDate: '2014-09',
              endDate: '2018-05',
              description: 'Graduated with honors. Focused on web development and user interface design.'
            }
          ],
          languages: [
            { language: 'English', proficiency: 'Native' },
            { language: 'Spanish', proficiency: 'Intermediate' }
          ],
          links: [
            { title: 'GitHub', url: 'https://github.com/johnsmith' },
            { title: 'LinkedIn', url: 'https://linkedin.com/in/johnsmith' },
            { title: 'Portfolio', url: 'https://johnsmith.dev' }
          ],
          lastActive: '2023-05-10T14:30:00Z',
          profileCompleteness: 85
        };
        
        const mockCVs = [
          {
            id: 1,
            filename: 'John_Smith_Resume_2023.pdf',
            fileType: 'application/pdf',
            uploadedAt: '2023-04-15T10:30:00Z',
            isPrimary: true,
            matchScore: 92
          },
          {
            id: 2,
            filename: 'JS_Tech_Resume.docx',
            fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            uploadedAt: '2023-03-10T14:20:00Z',
            isPrimary: false,
            matchScore: 85
          }
        ];
        
        const mockMatchingJobs = [
          {
            id: 1,
            title: 'Senior Frontend Developer',
            company: 'Your Company',
            location: 'Remote',
            matchScore: 95,
            status: 'open',
            postedDate: '2023-05-01T10:00:00Z'
          },
          {
            id: 2,
            title: 'Frontend Team Lead',
            company: 'Your Company',
            location: 'San Francisco, CA',
            matchScore: 88,
            status: 'open',
            postedDate: '2023-04-15T10:00:00Z'
          },
          {
            id: 3,
            title: 'Full Stack Developer',
            company: 'Your Company',
            location: 'New York, NY',
            matchScore: 82,
            status: 'open',
            postedDate: '2023-04-10T10:00:00Z'
          }
        ];
        
        setCandidate(mockCandidate);
        setCandidateCVs(mockCVs);
        setMatchingJobs(mockMatchingJobs);
      } catch (error) {
        console.error('Error fetching candidate data:', error);
        setError('Failed to load candidate data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCandidateData();
  }, [candidateId]);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format date range
  const formatDateRange = (startDate, endDate, current = false) => {
    if (!startDate) return '';
    
    const start = formatDate(startDate);
    
    if (current) {
      return `${start} - Present`;
    }
    
    return endDate ? `${start} - ${formatDate(endDate)}` : start;
  };
  
  // Get time since last active
  const getTimeSinceLastActive = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const lastActive = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - lastActive);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    }
  };
  
  // Handle contact form submission
  const handleContact = async (e) => {
    e.preventDefault();
    
    if (!messageForm.subject.trim() || !messageForm.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      // await api.post(`/employers/candidates/${candidateId}/contact`, messageForm);
      
      // Mock success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Message sent successfully');
      setMessageForm({ subject: '', message: '' });
      setShowContactModal(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle interview scheduling
  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    
    if (!interviewForm.jobId || !interviewForm.date || !interviewForm.time) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      // await api.post(`/employers/candidates/${candidateId}/schedule-interview`, interviewForm);
      
      // Mock success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Interview scheduled successfully');
      setInterviewForm({
        jobId: '',
        date: '',
        time: '',
        duration: 60,
        type: 'video',
        location: '',
        notes: ''
      });
      setShowScheduleModal(false);
    } catch (error) {
      console.error('Error scheduling interview:', error);
      toast.error('Failed to schedule interview. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle downloading CV
  const handleDownloadCV = async (cv) => {
    try {
      // In a real app, this would be an API call
      // const response = await api.get(`/employers/candidates/${candidateId}/cvs/${cv.id}/download`, {
      //   responseType: 'blob'
      // });
      
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', cv.filename);
      // document.body.appendChild(link);
      // link.click();
      
      toast.success(`Downloading ${cv.filename}`);
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast.error('Failed to download CV. Please try again.');
    }
  };
  
  if (isLoading) {
    return <Loader />;
  }
  
  if (error) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to candidates
        </button>
        
        <ErrorMessage message={error} />
      </div>
    );
  }
  
  if (!candidate) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to candidates
        </button>
        
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Candidate not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The candidate you're looking for doesn't exist or you don't have permission to view it.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Back button and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to candidates
        </button>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowContactModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Mail className="mr-2 h-4 w-4" />
            Contact
          </button>
          
          <button
            onClick={() => setShowScheduleModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Interview
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Overview */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Profile Overview</h2>
            </div>
            
            <div className="px-6 py-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-semibold">
                  {candidate.name.charAt(0)}
                </div>
                <div className="ml-6">
                  <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
                  <div className="mt-1 flex items-center">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="ml-1.5 text-sm text-gray-500">
                      Last active {getTimeSinceLastActive(candidate.lastActive)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <a href={`mailto:${candidate.email}`} className="ml-3 text-sm text-blue-600 hover:text-blue-500">
                        {candidate.email}
                      </a>
                    </div>
                    {candidate.phone && (
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <a href={`tel:${candidate.phone}`} className="ml-3 text-sm text-blue-600 hover:text-blue-500">
                          {candidate.phone}
                        </a>
                      </div>
                    )}
                    {candidate.location && (
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span className="ml-3 text-sm text-gray-600">{candidate.location}</span>
                      </div>
                    )}
                    {candidate.website && (
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 text-gray-400" />
                        <a 
                          href={candidate.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="ml-3 text-sm text-blue-600 hover:text-blue-500"
                        >
                          {candidate.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Professional Links</h3>
                  <div className="mt-3 space-y-3">
                    {candidate.links && candidate.links.map((link, index) => (
                      <div key={index} className="flex items-center">
                        <Globe className="h-5 w-5 text-gray-400" />
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="ml-3 text-sm text-blue-600 hover:text-blue-500"
                        >
                          {link.title}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {candidate.about && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500">About</h3>
                  <p className="mt-2 text-sm text-gray-600">{candidate.about}</p>
                </div>
              )}
              
              {candidate.skills && candidate.skills.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500">Skills</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Work Experience */}
          {candidate.experience && candidate.experience.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Work Experience</h2>
              </div>
              
              <div className="px-6 py-5 space-y-8">
                {candidate.experience.map((job) => (
                  <div key={job.id} className="relative">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-500">
                          {job.company} • {job.location}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 ml-14">
                      <p className="text-sm text-gray-600">
                        {formatDateRange(job.startDate, job.endDate, job.current)}
                      </p>
                      <p className="mt-2 text-sm text-gray-600">{job.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Education */}
          {candidate.education && candidate.education.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Education</h2>
              </div>
              
              <div className="px-6 py-5 space-y-8">
                {candidate.education.map((edu) => (
                  <div key={edu.id} className="relative">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{edu.degree}</h3>
                        <p className="text-sm text-gray-500">
                          {edu.institution} • {edu.location}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 ml-14">
                      <p className="text-sm text-gray-600">
                        {formatDateRange(edu.startDate, edu.endDate)}
                      </p>
                      <p className="mt-2 text-sm text-gray-600">{edu.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Languages */}
          {candidate.languages && candidate.languages.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Languages</h2>
              </div>
              
              <div className="px-6 py-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {candidate.languages.map((lang, index) => (
                    <div key={index} className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{lang.language}</div>
                      <div className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        {lang.proficiency}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Match Score */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Profile Metrics</h2>
            </div>
            
            <div className="px-6 py-5">
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-700">Profile Completeness</div>
                    <div className="text-sm font-medium text-gray-700">{candidate.profileCompleteness}%</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${candidate.profileCompleteness}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* CVs */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Resumes & CVs</h2>
            </div>
            
            <div className="px-6 py-5">
              {candidateCVs.length > 0 ? (
                <div className="space-y-4">
                  {candidateCVs.map((cv) => (
                    <div key={cv.id} className="border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <FileText className={`h-5 w-5 ${
                            cv.fileType?.includes('pdf') ? 'text-red-500' : 'text-blue-500'
                          }`} />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{cv.filename}</div>
                            <div className="mt-1 text-xs text-gray-500">
                              Uploaded on {formatDate(cv.uploadedAt)}
                              {cv.isPrimary && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  <Star className="mr-1 h-3 w-3" />
                                  Primary
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <div className="text-sm font-medium text-gray-900">{cv.matchScore}%</div>
                          <div className="text-xs text-gray-500">Match Score</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleDownloadCV(cv)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Download className="mr-1.5 h-4 w-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <FileText className="mx-auto h-8 w-8 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No CVs available</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    This candidate hasn't uploaded any CVs yet.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Matching Jobs */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Matching Jobs</h2>
            </div>
            
            <div className="px-6 py-5">
              {matchingJobs.length > 0 ? (
                <div className="space-y-4">
                  {matchingJobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{job.title}</h3>
                          <p className="mt-1 text-xs text-gray-500">{job.location}</p>
                          <p className="mt-1 text-xs text-gray-500">Posted on {formatDate(job.postedDate)}</p>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <div className="text-sm font-medium text-gray-900">{job.matchScore}%</div>
                          <div className="text-xs text-gray-500">Match Score</div>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex justify-end">
                        <Link
                          to={`/employer/jobs/${job.id}`}
                          className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-500"
                        >
                          View Job
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Briefcase className="mx-auto h-8 w-8 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No matching jobs</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    This candidate doesn't match any of your current openings.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Modal */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Contact Candidate"
        size="md"
      >
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-semibold">
                {candidate.name.charAt(0)}
              </div>
              <div className="ml-3">
                <h3 className="text-md font-medium text-gray-900">{candidate.name}</h3>
                <p className="text-sm text-gray-500">{candidate.email}</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleContact}>
            <div className="space-y-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={messageForm.subject}
                  onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={messageForm.message}
                  onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                ></textarea>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
      
      {/* Schedule Interview Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Schedule Interview"
        size="md"
      >
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-semibold">
                {candidate.name.charAt(0)}
              </div>
              <div className="ml-3">
                <h3 className="text-md font-medium text-gray-900">{candidate.name}</h3>
                <p className="text-sm text-gray-500">{candidate.email}</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleScheduleInterview}>
            <div className="space-y-4">
              <div>
                <label htmlFor="jobId" className="block text-sm font-medium text-gray-700">
                  Job Position *
                </label>
                <select
                  id="jobId"
                  name="jobId"
                  value={interviewForm.jobId}
                  onChange={(e) => setInterviewForm({ ...interviewForm, jobId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Select a job</option>
                  {matchingJobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} - {job.matchScore}% match
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={interviewForm.date}
                    onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                    Time *
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={interviewForm.time}
                    onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Duration (minutes)
                  </label>
                  <select
                    id="duration"
                    name="duration"
                    value={interviewForm.duration}
                    onChange={(e) => setInterviewForm({ ...interviewForm, duration: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                    <option value="120">120 minutes</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Interview Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={interviewForm.type}
                    onChange={(e) => setInterviewForm({ ...interviewForm, type: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="video">Video Call</option>
                    <option value="phone">Phone Call</option>
                    <option value="onsite">On-site</option>
                  </select>
                </div>
              </div>
              
              {interviewForm.type === 'onsite' && (
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={interviewForm.location}
                    onChange={(e) => setInterviewForm({ ...interviewForm, location: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter address or meeting room"
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes for Candidate
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={interviewForm.notes}
                  onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Additional information or instructions..."
                ></textarea>
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
                {isSubmitting ? 'Scheduling...' : 'Schedule Interview'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CandidateDetail;