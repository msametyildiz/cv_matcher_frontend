import React, { createContext, useContext, useState, useEffect } from 'react';
import { setAuthToken, getAuthToken, removeAuthToken } from '../utils/storage';

// Create the auth context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login function
  const login = async (credentials) => {
    try {
      // This would be replaced with actual API call in production
      // const response = await api.auth.login(credentials);
      
      // Mock successful login for development
      console.log('Login attempt with:', credentials);
      const mockUser = { 
        id: Date.now(),
        email: credentials.email,
        name: credentials.email.split('@')[0],
        role: 'candidate'
      };
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      // Set auth data
      setAuthToken(mockToken);
      setCurrentUser(mockUser);
      setIsAuthenticated(true);
      
      return { success: true, user: mockUser };
    } catch (err) {
      setError(err.message || 'Failed to login');
      return { success: false, error: err.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // This would call logout API in production
      removeAuthToken();
      setCurrentUser(null);
      setIsAuthenticated(false);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to logout');
      return false;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      // This would be replaced with actual API call in production
      // const response = await api.auth.register(userData);
      
      // Mock successful registration for development
      console.log('Register attempt with:', userData);
      const mockUser = { 
        id: Date.now(),
        email: userData.email,
        name: userData.name,
        role: userData.role || 'candidate'
      };
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      // Set auth data
      setAuthToken(mockToken);
      setCurrentUser(mockUser);
      setIsAuthenticated(true);
      
      return { success: true, user: mockUser };
    } catch (err) {
      setError(err.message || 'Failed to register');
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    // Check for existing user session
    const checkAuthStatus = async () => {
      try {
        const token = getAuthToken();
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
          setAuthToken(token);
          setCurrentUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        removeAuthToken();
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
    isAuthenticated,
    login,
    logout,
    register,
    loading,
    error,
    setError,
    setUser: setCurrentUser
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
