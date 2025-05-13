import React from 'react';

export const LanguageItem = ({ language }) => {
  const getProficiencyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'native':
      case 'fluent':
        return 'bg-green-100 text-green-800';
      case 'advanced':
        return 'bg-blue-100 text-blue-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'beginner':
      case 'basic':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex justify-between items-center mb-2">
      <span className="text-gray-800">{language.name}</span>
      <span className={`text-xs px-2 py-1 rounded-full ${getProficiencyColor(language.proficiency)}`}>
        {language.proficiency}
      </span>
    </div>
  );
};

export default LanguageItem;
