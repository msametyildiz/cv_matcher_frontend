// src/components/auth/RegisterForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { register } from '../../api/auth';
import { setAuthToken } from '../../utils/storage';
import { useAuth } from '../../hooks/useAuth';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const response = await register(formData);
      const { token, user } = response.data;
      setAuthToken(token);
      setUser(user);
      toast.success('Registration successful');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow rounded-md">
      <h2 className="text-lg font-semibold text-gray-700">Create an Account</h2>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

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
          required
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Register As</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="candidate">Candidate</option>
          <option value="employer">Employer</option>
        </select>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
