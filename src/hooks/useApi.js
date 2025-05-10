import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

/**
 * Custom hook for making API calls with state management for loading, error, and response data.
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.url - The API endpoint URL
 * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {Object} options.data - Request payload for POST, PUT requests
 * @param {Object} options.params - URL parameters for GET requests
 * @param {Object} options.headers - Custom headers
 * @param {boolean} options.autoFetch - Whether to fetch data automatically on mount
 * @param {Array} options.dependencies - Array of dependencies to trigger refetch
 * @param {Function} options.onSuccess - Callback function when request succeeds
 * @param {Function} options.onError - Callback function when request fails
 * @param {boolean} options.useAuthToken - Whether to include auth token in requests
 * @returns {Object} API call state and control functions
 */
const useApi = ({
  url,
  method = 'GET',
  data = null,
  params = null,
  headers = {},
  autoFetch = false,
  dependencies = [],
  onSuccess = null,
  onError = null,
  useAuthToken = true,
}) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [controller, setController] = useState(null);

  // Prepare the API call configuration
  const prepareConfig = useCallback(() => {
    // Setup request configuration
    const config = {
      url,
      method,
      headers: { ...headers },
      params,
      data,
    };

    // Add auth token if required
    if (useAuthToken) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Create abort controller for request cancellation
    const abortController = new AbortController();
    setController(abortController);
    config.signal = abortController.signal;

    return config;
  }, [url, method, data, params, headers, useAuthToken]);

  // Execute the API call
  const execute = useCallback(async (overrideConfig = {}) => {
    // Skip if no URL
    if (!url) return;

    // Cancel any in-flight requests
    if (controller) {
      controller.abort();
    }

    // Start loading
    setLoading(true);
    setError(null);

    try {
      // Prepare request config with possible overrides
      const config = {
        ...prepareConfig(),
        ...overrideConfig,
      };

      // Make the request
      const result = await axios(config);
      setResponse(result.data);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result.data);
      }

      return result.data;
    } catch (err) {
      // Ignore aborted requests
      if (axios.isCancel(err)) {
        console.log('Request canceled:', err.message);
        return;
      }

      // Determine error message
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      
      // Set error state
      setError({
        message: errorMessage,
        status: err.response?.status,
        data: err.response?.data,
      });

      // Call error callback if provided
      if (onError) {
        onError(err);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, controller, prepareConfig, onSuccess, onError]);

  // Auto fetch on mount or when dependencies change
  useEffect(() => {
    if (autoFetch) {
      execute();
    }

    // Cleanup: abort request on unmount
    return () => {
      if (controller) {
        controller.abort();
      }
    };
  }, [autoFetch, execute, ...dependencies]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data: response,
    loading,
    error,
    execute,
    reset: () => {
      setResponse(null);
      setError(null);
    },
  };
};

export default useApi;