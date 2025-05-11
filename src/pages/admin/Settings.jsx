import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Save, 
  Settings as SettingsIcon, 
  Mail, 
  Shield, 
  UserPlus, 
  Database, 
  Clock,
  BarChart2,
  Globe,
  AlertTriangle,
  Trash2,
  RefreshCw
} from 'lucide-react';
import api from '../../api';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';

const Settings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showClearDataModal, setShowClearDataModal] = useState(false);
  const [dataType, setDataType] = useState('');

  // Settings state objects for different sections
  const [generalSettings, setGeneralSettings] = useState({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    supportEmail: '',
    logoUrl: '',
    faviconUrl: '',
    maintenanceMode: false,
    maintenanceMessage: ''
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: '',
    smtpPort: '',
    smtpUsername: '',
    smtpPassword: '',
    smtpSecure: true,
    fromName: '',
    fromEmail: '',
    emailFooter: '',
    enableEmailVerification: true,
    enableNotifications: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecial: true,
    sessionTimeout: 120, // minutes
    maxLoginAttempts: 5,
    enableTwoFactor: false,
    enableCaptcha: true,
    jwtSecret: '',
    cookieSecure: true,
    allowedOrigins: '*'
  });

  const [registrationSettings, setRegistrationSettings] = useState({
    allowRegistration: true,
    requireEmailVerification: true,
    autoApproveEmployers: false,
    autoApproveCandidate: true,
    welcomeEmailEnabled: true,
    termsUrl: '',
    privacyUrl: '',
    allowSocialLogin: true,
    allowedRoles: ['candidate', 'employer']
  });

  const [matchingSettings, setMatchingSettings] = useState({
    minimumMatchScore: 60,
    skillsWeight: 40,
    experienceWeight: 30,
    educationWeight: 20,
    locationWeight: 10,
    enableAutomaticMatching: true,
    matchingFrequency: 'daily',
    notifyUsersOnNewMatches: true,
    useAI: true
  });

  const [dataSettings, setDataSettings] = useState({
    cvRetentionPeriod: 365, // days
    jobRetentionPeriod: 180, // days
    automaticBackup: true,
    backupFrequency: 'daily',
    backupRetention: 30, // days
    dataExportEnabled: true,
    anonymizeDeletedUsers: true
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real application, we would fetch settings from the API
        // const response = await api.admin.getSettings();
        
        // Mock data for demonstration
        setTimeout(() => {
          // For demo purposes, we're keeping the default values set above
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setError('Failed to load settings. Please try again.');
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (section) => {
    setIsSaving(true);
    
    let settingsData;
    switch (section) {
      case 'general':
        settingsData = generalSettings;
        break;
      case 'email':
        settingsData = emailSettings;
        break;
      case 'security':
        settingsData = securitySettings;
        break;
      case 'registration':
        settingsData = registrationSettings;
        break;
      case 'matching':
        settingsData = matchingSettings;
        break;
      case 'data':
        settingsData = dataSettings;
        break;
      default:
        settingsData = {};
    }
    
    try {
      // In a real application, we would update settings via API
      // await api.admin.updateSettings(section, settingsData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings updated successfully`);
      setActiveSection(null);
    } catch (error) {
      console.error(`Error updating ${section} settings:`, error);
      toast.error(`Failed to update ${section} settings`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSettings = async () => {
    try {
      // In a real application, we would reset settings via API
      // await api.admin.resetSettings();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Settings reset to default values');
      setShowResetModal(false);
      
      // Refresh settings
      window.location.reload();
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast.error('Failed to reset settings');
    }
  };

  const handleClearData = async () => {
    try {
      // In a real application, we would clear data via API
      // await api.admin.clearData(dataType);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`${dataType} data cleared successfully`);
      setShowClearDataModal(false);
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error('Failed to clear data');
    }
  };

  const handleInputChange = (section, field, value) => {
    switch (section) {
      case 'general':
        setGeneralSettings(prev => ({ ...prev, [field]: value }));
        break;
      case 'email':
        setEmailSettings(prev => ({ ...prev, [field]: value }));
        break;
      case 'security':
        setSecuritySettings(prev => ({ ...prev, [field]: value }));
        break;
      case 'registration':
        setRegistrationSettings(prev => ({ ...prev, [field]: value }));
        break;
      case 'matching':
        setMatchingSettings(prev => ({ ...prev, [field]: value }));
        break;
      case 'data':
        setDataSettings(prev => ({ ...prev, [field]: value }));
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <Globe className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">General Settings</h2>
          </div>
          <button
            type="button"
            onClick={() => setActiveSection(activeSection === 'general' ? null : 'general')}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {activeSection === 'general' ? 'Cancel' : 'Edit'}
          </button>
        </div>
        
        <div className="px-6 py-5">
          {activeSection === 'general' ? (
            <form onSubmit={(e) => { e.preventDefault(); handleSave('general'); }}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                    Site Name
                  </label>
                  <input
                    type="text"
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    value={generalSettings.contactEmail}
                    onChange={(e) => handleInputChange('general', 'contactEmail', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-6">
                  <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                    Site Description
                  </label>
                  <textarea
                    id="siteDescription"
                    rows={3}
                    value={generalSettings.siteDescription}
                    onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
                    Logo URL
                  </label>
                  <input
                    type="text"
                    id="logoUrl"
                    value={generalSettings.logoUrl}
                    onChange={(e) => handleInputChange('general', 'logoUrl', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="faviconUrl" className="block text-sm font-medium text-gray-700">
                    Favicon URL
                  </label>
                  <input
                    type="text"
                    id="faviconUrl"
                    value={generalSettings.faviconUrl}
                    onChange={(e) => handleInputChange('general', 'faviconUrl', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700">
                    Support Email
                  </label>
                  <input
                    type="email"
                    id="supportEmail"
                    value={generalSettings.supportEmail}
                    onChange={(e) => handleInputChange('general', 'supportEmail', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="maintenanceMode"
                        name="maintenanceMode"
                        type="checkbox"
                        checked={generalSettings.maintenanceMode}
                        onChange={(e) => handleInputChange('general', 'maintenanceMode', e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="maintenanceMode" className="font-medium text-gray-700">
                        Maintenance Mode
                      </label>
                      <p className="text-gray-500">Enable to temporarily disable the site for maintenance</p>
                    </div>
                  </div>
                </div>
                
                {generalSettings.maintenanceMode && (
                  <div className="sm:col-span-6">
                    <label htmlFor="maintenanceMessage" className="block text-sm font-medium text-gray-700">
                      Maintenance Message
                    </label>
                    <textarea
                      id="maintenanceMessage"
                      rows={2}
                      value={generalSettings.maintenanceMessage}
                      onChange={(e) => handleInputChange('general', 'maintenanceMessage', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="We are currently performing maintenance. Please check back soon."
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveSection(null)}
                  className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          ) : (
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Site Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{generalSettings.siteName || 'CV Matcher'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Contact Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{generalSettings.contactEmail || 'contact@cvmatcher.com'}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Site Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{generalSettings.siteDescription || 'A platform for matching job seekers with employers'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Support Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{generalSettings.supportEmail || 'support@cvmatcher.com'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Maintenance Mode</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${generalSettings.maintenanceMode ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {generalSettings.maintenanceMode ? 'Enabled' : 'Disabled'}
                  </span>
                </dd>
              </div>
            </dl>
          )}
        </div>
      </div>

      {/* Email Settings */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Email Settings</h2>
          </div>
          <button
            type="button"
            onClick={() => setActiveSection(activeSection === 'email' ? null : 'email')}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {activeSection === 'email' ? 'Cancel' : 'Edit'}
          </button>
        </div>
        
        <div className="px-6 py-5">
          {activeSection === 'email' ? (
            <form onSubmit={(e) => { e.preventDefault(); handleSave('email'); }}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="smtpServer" className="block text-sm font-medium text-gray-700">
                    SMTP Server
                  </label>
                  <input
                    type="text"
                    id="smtpServer"
                    value={emailSettings.smtpServer}
                    onChange={(e) => handleInputChange('email', 'smtpServer', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700">
                    SMTP Port
                  </label>
                  <input
                    type="text"
                    id="smtpPort"
                    value={emailSettings.smtpPort}
                    onChange={(e) => handleInputChange('email', 'smtpPort', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="smtpUsername" className="block text-sm font-medium text-gray-700">
                    SMTP Username
                  </label>
                  <input
                    type="text"
                    id="smtpUsername"
                    value={emailSettings.smtpUsername}
                    onChange={(e) => handleInputChange('email', 'smtpUsername', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700">
                    SMTP Password
                  </label>
                  <input
                    type="password"
                    id="smtpPassword"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="fromName" className="block text-sm font-medium text-gray-700">
                    From Name
                  </label>
                  <input
                    type="text"
                    id="fromName"
                    value={emailSettings.fromName}
                    onChange={(e) => handleInputChange('email', 'fromName', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700">
                    From Email
                  </label>
                  <input
                    type="email"
                    id="fromEmail"
                    value={emailSettings.fromEmail}
                    onChange={(e) => handleInputChange('email', 'fromEmail', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-6">
                  <label htmlFor="emailFooter" className="block text-sm font-medium text-gray-700">
                    Email Footer
                  </label>
                  <textarea
                    id="emailFooter"
                    rows={3}
                    value={emailSettings.emailFooter}
                    onChange={(e) => handleInputChange('email', 'emailFooter', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="smtpSecure"
                        name="smtpSecure"
                        type="checkbox"
                        checked={emailSettings.smtpSecure}
                        onChange={(e) => handleInputChange('email', 'smtpSecure', e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="smtpSecure" className="font-medium text-gray-700">
                        Use Secure Connection (TLS/SSL)
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="enableEmailVerification"
                        name="enableEmailVerification"
                        type="checkbox"
                        checked={emailSettings.enableEmailVerification}
                        onChange={(e) => handleInputChange('email', 'enableEmailVerification', e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="enableEmailVerification" className="font-medium text-gray-700">
                        Enable Email Verification
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="enableNotifications"
                        name="enableNotifications"
                        type="checkbox"
                        checked={emailSettings.enableNotifications}
                        onChange={(e) => handleInputChange('email', 'enableNotifications', e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="enableNotifications" className="font-medium text-gray-700">
                        Enable Email Notifications
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveSection(null)}
                  className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          ) : (
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">SMTP Server</dt>
                <dd className="mt-1 text-sm text-gray-900">{emailSettings.smtpServer || 'smtp.example.com'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">SMTP Port</dt>
                <dd className="mt-1 text-sm text-gray-900">{emailSettings.smtpPort || '587'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">From Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{emailSettings.fromName || 'CV Matcher'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">From Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{emailSettings.fromEmail || 'noreply@cvmatcher.com'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email Verification</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${emailSettings.enableEmailVerification ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {emailSettings.enableEmailVerification ? 'Enabled' : 'Disabled'}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email Notifications</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${emailSettings.enableNotifications ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {emailSettings.enableNotifications ? 'Enabled' : 'Disabled'}
                  </span>
                </dd>
              </div>
            </dl>
          )}
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
          </div>
          <button
            type="button"
            onClick={() => setActiveSection(activeSection === 'security' ? null : 'security')}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {activeSection === 'security' ? 'Cancel' : 'Edit'}
          </button>
        </div>
        
        <div className="px-6 py-5">
          {activeSection === 'security' ? (
            <form onSubmit={(e) => { e.preventDefault(); handleSave('security'); }}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label htmlFor="passwordMinLength" className="block text-sm font-medium text-gray-700">
                    Minimum Password Length
                  </label>
                  <input
                    type="number"
                    id="passwordMinLength"
                    min="6"
                    max="32"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    id="sessionTimeout"
                    min="15"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="maxLoginAttempts" className="block text-sm font-medium text-gray-700">
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    id="maxLoginAttempts"
                    min="3"
                    max="10"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="passwordRequireUppercase"
                        name="passwordRequireUppercase"
                        type="checkbox"
                        checked={securitySettings.passwordRequireUppercase}
                        onChange={(e) => handleInputChange('security', 'passwordRequireUppercase', e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="passwordRequireUppercase" className="font-medium text-gray-700">
                        Require Uppercase Letters
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="passwordRequireNumbers"
                        name="passwordRequireNumbers"
                        type="checkbox"
                        checked={securitySettings.passwordRequireNumbers}
                        onChange={(e) => handleInputChange('security', 'passwordRequireNumbers', e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="passwordRequireNumbers" className="font-medium text-gray-700">
                        Require Numbers
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="passwordRequireSpecial"
                        name="passwordRequireSpecial"
                        type="checkbox"
                        checked={securitySettings.passwordRequireSpecial}
                        onChange={(e) => handleInputChange('security', 'passwordRequireSpecial', e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="passwordRequireSpecial" className="font-medium text-gray-700">
                        Require Special Characters
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="enableTwoFactor"
                        name="enableTwoFactor"
                        type="checkbox"
                        checked={securitySettings.enableTwoFactor}
                        onChange={(e) => handleInputChange('security', 'enableTwoFactor', e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="enableTwoFactor" className="font-medium text-gray-700">
                        Enable Two-Factor Authentication
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="enableCaptcha"
                        name="enableCaptcha"
                        type="checkbox"
                        checked={securitySettings.enableCaptcha}
                        onChange={(e) => handleInputChange('security', 'enableCaptcha', e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="enableCaptcha" className="font-medium text-gray-700">
                        Enable CAPTCHA on Forms
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="sm:col-span-6">
                  <label htmlFor="jwtSecret" className="block text-sm font-medium text-gray-700">
                    JWT Secret Key
                  </label>
                  <input
                    type="password"
                    id="jwtSecret"
                    value={securitySettings.jwtSecret}
                    onChange={(e) => handleInputChange('security', 'jwtSecret', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-6">
                  <label htmlFor="allowedOrigins" className="block text-sm font-medium text-gray-700">
                    Allowed Origins (CORS)
                  </label>
                  <input
                    type="text"
                    id="allowedOrigins"
                    value={securitySettings.allowedOrigins}
                    onChange={(e) => handleInputChange('security', 'allowedOrigins', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="* for all, or comma-separated list of origins"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveSection(null)}
                  className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          ) : (
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Minimum Password Length</dt>
                <dd className="mt-1 text-sm text-gray-900">{securitySettings.passwordMinLength}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Session Timeout</dt>
                <dd className="mt-1 text-sm text-gray-900">{securitySettings.sessionTimeout} minutes</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Max Login Attempts</dt>
                <dd className="mt-1 text-sm text-gray-900">{securitySettings.maxLoginAttempts}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Require Uppercase</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${securitySettings.passwordRequireUppercase ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {securitySettings.passwordRequireUppercase ? 'Yes' : 'No'}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Require Numbers</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${securitySettings.passwordRequireNumbers ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {securitySettings.passwordRequireNumbers ? 'Yes' : 'No'}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Require Special Characters</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${securitySettings.passwordRequireSpecial ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {securitySettings.passwordRequireSpecial ? 'Yes' : 'No'}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Two-Factor Authentication</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${securitySettings.enableTwoFactor ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {securitySettings.enableTwoFactor ? 'Enabled' : 'Disabled'}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">CAPTCHA</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${securitySettings.enableCaptcha ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {securitySettings.enableCaptcha ? 'Enabled' : 'Disabled'}
                  </span>
                </dd>
              </div>
            </dl>
          )}
        </div>
      </div>

      {/* Registration Settings */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <UserPlus className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Registration Settings</h2>
          </div>
          <button
            type="button"
            onClick={() => setActiveSection(activeSection === 'registration' ? null : 'registration')}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {activeSection === 'registration' ? 'Cancel' : 'Edit'}
          </button>
        </div>
        
        <div className="px-6 py-5">
          {activeSection === 'registration' ? (
            <form onSubmit={(e) => { e.preventDefault(); handleSave('registration'); }}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="allowRegistration"
                        name="allowRegistration"
                        type="checkbox"
                        checked={registrationSettings.allowRegistration}
                        onChange={(e) => handleInputChange('registration', 'allowRegistration', e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="allowRegistration" className="font-medium text-gray-700">
                        Allow Public Registration
                      </label>
                      <p className="text-gray-500">If disabled, only admins can create accounts</p>
                    </div>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="requireEmailVerification"
                        name="requireEmailVerification"
                        type="checkbox"
                        checked={registrationSettings.requireEmailVerification}
                        onChange={(e) => handleInputChange('registration', 'requireEmailVerification', e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="requireEmailVerification" className="font-medium text-gray-700">
                        Require Email Verification
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="autoApproveCandidate"
                        name="autoApproveCandidate"
                        type="checkbox"
                        checked={registrationSettings.autoApproveCandidate}
                        onChange={(e) => handleInputChange('registration', 'autoApproveCandidate', e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="autoApproveCandidate" className="font-medium text-gray-700">
                        Auto-Approve Candidates
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="autoApproveEmployers"
                        name="autoApproveEmployers"
                        type="checkbox"
                        checked={registrationSettings.autoApproveEmployers}
                        onChange={(e) => handleInputChange('registration', 'autoApproveEmployers', e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="autoApproveEmployers" className="font-medium text-gray-700">
                        Auto-Approve Employers
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="welcomeEmailEnabled"
                        name="welcomeEmailEnabled"
                        type="checkbox"
                        checked={registrationSettings.welcomeEmailEnabled}
                        onChange={(e) => handleInputChange('registration', 'welcomeEmailEnabled', e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="welcomeEmailEnabled" className="font-medium text-gray-700">
                        Send Welcome Email
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="allowSocialLogin"
                        name="allowSocialLogin"
                        type="checkbox"
                        checked={registrationSettings.allowSocialLogin}
                        onChange={(e) => handleInputChange('registration', 'allowSocialLogin', e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="allowSocialLogin" className="font-medium text-gray-700">
                        Allow Social Login
                      </label>
                      <p className="text-gray-500">Google, Facebook, LinkedIn, etc.</p>
                    </div>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="termsUrl" className="block text-sm font-medium text-gray-700">
                    Terms & Conditions URL
                  </label>
                  <input
                    type="text"
                    id="termsUrl"
                    value={registrationSettings.termsUrl}
                    onChange={(e) => handleInputChange('registration', 'termsUrl', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="privacyUrl" className="block text-sm font-medium text-gray-700">
                    Privacy Policy URL
                  </label>
                  <input
                    type="text"
                    id="privacyUrl"
                    value={registrationSettings.privacyUrl}
                    onChange={(e) => handleInputChange('registration', 'privacyUrl', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveSection(null)}
                  className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          ) : (
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Public Registration</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${registrationSettings.allowRegistration ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {registrationSettings.allowRegistration ? 'Enabled' : 'Disabled'}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email Verification</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${registrationSettings.requireEmailVerification ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {registrationSettings.requireEmailVerification ? 'Required' : 'Optional'}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Auto-Approve Candidates</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${registrationSettings.autoApproveCandidate ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {registrationSettings.autoApproveCandidate ? 'Yes' : 'No'}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Auto-Approve Employers</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${registrationSettings.autoApproveEmployers ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {registrationSettings.autoApproveEmployers ? 'Yes' : 'No'}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Social Login</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${registrationSettings.allowSocialLogin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {registrationSettings.allowSocialLogin ? 'Enabled' : 'Disabled'}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Welcome Email</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${registrationSettings.welcomeEmailEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {registrationSettings.welcomeEmailEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </dd>
              </div>
            </dl>
          )}
        </div>
      </div>

      {/* Matching Algorithm Settings */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <BarChart2 className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Matching Algorithm Settings</h2>
          </div>
          <button
            type="button"
            onClick={() => setActiveSection(activeSection === 'matching' ? null : 'matching')}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {activeSection === 'matching' ? 'Cancel' : 'Edit'}
          </button>
        </div>
        
        <div className="px-6 py-5">
          {activeSection === 'matching' ? (
            <form onSubmit={(e) => { e.preventDefault(); handleSave('matching'); }}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="minimumMatchScore" className="block text-sm font-medium text-gray-700">
                    Minimum Match Score (%)
                  </label>
                  <input
                    type="number"
                    id="minimumMatchScore"
                    min="0"
                    max="100"
                    value={matchingSettings.minimumMatchScore}
                    onChange={(e) => handleInputChange('matching', 'minimumMatchScore', parseInt(e.target.value))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="matchingFrequency" className="block text-sm font-medium text-gray-700">
                    Matching Frequency
                  </label>
                  <select
                    id="matchingFrequency"
                    name="matchingFrequency"
                    value={matchingSettings.matchingFrequency}
                    onChange={(e) => handleInputChange('matching', 'matchingFrequency', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                
                <div className="sm:col-span-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Matching Weights (should total 100%)</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="skillsWeight" className="block text-sm font-medium text-gray-700">
                        Skills Weight
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="number"
                          id="skillsWeight"
                          name="skillsWeight"
                          min="0"
                          max="100"
                          value={matchingSettings.skillsWeight}
                          onChange={(e) => handleInputChange('matching', 'skillsWeight', parseInt(e.target.value))}
                          className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                        />
                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                          %
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="experienceWeight" className="block text-sm font-medium text-gray-700">
                        Experience Weight
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="number"
                          id="experienceWeight"
                          name="experienceWeight"
                          min="0"
                          max="100"
                          value={matchingSettings.experienceWeight}
                          onChange={(e) => handleInputChange('matching', 'experienceWeight', parseInt(e.target.value))}
                          className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                        />
                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                          %
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="educationWeight" className="block text-sm font-medium text-gray-700">
                        Education Weight
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="number"
                          id="educationWeight"
                          name="educationWeight"
                          min="0"
                          max="100"
                          value={matchingSettings.educationWeight}
                          onChange={(e) => handleInputChange('matching', 'educationWeight', parseInt(e.target.value))}
                          className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                        />
                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                          %
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="locationWeight" className="block text-sm font-medium text-gray-700">
                        Location Weight
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="number"
                          id="locationWeight"
                          name="locationWeight"
                          min="0"
                          max="100"
                          value={matchingSettings.locationWeight}
                          onChange={(e) => handleInputChange('matching', 'locationWeight', parseInt(e.target.value))}
                          className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                        />
                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-500">
                    Total: {matchingSettings.skillsWeight + matchingSettings.experienceWeight + matchingSettings.educationWeight + matchingSettings.locationWeight}%
                    {(matchingSettings.skillsWeight + matchingSettings.experienceWeight + matchingSettings.educationWeight + matchingSettings.locationWeight) !== 100 && (
                      <span className="text-red-500 ml-2">
                        (Should be 100%)
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="enableAutomaticMatching"
                        name="enableAutomaticMatching"
                        type="checkbox"
                        checked={matchingSettings.enableAutomaticMatching}
                        onChange={(e) => handleInputChange('matching', 'enableAutomaticMatching', e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="enableAutomaticMatching" className="font-medium text-gray-700">
                        Enable Automatic Matching
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="notifyUsersOnNewMatches"
                        name="notifyUsersOnNewMatches"
                        type="checkbox"
                        checked={matchingSettings.notifyUsersOnNewMatches}
                        onChange={(e) => handleInputChange('matching', 'notifyUsersOnNewMatches', e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="notifyUsersOnNewMatches" className="font-medium text-gray-700">
                        Notify Users on New Matches
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="useAI"
                        name="useAI"
                        type="checkbox"
                        checked={matchingSettings.useAI}
                        onChange={(e) => handleInputChange('matching', 'useAI', e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="useAI" className="font-medium text-gray-700">
                        Use AI for Enhanced Matching
                      </label>
                      <p className="text-gray-500">Uses machine learning to improve matching accuracy</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveSection(null)}
                  className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          ) : (
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Minimum Match Score</dt>
                <dd className="mt-1 text-sm text-gray-900">{matchingSettings.minimumMatchScore}%</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Matching Frequency</dt>
                <dd className="mt-1 text-sm text-gray-900">{matchingSettings.matchingFrequency.charAt(0).toUpperCase() + matchingSettings.matchingFrequency.slice(1)}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Matching Weights</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <span className="text-xs text-gray-500">Skills</span>
                      <div className="text-sm font-medium">{matchingSettings.skillsWeight}%</div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Experience</span>
                      <div className="text-sm font-medium">{matchingSettings.experienceWeight}%</div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Education</span>
                      <div className="text-sm font-medium">{matchingSettings.educationWeight}%</div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Location</span>
                      <div className="text-sm font-medium">{matchingSettings.locationWeight}%</div>
                    </div>
                  </div>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Automatic Matching</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${matchingSettings.enableAutomaticMatching ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {matchingSettings.enableAutomaticMatching ? 'Enabled' : 'Disabled'}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">AI-Enhanced Matching</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${matchingSettings.useAI ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {matchingSettings.useAI ? 'Enabled' : 'Disabled'}
                  </span>
                </dd>
              </div>
            </dl>
          )}
        </div>
      </div>

      {/* Data Management Settings */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <Database className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Data Management</h2>
          </div>
          <button
            type="button"
            onClick={() => setActiveSection(activeSection === 'data' ? null : 'data')}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {activeSection === 'data' ? 'Cancel' : 'Edit'}
          </button>
        </div>
        
        <div className="px-6 py-5">
          {activeSection === 'data' ? (
            <form onSubmit={(e) => { e.preventDefault(); handleSave('data'); }}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="cvRetentionPeriod" className="block text-sm font-medium text-gray-700">
                    CV Retention Period (days)
                  </label>
                  <input
                    type="number"
                    id="cvRetentionPeriod"
                    min="30"
                    value={dataSettings.cvRetentionPeriod}
                    onChange={(e) => handleInputChange('data', 'cvRetentionPeriod', parseInt(e.target.value))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    CVs will be deleted after this many days unless manually retained.
                  </p>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="jobRetentionPeriod" className="block text-sm font-medium text-gray-700">
                    Job Retention Period (days)
                  </label>
                  <input
                    type="number"
                    id="jobRetentionPeriod"
                    min="30"
                    value={dataSettings.jobRetentionPeriod}
                    onChange={(e) => handleInputChange('data', 'jobRetentionPeriod', parseInt(e.target.value))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Expired jobs will be deleted after this many days.
                  </p>
                </div>
                
                <div className="sm:col-span-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="automaticBackup"
                        name="automaticBackup"
                        type="checkbox"
                        checked={dataSettings.automaticBackup}
                        onChange={(e) => handleInputChange('data', 'automaticBackup', e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="automaticBackup" className="font-medium text-gray-700">
                        Enable Automatic Backups
                      </label>
                    </div>
                  </div>
                </div>
                
                {dataSettings.automaticBackup && (
                  <>
                    <div className="sm:col-span-3">
                      <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700">
                        Backup Frequency
                      </label>
                      <select
                        id="backupFrequency"
                        name="backupFrequency"
                        value={dataSettings.backupFrequency}
                        onChange={(e) => handleInputChange('data', 'backupFrequency', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="backupRetention" className="block text-sm font-medium text-gray-700">
                        Backup Retention (days)
                      </label>
                      <input
                        type="number"
                        id="backupRetention"
                        min="1"
                        value={dataSettings.backupRetention}
                        onChange={(e) => handleInputChange('data', 'backupRetention', parseInt(e.target.value))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </>
                )}
                
                <div className="sm:col-span-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="dataExportEnabled"
                        name="dataExportEnabled"
                        type="checkbox"
                        checked={dataSettings.dataExportEnabled}
                        onChange={(e) => handleInputChange('data', 'dataExportEnabled', e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="dataExportEnabled" className="font-medium text-gray-700">
                        Enable User Data Export
                      </label>
                      <p className="text-gray-500">Allow users to export their data</p>
                    </div>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="anonymizeDeletedUsers"
                        name="anonymizeDeletedUsers"
                        type="checkbox"
                        checked={dataSettings.anonymizeDeletedUsers}
                        onChange={(e) => handleInputChange('data', 'anonymizeDeletedUsers', e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="anonymizeDeletedUsers" className="font-medium text-gray-700">
                        Anonymize Deleted Users
                      </label>
                      <p className="text-gray-500">
                        Instead of removing data immediately, anonymize it first
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveSection(null)}

                  className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          ) : (
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">CV Retention</dt>
                <dd className="mt-1 text-sm text-gray-900">{dataSettings.cvRetentionPeriod} days</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Job Retention</dt>
                <dd className="mt-1 text-sm text-gray-900">{dataSettings.jobRetentionPeriod} days</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Automatic Backups</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${dataSettings.automaticBackup ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {dataSettings.automaticBackup ? 'Enabled' : 'Disabled'}
                  </span>
                  {dataSettings.automaticBackup && (
                    <span className="ml-2 text-gray-500">
                      {dataSettings.backupFrequency.charAt(0).toUpperCase() + dataSettings.backupFrequency.slice(1)}
                    </span>
                  )}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Data Export</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${dataSettings.dataExportEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {dataSettings.dataExportEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </dd>
              </div>
            </dl>
          )}
        </div>
        
        {/* Data Management Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Data Management Actions</h3>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setDataType('expired');
                setShowClearDataModal(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Clock className="mr-2 h-4 w-4 text-gray-500" />
              Clear Expired Data
            </button>
            <button
              type="button"
              onClick={() => {
                setDataType('analytics');
                setShowClearDataModal(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <BarChart2 className="mr-2 h-4 w-4 text-gray-500" />
              Clear Analytics Data
            </button>
          </div>
        </div>
      </div>

      {/* Reset Settings Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset All Settings"
      >
        <div className="flex items-center justify-center text-yellow-500 mb-4">
          <AlertTriangle className="h-12 w-12" />
        </div>
        <h3 className="text-lg font-medium text-center text-gray-900">Confirm Reset</h3>
        <p className="mt-2 text-center text-gray-500">
          Are you sure you want to reset all settings to their default values? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setShowResetModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            onClick={handleResetSettings}
          >
            Reset All Settings
          </button>
        </div>
      </Modal>

      {/* Clear Data Modal */}
      <Modal
        isOpen={showClearDataModal}
        onClose={() => setShowClearDataModal(false)}
        title={`Clear ${dataType === 'expired' ? 'Expired' : 'Analytics'} Data`}
      >
        <div className="flex items-center justify-center text-red-500 mb-4">
          <Trash2 className="h-12 w-12" />
        </div>
        <h3 className="text-lg font-medium text-center text-gray-900">Confirm Data Deletion</h3>
        <p className="mt-2 text-center text-gray-500">
          {dataType === 'expired' 
            ? 'This will permanently delete all expired CVs, jobs, and user accounts. This action cannot be undone.'
            : 'This will permanently delete all analytics data, including user activity logs, page views, and system metrics. This action cannot be undone.'}
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setShowClearDataModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={handleClearData}
          >
            Delete Data
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;