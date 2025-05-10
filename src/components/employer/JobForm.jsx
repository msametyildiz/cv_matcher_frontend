// src/components/employer/JobForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../api/job';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const JobForm = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!jobId);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    requirements: '',
    salaryRange: '',
    type: 'Full-time'
  });

  useEffect(() => {
    if (!jobId) return;
    const fetchJob = async () => {
      try {
        const res = await api.get(`/employer/jobs/${jobId}`);
        setFormData(res.data);
      } catch (err) {
        setError('Failed to load job data');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (jobId) {
        await api.put(`/employer/jobs/${jobId}`, formData);
        toast.success('Job updated');
      } else {
        await api.post('/employer/jobs', formData);
        toast.success('Job created');
      }
      navigate('/employer/jobs');
    } catch (err) {
      toast.error('Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800">{jobId ? 'Edit Job' : 'Create Job'}</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Job Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Salary Range</label>
          <input
            name="salaryRange"
            value={formData.salaryRange}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Job Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Requirements</label>
        <textarea
          name="requirements"
          rows={3}
          value={formData.requirements}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full py-2 px-4 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : jobId ? 'Update Job' : 'Create Job'}
      </button>
    </form>
  );
};

export default JobForm;
