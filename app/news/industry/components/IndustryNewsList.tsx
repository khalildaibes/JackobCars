import React from 'react';
import Image from 'next/image';

const IndustryNewsList = () => {
  const newsItems = [
    {
      id: 1,
      title: 'Global Electric Vehicle Market Growth Analysis 2024',
      excerpt: 'The electric vehicle market is projected to grow by 35% in 2024...',
      image: '/images/industry/ev-market.jpg',
      date: 'April 12, 2024',
      category: 'Market Analysis',
      readTime: '5 min read',
    },
    {
      id: 2,
      title: 'New Automotive Manufacturing Technologies',
      excerpt: 'Revolutionary manufacturing processes are transforming car production...',
      image: '/images/industry/manufacturing.jpg',
      date: 'April 11, 2024',
      category: 'Technology',
      readTime: '4 min read',
    },
    {
      id: 3,
      title: 'Automotive Supply Chain Updates',
      excerpt: 'How the industry is adapting to global supply chain challenges...',
      image: '/images/industry/supply-chain.jpg',
      date: 'April 10, 2024',
      category: 'Business',
      readTime: '6 min read',
    },
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
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {item.category}
              </span>
              <span className="mx-2">•</span>
              <span>{item.date}</span>
              <span className="mx-2">•</span>
              <span>{item.readTime}</span>
            </div>
            
            <h2 className="text-2xl font-semibold mb-3">{item.title}</h2>
            <p className="text-gray-600 mb-4">{item.excerpt}</p>
            
            <div className="flex items-center justify-between">
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Read More →
              </button>
              <div className="flex items-center space-x-2">
                <button className="text-gray-500 hover:text-gray-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IndustryNewsList; 