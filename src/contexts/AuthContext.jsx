import React, { createContext, useState, useEffect } from 'react';
import api from '../api';
import { setAuthToken, removeAuthToken, getAuthToken } from '../utils/storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Get current user with stored token
        const response = await api.auth.getCurrentUser();
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (err) {
        // If token is invalid, clear it
        removeAuthToken();
        setError('Authentication session expired. Please login again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Register new user
  const register = async (userData) => {
    try {
      const response = await api.auth.register(userData);
      const { token } = response.data;
      
      // Save token and set auth state
      setAuthToken(token);
      
      // Get user info
      const userResponse = await api.auth.getCurrentUser();
      setUser(userResponse.data);
      setIsAuthenticated(true);
      setError(null);
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      const response = await api.auth.login(credentials);
      const { token } = response.data;
      
      // Save token and set auth state
      setAuthToken(token);
      
      // Get user info
      const userResponse = await api.auth.getCurrentUser();
      setUser(userResponse.data);
      setIsAuthenticated(true);
      setError(null);
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    removeAuthToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await api.auth.updateProfile(userData);
      setUser(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      throw err;
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    register,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};