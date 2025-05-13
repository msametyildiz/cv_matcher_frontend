/**
 * Application constants
 */

/**
 * Authentication related constants
 */
export const AUTH = {
  TOKEN_KEY: 'token',
  USER_KEY: 'user',
  ROLES: {
    ADMIN: 'admin',
    EMPLOYER: 'employer',
    CANDIDATE: 'candidate'
  },
  SESSION_TIMEOUT: 60 * 60 * 1000, // 1 hour in milliseconds
  MINIMUM_PASSWORD_LENGTH: 8
};

/**
 * API related constants
 */
export const API = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  TIMEOUT: 30000, // 30 seconds
  RETRY_COUNT: 3,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH_TOKEN: '/auth/refresh',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      PROFILE: '/auth/profile'
    },
    CV: {
      UPLOAD: '/cv/upload',
      LIST: '/cv/my-cvs',
      DOWNLOAD: '/cv/:id/download',
      DELETE: '/cv/:id'
    },
    JOB: {
      CREATE: '/jobs',
      UPDATE: '/jobs/:id',
      DELETE: '/jobs/:id',
      LIST: '/jobs',
      SEARCH: '/jobs/search',
      RECOMMENDED: '/jobs/recommended',
      APPLY: '/jobs/:id/apply'
    },
    MATCHING: {
      BY_JOB: '/matching/job/:id',
      BY_CV: '/matching/cv/:id',
      DETAILED: '/matching/result/:cvId/:jobId',
      MATCH: '/matching/match'
    },
    ADMIN: {
      DASHBOARD: '/admin/dashboard',
      USERS: '/admin/users',
      JOBS: '/admin/jobs',
      CVS: '/admin/cvs',
      CONFIG: '/admin/config',
      STATS: '/admin/stats'
    }
  }
};

/**
 * Route paths
 */
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  DASHBOARD: '/dashboard',
  CANDIDATE: {
    BASE: '/candidate',
    DASHBOARD: '/candidate/dashboard',
    PROFILE: '/candidate/profile',
    CV: '/candidate/cv',
    CV_UPLOAD: '/candidate/cv/upload',
    JOBS: '/candidate/jobs',
    JOB_DETAIL: '/candidate/jobs/:jobId',
    APPLICATIONS: '/candidate/applications',
    INTERVIEWS: '/candidate/interviews',
    SETTINGS: '/candidate/settings'
  },
  EMPLOYER: {
    BASE: '/employer',
    DASHBOARD: '/employer/dashboard',
    JOBS: '/employer/jobs',
    JOB_CREATE: '/employer/jobs/create',
    JOB_EDIT: '/employer/jobs/:jobId/edit',
    JOB_DETAIL: '/employer/jobs/:jobId',
    CANDIDATES: '/employer/candidates',
    CANDIDATE_DETAIL: '/employer/candidates/:candidateId',
    INTERVIEWS: '/employer/interviews',
    SETTINGS: '/employer/settings'
  },
  ADMIN: {
    BASE: '/admin',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    JOBS: '/admin/jobs',
    CVS: '/admin/cvs',
    ANALYTICS: '/admin/analytics',
    SETTINGS: '/admin/settings'
  }
};

/**
 * File related constants
 */
export const FILE = {
  CV: {
    ALLOWED_TYPES: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ALLOWED_EXTENSIONS: ['.pdf', '.docx'],
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    MIME_TYPES: {
      PDF: 'application/pdf',
      DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }
  },
  IMAGE: {
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif'],
    MAX_SIZE: 2 * 1024 * 1024, // 2MB
    MIME_TYPES: {
      JPEG: 'image/jpeg',
      PNG: 'image/png',
      GIF: 'image/gif'
    }
  }
};

/**
 * Status constants for various entities
 */
export const STATUS = {
  USER: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended'
  },
  JOB: {
    ACTIVE: 'active',
    PAUSED: 'paused',
    CLOSED: 'closed',
    DRAFT: 'draft'
  },
  APPLICATION: {
    APPLIED: 'applied',
    REVIEWING: 'reviewing',
    INTERVIEW: 'interview',
    OFFERED: 'offered',
    HIRED: 'hired',
    REJECTED: 'rejected',
    WITHDRAWN: 'withdrawn'
  },
  INTERVIEW: {
    SCHEDULED: 'scheduled',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    RESCHEDULED: 'rescheduled'
  },
  CV: {
    PARSING: 'parsing',
    PARSED: 'parsed',
    FAILED: 'failed'
  }
};

/**
 * Job related constants
 */
export const JOB = {
  TYPES: [
    { id: 'full-time', label: 'Full-time' },
    { id: 'part-time', label: 'Part-time' },
    { id: 'contract', label: 'Contract' },
    { id: 'internship', label: 'Internship' },
    { id: 'freelance', label: 'Freelance' }
  ],
  EXPERIENCE_LEVELS: [
    { id: 'entry', label: 'Entry Level' },
    { id: 'mid', label: 'Mid Level' },
    { id: 'senior', label: 'Senior Level' },
    { id: 'executive', label: 'Executive' }
  ],
  DEFAULT_LISTING_DURATION: 30, // days
  DEFAULT_RESULTS_PER_PAGE: 10,
  MATCH_THRESHOLD: 50 // minimum matching percentage to show
};

/**
 * UI related constants
 */
export const UI = {
  TOAST_DURATION: 5000, // 5 seconds
  THEME: {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
  },
  ANIMATION: {
    DURATION: 300, // ms
    EASING: 'ease-in-out'
  },
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1536
  },
  SPACING: {
    XS: '0.25rem',
    SM: '0.5rem',
    MD: '1rem',
    LG: '1.5rem',
    XL: '2rem',
    XXL: '3rem'
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
  },
  TABLE: {
    DEFAULT_SORT_DIRECTION: 'desc'
  },
  DATE_FORMAT: {
    DISPLAY: 'MMM D, YYYY',
    TIME: 'h:mm A',
    DATETIME: 'MMM D, YYYY, h:mm A',
    API: 'YYYY-MM-DD'
  }
};

/**
 * Validation related constants
 */
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  },
  EMAIL: {
    MAX_LENGTH: 100,
    PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  },
  PHONE: {
    PATTERN: /^\+?[0-9]{10,15}$/
  },
  URL: {
    PATTERN: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/
  }
};

/**
 * Matching algorithm related constants
 */
export const MATCHING = {
  SKILL_WEIGHT: 0.5,
  EXPERIENCE_WEIGHT: 0.3,
  EDUCATION_WEIGHT: 0.2,
  SKILL_MATCH_THRESHOLD: 0.7,
  MAX_RECOMMENDATIONS: 10
};

/**
 * Error message constants
 */
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Unable to connect to the server. Please check your internet connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action. Please log in again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  SERVER: 'Server error. Please try again later.',
  FILE_SIZE: 'File size exceeds the maximum limit.',
  FILE_TYPE: 'File type is not supported.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  FORM_VALIDATION: 'Please fix the errors in the form before submitting.'
};

/**
 * Regular expression patterns
 */
export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  URL: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  PHONE: /^\+?[0-9]{10,15}$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  PASSWORD_STRENGTH: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

export default {
  AUTH,
  API,
  ROUTES,
  FILE,
  STATUS,
  JOB,
  UI,
  VALIDATION,
  MATCHING,
  ERROR_MESSAGES,
  REGEX
};