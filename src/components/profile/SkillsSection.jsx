import React from 'react';

export const SkillsSection = ({ skills }) => {
  if (!skills || skills.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <span 
          key={index} 
          className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
        >
          {skill}
        </span>
      ))}
    </div>
  );
};

export default SkillsSection;
