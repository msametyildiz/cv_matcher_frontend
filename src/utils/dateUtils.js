/**
 * Formats a date into a readable string
 * @param {Date|string} date - The date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  // Default options
  const defaultOptions = {
    format: 'medium', // 'short', 'medium', 'long', 'full'
    includeTime: false
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Predefined formats
  const formats = {
    short: { year: 'numeric', month: 'numeric', day: 'numeric' },
    medium: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  };
  
  let dateFormatOptions = formats[mergedOptions.format] || formats.medium;
  
  if (mergedOptions.includeTime) {
    dateFormatOptions = {
      ...dateFormatOptions,
      hour: '2-digit',
      minute: '2-digit'
    };
  }
  
  return new Intl.DateTimeFormat('en-US', dateFormatOptions).format(dateObj);
};

/**
 * Gets a human-readable time ago string (e.g., "2 days ago")
 * @param {Date|string} date - The date to calculate from
 * @returns {string} Human-readable time ago
 */
export const getTimeAgo = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  // Less than an hour
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  // Less than a day
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  // Less than a week
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return diffInDays === 1 ? 'Yesterday' : `${diffInDays} days ago`;
  }
  
  // Less than a month
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }
  
  // Less than a year
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
  
  // More than a year
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

/**
 * Calculates the duration between two dates
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date (defaults to now)
 * @param {string} unit - Unit of time ('years', 'months', 'days', 'hours')
 * @returns {number} Duration in the specified unit
 */
export const calculateDuration = (startDate, endDate = new Date(), unit = 'days') => {
  if (!startDate) return 0;
  
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 0;
  }
  
  const diffInMs = end - start;
  
  switch (unit.toLowerCase()) {
    case 'years':
      return Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365));
    case 'months':
      return Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30));
    case 'hours':
      return Math.floor(diffInMs / (1000 * 60 * 60));
    case 'minutes':
      return Math.floor(diffInMs / (1000 * 60));
    case 'seconds':
      return Math.floor(diffInMs / 1000);
    case 'days':
    default:
      return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  }
};

/**
 * Formats a date range as a string
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date (optional)
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date range
 */
export const formatDateRange = (startDate, endDate, options = {}) => {
  if (!startDate) return '';
  
  const startFormatted = formatDate(startDate, options);
  
  if (!endDate) {
    return `From ${startFormatted}`;
  }
  
  const endFormatted = formatDate(endDate, options);
  return `${startFormatted} - ${endFormatted}`;
};

/**
 * Get a human-readable time since last active string
 * @param {Date|string} lastActive - The date of last activity
 * @returns {string} Human-readable time since last active
 */
export const getTimeSinceLastActive = (lastActive) => {
  if (!lastActive) return 'Unknown';
  
  // If it's already a formatted string like "2 days ago", return it
  if (typeof lastActive === 'string' && lastActive.includes('ago')) {
    return lastActive;
  }
  
  // Otherwise, use the getTimeAgo function
  return getTimeAgo(lastActive);
};

// Export all utility functions
export default {
  formatDate,
  getTimeAgo,
  calculateDuration,
  formatDateRange,
  getTimeSinceLastActive
};
