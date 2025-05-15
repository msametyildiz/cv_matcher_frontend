import React, { useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../common/Loader';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if the component is mounted and authentication is not loading
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        // Store the current path to redirect back after login
        const returnPath = location.pathname + location.search;
        console.log(`User not authenticated, redirecting to login. Return path: ${returnPath}`);
      } 
      // If authenticated but not authorized (wrong role)
      else if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        console.log(`User role (${user.role}) not allowed. Required roles: ${allowedRoles.join(', ')}`);
        
        // Redirect to appropriate dashboard based on role
        const dashboardPath = user.role === 'admin' 
          ? '/admin/dashboard'
          : user.role === 'employer' 
            ? '/employer/dashboard' 
            : '/candidate/dashboard';
        
        navigate(dashboardPath, { 
          state: { 
            message: `You don't have permission to access that page. Redirected to your dashboard.` 
          } 
        });
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, navigate, location]);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    // Redirect to login and save current location
    return <Navigate to="/login" state={{ returnUrl: location.pathname }} replace />;
  }

  // If roles specified, check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Return null during the redirect handled by useEffect
    return null;
  }

  return children;
};

export default ProtectedRoute;
