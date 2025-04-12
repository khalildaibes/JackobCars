import React from 'react';

const IndustryTrends = () => {
  const trends = [
    {
      title: 'Electric Vehicle Adoption',
      description: 'Rapid growth in EV market share',
      trend: 'up',
      percentage: 35,
    },
    {
      title: 'Autonomous Driving',
      description: 'Increasing investment in self-driving tech',
      trend: 'up',
      percentage: 28,
    },
    {
      title: 'Sustainable Materials',
      description: 'Shift towards eco-friendly manufacturing',
      trend: 'up',
      percentage: 42,
    },
    {
      title: 'Digital Showrooms',
      description: 'Growth in virtual car buying experiences',
      trend: 'up',
      percentage: 55,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Industry Trends</h3>
      <div className="space-y-4">
        {trends.map((trend) => (
          <div key={trend.title} className="border-b pb-4 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{trend.title}</h4>
                <p className="text-sm text-gray-600">{trend.description}</p>
              </div>
              <div className="flex items-center">
                <span className="text-green-600 font-medium">+{trend.percentage}%</span>
                <svg
                  className="w-5 h-5 text-green-600 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${trend.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndustryTrends; 