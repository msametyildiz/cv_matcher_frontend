import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Clock, Filter, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const JobSearch = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    experienceLevel: '',
    salary: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simulated API call to fetch job listings
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch from your API
        // For this example, we'll use mock data
        setTimeout(() => {
          const mockJobs = [
            {
              id: 1,
              title: 'Frontend Developer',
              company: 'Tech Solutions Inc.',
              location: 'Istanbul, Turkey',
              jobType: 'Full-time',
              salary: '₺20,000 - ₺30,000',
              description: 'We are looking for an experienced Frontend Developer proficient in React, JavaScript, and modern frontend tools.',
              requirements: ['3+ years of React experience', 'Strong JavaScript skills', 'Experience with state management libraries'],
              posted: '2 days ago',
              deadline: '2023-07-30',
              matchScore: 92
            },
            {
              id: 2,
              title: 'Backend Developer',
              company: 'DataFlow Systems',
              location: 'Ankara, Turkey',
              jobType: 'Full-time',
              salary: '₺25,000 - ₺35,000',
              description: 'Backend Developer position focused on building scalable APIs and microservices.',
              requirements: ['Experience with Node.js', 'Knowledge of SQL and NoSQL databases', 'Understanding of RESTful principles'],
              posted: '1 week ago',
              deadline: '2023-08-15',
              matchScore: 78
            },
            {
              id: 3,
              title: 'UI/UX Designer',
              company: 'Creative Studios',
              location: 'Remote',
              jobType: 'Contract',
              salary: '₺15,000 - ₺25,000',
              description: 'Looking for a talented UI/UX Designer to create beautiful, intuitive interfaces.',
              requirements: ['Portfolio demonstrating UI/UX skills', 'Experience with Figma or Adobe XD', 'Understanding of user-centered design'],
              posted: '3 days ago',
              deadline: '2023-08-10',
              matchScore: 85
            },
            {
              id: 4,
              title: 'Full Stack Developer',
              company: 'Innovative Solutions',
              location: 'Istanbul, Turkey',
              jobType: 'Full-time',
              salary: '₺30,000 - ₺40,000',
              description: 'Join our team as a Full Stack Developer working on challenging projects across the stack.',
              requirements: ['Experience with both frontend and backend technologies', 'Knowledge of React and Node.js', 'Database design skills'],
              posted: '5 days ago',
              deadline: '2023-08-05',
              matchScore: 89
            },
            {
              id: 5,
              title: 'DevOps Engineer',
              company: 'Cloud Technologies',
              location: 'Izmir, Turkey',
              jobType: 'Full-time',
              salary: '₺28,000 - ₺38,000',
              description: 'Looking for a DevOps Engineer to improve our deployment processes and infrastructure management.',
              requirements: ['Experience with CI/CD pipelines', 'Knowledge of containerization', 'Cloud platform experience (AWS, Azure, or GCP)'],
              posted: '1 day ago',
              deadline: '2023-08-20',
              matchScore: 73
            }
          ];
          setJobs(mockJobs);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const applyFilters = () => {
    // In a real app, this would trigger an API call with the filters
    console.log('Applying filters:', filters);
  };

  const filteredJobs = jobs.filter(job => {
    return (
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Find Your Perfect Job</h1>
        <p className="text-gray-600">Discover job opportunities matched to your skills and experience</p>
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search job title, company, or keywords"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                id="location"
                name="location"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={filters.location}
                onChange={handleFilterChange}
              >
                <option value="">All Locations</option>
                <option value="istanbul">Istanbul</option>
                <option value="ankara">Ankara</option>
                <option value="izmir">Izmir</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            <div>
              <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                Job Type
              </label>
              <select
                id="jobType"
                name="jobType"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={filters.jobType}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div>
              <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={filters.experienceLevel}
                onChange={handleFilterChange}
              >
                <option value="">All Levels</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="executive">Executive</option>
              </select>
            </div>
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                Salary Range
              </label>
              <select
                id="salary"
                name="salary"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={filters.salary}
                onChange={handleFilterChange}
              >
                <option value="">Any Salary</option>
                <option value="0-15000">₺0 - ₺15,000</option>
                <option value="15000-25000">₺15,000 - ₺25,000</option>
                <option value="25000-35000">₺25,000 - ₺35,000</option>
                <option value="35000+">₺35,000+</option>
              </select>
            </div>
          </div>
        )}

        {showFilters && (
          <div className="flex justify-end">
            <button
              onClick={applyFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply Filters
            </button>
          </div>
        )}
      </div>

      {/* Job listings */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {loading ? 'Loading jobs...' : `${filteredJobs.length} Jobs Found`}
          </h2>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No jobs found matching your criteria.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredJobs.map((job) => (
              <li key={job.id} className="hover:bg-gray-50">
                <Link to={`/candidate/jobs/${job.id}`} className="block">
                  <div className="px-6 py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-blue-600">{job.title}</h3>
                        <p className="text-base text-gray-900 mt-1">{job.company}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </span>
                          <span className="inline-flex items-center text-sm text-gray-500">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {job.jobType}
                          </span>
                          <span className="inline-flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {job.posted}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{job.description}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-medium text-gray-900">{job.salary}</div>
                        {job.matchScore && (
                          <div className="mt-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                            {job.matchScore}% Match
                          </div>
                        )}
                        <div className="mt-4 flex items-center text-sm text-blue-600 hover:text-blue-800">
                          View Details <ArrowRight className="ml-1 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default JobSearch;