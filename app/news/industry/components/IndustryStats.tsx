import React from 'react';

const IndustryStats = () => {
  const stats = [
    {
      title: 'Global EV Sales',
      value: '14.2M',
      change: '+35%',
      changeType: 'positive',
      period: '2024 Q1',
    },
    {
      title: 'Market Value',
      value: '$2.8T',
      change: '+12%',
      changeType: 'positive',
      period: '2024 Q1',
    },
    {
      title: 'New Models',
      value: '48',
      change: '+20%',
      changeType: 'positive',
      period: '2024 Q1',
    },
    {
      title: 'Investment',
      value: '$120B',
      change: '+25%',
      changeType: 'positive',
      period: '2024 Q1',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Industry Statistics</h3>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.title} className="border-b pb-4 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm text-gray-600">{stat.title}</h4>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
              <div className="text-right">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <p className="text-xs text-gray-500">{stat.period}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndustryStats; 