import React, { createContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api';
import { setAuthToken, removeAuthToken, getAuthToken } from '../utils/storage';

// Create the context and export it
export const AuthContext = createContext(null);

/**
 * Auth Provider Component - Manages authentication state and provides auth methods
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Fetch current user data using stored token
   */
  const fetchCurrentUser = useCallback(async () => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        return null;
      }
      
      const response = await api.auth.getCurrentUser();
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      removeAuthToken();
      return null;
    }
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        const userData = await fetchCurrentUser();
        
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, [fetchCurrentUser]);

  /**
   * Register a new user
   */
  const register = async (userData) => {
    setIsUpdating(true);
    setAuthError(null);
    
    try {
      const response = await api.auth.register(userData);
      const { token, user } = response.data;
      
      setAuthToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setAuthError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Log in an existing user
   */
  const login = async (credentials) => {
    setIsUpdating(true);
    setAuthError(null);
    
    try {
      const response = await api.auth.login(credentials);
      const { token, user } = response.data;
      
      setAuthToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid credentials. Please try again.';
      setAuthError(errorMessage);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Log out the current user
   */
  const logout = useCallback(() => {
    removeAuthToken();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('You have been logged out');
  }, []);

  /**
   * Update user profile
   */
  const updateProfile = async (userData) => {
    setIsUpdating(true);
    
    try {
      const response = await api.auth.updateProfile(userData);
      setUser(response.data);
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Request password reset
   */
  const forgotPassword = async (email) => {
    setIsUpdating(true);
    
    try {
      await api.auth.forgotPassword(email);
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset email';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Reset password with token
   */
  const resetPassword = async (token, newPassword) => {
    setIsUpdating(true);
    
    try {
      await api.auth.resetPassword(token, newPassword);
      toast.success('Password has been reset successfully');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  // Create the context value object with all auth-related state and functions
  const contextValue = {
    user,
    setUser,
    isAuthenticated,
    isLoading,
    isUpdating,
    authError,
    register,
    login,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    fetchCurrentUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};