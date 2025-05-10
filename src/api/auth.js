const authApi = (apiClient) => {
    return {
      login: (credentials) => {
        return apiClient.post('/auth/login', credentials);
      },
  
      register: (userData) => {
        return apiClient.post('/auth/register', userData);
      },
  
      getCurrentUser: () => {
        return apiClient.get('/auth/me');
      },
  
      updateProfile: (userData) => {
        return apiClient.put('/auth/profile', userData);
      },
  
      forgotPassword: (email) => {
        return apiClient.post('/auth/forgot-password', { email });
      },
  
      resetPassword: (token, newPassword) => {
        return apiClient.post('/auth/reset-password', {
          token,
          newPassword,
        });
      }
    };
  };
  
  export default authApi;