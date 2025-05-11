/**
 * Utility functions for API operations and request handling
 */
import axios from 'axios';

/**
 * Creates an API client with default configuration
 * 
 * @param {Object} options - Client configuration options
 * @param {string} options.baseURL - Base URL for the API
 * @param {Object} options.headers - Default headers
 * @param {number} options.timeout - Request timeout in milliseconds
 * @param {Function} options.onRequest - Request interceptor function
 * @param {Function} options.onResponse - Response interceptor function
 * @param {Function} options.onError - Error interceptor function
 * @returns {Object} Configured axios instance
 */
export const createApiClient = (options = {}) => {
  const {
    baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
    headers = {
      'Content-Type': 'application/json'
    },
    timeout = 30000,
    onRequest,
    onResponse,
    onError
  } = options;

  // Create axios instance
  const client = axios.create({
    baseURL,
    headers,
    timeout
  });

  // Add request interceptor
  client.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Custom request interceptor
      if (typeof onRequest === 'function') {
        return onRequest(config);
      }

      return config;
    },
    (error) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  client.interceptors.response.use(
    (response) => {
      // Custom response interceptor
      if (typeof onResponse === 'function') {
        return onResponse(response);
      }
      return response;
    },
    (error) => {
      console.error('Response error:', error);

      // Handle unauthorized errors (401)
      if (error.response && error.response.status === 401) {
        // Clear local storage
        localStorage.removeItem('token');
        // Redirect to login page if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      // Custom error interceptor
      if (typeof onError === 'function') {
        return onError(error);
      }

      return Promise.reject(error);
    }
  );

  return client;
};

/**
 * Creates a cancellable API request
 * 
 * @param {Function} requestFn - The API request function
 * @returns {Object} Request and cancel functions
 */
export const createCancellableRequest = (requestFn) => {
  const controller = new AbortController();
  const { signal } = controller;

  const request = (...args) => requestFn(...args, { signal });
  const cancel = (message = 'Request cancelled') => controller.abort(message);

  return { request, cancel };
};

/**
 * Retries a failed API request
 * 
 * @param {Function} apiCall - API function to retry
 * @param {Object} options - Retry options
 * @param {number} options.maxRetries - Maximum number of retries
 * @param {number} options.retryDelay - Delay between retries in ms
 * @param {Function} options.shouldRetry - Function to determine if request should be retried
 * @returns {Promise} Promise resolving to the API response
 */
export const retryRequest = async (apiCall, options = {}) => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    shouldRetry = (error) => {
      // By default, retry on network errors or 5xx server errors
      return (
        !error.response ||
        (error.response && error.response.status >= 500)
      );
    }
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;

      // Don't retry if we've reached max retries or shouldRetry returns false
      if (attempt === maxRetries || !shouldRetry(error)) {
        break;
      }

      // Wait before next retry
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  throw lastError;
};

/**
 * Handles file uploads with progress tracking
 * 
 * @param {Object} options - Upload options
 * @param {string} options.url - Upload endpoint URL
 * @param {File} options.file - File to upload
 * @param {Object} options.data - Additional form data
 * @param {Function} options.onProgress - Progress callback function
 * @param {Object} options.headers - Additional headers
 * @returns {Promise} Promise resolving to the upload response
 */
export const uploadFile = async (options = {}) => {
  const {
    url,
    file,
    data = {},
    onProgress = () => {},
    headers = {}
  } = options;

  if (!url || !file) {
    throw new Error('URL and file are required for file upload');
  }

  const formData = new FormData();
  formData.append('file', file);

  // Append additional data to form data
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const token = localStorage.getItem('token');
  const defaultHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  return axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...defaultHeaders,
      ...headers
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgress(percentCompleted, progressEvent);
    }
  });
};

/**
 * Downloads a file from the server
 * 
 * @param {Object} options - Download options
 * @param {string} options.url - Download endpoint URL
 * @param {string} options.filename - Name to save the file as
 * @param {Object} options.headers - Additional headers
 * @param {Function} options.onProgress - Progress callback function
 * @returns {Promise} Promise resolving when download completes
 */
export const downloadFile = async (options = {}) => {
  const {
    url,
    filename,
    headers = {},
    onProgress = () => {}
  } = options;

  if (!url) {
    throw new Error('URL is required for file download');
  }

  const token = localStorage.getItem('token');
  const defaultHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'blob',
    headers: {
      ...defaultHeaders,
      ...headers
    },
    onDownloadProgress: (progressEvent) => {
      if (progressEvent.lengthComputable) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted, progressEvent);
      }
    }
  });

  // Create a download link and trigger download
  const url_download = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url_download;
  link.setAttribute('download', filename || 'download');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url_download);

  return response;
};

/**
 * Caches API responses
 * 
 * @param {Function} apiCall - The API function to cache
 * @param {Object} options - Cache options
 * @param {string} options.key - Cache key
 * @param {number} options.ttl - Time to live in milliseconds
 * @returns {Promise} Promise resolving to the API response
 */
export const cacheApiCall = async (apiCall, options = {}) => {
  const {
    key,
    ttl = 60 * 1000 // Default 1 minute
  } = options;

  if (!key) {
    return apiCall();
  }

  const cacheKey = `api_cache_${key}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const { data, expiry } = JSON.parse(cached);
      
      // Check if cache is still valid
      if (expiry > Date.now()) {
        return { data, fromCache: true };
      }
      
      // Cache expired, remove it
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.error('Error parsing cached data:', error);
      localStorage.removeItem(cacheKey);
    }
  }

  // Make the API call
  const response = await apiCall();
  
  // Cache the response
  const cacheData = {
    data: response.data,
    expiry: Date.now() + ttl
  };
  
  localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  
  return response;
};

/**
 * Creates a mock API response
 * 
 * @param {Object} data - Response data
 * @param {number} status - HTTP status code
 * @param {number} delay - Delay in milliseconds
 * @returns {Promise} Promise resolving to the mock response
 */
export const mockApiResponse = async (data, status = 200, delay = 500) => {
  await new Promise(resolve => setTimeout(resolve, delay));
  
  return {
    data,
    status,
    headers: {},
    config: {},
    statusText: status === 200 ? 'OK' : 'Error'
  };
};

/**
 * Normalizes API error messages
 * 
 * @param {Error} error - The error from an API call
 * @returns {Object} Normalized error object
 */
export const normalizeApiError = (error) => {
  // Default error format
  const normalizedError = {
    message: 'An unexpected error occurred',
    status: 500,
    data: null,
    errors: {}
  };

  if (!error) {
    return normalizedError;
  }

  // Network error
  if (error.message === 'Network Error') {
    return {
      ...normalizedError,
      message: 'Unable to connect to the server. Please check your internet connection.'
    };
  }

  // Request cancelled
  if (axios.isCancel(error)) {
    return {
      ...normalizedError,
      message: 'Request was cancelled',
      status: 0
    };
  }

  // Server responded with an error
  if (error.response) {
    const { status, data } = error.response;
    
    return {
      message: data?.message || `Server error: ${status}`,
      status,
      data: data || null,
      errors: data?.errors || {}
    };
  }

  // Request made but no response received
  if (error.request) {
    return {
      ...normalizedError,
      message: 'No response received from server'
    };
  }

  // Something else happened while setting up the request
  return {
    ...normalizedError,
    message: error.message || normalizedError.message
  };
};

export default {
  createApiClient,
  createCancellableRequest,
  retryRequest,
  uploadFile,
  downloadFile,
  cacheApiCall,
  mockApiResponse,
  normalizeApiError
};