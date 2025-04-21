import React from 'react';
import Image from 'next/image';

const ReviewList = () => {
  const reviews = [
    {
      id: 1,
      carName: '2024 Tesla Model S',
      rating: 4.8,
      review: 'The Tesla Model S continues to set the standard for electric luxury sedans...',
      image: '/images/reviews/tesla-model-s.jpg',
      author: 'John Smith',
      date: 'April 10, 2024',
      pros: ['Excellent range', 'Superb acceleration', 'Advanced tech features'],
      cons: ['Expensive', 'Limited service network'],
    },
    {
      id: 2,
      carName: '2024 BMW i4',
      rating: 4.6,
      review: 'BMW\'s first dedicated electric sedan impresses with its performance...',
      image: '/images/reviews/bmw-i4.jpg',
      author: 'Sarah Johnson',
      date: 'April 8, 2024',
      pros: ['Luxurious interior', 'Great handling', 'Fast charging'],
      cons: ['Limited rear space', 'Premium price tag'],
    },
  ];

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-64">
            <Image
              src={review.image}
              alt={review.carName}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">{review.carName}</h2>
              <div className="flex items-center">
                <span className="text-yellow-400 text-xl">★</span>
                <span className="ml-1 font-medium">{review.rating}</span>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span>By {review.author}</span>
              <span className="mx-2">•</span>
              <span>{review.date}</span>
            </div>
            
            <p className="text-gray-600 mb-4">{review.review}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-blue-600 mb-2">Pros</h4>
                <ul className="list-disc list-inside text-gray-600">
                  {review.pros.map((pro, index) => (
                    <li key={index}>{pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-red-600 mb-2">Cons</h4>
                <ul className="list-disc list-inside text-gray-600">
                  {review.cons.map((con, index) => (
                    <li key={index}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              Read Full Review →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList; 