import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, Users, Calendar, Clock, Plus, BarChart2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    activeJobs: [],
    recentApplications: [],
    stats: { totalJobs: 0, totalApplications: 0, activeJobs: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Mock data for development
        setTimeout(() => {
          setDashboardData({
            activeJobs: [
              { id: 1, title: 'Frontend Developer', location: 'Remote', applicationsCount: 12, createdAt: '2023-05-01', applicationDeadline: '2023-06-01' },
              { id: 2, title: 'UX Designer', location: 'New York', applicationsCount: 8, createdAt: '2023-05-05', applicationDeadline: '2023-06-15' },
            ],
            recentApplications: [
              { id: 1, candidateName: 'John Doe', jobTitle: 'Frontend Developer', jobId: 1, appliedDate: '2023-05-10' },
              { id: 2, candidateName: 'Jane Smith', jobTitle: 'UX Designer', jobId: 2, appliedDate: '2023-05-12' },
            ],
            stats: {
              totalJobs: 5,
              totalApplications: 25,
              activeJobs: 2
            }
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
        toast.error('Error loading dashboard data');
      }
    };
    
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white">Welcome, Employer!</h1>
            <p className="text-blue-100">Here's an overview of your recruitment activity</p>
          </div>
          <div className="flex space-x-3">
            <Link to="/employer/jobs/create" className="btn-light">
              <Plus className="mr-2 h-4 w-4" />
              Post New Job
            </Link>
            <Link to="/employer/candidates" className="btn-dark">
              <Users className="mr-2 h-4 w-4" />
              Browse Candidates
            </Link>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Briefcase, label: 'Active Jobs', value: dashboardData.stats.activeJobs, color: 'blue' },
          { icon: Users, label: 'Total Applications', value: dashboardData.stats.totalApplications, color: 'green' },
          { icon: Briefcase, label: 'Total Jobs', value: dashboardData.stats.totalJobs, color: 'purple' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md bg-${stat.color}-100 p-3 text-${stat.color}-600`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">{stat.label}</h2>
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Active Jobs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Active Job Postings</h2>
          <Link to="/employer/jobs" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all jobs
          </Link>
        </div>
        
        <div className="divide-y divide-gray-200">
          {dashboardData.activeJobs.length > 0 ? (
            dashboardData.activeJobs.map((job) => (
              <div key={job.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">{job.title}</h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span>{job.location}</span>
                      <span className="mx-2">•</span>
                      <span>{job.applicationsCount} applicants</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="badge badge-success">Active</span>
                    <span className="mt-1 text-xs text-gray-500">Posted on {formatDate(job.createdAt)}</span>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-between items-center">
                  {job.applicationDeadline && (
                    <div className="text-xs bg-yellow-50 text-yellow-800 px-2 py-1 rounded flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Closes on {formatDate(job.applicationDeadline)}
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <Link to={`/employer/jobs/${job.id}/matching`} className="link">
                      View Candidates
                    </Link>
                    <Link to={`/employer/jobs/${job.id}`} className="link link-muted">
                      View Job
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-10 text-center">
              <Briefcase className="h-8 w-8 text-gray-400 mx-auto" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No active jobs</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by posting your first job.
              </p>
              <div className="mt-6">
                <Link to="/employer/jobs/create" className="btn-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Post New Job
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Applications */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {dashboardData.recentApplications.length > 0 ? (
            dashboardData.recentApplications.map((application) => (
              <div key={application.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">{application.candidateName}</h3>
                    <div className="mt-1 text-sm text-gray-500">Applied for {application.jobTitle}</div>
                    <div className="mt-1 text-xs text-gray-500">{formatDate(application.appliedDate)}</div>
                  </div>
                  <Link to={`/employer/jobs/${application.jobId}/matching`} className="link">
                    View Application
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <Users className="h-8 w-8 text-gray-400 mx-auto" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recent applications</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any recent applications.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Plus, text: 'Post Job', link: '/employer/jobs/create' },
            { icon: Users, text: 'Search Candidates', link: '/employer/candidates' },
            { icon: BarChart2, text: 'View Analytics', link: '/employer/jobs' }
          ].map((action, i) => (
            <Link
              key={i}
              to={action.link}
              className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <action.icon className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">{action.text}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;