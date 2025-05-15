// Matching Algorithm for CV Matcher
// This utility provides functions to match CVs against job requirements

import { MATCHING } from './constants';

/**
 * Calculate match score between a CV and a job
 * @param {Object} cv - The candidate's CV data
 * @param {Object} job - The job data
 * @returns {Object} - Match results with score and details
 */
export const calculateMatchScore = (cv, job) => {
  if (!cv || !job) return { score: 0, details: {} };

  // Initialize scoring categories
  const details = {
    skills: { score: 0, matched: [], missing: [] },
    education: { score: 0, matched: [], missing: [] },
    experience: { score: 0, details: '' },
    overall: 0
  };

  // Skills matching (highest weight in scoring)
  if (cv.parsedData?.skills && job.skills) {
    const skillMatches = matchSkills(cv.parsedData.skills, job.skills);
    details.skills = skillMatches;
  }

  // Education matching
  if (cv.parsedData?.education && job.requirements) {
    details.education = matchEducation(cv.parsedData.education, job.requirements);
  }

  // Experience matching
  if (cv.parsedData?.experience && job.requirements) {
    details.experience = matchExperience(cv.parsedData.experience, job.requirements);
  }

  // Calculate overall score with weighted categories
  const weights = {
    skills: 0.6,     // Skills are most important
    education: 0.2,  // Education is moderately important
    experience: 0.2  // Experience is also moderately important
  };

  details.overall = Math.round(
    (details.skills.score * weights.skills) +
    (details.education.score * weights.education) +
    (details.experience.score * weights.experience)
  );

  return {
    score: details.overall,
    details: details
  };
};

/**
 * Match skills from CV against job requirements
 * @param {Array} cvSkills - Skills from CV
 * @param {Array} jobSkills - Skills from job posting
 * @returns {Object} - Skills matching results
 */
const matchSkills = (cvSkills, jobSkills) => {
  const normalizedCvSkills = cvSkills.map(skill => skill.toLowerCase());
  const normalizedJobSkills = jobSkills.map(skill => skill.toLowerCase());
  
  const matched = [];
  const missing = [];
  
  normalizedJobSkills.forEach(jobSkill => {
    // Look for exact matches
    const exactMatch = normalizedCvSkills.find(cvSkill => cvSkill === jobSkill);
    
    if (exactMatch) {
      matched.push(jobSkill);
      return;
    }
    
    // Look for partial matches (e.g., "JavaScript" matches "JavaScript (React)")
    const partialMatch = normalizedCvSkills.find(cvSkill => 
      cvSkill.includes(jobSkill) || jobSkill.includes(cvSkill)
    );
    
    if (partialMatch && partialMatch.length > 3) { // Avoid matching very short strings
      matched.push(jobSkill);
      return;
    }
    
    missing.push(jobSkill);
  });
  
  // Calculate score based on percentage of matched skills
  const score = Math.round((matched.length / normalizedJobSkills.length) * 100);
  
  return {
    score,
    matched,
    missing
  };
};

/**
 * Match education from CV against job requirements
 * @param {Array} education - Education history from CV
 * @param {Array} requirements - Job requirements
 * @returns {Object} - Education matching results
 */
const matchEducation = (education, requirements) => {
  // Look for education requirements in job
  const educationRequirements = requirements.filter(req => 
    req.toLowerCase().includes('degree') || 
    req.toLowerCase().includes('bachelor') || 
    req.toLowerCase().includes('master') ||
    req.toLowerCase().includes('phd') ||
    req.toLowerCase().includes('education')
  );
  
  if (educationRequirements.length === 0) {
    // No specific education requirements
    return { score: 100, matched: [], missing: [] };
  }
  
  const matched = [];
  const missing = [];
  
  // Simple keyword matching
  educationRequirements.forEach(req => {
    const reqLower = req.toLowerCase();
    const foundMatch = education.some(edu => {
      const degreeStr = (edu.degree || '').toLowerCase();
      return degreeStr.includes('bachelor') && reqLower.includes('bachelor') ||
             degreeStr.includes('master') && reqLower.includes('master') ||
             degreeStr.includes('phd') && reqLower.includes('phd') ||
             degreeStr.includes(reqLower);
    });
    
    if (foundMatch) {
      matched.push(req);
    } else {
      missing.push(req);
    }
  });
  
  const score = educationRequirements.length === 0 ? 100 : 
    Math.round((matched.length / educationRequirements.length) * 100);
  
  return {
    score,
    matched,
    missing
  };
};

/**
 * Match experience from CV against job requirements
 * @param {Array} experience - Work experience from CV
 * @param {Array} requirements - Job requirements
 * @returns {Object} - Experience matching results
 */
const matchExperience = (experience, requirements) => {
  // Extract years of experience requirements
  const experienceRequirements = requirements.filter(req => 
    req.toLowerCase().includes('year') && 
    req.toLowerCase().includes('experience')
  );
  
  if (experienceRequirements.length === 0) {
    // No specific experience requirements in years
    return { score: 75, details: 'No specific experience requirements found' };
  }
  
  // Try to extract required years
  let requiredYears = 0;
  for (const req of experienceRequirements) {
    const yearsMatch = req.match(/(\d+)(?:\+)?\s*(?:-\s*\d+)?\s*years?/i);
    if (yearsMatch && yearsMatch[1]) {
      requiredYears = parseInt(yearsMatch[1], 10);
      break;
    }
  }
  
  // Calculate candidate's years of experience (simplified)
  const totalExperience = experience.reduce((total, job) => {
    if (job.period) {
      // Try to extract years from period string
      const years = job.period.match(/(\d+)\s*years?/i);
      if (years && years[1]) {
        return total + parseInt(years[1], 10);
      }
      
      // Alternative: try to calculate from date range
      const dates = job.period.match(/(\d{4})\s*-\s*(\d{4}|present)/i);
      if (dates) {
        const startYear = parseInt(dates[1], 10);
        const endYear = dates[2].toLowerCase() === 'present' ? 
          new Date().getFullYear() : parseInt(dates[2], 10);
        return total + (endYear - startYear);
      }
    }
    return total + 1; // Default to 1 year if we can't parse
  }, 0);
  
  // Calculate score based on experience
  let score = 0;
  let details = '';
  
  if (requiredYears === 0) {
    score = 75; // Default score when no specific years required
    details = `Candidate has ${totalExperience} years of experience`;
  } else if (totalExperience >= requiredYears) {
    // Exceeding requirements is good
    score = 100;
    details = `Candidate has ${totalExperience} years of experience (${requiredYears} required)`;
  } else {
    // Partial credit for some experience
    score = Math.round((totalExperience / requiredYears) * 100);
    details = `Candidate has ${totalExperience} years of experience (${requiredYears} required)`;
  }
  
  return {
    score,
    details
  };
};

/**
 * Get comprehensive matching report for CV and job
 * @param {Object} cv - The candidate's CV data
 * @param {Object} job - The job data
 * @returns {Object} - Detailed matching report
 */
export const getMatchingReport = (cv, job) => {
  const matchResult = calculateMatchScore(cv, job);
  
  return {
    overallScore: matchResult.score,
    skillsMatch: matchResult.details.skills,
    educationMatch: matchResult.details.education,
    experienceMatch: matchResult.details.experience,
    recommendations: generateRecommendations(matchResult.details)
  };
};

/**
 * Generate recommendations based on matching results
 * @param {Object} matchDetails - The detailed matching results
 * @returns {Array} - List of recommendations
 */
const generateRecommendations = (matchDetails) => {
  const recommendations = [];
  
  // Skills recommendations
  if (matchDetails.skills.missing && matchDetails.skills.missing.length > 0) {
    recommendations.push({
      category: 'skills',
      text: `Consider adding these skills to your CV: ${matchDetails.skills.missing.join(', ')}`
    });
  }
  
  // Education recommendations
  if (matchDetails.education.missing && matchDetails.education.missing.length > 0) {
    recommendations.push({
      category: 'education',
      text: `Your education may not fully match the requirements: ${matchDetails.education.missing.join(', ')}`
    });
  }
  
  // Experience recommendations
  if (matchDetails.experience.score < 70) {
    recommendations.push({
      category: 'experience',
      text: matchDetails.experience.details
    });
  }
  
  return recommendations;
}; 