import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Globe, FileText, Download,
  Calendar, Clock, Star, ArrowLeft, Briefcase, GraduationCap
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';
import ProfileHeader from '../../components/candidates/ProfileHeader';
import ContactInfo from '../../components/candidates/ContactInfo';
import CandidateCV from '../../components/candidates/CandidateCV';
import ExperienceItem from '../../components/candidates/ExperienceItem';
import MatchingJobItem from '../../components/candidates/MatchingJobItem';
import useCandidateData from '../../hooks/useCandidateData';
import { formatDate, formatDateRange, getTimeSinceLastActive } from '../../utils/dateUtils';

const CandidateDetail = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  
  // Custom hook for fetching candidate data
  const { 
    candidate, 
    candidateCVs,
    matchingJobs,
    isLoading,
    error
  } = useCandidateData(candidateId);
  
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
  
  // Form handlers
  const handleContact = async (e) => {
    e.preventDefault();
    if (!messageForm.subject.trim() || !messageForm.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent successfully');
      setMessageForm({ subject: '', message: '' });
      setShowContactModal(false);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!interviewForm.jobId || !interviewForm.date || !interviewForm.time) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Simulating API call
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
      toast.error('Failed to schedule interview. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDownloadCV = async (cv) => {
    try {
      toast.success(`Downloading ${cv.filename}`);
    } catch (error) {
      toast.error('Failed to download CV. Please try again.');
    }
  };
  
  // Loading and error states
  if (isLoading) return <Loader />;
  
  if (error) {
    return (
      <div className="space-y-4">
        <BackButton onClick={() => navigate(-1)} />
        <ErrorMessage message={error} />
      </div>
    );
  }
  
  if (!candidate) {
    return (
      <div className="space-y-4">
        <BackButton onClick={() => navigate(-1)} />
        <NotFoundMessage />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header with back button and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowContactModal(true)}
            className="btn btn-outline"
          >
            <Mail className="mr-2 h-4 w-4" />
            Contact
          </button>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="btn btn-primary"
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
          <Card title="Profile Overview">
            <ProfileHeader 
              candidate={candidate} 
              lastActive={getTimeSinceLastActive(candidate.lastActive)} 
            />
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <ContactInfo candidate={candidate} />
              
              {candidate.links && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Professional Links</h3>
                  <div className="mt-3 space-y-3">
                    {candidate.links.map((link, index) => (
                      <LinkItem key={index} title={link.title} url={link.url} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {candidate.about && (
              <AboutSection text={candidate.about} />
            )}
            
            {candidate.skills && candidate.skills.length > 0 && (
              <SkillsSection skills={candidate.skills} />
            )}
          </Card>
          
          {/* Work Experience */}
          {candidate.experience && candidate.experience.length > 0 && (
            <Card title="Work Experience">
              <div className="space-y-8">
                {candidate.experience.map((job) => (
                  <ExperienceItem 
                    key={job.id}
                    title={job.title}
                    organization={job.company}
                    location={job.location}
                    dateRange={formatDateRange(job.startDate, job.endDate, job.current)}
                    description={job.description}
                    icon={<Briefcase className="h-5 w-5 text-blue-600" />}
                  />
                ))}
              </div>
            </Card>
          )}
          
          {/* Education */}
          {candidate.education && candidate.education.length > 0 && (
            <Card title="Education">
              <div className="space-y-8">
                {candidate.education.map((edu) => (
                  <ExperienceItem 
                    key={edu.id}
                    title={edu.degree}
                    organization={edu.institution}
                    location={edu.location}
                    dateRange={formatDateRange(edu.startDate, edu.endDate)}
                    description={edu.description}
                    icon={<GraduationCap className="h-5 w-5 text-blue-600" />}
                  />
                ))}
              </div>
            </Card>
          )}
          
          {/* Languages */}
          {candidate.languages && candidate.languages.length > 0 && (
            <Card title="Languages">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {candidate.languages.map((lang, index) => (
                  <LanguageItem key={index} language={lang.language} proficiency={lang.proficiency} />
                ))}
              </div>
            </Card>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Metrics */}
          <Card title="Profile Metrics">
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-700">Profile Completeness</div>
                  <div className="text-sm font-medium text-gray-700">{candidate.profileCompleteness}%</div>
                </div>
                <ProgressBar percentage={candidate.profileCompleteness} />
              </div>
            </div>
          </Card>
          
          {/* CVs */}
          <Card title="Resumes & CVs">
            {candidateCVs.length > 0 ? (
              <div className="space-y-4">
                {candidateCVs.map((cv) => (
                  <CandidateCV 
                    key={cv.id}
                    cv={cv}
                    formatDate={formatDate}
                    onDownload={handleDownloadCV}
                  />
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={<FileText />}
                title="No CVs available"
                description="This candidate hasn't uploaded any CVs yet." 
              />
            )}
          </Card>
          
          {/* Matching Jobs */}
          <Card title="Matching Jobs">
            {matchingJobs.length > 0 ? (
              <div className="space-y-4">
                {matchingJobs.map((job) => (
                  <MatchingJobItem 
                    key={job.id}
                    job={job}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={<Briefcase />}
                title="No matching jobs"
                description="This candidate doesn't match any of your current openings." 
              />
            )}
          </Card>
        </div>
      </div>
      
      {/* Modals */}
      <ContactModal 
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        candidate={candidate}
        formData={messageForm}
        setFormData={setMessageForm}
        onSubmit={handleContact}
        isSubmitting={isSubmitting}
      />
      
      <ScheduleModal 
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        candidate={candidate}
        matchingJobs={matchingJobs}
        formData={interviewForm}
        setFormData={setInterviewForm}
        onSubmit={handleScheduleInterview}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default CandidateDetail;