// src/components/layouts/MainLayout.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  User,
  Briefcase,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Search,
  Bell,
  Calendar
} from 'lucide-react';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActiveRoute = (route) => {
    return location.pathname === route;
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleNavigation = (route) => {
    navigate(route);
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };
  
  // Navigation links based on user role
  const getNavLinks = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'candidate':
        return [
          { route: '/candidate/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
          { route: '/candidate/cv', label: 'My CV', icon: <FileText className="w-5 h-5" /> },
          { route: '/candidate/jobs', label: 'Jobs', icon: <Search className="w-5 h-5" /> },
          { route: '/candidate/applications', label: 'Applications', icon: <Briefcase className="w-5 h-5" /> },
          { route: '/candidate/interviews', label: 'Interviews', icon: <Calendar className="w-5 h-5" /> },
          { route: '/candidate/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
          { route: '/candidate/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
        ];
      case 'employer':
        return [
          { route: '/employer/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
          { route: '/employer/jobs', label: 'My Jobs', icon: <Briefcase className="w-5 h-5" /> },
          { route: '/employer/candidates', label: 'Find Candidates', icon: <Search className="w-5 h-5" /> },
          { route: '/employer/interviews', label: 'Interviews', icon: <Calendar className="w-5 h-5" /> },
          { route: '/employer/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
        ];
      case 'admin':
        return [
          { route: '/admin/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
          { route: '/admin/jobs', label: 'Jobs', icon: <Briefcase className="w-5 h-5" /> },
          { route: '/admin/cv', label: 'CVs', icon: <FileText className="w-5 h-5" /> },
          { route: '/admin/users', label: 'Users', icon: <User className="w-5 h-5" /> },
          { route: '/admin/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
        ];
      default:
        return [];
    }
  };
  
  const navLinks = getNavLinks();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and site name */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-blue-600 font-bold text-xl">JobPortal</Link>
              </div>
            </div>

            {/* Main navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              <Link 
                to="/dashboard" 
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActiveRoute('/dashboard') 
                  ? 'text-blue-700 bg-blue-50' 
                  : 'text-gray-900 hover:text-blue-600'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/jobs" 
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActiveRoute('/jobs') 
                  ? 'text-blue-700 bg-blue-50' 
                  : 'text-gray-900 hover:text-blue-600'
                }`}
              >
                Browse Jobs
              </Link>
              <Link 
                to="/applications" 
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActiveRoute('/applications') 
                  ? 'text-blue-700 bg-blue-50' 
                  : 'text-gray-900 hover:text-blue-600'
                }`}
              >
                My Applications
              </Link>
              <Link 
                to="/cv-manager" 
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActiveRoute('/cv-manager') 
                  ? 'text-blue-700 bg-blue-50' 
                  : 'text-gray-900 hover:text-blue-600'
                }`}
              >
                CV Manager
              </Link>
            </nav>

            {/* User menu */}
            <div className="flex items-center space-x-4">
              <button className="btn-light">
                <Bell className="h-4 w-4 mr-1" />
                <span className="sr-only">Notifications</span>
              </button>
              
              <div className="relative">
                <Link to="/profile" className="flex items-center btn-light">
                  <User className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline-block">My Profile</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-grow py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-500 text-sm">&copy; 2023 JobPortal. All rights reserved.</p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">About</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">Terms</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;