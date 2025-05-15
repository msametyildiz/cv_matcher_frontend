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
    return location.pathname.startsWith(route);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Navigation links based on user role
  const getNavLinks = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'candidate':
        return [
          { to: '/candidate/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
          { to: '/candidate/jobs', label: 'Find Jobs', icon: <Search className="w-5 h-5" /> },
          { to: '/candidate/applications', label: 'Applications', icon: <Briefcase className="w-5 h-5" /> },
          { to: '/candidate/cv', label: 'My CVs', icon: <FileText className="w-5 h-5" /> },
          { to: '/candidate/interviews', label: 'Interviews', icon: <Calendar className="w-5 h-5" /> },
          { to: '/candidate/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
          { to: '/candidate/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
        ];
      case 'employer':
        return [
          { to: '/employer/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
          { to: '/employer/jobs', label: 'My Jobs', icon: <Briefcase className="w-5 h-5" /> },
          { to: '/employer/candidates', label: 'Find Candidates', icon: <Search className="w-5 h-5" /> },
          { to: '/employer/interviews', label: 'Interviews', icon: <Calendar className="w-5 h-5" /> },
          { to: '/employer/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
        ];
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
          { to: '/admin/jobs', label: 'Jobs', icon: <Briefcase className="w-5 h-5" /> },
          { to: '/admin/cv', label: 'CVs', icon: <FileText className="w-5 h-5" /> },
          { to: '/admin/users', label: 'Users', icon: <User className="w-5 h-5" /> },
          { to: '/admin/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
        ];
      default:
        return [];
    }
  };
  
  const navLinks = getNavLinks();
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <div className="text-xl font-bold text-blue-600">CV Matcher</div>
          </div>
          
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActiveRoute(link.to)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="mt-4 w-full flex items-center px-4 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden fixed inset-0 z-40 flex" style={{ display: isMobileMenuOpen ? 'flex' : 'none' }}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75" 
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        
        {/* Menu */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="px-4 flex items-center justify-between">
            <div className="text-xl font-bold text-blue-600">CV Matcher</div>
          </div>
          
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center px-4 py-2 text-base font-medium rounded-md ${
                    isActiveRoute(link.to)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="mt-4 w-full flex items-center px-4 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
          <button
            className="md:hidden px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-lg font-semibold text-gray-900">
                {navLinks.find(link => isActiveRoute(link.to))?.label || 'Dashboard'}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Bell className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;