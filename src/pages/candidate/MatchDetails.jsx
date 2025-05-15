import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, FileText, AlertCircle, Download, Share } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import MatchScoreCard from '../../components/matching/MatchScoreCard';
import api from '../../api';
import { calculateMatchScore, getMatchingReport } from '../../utils/matchingAlgorithm';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const MatchDetails = () => {
  const { jobId, cvId } = useParams();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [job, setJob] = useState(null);
  const [cv, setCv] = useState(null);
  const [matchData, setMatchData] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real application, these would be actual API calls
        // For now, we'll use mock data and simulate API delay
        
        // Fetch job details
        // const jobResponse = await api.job.getJobById(jobId);
        // const cvResponse = await api.cv.getCvById(cvId);
        // const matchResponse = await api.matching.getDetailedMatchingResult(cvId, jobId);
        
        // Mock data for development
        setTimeout(() => {
          const mockJob = {
            id: parseInt(jobId),
            title: 'Senior Full Stack Developer',
            company: 'Tech Innovations Inc.',
            location: 'Istanbul, Turkey',
            description: 'Join our dynamic team as a Senior Full Stack Developer...',
            requirements: [
              '5+ years of experience in full stack development',
              'Expert knowledge of JavaScript/TypeScript, React, and Node.js',
              'Experience with database design and ORM frameworks',
              'Bachelor\'s degree in Computer Science or related field'
            ],
            skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'MongoDB', 'AWS'],
            salaryRange: '₺30,000 - ₺45,000',
            employmentType: 'Full-time',
            postedDate: '2023-05-01'
          };
          
          const mockCV = {
            id: parseInt(cvId),
            filename: 'Professional_Resume_2023.pdf',
            uploadDate: '2023-04-15',
            fileSize: '364 KB',
            fileType: 'application/pdf',
            parsedData: {
              skills: ['React', 'JavaScript', 'Node.js', 'Express', 'MongoDB', 'HTML', 'CSS'],
              education: [
                { degree: 'Bachelor of Science in Computer Science', institution: 'Istanbul Technical University', year: '2020' }
              ],
              experience: [
                { role: 'Frontend Developer', company: 'Tech Solutions Inc.', period: 'Jan 2021 - Present' },
                { role: 'Web Developer Intern', company: 'Digital Agency', period: 'Jun 2020 - Dec 2020' }
              ]
            }
          };
          
          setJob(mockJob);
          setCv(mockCV);
          
          // Calculate match score based on our algorithm
          const calculatedMatchData = getMatchingReport(mockCV, mockJob);
          calculatedMatchData.jobId = jobId;
          calculatedMatchData.cvId = cvId;
          
          setMatchData(calculatedMatchData);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching match details:', err);
        setError('Failed to load match details. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [jobId, cvId]);
  
  const handleShareReport = () => {
    // In a real app, this would generate a shareable link
    // For now, just copy the current URL
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };
  
  const handleDownloadReport = () => {
    // In a real app, this would generate a PDF report
    alert('Report download feature will be implemented soon!');
  };
  
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-4">
        <Link
          to={`/candidate/jobs/${jobId}`}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Job Details
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Match Analysis</h1>
      <p className="text-gray-600 mb-6">
        Detailed analysis of how your CV matches this job position's requirements.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - Match details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">
                Match Details
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Analysis between your CV and the job requirements
              </p>
            </div>
            
            <div className="px-4 py-5 sm:p-6">
              {/* Job and CV summary */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 pb-6 border-b border-gray-200">
                <div className="mb-4 sm:mb-0">
                  <div className="flex items-center text-lg font-medium text-gray-900 mb-1">
                    <Briefcase className="mr-2 h-5 w-5 text-gray-500" />
                    {job.title}
                  </div>
                  <div className="text-sm text-gray-500">{job.company} • {job.location}</div>
                </div>
                <div>
                  <div className="flex items-center text-sm font-medium text-gray-900 mb-1">
                    <FileText className="mr-2 h-5 w-5 text-gray-500" />
                    {cv.filename}
                  </div>
                  <div className="text-xs text-gray-500">Uploaded on {new Date(cv.uploadDate).toLocaleDateString()}</div>
                </div>
              </div>
              
              {/* Match score card */}
              <MatchScoreCard matchData={matchData} showDetailed={true} />
              
              {/* Actions */}
              <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
                <button
                  onClick={handleDownloadReport}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </button>
                <button
                  onClick={handleShareReport}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Share className="mr-2 h-4 w-4" />
                  Share Report
                </button>
              </div>
            </div>
          </div>
          
          {/* Improvement Tips */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">
                How to Improve Your Match
              </h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4">
                {matchData.recommendations && matchData.recommendations.length > 0 ? (
                  matchData.recommendations.map((rec, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex">
                        <AlertCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-700">{rec.text}</p>
                          {rec.category === 'skills' && (
                            <p className="mt-2 text-sm font-medium text-blue-700">
                              Consider adding these skills to your profile or highlighting them if you already have them.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-700">
                          Great job! Your profile is a strong match for this position. Keep your CV updated with your latest skills and experiences.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 text-sm mb-2">General Tips:</h3>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>Tailor your CV for each application</li>
                    <li>Use keywords from the job description</li>
                    <li>Quantify your achievements where possible</li>
                    <li>Keep your skills section updated</li>
                    <li>Include relevant projects or portfolio items</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar - Job Requirements */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">
                Job Requirements
              </h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ul className="divide-y divide-gray-200">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="py-3">
                    <div className="flex items-start">
                      <div className="mr-2 mt-0.5">
                        <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-700">{requirement}</p>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Required Skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => {
                    const isMatched = matchData.skillsMatch.matched.includes(skill);
                    return (
                      <span 
                        key={index} 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isMatched ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to={`/candidate/jobs/${jobId}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full justify-center"
                >
                  Apply for This Job
                </Link>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">
                Application Tips
              </h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4 text-sm text-gray-600">
                <p>Based on your match score, here are some tips for your application:</p>
                <ul className="list-disc pl-5 space-y-2">
                  {matchData.overallScore >= 85 ? (
                    <>
                      <li>Highlight your strong skills match in your cover letter</li>
                      <li>Emphasize specific projects that showcase your expertise</li>
                      <li>Prepare for technical interviews related to your matching skills</li>
                    </>
                  ) : matchData.overallScore >= 70 ? (
                    <>
                      <li>Address how you can quickly learn any missing skills</li>
                      <li>Highlight transferable skills and relevant experience</li>
                      <li>Consider attaching a customized cover letter</li>
                    </>
                  ) : (
                    <>
                      <li>Focus on transferable skills and your ability to learn</li>
                      <li>Consider if you have projects that demonstrate relevant capabilities</li>
                      <li>Explain your interest in the role despite skill gaps</li>
                    </>
                  )}
                </ul>
                <p className="pt-2 text-xs text-gray-500">
                  Our matching algorithm considers many factors, but hiring managers may have different priorities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails; 