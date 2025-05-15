import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Link as LinkIcon, 
  GitHub, 
  Linkedin, 
  Globe, 
  Briefcase, 
  GraduationCap, 
  Languages, 
  Plus, 
  Trash2, 
  Check,
  Save,
  X,
  FileText
} from 'lucide-react';
import api from '../../api';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import { isNotEmpty, isValidEmail, isValidURL, isValidPhone } from '../../utils/validation';
import Modal from '../common/Modal';

// SkillInput component for adding skills
const SkillInput = ({ skills, setSkills }) => {
  const [newSkill, setNewSkill] = useState('');
  
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };
  
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };
  
  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a skill (e.g. React, JavaScript, UI Design)"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddSkill();
            }
          }}
        />
        <button
          type="button"
          onClick={handleAddSkill}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {skills.map((skill, index) => (
          <div key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
            {skill}
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill)}
              className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// LanguageInput component for adding languages
const LanguageInput = ({ languages, setLanguages }) => {
  const [languageForm, setLanguageForm] = useState({ language: '', proficiency: 'Beginner' });
  const [editIndex, setEditIndex] = useState(-1);
  
  const proficiencyLevels = [
    'Beginner',
    'Elementary',
    'Intermediate',
    'Advanced',
    'Fluent',
    'Native'
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLanguageForm({ ...languageForm, [name]: value });
  };
  
  const handleAddLanguage = () => {
    if (!languageForm.language.trim()) return;
    
    if (editIndex >= 0) {
      const updatedLanguages = [...languages];
      updatedLanguages[editIndex] = { ...languageForm };
      setLanguages(updatedLanguages);
      setEditIndex(-1);
    } else {
      setLanguages([...languages, { ...languageForm }]);
    }
    
    setLanguageForm({ language: '', proficiency: 'Beginner' });
  };
  
  const handleEdit = (index) => {
    setLanguageForm({ ...languages[index] });
    setEditIndex(index);
  };
  
  const handleRemove = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
    if (editIndex === index) {
      setEditIndex(-1);
      setLanguageForm({ language: '', proficiency: 'Beginner' });
    }
  };
  
  const getProficiencyColor = (level) => {
    switch (level) {
      case 'Native':
      case 'Fluent':
        return 'bg-green-100 text-green-800';
      case 'Advanced':
        return 'bg-blue-100 text-blue-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <input
            type="text"
            name="language"
            value={languageForm.language}
            onChange={handleChange}
            placeholder="Language (e.g. English, Spanish)"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <select
            name="proficiency"
            value={languageForm.proficiency}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {proficiencyLevels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAddLanguage}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {editIndex >= 0 ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Update
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </>
          )}
        </button>
      </div>
      
      {languages.length > 0 && (
        <div className="space-y-2 mt-4">
          {languages.map((lang, index) => (
            <div key={index} className="flex justify-between items-center p-2 border border-gray-200 rounded-md">
              <div className="flex-1">
                <span className="font-medium text-gray-900">{lang.language}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProficiencyColor(lang.proficiency)}`}>
                  {lang.proficiency}
                </span>
                <button
                  type="button"
                  onClick={() => handleEdit(index)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-red-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ExperienceInput component for adding work experiences
const ExperienceInput = ({ experiences, setExperiences }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentExperience, setCurrentExperience] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });
  const [editIndex, setEditIndex] = useState(-1);
  
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setCurrentExperience({
      ...currentExperience,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // If current job is checked, clear end date
    if (name === 'current' && checked) {
      setCurrentExperience(prev => ({ ...prev, endDate: '' }));
    }
  };
  
  const handleSave = () => {
    if (!currentExperience.title || !currentExperience.company || !currentExperience.startDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (editIndex >= 0) {
      const updatedExperiences = [...experiences];
      updatedExperiences[editIndex] = { ...currentExperience };
      setExperiences(updatedExperiences);
    } else {
      setExperiences([...experiences, { ...currentExperience }]);
    }
    
    setShowModal(false);
    setCurrentExperience({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    });
    setEditIndex(-1);
  };
  
  const handleEdit = (index) => {
    setCurrentExperience({ ...experiences[index] });
    setEditIndex(index);
    setShowModal(true);
  };
  
  const handleRemove = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setCurrentExperience({
              title: '',
              company: '',
              location: '',
              startDate: '',
              endDate: '',
              current: false,
              description: ''
            });
            setEditIndex(-1);
            setShowModal(true);
          }}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Experience
        </button>
      </div>
      
      {experiences.length > 0 ? (
        <div className="space-y-4 mt-4">
          {experiences.map((exp, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-md hover:bg-gray-50">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-md font-medium text-gray-900">{exp.title}</h3>
                  <p className="text-sm text-gray-600">{exp.company} {exp.location ? `• ${exp.location}` : ''}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </p>
                  {exp.description && (
                    <p className="mt-2 text-sm text-gray-700">{exp.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(index)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No work experience added yet.</p>
      )}
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editIndex >= 0 ? "Edit Experience" : "Add Experience"}
        size="lg"
      >
        <div className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Job Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={currentExperience.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company*
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={currentExperience.company}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={currentExperience.location}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date*
                </label>
                <input
                  type="month"
                  id="startDate"
                  name="startDate"
                  value={currentExperience.startDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="month"
                  id="endDate"
                  name="endDate"
                  value={currentExperience.endDate}
                  onChange={handleChange}
                  disabled={currentExperience.current}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    currentExperience.current ? 'bg-gray-100' : ''
                  }`}
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="current"
                name="current"
                checked={currentExperience.current}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="current" className="ml-2 block text-sm text-gray-700">
                I currently work here
              </label>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={currentExperience.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Describe your responsibilities and achievements"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {editIndex >= 0 ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// EducationInput component for adding education
const EducationInput = ({ educations, setEducations }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentEducation, setCurrentEducation] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });
  const [editIndex, setEditIndex] = useState(-1);
  
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setCurrentEducation({
      ...currentEducation,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // If current is checked, clear end date
    if (name === 'current' && checked) {
      setCurrentEducation(prev => ({ ...prev, endDate: '' }));
    }
  };
  
  const handleSave = () => {
    if (!currentEducation.institution || !currentEducation.degree || !currentEducation.startDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (editIndex >= 0) {
      const updatedEducations = [...educations];
      updatedEducations[editIndex] = { ...currentEducation };
      setEducations(updatedEducations);
    } else {
      setEducations([...educations, { ...currentEducation }]);
    }
    
    setShowModal(false);
    setCurrentEducation({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    });
    setEditIndex(-1);
  };
  
  const handleEdit = (index) => {
    setCurrentEducation({ ...educations[index] });
    setEditIndex(index);
    setShowModal(true);
  };
  
  const handleRemove = (index) => {
    setEducations(educations.filter((_, i) => i !== index));
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setCurrentEducation({
              institution: '',
              degree: '',
              field: '',
              startDate: '',
              endDate: '',
              current: false,
              description: ''
            });
            setEditIndex(-1);
            setShowModal(true);
          }}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Education
        </button>
      </div>
      
      {educations.length > 0 ? (
        <div className="space-y-4 mt-4">
          {educations.map((edu, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-md hover:bg-gray-50">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-md font-medium text-gray-900">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">{edu.institution} {edu.field ? `• ${edu.field}` : ''}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </p>
                  {edu.description && (
                    <p className="mt-2 text-sm text-gray-700">{edu.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(index)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No education added yet.</p>
      )}
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editIndex >= 0 ? "Edit Education" : "Add Education"}
        size="lg"
      >
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                Institution*
              </label>
              <input
                type="text"
                id="institution"
                name="institution"
                value={currentEducation.institution}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="degree" className="block text-sm font-medium text-gray-700">
                  Degree / Certificate*
                </label>
                <input
                  type="text"
                  id="degree"
                  name="degree"
                  value={currentEducation.degree}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="field" className="block text-sm font-medium text-gray-700">
                  Field of Study
                </label>
                <input
                  type="text"
                  id="field"
                  name="field"
                  value={currentEducation.field}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date*
                </label>
                <input
                  type="month"
                  id="startDate"
                  name="startDate"
                  value={currentEducation.startDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="month"
                  id="endDate"
                  name="endDate"
                  value={currentEducation.endDate}
                  onChange={handleChange}
                  disabled={currentEducation.current}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    currentEducation.current ? 'bg-gray-100' : ''
                  }`}
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="current"
                name="current"
                checked={currentEducation.current}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="current" className="ml-2 block text-sm text-gray-700">
                I am currently studying here
              </label>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={currentEducation.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Add relevant information about your education"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {editIndex >= 0 ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// SocialLinksInput component for adding social media and professional links
const SocialLinksInput = ({ links, setLinks }) => {
  const [linkForm, setLinkForm] = useState({ title: '', url: '' });
  const [editIndex, setEditIndex] = useState(-1);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLinkForm({ ...linkForm, [name]: value });
  };
  
  const handleSave = () => {
    if (!linkForm.title || !linkForm.url) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (!isValidURL(linkForm.url)) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    if (editIndex >= 0) {
      const updatedLinks = [...links];
      updatedLinks[editIndex] = { ...linkForm };
      setLinks(updatedLinks);
      setEditIndex(-1);
    } else {
      setLinks([...links, { ...linkForm }]);
    }
    
    setLinkForm({ title: '', url: '' });
  };
  
  const handleEdit = (index) => {
    setLinkForm({ ...links[index] });
    setEditIndex(index);
  };
  
  const handleRemove = (index) => {
    setLinks(links.filter((_, i) => i !== index));
    if (editIndex === index) {
      setEditIndex(-1);
      setLinkForm({ title: '', url: '' });
    }
  };
  
  const getLinkIcon = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('github')) return <GitHub className="h-5 w-5 text-gray-700" />;
    if (lowerTitle.includes('linkedin')) return <Linkedin className="h-5 w-5 text-blue-600" />;
    if (lowerTitle.includes('portfolio') || lowerTitle.includes('website')) return <Globe className="h-5 w-5 text-green-600" />;
    return <LinkIcon className="h-5 w-5 text-gray-600" />;
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <input
            type="text"
            name="title"
            value={linkForm.title}
            onChange={handleChange}
            placeholder="Title (e.g. LinkedIn, GitHub)"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="col-span-2">
          <div className="flex space-x-2">
            <input
              type="url"
              name="url"
              value={linkForm.url}
              onChange={handleChange}
              placeholder="URL (e.g. https://linkedin.com/in/username)"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {editIndex >= 0 ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Update
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {links.length > 0 && (
        <div className="space-y-2 mt-4">
          {links.map((link, index) => (
            <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded-md">
              <div className="flex items-center">
                {getLinkIcon(link.title)}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{link.title}</p>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-500">
                    {link.url}
                  </a>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => handleEdit(index)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-red-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    links: [],
    skills: [],
    languages: [],
    experiences: [],
    educations: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic');
  const [completionStatus, setCompletionStatus] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          const mockProfile = {
            name: 'John Smith',
            email: 'john.smith@example.com',
            phone: '+1 (555) 123-4567',
            bio: 'Experienced frontend developer with a passion for creating intuitive and performant user interfaces. Proficient in React, JavaScript, and modern CSS frameworks.',
            location: 'San Francisco, CA',
            website: 'https://johnsmith.dev',
            linkedin: 'https://linkedin.com/in/johnsmith',
            github: 'https://github.com/johnsmith',
            links: [
              { title: 'Portfolio', url: 'https://johnsmith.dev' },
              { title: 'LinkedIn', url: 'https://linkedin.com/in/johnsmith' },
              { title: 'GitHub', url: 'https://github.com/johnsmith' }
            ],
            skills: ['JavaScript', 'React', 'TypeScript', 'HTML', 'CSS', 'Node.js', 'GraphQL', 'Redux'],
            languages: [
              { language: 'English', proficiency: 'Native' },
              { language: 'Spanish', proficiency: 'Intermediate' }
            ],
            experiences: [
              {
                title: 'Senior Frontend Developer',
                company: 'Tech Solutions Inc.',
                location: 'San Francisco, CA',
                startDate: '2021-01',
                endDate: '',
                current: true,
                description: 'Leading frontend development for multiple client projects. Implementing modern React applications with TypeScript and GraphQL.'
              },
              {
                title: 'Frontend Developer',
                company: 'Digital Agency',
                location: 'Portland, OR',
                startDate: '2018-06',
                endDate: '2020-12',
                current: false,
                description: 'Developed responsive web applications for various clients. Collaborated closely with designers and backend developers.'
              }
            ],
            educations: [
              {
                institution: 'University of California, Berkeley',
                degree: 'Bachelor of Science in Computer Science',
                field: 'Computer Science',
                startDate: '2014-09',
                endDate: '2018-05',
                current: false,
                description: 'Graduated with honors. Focused on web development and user interface design.'
              }
            ]
          };
          
          setFormData(mockProfile);
          updateCompletionStatus(mockProfile);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateCompletionStatus = (data) => {
    const status = {
      basic: !!data.name && !!data.email,
      bio: !!data.bio && data.bio.length >= 50,
      skills: data.skills.length >= 3,
      experience: data.experiences.length >= 1,
      education: data.educations.length >= 1,
      languages: data.languages.length >= 1,
      links: data.links.length >= 1
    };
    
    setCompletionStatus(status);
  };

  const getProfileCompletionPercentage = () => {
    const statusValues = Object.values(completionStatus);
    if (statusValues.length === 0) return 0;
    
    const completedSections = statusValues.filter(Boolean).length;
    return Math.round((completedSections / statusValues.length) * 100);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!isNotEmpty(formData.name)) {
      errors.name = 'Name is required';
    }
    
    if (!isNotEmpty(formData.email)) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !isValidPhone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (formData.website && !isValidURL(formData.website)) {
      errors.website = 'Please enter a valid URL';
    }
    
    if (formData.linkedin && !isValidURL(formData.linkedin)) {
      errors.linkedin = 'Please enter a valid LinkedIn URL';
    }
    
    if (formData.github && !isValidURL(formData.github)) {
      errors.github = 'Please enter a valid GitHub URL';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update completion status
      updateCompletionStatus(formData);
      
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <User className="h-5 w-5" /> },
    { id: 'skills', label: 'Skills', icon: <Briefcase className="h-5 w-5" /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase className="h-5 w-5" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="h-5 w-5" /> },
    { id: 'languages', label: 'Languages', icon: <Languages className="h-5 w-5" /> },
    { id: 'links', label: 'Links', icon: <Globe className="h-5 w-5" /> }
  ];

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">My Profile</h1>
          <div className="flex items-center">
            <div className="mr-4">
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${getProfileCompletionPercentage()}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-600">{getProfileCompletionPercentage()}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Profile completion</p>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className={`mr-2 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`}>
                  {tab.icon}
                </span>
                {tab.label}
                {completionStatus[tab.id] ? (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full">
                    <Check className="h-3 w-3" />
                  </span>
                ) : (
                  <span className="ml-2 bg-gray-100 text-gray-400 text-xs px-1.5 py-0.5 rounded-full">
                    <X className="h-3 w-3" />
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Tab content */}
        <div className="mt-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name*
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`pl-10 block w-full shadow-sm sm:text-sm rounded-md ${
                        validationErrors.name
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {validationErrors.name && (
                    <p className="mt-2 text-sm text-red-600">{validationErrors.name}</p>
                  )}
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address*
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 block w-full shadow-sm sm:text-sm rounded-md ${
                        validationErrors.email
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="mt-2 text-sm text-red-600">{validationErrors.email}</p>
                  )}
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`pl-10 block w-full shadow-sm sm:text-sm rounded-md ${
                        validationErrors.phone
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {validationErrors.phone && (
                    <p className="mt-2 text-sm text-red-600">{validationErrors.phone}</p>
                  )}
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="pl-10 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="City, State, Country"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-6">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Professional Summary
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="bio"
                      name="bio"
                      rows={5}
                      value={formData.bio}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Write a brief professional summary about yourself, your experience, and what you're looking for."
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {formData.bio.length} characters (minimum 50 recommended)
                  </p>
                </div>
              </div>
              
              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveTab('skills')}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next: Skills
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Skills</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add your top professional skills. These will help employers find you and match you with relevant job opportunities.
                </p>
              </div>
              
              <SkillInput 
                skills={formData.skills} 
                setSkills={(skills) => setFormData(prev => ({ ...prev, skills }))} 
              />
              
              <div className="pt-5 border-t border-gray-200">
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveTab('basic')}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Previous: Basic Info
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('experience')}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next: Experience
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Work Experience</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add your work experience, starting with your most recent role.
                </p>
              </div>
              
              <ExperienceInput 
                experiences={formData.experiences} 
                setExperiences={(experiences) => setFormData(prev => ({ ...prev, experiences }))} 
              />
              
              <div className="pt-5 border-t border-gray-200">
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveTab('skills')}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Previous: Skills
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('education')}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next: Education
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Education</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add your educational background, including degrees, certificates, and courses.
                </p>
              </div>
              
              <EducationInput 
                educations={formData.educations} 
                setEducations={(educations) => setFormData(prev => ({ ...prev, educations }))} 
              />
              
              <div className="pt-5 border-t border-gray-200">
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveTab('experience')}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Previous: Experience
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('languages')}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next: Languages
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'languages' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Languages</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add languages you speak and your level of proficiency.
                </p>
              </div>
              
              <LanguageInput 
                languages={formData.languages} 
                setLanguages={(languages) => setFormData(prev => ({ ...prev, languages }))} 
              />
              
              <div className="pt-5 border-t border-gray-200">
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveTab('education')}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Previous: Education
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('links')}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next: Links
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'links' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Social & Professional Links</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add links to your online presence, such as your portfolio, LinkedIn, GitHub, or other relevant sites.
                </p>
              </div>
              
              <SocialLinksInput 
                links={formData.links} 
                setLinks={(links) => setFormData(prev => ({ ...prev, links }))} 
              />
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Personal Website
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      name="website"
                      id="website"
                      value={formData.website}
                      onChange={handleChange}
                      className={`pl-10 block w-full shadow-sm sm:text-sm rounded-md ${
                        validationErrors.website
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  {validationErrors.website && (
                    <p className="mt-2 text-sm text-red-600">{validationErrors.website}</p>
                  )}
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                    LinkedIn
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Linkedin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      name="linkedin"
                      id="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className={`pl-10 block w-full shadow-sm sm:text-sm rounded-md ${
                        validationErrors.linkedin
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  {validationErrors.linkedin && (
                    <p className="mt-2 text-sm text-red-600">{validationErrors.linkedin}</p>
                  )}
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                    GitHub
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <GitHub className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      name="github"
                      id="github"
                      value={formData.github}
                      onChange={handleChange}
                      className={`pl-10 block w-full shadow-sm sm:text-sm rounded-md ${
                        validationErrors.github
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="https://github.com/username"
                    />
                  </div>
                  {validationErrors.github && (
                    <p className="mt-2 text-sm text-red-600">{validationErrors.github}</p>
                  )}
                </div>
              </div>
              
              <div className="pt-5 border-t border-gray-200">
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveTab('languages')}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Previous: Languages
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Profile Completion Tips */}
      <div className="bg-blue-50 p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-blue-900 mb-4">Tips for Completing Your Profile</h2>
        <ul className="space-y-2">
          <li className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <Check className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <span className="text-sm font-medium text-blue-800">Add a detailed professional summary</span>
              <p className="text-sm text-blue-700">A well-written summary helps employers understand your background and expertise at a glance.</p>
            </div>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <Check className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <span className="text-sm font-medium text-blue-800">List relevant skills</span>
              <p className="text-sm text-blue-700">Include at least 5-10 key skills that match the jobs you're interested in.</p>
            </div>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <Check className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <span className="text-sm font-medium text-blue-800">Add your work experience</span>
              <p className="text-sm text-blue-700">Detail your responsibilities and achievements in previous roles to showcase your expertise.</p>
            </div>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <Check className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <span className="text-sm font-medium text-blue-800">Link to your professional profiles</span>
              <p className="text-sm text-blue-700">Connect your GitHub, LinkedIn, or portfolio to give employers a more complete picture of your work.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileForm;