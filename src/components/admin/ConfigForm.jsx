// src/components/admin/ConfigForm.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../api';

const ConfigForm = () => {
  const [formData, setFormData] = useState({
    siteName: '',
    maxUploadSizeMB: '',
    enableMatching: false,
    enableRegistration: true,
    contactEmail: '',
    maintenanceMode: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.get('/admin/config');
        setFormData(res.data);
      } catch (err) {
        toast.error('Failed to load configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.put('/admin/config', formData);
      toast.success('Configuration saved');
    } catch (err) {
      toast.error('Failed to save configuration');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Loading configuration...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md p-6 rounded-md">
      <h2 className="text-lg font-semibold text-gray-700">System Configuration</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Site Name</label>
        <input
          type="text"
          name="siteName"
          value={formData.siteName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Max Upload Size (MB)</label>
        <input
          type="number"
          name="maxUploadSizeMB"
          value={formData.maxUploadSizeMB}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="enableMatching"
          checked={formData.enableMatching}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="ml-2 block text-sm text-gray-700">Enable AI Matching</label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="enableRegistration"
          checked={formData.enableRegistration}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="ml-2 block text-sm text-gray-700">Allow User Registration</label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Contact Email</label>
        <input
          type="email"
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="maintenanceMode"
          checked={formData.maintenanceMode}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="ml-2 block text-sm text-gray-700">Maintenance Mode</label>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
};

export default ConfigForm;