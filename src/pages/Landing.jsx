import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Briefcase, Users, BarChart2, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const Landing = () => {
  const { isAuthenticated, user } = useAuth();
  
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
  
  const stats = [
    { value: '10,000+', label: 'Active Job Seekers' },
    { value: '5,000+', label: 'Companies' },
    { value: '25,000+', label: 'Jobs Matched' },
    { value: '70%', label: 'Faster Hiring Process' },
  ];
  
  const getDashboardLink = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'candidate':
        return '/candidate/dashboard';
      case 'employer':
        return '/employer/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  };
  
  return (
    <div className="bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 py-16 md:py-24 lg:py-32 flex flex-col md:flex-row items-center">
            <div className="text-center md:text-left md:w-1/2 md:pr-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
                <span className="block">Find the perfect</span>
                <span className="block text-blue-600">match with AI</span>
              </h1>
              <p className="mt-6 text-xl text-gray-500 max-w-3xl">
                CV Matcher uses advanced AI to match the right candidates with the right jobs. 
                Whether you're hiring or job hunting, our platform streamlines the process with intelligent matching.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                {isAuthenticated ? (
                  <Link
                    to={getDashboardLink()}
                    className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg"
                    >
                      Get Started
                    </Link>
                    <Link
                      to="/login"
                      className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:text-lg"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="mt-12 md:mt-0 md:w-1/2">
              <img 
                className="w-full h-auto" 
                src="/assets/images/hero.svg" 
                alt="CV Matcher Platform" 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 uppercase tracking-wide">Features</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-5xl">
              Everything you need for smart recruitment
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Our platform combines AI-powered matching with a comprehensive recruitment toolkit to streamline your hiring process.
            </p>
          </div>
          
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
              {features.map((feature, index) => (
                <div key={index} className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                          {feature.icon}
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.title}</h3>
                      <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Statistics Section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Trusted by job seekers and employers worldwide
            </h2>
            <p className="mt-3 text-xl text-blue-200 sm:mt-4">
              Join thousands of companies and candidates who have found their perfect match.
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-4 sm:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-blue-200">
                  {stat.label}
                </dt>
                <dd className="order-1 text-5xl font-extrabold text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      
      {/* Call to Action Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to find your perfect match?</span>
            <span className="block text-blue-600">Start your journey today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 space-x-4">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Get started
              </Link>
            </div>
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Landing;