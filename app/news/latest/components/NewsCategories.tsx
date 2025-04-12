import React from 'react';

const NewsCategories = () => {
  const categories = [
    { name: 'Industry News', count: 24 },
    { name: 'Technology', count: 18 },
    { name: 'Reviews', count: 32 },
    { name: 'Electric Vehicles', count: 15 },
    { name: 'Safety', count: 12 },
    { name: 'Market Trends', count: 20 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Categories</h3>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.name}>
            <a
              href="#"
              className="flex justify-between items-center text-gray-700 hover:text-blue-600"
            >
              <span>{category.name}</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                {category.count}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsCategories; 