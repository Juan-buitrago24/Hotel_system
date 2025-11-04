import React from 'react';

const StatsCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend }) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600 bg-blue-50',
    green: 'bg-green-500 text-green-600 bg-green-50',
    yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50',
    red: 'bg-red-500 text-red-600 bg-red-50',
    purple: 'bg-purple-500 text-purple-600 bg-purple-50',
    orange: 'bg-orange-500 text-orange-600 bg-orange-50',
    indigo: 'bg-indigo-500 text-indigo-600 bg-indigo-50'
  };

  const [bgClass, textClass, lightBgClass] = colorClasses[color].split(' ');

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${lightBgClass}`}>
          <Icon className={`h-6 w-6 ${textClass}`} />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        {subtitle && (
          <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
