import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Filter, 
  ChevronDown, 
  X, 
  User, 
  Briefcase, 
  GraduationCap,
  Clock,
  Star,
  RefreshCw
} from 'lucide-react';
import api from '../../api';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useDebounce } from '../../hooks/useDebounce';

const CandidateSearch = () => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    skills: [],
    experience: 'all',
    education: 'all',
    availability: 'all',
    jobTitle: '',
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // State for candidates and pagination
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    totalPages: 1,
    totalCandidates: 0
  });
  
  // Debounce search to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  // Fetch candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        // In a real app, we would call the API
        // const response = await api.employer.searchCandidates({
        //   search: debouncedSearchQuery,
        //   ...filters,
        //   sort: sortBy,
        //   page: pagination.page,
        //   perPage: pagination.perPage
        // });
        
        // Mock data for development
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock candidates
        const mockCandidates = Array(12).fill().map((_, idx) => ({
          id: idx + 1,
          name: [
            'John Smith', 
            'Sarah Johnson', 
            'Michael Chen', 
            'Emily Rodriguez', 
            'David Kim', 
            'Jennifer Taylor', 
            'Mohammed Al-Farsi', 
            'Laura Garcia'
          ][idx % 8],
          title: [
            'Frontend Developer', 
            'UX Designer', 
            'Full Stack Engineer', 
            'Product Manager', 
            'Data Scientist', 
            'DevOps Engineer',
            'Mobile Developer',
            'Marketing Specialist'
          ][idx % 8],
          location: [
            'San Francisco, CA', 
            'New York, NY', 
            'Remote', 
            'Chicago, IL', 
            'London, UK',
            'Toronto, Canada',
            'Berlin, Germany',
            'Sydney, Australia'
          ][idx % 8],
          skills: [
            ['JavaScript', 'React', 'CSS', 'HTML', 'Node.js'],
            ['UI/UX', 'Figma', 'User Research', 'Wireframing', 'Prototyping'],
            ['Python', 'Django', 'JavaScript', 'PostgreSQL', 'Docker'],
            ['Product Management', 'Agile', 'JIRA', 'User Stories', 'Roadmapping'],
            ['Python', 'TensorFlow', 'pandas', 'SQL', 'Data Visualization'],
            ['Kubernetes', 'Docker', 'CI/CD', 'AWS', 'Terraform'],
            ['Swift', 'Kotlin', 'React Native', 'Flutter', 'Firebase'],
            ['SEO', 'Content Strategy', 'Analytics', 'Social Media', 'Email Marketing']
          ][idx % 8],
          experience: [
            '5+ years',
            '3-5 years',
            '1-3 years',
            '7+ years',
            '2-4 years',
            '6+ years',
            '4+ years',
            '1-2 years'
          ][idx % 8],
          education: [
            'BS Computer Science',
            'BFA Design',
            'MS Computer Engineering',
            'MBA',
            'PhD Data Science',
            'BS Information Technology',
            'BA Computer Science',
            'MS Marketing'
          ][idx % 8],
          lastActive: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
          matchScore: Math.floor(Math.random() * 20) + 80,
          availability: [
            'Immediately',
            '2 weeks',
            '1 month',
            'Immediately',
            '2 weeks',
            '3 months',
            'Immediately',
            '2 weeks'
          ][idx % 8]
        }));
        
        setCandidates(mockCandidates);
        setPagination(prev => ({
          ...prev,
          totalPages: 5,
          totalCandidates: 48
        }));
      } catch (err) {
        console.error('Error fetching candidates:', err);
        setError('Failed to load candidates. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCandidates();
  }, [debouncedSearchQuery, filters, sortBy, pagination.page]);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  // Add a skill to filters
  const handleAddSkill = (skill) => {
    if (skill && !filters.skills.includes(skill)) {
      setFilters(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };
  
  // Remove a skill from filters
  const handleRemoveSkill = (skill) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      location: '',
      skills: [],
      experience: 'all',
      education: 'all',
      availability: 'all',
      jobTitle: '',
    });
    setSortBy('relevance');
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      searchQuery || 
      filters.location ||
      filters.skills.length > 0 ||
      filters.experience !== 'all' ||
      filters.education !== 'all' ||
      filters.availability !== 'all' ||
      filters.jobTitle
    );
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      return `${Math.floor(diffInDays / 7)} weeks ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Find Candidates</h1>
        
        <button
          onClick={() => clearFilters()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset Filters
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by name, skills, or job title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="location"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Location"
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>
          
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {showAdvancedFilters ? 'Hide Filters' : 'More Filters'}
          </button>
        </div>
        
        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={filters.jobTitle}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g. Software Engineer"
                />
              </div>
              
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level
                </label>
                <select
                  id="experience"
                  name="experience"
                  value={filters.experience}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">Any Experience</option>
                  <option value="entry">Entry Level (0-1 years)</option>
                  <option value="junior">Junior (1-3 years)</option>
                  <option value="mid">Mid-Level (3-5 years)</option>
                  <option value="senior">Senior (5+ years)</option>
                  <option value="lead">Lead/Manager (8+ years)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                  Education Level
                </label>
                <select
                  id="education"
                  name="education"
                  value={filters.education}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">Any Education</option>
                  <option value="highschool">High School</option>
                  <option value="associate">Associate's Degree</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                  <option value="phd">PhD or Higher</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <select
                  id="availability"
                  name="availability"
                  value={filters.availability}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">Any Availability</option>
                  <option value="immediate">Immediate</option>
                  <option value="2weeks">Within 2 Weeks</option>
                  <option value="month">Within a Month</option>
                  <option value="3months">Within 3 Months</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {filters.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                    >
                      <span className="sr-only">Remove skill</span>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              
              <div className="flex">
                <input
                  type="text"
                  id="skillInput"
                  className="block w-full rounded-l-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Add a skill (e.g. JavaScript, Product Management)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm"
                  onClick={() => {
                    const input = document.getElementById('skillInput');
                    handleAddSkill(input.value);
                    input.value = '';
                  }}
                >
                  Add
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Press Enter to add a skill
              </p>
            </div>
          </div>
        )}
        
        {/* Active Filters */}
        {hasActiveFilters() && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Active filters:</span>
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {searchQuery}
                    <button 
                      type="button"
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                      onClick={() => setSearchQuery('')}
                    >
                      <span className="sr-only">Remove filter</span>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {filters.location && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {filters.location}
                    <button 
                      type="button"
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                      onClick={() => setFilters(prev => ({ ...prev, location: '' }))}
                    >
                      <span className="sr-only">Remove filter</span>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {filters.jobTitle && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Job: {filters.jobTitle}
                    <button 
                      type="button"
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                      onClick={() => setFilters(prev => ({ ...prev, jobTitle: '' }))}
                    >
                      <span className="sr-only">Remove filter</span>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {filters.experience !== 'all' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {filters.experience} experience
                    <button 
                      type="button"
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                      onClick={() => setFilters(prev => ({ ...prev, experience: 'all' }))}
                    >
                      <span className="sr-only">Remove filter</span>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {filters.education !== 'all' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {filters.education} education
                    <button 
                      type="button"
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                      onClick={() => setFilters(prev => ({ ...prev, education: 'all' }))}
                    >
                      <span className="sr-only">Remove filter</span>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {filters.availability !== 'all' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {filters.availability} availability
                    <button 
                      type="button"
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                      onClick={() => setFilters(prev => ({ ...prev, availability: 'all' }))}
                    >
                      <span className="sr-only">Remove filter</span>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            {loading ? 'Searching candidates...' : `${pagination.totalCandidates} candidates found`}
          </h2>
          <p className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * pagination.perPage) + 1} to {Math.min(pagination.page * pagination.perPage, pagination.totalCandidates)} of {pagination.totalCandidates} results
          </p>
        </div>
        
        <div className="mt-2 sm:mt-0 relative">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="relevance">Relevance</option>
              <option value="recent">Most Recent</option>
              <option value="experience-high">Experience (High to Low)</option>
              <option value="experience-low">Experience (Low to High)</option>
              <option value="match">Match Score</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Candidate Results */}
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : candidates.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
            <User className="h-6 w-6 text-gray-400" aria-hidden="true" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No candidates found</h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search criteria or filters to see more results.
          </p>
          {hasActiveFilters() && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <div 
              key={candidate.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">
                    <Link to={`/employer/candidates/${candidate.id}`} className="hover:text-blue-600">
                      {candidate.name}
                    </Link>
                  </h3>
                  {candidate.matchScore && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      candidate.matchScore >= 90 ? 'bg-green-100 text-green-800' :
                      candidate.matchScore >= 70 ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {candidate.matchScore}% Match
                    </span>
                  )}
                </div>
                
                <div className="mt-2">
                  <p className="text-base font-medium text-gray-700">{candidate.title}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <span>{candidate.location}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center text-sm font-medium text-gray-700">
                    <Briefcase className="h-4 w-4 text-gray-500 mr-1.5" />
                    Experience: {candidate.experience}
                  </div>
                  
                  <div className="flex items-center text-sm font-medium text-gray-700 mt-1">
                    <GraduationCap className="h-4 w-4 text-gray-500 mr-1.5" />
                    {candidate.education}
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700">Skills</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {candidate.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>Last active {formatDate(candidate.lastActive)}</span>
                  </div>
                  <Link 
                    to={`/employer/candidates/${candidate.id}`}
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {candidates.length > 0 && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Generate page buttons */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, idx) => {
              const pageNumber = idx + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setPagination(prev => ({ ...prev, page: pageNumber }))}
                  aria-current={pageNumber === pagination.page ? 'page' : undefined}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    pageNumber === pagination.page
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      )}
      
      {/* Tips for finding candidates */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-medium text-blue-900">Tips for Finding Great Candidates</h2>
        <ul className="mt-4 space-y-2 text-sm text-blue-700">
          <li className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-3">Focus on skills rather than just job titles to find candidates with transferable abilities.</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-3">Consider candidates from adjacent industries who may bring fresh perspectives.</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-3">Look beyond traditional education backgrounds to find diverse talent.</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-3">Connect with passive candidates who may not be actively searching but are open to new opportunities.</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CandidateSearch;