import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Plus, 
  Minus, 
  Edit, 
  Save, 
  X, 
  Link as LinkIcon,
  FileText
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Fields for editing each section
  const [editFields, setEditFields] = useState({
    personal: {
      name: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      about: ''
    },
    experience: [],
    education: [],
    skills: [],
    languages: [],
    links: []
  });
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real application, we would fetch from an API
      // const response = await api.candidate.getProfile();
      // setProfile(response.data);
      
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProfile = {
        personal: {
          name: user?.name || 'John Smith',
          email: user?.email || 'john.smith@example.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          website: 'https://johnsmith.dev',
          about: 'Experienced frontend developer with a passion for creating intuitive and performant user interfaces. Proficient in React, JavaScript, and modern CSS frameworks.'
        },
        experience: [
          {
            id: 1,
            title: 'Senior Frontend Developer',
            company: 'Tech Solutions Inc.',
            location: 'San Francisco, CA',
            startDate: '2021-01',
            endDate: null,
            current: true,
            description: 'Leading frontend development for multiple client projects. Implementing modern React applications with TypeScript and GraphQL.'
          },
          {
            id: 2,
            title: 'Frontend Developer',
            company: 'Digital Agency',
            location: 'Portland, OR',
            startDate: '2018-06',
            endDate: '2020-12',
            current: false,
            description: 'Developed responsive web applications for various clients. Collaborated closely with designers and backend developers.'
          }
        ],
        education: [
          {
            id: 1,
            degree: 'Bachelor of Science in Computer Science',
            institution: 'University of California, Berkeley',
            location: 'Berkeley, CA',
            startDate: '2014-09',
            endDate: '2018-05',
            description: 'Graduated with honors. Focused on web development and user interface design.'
          }
        ],
        skills: [
          'JavaScript', 'React', 'TypeScript', 'HTML', 'CSS', 'Node.js', 'GraphQL', 'Redux', 'Tailwind CSS', 'Git'
        ],
        languages: [
          { language: 'English', proficiency: 'Native' },
          { language: 'Spanish', proficiency: 'Intermediate' }
        ],
        links: [
          { title: 'GitHub', url: 'https://github.com/johnsmith' },
          { title: 'LinkedIn', url: 'https://linkedin.com/in/johnsmith' },
          { title: 'Portfolio', url: 'https://johnsmith.dev' }
        ]
      };
      
      setProfile(mockProfile);
      
      // Initialize edit fields with current profile data
      setEditFields({
        personal: { ...mockProfile.personal },
        experience: [...mockProfile.experience],
        education: [...mockProfile.education],
        skills: [...mockProfile.skills],
        languages: [...mockProfile.languages],
        links: [...mockProfile.links]
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (section) => {
    setActiveSection(section);
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    // Reset edit fields to current profile data
    setEditFields({
      personal: { ...profile.personal },
      experience: [...profile.experience],
      education: [...profile.education],
      skills: [...profile.skills],
      languages: [...profile.languages],
      links: [...profile.links]
    });
    
    setIsEditing(false);
    setActiveSection(null);
  };
  
  const handleChange = (section, field, value) => {
    if (section === 'personal') {
      setEditFields(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          [field]: value
        }
      }));
    }
  };
  
  const handleArrayItemChange = (section, index, field, value) => {
    setEditFields(prev => {
      const newItems = [...prev[section]];
      
      if (typeof newItems[index] === 'object') {
        newItems[index] = {
          ...newItems[index],
          [field]: value
        };
      } else {
        newItems[index] = value;
      }
      
      return {
        ...prev,
        [section]: newItems
      };
    });
  };
  
  const handleAddItem = (section) => {
    setEditFields(prev => {
      const newItems = [...prev[section]];
      
      if (section === 'experience') {
        newItems.push({
          id: Date.now(),
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        });
      } else if (section === 'education') {
        newItems.push({
          id: Date.now(),
          degree: '',
          institution: '',
          location: '',
          startDate: '',
          endDate: '',
          description: ''
        });
      } else if (section === 'languages') {
        newItems.push({ language: '', proficiency: '' });
      } else if (section === 'links') {
        newItems.push({ title: '', url: '' });
      } else {
        newItems.push('');
      }
      
      return {
        ...prev,
        [section]: newItems
      };
    });
  };
  
  const handleRemoveItem = (section, index) => {
    setEditFields(prev => {
      const newItems = [...prev[section]];
      newItems.splice(index, 1);
      
      return {
        ...prev,
        [section]: newItems
      };
    });
  };
  
  const handleSave = async (section) => {
    setIsSaving(true);
    
    try {
      // In a real application, we would call the API
      // await api.candidate.updateProfile({ [section]: editFields[section] });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local profile data
      setProfile(prev => ({
        ...prev,
        [section]: editFields[section]
      }));
      
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully`);
      setIsEditing(false);
      setActiveSection(null);
    } catch (error) {
      console.error(`Error updating ${section}:`, error);
      toast.error(`Failed to update ${section}. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };
  
  if (loading) {
    return <Loader />;
  }
  
  if (error) {
    return <ErrorMessage message={error} onRetry={fetchProfile} />;
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
      
      <div className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
            {!isEditing && (
              <button
                type="button"
                onClick={() => handleEdit('personal')}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
            )}
          </div>
          
          <div className="px-6 py-5">
            {isEditing && activeSection === 'personal' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={editFields.personal.name}
                        onChange={(e) => handleChange('personal', 'name', e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={editFields.personal.email}
                        onChange={(e) => handleChange('personal', 'email', e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={editFields.personal.phone}
                        onChange={(e) => handleChange('personal', 'phone', e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="location"
                        id="location"
                        value={editFields.personal.location}
                        onChange={(e) => handleChange('personal', 'location', e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                      Website
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="website"
                        id="website"
                        value={editFields.personal.website}
                        onChange={(e) => handleChange('personal', 'website', e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                      About
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="about"
                        name="about"
                        rows={4}
                        value={editFields.personal.about}
                        onChange={(e) => handleChange('personal', 'about', e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Write a few sentences about yourself.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave('personal')}
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.personal.name}</dd>
                </div>
                
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.personal.email}</dd>
                </div>
                
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    Phone
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.personal.phone}</dd>
                </div>
                
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    Location
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.personal.location}</dd>
                </div>
                
                {profile.personal.website && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-gray-400" />
                      Website
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <a href={profile.personal.website} className="text-blue-600 hover:text-blue-500" target="_blank" rel="noopener noreferrer">
                        {profile.personal.website}
                      </a>
                    </dd>
                  </div>
                )}
                
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-400" />
                    About
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.personal.about}</dd>
                </div>
              </dl>
            )}
          </div>
        </div>
        
        {/* Work Experience */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Work Experience</h2>
            {!isEditing && (
              <button
                type="button"
                onClick={() => handleEdit('experience')}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
            )}
          </div>
          
          <div className="px-6 py-5">
            {isEditing && activeSection === 'experience' ? (
              <div className="space-y-6">
                {editFields.experience.map((job, index) => (
                  <div key={job.id || index} className="border border-gray-200 rounded-md p-4 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('experience', index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    
                    <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Job Title
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            value={job.title}
                            onChange={(e) => handleArrayItemChange('experience', index, 'title', e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Company
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            value={job.company}
                            onChange={(e) => handleArrayItemChange('experience', index, 'company', e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Location
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            value={job.location}
                            onChange={(e) => handleArrayItemChange('experience', index, 'location', e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <div className="flex items-center mt-6">
                          <input
                            id={`current-job-${index}`}
                            name={`current-job-${index}`}
                            type="checkbox"
                            checked={job.current}
                            onChange={(e) => handleArrayItemChange('experience', index, 'current', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`current-job-${index}`} className="ml-2 block text-sm text-gray-700">
                            I currently work here
                          </label>
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Start Date
                        </label>
                        <div className="mt-1">
                          <input
                            type="month"
                            value={job.startDate}
                            onChange={(e) => handleArrayItemChange('experience', index, 'startDate', e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                      {!job.current && (
                        <div className="sm:col-span-3">
                          <label className="block text-sm font-medium text-gray-700">
                            End Date
                          </label>
                          <div className="mt-1">
                            <input
                              type="month"
                              value={job.endDate || ''}
                              onChange={(e) => handleArrayItemChange('experience', index, 'endDate', e.target.value)}
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="sm:col-span-6">
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <div className="mt-1">
                          <textarea
                            rows={3}
                            value={job.description}
                            onChange={(e) => handleArrayItemChange('experience', index, 'description', e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => handleAddItem('experience')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Experience
                </button>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave('experience')}
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {profile.experience.length > 0 ? (
                  profile.experience.map((job) => (
                    <div key={job.id} className="relative">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-500">
                            {job.company} • {job.location}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 ml-14">
                        <p className="text-sm text-gray-600">
                          {formatDate(job.startDate)} - {job.current ? 'Present' : formatDate(job.endDate)}
                        </p>
                        <p className="mt-2 text-sm text-gray-600">{job.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No work experience added yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Education */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Education</h2>
            {!isEditing && (
              <button
                type="button"
                onClick={() => handleEdit('education')}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
            )}
          </div>
          
          <div className="px-6 py-5">
            {isEditing && activeSection === 'education' ? (
              <div className="space-y-6">
                {editFields.education.map((edu, index) => (
                  <div key={edu.id || index} className="border border-gray-200 rounded-md p-4 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('education', index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    
                    <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Degree
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleArrayItemChange('education', index, 'degree', e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Institution
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => handleArrayItemChange('education', index, 'institution', e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-6">
                        <label className="block text-sm font-medium text-gray-700">
                          Location
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            value={edu.location}
                            onChange={(e) => handleArrayItemChange('education', index, 'location', e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Start Date
                        </label>
                        <div className="mt-1">
                          <input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => handleArrayItemChange('education', index, 'startDate', e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">
                          End Date
                        </label>
                        <div className="mt-1">
                          <input
                            type="month"
                            value={edu.endDate || ''}
                            onChange={(e) => handleArrayItemChange('education', index, 'endDate', e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-6">
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <div className="mt-1">
                          <textarea
                            rows={3}
                            value={edu.description}
                            onChange={(e) => handleArrayItemChange('education', index, 'description', e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => handleAddItem('education')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Education
                </button>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave('education')}
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {profile.education.length > 0 ? (
                  profile.education.map((edu) => (
                    <div key={edu.id} className="relative">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{edu.degree}</h3>
                          <p className="text-sm text-gray-500">
                            {edu.institution} • {edu.location}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 ml-14">
                        <p className="text-sm text-gray-600">
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </p>
                        <p className="mt-2 text-sm text-gray-600">{edu.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No education added yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Skills */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Skills</h2>
            {!isEditing && (
              <button
                type="button"
                onClick={() => handleEdit('skills')}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
            )}
          </div>
          
          <div className="px-6 py-5">
            {isEditing && activeSection === 'skills' ? (
              <div className="space-y-6">
                {editFields.skills.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleArrayItemChange('skills', index, null, e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('skills', index)}
                      className="ml-2 inline-flex items-center text-sm text-gray-400 hover:text-gray-500"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => handleAddItem('skills')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Skill
                </button>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave('skills')}
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No skills added yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Languages */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Languages</h2>
            {!isEditing && (
              <button
                type="button"
                onClick={() => handleEdit('languages')}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
            )}
          </div>
          
          <div className="px-6 py-5">
            {isEditing && activeSection === 'languages' ? (
              <div className="space-y-6">
                {editFields.languages.map((lang, index) => (
                  <div key={