import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Filter, ChevronDown, RefreshCw } from 'lucide-react';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import CandidateCard from '../../components/candidates/CandidateCard';
import SearchFilters from '../../components/candidates/SearchFilters';
import ActiveFilters from '../../components/candidates/ActiveFilters';
import Pagination from '../../components/common/Pagination';
import useSearchFilters from '../../hooks/useSearchFilters';
import usePagination from '../../hooks/usePagination';
import useCandidateSearch from '../../hooks/useCandidateSearch';

const CandidateSearch = () => {
  // Custom hooks for search functionality
  const { 
    searchQuery, setSearchQuery,
    filters, setFilters,
    showAdvancedFilters, setShowAdvancedFilters,
    sortBy, setSortBy,
    handleFilterChange, handleAddSkill, handleRemoveSkill,
    clearFilters, hasActiveFilters
  } = useSearchFilters();
  
  const { 
    page, perPage, totalPages, totalCandidates,
    setPagination, handlePageChange 
  } = usePagination(1, 10, 0);
  
  // Get search results
  const { candidates, loading, error } = useCandidateSearch(
    searchQuery, filters, sortBy, page, perPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Find Candidates</h1>
        <button
          onClick={clearFilters}
          className="btn-outline"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset Filters
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className="pl-10 w-full border border-gray-300 rounded-md"
              placeholder="Search by name, skills, or job title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Location Filter */}
          <div className="relative md:w-64">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="location"
              className="pl-10 w-full border border-gray-300 rounded-md"
              placeholder="Location"
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>
          
          {/* Advanced Filters Toggle */}
          <button
            type="button"
            className="btn-outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {showAdvancedFilters ? 'Hide Filters' : 'More Filters'}
          </button>
        </div>
        
        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <SearchFilters 
            filters={filters}
            handleFilterChange={handleFilterChange}
            handleAddSkill={handleAddSkill}
            handleRemoveSkill={handleRemoveSkill}
          />
        )}
        
        {/* Active Filters */}
        {hasActiveFilters() && (
          <ActiveFilters
            searchQuery={searchQuery}
            filters={filters}
            setSearchQuery={setSearchQuery}
            setFilters={setFilters}
            clearFilters={clearFilters}
          />
        )}
      </div>
      
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            {loading ? 'Searching candidates...' : `${totalCandidates} candidates found`}
          </h2>
          <p className="text-sm text-gray-500">
            Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, totalCandidates)} of {totalCandidates} results
          </p>
        </div>
        
        {/* Sort Options */}
        <div className="mt-2 sm:mt-0 relative">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border-gray-300 rounded-md pr-8"
            >
              <option value="relevance">Relevance</option>
              <option value="recent">Most Recent</option>
              <option value="experience-high">Experience (High to Low)</option>
              <option value="experience-low">Experience (Low to High)</option>
              <option value="match">Match Score</option>
            </select>
            <ChevronDown className="absolute right-2 h-4 w-4 text-gray-400 pointer-events-none" />
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
          <h3 className="text-lg font-medium text-gray-900">No candidates found</h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search criteria or filters to see more results.
          </p>
          {hasActiveFilters() && (
            <button
              onClick={clearFilters}
              className="mt-4 btn-outline"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {candidates.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      
      {/* Tips Section */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-medium text-blue-900">Tips for Finding Great Candidates</h2>
        <ul className="mt-4 space-y-2 text-sm text-blue-700">
          <li className="flex items-start">
            <div className="mr-2 text-blue-500">✓</div>
            <p>Focus on skills rather than just job titles to find candidates with transferable abilities.</p>
          </li>
          <li className="flex items-start">
            <div className="mr-2 text-blue-500">✓</div>
            <p>Consider candidates from adjacent industries who may bring fresh perspectives.</p>
          </li>
          <li className="flex items-start">
            <div className="mr-2 text-blue-500">✓</div>
            <p>Look beyond traditional education backgrounds to find diverse talent.</p>
          </li>
          <li className="flex items-start">
            <div className="mr-2 text-blue-500">✓</div>
            <p>Connect with passive candidates who may not be actively searching but are open to new opportunities.</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CandidateSearch;