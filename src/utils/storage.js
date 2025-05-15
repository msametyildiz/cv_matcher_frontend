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

// Set auth token in localStorage
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

// Get auth token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Clear all auth-related data from localStorage
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('auth_redirect');
};