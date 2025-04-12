import React from 'react';
import Image from 'next/image';

const LatestNewsSection = () => {
  const newsItems = [
    {
      id: 1,
      title: 'Electric Vehicle Sales Reach Record High',
      excerpt: 'The automotive industry sees unprecedented growth in EV adoption...',
      image: '/images/news/ev-sales.jpg',
      date: 'April 12, 2024',
      category: 'Industry News',
    },
    {
      id: 2,
      title: 'New Safety Features in 2024 Models',
      excerpt: 'Automakers introduce innovative safety technologies...',
      image: '/images/news/safety-features.jpg',
      date: 'April 11, 2024',
      category: 'Technology',
    },
    // Add more news items as needed
  ];

  return (
    <div className="space-y-6">
      {newsItems.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-64">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span>{item.category}</span>
              <span className="mx-2">•</span>
              <span>{item.date}</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-gray-600">{item.excerpt}</p>
            <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium">
              Read More →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LatestNewsSection; 