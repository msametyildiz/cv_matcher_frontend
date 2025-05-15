// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if the user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        // In a real app, verify the token with the server
        // const response = await axios.get('/api/auth/me', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        
        // For development, parse the token to get user info
        // WARNING: In production, ALWAYS verify the token server-side
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          try {
            const payload = JSON.parse(atob(tokenParts[1]));
            if (payload.exp && payload.user && payload.exp > Date.now() / 1000) {
              setUser(payload.user);
              
              // Ensure role is explicitly set in localStorage for easy access
              if (payload.user.role) {
                localStorage.setItem('userRole', payload.user.role);
              }
              
              setIsAuthenticated(true);
            } else {
              // Token expired or invalid structure
              console.warn("Token expired or invalid structure");
              localStorage.removeItem('token');
              localStorage.removeItem('userRole');
            }
          } catch (parseError) {
            console.error("Error parsing token:", parseError);
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
          }
        } else {
          console.warn("Invalid token format");
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
        }
      } catch (err) {
        console.error('Auth check error:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, send credentials to your backend
      // const response = await axios.post('/api/auth/login', credentials);
      
      // For development/demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response based on credentials
      let mockUser = null;
      if (credentials.email === 'candidate@example.com') {
        mockUser = { id: 1, name: 'John Candidate', email: credentials.email, role: 'candidate' };
      } else if (credentials.email === 'employer@example.com') {
        mockUser = { id: 2, name: 'Jane Employer', email: credentials.email, role: 'employer' };
      } else if (credentials.email === 'admin@example.com') {
        mockUser = { id: 3, name: 'Admin User', email: credentials.email, role: 'admin' };
      } else {
        // Default to candidate
        mockUser = { id: 4, name: 'Default User', email: credentials.email, role: 'candidate' };
      }
      
      // Create token payload
      const payload = {
        user: mockUser,
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
      };
      
      // Create mock JWT (NOT SECURE - for demo only!)
      const mockToken = [
        btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
        btoa(JSON.stringify(payload)),
        'signature'
      ].join('.');
      
      // Save to localStorage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('userRole', mockUser.role); // Add role for quick access
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return mockUser;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, send user data to your backend
      // const response = await axios.post('/api/auth/register', userData);
      
      // For development/demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create user with provided data
      const mockUser = {
        id: Math.floor(Math.random() * 1000),
        name: userData.name,
        email: userData.email,
        role: userData.role || 'candidate'
      };
      
      // Create token payload
      const payload = {
        user: mockUser,
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
      };
      
      // Create mock JWT (NOT SECURE - for demo only!)
      const mockToken = [
        btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
        btoa(JSON.stringify(payload)),
        'signature'
      ].join('.');
      
      // Save to localStorage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('userRole', mockUser.role); // Add role for quick access
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return mockUser;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole'); // Remove role
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update profile
  const updateProfile = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, send update to your backend
      // const response = await axios.put('/api/auth/profile', userData, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // });
      
      // For development/demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local user state
      const updatedUser = { ...user, ...userData };
      
      // Update token with new user data
      const token = localStorage.getItem('token');
      
      if (token) {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          try {
            const payload = JSON.parse(atob(tokenParts[1]));
            payload.user = updatedUser;
            
            const newToken = [
              tokenParts[0],
              btoa(JSON.stringify(payload)),
              tokenParts[2]
            ].join('.');
            
            localStorage.setItem('token', newToken);
            
            // Ensure role is updated in localStorage too
            if (updatedUser.role) {
              localStorage.setItem('userRole', updatedUser.role);
            }
          } catch (parseError) {
            console.error("Error updating token:", parseError);
          }
        }
      }
      
      setUser(updatedUser);
      
      return updatedUser;
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Auth context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};