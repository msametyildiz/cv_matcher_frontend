import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Bell, Lock, Shield, Trash2, 
  Save, X, AlertTriangle, Eye, EyeOff
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';

const Settings = () => {
  const { user, updateProfile, logout } = useAuth();
  
  // State variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    accountSettings: {
      name: '',
      email: ''
    },
    notificationSettings: {
      emailNotifications: true,
      jobAlerts: true,
      interviewReminders: true,
      marketingEmails: false
    },
    privacySettings: {
      profileVisibility: 'all',
      dataSharing: true
    }
  });
  
  // Password change states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  
  // Modal states
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch user settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data based on logged in user
        setSettings({
          accountSettings: {
            name: user?.name || 'John Smith',
            email: user?.email || 'john.smith@example.com'
          },
          notificationSettings: {
            emailNotifications: true,
            jobAlerts: true,
            interviewReminders: true,
            marketingEmails: false
          },
          privacySettings: {
            profileVisibility: 'all',
            dataSharing: true
          }
        });
      } catch (error) {
        console.error('Error fetching settings:', error);
        setError('Failed to load your settings. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [user]);
  
  // Handle account settings change
  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      accountSettings: {
        ...prev.accountSettings,
        [name]: value
      }
    }));
  };
  
  // Handle notification settings change
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings,
        [name]: checked
      }
    }));
  };
  
  // Handle privacy settings change
  const handlePrivacyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };
  
  // Handle password form change
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
    
    return Object.keys(errors).length === 0 ? true : errors;
  };
  
  // Handle save account settings
  const handleSaveAccount = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update auth context
      if (updateProfile) {
        await updateProfile({
          name: settings.accountSettings.name
        });
      }
      
      toast.success('Account settings updated successfully');
    } catch (error) {
      console.error('Error updating account settings:', error);
      toast.error('Failed to update account settings');
    }
  };
  
  // Handle save notification settings
  const handleSaveNotifications = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success('Notification preferences updated successfully');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast.error('Failed to update notification settings');
    }
  };
  
  // Handle save privacy settings
  const handleSavePrivacy = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success('Privacy settings updated successfully');
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast.error('Failed to update privacy settings');
    }
  };
  
  // Handle change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success('Password changed successfully');
      
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      
      // Handle invalid current password error
      if (error.response?.status === 401) {
        setPasswordErrors({
          currentPassword: 'Current password is incorrect'
        });
      } else {
        toast.error('Failed to change password');
      }
    }
  };
  
  // Handle delete account
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'delete my account') {
      toast.error('Please type "delete my account" to confirm');
      return;
    }
    
    setIsDeleting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Your account has been deleted');
      
      // Log the user out
      if (logout) {
        logout();
      }
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
      setIsDeleting(false);
    }
  };
  
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
      
      {/* Account Settings */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-400" />
            <h2 className="ml-2 text-lg font-medium text-gray-900">Personal Information</h2>
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
                name="name"
                id="name"
                value={settings.accountSettings.name}
                onChange={handleAccountChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={settings.accountSettings.email}
                onChange={handleAccountChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                This email is used for login and notifications
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSaveAccount}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
      
      {/* Password Settings */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center">
            <Lock className="h-5 w-5 text-gray-400" />
            <h2 className="ml-2 text-lg font-medium text-gray-900">Change Password</h2>
          </div>
        </div>
        
        <div className="px-6 py-5">
          <form onSubmit={handleChangePassword}>
            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="currentPassword"
                    id="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className={`block w-full pr-10 rounded-md ${
                      passwordErrors.currentPassword 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } sm:text-sm`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? 
                      <EyeOff className="h-4 w-4 text-gray-400" /> : 
                      <Eye className="h-4 w-4 text-gray-400" />
                    }
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    id="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className={`block w-full pr-10 rounded-md ${
                      passwordErrors.newPassword 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } sm:text-sm`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? 
                      <EyeOff className="h-4 w-4 text-gray-400" /> : 
                      <Eye className="h-4 w-4 text-gray-400" />
                    }
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters
                </p>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`mt-1 block w-full rounded-md ${
                    passwordErrors.confirmPassword 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  } sm:text-sm`}
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Notification Settings */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-gray-400" />
            <h2 className="ml-2 text-lg font-medium text-gray-900">Notification Preferences</h2>
          </div>
        </div>
        
        <div className="px-6 py-5">
          <div className="space-y-4">
            {[
              { id: 'emailNotifications', 
                label: 'Email Notifications', 
                description: 'Receive email notifications for account activity' },
              { id: 'jobAlerts', 
                label: 'Job Alerts', 
                description: 'Receive notifications for new jobs matching your profile' },
              { id: 'interviewReminders', 
                label: 'Interview Reminders', 
                description: 'Receive reminders for upcoming interviews' },
              { id: 'marketingEmails', 
                label: 'Marketing Emails', 
                description: 'Receive marketing and promotional emails' }
            ].map((notification) => (
              <div key={notification.id} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id={notification.id}
                    name={notification.id}
                    type="checkbox"
                    checked={settings.notificationSettings[notification.id]}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor={notification.id} className="font-medium text-gray-700">
                    {notification.label}
                  </label>
                  <p className="text-gray-500">{notification.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSaveNotifications}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </button>
          </div>
        </div>
      </div>
      
      {/* Privacy Settings */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-gray-400" />
            <h2 className="ml-2 text-lg font-medium text-gray-900">Privacy Settings</h2>
          </div>
        </div>
        
        <div className="px-6 py-5">
          <div className="space-y-6">
            <div>
              <label htmlFor="profileVisibility" className="block text-sm font-medium text-gray-700">
                Profile Visibility
              </label>
              <select
                id="profileVisibility"
                name="profileVisibility"
                value={settings.privacySettings.profileVisibility}
                onChange={handlePrivacyChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">Visible to all employers</option>
                <option value="applied">Visible only to employers I've applied to</option>
                <option value="none">Hidden from all employers</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Control who can view your profile in candidate searches
              </p>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="dataSharing"
                  name="dataSharing"
                  type="checkbox"
                  checked={settings.privacySettings.dataSharing}
                  onChange={handlePrivacyChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="dataSharing" className="font-medium text-gray-700">Data Sharing</label>
                <p className="text-gray-500">Allow us to use your data to improve job matches and recommendations</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSavePrivacy}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
      
      {/* Delete Account */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center">
            <Trash2 className="h-5 w-5 text-red-500" />
            <h2 className="ml-2 text-lg font-medium text-gray-900">Delete Account</h2>
          </div>
        </div>
        
        <div className="px-6 py-5">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Warning: This action cannot be undone</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Deleting your account will permanently remove all your data, including your profile, CVs, and application history.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowDeleteAccountModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete My Account
            </button>
          </div>
        </div>
      </div>
      
      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        title="Delete Account"
        size="md"
      >
        <div className="p-6">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <AlertTriangle className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-center text-gray-900 mb-4">
            Are you absolutely sure?
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            This action cannot be undone. This will permanently delete your account and remove all your
            data from our servers.
          </p>
          
          <div className="mb-6">
            <label htmlFor="confirmDelete" className="block text-sm font-medium text-gray-700 mb-1">
              Please type <span className="font-bold">delete my account</span> to confirm:
            </label>
            <input
              type="text"
              id="confirmDelete"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="delete my account"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowDeleteAccountModal(false)}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== 'delete my account' || isDeleting}
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;