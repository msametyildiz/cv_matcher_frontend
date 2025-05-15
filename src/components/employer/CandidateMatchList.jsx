import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Filter, User, Check, X, Star, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';

const CandidateMatchList = ({ candidates, jobId }) => {
  const [sortBy, setSortBy] = useState('score');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filters, setFilters] = useState({
    minimumScore: 0,
    showReviewed: true,
    showPending: true
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseInt(value, 10)
    }));
  };
  
  // Sort candidates
  const sortedCandidates = [...candidates].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'score':
        aValue = a.matchScore;
        bValue = b.matchScore;
        break;
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'date':
        aValue = new Date(a.applicationDate);
        bValue = new Date(b.applicationDate);
        break;
      default:
        aValue = a.matchScore;
        bValue = b.matchScore;
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  // Filter candidates
  const filteredCandidates = sortedCandidates.filter(candidate => {
    if (candidate.matchScore < filters.minimumScore) {
      return false;
    }
    
    if (!filters.showReviewed && candidate.status === 'reviewed') {
      return false;
    }
    
    if (!filters.showPending && candidate.status === 'pending') {
      return false;
    }
    
    return true;
  });
  
  // Get score color
  const getScoreColor = (score) => {
    if (score >= 85) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Matched Candidates
          </h3>
          <div className="mt-3 sm:mt-0 flex items-center">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="minimumScore" className="block text-sm font-medium text-gray-700">
                Minimum Match Score
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="range"
                  id="minimumScore"
                  name="minimumScore"
                  min="0"
                  max="100"
                  value={filters.minimumScore}
                  onChange={handleFilterChange}
                  className="w-full"
                />
                <span className="ml-2 text-sm text-gray-500">{filters.minimumScore}%</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  id="showReviewed"
                  name="showReviewed"
                  type="checkbox"
                  checked={filters.showReviewed}
                  onChange={handleFilterChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="showReviewed" className="ml-2 block text-sm text-gray-700">
                  Show Reviewed
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="showPending"
                  name="showPending"
                  type="checkbox"
                  checked={filters.showPending}
                  onChange={handleFilterChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="showPending" className="ml-2 block text-sm text-gray-700">
                  Show Pending
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Table header */}
      <div className="hidden md:flex md:items-center px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
        <div className="w-12 px-2"></div>
        <div 
          className="w-1/3 px-2 flex items-center cursor-pointer"
          onClick={() => handleSortChange('name')}
        >
          Candidate 
          {sortBy === 'name' && (
            sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
          )}
        </div>
        <div 
          className="w-1/6 px-2 flex items-center cursor-pointer"
          onClick={() => handleSortChange('score')}
        >
          Match Score
          {sortBy === 'score' && (
            sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
          )}
        </div>
        <div 
          className="w-1/6 px-2 flex items-center cursor-pointer"
          onClick={() => handleSortChange('date')}
        >
          Applied On
          {sortBy === 'date' && (
            sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
          )}
        </div>
        <div className="w-1/6 px-2">Status</div>
        <div className="w-1/6 px-2">Actions</div>
      </div>
      
      {/* List of candidates */}
      {filteredCandidates.length === 0 ? (
        <div className="px-4 py-6 text-center text-gray-500">
          No candidates match the current filters.
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {filteredCandidates.map((candidate) => (
            <li key={candidate.id} className="hover:bg-gray-50">
              <div className="md:flex md:items-center px-4 py-4">
                {/* Avatar */}
                <div className="w-12 flex-shrink-0 mr-4 md:mr-0">
                  {candidate.avatar ? (
                    <img 
                      src={candidate.avatar} 
                      alt={candidate.name}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                  )}
                </div>
                
                {/* Name and Info */}
                <div className="w-full md:w-1/3 px-2 mb-3 md:mb-0">
                  <div className="flex items-center">
                    <Link 
                      to={`/employer/candidates/${candidate.id}?job=${jobId}`}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {candidate.name}
                    </Link>
                    {candidate.isStarred && (
                      <Star className="h-4 w-4 text-yellow-500 ml-1.5" />
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {candidate.title}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1 md:hidden">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(candidate.matchScore)}`}>
                      {candidate.matchScore}% Match
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Applied {formatDate(candidate.applicationDate)}
                    </span>
                  </div>
                </div>
                
                {/* Match Score */}
                <div className="w-1/6 px-2 hidden md:block">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(candidate.matchScore)}`}>
                    {candidate.matchScore}%
                  </span>
                </div>
                
                {/* Application Date */}
                <div className="w-1/6 px-2 text-sm text-gray-500 hidden md:block">
                  {formatDate(candidate.applicationDate)}
                </div>
                
                {/* Status */}
                <div className="w-1/6 px-2 hidden md:block">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    candidate.status === 'reviewed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {candidate.status === 'reviewed' ? (
                      <>
                        <Check className="h-3 w-3 mr-1" /> 
                        Reviewed
                      </>
                    ) : (
                      'Pending Review'
                    )}
                  </span>
                </div>
                
                {/* Actions */}
                <div className="w-full md:w-1/6 px-2 mt-3 md:mt-0 flex md:justify-end">
                  <Link
                    to={`/employer/candidates/${candidate.id}?job=${jobId}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Profile <ChevronRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

CandidateMatchList.propTypes = {
  candidates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      title: PropTypes.string,
      avatar: PropTypes.string,
      matchScore: PropTypes.number.isRequired,
      applicationDate: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['pending', 'reviewed']).isRequired,
      isStarred: PropTypes.bool
    })
  ).isRequired,
  jobId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default CandidateMatchList; 