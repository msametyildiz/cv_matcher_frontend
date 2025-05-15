import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    
    try {
      const user = await login(formData);
      
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
      
      toast.success('Login successful');
    } catch (error) {
      toast.error('Login failed: ' + (error.message || 'Invalid credentials'));
    } finally {
      setLoading(false);
    }
  };

  // ...rest of the component
};
