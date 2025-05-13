import React from 'react';

const ExperienceItem = ({ experience }) => {
  if (!experience) return null;

  return (
    <div className="relative pb-6">
      {/* Timeline dot */}
      <div className="absolute top-0 left-0 w-3 h-3 rounded-full bg-blue-500 mt-1.5"></div>
      
      {/* Timeline line */}
      <div className="absolute top-0 left-1.5 w-px h-full bg-gray-200"></div>
      
      {/* Content */}
      <div className="ml-8">
        <h3 className="text-md font-medium text-gray-900">{experience.title}</h3>
        <div className="text-sm font-medium text-gray-600">{experience.company}</div>
        <div className="text-xs text-gray-500 mt-1">{experience.period}</div>
        {experience.description && (
          <p className="mt-2 text-sm text-gray-600">{experience.description}</p>
        )}
        
        {experience.skills && experience.skills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {experience.skills.map((skill, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceItem;
