import React from 'react';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder = '',
  required = false,
  disabled = false,
  className = '',
  options = [],
  helpText = '',
  autoComplete = 'on',
  min,
  max,
  step,
  rows = 3
}) => {
  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${error ? 'border-red-300' : ''} ${className}`}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            rows={rows}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${error ? 'border-red-300' : ''} ${className}`}
          />
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              id={name}
              name={name}
              type="checkbox"
              checked={value || false}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              required={required}
              className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${error ? 'border-red-300' : ''} ${className}`}
            />
            <label htmlFor={name} className="ml-2 block text-sm text-gray-700">
              {label}
            </label>
          </div>
        );
      
      case 'radio':
        return (
          <div className="mt-1 space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  id={`${name}-${option.value}`}
                  name={name}
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  onBlur={onBlur}
                  disabled={disabled}
                  required={required}
                  className={`h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 ${error ? 'border-red-300' : ''} ${className}`}
                />
                <label htmlFor={`${name}-${option.value}`} className="ml-2 block text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
      
      // Default case handles text, email, password, number, date, etc.
      default:
        return (
          <input
            id={name}
            name={name}
            type={type}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            autoComplete={autoComplete}
            min={min}
            max={max}
            step={step}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${error ? 'border-red-300' : ''} ${className}`}
          />
        );
    }
  };

  return (
    <div className={`mb-4 ${type === 'checkbox' ? '' : ''}`}>
      {type !== 'checkbox' && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {renderInput()}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;
