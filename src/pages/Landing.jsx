import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, BarChart2, FileText, Search, Building } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const Landing = () => {
  const features = [
    {
      title: 'Intelligent CV Matching',
      description: 'Our AI-powered matching engine analyzes CVs and job descriptions to find the perfect matches, saving you time and ensuring better hiring decisions.',
      icon: <BarChart2 className="h-8 w-8 text-blue-500" />,
    },
    {
      title: 'Comprehensive CV Analysis',
      description: 'Gain deep insights into candidate skills, experience, and cultural fit with advanced natural language processing and candidate scoring.',
      icon: <FileText className="h-8 w-8 text-blue-500" />,
    },
    {
      title: 'Streamlined Hiring Process',
      description: 'From job posting to interview scheduling, manage the entire recruitment workflow in one integrated platform.',
      icon: <Briefcase className="h-8 w-8 text-blue-500" />,
    },
    {
      title: 'Data-Driven Decisions',
      description: 'Make informed hiring decisions with detailed analytics and reporting on your recruitment funnel and candidate quality.',
      icon: <Users className="h-8 w-8 text-blue-500" />,
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Find the Perfect Match</h1>
            <p className="text-xl text-blue-100 mb-8">Intelligent CV matching for modern hiring teams and job seekers</p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link to="/candidate-login" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50">
                <Search className="mr-2 h-5 w-5" />
                I'm looking for a job
              </Link>
              <Link to="/employer-login" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                <Building className="mr-2 h-5 w-5" />
                I'm hiring
              </Link>
            </div>
          </div>
        </div>
        
        {/* Features section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Platform Features</h2>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* User type section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Choose Your Path</h2>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Job Seekers */}
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="h-16 w-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-medium text-center text-gray-900 mb-4">Job Seekers</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Create your professional profile</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Upload your CV for intelligent matching</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Apply to matching job opportunities</span>
                  </li>
                </ul>
                <div className="flex flex-col space-y-2">
                  <Link to="/candidate-login" className="inline-flex justify-center items-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    Sign In
                  </Link>
                  <Link to="/candidate-register" className="inline-flex justify-center items-center px-5 py-2 border border-gray-300 text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50">
                    Create Account
                  </Link>
                </div>
          </div>
          
              {/* Employers */}
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="h-16 w-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <Building className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-medium text-center text-gray-900 mb-4">Employers</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Post jobs with detailed requirements</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Find candidates with matching skills</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Streamline your hiring process</span>
                  </li>
                </ul>
                <div className="flex flex-col space-y-2">
                  <Link to="/employer-login" className="inline-flex justify-center items-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                    Sign In
                  </Link>
                  <Link to="/employer-register" className="inline-flex justify-center items-center px-5 py-2 border border-gray-300 text-base font-medium rounded-md text-green-700 bg-white hover:bg-gray-50">
                    Create Account
            </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;