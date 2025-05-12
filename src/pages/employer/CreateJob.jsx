import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CreateJob = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    employmentType: 'full-time',
    experienceLevel: 'mid-level',
    description: '',
    responsibilities: [''],
    requirements: [''],
    benefits: [''],
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'USD',
    salaryPeriod: 'yearly',
    applicationDeadline: '',
    isRemote: false,
  });
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle array item changes (responsibilities, requirements, benefits)
  const handleArrayItemChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };
  
  // Add new array item
  const handleAddArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };
  
  // Remove array item
  const handleRemoveArrayItem = (field, index) => {
    if (formData[field].length === 1) return;
    
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.location.trim() && !formData.isRemote) newErrors.location = 'Location is required for non-remote positions';
    
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    } else if (formData.description.length < 100) {
      newErrors.description = 'Job description should be at least 100 characters';
    }
    
    // Validate salary if provided
    if (formData.salaryMin && formData.salaryMax) {
      const min = parseFloat(formData.salaryMin);
      const max = parseFloat(formData.salaryMax);
      
      if (isNaN(min) || isNaN(max)) {
        newErrors.salary = 'Salary values must be valid numbers';
      } else if (min > max) {
        newErrors.salary = 'Minimum salary cannot be greater than maximum salary';
      }
    }
    
    // Validate application deadline
    if (formData.applicationDeadline) {
      const deadlineDate = new Date(formData.applicationDeadline);
      const today = new Date();
      
      if (isNaN(deadlineDate.getTime())) {
        newErrors.applicationDeadline = 'Invalid date format';
      } else if (deadlineDate < today) {
        newErrors.applicationDeadline = 'Application deadline cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real application, we would submit to the API
      // await api.job.createJob(formData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Job posting created successfully!');
      navigate('/employer/jobs');
    } catch (error) {
      console.error('Error creating job posting:', error);
      toast.error('Failed to create job posting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Form options
  const options = {
    employmentTypes: [
      { value: 'full-time', label: 'Full-time' },
      { value: 'part-time', label: 'Part-time' },
      { value: 'contract', label: 'Contract' },
      { value: 'freelance', label: 'Freelance' },
      { value: 'internship', label: 'Internship' }
    ],
    experienceLevels: [
      { value: 'entry-level', label: 'Entry Level' },
      { value: 'mid-level', label: 'Mid Level' },
      { value: 'senior-level', label: 'Senior Level' },
      { value: 'manager', label: 'Manager' },
      { value: 'executive', label: 'Executive' }
    ],
    currencies: [
      { value: 'USD', label: 'USD ($)' },
      { value: 'EUR', label: 'EUR (€)' },
      { value: 'GBP', label: 'GBP (£)' }
    ],
    periods: [
      { value: 'hourly', label: 'Per Hour' },
      { value: 'monthly', label: 'Per Month' },
      { value: 'yearly', label: 'Per Year' }
    ]
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">Create New Job Posting</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill out the form below to create a new job posting. Fields marked with * are required.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Job Title */}
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Job Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="e.g. Software Engineer, Marketing Manager"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>
          
          {/* Company */}
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Company *
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={`form-input ${errors.company ? 'error' : ''}`}
              placeholder="e.g. Acme Inc."
            />
            {errors.company && (
              <p className="mt-1 text-sm text-red-600">{errors.company}</p>
            )}
          </div>
          
          {/* Remote Option */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRemote"
                name="isRemote"
                checked={formData.isRemote}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isRemote" className="ml-2 block text-sm text-gray-700">
                This is a remote position
              </label>
            </div>
          </div>
          
          {/* Location */}
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location {!formData.isRemote && '*'}
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={formData.isRemote}
              className={`form-input ${errors.location ? 'error' : ''} ${formData.isRemote ? 'bg-gray-100' : ''}`}
              placeholder="e.g. New York, NY"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>
          
          {/* Employment Type */}
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">
              Employment Type *
            </label>
            <select
              id="employmentType"
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="form-select"
            >
              {options.employmentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Experience Level */}
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">
              Experience Level *
            </label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="form-select"
            >
              {options.experienceLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Job Description */}
          <div className="col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Job Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Describe the role, the company, and what you're looking for in a candidate"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.description.length} characters (minimum 100)
            </p>
          </div>
          
          {/* Responsibilities */}
          <div className="col-span-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Responsibilities *
              </label>
              <button
                type="button"
                onClick={() => handleAddArrayItem('responsibilities')}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                <Plus className="h-4 w-4 mr-1 inline" />
                Add Another
              </button>
            </div>
            
            {formData.responsibilities.map((responsibility, index) => (
              <div key={`responsibility-${index}`} className="mt-2 flex">
                <input
                  type="text"
                  value={responsibility}
                  onChange={(e) => handleArrayItemChange('responsibilities', index, e.target.value)}
                  className="form-input"
                  placeholder={`Responsibility ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('responsibilities', index)}
                  disabled={formData.responsibilities.length === 1}
                  className="ml-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          
          {/* Requirements */}
          <div className="col-span-2 mt-6">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Requirements *
              </label>
              <button
                type="button"
                onClick={() => handleAddArrayItem('requirements')}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                <Plus className="h-4 w-4 mr-1 inline" />
                Add Another
              </button>
            </div>
            
            {formData.requirements.map((requirement, index) => (
              <div key={`requirement-${index}`} className="mt-2 flex">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => handleArrayItemChange('requirements', index, e.target.value)}
                  className="form-input"
                  placeholder={`Requirement ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('requirements', index)}
                  disabled={formData.requirements.length === 1}
                  className="ml-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          
          {/* Salary Range */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Salary Range (Optional)
            </label>
            <div className="grid grid-cols-6 gap-2 mt-1">
              <select
                id="salaryCurrency"
                name="salaryCurrency"
                value={formData.salaryCurrency}
                onChange={handleChange}
                className="col-span-1 form-select"
              >
                {options.currencies.map(currency => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                id="salaryMin"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleChange}
                placeholder="Min"
                className="col-span-2 form-input"
              />
              <input
                type="number"
                id="salaryMax"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleChange}
                placeholder="Max"
                className="col-span-2 form-input"
              />
              <select
                id="salaryPeriod"
                name="salaryPeriod"
                value={formData.salaryPeriod}
                onChange={handleChange}
                className="col-span-1 form-select"
              >
                {options.periods.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.salary && (
              <p className="mt-1 text-sm text-red-600">{errors.salary}</p>
            )}
          </div>
          
          {/* Application Deadline */}
          <div className="col-span-2">
            <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700">
              Application Deadline (Optional)
            </label>
            <input
              type="date"
              id="applicationDeadline"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              className={`form-input ${errors.applicationDeadline ? 'error' : ''}`}
            />
            {errors.applicationDeadline && (
              <p className="mt-1 text-sm text-red-600">{errors.applicationDeadline}</p>
            )}
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            className="btn-secondary mr-3"
            onClick={() => navigate('/employer/jobs')}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? 'Creating...' : 'Create Job Posting'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;