import React, { useState, useEffect } from 'react';
import { 
  Shield, Mail, Globe, BarChart2, 
  RefreshCw, AlertTriangle, Trash2, Clock
} from 'lucide-react'; // Remove Save, UserPlus, Database
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import ConfirmModal from '../../components/common/ConfirmModal';
import AdminPageLayout from '../../components/layouts/AdminPageLayout';
import SettingsSection from '../../components/settings/SettingsSection';
import { useNotification } from '../../contexts/NotificationContext';
import { defaultSettings } from '../../data/settingsData';

const Settings = () => {
  // Core state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showClearDataModal, setShowClearDataModal] = useState(false);
  const [dataType, setDataType] = useState('');
  const { success, error: showError } = useNotification();

  // Settings state objects for different sections
  const [settings, setSettings] = useState({
    general: defaultSettings.general,
    email: defaultSettings.email,
    security: defaultSettings.security,
    registration: defaultSettings.registration,
    matching: defaultSettings.matching,
    data: defaultSettings.data
  });

  // Load settings
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app: const response = await api.admin.getSettings();
        // For demo purposes, use defaults with a loading delay
        setTimeout(() => {
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

  // Update setting section
  const updateSettingSection = (section, newValues) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], ...newValues }
    }));
  };

  // Handle save for a section
  const handleSave = async (section) => {
    try {
      // In a real app: await api.admin.updateSettings(section, settings[section]);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings updated successfully`);
      setActiveSection(null);
    } catch (err) {
      showError(`Failed to update ${section} settings`);
    }
  };

  // Handle reset settings
  const handleResetSettings = async () => {
    try {
      // In a real app: await api.admin.resetSettings();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSettings(defaultSettings);
      success('Settings reset to default values');
      setShowResetModal(false);
    } catch (error) {
      showError('Failed to reset settings');
    }
  };

  // Handle clear data
  const handleClearData = async () => {
    try {
      // In a real app: await api.admin.clearData(dataType);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      success(`${dataType} data cleared successfully`);
      setShowClearDataModal(false);
    } catch (error) {
      showError('Failed to clear data');
    }
  };

  // Settings sections configuration
  const settingsSections = [
    {
      id: 'general',
      title: 'General Settings',
      icon: <Globe className="h-5 w-5 text-gray-400 mr-2" />,
      formFields: [
        { id: 'siteName', label: 'Site Name', type: 'text' },
        { id: 'contactEmail', label: 'Contact Email', type: 'email' },
        { id: 'siteDescription', label: 'Site Description', type: 'textarea', rows: 3 },
        { id: 'logoUrl', label: 'Logo URL', type: 'text' },
        { id: 'faviconUrl', label: 'Favicon URL', type: 'text' },
        { id: 'supportEmail', label: 'Support Email', type: 'email' },
        { id: 'maintenanceMode', label: 'Maintenance Mode', type: 'checkbox', 
          description: 'Enable to temporarily disable the site for maintenance' }
      ],
      displayItems: [
        { label: 'Site Name', value: settings.general.siteName || 'CV Matcher' },
        { label: 'Contact Email', value: settings.general.contactEmail || 'contact@cvmatcher.com' },
        { label: 'Site Description', value: settings.general.siteDescription || 'A platform for matching job seekers with employers' },
        { label: 'Support Email', value: settings.general.supportEmail || 'support@cvmatcher.com' },
        { 
          label: 'Maintenance Mode', 
          value: settings.general.maintenanceMode ? 'Enabled' : 'Disabled',
          badge: true,
          badgeColor: settings.general.maintenanceMode ? 'red' : 'green'
        }
      ]
    },
    {
      id: 'email',
      title: 'Email Settings',
      icon: <Mail className="h-5 w-5 text-gray-400 mr-2" />,
      formFields: [
        { id: 'smtpServer', label: 'SMTP Server', type: 'text' },
        { id: 'smtpPort', label: 'SMTP Port', type: 'text' },
        { id: 'smtpUsername', label: 'SMTP Username', type: 'text' },
        { id: 'smtpPassword', label: 'SMTP Password', type: 'password' },
        { id: 'fromName', label: 'From Name', type: 'text' },
        { id: 'fromEmail', label: 'From Email', type: 'email' },
        { id: 'emailFooter', label: 'Email Footer', type: 'textarea', rows: 3 },
        { id: 'smtpSecure', label: 'Use Secure Connection (TLS/SSL)', type: 'checkbox' },
        { id: 'enableEmailVerification', label: 'Enable Email Verification', type: 'checkbox' },
        { id: 'enableNotifications', label: 'Enable Email Notifications', type: 'checkbox' }
      ],
      displayItems: [
        { label: 'SMTP Server', value: settings.email.smtpServer || 'smtp.example.com' },
        { label: 'SMTP Port', value: settings.email.smtpPort || '587' },
        { label: 'From Name', value: settings.email.fromName || 'CV Matcher' },
        { label: 'From Email', value: settings.email.fromEmail || 'noreply@cvmatcher.com' },
        { 
          label: 'Email Verification', 
          value: settings.email.enableEmailVerification ? 'Enabled' : 'Disabled',
          badge: true, 
          badgeColor: settings.email.enableEmailVerification ? 'green' : 'red' 
        },
        { 
          label: 'Email Notifications', 
          value: settings.email.enableNotifications ? 'Enabled' : 'Disabled',
          badge: true, 
          badgeColor: settings.email.enableNotifications ? 'green' : 'red' 
        }
      ]
    },
    {
      id: 'security',
      title: 'Security Settings',
      icon: <Shield className="h-5 w-5 text-gray-400 mr-2" />,
      formFields: [
        { id: 'passwordMinLength', label: 'Minimum Password Length', type: 'number', min: 6, max: 32 },
        { id: 'sessionTimeout', label: 'Session Timeout (minutes)', type: 'number', min: 15 },
        { id: 'maxLoginAttempts', label: 'Max Login Attempts', type: 'number', min: 3, max: 10 },
        { id: 'passwordRequireUppercase', label: 'Require Uppercase Letters', type: 'checkbox' },
        { id: 'passwordRequireNumbers', label: 'Require Numbers', type: 'checkbox' },
        { id: 'passwordRequireSpecial', label: 'Require Special Characters', type: 'checkbox' },
        { id: 'enableTwoFactor', label: 'Enable Two-Factor Authentication', type: 'checkbox' },
        { id: 'enableCaptcha', label: 'Enable CAPTCHA on Forms', type: 'checkbox' },
        { id: 'jwtSecret', label: 'JWT Secret Key', type: 'password' },
        { id: 'allowedOrigins', label: 'Allowed Origins (CORS)', type: 'text', 
          placeholder: '* for all, or comma-separated list of origins' }
      ],
      displayItems: [
        { label: 'Minimum Password Length', value: settings.security.passwordMinLength },
        { label: 'Session Timeout', value: `${settings.security.sessionTimeout} minutes` },
        { label: 'Max Login Attempts', value: settings.security.maxLoginAttempts },
        { 
          label: 'Require Uppercase', 
          value: settings.security.passwordRequireUppercase ? 'Yes' : 'No',
          badge: true, 
          badgeColor: settings.security.passwordRequireUppercase ? 'green' : 'red' 
        },
        { 
          label: 'Require Numbers', 
          value: settings.security.passwordRequireNumbers ? 'Yes' : 'No',
          badge: true, 
          badgeColor: settings.security.passwordRequireNumbers ? 'green' : 'red' 
        },
        { 
          label: 'Require Special Characters', 
          value: settings.security.passwordRequireSpecial ? 'Yes' : 'No',
          badge: true, 
          badgeColor: settings.security.passwordRequireSpecial ? 'green' : 'red' 
        }
      ]
    },
    // Additional sections omitted for brevity but would follow same pattern
  ];

  return (
    <AdminPageLayout
      title="System Settings"
      actionButton={
        <button
          onClick={() => setShowResetModal(true)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset to Defaults
        </button>
      }
    >
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="space-y-6">
          {/* Map through and render settings sections */}
          {settingsSections.map(section => (
            <SettingsSection
              key={section.id}
              title={section.title}
              icon={section.icon}
              isEditing={activeSection === section.id}
              onEdit={() => setActiveSection(activeSection === section.id ? null : section.id)}
              onSave={() => handleSave(section.id)}
              formFields={section.formFields}
              displayItems={section.displayItems}
              values={settings[section.id]}
              onChange={(field, value) => {
                const updatedValues = { [field]: value };
                updateSettingSection(section.id, updatedValues);
              }}
            />
          ))}

          {/* Data Management Actions */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Data Management Actions</h3>
            </div>
            <div className="px-6 py-4 bg-gray-50">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setDataType('expired');
                    setShowClearDataModal(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
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
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <BarChart2 className="mr-2 h-4 w-4 text-gray-500" />
                  Clear Analytics Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Settings Modal */}
      <ConfirmModal
        isOpen={showResetModal}
        title="Reset All Settings"
        icon={<AlertTriangle className="h-12 w-12 text-yellow-500" />}
        message="Are you sure you want to reset all settings to their default values? This action cannot be undone."
        confirmText="Reset All Settings"
        confirmVariant="warning"
        onConfirm={handleResetSettings}
        onClose={() => setShowResetModal(false)}
      />

      {/* Clear Data Modal */}
      <ConfirmModal
        isOpen={showClearDataModal}
        title={`Clear ${dataType === 'expired' ? 'Expired' : 'Analytics'} Data`}
        icon={<Trash2 className="h-12 w-12 text-red-500" />}
        message={
          dataType === 'expired' 
            ? 'This will permanently delete all expired CVs, jobs, and user accounts. This action cannot be undone.'
            : 'This will permanently delete all analytics data, including user activity logs, page views, and system metrics. This action cannot be undone.'
        }
        confirmText="Delete Data"
        confirmVariant="danger"
        onConfirm={handleClearData}
        onClose={() => setShowClearDataModal(false)}
      />
    </AdminPageLayout>
  );
};

export default Settings;