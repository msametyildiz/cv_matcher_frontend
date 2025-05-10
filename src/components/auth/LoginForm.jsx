// src/components/auth/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { login } from '../../api/auth';
import { setAuthToken } from '../../utils/storage';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(formData);
      const { token, user } = response.data;
      setAuthToken(token);
      setUser(user);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow rounded-md">
      <h2 className="text-lg font-semibold text-gray-700">Login to Your Account</h2>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;