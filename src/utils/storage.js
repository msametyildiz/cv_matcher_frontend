// Set auth token in localStorage and API headers
export const setAuthToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  // Remove auth token from localStorage
  export const removeAuthToken = () => {
    localStorage.removeItem('token');
  };
  
  // Get auth token from localStorage
  export const getAuthToken = () => {
    return localStorage.getItem('token');
  };