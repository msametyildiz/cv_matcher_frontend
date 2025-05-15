import React from 'react';
import { PieChart, BarChart } from 'lucide-react';
import PropTypes from 'prop-types';

const MatchScoreCard = ({ matchData, showDetailed = false, className = '' }) => {
  if (!matchData) return null;
  
  const { overallScore, skillsMatch, educationMatch, experienceMatch, recommendations } = matchData;
  
  // Helper to get color class based on score
  const getScoreColorClass = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Helper to get background color class based on score
  const getScoreBgClass = (score) => {
    if (score >= 85) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      {/* Overall Score Header */}
      <div className="bg-gray-50 px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Match Score</h3>
          {!showDetailed && (
            <button 
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              onClick={() => window.location.href = `/matching/details/${matchData.jobId}/${matchData.cvId}`}
            >
              <PieChart className="h-4 w-4 mr-1" />
              View Full Analysis
            </button>
          )}
        </div>
      </div>
      
      {/* Overall Score */}
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col items-center mb-6">
          <div className={`text-4xl font-bold ${getScoreColorClass(overallScore)}`}>
            {overallScore}%
          </div>
          <div className="text-sm text-gray-500 mt-1">Overall Match</div>
        </div>
        
        {/* Score Bars */}
        <div className="space-y-4">
          {/* Skills Score */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Skills</span>
              <span className={`text-sm font-medium ${getScoreColorClass(skillsMatch.score)}`}>
                {skillsMatch.score}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${skillsMatch.score >= 85 ? 'bg-green-600' : skillsMatch.score >= 70 ? 'bg-yellow-500' : 'bg-red-600'}`}
                style={{ width: `${skillsMatch.score}%` }}
              ></div>
            </div>
            {showDetailed && skillsMatch.matched.length > 0 && (
              <div className="mt-2">
                <span className="text-xs font-medium text-gray-500">Matched Skills:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {skillsMatch.matched.map((skill, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {showDetailed && skillsMatch.missing.length > 0 && (
              <div className="mt-2">
                <span className="text-xs font-medium text-gray-500">Missing Skills:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {skillsMatch.missing.map((skill, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Education Score */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Education</span>
              <span className={`text-sm font-medium ${getScoreColorClass(educationMatch.score)}`}>
                {educationMatch.score}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${educationMatch.score >= 85 ? 'bg-green-600' : educationMatch.score >= 70 ? 'bg-yellow-500' : 'bg-red-600'}`}
                style={{ width: `${educationMatch.score}%` }}
              ></div>
            </div>
            {showDetailed && educationMatch.missing.length > 0 && (
              <div className="mt-2 text-xs text-gray-700">
                <p>Education requirements not fully met.</p>
              </div>
            )}
          </div>
          
          {/* Experience Score */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Experience</span>
              <span className={`text-sm font-medium ${getScoreColorClass(experienceMatch.score)}`}>
                {experienceMatch.score}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${experienceMatch.score >= 85 ? 'bg-green-600' : experienceMatch.score >= 70 ? 'bg-yellow-500' : 'bg-red-600'}`}
                style={{ width: `${experienceMatch.score}%` }}
              ></div>
            </div>
            {showDetailed && (
              <div className="mt-2 text-xs text-gray-700">
                <p>{experienceMatch.details}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Recommendations */}
        {showDetailed && recommendations && recommendations.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <BarChart className="h-4 w-4 mr-1 text-blue-600" />
              Recommendations
            </h4>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="text-sm">
                  <div className={`p-2 rounded ${getScoreBgClass(rec.category === 'skills' ? skillsMatch.score : rec.category === 'education' ? educationMatch.score : experienceMatch.score)}`}>
                    {rec.text}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

MatchScoreCard.propTypes = {
  matchData: PropTypes.shape({
    overallScore: PropTypes.number.isRequired,
    skillsMatch: PropTypes.object.isRequired,
    educationMatch: PropTypes.object.isRequired,
    experienceMatch: PropTypes.object.isRequired,
    recommendations: PropTypes.array,
    jobId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cvId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }).isRequired,
  showDetailed: PropTypes.bool,
  className: PropTypes.string
};

export default MatchScoreCard; 