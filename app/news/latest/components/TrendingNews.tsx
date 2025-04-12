import React from 'react';
import Image from 'next/image';

const TrendingNews = () => {
  const trendingNews = [
    {
      id: 1,
      title: 'Top 10 Electric Cars of 2024',
      image: '/images/news/trending-1.jpg',
      views: '2.4k',
    },
    {
      id: 2,
      title: 'Autonomous Driving: The Future is Here',
      image: '/images/news/trending-2.jpg',
      views: '1.8k',
    },
    {
      id: 3,
      title: 'New Car Buying Guide 2024',
      image: '/images/news/trending-3.jpg',
      views: '1.5k',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Trending Now</h3>
      <div className="space-y-4">
        {trendingNews.map((news) => (
          <div key={news.id} className="flex items-start space-x-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <Image
                src={news.image}
                alt={news.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 hover:text-blue-600">
                {news.title}
              </h4>
              <p className="text-sm text-gray-500">{news.views} views</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingNews; 