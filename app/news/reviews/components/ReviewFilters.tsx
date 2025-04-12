import React from 'react';

const ReviewFilters = () => {
  const categories = [
    'All Reviews',
    'Electric Vehicles',
    'Luxury Cars',
    'SUVs',
    'Sports Cars',
    'Family Cars',
  ];

  const priceRanges = [
    'Under $30,000',
    '$30,000 - $50,000',
    '$50,000 - $80,000',
    'Over $80,000',
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-medium mb-3">Category</h3>
          <select className="w-full p-2 border rounded-md">
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="font-medium mb-3">Price Range</h3>
          <select className="w-full p-2 border rounded-md">
            {priceRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="font-medium mb-3">Sort By</h3>
          <select className="w-full p-2 border rounded-md">
            <option value="newest">Newest First</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Apply Filters
        </button>
        <button className="ml-2 text-gray-600 hover:text-gray-800">
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default ReviewFilters; 