import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

// Employer pages
import EmployerDashboard from './pages/employer/Dashboard';
import CreateJob from './pages/employer/CreateJob';
import JobList from './pages/employer/JobList';
import JobDetailEmployer from './pages/employer/JobDetail';
import CandidateSearch from './pages/employer/CandidateSearch';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';

const AppRoutes = () => {
  return (
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
      <Route path="/candidate" element={<ProtectedRoute role="candidate" />}>
        <Route path="dashboard" element={<CandidateDashboard />} />
        <Route path="profile" element={<CandidateProfile />} />
        <Route path="cv" element={<CVManager />} />
        <Route path="jobs" element={<JobSearch />} />
        <Route path="jobs/:jobId" element={<JobDetail />} />
        <Route path="applications" element={<Applications />} />
      </Route>
      
      {/* Protected routes - Employer */}
      <Route path="/employer" element={<ProtectedRoute role="employer" />}>
        <Route path="dashboard" element={<EmployerDashboard />} />
        <Route path="jobs" element={<JobList />} />
        <Route path="jobs/create" element={<CreateJob />} />
        <Route path="jobs/:jobId" element={<JobDetailEmployer />} />
        <Route path="candidates" element={<CandidateSearch />} />
      </Route>
      
      {/* Protected routes - Admin */}
      <Route path="/admin" element={<ProtectedRoute role="admin" />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
      </Route>
      
      {/* Redirect to dashboard based on role */}
      <Route path="/dashboard" element={<DashboardRedirect />} />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Helper component for protected routes
const ProtectedRoute = ({ role }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

// Helper component for redirecting to the appropriate dashboard
const DashboardRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  switch (user.role) {
    case 'candidate':
      return <Navigate to="/candidate/dashboard" replace />;
    case 'employer':
      return <Navigate to="/employer/dashboard" replace />;
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default AppRoutes;