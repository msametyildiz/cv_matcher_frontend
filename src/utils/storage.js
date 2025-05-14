// Set auth token in localStorage and API headers
export const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
      // Set the token for API requests
      if (window.axios) {
        window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } else {
      localStorage.removeItem('authToken');
      // Remove the auth header
      if (window.axios) {
        delete window.axios.defaults.headers.common['Authorization'];
      }
    }
  };
  
  // Remove auth token from localStorage
  export const removeAuthToken = () => {
    localStorage.removeItem('authToken');
    if (window.axios) {
      delete window.axios.defaults.headers.common['Authorization'];
    }
  };
  
  // Get auth token from localStorage
  export const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  // Check if user is authenticated
  export const isAuthenticated = () => {
    return !!getAuthToken();
  };

  // Set user role in localStorage
  export const setUserRole = (role) => {
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
  };

  // Get user role from localStorage
  export const getUserRole = () => {
    return localStorage.getItem('userRole');
  };

  // Check if user has specific role
  export const hasRole = (requiredRole) => {
    const userRole = getUserRole();
    return userRole === requiredRole;
  };

  // Clear all auth data when logging out
  export const clearAuthData = () => {
    removeAuthToken();
    localStorage.removeItem('userRole');
  };