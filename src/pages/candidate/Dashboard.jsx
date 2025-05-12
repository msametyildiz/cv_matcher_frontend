import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, FileText, Calendar, ChevronRight, Clock, 
  CheckCircle, XCircle, AlertCircle, BarChart2, Building
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Mock data for development
        setTimeout(() => {
          setDashboardData({
            stats: {
              totalApplications: 12,
              activeApplications: 8,
              interviews: 3,
              savedJobs: 5
            },
            recentApplications: [
              { 
                id: 1, 
                jobTitle: 'Senior Frontend Developer', 
                company: 'Tech Solutions Inc.', 
                status: 'applied', 
                appliedDate: '2023-05-10' 
              },
              { 
                id: 2, 
                jobTitle: 'UX Designer', 
                company: 'Creative Design Studio', 
                status: 'interview', 
                appliedDate: '2023-05-05' 
              },
              { 
                id: 3, 
                jobTitle: 'Full Stack Developer', 
                company: 'Innovative Systems', 
                status: 'rejected', 
                appliedDate: '2023-04-28' 
              }
            ],
            upcomingInterviews: [
              { 
                id: 1, 
                jobTitle: 'UX Designer', 
                company: 'Creative Design Studio', 
                date: '2023-05-22', 
                time: '10:00 AM',
                type: 'video'
              }
            ],
            recommendedJobs: [
              { 
                id: 101, 
                title: 'Frontend Engineer', 
                company: 'WebTech Solutions', 
                location: 'Remote',
                matchPercentage: 92
              },
              { 
                id: 102, 
                title: 'UI/UX Designer', 
                company: 'Design Masters', 
                location: 'New York, NY',
                matchPercentage: 87
              },
              { 
                id: 103, 
                title: 'JavaScript Developer', 
                company: 'App Innovations', 
                location: 'San Francisco, CA',
                matchPercentage: 84
              }
            ],
            profileCompletion: {
              percentage: 75,
              missingItems: ['Skills', 'Education']
            }
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusIcon = (status) => {
    const icons = {
      applied: <Clock className="h-5 w-5 text-blue-500" />,
      interview: <Calendar className="h-5 w-5 text-purple-500" />,
      offered: <CheckCircle className="h-5 w-5 text-green-500" />,
      rejected: <XCircle className="h-5 w-5 text-red-500" />
    };
    return icons[status] || <AlertCircle className="h-5 w-5 text-gray-500" />;
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: <Briefcase className="h-5 w-5" />, label: 'Applications', value: dashboardData.stats.totalApplications, color: 'blue' },
          { icon: <Clock className="h-5 w-5" />, label: 'Active Applications', value: dashboardData.stats.activeApplications, color: 'green' },
          { icon: <Calendar className="h-5 w-5" />, label: 'Interviews', value: dashboardData.stats.interviews, color: 'purple' },
          { icon: <BarChart2 className="h-5 w-5" />, label: 'Saved Jobs', value: dashboardData.stats.savedJobs, color: 'yellow' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className={`p-2 rounded-full bg-${stat.color}-100 text-${stat.color}-600 mr-3`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-lg font-semibold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
            <Link to="/candidate/applications" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View all
            </Link>
          </div>
          
          <div className="divide-y divide-gray-200">
            {dashboardData.recentApplications.length > 0 ? (
              dashboardData.recentApplications.map((application) => (
                <div key={application.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatusIcon(application.status)}
                      <div className="ml-3">
                        <h3 className="text-base font-medium text-gray-900">{application.jobTitle}</h3>
                        <p className="text-sm text-gray-500">{application.company}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span 
                        className={`px-2 py-1 text-xs rounded-full font-medium 
                          ${application.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                            application.status === 'interview' ? 'bg-purple-100 text-purple-800' :
                            application.status === 'offered' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}
                      >
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                      <span className="mt-1 text-xs text-gray-500">Applied on {formatDate(application.appliedDate)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex justify-end">
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
                <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by applying to jobs that match your profile.
                </p>
                <div className="mt-6">
                  <Link
                    to="/candidate/jobs"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Browse Jobs
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Interviews */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Upcoming Interviews</h2>
            </div>
            
            <div className="p-6">
              {dashboardData.upcomingInterviews.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.upcomingInterviews.map((interview) => (
                    <div key={interview.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{interview.jobTitle}</h3>
                          <p className="text-sm text-gray-600">{interview.company}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {interview.type}
                        </span>
                      </div>
                      <div className="mt-2 text-sm">
                        <div className="flex items-center text-gray-700">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          {formatDate(interview.date)}
                        </div>
                        <div className="flex items-center text-gray-700 mt-1">
                          <Clock className="h-4 w-4 mr-1 text-gray-500" />
                          {interview.time}
                        </div>
                      </div>
                      <div className="mt-3 text-right">
                        <Link 
                          to={`/candidate/interviews/${interview.id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Calendar className="mx-auto h-8 w-8 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming interviews</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You don't have any interviews scheduled.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Profile Completion */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Profile Completion</h2>
            </div>
            
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-grow">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-600 rounded-full" 
                      style={{ width: `${dashboardData.profileCompletion.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4">
                  <span className="text-lg font-medium text-gray-900">
                    {dashboardData.profileCompletion.percentage}%
                  </span>
                </div>
              </div>
              
              {dashboardData.profileCompletion.missingItems.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Complete your profile:</p>
                  <ul className="mt-2 space-y-1">
                    {dashboardData.profileCompletion.missingItems.map((item, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <ChevronRight className="h-4 w-4 text-blue-500 mr-1" />
                        Add {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-4">
                <Link
                  to="/candidate/profile"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Complete Your Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Recommendations */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Job Recommendations</h2>
          <Link to="/candidate/jobs" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Browse all jobs
          </Link>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {dashboardData.recommendedJobs.length > 0 ? (
            dashboardData.recommendedJobs.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900">{job.title}</h3>
                  <span 
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      job.matchPercentage >= 90 ? 'bg-green-100 text-green-800' :
                      job.matchPercentage >= 80 ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {job.matchPercentage}% Match
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{job.company}</p>
                <p className="text-sm text-gray-500">{job.location}</p>
                <div className="mt-4 text-right">
                  <Link 
                    to={`/candidate/jobs/${job.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View job
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recommendations yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Complete your profile to get personalized job recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;