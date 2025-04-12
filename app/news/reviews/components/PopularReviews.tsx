import React from 'react';
import Image from 'next/image';

const PopularReviews = () => {
  const popularReviews = [
    {
      id: 1,
      carName: '2024 Porsche Taycan',
      rating: 4.9,
      image: '/images/reviews/porsche-taycan.jpg',
      views: '3.2k',
    },
    {
      id: 2,
      carName: '2024 Mercedes EQS',
      rating: 4.7,
      image: '/images/reviews/mercedes-eqs.jpg',
      views: '2.8k',
    },
    {
      id: 3,
      carName: '2024 Ford Mustang Mach-E',
      rating: 4.5,
      image: '/images/reviews/ford-mach-e.jpg',
      views: '2.5k',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Popular Reviews</h3>
      <div className="space-y-4">
        {popularReviews.map((review) => (
          <div key={review.id} className="flex items-start space-x-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <Image
                src={review.image}
                alt={review.carName}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 hover:text-blue-600">
                {review.carName}
              </h4>
              <div className="flex items-center mt-1">
                <span className="text-yellow-400">★</span>
                <span className="ml-1 text-sm text-gray-600">{review.rating}</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-sm text-gray-500">{review.views} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularReviews; 