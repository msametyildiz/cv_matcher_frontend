// Mock data for the Admin Settings page

export const settingsData = {
  generalSettings: {
    id: 'general',
    title: 'General Settings',
    description: 'Configure basic system settings',
    settings: [
      {
        id: 'siteName',
        label: 'Site Name',
        type: 'text',
        value: 'CV Matcher',
        help: 'The name displayed throughout the application'
      },
      {
        id: 'maintenanceMode',
        label: 'Maintenance Mode',
        type: 'toggle',
        value: false,
        help: 'Put the site in maintenance mode (only administrators can access)'
      },
      {
        id: 'defaultLanguage',
        label: 'Default Language',
        type: 'select',
        value: 'en',
        options: [
          { label: 'English', value: 'en' },
          { label: 'Spanish', value: 'es' },
          { label: 'French', value: 'fr' },
          { label: 'German', value: 'de' }
        ],
        help: 'Default language for the application'
      },
      {
        id: 'itemsPerPage',
        label: 'Items Per Page',
        type: 'select',
        value: '10',
        options: [
          { label: '5', value: '5' },
          { label: '10', value: '10' },
          { label: '25', value: '25' },
          { label: '50', value: '50' },
          { label: '100', value: '100' }
        ],
        help: 'Default number of items to show per page in tables and lists'
      }
    ]
  },
  userSettings: {
    id: 'user',
    title: 'User Settings',
    description: 'Manage user account settings and permissions',
    settings: [
      {
        id: 'enableRegistration',
        label: 'Enable Registration',
        type: 'toggle',
        value: true,
        help: 'Allow new users to register'
      },
      {
        id: 'requireEmailVerification',
        label: 'Require Email Verification',
        type: 'toggle',
        value: true,
        help: 'Require users to verify their email address before they can log in'
      },
      {
        id: 'accountApproval',
        label: 'Account Approval',
        type: 'select',
        value: 'automatic',
        options: [
          { label: 'Automatic', value: 'automatic' },
          { label: 'Manual Approval', value: 'manual' },
          { label: 'Disabled', value: 'disabled' }
        ],
        help: 'How new accounts are approved'
      },
      {
        id: 'passwordPolicy',
        label: 'Password Policy',
        type: 'select',
        value: 'strong',
        options: [
          { label: 'Basic', value: 'basic' },
          { label: 'Medium', value: 'medium' },
          { label: 'Strong', value: 'strong' }
        ],
        help: 'Password complexity requirements'
      },
      {
        id: 'sessionTimeout',
        label: 'Session Timeout (minutes)',
        type: 'number',
        value: 60,
        min: 5,
        max: 1440,
        help: 'Time before inactive users are automatically logged out'
      }
    ]
  },
  jobSettings: {
    id: 'job',
    title: 'Job Posting Settings',
    description: 'Configure job posting behavior',
    settings: [
      {
        id: 'jobApproval',
        label: 'Job Approval',
        type: 'select',
        value: 'automatic',
        options: [
          { label: 'Automatic', value: 'automatic' },
          { label: 'Manual Approval', value: 'manual' }
        ],
        help: 'How new job postings are approved'
      },
      {
        id: 'jobExpiryDays',
        label: 'Job Expiry (days)',
        type: 'number',
        value: 30,
        min: 1,
        max: 180,
        help: 'Number of days before job postings expire'
      },
      {
        id: 'allowJobReposting',
        label: 'Allow Job Reposting',
        type: 'toggle',
        value: true,
        help: 'Allow employers to repost expired jobs'
      },
      {
        id: 'maxActiveJobs',
        label: 'Max Active Jobs per Employer',
        type: 'number',
        value: 10,
        min: 1,
        max: 100,
        help: 'Maximum number of active job postings allowed per employer'
      }
    ]
  },
  emailSettings: {
    id: 'email',
    title: 'Email Settings',
    description: 'Configure email delivery and notifications',
    settings: [
      {
        id: 'emailProvider',
        label: 'Email Provider',
        type: 'select',
        value: 'smtp',
        options: [
          { label: 'SMTP', value: 'smtp' },
          { label: 'Mailgun', value: 'mailgun' },
          { label: 'SendGrid', value: 'sendgrid' },
          { label: 'SES', value: 'ses' }
        ],
        help: 'Email delivery service'
      },
      {
        id: 'smtpHost',
        label: 'SMTP Host',
        type: 'text',
        value: 'smtp.example.com',
        help: 'SMTP server hostname'
      },
      {
        id: 'smtpPort',
        label: 'SMTP Port',
        type: 'number',
        value: 587,
        min: 1,
        max: 65535,
        help: 'SMTP server port'
      },
      {
        id: 'senderEmail',
        label: 'Sender Email',
        type: 'text',
        value: 'no-reply@example.com',
        help: 'Email address used to send system emails'
      },
      {
        id: 'senderName',
        label: 'Sender Name',
        type: 'text',
        value: 'CV Matcher',
        help: 'Name displayed in the From field of system emails'
      }
    ]
  },
  systemSettings: {
    id: 'system',
    title: 'System Settings',
    description: 'Technical configuration for the system',
    settings: [
      {
        id: 'debugMode',
        label: 'Debug Mode',
        type: 'toggle',
        value: false,
        help: 'Enable detailed error reporting and logging'
      },
      {
        id: 'logLevel',
        label: 'Log Level',
        type: 'select',
        value: 'error',
        options: [
          { label: 'Emergency', value: 'emergency' },
          { label: 'Alert', value: 'alert' },
          { label: 'Critical', value: 'critical' },
          { label: 'Error', value: 'error' },
          { label: 'Warning', value: 'warning' },
          { label: 'Notice', value: 'notice' },
          { label: 'Info', value: 'info' },
          { label: 'Debug', value: 'debug' }
        ],
        help: 'Minimum log level to capture'
      },
      {
        id: 'cacheDuration',
        label: 'Cache Duration (seconds)',
        type: 'number',
        value: 3600,
        min: 0,
        max: 86400,
        help: 'Time to cache data to improve performance'
      },
      {
        id: 'backupFrequency',
        label: 'Backup Frequency',
        type: 'select',
        value: 'daily',
        options: [
          { label: 'Hourly', value: 'hourly' },
          { label: 'Daily', value: 'daily' },
          { label: 'Weekly', value: 'weekly' },
          { label: 'Monthly', value: 'monthly' }
        ],
        help: 'How often to backup system data'
      }
    ]
  }
};

// Add defaultSettings export
export const defaultSettings = {
  general: {
    siteName: 'CV Matcher',
    maintenanceMode: false,
    defaultLanguage: 'en',
    itemsPerPage: '10'
  },
  user: {
    enableRegistration: true,
    requireEmailVerification: true,
    accountApproval: 'automatic',
    passwordPolicy: 'strong',
    sessionTimeout: 60
  },
  job: {
    jobApproval: 'automatic',
    jobExpiryDays: 30,
    allowJobReposting: true,
    maxActiveJobs: 10
  },
  email: {
    emailProvider: 'smtp',
    smtpHost: 'smtp.example.com',
    smtpPort: 587,
    senderEmail: 'no-reply@example.com',
    senderName: 'CV Matcher'
  },
  system: {
    debugMode: false,
    logLevel: 'error',
    cacheDuration: 3600,
    backupFrequency: 'daily'
  }
};

// Make sure it's included in the default export as well
export default {
  ...settingsData,
  defaultSettings,
};
