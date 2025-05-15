import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import MainLayout from './components/common/MainLayout';

// Public pages
import Landing from './pages/Landing';
import About from './pages/About';
import Contact from './pages/Contact';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import CandidateLogin from './pages/auth/CandidateLogin';
import CandidateRegister from './pages/auth/CandidateRegister';
import EmployerLogin from './pages/auth/EmployerLogin';
import EmployerRegister from './pages/auth/EmployerRegister';

// Candidate pages
import CandidateDashboard from './pages/candidate/Dashboard';
import CandidateProfile from './pages/candidate/Profile';
import CVManager from './pages/candidate/CVManager';
import JobSearch from './pages/candidate/JobSearch';
import JobDetail from './pages/candidate/JobDetail';
import Applications from './pages/candidate/Applications';
import Interviews from './pages/candidate/Interviews';
import CandidateSettings from './pages/candidate/Settings';

// Employer pages
import EmployerDashboard from './pages/employer/Dashboard';
import JobList from './pages/employer/JobList';
import JobDetailEmployer from './pages/employer/JobDetail';
import CreateJob from './pages/employer/CreateJob';
import EditJob from './pages/employer/EditJob';
import CandidateSearch from './pages/employer/CandidateSearch';
import CandidateDetail from './pages/employer/CandidateDetail';
import InterviewScheduler from './pages/employer/InterviewScheduler';
import EmployerSettings from './pages/employer/Settings';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import JobManagement from './pages/admin/JobManagement';
import CVManagement from './pages/admin/CVManagement';
import Analytics from './pages/admin/Analytics';
import SystemSettings from './pages/admin/Settings';

// This component must be used inside Router context
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Auth routes - Legacy routes for backward compatibility */}
        <Route path="/login" element={<Navigate to="/candidate-login" replace />} />
        <Route path="/register" element={<Navigate to="/candidate-register" replace />} />
        
        {/* New role-specific auth routes */}
        <Route path="/candidate-login" element={<CandidateLogin />} />
        <Route path="/candidate-register" element={<CandidateRegister />} />
        <Route path="/employer-login" element={<EmployerLogin />} />
        <Route path="/employer-register" element={<EmployerRegister />} />
        
        {/* Common auth routes */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* Protected routes - Candidate */}
        <Route path="/candidate" element={<MainLayout />}>
          <Route index element={<Navigate to="/candidate/dashboard" replace />} />
          <Route path="dashboard" element={<ProtectedRoute role="candidate"><CandidateDashboard /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute role="candidate"><CandidateProfile /></ProtectedRoute>} />
          <Route path="cv" element={<ProtectedRoute role="candidate"><CVManager /></ProtectedRoute>} />
          <Route path="jobs" element={<ProtectedRoute role="candidate"><JobSearch /></ProtectedRoute>} />
          <Route path="jobs/:jobId" element={<ProtectedRoute role="candidate"><JobDetail /></ProtectedRoute>} />
          <Route path="applications" element={<ProtectedRoute role="candidate"><Applications /></ProtectedRoute>} />
          <Route path="interviews" element={<ProtectedRoute role="candidate"><Interviews /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute role="candidate"><CandidateSettings /></ProtectedRoute>} />
        </Route>
        
        {/* Protected routes - Employer */}
        <Route path="/employer" element={<MainLayout />}>
          <Route index element={<Navigate to="/employer/dashboard" replace />} />
          <Route path="dashboard" element={<ProtectedRoute role="employer"><EmployerDashboard /></ProtectedRoute>} />
          <Route path="jobs" element={<ProtectedRoute role="employer"><JobList /></ProtectedRoute>} />
          <Route path="jobs/create" element={<ProtectedRoute role="employer"><CreateJob /></ProtectedRoute>} />
          <Route path="jobs/:jobId" element={<ProtectedRoute role="employer"><JobDetailEmployer /></ProtectedRoute>} />
          <Route path="jobs/:jobId/edit" element={<ProtectedRoute role="employer"><EditJob /></ProtectedRoute>} />
          <Route path="candidates" element={<ProtectedRoute role="employer"><CandidateSearch /></ProtectedRoute>} />
          <Route path="candidates/:candidateId" element={<ProtectedRoute role="employer"><CandidateDetail /></ProtectedRoute>} />
          <Route path="interviews" element={<ProtectedRoute role="employer"><InterviewScheduler /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute role="employer"><EmployerSettings /></ProtectedRoute>} />
        </Route>
        
        {/* Protected routes - Admin */}
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="users" element={<ProtectedRoute role="admin"><UserManagement /></ProtectedRoute>} />
          <Route path="jobs" element={<ProtectedRoute role="admin"><JobManagement /></ProtectedRoute>} />
          <Route path="cvs" element={<ProtectedRoute role="admin"><CVManagement /></ProtectedRoute>} />
          <Route path="analytics" element={<ProtectedRoute role="admin"><Analytics /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute role="admin"><SystemSettings /></ProtectedRoute>} />
        </Route>
        
        {/* Redirect to dashboard based on role */}
        <Route path="/dashboard" element={<DashboardRedirect />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

// Helper component for protected routes
const ProtectedRoute = ({ children, role }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log("User not authenticated, redirecting to login");
        // Redirect to appropriate login page
        const loginPath = role === 'employer' ? '/employer-login' : '/candidate-login';
        navigate(loginPath, { 
          state: { returnUrl: location.pathname },
          replace: true 
        });
      } else if (role && user?.role !== role) {
        console.log(`User role (${user?.role}) not allowed. Required role: ${role}`);
        // If user doesn't have the required role, redirect to their appropriate dashboard
        const dashboardPath = user?.role === 'admin' 
          ? '/admin/dashboard'
          : user?.role === 'employer' 
            ? '/employer/dashboard' 
            : '/candidate/dashboard';
        
        navigate(dashboardPath, { 
          state: { 
            message: `You don't have permission to access this page. You've been redirected to your dashboard.` 
          },
          replace: true 
        });
      }
    }
  }, [isAuthenticated, isLoading, role, user, navigate, location]);
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }
  
  if (!isAuthenticated || (role && user?.role !== role)) {
    return null;
  }
  
  return children;
};

// Helper component for redirecting to the appropriate dashboard
const DashboardRedirect = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to login screen (default to candidate login)
        navigate('/candidate-login', { 
          state: { returnUrl: '/dashboard' },
          replace: true 
        });
      } else {
        const role = user?.role || localStorage.getItem('userRole');
        const dashboardPath = role === 'admin' 
          ? '/admin/dashboard'
          : role === 'employer' 
            ? '/employer/dashboard' 
            : '/candidate/dashboard';
        
        console.log(`Redirecting to dashboard: ${dashboardPath} based on role: ${role}`);
        navigate(dashboardPath, { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, user, navigate, location]);
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }
  
  return null;
};

export default AppRoutes;