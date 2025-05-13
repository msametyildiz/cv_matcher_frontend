import { useState, useCallback } from 'react';

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
const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be a fetch call to your API
      // For now, we'll simulate API responses with mock data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // Simulate different responses based on endpoint
      if (endpoint.includes('error')) {
        throw new Error('API Error');
      }
      
      // Return mock data based on endpoint
      return {
        success: true,
        data: { message: 'Mock API response for ' + endpoint }
      };
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    callApi,
    // Export common API methods
    get: (endpoint) => callApi(endpoint, { method: 'GET' }),
    post: (endpoint, data) => callApi(endpoint, { method: 'POST', data }),
    put: (endpoint, data) => callApi(endpoint, { method: 'PUT', data }),
    delete: (endpoint) => callApi(endpoint, { method: 'DELETE' })
  };
};

// Both named and default exports
export { useApi };
export default useApi;