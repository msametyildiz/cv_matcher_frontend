import axios from 'axios';
import authApi from './auth';
import cvApi from './cv';
import jobApi from './job';
import matchingApi from './matching';

// Create axios instance for API calls
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      // Clear local storage
      localStorage.removeItem('token');
      
      // Don't use direct DOM manipulation
      // Instead, store a flag in localStorage that the app can check
      localStorage.setItem('auth_redirect', 'true');
      
      // The actual redirect should be handled by a React component
      // with useEffect that checks for this flag
    }
    return Promise.reject(error);
  }
);

export default {
  auth: authApi(apiClient),
  cv: cvApi(apiClient),
  job: jobApi(apiClient),
  matching: matchingApi(apiClient)
};