import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const About = () => {
  return (
    <div className="bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              About CV Matcher
            </h2>
            <p className="mt-3 max-w-3xl text-lg text-gray-500">
              CV Matcher is a cutting-edge recruitment platform that uses advanced AI to match candidates with job opportunities. 
              Our platform helps job seekers find positions that truly match their skills and experience, 
              while helping employers identify the best candidates for their openings.
            </p>
            <div className="mt-8 space-y-4">
              <p className="text-lg text-gray-500">
                Founded in 2023, our mission is to streamline the recruitment process and create better matches 
                between talented individuals and quality employers. We believe that the right match benefits everyone - 
                candidates find fulfilling work, employers find talented team members, and the economy thrives.
              </p>
              <p className="text-lg text-gray-500">
                Our team consists of experts in AI, recruitment, and technology, all working together to 
                create the most effective matching platform possible.
              </p>
            </div>
          </div>
          <div className="mt-8 lg:mt-0">
            <div className="aspect-w-5 aspect-h-3 rounded-lg overflow-hidden">
              <img
                src="/assets/images/about.jpg"
                alt="Team collaborating"
                className="object-cover"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900">Our Values</h3>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900">Innovation</h4>
              <p className="mt-2 text-base text-gray-500">
                We constantly push the boundaries of what's possible in recruitment technology, 
                using the latest advancements in AI and machine learning.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900">Quality</h4>
              <p className="mt-2 text-base text-gray-500">
                We're committed to providing the highest quality matching service, 
                with accurate results and a user-friendly experience.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900">Inclusivity</h4>
              <p className="mt-2 text-base text-gray-500">
                We believe in equal opportunities for all and strive to create a platform 
                that promotes diversity and inclusion in the workplace.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900">Get Started Today</h3>
          <p className="mt-4 text-lg text-gray-500">
            Whether you're looking for your next career opportunity or searching for the perfect candidate, 
            CV Matcher can help you find the right match.
          </p>
          <div className="mt-8 flex">
            <Link
              to="/register"
              className="px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign Up Now
            </Link>
            <Link
              to="/contact"
              className="ml-4 px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;