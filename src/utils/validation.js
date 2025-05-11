/**
 * A collection of utility functions for validating data
 */

/**
 * Validates if a value is not empty
 * 
 * @param {*} value - Value to validate
 * @returns {boolean} True if value is not empty
 */
export const isRequired = (value) => {
  if (value === undefined || value === null) return false;
  
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  
  if (typeof value === 'number') {
    return true;
  }
  
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  }
  
  return !!value;
};

/**
 * Validates if a value is not empty
 * 
 * @param {*} value - Value to validate
 * @returns {boolean} True if value is not empty
 */
export const isNotEmpty = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return !!value;
};

/**
 * Validates an email address
 * 
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  // Basic email regex pattern
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
};

/**
 * Validates password strength
 * 
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum length (default: 8)
 * @param {boolean} options.requireNumbers - Require numbers (default: true)
 * @param {boolean} options.requireUppercase - Require uppercase (default: true)
 * @param {boolean} options.requireLowercase - Require lowercase (default: true)
 * @param {boolean} options.requireSpecialChars - Require special characters (default: true)
 * @returns {Object} Validation result with status and message
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireNumbers = true,
    requireUppercase = true,
    requireLowercase = true,
    requireSpecialChars = true
  } = options;
  
  if (!password) {
    return {
      isValid: false,
      message: 'Password is required'
    };
  }
  
  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${minLength} characters`
    };
  }
  
  if (requireNumbers && !/\d/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number'
    };
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter'
    };
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter'
    };
  }
  
  if (requireSpecialChars && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one special character'
    };
  }
  
  return {
    isValid: true,
    message: 'Password is valid'
  };
};

/**
 * Validates password strength
 * 
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @returns {boolean} True if password meets requirements
 */
export const isValidPassword = (password, options = {}) => {
  const { minLength } = options;
  if (!password || typeof password !== 'string') return false;
  if (minLength && password.length < minLength) return false;
  return true;
};

/**
 * Validates if two values match (e.g., password confirmation)
 * 
 * @param {*} value - Primary value
 * @param {*} confirmValue - Confirmation value
 * @returns {boolean} True if values match
 */
export const valuesMatch = (value, confirmValue) => {
  return value === confirmValue;
};

/**
 * Validates a URL
 * 
 * @param {string} url - URL to validate
 * @param {boolean} requireProtocol - Whether protocol (http/https) is required
 * @returns {boolean} True if URL is valid
 */
export const isValidUrl = (url, requireProtocol = true) => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    if (requireProtocol) {
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    }
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validates a phone number
 * 
 * @param {string} phone - Phone number to validate
 * @param {string} countryCode - Country code for validation rules
 * @returns {boolean} True if phone is valid
 */
export const isValidPhone = (phone, countryCode = 'US') => {
  if (!phone) return false;
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Basic validation by country code
  switch (countryCode) {
    case 'US':
      // US numbers should be 10 digits
      return cleaned.length === 10;
    case 'UK':
      // UK numbers should be between 10 and 12 digits
      return cleaned.length >= 10 && cleaned.length <= 12;
    default:
      // Default: accept phone numbers between 8 and 15 digits
      return cleaned.length >= 8 && cleaned.length <= 15;
  }
};

/**
 * Validates text length
 * 
 * @param {string} text - Text to validate
 * @param {Object} options - Validation options
 * @param {number} options.min - Minimum length
 * @param {number} options.max - Maximum length
 * @returns {Object} Validation result with status and message
 */
export const validateLength = (text, options = {}) => {
  const { min, max } = options;
  
  if (!text && min > 0) {
    return {
      isValid: false,
      message: 'Text is required'
    };
  }
  
  const length = text ? text.length : 0;
  
  if (min !== undefined && length < min) {
    return {
      isValid: false,
      message: `Must be at least ${min} characters`
    };
  }
  
  if (max !== undefined && length > max) {
    return {
      isValid: false,
      message: `Must be at most ${max} characters`
    };
  }
  
  return {
    isValid: true,
    message: 'Valid'
  };
};

/**
 * Validates a date
 * 
 * @param {string|Date} date - Date to validate
 * @param {Object} options - Validation options
 * @param {Date} options.min - Minimum date
 * @param {Date} options.max - Maximum date
 * @returns {Object} Validation result with status and message
 */
export const validateDate = (date, options = {}) => {
  const { min, max } = options;
  
  if (!date) {
    return {
      isValid: false,
      message: 'Date is required'
    };
  }
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return {
      isValid: false,
      message: 'Invalid date format'
    };
  }
  
  if (min && dateObj < min) {
    return {
      isValid: false,
      message: `Date must be after ${min.toLocaleDateString()}`
    };
  }
  
  if (max && dateObj > max) {
    return {
      isValid: false,
      message: `Date must be before ${max.toLocaleDateString()}`
    };
  }
  
  return {
    isValid: true,
    message: 'Valid date'
  };
};

/**
 * Validates a file type
 * 
 * @param {File} file - File to validate
 * @param {string[]} allowedTypes - Array of allowed MIME types or extensions
 * @returns {boolean} True if file type is valid
 */
export const isValidFileType = (file, allowedTypes = []) => {
  if (!file || !allowedTypes.length) return false;
  
  // Check if allowedTypes contains MIME types or extensions
  const isMimeType = allowedTypes[0].includes('/');
  
  if (isMimeType) {
    return allowedTypes.includes(file.type);
  } else {
    // Extract extension from filename
    const extension = file.name.split('.').pop().toLowerCase();
    // Remove the dot if present in allowedTypes
    const normalizedAllowedTypes = allowedTypes.map(type => 
      type.startsWith('.') ? type.substring(1).toLowerCase() : type.toLowerCase()
    );
    return normalizedAllowedTypes.includes(extension);
  }
};

/**
 * Validates a file size
 * 
 * @param {File} file - File to validate
 * @param {number} maxSizeInBytes - Maximum file size in bytes
 * @returns {boolean} True if file size is valid
 */
export const isValidFileSize = (file, maxSizeInBytes) => {
  if (!file) return false;
  return file.size <= maxSizeInBytes;
};

/**
 * Validates if a value is a number
 * 
 * @param {*} value - Value to validate
 * @param {Object} options - Validation options
 * @param {number} options.min - Minimum value
 * @param {number} options.max - Maximum value
 * @param {boolean} options.integer - Whether value must be an integer
 * @returns {Object} Validation result with status and message
 */
export const validateNumber = (value, options = {}) => {
  const { min, max, integer = false } = options;
  
  // Check if value is empty
  if (value === null || value === undefined || value === '') {
    return {
      isValid: false,
      message: 'Number is required'
    };
  }
  
  // Convert to number if string
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if valid number
  if (isNaN(num)) {
    return {
      isValid: false,
      message: 'Must be a valid number'
    };
  }
  
  // Check if integer
  if (integer && !Number.isInteger(num)) {
    return {
      isValid: false,
      message: 'Must be an integer'
    };
  }
  
  // Check min
  if (min !== undefined && num < min) {
    return {
      isValid: false,
      message: `Must be at least ${min}`
    };
  }
  
  // Check max
  if (max !== undefined && num > max) {
    return {
      isValid: false,
      message: `Must be at most ${max}`
    };
  }
  
  return {
    isValid: true,
    message: 'Valid number'
  };
};

/**
 * Validates form data against a schema
 * 
 * @param {Object} data - Form data
 * @param {Object} schema - Validation schema
 * @returns {Object} Validation errors
 */
export const validateForm = (data, schema) => {
  const errors = {};
  
  Object.keys(schema).forEach(field => {
    const rules = schema[field];
    const value = data[field];
    
    // Check required rule
    if (rules.required && !isRequired(value)) {
      errors[field] = rules.requiredMessage || 'This field is required';
      return;
    }
    
    // Skip other validations if field is empty and not required
    if (!isRequired(value) && !rules.required) {
      return;
    }
    
    // Check email rule
    if (rules.email && !isValidEmail(value)) {
      errors[field] = rules.emailMessage || 'Please enter a valid email address';
      return;
    }
    
    // Check password rule
    if (rules.password) {
      const result = validatePassword(value, rules.passwordOptions);
      if (!result.isValid) {
        errors[field] = rules.passwordMessage || result.message;
        return;
      }
    }
    
    // Check match rule
    if (rules.match && !valuesMatch(value, data[rules.match])) {
      errors[field] = rules.matchMessage || 'Fields do not match';
      return;
    }
    
    // Check length rule
    if (rules.minLength || rules.maxLength) {
      const result = validateLength(value, {
        min: rules.minLength,
        max: rules.maxLength
      });
      if (!result.isValid) {
        errors[field] = rules.lengthMessage || result.message;
        return;
      }
    }
    
    // Check number rule
    if (rules.number) {
      const result = validateNumber(value, {
        min: rules.min,
        max: rules.max,
        integer: rules.integer
      });
      if (!result.isValid) {
        errors[field] = rules.numberMessage || result.message;
        return;
      }
    }
    
    // Check url rule
    if (rules.url && !isValidUrl(value, rules.requireProtocol)) {
      errors[field] = rules.urlMessage || 'Please enter a valid URL';
      return;
    }
    
    // Check custom validation rule
    if (rules.custom && typeof rules.custom === 'function') {
      const result = rules.custom(value, data);
      if (result !== true) {
        errors[field] = result;
        return;
      }
    }
  });
  
  return errors;
};

export default {
  isRequired,
  isNotEmpty,
  isValidEmail,
  validatePassword,
  valuesMatch,
  isValidUrl,
  isValidPhone,
  validateLength,
  validateDate,
  isValidFileType,
  isValidFileSize,
  validateNumber,
  validateForm
};