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

const Home = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">Welcome to CV Matcher</h1>
    <p className="mt-4">This is a placeholder homepage. Your application is now running correctly!</p>
  </div>
);

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* Protected routes - Candidate */}
        <Route path="/candidate" element={<ProtectedRoute role="candidate"><MainLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/candidate/dashboard" replace />} />
          <Route path="dashboard" element={<CandidateDashboard />} />
          <Route path="profile" element={<CandidateProfile />} />
          <Route path="cv" element={<CVManager />} />
          <Route path="jobs" element={<JobSearch />} />
          <Route path="jobs/:jobId" element={<JobDetail />} />
          <Route path="applications" element={<Applications />} />
          <Route path="interviews" element={<Interviews />} />
          <Route path="settings" element={<CandidateSettings />} />
        </Route>
        
        {/* Protected routes - Employer */}
        <Route path="/employer" element={<ProtectedRoute role="employer"><MainLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/employer/dashboard" replace />} />
          <Route path="dashboard" element={<EmployerDashboard />} />
          <Route path="jobs" element={<JobList />} />
          <Route path="jobs/create" element={<CreateJob />} />
          <Route path="jobs/:jobId" element={<JobDetailEmployer />} />
          <Route path="jobs/:jobId/edit" element={<EditJob />} />
          <Route path="candidates" element={<CandidateSearch />} />
          <Route path="candidates/:candidateId" element={<CandidateDetail />} />
          <Route path="interviews" element={<InterviewScheduler />} />
          <Route path="settings" element={<EmployerSettings />} />
        </Route>
        
        {/* Protected routes - Admin */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><MainLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="jobs" element={<JobManagement />} />
          <Route path="cvs" element={<CVManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<SystemSettings />} />
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
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { returnUrl: window.location.pathname } });
    } else if (!isLoading && isAuthenticated && role && user?.role !== role) {
      // If user doesn't have the required role, redirect to their appropriate dashboard
      const dashboardPath = user?.role === 'admin' 
        ? '/admin/dashboard'
        : user?.role === 'employer' 
          ? '/employer/dashboard' 
          : '/candidate/dashboard';
      
      navigate(dashboardPath, { 
        state: { 
          message: `You don't have permission to access this page. You've been redirected to your dashboard.` 
        } 
      });
    }
  }, [isAuthenticated, isLoading, role, user, navigate]);
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  if (role && user?.role !== role) {
    return null;
  }
  
  return children;
};

// Helper component for redirecting to the appropriate dashboard
const DashboardRedirect = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
      } else {
        const dashboardPath = user?.role === 'admin' 
          ? '/admin/dashboard'
          : user?.role === 'employer' 
            ? '/employer/dashboard' 
            : '/candidate/dashboard';
        
        navigate(dashboardPath, { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }
  
  return null;
};

export default AppRoutes;