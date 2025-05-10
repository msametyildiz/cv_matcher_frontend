// src/components/candidate/ProfileForm.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../api';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    linkedin: '',
    github: '',
    location: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/candidate/profile');
        setFormData(res.data);
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/candidate/profile', formData);
      toast.success('Profile updated');
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow-md max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800">Edit Your Profile</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled
          className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
        <input
          type="url"
          name="linkedin"
          value={formData.linkedin}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">GitHub</label>
        <input
          type="url"
          name="github"
          value={formData.github}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
        ></textarea>
      </div>

      <div>
        <button
          type="submit"
          disabled={saving}
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;