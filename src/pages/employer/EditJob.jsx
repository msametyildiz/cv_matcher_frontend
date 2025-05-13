import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Minus, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useForm } from '../../hooks/useForm';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import FormField from '../../components/forms/FormField';
import ArrayField from '../../components/forms/ArrayField';
import AdminPageLayout from '../../components/layouts/AdminPageLayout';

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form handling with custom hook
  const { 
    formData, 
    errors, 
    handleChange, 
    handleSubmit, 
    setFormData, 
    setErrors,
    isSubmitting 
  } = useForm({
    initialValues: {
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
    },
    onSubmit: async (values) => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Job posting updated successfully!');
        navigate('/employer/jobs');
      } catch (error) {
        toast.error('Failed to update job posting');
      }
    },
    validate: (values) => {
      const errors = {};
      
      if (!values.title.trim()) errors.title = 'Job title is required';
      if (!values.company.trim()) errors.company = 'Company name is required';
      if (!values.location.trim() && !values.isRemote) errors.location = 'Location is required for non-remote positions';
      
      if (!values.description.trim()) {
        errors.description = 'Job description is required';
      } else if (values.description.trim().length < 50) {
        errors.description = 'Job description should be at least 50 characters';
      }
      
      return errors;
    }
  });

  // Array field handlers
  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };
  
  const handleAddItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };
  
  const handleRemoveItem = (field, index) => {
    if (formData[field].length <= 1) return;
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      try {
        // Mock data for demonstration
        setTimeout(() => {
          setFormData({
            title: 'Senior Frontend Developer',
            company: 'Tech Solutions Inc.',
            location: 'San Francisco, CA',
            employmentType: 'full-time',
            experienceLevel: 'senior-level',
            description: 'We are looking for an experienced Frontend Developer to join our growing team...',
            responsibilities: [
              'Develop responsive web applications using React',
              'Collaborate with backend developers to integrate REST APIs',
              'Work with UI/UX designers to implement pixel-perfect designs'
            ],
            requirements: [
              'At least 5 years of experience in frontend development',
              'Strong proficiency in JavaScript, HTML5, and CSS3',
              'Experience with React and Redux'
            ],
            benefits: [
              'Competitive salary and equity',
              'Health, dental, and vision insurance',
              'Flexible work schedule'
            ],
            salaryMin: '120000',
            salaryMax: '150000',
            salaryCurrency: 'USD',
            salaryPeriod: 'yearly',
            applicationDeadline: '2023-06-30',
            isRemote: true,
          });
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load job details. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchJob();
  }, [jobId, setFormData]);
  
  // Field options
  const options = {
    employmentTypes: [
      { value: 'full-time', label: 'Full-time' },
      { value: 'part-time', label: 'Part-time' },
      { value: 'contract', label: 'Contract' },
      { value: 'internship', label: 'Internship' }
    ],
    experienceLevels: [
      { value: 'entry-level', label: 'Entry Level' },
      { value: 'mid-level', label: 'Mid Level' },
      { value: 'senior-level', label: 'Senior Level' },
      { value: 'manager', label: 'Manager' }
    ],
    currencies: [
      { value: 'USD', label: 'USD ($)' },
      { value: 'EUR', label: 'EUR (€)' },
      { value: 'GBP', label: 'GBP (£)' },
      { value: 'TRY', label: 'TRY (₺)' }
    ],
    periods: [
      { value: 'hourly', label: 'Per Hour' },
      { value: 'monthly', label: 'Per Month' },
      { value: 'yearly', label: 'Per Year' }
    ]
  };

  if (isLoading) return <Loader message="Loading job details..." />;
  if (error) return <ErrorMessage message={error} onBack={() => navigate('/employer/jobs')} />;

  return (
    <AdminPageLayout title="Edit Job Posting">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Basic Information */}
          <FormField
            id="title"
            label="Job Title *"
            type="text"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="e.g. Software Engineer"
            className="col-span-2 sm:col-span-1"
          />
          
          <FormField
            id="company"
            label="Company *"
            type="text"
            value={formData.company}
            onChange={handleChange}
            error={errors.company}
            placeholder="e.g. Acme Inc."
            className="col-span-2 sm:col-span-1"
          />
          
          <div className="col-span-2 sm:col-span-1 flex items-center">
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
          
          <FormField
            id="location"
            label={`Location ${!formData.isRemote ? '*' : ''}`}
            type="text"
            value={formData.location}
            onChange={handleChange}
            error={errors.location}
            disabled={formData.isRemote}
            placeholder="e.g. New York, NY"
            className="col-span-2 sm:col-span-1"
          />
          
          <FormField
            id="employmentType"
            label="Employment Type *"
            type="select"
            value={formData.employmentType}
            onChange={handleChange}
            options={options.employmentTypes}
            className="col-span-2 sm:col-span-1"
          />
          
          <FormField
            id="experienceLevel"
            label="Experience Level *"
            type="select"
            value={formData.experienceLevel}
            onChange={handleChange}
            options={options.experienceLevels}
            className="col-span-2 sm:col-span-1"
          />
          
          {/* Salary Range */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary Range (Optional)
            </label>
            <div className="grid grid-cols-6 gap-2">
              <FormField
                id="salaryCurrency"
                type="select"
                value={formData.salaryCurrency}
                onChange={handleChange}
                options={options.currencies}
                className="col-span-1"
                noLabel
              />
              <FormField
                id="salaryMin"
                type="number"
                value={formData.salaryMin}
                onChange={handleChange}
                placeholder="Min"
                className="col-span-2"
                noLabel
              />
              <FormField
                id="salaryMax"
                type="number"
                value={formData.salaryMax}
                onChange={handleChange}
                placeholder="Max"
                className="col-span-2"
                noLabel
              />
              <FormField
                id="salaryPeriod"
                type="select"
                value={formData.salaryPeriod}
                onChange={handleChange}
                options={options.periods}
                className="col-span-1"
                noLabel
              />
            </div>
            {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary}</p>}
          </div>
          
          {/* Description */}
          <FormField
            id="description"
            label="Job Description *"
            type="textarea"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            placeholder="Describe the role and responsibilities"
            className="col-span-2"
            helpText={`${formData.description.length} characters (minimum 100)`}
          />
          
          {/* Array Fields */}
          <ArrayField
            label="Responsibilities *"
            name="responsibilities"
            values={formData.responsibilities}
            onChange={handleArrayChange}
            onAdd={() => handleAddItem('responsibilities')}
            onRemove={index => handleRemoveItem('responsibilities', index)}
            className="col-span-2"
          />
          
          <ArrayField
            label="Requirements *"
            name="requirements"
            values={formData.requirements}
            onChange={handleArrayChange}
            onAdd={() => handleAddItem('requirements')}
            onRemove={index => handleRemoveItem('requirements', index)}
            className="col-span-2"
          />
          
          <ArrayField
            label="Benefits (Optional)"
            name="benefits"
            values={formData.benefits}
            onChange={handleArrayChange}
            onAdd={() => handleAddItem('benefits')}
            onRemove={index => handleRemoveItem('benefits', index)}
            className="col-span-2"
          />
          
          {/* Application Deadline */}
          <FormField
            id="applicationDeadline"
            label="Application Deadline (Optional)"
            type="date"
            value={formData.applicationDeadline}
            onChange={handleChange}
            error={errors.applicationDeadline}
            className="col-span-2"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/employer/jobs')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Update Job Posting'}
          </button>
        </div>
      </form>
    </AdminPageLayout>
  );
};

export default EditJob;