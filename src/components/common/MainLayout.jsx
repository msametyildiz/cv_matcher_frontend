import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Home, 
  Briefcase, 
  User, 
  FileText, 
  Users, 
  Settings, 
  Calendar, 
  BarChart2, 
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const MainLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };
  
  const getNavigation = () => {
    switch (user.role) {
      case 'candidate':
        return [
          { name: 'Dashboard', path: '/candidate/dashboard', icon: <Home /> },
          { name: 'My CV', path: '/candidate/cv', icon: <FileText /> },
          { name: 'Jobs', path: '/candidate/jobs', icon: <Briefcase /> },
          { name: 'Applications', path: '/candidate/applications', icon: <Briefcase /> },
          { name: 'Interviews', path: '/candidate/interviews', icon: <Calendar /> },
          { name: 'Profile', path: '/candidate/profile', icon: <User /> },
          { name: 'Settings', path: '/candidate/settings', icon: <Settings /> },
        ];
      case 'employer':
        return [
          { name: 'Dashboard', path: '/employer/dashboard', icon: <Home /> },
          { name: 'Jobs', path: '/employer/jobs', icon: <Briefcase /> },
          { name: 'Candidates', path: '/employer/candidates', icon: <Users /> },
          { name: 'Interviews', path: '/employer/interviews', icon: <Calendar /> },
          { name: 'Settings', path: '/employer/settings', icon: <Settings /> },
        ];
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: <Home /> },
          { name: 'Users', path: '/admin/users', icon: <Users /> },
          { name: 'Jobs', path: '/admin/jobs', icon: <Briefcase /> },
          { name: 'CVs', path: '/admin/cvs', icon: <FileText /> },
          { name: 'Analytics', path: '/admin/analytics', icon: <BarChart2 /> },
          { name: 'Settings', path: '/admin/settings', icon: <Settings /> },
        ];
      default:
        return [];
    }
  };
  
  const navigation = getNavigation();
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl font-bold text-gray-900">CV Matcher</h1>
        </div>
      </header>
      
      <div className="flex h-screen overflow-hidden pt-16">
        {/* Sidebar for desktop */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col h-0 flex-1">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200">
                <div className="flex items-center flex-shrink-0 px-4">
                  <span className="text-xl font-semibold text-gray-800">{user.role.charAt(0).toUpperCase() + user.role.slice(1)} Portal</span>
                </div>
                <nav className="mt-5 flex-1 px-2 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`${
                        isActive(item.path)
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                    >
                      <div className={`${
                        isActive(item.path) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-3 h-5 w-5`}>
                        {item.icon}
                      </div>
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile sidebar */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} md:hidden fixed inset-0 flex z-40`}>
          <div
            className={`${sidebarOpen ? 'opacity-100 ease-in-out duration-300' : 'opacity-0 ease-in-out duration-300'} fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity`}
            onClick={() => setSidebarOpen(false)}
          ></div>
          
          <div className={`${
            sidebarOpen
              ? 'translate-x-0 ease-in-out duration-300'
              : '-translate-x-full ease-in-out duration-300'
          } relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white transition-transform`}>
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <div className="flex-shrink-0 flex items-center px-4">
              <span className="text-xl font-semibold text-gray-800">{user.role.charAt(0).toUpperCase() + user.role.slice(1)} Portal</span>
            </div>
            <div className="mt-5 flex-1 h-0 overflow-y-auto">
              <nav className="px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`${
                      isActive(item.path)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className={`${
                      isActive(item.path) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-4 h-6 w-6`}>
                      {item.icon}
                    </div>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Top bar for mobile menu button and user menu */}
          <div className="md:hidden bg-white sticky top-0 z-10 flex-shrink-0 flex h-16 border-b border-gray-200">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>
          
          <main className="flex-1 relative">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Main content area */}
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
      
      <footer className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} CV Matcher. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;