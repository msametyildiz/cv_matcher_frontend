import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const ArrayField = ({
  label,
  name,
  value = [],
  onChange,
  error,
  required = false,
  itemType = 'text',
  itemPlaceholder = 'Enter value',
  addButtonText = 'Add item',
  helpText = '',
  className = ''
}) => {
  const handleItemChange = (index, itemValue) => {
    const newValues = [...value];
    newValues[index] = itemValue;
    onChange({ target: { name, value: newValues } });
  };

  const handleAddItem = () => {
    const newValues = [...value, ''];
    onChange({ target: { name, value: newValues } });
  };

  const handleRemoveItem = (index) => {
    const newValues = value.filter((_, i) => i !== index);
    onChange({ target: { name, value: newValues } });
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={index} className="flex items-center">
            <input
              type={itemType}
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              placeholder={itemPlaceholder}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="ml-2 inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      
      <button
        type="button"
        onClick={handleAddItem}
        className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        {addButtonText}
      </button>
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default ArrayField;
