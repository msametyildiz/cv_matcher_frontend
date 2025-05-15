import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, UserPlus, Share2, FileText, Info } from 'lucide-react';
import api from '../../api';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import CandidateMatchList from '../../components/employer/CandidateMatchList';

const JobMatching = () => {
  const { jobId } = useParams();
  
  // State
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalApplicants: 0,
    averageScore: 0,
    highMatchCount: 0, // Candidates with match score >= 85%
    pendingReview: 0
  });
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, we would fetch from the API
        // const jobResponse = await api.job.getJobById(jobId);
        // const matchesResponse = await api.matching.getMatchingResultsByJobId(jobId);
        
        // For now, we'll use mock data
        setTimeout(() => {
          const mockJob = {
            id: parseInt(jobId),
            title: 'Senior Full Stack Developer',
            company: 'Tech Innovations Inc.',
            location: 'Istanbul, Turkey',
            postedDate: '2023-05-01',
            skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'MongoDB', 'AWS']
          };
          
          const mockCandidates = [
            {
              id: 1,
              name: 'Ahmet Yılmaz',
              title: 'Full Stack Developer',
              avatar: null,
              matchScore: 92,
              applicationDate: '2023-05-05',
              status: 'reviewed',
              isStarred: true
            },
            {
              id: 2,
              name: 'Zeynep Kaya',
              title: 'Frontend Developer',
              avatar: null,
              matchScore: 87,
              applicationDate: '2023-05-07',
              status: 'pending',
              isStarred: false
            },
            {
              id: 3,
              name: 'Mehmet Demir',
              title: 'Senior JavaScript Developer',
              avatar: null,
              matchScore: 85,
              applicationDate: '2023-05-10',
              status: 'pending',
              isStarred: false
            },
            {
              id: 4,
              name: 'Ayşe Şahin',
              title: 'Backend Developer',
              avatar: null,
              matchScore: 75,
              applicationDate: '2023-05-12',
              status: 'reviewed',
              isStarred: false
            },
            {
              id: 5,
              name: 'Can Öztürk',
              title: 'Junior Full Stack Developer',
              avatar: null,
              matchScore: 68,
              applicationDate: '2023-05-15',
              status: 'pending',
              isStarred: false
            }
          ];
          
          // Calculate stats
          const totalApplicants = mockCandidates.length;
          const totalScore = mockCandidates.reduce((sum, candidate) => sum + candidate.matchScore, 0);
          const averageScore = Math.round(totalScore / totalApplicants);
          const highMatchCount = mockCandidates.filter(c => c.matchScore >= 85).length;
          const pendingReview = mockCandidates.filter(c => c.status === 'pending').length;
          
          setJob(mockJob);
          setCandidates(mockCandidates);
          setStats({
            totalApplicants,
            averageScore,
            highMatchCount,
            pendingReview
          });
          
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching job matches:', err);
        setError('Failed to load job matching data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [jobId]);
  
  const handleInviteCandidates = () => {
    // Implementation for inviting candidates
    alert('Invite candidates feature will be implemented soon!');
  };
  
  const handleShareMatching = () => {
    // In a real app, this would generate a shareable link
    // For now, just copy the current URL
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };
  
  const handleExportResults = () => {
    // Implementation for exporting results to CSV/PDF
    alert('Export results feature will be implemented soon!');
  };
  
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-4">
        <Link
          to={`/employer/jobs/${jobId}`}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Job Details
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title} - Candidate Matching</h1>
      <p className="text-gray-600 mb-6">
        View and evaluate candidates matched to this job posting.
      </p>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Applicants</div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalApplicants}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="text-sm font-medium text-gray-500 mb-1">Average Match Score</div>
          <div className="text-3xl font-bold text-gray-900">{stats.averageScore}%</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="text-sm font-medium text-gray-500 mb-1">High Match Candidates</div>
          <div className="text-3xl font-bold text-green-600">{stats.highMatchCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="text-sm font-medium text-gray-500 mb-1">Pending Review</div>
          <div className="text-3xl font-bold text-yellow-600">{stats.pendingReview}</div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={handleInviteCandidates}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Invite More Candidates
        </button>
        <button
          onClick={handleShareMatching}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </button>
        <button
          onClick={handleExportResults}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FileText className="mr-2 h-4 w-4" />
          Export Results
        </button>
      </div>
      
      {/* Job Summary */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Job Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Matching Algorithm</h3>
            <p className="text-sm text-gray-600">
              Our algorithm matches candidates based on skills, experience, and education to provide you with the most qualified applicants.
            </p>
            <div className="mt-2">
              <Link
                to="/employer/help/matching-algorithm"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                <Info className="mr-1 h-4 w-4" />
                Learn more about our matching algorithm
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Candidates List */}
      {candidates.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="mt-5 text-lg leading-6 font-medium text-gray-900">No Candidates Yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            There are no candidates matched to this job posting yet.
          </p>
          <div className="mt-6">
            <button
              onClick={handleInviteCandidates}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Mail className="mr-2 h-4 w-4" />
              Invite Candidates
            </button>
          </div>
        </div>
      ) : (
        <CandidateMatchList candidates={candidates} jobId={jobId} />
      )}
      
      {/* Additional Information */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Matching Tip</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Review candidates with high match scores first, but don't overlook those with medium scores who may have unique qualifications not captured by the algorithm.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMatching;