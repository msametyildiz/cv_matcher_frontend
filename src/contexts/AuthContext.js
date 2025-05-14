import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the auth context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Login function
  const login = async (email, password) => {
    try {
      // Replace with actual authentication logic
      // Example: const response = await api.post('/auth/login', { email, password });
      // setCurrentUser(response.data.user);
      console.log('Login attempt with:', email, password);
      setCurrentUser({ email }); // Temporary mock user
      return true;
    } catch (err) {
      setError(err.message || 'Failed to login');
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Replace with actual logout logic
      // Example: await api.post('/auth/logout');
      setCurrentUser(null);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to logout');
      return false;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      // Replace with actual registration logic
      // Example: const response = await api.post('/auth/register', userData);
      // setCurrentUser(response.data.user);
      console.log('Register attempt with:', userData);
      setCurrentUser({ email: userData.email }); // Temporary mock user
      return true;
    } catch (err) {
      setError(err.message || 'Failed to register');
      return false;
    }
  };

  useEffect(() => {
    // Check for existing user session
    const checkAuthStatus = async () => {
      try {
        // Replace with actual auth check
        // Example: const response = await api.get('/auth/me');
        // if (response.data.user) setCurrentUser(response.data.user);
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('user');
    }
  }, [currentUser]);

  const value = {
    currentUser,
    login,
    logout,
    register,
    loading,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
