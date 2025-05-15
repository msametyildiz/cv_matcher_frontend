import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CandidateDashboard from './pages/candidate/Dashboard';
import EmployerDashboard from './pages/employer/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import UnauthorizedPage from './pages/UnauthorizedPage';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-hot-toast';

// Import candidate pages
import CandidateCVManager from './pages/candidate/CVManager';
import CandidateJobList from './pages/candidate/JobList';
import CandidateApplications from './pages/candidate/Applications';
import CandidateInterviews from './pages/candidate/Interviews';
import CandidateProfile from './pages/candidate/Profile';
import CandidateSettings from './pages/candidate/Settings';

// Import employer pages
import EmployerJobs from './pages/employer/Jobs';
import EmployerCreateJob from './pages/employer/CreateJob';
import EmployerEditJob from './pages/employer/EditJob';
import EmployerCandidates from './pages/employer/Candidates';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Root route with redirection logic */}
          <Route path="/" element={<HomePage />} />
          
          {/* Protected candidate routes */}
          <Route path="/candidate/*" element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <Routes>
                <Route path="/dashboard" element={<CandidateDashboard />} />
                <Route path="/cv" element={<CandidateCVManager />} />
                <Route path="/jobs" element={<CandidateJobList />} />
                <Route path="/applications" element={<CandidateApplications />} />
                <Route path="/interviews" element={<CandidateInterviews />} />
                <Route path="/profile" element={<CandidateProfile />} />
                <Route path="/settings" element={<CandidateSettings />} />
                {/* Default redirect for candidate routes */}
                <Route path="*" element={<Navigate to="/candidate/dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } />
          
          {/* Protected employer routes */}
          <Route path="/employer/*" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <Routes>
                <Route path="/dashboard" element={<EmployerDashboard />} />
                <Route path="/jobs" element={<EmployerJobs />} />
                <Route path="/jobs/create" element={<EmployerCreateJob />} />
                <Route path="/jobs/:id/edit" element={<EmployerEditJob />} />
                <Route path="/candidates" element={<EmployerCandidates />} />
                {/* Default redirect for employer routes */}
                <Route path="*" element={<Navigate to="/employer/dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } />
          
          {/* Protected admin routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Routes>
                <Route path="/dashboard" element={<AdminDashboard />} />
                {/* Other admin routes */}
                {/* Default redirect for admin routes */}
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } />
          
          {/* Fallback redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" />
    </AuthProvider>
  );
}

export default App;
