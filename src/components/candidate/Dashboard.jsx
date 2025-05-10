import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, Clock, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    applications: [],
    jobRecommendations: [],
    cvs: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // For now, we'll use mock data
        setDashboardData({
          applications: [
            { id: 1, jobTitle: 'Software Engineer', company: 'Tech Corp', status: 'applied', appliedDate: '2023-05-01' },
            { id: 2, jobTitle: 'UX Designer', company: 'Design Studios', status: 'interview', appliedDate: '2023-05-05' },
          ],
          jobRecommendations: [
            { id: 1, title: 'Frontend Developer', company: 'Web Solutions', matchPercentage: 85 },
            { id: 2, title: 'JavaScript Developer', company: 'App Inc', matchPercentage: 78 },
          ],
          cvs: [
            { id: 1, filename: 'My_Resume.pdf', uploadDate: '2023-04-15', isPrimary: true },
          ]
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // In a real application, you would fetch this data from your API
        // For now, we'll use mock data
        setDashboardData({
          applications: [
            { id: 1, jobTitle: 'Software Engineer', company: 'Tech Corp', status: 'applied', appliedDate: '2023-05-01' },
            { id: 2, jobTitle: 'UX Designer', company: 'Design Studios', status: 'interview', appliedDate: '2023-05-05' },
          ],
          jobRecommendations: [
            { id: 1, title: 'Frontend Developer', company: 'Web Solutions', matchPercentage: 85 },
            { id: 2, title: 'JavaScript Developer', company: 'App Inc', matchPercentage: 78 },
          ],
          cvs: [
            { id: 1, filename: 'My_Resume.pdf', uploadDate: '2023-04-15', isPrimary: true },
          ]
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (isLoading) {
    return <Loader />;
  }
  
  if (error) {
    return <ErrorMessage message={error} />;
  }
  
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-white">Welcome, {user?.name || 'Candidate'}!</h1>
              <p className="text-blue-100">Here's your job search overview</p>
            </div>
            <div className="flex space-x-3">
              <Link 
                to="/candidate/cv/upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FileText className="mr-2 h-4 w-4" />
                Upload CV
              </Link>
              <Link 
                to="/candidate/jobs"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
            <Link to="/candidate/applications" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View all
            </Link>
          </div>
          
          <div className="divide-y divide-gray-200">
            {dashboardData.applications.length > 0 ? (
              dashboardData.applications.map((application) => (
                <div key={application.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-base font-medium text-gray-900">{application.jobTitle}</h3>
                      <div className="mt-1 text-sm text-gray-500">{application.company}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        application.status === 'applied' ? 'bg-blue-100 text-blue-800' : 
                        application.status === 'interview' ? 'bg-purple-100 text-purple-800' : 
                        application.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                      <span className="mt-1 text-xs text-gray-500">Applied on {formatDate(application.appliedDate)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <Link 
                      to={`/candidate/applications/${application.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-10 text-center">
                <Briefcase className="h-8 w-8 text-gray-400 mx-auto" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start applying to jobs to track your applications.
                </p>
                <div className="mt-6">
                  <Link
                    to="/candidate/jobs"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Browse Jobs
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Your CVs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Your CVs</h2>
            <Link to="/candidate/cv" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Manage
            </Link>
          </div>
          
          <div className="divide-y divide-gray-200">
            {dashboardData.cvs.length > 0 ? (
              dashboardData.cvs.map((cv) => (
                <div key={cv.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{cv.filename}</div>
                        <div className="text-xs text-gray-500">Uploaded on {formatDate(cv.uploadDate)}</div>
                      </div>
                    </div>
                    {cv.isPrimary && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Primary
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <Link 
                      to={`/candidate/cv/${cv.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-10 text-center">
                <FileText className="h-8 w-8 text-gray-400 mx-auto" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No CVs uploaded</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Upload your CV to start applying for jobs.
                </p>
                <div className="mt-6">
                  <Link
                    to="/candidate/cv/upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Upload CV
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Job Recommendations */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Recommended Jobs</h2>
          <Link to="/candidate/jobs" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all jobs
          </Link>
        </div>
        
        {dashboardData.jobRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {dashboardData.jobRecommendations.map((job) => (
              <div key={job.id} className="border rounded-lg hover:shadow-md">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium text-gray-900">{job.title}</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {job.matchPercentage}% Match
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">{job.company}</div>
                  
                  <div className="mt-4 flex justify-between">
                    <Link
                      to={`/candidate/jobs/${job.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      View details
                    </Link>
                    <Link
                      to={`/candidate/jobs/${job.id}/apply`}
                      className="text-sm font-medium text-green-600 hover:text-green-500"
                    >
                      Apply
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-10 text-center">
            <Briefcase className="h-8 w-8 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No job recommendations yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload your CV to get personalized job recommendations.
            </p>
            <div className="mt-6">
              <Link
                to="/candidate/cv/upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="mr-2 h-4 w-4" />
                Upload CV
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;