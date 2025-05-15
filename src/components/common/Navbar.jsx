import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Building } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
  const [isRegisterMenuOpen, setIsRegisterMenuOpen] = useState(false);
  
  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close login and register dropdowns if open
    if (isLoginMenuOpen) setIsLoginMenuOpen(false);
    if (isRegisterMenuOpen) setIsRegisterMenuOpen(false);
  };
  
  const handleToggleLoginMenu = () => {
    setIsLoginMenuOpen(!isLoginMenuOpen);
    // Close register dropdown if open
    if (isRegisterMenuOpen) setIsRegisterMenuOpen(false);
  };
  
  const handleToggleRegisterMenu = () => {
    setIsRegisterMenuOpen(!isRegisterMenuOpen);
    // Close login dropdown if open
    if (isLoginMenuOpen) setIsLoginMenuOpen(false);
  };
  
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800">CV Matcher</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900">
              About
            </Link>
            <Link to="/contact" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900">
              Contact
            </Link>
          </div>
          
          {/* User authentication section */}
          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={handleToggleLoginMenu}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none flex items-center"
              >
                Log in
                  <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Login dropdown menu */}
                {isLoginMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <Link 
                        to="/candidate-login" 
                        className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                        onClick={() => setIsLoginMenuOpen(false)}
                      >
                        <User className="mr-3 h-5 w-5 text-blue-500" />
                        <div>
                          <span className="block font-medium">Job Seeker</span>
                          <span className="block text-xs text-gray-500">Find jobs & opportunities</span>
                        </div>
              </Link>
              <Link
                        to="/employer-login" 
                        className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                        onClick={() => setIsLoginMenuOpen(false)}
                      >
                        <Building className="mr-3 h-5 w-5 text-green-500" />
                        <div>
                          <span className="block font-medium">Employer</span>
                          <span className="block text-xs text-gray-500">Post jobs & hire talent</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <button
                  onClick={handleToggleRegisterMenu}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none flex items-center"
              >
                Sign up
                  <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Register dropdown menu */}
                {isRegisterMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <Link 
                        to="/candidate-register" 
                        className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                        onClick={() => setIsRegisterMenuOpen(false)}
                      >
                        <User className="mr-3 h-5 w-5 text-blue-500" />
                        <div>
                          <span className="block font-medium">Job Seeker</span>
                          <span className="block text-xs text-gray-500">Create a personal account</span>
                        </div>
                      </Link>
                      <Link 
                        to="/employer-register" 
                        className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                        onClick={() => setIsRegisterMenuOpen(false)}
                      >
                        <Building className="mr-3 h-5 w-5 text-green-500" />
                        <div>
                          <span className="block font-medium">Employer</span>
                          <span className="block text-xs text-gray-500">Create a company account</span>
                        </div>
              </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={handleToggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">{isMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            <p className="px-4 py-2 text-base font-medium text-gray-700">Log in as:</p>
            <div className="flex flex-col space-y-2 mt-2 px-4">
              <Link
                to="/candidate-login"
                className="flex items-center px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="mr-2 h-5 w-5" />
                Job Seeker
              </Link>
              <Link
                to="/employer-login"
                className="flex items-center px-4 py-2 text-base font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <Building className="mr-2 h-5 w-5" />
                Employer
              </Link>
            </div>
            
            <p className="px-4 py-2 mt-4 text-base font-medium text-gray-700">Sign up as:</p>
            <div className="flex flex-col space-y-2 mt-2 px-4 pb-2">
              <Link
                to="/candidate-register"
                className="flex items-center px-4 py-2 text-base font-medium border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="mr-2 h-5 w-5" />
                Job Seeker
              </Link>
              <Link
                to="/employer-register"
                className="flex items-center px-4 py-2 text-base font-medium border border-green-600 text-green-600 rounded-md hover:bg-green-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <Building className="mr-2 h-5 w-5" />
                Employer
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;