import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  // ...other state

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
      switch (user.role) {
        case 'candidate':
          navigate('/candidate/dashboard');
          break;
        case 'employer':
          navigate('/employer/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ...validation code
    
    setLoading(true);
    try {
      const newUser = await register(formData);
      
      // Redirect based on role
      switch (newUser.role) {
        case 'candidate':
          navigate('/candidate/dashboard');
          break;
        case 'employer':
          navigate('/employer/dashboard');
          break;
        default:
          navigate('/');
      }
      
      toast.success('Registration successful');
    } catch (error) {
      toast.error('Registration failed: ' + (error.message || 'Please try again'));
    } finally {
      setLoading(false);
    }
  };

  // ...rest of the component
};
