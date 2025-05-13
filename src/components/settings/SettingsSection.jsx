import React, { useState } from 'react';

const SettingsSection = ({ 
  title, 
  description, 
  icon,
  children, 
  settings = [], 
  onSettingChange,
  expanded = true,
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const renderSettingInput = (setting) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <div className="relative inline-block w-10 mr-2 align-middle select-none">
            <input 
              type="checkbox" 
              id={setting.id} 
              checked={setting.value} 
              onChange={(e) => onSettingChange(setting.id, e.target.checked)}
              className="sr-only"
            />
            <label 
              htmlFor={setting.id}
              className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
            >
              <span 
                className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${setting.value ? 'translate-x-4' : 'translate-x-0'}`}
              />
            </label>
          </div>
        );
      
      case 'select':
        return (
          <select
            id={setting.id}
            value={setting.value}
            onChange={(e) => onSettingChange(setting.id, e.target.value)}
            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {setting.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'text':
        return (
          <input
            type="text"
            id={setting.id}
            value={setting.value}
            onChange={(e) => onSettingChange(setting.id, e.target.value)}
            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder={setting.placeholder}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            id={setting.id}
            value={setting.value}
            onChange={(e) => onSettingChange(setting.id, parseFloat(e.target.value))}
            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            min={setting.min}
            max={setting.max}
            step={setting.step || 1}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 mb-6 ${className}`}>
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          {icon && <div className="mr-3 text-gray-500">{icon}</div>}
          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          </div>
        </div>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-500"
        >
          <svg 
            className={`h-5 w-5 transform ${isExpanded ? 'rotate-180' : ''} transition-transform duration-200`} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-6 space-y-6">
          {children || settings.map((setting) => (
            <div key={setting.id} className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
              <label 
                htmlFor={setting.id} 
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                {setting.label}
                {setting.help && (
                  <p className="mt-1 text-sm text-gray-500">{setting.help}</p>
                )}
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                {renderSettingInput(setting)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SettingsSection;
