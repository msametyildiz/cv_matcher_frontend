import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const AboutSection = ({ about }) => {
  // Always declare hooks at the top level, before any conditional returns
  const [expanded, setExpanded] = useState(false);
  
  // Early return after hooks are declared
  if (!about) return null;
  
  const MAX_LENGTH = 250;
  const shouldTruncate = typeof about === 'string' && about.length > MAX_LENGTH;
  
  const displayText = shouldTruncate && !expanded 
    ? `${about.substring(0, MAX_LENGTH)}...` 
    : about;
    
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="mt-6 prose max-w-none">
      <h3 className="text-sm font-medium text-gray-500 mb-2">About</h3>
      {typeof about === 'string' ? (
        <p className="text-gray-700 whitespace-pre-line">{displayText}</p>
      ) : (
        <>
          {Array.isArray(about) && about.map((paragraph, index) => (
            <p key={index} className="text-gray-700 whitespace-pre-line">{paragraph}</p>
          ))}
        </>
      )}
      
      {shouldTruncate && (
        <button 
          onClick={toggleExpanded}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Read more
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default AboutSection;
