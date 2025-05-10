/**
 * A collection of utility functions for formatting data
 */

/**
 * Formats a date to a readable string
 * 
 * @param {string|Date} date - Date to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.includeTime - Whether to include time
 * @param {string} options.locale - Locale for the formatted date
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
    if (!date) return '';
    
    const { includeTime = false, locale = 'en-US' } = options;
    
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return '';
      }
      
      const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...(includeTime && {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      };
      
      return dateObj.toLocaleDateString(locale, dateOptions);
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };
  
  /**
   * Gets a relative time string (e.g. "2 hours ago", "Yesterday")
   * 
   * @param {string|Date} date - Date to format
   * @param {Object} options - Formatting options
   * @param {string} options.locale - Locale for the formatted date
   * @returns {string} Relative time string
   */
  export const getRelativeTime = (date, options = {}) => {
    if (!date) return '';
    
    const { locale = 'en-US' } = options;
    
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return '';
      }
      
      const now = new Date();
      const diffMs = now - dateObj;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);
      const diffWeek = Math.floor(diffDay / 7);
      const diffMonth = Math.floor(diffDay / 30);
      const diffYear = Math.floor(diffDay / 365);
      
      if (diffSec < 60) {
        return 'Just now';
      } else if (diffMin < 60) {
        return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
      } else if (diffHour < 24) {
        return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
      } else if (diffDay < 2) {
        return 'Yesterday';
      } else if (diffDay < 7) {
        return `${diffDay} days ago`;
      } else if (diffWeek < 4) {
        return `${diffWeek} ${diffWeek === 1 ? 'week' : 'weeks'} ago`;
      } else if (diffMonth < 12) {
        return `${diffMonth} ${diffMonth === 1 ? 'month' : 'months'} ago`;
      } else {
        return `${diffYear} ${diffYear === 1 ? 'year' : 'years'} ago`;
      }
    } catch (error) {
      console.error('Error getting relative time:', error);
      return '';
    }
  };
  
  /**
   * Format a file size to a human readable string (e.g. "1.5 MB")
   * 
   * @param {number} bytes - File size in bytes
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted file size
   */
  export const formatFileSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  /**
   * Format a number with thousand separators
   * 
   * @param {number} number - Number to format
   * @param {Object} options - Formatting options
   * @param {string} options.locale - Locale for the formatted number
   * @param {number} options.minimumFractionDigits - Minimum fraction digits
   * @param {number} options.maximumFractionDigits - Maximum fraction digits
   * @returns {string} Formatted number
   */
  export const formatNumber = (number, options = {}) => {
    if (number === undefined || number === null) return '';
    
    const { 
      locale = 'en-US',
      minimumFractionDigits = 0,
      maximumFractionDigits = 2
    } = options;
    
    try {
      return number.toLocaleString(locale, {
        minimumFractionDigits,
        maximumFractionDigits
      });
    } catch (error) {
      console.error('Error formatting number:', error);
      return number.toString();
    }
  };
  
  /**
   * Format a currency value
   * 
   * @param {number} amount - Amount to format
   * @param {Object} options - Formatting options
   * @param {string} options.currency - Currency code (e.g. 'USD', 'EUR')
   * @param {string} options.locale - Locale for the formatted amount
   * @returns {string} Formatted currency
   */
  export const formatCurrency = (amount, options = {}) => {
    if (amount === undefined || amount === null) return '';
    
    const { 
      currency = 'USD',
      locale = 'en-US'
    } = options;
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency
      }).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return amount.toString();
    }
  };
  
  /**
   * Format a phone number 
   * 
   * @param {string} phone - Phone number to format
   * @param {string} format - Format template (e.g. '(XXX) XXX-XXXX')
   * @returns {string} Formatted phone number
   */
  export const formatPhoneNumber = (phone, format = '(XXX) XXX-XXXX') => {
    if (!phone) return '';
    
    // Remove all non-numeric characters
    const cleaned = ('' + phone).replace(/\D/g, '');
    
    // Check if the input is of correct length
    if (cleaned.length !== format.replace(/[^X]/g, '').length) {
      return phone; // Return original if not matching expected length
    }
    
    let result = format;
    let charIndex = 0;
    
    // Replace each X in the format with a digit from the cleaned phone number
    for (let i = 0; i < format.length; i++) {
      if (format[i] === 'X') {
        result = result.substring(0, i) + cleaned[charIndex++] + result.substring(i + 1);
      }
    }
    
    return result;
  };
  
  /**
   * Truncate text to a specified length and add ellipsis
   * 
   * @param {string} text - Text to truncate
   * @param {number} length - Maximum length
   * @param {string} suffix - Suffix to add when truncated (default: "...")
   * @returns {string} Truncated text
   */
  export const truncateText = (text, length = 100, suffix = '...') => {
    if (!text) return '';
    
    if (text.length <= length) {
      return text;
    }
    
    // Try to truncate at a word boundary
    const truncated = text.substring(0, length).trim();
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    if (lastSpaceIndex > 0) {
      return truncated.substring(0, lastSpaceIndex) + suffix;
    }
    
    return truncated + suffix;
  };
  
  /**
   * Generates a random ID for temporary use (not cryptographically secure)
   * 
   * @param {number} length - Length of the ID
   * @returns {string} Random ID
   */
  export const generateTempId = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  };
  
  /**
   * Capitalizes the first letter of a string
   * 
   * @param {string} str - String to capitalize
   * @returns {string} Capitalized string
   */
  export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  /**
   * Converts a string to title case (capitalizes each word)
   * 
   * @param {string} str - String to convert
   * @returns {string} Title-cased string
   */
  export const titleCase = (str) => {
    if (!str) return '';
    
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  /**
   * Formats a date range
   * 
   * @param {string|Date} startDate - Start date
   * @param {string|Date} endDate - End date
   * @param {Object} options - Formatting options
   * @returns {string} Formatted date range
   */
  export const formatDateRange = (startDate, endDate, options = {}) => {
    if (!startDate) return '';
    
    const startFormatted = formatDate(startDate, options);
    
    if (!endDate) {
      return `Since ${startFormatted}`;
    }
    
    const endFormatted = formatDate(endDate, options);
    
    return `${startFormatted} - ${endFormatted}`;
  };
  
  /**
   * Format bytes to a human readable string (e.g. "1.5 MB/s")
   * 
   * @param {number} bytes - Bytes per second
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted string (e.g. "1.5 MB/s")
   */
  export const formatBandwidth = (bytesPerSec, decimals = 2) => {
    return formatFileSize(bytesPerSec, decimals) + '/s';
  };
  
  /**
   * Format a percentage
   * 
   * @param {number} value - Value to format (e.g. 0.75 for 75%)
   * @param {Object} options - Formatting options
   * @param {number} options.decimals - Number of decimal places
   * @param {boolean} options.includeSymbol - Whether to include the % symbol
   * @returns {string} Formatted percentage
   */
  export const formatPercentage = (value, options = {}) => {
    if (value === undefined || value === null) return '';
    
    const { 
      decimals = 2,
      includeSymbol = true
    } = options;
    
    // Convert to percentage if value is a fraction (0-1)
    const percentage = value > 0 && value <= 1 ? value * 100 : value;
    
    const formatted = percentage.toFixed(decimals);
    
    // Remove trailing zeros and decimal point if decimals is 0
    const cleanFormatted = parseFloat(formatted).toString();
    
    return includeSymbol ? `${cleanFormatted}%` : cleanFormatted;
  };
  
  /**
   * Format a time duration in seconds to a readable string (e.g. "2h 30m")
   * 
   * @param {number} seconds - Time in seconds
   * @param {Object} options - Formatting options
   * @param {boolean} options.short - Whether to use short format
   * @returns {string} Formatted duration
   */
  export const formatDuration = (seconds, options = {}) => {
    if (seconds === undefined || seconds === null) return '';
    
    const { short = false } = options;
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    const parts = [];
    
    if (days > 0) {
      parts.push(short ? `${days}d` : `${days} day${days !== 1 ? 's' : ''}`);
    }
    
    if (hours > 0) {
      parts.push(short ? `${hours}h` : `${hours} hour${hours !== 1 ? 's' : ''}`);
    }
    
    if (minutes > 0) {
      parts.push(short ? `${minutes}m` : `${minutes} minute${minutes !== 1 ? 's' : ''}`);
    }
    
    if (remainingSeconds > 0 || parts.length === 0) {
      parts.push(short ? `${remainingSeconds}s` : `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`);
    }
    
    return parts.join(' ');
  };
  
  /**
   * Format bytes to a human readable transfer speed (e.g. "1.5 MB/s")
   * 
   * @param {number} bytes - Number of bytes
   * @param {number} seconds - Time period in seconds
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted transfer speed
   */
  export const formatTransferSpeed = (bytes, seconds, decimals = 2) => {
    if (seconds === 0) return '0 B/s';
    return formatFileSize(bytes / seconds, decimals) + '/s';
  };
  
  /**
   * Format a name (first, last) to a full name
   * 
   * @param {Object} options - Name parts
   * @param {string} options.firstName - First name
   * @param {string} options.lastName - Last name
   * @param {string} options.middleName - Middle name
   * @param {boolean} options.lastNameFirst - Whether to show last name first
   * @returns {string} Formatted full name
   */
  export const formatName = (options = {}) => {
    const { 
      firstName = '', 
      lastName = '', 
      middleName = '',
      lastNameFirst = false
    } = options;
    
    if (!firstName && !lastName) return '';
    
    if (lastNameFirst) {
      return [
        lastName,
        firstName && lastName ? ',' : '',
        firstName,
        middleName ? ` ${middleName}` : ''
      ].filter(Boolean).join(' ').trim();
    }
    
    return [
      firstName,
      middleName,
      lastName
    ].filter(Boolean).join(' ').trim();
  };
  
  /**
   * Format an address
   * 
   * @param {Object} address - Address parts
   * @param {string} address.street - Street address
   * @param {string} address.city - City
   * @param {string} address.state - State/Province
   * @param {string} address.zip - Postal/ZIP code
   * @param {string} address.country - Country
   * @param {boolean} address.singleLine - Format as a single line
   * @returns {string} Formatted address
   */
  export const formatAddress = (address = {}) => {
    const {
      street = '',
      city = '',
      state = '',
      zip = '',
      country = '',
      singleLine = false
    } = address;
    
    if (!street && !city && !state && !zip && !country) {
      return '';
    }
    
    const cityStateZip = [
      city,
      state && (city ? `, ${state}` : state),
      zip && ((city || state) ? ` ${zip}` : zip)
    ].filter(Boolean).join('');
    
    if (singleLine) {
      return [
        street,
        cityStateZip && street ? ', ' : '',
        cityStateZip,
        country && (street || cityStateZip) ? ', ' : '',
        country
      ].filter(Boolean).join('');
    }
    
    return [
      street,
      cityStateZip,
      country
    ].filter(Boolean).join('\n');
  };
  
  export default {
    formatDate,
    getRelativeTime,
    formatFileSize,
    formatNumber,
    formatCurrency,
    formatPhoneNumber,
    truncateText,
    generateTempId,
    capitalize,
    titleCase,
    formatDateRange,
    formatBandwidth,
    formatPercentage,
    formatDuration,
    formatTransferSpeed,
    formatName,
    formatAddress
  };