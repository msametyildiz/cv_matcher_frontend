import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, BarChart2, FileText } from 'lucide-react';
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-center text-gray-900">Find the Perfect Match for Your Team</h1>
          <p className="mt-4 text-xl text-center text-gray-600">Intelligent CV matching for modern hiring teams</p>
          
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/register" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              Get Started
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;