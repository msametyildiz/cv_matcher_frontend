import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';

const HomePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Check if we have an auth redirect flag (from API 401 error handler)
    const authRedirect = localStorage.getItem('auth_redirect');
    if (authRedirect) {
      localStorage.removeItem('auth_redirect');
      // Force reload to clear application state
      window.location.href = '/login';
    }
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  switch (user.role) {
    case 'candidate':
      return <Navigate to="/candidate/dashboard" replace />;
    case 'employer':
      return <Navigate to="/employer/dashboard" replace />;
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    default:
      // If role is unknown, redirect to login
      return <Navigate to="/login" replace />;
  }
};

export default HomePage;
