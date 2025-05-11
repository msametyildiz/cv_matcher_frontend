import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Building, 
  Bell, 
  Shield, 
  Save, 
  X, 
  AlertCircle, 
  Check, 
  Info, 
  Trash2 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';

const Settings = () => {
  const { user, updateProfile, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    website: '',
    location: '',
    description: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    applicationReceived: true,
    interviewReminders: true,
    cvMatches: true,
    marketingEmails: false
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    showCompanyProfile: true,
    shareAnalytics: true,
    profileVisibility: 'public'
  });
  
  // Form errors
  const [profileErrors, setProfileErrors] = useState({});
  const [companyErrors, setCompanyErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  
  useEffect(() => {
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real application, we would fetch settings from API
      // const response = await api.get('/employer/settings');
      
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Set profile data from user object
      setProfileForm({
        name: user?.name || 'John Smith',
        email: user?.email || 'john.smith@acme.com',
        phone: '+1 (555) 123-4567'
      });
      
      // Mock company data
      setCompanyForm({
        companyName: 'Acme Inc.',
        industry: 'Technology',
        companySize: '50-200',
        website: 'https://www.acme.com',
        location: 'San Francisco, CA',
        description: 'Acme Inc. is a leading provider of innovative solutions for businesses of all sizes. Our products help companies improve efficiency, reduce costs, and increase productivity.'
      });
      
      // These would also come from API in a real application
      // We're using mock data for now
      setNotificationSettings({
        applicationReceived: true,
        interviewReminders: true,
        cvMatches: true,
        marketingEmails: false
      });
      
      setPrivacySettings({
        showCompanyProfile: true,
        shareAnalytics: true,
        profileVisibility: 'public'
      });
      
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (profileErrors[name]) {
      setProfileErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle company form changes
  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    
    setCompanyForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (companyErrors[name]) {
      setCompanyErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle notification settings changes
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Handle privacy settings changes
  const handlePrivacyChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setPrivacySettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Validate profile form
  const validateProfileForm = () => {
    const errors = {};
    
    if (!profileForm.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!profileForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      errors.email = 'Email is invalid';
    }
    
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Validate company form
  const validateCompanyForm = () => {
    const errors = {};
    
    if (!companyForm.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }
    
    if (companyForm.website && !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(companyForm.website)) {
      errors.website = 'Website URL is invalid';
    }
    
    setCompanyErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Save profile changes
  const saveProfileChanges = async () => {
    if (!validateProfileForm()) return;
    
    setIsSaving(true);
    
    try {
      // In a real application, we would call API
      // await api.put('/employer/profile', profileForm);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update auth context with new profile data
      updateProfile({
        name: profileForm.name,
        email: profileForm.email
      });
      
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Save company changes
  const saveCompanyChanges = async () => {
    if (!validateCompanyForm()) return;
    
    setIsSaving(true);
    
    try {
      // In a real application, we would call API
      // await api.put('/employer/company', companyForm);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success('Company information updated successfully');
    } catch (err) {
      console.error('Error updating company:', err);
      toast.error('Failed to update company information');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Save notification settings
  const saveNotificationSettings = async () => {
    setIsSaving(true);
    
    try {
      // In a real application, we would call API
      // await api.put('/employer/settings/notifications', notificationSettings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success('Notification settings updated successfully');
    } catch (err) {
      console.error('Error updating notification settings:', err);
      toast.error('Failed to update notification settings');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Save privacy settings
  const savePrivacySettings = async () => {
    setIsSaving(true);
    
    try {
      // In a real application, we would call API
      // await api.put('/employer/settings/privacy', privacySettings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success('Privacy settings updated successfully');
    } catch (err) {
      console.error('Error updating privacy settings:', err);
      toast.error('Failed to update privacy settings');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Change password
  const changePassword = async () => {
    if (!validatePasswordForm()) return;
    
    setIsSaving(true);
    
    try {
      // In a real application, we would call API
      // await api.put('/auth/change-password', passwordForm);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success('Password changed successfully');
      
      // Reset password form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Close modal
      setShowPasswordModal(false);
    } catch (err) {
      console.error('Error changing password:', err);
      toast.error('Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Delete account
  const deleteAccount = async () => {
    setIsSaving(true);
    
    try {
      // In a real application, we would call API
      // await api.delete('/employer/account');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success('Account deleted successfully');
      
      // Logout user
      logout();
      
      // Redirect to home page would happen via auth context
    } catch (err) {
      console.error('Error deleting account:', err);
      toast.error('Failed to delete account');
    } finally {
      setIsSaving(false);
      
      // Close modal
      setShowDeleteAccountModal(false);
    }
  };
  
  if (loading) {
    return <Loader />;
  }
  
  if (error) {
    return <ErrorMessage message={error} onRetry={fetchSettings} />;
  }
  
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
      
      {/* Profile Settings */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
          </div>
        </div>
        
        <div className="px-6 py-5">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  profileErrors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {profileErrors.name && (
                <p className="mt-1 text-sm text-red-600">{profileErrors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  profileErrors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {profileErrors.email && (
                <p className="mt-1 text-sm text-red-600">{profileErrors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="sm:col-span-2">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={saveProfileChanges}
                  disabled={isSaving}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Company Information */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center">
            <Building className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Company Information</h2>
          </div>
        </div>
        
        <div className="px-6 py-5">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={companyForm.companyName}
                onChange={handleCompanyChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  companyErrors.companyName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {companyErrors.companyName && (
                <p className="mt-1 text-sm text-red-600">{companyErrors.companyName}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                Industry
              </label>
              <select
                id="industry"
                name="industry"
                value={companyForm.industry}
                onChange={handleCompanyChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select an industry</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">
                Company Size
              </label>
              <select
                id="companySize"
                name="companySize"
                value={companyForm.companySize}
                onChange={handleCompanyChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="50-200">50-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="text"
                id="website"
                name="website"
                value={companyForm.website}
                onChange={handleCompanyChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  companyErrors.website ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="https://www.example.com"
              />
              {companyErrors.website && (
                <p className="mt-1 text-sm text-red-600">{companyErrors.website}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={companyForm.location}
                onChange={handleCompanyChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="City, State, Country"
              />
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Company Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={companyForm.description}
                onChange={handleCompanyChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Brief description of your company"
              />
              <p className="mt-1 text-sm text-gray-500">
                This description will be visible to candidates viewing your company profile.
              </p>
            </div>
            
            <div className="sm:col-span-2">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={saveCompanyChanges}
                  disabled={isSaving}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Notification Settings */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Notification Settings</h2>
          </div>
        </div>
        
        <div className="px-6 py-5 space-y-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="applicationReceived"
                name="applicationReceived"
                type="checkbox"
                checked={notificationSettings.applicationReceived}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="applicationReceived" className="font-medium text-gray-700">Application notifications</label>
              <p className="text-gray-500">Receive notifications when candidates apply to your job postings.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="interviewReminders"
                name="interviewReminders"
                type="checkbox"
                checked={notificationSettings.interviewReminders}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="interviewReminders" className="font-medium text-gray-700">Interview reminders</label>
              <p className="text-gray-500">Receive reminders about upcoming interviews with candidates.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="cvMatches"
                name="cvMatches"
                type="checkbox"
                checked={notificationSettings.cvMatches}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="cvMatches" className="font-medium text-gray-700">CV match notifications</label>
              <p className="text-gray-500">Get notified when we find candidate CVs that match your job requirements.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="marketingEmails"
                name="marketingEmails"
                type="checkbox"
                checked={notificationSettings.marketingEmails}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="marketingEmails" className="font-medium text-gray-700">Marketing communications</label>
              <p className="text-gray-500">Receive emails about new features, tips, and special offers.</p>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={saveNotificationSettings}
              disabled={isSaving}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Privacy Settings */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Privacy Settings</h2>
          </div>
        </div>
        
        <div className="px-6 py-5 space-y-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="showCompanyProfile"
                name="showCompanyProfile"
                type="checkbox"
                checked={privacySettings.showCompanyProfile}
                onChange={handlePrivacyChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="showCompanyProfile" className="font-medium text-gray-700">Show company profile</label>
              <p className="text-gray-500">Allow candidates to view your company profile and information.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="shareAnalytics"
                name="shareAnalytics"
                type="checkbox"
                checked={privacySettings.shareAnalytics}
                onChange={handlePrivacyChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="shareAnalytics" className="font-medium text-gray-700">Share usage analytics</label>
              <p className="text-gray-500">Help us improve by sharing anonymous usage data.</p>
            </div>
          </div>
          
          <div>
            <label htmlFor="profileVisibility" className="block text-sm font-medium text-gray-700">
              Profile Visibility
            </label>
            <select
              id="profileVisibility"
              name="profileVisibility"
              value={privacySettings.profileVisibility}
              onChange={handlePrivacyChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="public">Public - Visible to all users</option>
              <option value="registered">Registered Users - Only visible to registered candidates</option>
              <option value="private">Private - Only visible to candidates you choose</option>
            </select>
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={savePrivacySettings}
              disabled={isSaving}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Security Settings */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center">
            <Lock className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Security</h2>
          </div>
        </div>
        
        <div className="px-6 py-5 space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  We recommend changing your password regularly to keep your account secure.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Lock className="mr-2 h-4 w-4" />
              Change Password
            </button>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-6">
            <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
            <p className="mt-1 text-sm text-gray-500">
              Once you delete your account, all of your data will be permanently removed. This action cannot be undone.
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowDeleteAccountModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
        size="md"
      >
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  passwordErrors.currentPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {passwordErrors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  passwordErrors.newPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {passwordErrors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  passwordErrors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {passwordErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowPasswordModal(false)}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={changePassword}
              disabled={isSaving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        title="Delete Account"
        size="md"
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-6 text-red-500">
            <AlertCircle className="h-12 w-12" />
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
            Are you sure you want to delete your account?
          </h3>
          
          <p className="text-sm text-gray-500 mb-4">
            This action cannot be undone. All of your data, including job postings, company information, and account details will be permanently deleted.
          </p>
          
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  If you have active job postings, they will be removed and candidates will no longer be able to apply.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => setShowDeleteAccountModal(false)}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={deleteAccount}
              disabled={isSaving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;