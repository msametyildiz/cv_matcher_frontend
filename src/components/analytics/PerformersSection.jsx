import React from 'react';

const PerformersSection = ({ title, performers = [], metric = 'Applications' }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      
      {performers.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No data available</div>
      ) : (
        <div className="space-y-4">
          {performers.map((performer, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium mr-3">
                  {performer.initials || performer.name.substring(0, 2)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{performer.name}</h4>
                  <p className="text-sm text-gray-500">{performer.title || performer.position}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{performer.value}</div>
                <div className="text-xs text-gray-500">{metric}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PerformersSection;
