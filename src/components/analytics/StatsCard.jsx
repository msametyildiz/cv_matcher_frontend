import React from 'react';

const StatsCard = ({ title, value, icon, change, changeType = 'increase', period = 'vs last month' }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        {icon && <div className="p-2 rounded-full bg-gray-100">{icon}</div>}
      </div>
      
      <div className="mt-2">
        <div className="text-3xl font-bold">{value}</div>
        {change && (
          <div className={`mt-1 text-sm flex items-center ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
            <span>{change}%</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={changeType === 'increase' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
            </svg>
            <span className="text-gray-500 ml-1">{period}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
